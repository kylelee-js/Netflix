import { motion, Variants } from "framer-motion";
import { SyntheticEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { IMovie, ITV } from "../api";
import { fixedState } from "../atoms";
import { Box, BoxImage, BoxInfo, Shade } from "./Styled-Components/Styles";

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

const infoVariants: Variants = {
  hover: {
    opacity: 1,
  },
};

interface ISliderBox {
  option: string;
  url: string;
  movie: IMovie | ITV;
  isMovie: boolean;
}

function SliderBox({ option, url, movie, isMovie }: ISliderBox) {
  const setFixed = useSetRecoilState(fixedState);

  const history = useHistory();

  // 그냥 toggleLeaving으로 통일해도 문제 없을 듯?
  const [modalClicked, setModalClicked] = useState(false);
  const toggleModalClicked = () => setModalClicked((prev) => !prev);
  //

  const modalClick = (movieId: number) => {
    toggleModalClicked();
    setFixed(true);
    if (isMovie) {
      history.push(`/movies/${option}/${movieId}`);
    } else {
      history.push(`/tv/${option}/${movieId}`);
    }
  };
  const onImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "src/Components/Styled-Components/notfound.png";
  };

  return (
    <Box
      onClick={() => modalClick(movie.id)}
      whileHover="hover"
      initial="normal"
      exit="end"
      variants={boxVariants}
      transition={{ type: "tween" }}
    >
      <BoxImage src={url} />
      <Shade
        // bgPhoto={fetchImage(movie.backdrop_path, "w500")}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        layoutId={option + String(movie.id)}
      />
      <BoxInfo variants={infoVariants}>
        <h4>{movie.hasOwnProperty("title") ? movie.title : movie.name}</h4>
      </BoxInfo>
    </Box>
  );
}

export default SliderBox;
