import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRecoilState } from 'recoil';
import { origin } from '../atoms/locationAtoms';

const Recoil = () => {
    const [positionFilter, setPositionFilter] =
    useRecoilState(origin);
    console.log(positionFilter)
  return (
    <View>
      <Text>Recoil</Text>
    </View>
  )
}

export default Recoil

const styles = StyleSheet.create({})