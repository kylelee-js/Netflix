import {
  AnimatePresence,
  motion,
  MotionValue,
  useViewportScroll,
  Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  fetchImage,
  fetchSimilarMovie,
  fetchSingleMovie,
  IMovie,
  ISimilarMovie,
} from "../../api/api";
import { fixedState, movieContents, tvContents } from "../../Recoil/atoms";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import { useQuery } from "react-query";

const Wrapper = styled.div``;
// const BackDrop = styled.div`
//   z-index: 999;
//   position: relative;
//   height: 100%;
//   width: 100%;
// `;

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
  overflow: auto !important;
  top: ${(props) => props.scrollY.get() + 10}px;
  position: absolute;
  width: 850px;
  @media screen and (max-width: 850px) {
    width: 700px;
  }
  @media screen and (max-width: 786px) {
    width: 600px;
  }
  @media screen and (max-width: 600px) {
    width: 500px;
  }

  height: 99%;
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
  height: 500px;
  @media screen and (max-width: 850px) {
    height: 400px;
  }
  @media screen and (max-width: 786px) {
    height: 300px;
  }
  @media screen and (max-width: 600px) {
    height: 250px;
  }

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

const AddButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  max-width: 30px;
  max-height: 30px;
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

const ModalMeta = styled.p`
  display: flex;
  gap: 40px;
  flex-direction: column;
  justify-content: start;
`;
const ContentMeta = styled.div`
  position: relative;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 30px;
`;

const ModalInfo = styled.p`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
  h3 {
    font-size: 14px;
    margin-right: 20px;
    /* text-align: center; */
  }
`;
const Desc = styled.div``;

const DescTitle = styled.div`
  margin-left: 50px;
  padding: 10px;
  font-size: 30px;
`;

