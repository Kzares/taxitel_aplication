import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Motion } from "@legendapp/motion"
import { Icon } from '@rneui/base'

const Alert = ({ status, text }) => {

  return (
    <Motion.View
      initial={{ y: -50, opacity: 0, scale: .5 }}
      transition={{ type: 'spring' }}
      animate={{ y: 0, opacity: 1, scale: 1 }}

      style={tw` p-5 pt-2 px-1 bg-white absolute top-8 left-0 right-0 mx-2 rounded-lg z-10000 shadow-lg`} >
       <View>
        {!status ?
          <Icon
            style={tw`p-3 pl-1 `}
            type='materialicons' color='black' background='white' size={30} name='sms-failed'
          /> : <Icon
            style={tw`p-3 pl-1 `}
            type='antdesign' color='black' background='white' size={30} name='checkcircleo'
          />
        }
      </View>

      <Text style={tw`text-center  `} >  {text} </Text>
    </Motion.View>
  )
}

export default Alert

const styles = StyleSheet.create({})