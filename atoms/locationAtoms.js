import {atom} from 'recoil'

//Coordinates Stores
export const originAtom = atom({
    key: 'originAtom',
    default: {}
})
export const destinationAtom = atom({
    key: 'destinationAtom',
    default: {}
})
//Details Store
export const destinationDescriptionAtom = atom({
    key: 'destinationDescriptionAtom',
    default: {}
})
export const originDescriptionAtom = atom({
    key: 'originDescriptionAtom',
    default: {}
})
//Handling the destination visivility
export const showDestinationAtom = atom({
    key: 'ShowDestinationAtom',
    default: false
})
export const selectedDestination = atom({
    key: 'selectedDestination',
    default: false
})