const SimilarContentMeta = styled.div`
  position: relative;
  padding: 1rem;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SimilarContentTitle = styled.span`
  position: absolute;
  background-color: linear-gradient(to top, #181818, transparent 50%);
  left: 0px;
  bottom: 10px;
  margin-left: 10px;
  padding: 10px;
  font-size: 18px;
  color: white;
`;

const SimilarContents = styled.div`
  display: grid;
  grid-template-rows: repeat(4, 1fr);

  grid-template-columns: repeat(3, 1fr);
  @media screen and (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  gap: 1rem;
  padding: 15px;
  margin-bottom: 100px;
  margin-left: 48px;
  margin-right: 48px;
`;

const SimilarContent = styled.div`
  border-radius: 5px;
  height: 350px;
  cursor: pointer;
  background-color: ${(props) => props.theme.black.lighter};
`;

const SimilarContentCover = styled.div<{ bgPhoto: string }>`
  position: relative;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  border-radius: 5px 5px 0px 0px;
  height: 134px;
`;

const SimilarContentOverview = styled.div`
  padding: 1em 1em;
  margin: 0;
  color: #d2d2d2;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  line-height: 1em;
  max-height: 4em;
`;

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
  option?: string;
  contentID: number;
  // matchedContents: IMovie | "";
}

const MovieContentsModal = ({
  option,
  contentID,
}: // matchedContents,
IContentsModal) => {
  const history = useHistory();

  let [contentId, setContentId] = useState(contentID);
  // let [matchedContents, setMatchedContents] = useState(matchedContent);

  const movieContents = useQuery<IMovie>(["movie", contentId], () =>
    fetchSingleMovie(contentId + "")
  );

  const { data, isLoading } = useQuery<ISimilarMovie>(
    ["similarMovie", contentId],
    () => fetchSimilarMovie(contentId + "")
  );

  const [fixed, setFixed] = useRecoilState(fixedState);
  const onOverlayClick = () => {
    setFixed(false);
    history.push("/");
  };

  const modalClick = (movieId: number) => {
    // toggleModalClicked();
    // setFixed(true);
    setContentId(movieId);

    // history.push(`/movies/${movieId}`);
  };

  const modalMatch = useRouteMatch<{ movieId: string }>(
    `/movies/${option}/:movieId`
  );

  const { scrollY } = useViewportScroll();

  let MyRef = useRef<HTMLDivElement>(null);
  let ModalElem: HTMLElement | null = null;

  useEffect(() => {
    ModalElem = MyRef.current;
    if (ModalElem != null) {
      disableBodyScroll(ModalElem);
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, []);
  return (
    <Wrapper ref={MyRef}>
      <AnimatePresence>
        {modalMatch && (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <Modal
              // ref={MyRef}
              className="Modal"
              variants={modalVariants}
              scrollY={scrollY}
              layoutId={option + modalMatch.params.movieId}
              exit="exit"
              id={option + modalMatch.params.movieId}
            >
              {movieContents.data && (
                <>
                  <ModalCover
                    bgURL={fetchImage(
                      movieContents.data.backdrop_path,
                      "original"
                    )}
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

                  <ModalTitle>{movieContents.data.title}</ModalTitle>
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
                    <ModalOverview>{movieContents.data.overview}</ModalOverview>
                    <ModalMeta>
                      <ContentMeta>
                        {movieContents.data.adult ? (
                          <svg
                            width="40"
                            height="40"
                            id="maturity-rating-978"
                            viewBox="0 0 100 100"
                          >
                            <path
                              id="FIll---Red"
                              fill="#C52E37"
                              d="M88.728 100H11.27C5.043 100 0 94.957 0 88.73V11.274C0 5.048 5.043 0 11.27 0h77.458C94.954 0 100 5.048 100 11.274V88.73c0 6.227-5.046 11.27-11.272 11.27"
                            ></path>
                            <path
                              id="18"
                              fill="#FFFFFE"
                              d="M81.473 15.482c.846 0 1.534.687 1.534 1.533v22.099c0 2.036-.283 3.563-.852 4.581-.568 1.02-1.542 1.947-2.918 2.784l-4.581 2.431 4.58 2.156c.777.417 1.424.834 1.93 1.254.51.42.917.931 1.215 1.528.298.6.507 1.32.626 2.157.12.84.182 1.858.182 3.058v23.533c0 .846-.686 1.533-1.533 1.533H43.21a1.536 1.536 0 01-1.535-1.533V59.063c0-2.218.255-3.896.763-5.036.51-1.135 1.538-2.127 3.1-2.961l4.582-2.156-4.581-2.43c-1.376-.838-2.35-1.778-2.92-2.832-.565-1.046-.855-2.563-.855-4.534V17.015c0-.846.688-1.533 1.534-1.533zm-45.008 0V84.13H21.103V34.62h-5.485l7.104-19.136h13.743zm29.913 39.176h-7.89c-.845 0-1.534.686-1.534 1.532v13.737c0 .846.689 1.534 1.535 1.534h7.89c.846 0 1.534-.688 1.534-1.534V56.19c0-.846-.688-1.532-1.535-1.532zm0-26.548h-7.89c-.845 0-1.534.686-1.534 1.532v12.014c0 .846.689 1.533 1.535 1.533h7.89c.846 0 1.534-.687 1.534-1.533V29.642c0-.846-.688-1.532-1.535-1.532z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            width="40"
                            height="40"
                            id="maturity-rating-975"
                            viewBox="0 0 100 100"
                          >
                            <path
                              id="Fill---Green"
                              fill="#269251"
                              d="M88.729 100H11.274C5.051 100 0 94.954 0 88.728V11.274C0 5.048 5.051 0 11.274 0H88.73C94.956 0 100 5.048 100 11.274v77.454C100 94.954 94.956 100 88.729 100"
                            ></path>
                            <path
                              id="Combined-Shape"
                              fill="#FFFFFE"
                              d="M68.776 24.428l11.274.001-.004 40.523h13.27V75.1l-24.54-.005V24.428zm-51.928.001l12.335.002L39.86 74.967l.004.131H28.589l-1.196-7.559-8.751.004-1.194 7.552-11.278.003v-.135L16.848 24.43zm36.277-.001v40.524h13.262v10.146h-24.54v-50.67h11.278zM23.015 40.74L20.23 57.987H25.8L23.015 40.74z"
                            ></path>
                          </svg>
                        )}
                        {movieContents.data.release_date.slice(0, 4)}
                      </ContentMeta>

                      <ModalInfo>
                        <h3>Liked : {movieContents.data.vote_count}</h3>

                        <h3>Popularity : {movieContents.data.popularity}</h3>
                      </ModalInfo>
                    </ModalMeta>
                  </ModalGrid>

                  <Desc>
                    <DescTitle>Similar Contents</DescTitle>
                    <SimilarContents>
                      {data?.results.slice(0, 12).map((similarMovie) => {
                        const url = fetchImage(
                          similarMovie.backdrop_path,
                          "w500"
                        );
                        return (
                          <>
                            <SimilarContent
                              onClick={() => modalClick(similarMovie.id)}
                            >
                              <SimilarContentCover bgPhoto={url}>
                                <SimilarContentTitle>
                                  {similarMovie.title}
                                </SimilarContentTitle>
                              </SimilarContentCover>

                              <SimilarContentMeta>
                                {similarMovie.adult ? (
                                  <svg
                                    width="30"
                                    height="30"
                                    id="maturity-rating-978"
                                    viewBox="0 0 100 100"
                                  >
                                    <path
                                      id="FIll---Red"
                                      fill="#C52E37"
                                      d="M88.728 100H11.27C5.043 100 0 94.957 0 88.73V11.274C0 5.048 5.043 0 11.27 0h77.458C94.954 0 100 5.048 100 11.274V88.73c0 6.227-5.046 11.27-11.272 11.27"
                                    ></path>
                                    <path
                                      id="18"
                                      fill="#FFFFFE"
                                      d="M81.473 15.482c.846 0 1.534.687 1.534 1.533v22.099c0 2.036-.283 3.563-.852 4.581-.568 1.02-1.542 1.947-2.918 2.784l-4.581 2.431 4.58 2.156c.777.417 1.424.834 1.93 1.254.51.42.917.931 1.215 1.528.298.6.507 1.32.626 2.157.12.84.182 1.858.182 3.058v23.533c0 .846-.686 1.533-1.533 1.533H43.21a1.536 1.536 0 01-1.535-1.533V59.063c0-2.218.255-3.896.763-5.036.51-1.135 1.538-2.127 3.1-2.961l4.582-2.156-4.581-2.43c-1.376-.838-2.35-1.778-2.92-2.832-.565-1.046-.855-2.563-.855-4.534V17.015c0-.846.688-1.533 1.534-1.533zm-45.008 0V84.13H21.103V34.62h-5.485l7.104-19.136h13.743zm29.913 39.176h-7.89c-.845 0-1.534.686-1.534 1.532v13.737c0 .846.689 1.534 1.535 1.534h7.89c.846 0 1.534-.688 1.534-1.534V56.19c0-.846-.688-1.532-1.535-1.532zm0-26.548h-7.89c-.845 0-1.534.686-1.534 1.532v12.014c0 .846.689 1.533 1.535 1.533h7.89c.846 0 1.534-.687 1.534-1.533V29.642c0-.846-.688-1.532-1.535-1.532z"
                                    ></path>
                                  </svg>
                                ) : (
                                  <svg
                                    width="30"
                                    height="30"
                                    id="maturity-rating-975"
                                    viewBox="0 0 100 100"
                                  >
                                    <path
                                      id="Fill---Green"
                                      fill="#269251"
                                      d="M88.729 100H11.274C5.051 100 0 94.954 0 88.728V11.274C0 5.048 5.051 0 11.274 0H88.73C94.956 0 100 5.048 100 11.274v77.454C100 94.954 94.956 100 88.729 100"
                                    ></path>
                                    <path
                                      id="Combined-Shape"
                                      fill="#FFFFFE"
                                      d="M68.776 24.428l11.274.001-.004 40.523h13.27V75.1l-24.54-.005V24.428zm-51.928.001l12.335.002L39.86 74.967l.004.131H28.589l-1.196-7.559-8.751.004-1.194 7.552-11.278.003v-.135L16.848 24.43zm36.277-.001v40.524h13.262v10.146h-24.54v-50.67h11.278zM23.015 40.74L20.23 57.987H25.8L23.015 40.74z"
                                    ></path>
                                  </svg>
                                )}
                                {similarMovie.release_date.slice(0, 4)}
                                <AddButton>
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
                                </AddButton>
                              </SimilarContentMeta>
                              <SimilarContentOverview>
                                <p>{similarMovie.overview}</p>
                              </SimilarContentOverview>
                            </SimilarContent>
                          </>
                        );
                      })}
                    </SimilarContents>
                  </Desc>
                </>
              )}
            </Modal>
          </>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default MovieContentsModal;
