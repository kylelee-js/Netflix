import { AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { fetchImage, fetchSearchResult, IFetchSearch } from "../api";
import Slider, {
  Box,
  BoxInfo,
  Carousel,
  ContentsRow,
} from "../Components/Slider";

const Banner = styled.div`
  width: 100%;
  height: 20vh;
  background-color: red;
`;

const Title = styled.h2`
  font-size: 40px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 150px 300px;
`;

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.5,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

// decrease 용 애니메이션 추가로 설정하기
const rowVariants: Variants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
};
const infoVariants: Variants = {
  hover: {
    opacity: 1,
  },
};

const offset = 6;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IFetchSearch>(["search", "multi"], () =>
    fetchSearchResult(keyword + "")
  );
  const [index, setIndex] = useState(0);
  const history = useHistory();
  const modalClick = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <>
      <Banner />
      <Wrapper>
        <Title>Search Results</Title>
        <Carousel>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <ContentsRow
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {data?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie) => (
                  <Box
                    key={movie.id}
                    layoutId={movie.id + ""}
                    onClick={() => modalClick(movie.id)}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    bgPhoto={fetchImage(movie.backdrop_path, "w500")}
                  >
                    <BoxInfo variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </BoxInfo>
                  </Box>
                ))}
            </ContentsRow>
          </AnimatePresence>
        </Carousel>
      </Wrapper>
    </>
  );
}

export default Search;
