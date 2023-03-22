import ReactNativeRecoilPersist from "react-native-recoil-persist";
import { atom } from "recoil";

export const driverLocationatom = atom({
  default: {},
  key: "driverLocationatom",
  // Add this effect to the atom to persist it
  effects_UNSTABLE: [ReactNativeRecoilPersist.persistAtom],
});