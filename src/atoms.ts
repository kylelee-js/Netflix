import { atom } from "recoil";

export const searchOpenState = atom({
  key: "searchOpenState",
  default: false,
});

export const fixedState = atom({
  key: "fixedState",
  default: false,
});
