import ReactNativeRecoilPersist from "react-native-recoil-persist";
import { atom } from "recoil";

export const sesionAtom = atom({
  default: {},
  key: "sesion",
  // Add this effect to the atom to persist it
  effects_UNSTABLE: [ReactNativeRecoilPersist.persistAtom],
});