import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { fetchImage, fetchTV, IFetchTV } from "../api";
import { fixedState } from "../atoms";
import SliderBox from "./SliderBox";
import {
  NextContent,
  ContentsRow,
  PrevContent,
  SliderTitle,
  Carousel,
} from "./Styled-Components/Styles";
import TVModal from "./TVModal";

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

function TVSlider({ option }: ISlider) {
  let [offset, setOffset] = useState(6);

  const setFixed = useSetRecoilState(fixedState);

  // if TV or Movie
  const { data, isLoading } = useQuery<IFetchTV>(["tv", option], () =>
    fetchTV(option)
  );

  // 지금 data에 우리의 id랑 맞는 컨텐츠가 없기 때문에 matchedTV가 undefined여서 모달창이 꺼짐

  const modalMatch = useRouteMatch<{ tvId: string }>(`/tv/${option}/:tvId`);
  const history = useHistory();

  // 그냥 toggleLeaving으로 통일해도 문제 없을 듯?
  const [modalClicked, setModalClicked] = useState(false);
  const toggleModalClicked = () => setModalClicked((prev) => !prev);
  //

  const modalClick = (tvId: number) => {
    toggleModalClicked();
    setFixed(true);
    history.push(`/tv/${option}/${tvId}`);
  };

  const matchedTV =
    modalMatch?.params.tvId &&
    data?.results.find(
      (movie: any) => String(movie.id) == modalMatch.params.tvId
    );

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
      <SliderTitle>{option.toUpperCase().replaceAll("_", " ")}</SliderTitle>
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
            scrolloffset={offset + ""}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => {
                const url = fetchImage(movie.backdrop_path, "w500");
                return (
                  <SliderBox
                    option={option}
                    url={url}
                    movie={movie}
                    isMovie={false}
                  />
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
      {matchedTV && (
        <TVModal
          contentID={matchedTV.id}
          option={option}
          // matchedContents={matchedTV}
        />
      )}
    </Wrapper>
  );
}

export default TVSlider;
