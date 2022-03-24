import {
  AnimatePresence,
  motion,
  MotionValue,
  useViewportScroll,
} from "framer-motion";
import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { fetchImage, IMovie } from "../api";
import { fixedState } from "../atoms";

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
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
  border-radius: 15px;
  overflow: hidden;
  top: ${(props) => props.scrollY.get() + 30}px;
  position: absolute;
  width: 60vw;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
`;

const ModalCover = styled.div`
  width: 100%;
  background-position: center center;
  background-size: cover !important;
  height: 500px;
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
  const setFixed = useSetRecoilState(fixedState);
  const onOverlayClick = () => {
    setFixed(false);
    history.push("/");
  };

  const { scrollY } = useViewportScroll();
  console.log("matchedMovie in Modal", matchedMovie);

  const modalMatch = useRouteMatch<{ movieId: string }>(
    `/movies/${option}/:movieId`
  );

  // 스크롤은 막았지만 모달 자체는 스크롤을 허용해야함.. 지금 모달도 스크롤이 안됨 - 스크롤 입력을 받아야하는데... 외부에서도 스크롤 이벤트를 받긴 해야함
  // useEffect(() => {
  //   document.body.style.cssText = `
  //     position: fixed;
  //     top: -${window.scrollY}px;
  //     overflow-y: scroll;
  //     width: 100%;`;

  //   return () => {
  //     const scrollY = document.body.style.top;
  //     document.body.style.cssText = "";
  //     window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
  //   };
  // }, []);

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
            className="asd"
            scrollY={scrollY}
            layoutId={option + modalMatch.params.movieId}
            exit={{ opacity: 0 }}
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
                <h3>{matchedMovie.release_date}</h3>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Sapiente odit aut vitae aperiam sed quisquam eaque, labore
                  quo. Earum nesciunt adipisci dolorem unde deserunt sit
                  molestiae accusamus? Ab, recusandae quasi?
                </div>
                HISTORY, PURPOSE AND USAGE Lorem ipsum, or lipsum as it is
                sometimes known, is dummy text used in laying out print, graphic
                or web designs. The passage is attributed to an unknown
                typesetter in the 15th century who is thought to have scrambled
                parts of Cicero's De Finibus Bonorum et Malorum for use in a
                type specimen book. It usually begins with: “Lorem ipsum dolor
                sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.” The purpose of
                lorem ipsum is to create a natural looking block of text
                (sentence, paragraph, page, etc.) that doesn't distract from the
                layout. A practice not without controversy, laying out pages
                with meaningless filler text can be very useful when the focus
                is meant to be on design, not content. The passage experienced a
                surge in popularity during the 1960s when Letraset used it on
                their dry-transfer sheets, and again during the 90s as desktop
                publishers bundled the text with their software. Today it's seen
                all around the web; on templates, websites, and stock designs.
                Use our generator to get your own, or read on for the
                authoritative history of lorem ipsum. HISTORY, PURPOSE AND USAGE
                Lorem ipsum, or lipsum as it is sometimes known, is dummy text
                used in laying out print, graphic or web designs. The passage is
                attributed to an unknown typesetter in the 15th century who is
                thought to have scrambled parts of Cicero's De Finibus Bonorum
                et Malorum for use in a type specimen book. It usually begins
                with: “Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.” The purpose of lorem ipsum is to create a natural
                looking block of text (sentence, paragraph, page, etc.) that
                doesn't distract from the layout. A practice not without
                controversy, laying out pages with meaningless filler text can
                be very useful when the focus is meant to be on design, not
                content. The passage experienced a surge in popularity during
                the 1960s when Letraset used it on their dry-transfer sheets,
                and again during the 90s as desktop publishers bundled the text
                with their software. Today it's seen all around the web; on
                templates, websites, and stock designs. Use our generator to get
                your own, or read on for the authoritative history of lorem
                ipsum. HISTORY, PURPOSE AND USAGE Lorem ipsum, or lipsum as it
                is sometimes known, is dummy text used in laying out print,
                graphic or web designs. The passage is attributed to an unknown
                typesetter in the 15th century who is thought to have scrambled
                parts of Cicero's De Finibus Bonorum et Malorum for use in a
                type specimen book. It usually begins with: “Lorem ipsum dolor
                sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.” The purpose of
                lorem ipsum is to create a natural looking block of text
                (sentence, paragraph, page, etc.) that doesn't distract from the
                layout. A practice not without controversy, laying out pages
                with meaningless filler text can be very useful when the focus
                is meant to be on design, not content. The passage experienced a
                surge in popularity during the 1960s when Letraset used it on
                their dry-transfer sheets, and again during the 90s as desktop
                publishers bundled the text with their software. Today it's seen
                all around the web; on templates, websites, and stock designs.
                Use our generator to get your own, or read on for the
                authoritative history of lorem ipsum. HISTORY, PURPOSE AND USAGE
                Lorem ipsum, or lipsum as it is sometimes known, is dummy text
                used in laying out print, graphic or web designs. The passage is
                attributed to an unknown typesetter in the 15th century who is
                thought to have scrambled parts of Cicero's De Finibus Bonorum
                et Malorum for use in a type specimen book. It usually begins
                with: “Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.” The purpose of lorem ipsum is to create a natural
                looking block of text (sentence, paragraph, page, etc.) that
                doesn't distract from the layout. A practice not without
                controversy, laying out pages with meaningless filler text can
                be very useful when the focus is meant to be on design, not
                content. The passage experienced a surge in popularity during
                the 1960s when Letraset used it on their dry-transfer sheets,
                and again during the 90s as desktop publishers bundled the text
                with their software. Today it's seen all around the web; on
                templates, websites, and stock designs. Use our generator to get
                your own, or read on for the authoritative history of lorem
                ipsum. HISTORY, PURPOSE AND USAGE Lorem ipsum, or lipsum as it
                is sometimes known, is dummy text used in laying out print,
                graphic or web designs. The passage is attributed to an unknown
                typesetter in the 15th century who is thought to have scrambled
                parts of Cicero's De Finibus Bonorum et Malorum for use in a
                type specimen book. It usually begins with: “Lorem ipsum dolor
                sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.” The purpose of
                lorem ipsum is to create a natural looking block of text
                (sentence, paragraph, page, etc.) that doesn't distract from the
                layout. A practice not without controversy, laying out pages
                with meaningless filler text can be very useful when the focus
                is meant to be on design, not content. The passage experienced a
                surge in popularity during the 1960s when Letraset used it on
                their dry-transfer sheets, and again during the 90s as desktop
                publishers bundled the text with their software. Today it's seen
                all around the web; on templates, websites, and stock designs.
                Use our generator to get your own, or read on for the
                authoritative history of lorem ipsum. HISTORY, PURPOSE AND USAGE
                Lorem ipsum, or lipsum as it is sometimes known, is dummy text
                used in laying out print, graphic or web designs. The passage is
                attributed to an unknown typesetter in the 15th century who is
                thought to have scrambled parts of Cicero's De Finibus Bonorum
                et Malorum for use in a type specimen book. It usually begins
                with: “Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.” The purpose of lorem ipsum is to create a natural
                looking block of text (sentence, paragraph, page, etc.) that
                doesn't distract from the layout. A practice not without
                controversy, laying out pages with meaningless filler text can
                be very useful when the focus is meant to be on design, not
                content. The passage experienced a surge in popularity during
                the 1960s when Letraset used it on their dry-transfer sheets,
                and again during the 90s as desktop publishers bundled the text
                with their software. Today it's seen all around the web; on
                templates, websites, and stock designs. Use our generator to get
                your own, or read on for the authoritative history of lorem
                ipsum.
              </>
            )}
          </Modal>
        </>
      )}
    </AnimatePresence>
  );
}

export default ContentsModal;
