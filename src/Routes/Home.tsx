import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchImage, fetchMovies, IfetchMovies } from "../api";

const Wrapper = styled.div`
  background-color: black;
  height: 200vh;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 32px;
  width: 50%;
`;

function Home() {
  const { data, isLoading } = useQuery<IfetchMovies>(
    ["movies", "nowPlaying"],
    fetchMovies
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner bgPhoto={fetchImage(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>{" "}
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
