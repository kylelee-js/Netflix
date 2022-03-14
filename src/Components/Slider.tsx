import {
  AnimatePresence,
  motion,
  useViewportScroll,
  Variants,
} from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { fetchImage, fetchMovies, IfetchMovies } from "../api";
import ContentsModal from "./ContentsModal";

export const Carousel = styled.div`
  /* grid-template-columns: 4% auto 4%; */
  position: relative;
  top: -100px;
`;

// ######### Button ##################################################################################################
const PrevContent = styled.div`
  position: absolute;
  width: 4%;
  height: 200px;
  left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
`;
const NextContent = styled.div`
  position: absolute;
  width: 4%;
  height: 200px;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
`;
// ###################################################################################################################
export const ContentsRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  gap: 5px;
`;

export const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const SliderTitle = styled.div`
  padding: 10px;
  font-size: 36px;
`;

export const BoxInfo = styled(motion.div)`
  position: relative;
  /* position: absolute; */

  /* Box 컴포넌트의 높이를 가져오자 */
  top: 200px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;

  width: 100%;
  h4 {
    text-align: center;
    font-size: 18px;
  }
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

let offset = 6;

interface ISlider {
  option: string;
}
function Slider({ option }: ISlider) {
  const { data, isLoading } = useQuery<IfetchMovies>(["movies", option], () =>
    fetchMovies(option)
  );

  const modalMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const history = useHistory();
  const modalClick = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const matchedMovie =
    modalMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +modalMatch.params.movieId);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev - 1));
    }
  };
  return (
    <Wrapper>
      <SliderTitle>{option.toUpperCase().replace("_", " ")}</SliderTitle>
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
          {index !== 0 && (
            <PrevContent onClick={decreaseIndex}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                fill="white"
              >
                <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
              </svg>
            </PrevContent>
          )}
          <NextContent onClick={increaseIndex}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              fill="white"
            >
              <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
            </svg>
          </NextContent>
        </AnimatePresence>
      </Carousel>
      <ContentsModal matchedMovie={matchedMovie} />
    </Wrapper>
  );
}

export default Slider;
