import ReactNativeRecoilPersist from "react-native-recoil-persist";
import { atom } from "recoil";

export const themeAtom = atom({
  default: 'black',
  key: "theme",
  // Add this effect to the atom to persist it
  effects_UNSTABLE: [ReactNativeRecoilPersist.persistAtom],
});