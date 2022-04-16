import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  fetchImage,
  fetchMovies,
  fetchTV,
  IFetchMovies,
  IFetchTV,
} from "../api";
import { fixedState } from "../atoms";
import MovieContentsModal from "./MovieContentsModal";

export const Carousel = styled.div`
  /* grid-template-columns: 4% auto 4%; */
  position: relative;
  width: 100%;
  top: -100px;
`;

// ######### Button ##################################################################################################
const PrevContent = styled.div`
  position: absolute;
  width: 4%;
  height: 200px;
  left: 0px;
  display: flex;
  z-index: 99;
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
  z-index: 99;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
`;
// ###################################################################################################################
const ContentsRow = styled(motion.div)<{ offSet: string }>`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${(props) => props.offSet}, 1fr);
  position: absolute;
  gap: 5px;
`;

// const ContentsRow = styled(motion.div)`
//   display: grid;
//   width: 100%;
//   grid-template-columns: repeat(6, 1fr);
//   position: absolute;
//   gap: 5px;
// `;

const Shade = styled(motion.div)`
  z-index: 10;
  position: absolute;
  background-color: #252525;
  height: 200px;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

export const Box = styled(motion.div)<{ bgPhoto: string }>`
  z-index: 11;
  background-color: #252525;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  position: relative;
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
  margin-left: 20px;
  padding: 10px;
  font-size: 36px;
`;

export const BoxInfo = styled(motion.div)`
  position: relative;
  /* position: absolute; */

  /* Box 컴포넌트의 높이를 가져오자 */
  top: 150px;
  /* background-color: ${(props) => props.theme.black.lighter};*/
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 70.71%);
  opacity: 0;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: end;
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
    zIndex: 100,
    scale: 1.5,
    borderRadius: 5,
    y: -50,
    // borderRadius: 10,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
  end: {
    transition: {
      scale: 10.2,
      duration: 0.5,
    },
  },
};

// decrease 용 애니메이션 추가로 설정하기
const rowVariants: Variants = {
  enter: (isBack: boolean) => ({
    x: isBack ? -window.innerWidth - 5 : window.innerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.innerWidth + 5 : -window.innerWidth - 5,
  }),
};
const infoVariants: Variants = {
  hover: {
    opacity: 1,
  },
};

interface ISlider {
  option: string;
}

function MovieSlider({ option }: ISlider) {
  let [offset, setOffset] = useState(6);

  const setFixed = useSetRecoilState(fixedState);

  // if TV or Movie
  const { data, isLoading } = useQuery<IFetchMovies>(["movies", option], () =>
    fetchMovies(option)
  );

  const modalMatch = useRouteMatch<{ movieId: string }>(
    `/movies/${option}/:movieId`
  );
  const history = useHistory();

  // 그냥 toggleLeaving으로 통일해도 문제 없을 듯?
  const [modalClicked, setModalClicked] = useState(false);
  const toggleModalClicked = () => setModalClicked((prev) => !prev);
  //

  const modalClick = (movieId: number) => {
    toggleModalClicked();
    setFixed(true);
    history.push(`/movies/${option}/${movieId}`);
  };

  const matchedMovie =
    modalMatch?.params.movieId &&
    data?.results.find(
      (movie: any) => String(movie.id) == modalMatch.params.movieId
    );

  // console.log(option + modalMatch?.params.movieId == option + String(movie?.id));
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setIsBack(false);
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setIsBack(true);
      toggleLeaving();
      const totalMovies = data?.results.length - 1; // 메인 영화 1개 빼고
      const maxIndex = Math.floor(totalMovies / offset) - 1; // 실수가 나올 수 도 있으니 무조건 내림 처리 (추가 1 ~ 2개 영화 안보이기)
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  useEffect(() => {
    const setResponsiveOffset = () => {
      if (window.innerWidth < 600) {
        setOffset(3);
      } else if (window.innerWidth <= 800) {
        setOffset(4);
      } else if (window.innerWidth < 1000) {
        setOffset(5);
      } else if (window.innerWidth > 1000) {
        setOffset(6);
      }
    };
    // resize 이벤트 리스너 추가해서 실시간으로 반응형 웹 만들기

    window.addEventListener("resize", setResponsiveOffset);

    // 항상 이벤트 리스너를 리턴해서 메모리 누수를 막아야한다.
    return () => window.removeEventListener("resize", setResponsiveOffset);
  }, []);
  return (
    <Wrapper>
      <SliderTitle>{option.toUpperCase().replace("_", " ")}</SliderTitle>
      <Carousel>
        <AnimatePresence
          custom={isBack}
          initial={false}
          onExitComplete={toggleLeaving}
        >
          <PrevContent onClick={decreaseIndex}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              fill="white"
            >
              <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
            </svg>
          </PrevContent>
          <ContentsRow
            variants={rowVariants}
            custom={isBack}
            initial="enter"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
            offSet={offset + ""}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => {
                const url = fetchImage(movie.backdrop_path, "w500");
                return (
                  <>
                    <Box
                      key={option + movie.id}
                      id={option + String(movie.id)}
                      bgPhoto={url}
                      onClick={() => modalClick(movie.id)}
                      whileHover="hover"
                      initial="normal"
                      exit="end"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                    >
                      <Shade
                        // bgPhoto={fetchImage(movie.backdrop_path, "w500")}
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        layoutId={option + String(movie.id)}
                      />
                      <BoxInfo variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </BoxInfo>
                    </Box>
                  </>
                );
              })}
          </ContentsRow>
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
      {matchedMovie && (
        <MovieContentsModal
          contentID={matchedMovie.id}
          option={option}
          matchedContents={matchedMovie}
        />
      )}
    </Wrapper>
  );
}

export default MovieSlider;
