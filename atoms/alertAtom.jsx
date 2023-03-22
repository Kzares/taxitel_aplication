import { atom } from "recoil";

export const alertAtom = atom({
  default: {
    text: '',
    type: false,
    show: false
  },
  key: "alertAtom",
});