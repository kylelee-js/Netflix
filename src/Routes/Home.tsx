import { useEffect } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { fetchImage, fetchMovies, IFetchMovies } from "../api";
import { fixedState, searchOpenState } from "../atoms";
import Footer from "../Components/Footer";
import MovieSlider from "../Components/MovieSlider";
import Slider from "../Components/MovieSlider";

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
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  line-height: 1em;
  max-height: 4em;
`;

const SliderContainer = styled.div`
  display: grid;

  grid-template-rows: repeat(3, 350px);
`;

// ######### Components ##############################################################################################################

function Home() {
  const [fixed, setFixed] = useRecoilState(fixedState);
  const { data, isLoading } = useQuery<IFetchMovies>(
    ["movies", "nowPlaying"],
    () => fetchMovies("now_playing")
  );
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);

  return (
    <Wrapper
      id="HomeWrapper"
      onClick={() => setSearchOpen(false)}
      // style={
      //   fixed
      //     ? {
      //         position: "fixed",
      //         top: `-${window.scrollY}px`,
      //         width: "100%",
      //       }
      //     : { position: "static" }
      // }
    >
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner bgPhoto={fetchImage(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>{" "}
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <MovieSlider option="now_playing" />
            <MovieSlider option="top_rated" />
            <MovieSlider option="upcoming" />
          </SliderContainer>
        </>
      )}

      <Footer />
    </Wrapper>
  );
}

export default Home;
