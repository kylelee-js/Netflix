import { motion } from "framer-motion";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import Logo from "../Logo/Logo";

const Container = styled.nav`
  display: flex;
  align-items: center;
`;

const Navigavtions = styled.ul`
  display: flex;
  align-items: center;
`;

const Nav = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Circle = styled(motion.div)`
  z-index: 19999;
  width: 5px;
  height: 5px;
  background-color: ${(props) => props.theme.red};
  border-radius: 5px;
  position: absolute;
  /* left: 10px; */
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

export default function NavBar() {
  const homeMatch = useRouteMatch("/");
  const tvMatch = useRouteMatch("/tv");

  return (
    <Container>
      <Logo />
      <Navigavtions>
        <Nav>
          <Link to={"/"}>
            Home {homeMatch?.isExact && <Circle layoutId="pointer" />}
          </Link>
        </Nav>
        <Nav>
          <Link to={"/tv"}>
            TV shows {tvMatch?.isExact && <Circle layoutId="pointer" />}
          </Link>
        </Nav>
      </Navigavtions>
    </Container>
  );
}
