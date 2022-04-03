import { type } from "os";
import { atom } from "recoil";
import { IMovie, ITV } from "./api";

export const searchOpenState = atom({
  key: "searchOpenState",
  default: false,
});

export const fixedState = atom({
  key: "fixedState",
  default: false,
});

export const movieContents = atom<IMovie | undefined>({
  key: "movieContentsState",
  default: undefined,
});

export const tvContents = atom<ITV | undefined>({
  key: "tvContentsState",
  default: undefined,
});
