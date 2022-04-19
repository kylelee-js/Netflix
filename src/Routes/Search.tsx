import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { fetchImage, fetchSearchResult, IFetchSearch } from "../api";
import Footer from "../Components/Footer";
import MovieSearchModal from "../Components/MovieSearchModal";
import Slider, { BoxInfo } from "../Components/MovieSlider";
import TVSearchModal from "../Components/TVSeachModal";

const Banner = styled.div`
  width: 100%;
  height: 20vh;
  background-color: ${(props) => props.theme.black.darker};
`;
const Carousel = styled.div`
  /* grid-template-columns: 4% auto 4%; */
  margin-top: 20px;
  position: relative;
  width: 100%;
  top: -100px;
`;
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
const Box = styled(motion.div)<{ bgPhoto: string }>`
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
const Title = styled.h2`
  font-size: 36px;
  padding: 0.5rem;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 150px 300px;
`;

const ContentsRow = styled(motion.div)<{ off_set: string }>`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${(props) => props.off_set}, 1fr);
  position: absolute;
  gap: 5px;
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

function Search() {
  const location = useLocation();

  const keyword = new URLSearchParams(location.search).get("keyword");
  let [queryKeyword, setQueryKeyword] = useState(keyword);

  const { data, isLoading, refetch } = useQuery<IFetchSearch>(
    ["search", "multi", queryKeyword],
    () => fetchSearchResult(queryKeyword + "")
  );
  const [index, setIndex] = useState(0);
  let [offset, setOffset] = useState(6);
  const history = useHistory();
  const modalMatch = useRouteMatch<{ movieId: string }>(`/search/:movieId`);
  const matchedMovie =
    modalMatch?.params.movieId &&
    data?.results.find(
      (movie: any) => String(movie.id) == modalMatch.params.movieId
    );
  const modalClick = (movieId: number) => {
    history.push(`/search/${movieId}`);
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  useEffect(() => {
    const queryKW = new URLSearchParams(location.search).get("keyword");
    console.log(queryKW);
    if (queryKW !== null) {
      setQueryKeyword(queryKW);
    }

    // refetch();
  }, [location]);

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
    <>
      <Banner />
      <Wrapper>
        <Title>Search Results - {queryKeyword}</Title>
        {data?.results.length == 0 && (
          <div style={{ marginLeft: "50px", fontSize: "30px" }}>
            No Results are found.
          </div>
        )}
        <Carousel>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <ContentsRow
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
              off_set={offset + ""}
            >
              {data?.results
                .slice(1)
                .slice(0, offset)
                .map((search) => {
                  const url = fetchImage(search.backdrop_path, "w500");
                  return (
                    <>
                      <Box
                        key={search.id}
                        id={String(search.id)}
                        bgPhoto={url}
                        onClick={() => modalClick(search.id)}
                        whileHover="hover"
                        initial="normal"
                        exit="end"
                        variants={boxVariants}
                        transition={{ type: "tween" }}
                        // layoutId={String(search.id)}
                      >
                        <Shade
                          // bgPhoto={fetchImage(movie.backdrop_path, "w500")}
                          initial={{ opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          layoutId={String(search.id)}
                        />
                        <BoxInfo variants={infoVariants}>
                          {search.title && <h4>{search.title}</h4>}
                          {search.name && <h4>{search.name}</h4>}
                        </BoxInfo>
                      </Box>
                    </>
                  );
                })}
            </ContentsRow>
          </AnimatePresence>
        </Carousel>
        <Carousel>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <ContentsRow
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
              off_set={offset + ""}
            >
              {data?.results
                .slice(1)
                .slice(offset, offset + offset)
                .map((search) => {
                  const url = fetchImage(search.backdrop_path, "w500");
                  return (
                    <>
                      <Box
                        key={search.id}
                        id={String(search.id)}
                        bgPhoto={url}
                        onClick={() => modalClick(search.id)}
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
                          layoutId={String(search.id)}
                        />
                        <BoxInfo variants={infoVariants}>
                          {search.title && <h4>{search.title}</h4>}
                          {search.name && <h4>{search.name}</h4>}
                        </BoxInfo>
                      </Box>
                    </>
                  );
                })}
            </ContentsRow>
          </AnimatePresence>
        </Carousel>

        {matchedMovie && (
          <SearchModal type={matchedMovie.media_type} id={matchedMovie.id} />
        )}
      </Wrapper>
      <Footer />
    </>
  );
}
interface ISearchModal {
  type: string;
  id: number;
}

function SearchModal({ type, id }: ISearchModal) {
  if (type == "movie") {
    return <MovieSearchModal contentID={id} />;
  } else if (type == "tv") {
    return <TVSearchModal contentID={id} />;
  } else {
    return <></>;
  }
}

export default Search;
