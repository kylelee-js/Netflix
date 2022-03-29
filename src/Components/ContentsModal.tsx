import {
  AnimatePresence,
  motion,
  MotionValue,
  useViewportScroll,
  Variants,
} from "framer-motion";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { fetchImage, IMovie } from "../api";
import { fixedState } from "../atoms";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

const Wrapper = styled.div``;
const BackDrop = styled.div`
  z-index: 999;
  position: relative;
  height: 100%;
  width: 100%;
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
  border-radius: 15px !important;
  overflow: hidden !important;
  top: ${(props) => props.scrollY.get() + 30}px;
  position: absolute;
  width: 850px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
`;

const ModalCover = styled.div<{ bgURL: string }>`
  width: 100%;
  background-position: center center;
  background-size: cover !important;
  background-image: linear-gradient(to top, #181818, transparent 50%),
    url(${(props) => props.bgURL}) !important;
  min-height: 500px;
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
const ModalGrid = styled.div`
  display: grid;
  position: relative;
  top: -70px;
  grid-template-columns: 3fr 1fr;
`;
const ModalOverview = styled.p`
  padding: 10px;
  margin-left: 20px;

  font-size: 18px;
  /* top: -80px; */
  width: 70%;
  color: ${(props) => props.theme.white.lighter};
`;
const PlayerButtons = styled.div`
  position: relative;
  top: -180px;
  left: 80px;
  width: 50px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const PlayButton = styled.button`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: none;
  width: 80px;
  cursor: pointer;
  span {
    font-weight: 600;
  }
`;

const LikeButton = styled.button`
  background-color: rgba(0, 0, 0, 0.3);
  min-width: 38px;
  min-height: 38px;
  max-width: 42px;
  max-height: 42px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const CloseButton = styled.div`
  background-color: #181818;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const ModalInfo = styled.p`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  h3 {
    font-size: 12px;
    margin-right: 20px;
    /* text-align: center; */
  }
`;
const Desc = styled.div``;

// ######### Variants ##############################################################################################################

const modalVariants: Variants = {
  enter: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.8,
    },
  },
};

interface IContentsModal {
  option: string;
  matchedMovie?: IMovie | "";
}

const ContentsModal = forwardRef<HTMLDivElement, IContentsModal>(
  ({ option, matchedMovie }, ref) => {
    const history = useHistory();
    const [fixed, setFixed] = useRecoilState(fixedState);
    const onOverlayClick = () => {
      setFixed(false);
      history.push("/");
    };

    const { scrollY } = useViewportScroll();
    console.log("matchedMovie in Modal", matchedMovie);

    const modalMatch = useRouteMatch<{ movieId: string }>(
      `/movies/${option}/:movieId`
    );

    let MyRef = useRef<HTMLDivElement>(null);
    let elem: HTMLElement | null = null;

    useEffect(() => {
      // elem = MyRef.current;
      return () => {
        console.log("scroll event ends");
        clearAllBodyScrollLocks();
      };
    }, []);
    return (
      <Wrapper ref={ref}>
        <AnimatePresence>
          {modalMatch && (
            <>
              <Overlay
                onClick={onOverlayClick}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <Modal
                className="Modal"
                variants={modalVariants}
                scrollY={scrollY}
                layoutId={option + modalMatch.params.movieId}
                exit="exit"
                id={option + modalMatch.params.movieId}
              >
                {matchedMovie && (
                  <>
                    <ModalCover
                      bgURL={fetchImage(matchedMovie.backdrop_path, "original")}
                    >
                      <CloseButton onClick={onOverlayClick}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          data-uia="previewModal-closebtn"
                          role="button"
                          aria-label="close"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2.29297 3.70706L10.5859 12L2.29297 20.2928L3.70718 21.7071L12.0001 13.4142L20.293 21.7071L21.7072 20.2928L13.4143 12L21.7072 3.70706L20.293 2.29285L12.0001 10.5857L3.70718 2.29285L2.29297 3.70706Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </CloseButton>
                    </ModalCover>

                    <ModalTitle>{matchedMovie.title}</ModalTitle>
                    <PlayerButtons>
                      <PlayButton>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="white"
                          xmlns="http://www.w3.org/2000/svg"
                          // class="Hawkins-Icon Hawkins-Icon-Standard"
                        >
                          <path
                            d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <span>Play</span>
                      </PlayButton>
                      <LikeButton>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="white"
                          xmlns="http://www.w3.org/2000/svg"
                          // class="Hawkins-Icon Hawkins-Icon-Standard"
                        >
                          <path
                            fill-rule="nonzero"
                            clip-rule="evenodd"
                            d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
                            fill="white"
                          ></path>
                        </svg>
                      </LikeButton>
                      <LikeButton>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="white"
                          xmlns="http://www.w3.org/2000/svg"
                          // class="Hawkins-Icon Hawkins-Icon-Standard"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11 2V11H2V13H11V22H13V13H22V11H13V2H11Z"
                            fill="white"
                          ></path>
                        </svg>
                      </LikeButton>
                    </PlayerButtons>
                    <ModalGrid>
                      <ModalOverview>{matchedMovie.overview}</ModalOverview>

                      <ModalInfo>
                        <h3>Liked : {matchedMovie.vote_count}</h3>
                        <h3>Released : {matchedMovie.release_date}</h3>
                        <h3>Popularity : {matchedMovie.popularity}</h3>
                      </ModalInfo>
                    </ModalGrid>

                    <Desc>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sapiente odit aut vitae aperiam sed quisquam eaque, labore
                      quo. Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi? Lorem ipsum
                      dolor sit amet consectetur, adipisicing elit. Sapiente
                      odit aut vitae aperiam sed quisquam eaque, labore quo.
                      Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi? Lorem ipsum
                      dolor sit amet consectetur, adipisicing elit. Sapiente
                      odit aut vitae aperiam sed quisquam eaque, labore quo.
                      Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi? Lorem ipsum
                      dolor sit amet consectetur, adipisicing elit. Sapiente
                      odit aut vitae aperiam sed quisquam eaque, labore quo.
                      Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi? Lorem ipsum
                      dolor sit amet consectetur, adipisicing elit. Sapiente
                      odit aut vitae aperiam sed quisquam eaque, labore quo.
                      Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi? Lorem ipsum
                      dolor sit amet consectetur, adipisicing elit. Sapiente
                      odit aut vitae aperiam sed quisquam eaque, labore quo.
                      Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi? Lorem ipsum
                      dolor sit amet consectetur, adipisicing elit. Sapiente
                      odit aut vitae aperiam sed quisquam eaque, labore quo.
                      Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi? Lorem ipsum
                      dolor sit amet consectetur, adipisicing elit. Sapiente
                      odit aut vitae aperiam sed quisquam eaque, labore quo.
                      Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi? Lorem ipsum
                      dolor sit amet consectetur, adipisicing elit. Sapiente
                      odit aut vitae aperiam sed quisquam eaque, labore quo.
                      Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi? Lorem ipsum
                      dolor sit amet consectetur, adipisicing elit. Sapiente
                      odit aut vitae aperiam sed quisquam eaque, labore quo.
                      Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi? Lorem ipsum
                      dolor sit amet consectetur, adipisicing elit. Sapiente
                      odit aut vitae aperiam sed quisquam eaque, labore quo.
                      Earum nesciunt adipisci dolorem unde deserunt sit
                      molestiae accusamus? Ab, recusandae quasi?
                    </Desc>
                  </>
                )}
              </Modal>
            </>
          )}
        </AnimatePresence>
      </Wrapper>
    );
  }
);

export default ContentsModal;