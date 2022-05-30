import {
  motion,
  useAnimation,
  useViewportScroll,
  useTransform,
} from "framer-motion";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { searchOpenState } from "../../Recoil/atoms";
import NavBar from "./NavBar/NavBar";
import SearchInput from "./SearchForm/SearchInput";

const HeaderBar = styled(motion.header)`
  z-index: 100;
  width: 100%;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 70.71%);
  background-color: black;
  padding: 20px 60px;
`;

const headerVariants = {
  top: {
    backgroundColor: "rgba(0,0,0,0)",
  },
  scroll: {
    backgroundColor: "rgba(0,0,0,1)",
  },
};

function Header() {
  const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
  const inputAnimation = useAnimation();
  const { scrollY } = useViewportScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 300],
    ["rgba(0,0,0,0)", "rgba(0,0,0,1)"]
  );
  const searchClose = () => {
    inputAnimation.start({
      scaleX: 0,
    });
    setSearchOpen(false);
  };

  return (
    <HeaderBar
      variants={headerVariants}
      style={{ backgroundColor }}
      onClick={searchClose}
    >
      <NavBar />
      <SearchInput />
    </HeaderBar>
  );
}

export default Header;
