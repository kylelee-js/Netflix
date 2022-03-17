import {
  AnimatePresence,
  motion,
  MotionValue,
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
  width: 100%;
  top: -100px;
`;
const Overlay = styled(motion.div)`
  z-index: 1000;
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
`;

const Modal = styled(motion.div)<{ scrollY: MotionValue<number> }>`
  z-index: 1001;
  border-radius: 15px;
  overflow: hidden;
  top: ${(props) => props.scrollY.get() + 100}px;
  position: absolute;
  width: 60vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
`;

const ModalCover = styled.div`
  width: 100%;
  background-position: center center;
  background-size: cover !important;
  height: 400px;
  background: linear-gradient(
    to top,
    ${(props) => props.theme.black.darker},
    rgba(0, 0, 0, 0)
  );
`;

const ModalTitle = styled.h3`
  position: relative;
  font-size: 40px;
  color: ${(props) => props.theme.white.lighter};
  top: -200px;
  padding: 40px;
`;
const ModalOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  width: 65%;
  color: ${(props) => props.theme.white.lighter};
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
export const ContentsRow = styled(motion.div)`
  display: grid;
  width: 100%;
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

let offset = 6;

interface ISlider {
  option: string;
}
function Slider({ option }: ISlider) {
  const { data, isLoading } = useQuery<IfetchMovies>(["movies", option], () =>
    fetchMovies(option)
  );
  console.log(option);
  const modalMatch = useRouteMatch<{ movieId: string }>(
    `/movies/${option}/:movieId`
  );
  const history = useHistory();
  const modalClick = (movieId: number) => {
    history.push(`/movies/${option}/${movieId}`);
  };

  const { scrollY } = useViewportScroll();

  const matchedMovie =
    modalMatch?.params.movieId &&
    data?.results.find(
      (movie: any) => String(movie.id) == modalMatch.params.movieId
    );
  console.log(matchedMovie);
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

  const onOverlayClick = () => {
    history.push("/");
  };
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
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  key={option + movie.id}
                  layoutId={option + String(movie.id)}
                  id={option + String(movie.id)}
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

      <AnimatePresence>
        {modalMatch && (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <Modal
              scrollY={scrollY}
              layoutId={option + modalMatch.params.movieId}
              id={option + modalMatch.params.movieId}
            >
              {matchedMovie && (
                <>
                  <ModalCover
                    style={{
                      backgroundImage: `linear-gradient(to top, #181818, transparent 70.71%), url(${fetchImage(
                        matchedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <ModalTitle>{matchedMovie.title}</ModalTitle>

                  <ModalOverview>{matchedMovie.overview}</ModalOverview>
                </>
              )}
            </Modal>
          </>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Slider;
