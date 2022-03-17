import {
  AnimatePresence,
  motion,
  MotionValue,
  useViewportScroll,
} from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { fetchImage, IMovie } from "../api";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
`;

const Modal = styled(motion.div)<{ scrollY: MotionValue<number> }>`
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
// ######### Variants ##############################################################################################################

interface IContentsModal {
  option: string;
  matchedMovie?: IMovie | "";
}

function ContentsModal({ option, matchedMovie }: IContentsModal) {
  const history = useHistory();
  const onOverlayClick = () => {
    history.push("/");
  };

  const { scrollY } = useViewportScroll();
  console.log("matchedMovie in Modal", matchedMovie);

  const modalMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  return (
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
          >
            {matchedMovie ? (
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
            ) : (
              <>ㅁㄴㅇㅁㄴㅇ</>
            )}
          </Modal>
        </>
      )}
    </AnimatePresence>
  );
}

export default ContentsModal;
