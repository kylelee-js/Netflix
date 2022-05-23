import { motion } from "framer-motion";
import styled from "styled-components";

export const Carousel = styled.div`
  /* grid-template-columns: 4% auto 4%; */
  position: relative;
  width: 100%;
  top: -100px;
`;

export const ContentsRow = styled(motion.div)<{ scrolloffset: string }>`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(${(props) => props.scrolloffset}, 1fr);
  position: absolute;
  gap: 5px;
`;

export const SliderTitle = styled.div`
  margin-left: 20px;
  padding: 10px;
  font-size: 36px;
`;

// ######### Button ##################################################################################################

export const PrevContent = styled.div`
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
export const NextContent = styled.div`
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

// ###########
export const BoxInfo = styled(motion.div)`
  z-index: 11;
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

// #### BOX #####

export const Shade = styled(motion.div)`
  z-index: 10;
  position: absolute;
  background-color: #141414;
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

export const Box = styled(motion.div)`
  z-index: 11;
  background-color: #252525;
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

export const BoxImage = styled.img`
  z-index: 11;
  height: 200px;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
`;
