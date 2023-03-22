import { StyleSheet, Text, View, TextInput, SafeAreaView, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { Icon } from '@rneui/base'
import { useRecoilState } from 'recoil';
import { destinationAtom, destinationDescriptionAtom, originAtom, originDescriptionAtom, selectedDestination, showDestinationAtom } from '../atoms/locationAtoms';
import axios from 'axios';
import { ActivityIndicator } from 'react-native';

const Selector = (clearAutocomplete, mainNavigation) => {

  {/*Accesing the Atoms */ }
  const [origin, setOrigin] = useRecoilState(originAtom);
  const [destination, setDestination] = useRecoilState(destinationAtom);
  const [showDestination, setShowDestination] = useRecoilState(showDestinationAtom);
  const [selectDestination, setSelectDestination] = useRecoilState(selectedDestination)
  const [originDescription, setOriginDescription] = useRecoilState(originDescriptionAtom)
  const [destinationDescription, setDestinationDescription] = useRecoilState(destinationDescriptionAtom)

  {/* States */ }
  const [value, setValue] = useState('')
  const [autocomplete, setAutocomplete] = useState([])
  const [loader, setLoader] = useState(false)

  {/* Funcition to call the radar api for information of the locations */ }
  const getDescription = async (latitude, longitude, place) => {
    try {
      await axios.get(`https://api.radar.io/v1/geocode/reverse?coordinates=${latitude}%2C+${longitude}`, {
        headers: {
          'Authorization': 'prj_test_pk_56b7b80783bb75bad408ff3ddaca23c9ecd609e2'
        }
      }).then(data => {
        if (place === 'origin') {
          setOriginDescription({
            city: data.data.addresses[0].city,
            state: data.data.addresses[0].state,
            formattedAddress: data.data.addresses[0].formattedAddress
          })
        } else {
          setDestinationDescription({
            city: data.data.addresses[0].city,
            state: data.data.addresses[0].state,
            formattedAddress: data.data.addresses[0].formattedAddress
          })
        }
      })
    } catch (e) {
      console.log(e)
    }
  }


  {/* Function to set destination */ }

  const handlePlace = (latitude, longitude, description) =>{
    handleOrigin(latitude, longitude, '')
    setTimeout(() =>{
      handleOrigin(latitude, longitude, description)
    }, 1)
  }

  const handleOrigin = (latitude, longitude, description) => {

    if (selectDestination) {
      getDescription(latitude, longitude, 'destination')
      setShowDestination(true)
      setDestination({
        description: description,
        latitude: latitude,
        longitude: longitude
      })
    } else {
      getDescription(latitude, longitude, 'origin')
      setOrigin({
        description: description,
        latitude: latitude,
        longitude: longitude
      })
    }

    setAutocomplete([])
  }
  {/* Autocomplete */ }
  const getAutocomplete = async (input) => {
    try {
      await axios.get('https://api.radar.io/v1/search/autocomplete', {
        params: {
          query: input,
          near: '23.13302, -82.38304'
        },
        headers: {
          'Authorization': 'prj_test_pk_56b7b80783bb75bad408ff3ddaca23c9ecd609e2'
        }
      }).then(data => setAutocomplete(data.data.addresses))
    } catch (e) {
      console.log(e)
    }
  }

  {/* Cleaning the Autocomplete */ }
  useEffect(() => setValue(''), [clearAutocomplete])

  return (
    <SafeAreaView style={tw`absolute bg-white shadow-xl rounded-lg top-8 left-2 right-2 `}>


      {/* Header to Serch */}
      <View style={tw`p-3  rounded-lg flex flex-row items-center`}>

        {value.length > 0 ?
          <Icon
            style={tw` w-10`}
            onPress={() => { setAutocomplete([]); setValue('') }}
            type='ionicon' color='black' name='close'

          /> :
          <Icon
            style={tw` w-10`}
            type='ionicon' color='black' name='search'

          />}

        <TextInput
          editable
          maxLength={40}
          style={tw`text-lg pl-1`}
          placeholder={selectDestination ? 'Seleccione su destino' : 'Donde quiere ser recojido?'}
          onChangeText={text => {
            getAutocomplete(text)
            setValue(text)
            setLoader(true)
          }}
          value={value}

        />


      </View>


      <View style={tw`w-full pl-3 flex`} >
        {originDescription.formattedAddress &&
          <Text style={tw`flex items-center text-[15px] text-[#666] py-1 `} >
            <Icon
              style={tw`pr-1`}
              type='fontawesome' color='black' name='circle' size={10}
            />
            {originDescription.formattedAddress}
          </Text>}
        {destinationDescription.formattedAddress &&
          <Text style={tw`flex items-center text-[15px] text-[#666] py-1 `} >
            <Icon
              style={tw`pr-1`}
              type='fontawesome' color='black' name='circle' size={10}
            />
            {destinationDescription.formattedAddress}
          </Text>}
      </View>

      {/* Render the sugestions List */}

      {value.length >= 2 && <View>
        {autocomplete.length > 0 ? <View style={{ maxHeight: 400, overflow: 'scroll', borderTopWidth: 1, borderColor: '#eee' }}>

          <FlatList
            data={autocomplete}
            keyExtractor={(item) => item.latitude + item.longitude}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => { setValue(item.formattedAddress); handlePlace(item.latitude, item.longitude, item.addressLabel); setLoader(false) }}>
                <Text style={tw`py-3 px-2 text-[17px] `}  > {item.formattedAddress} </Text>

              </TouchableOpacity>
            )} />


        </View> : loader && <ActivityIndicator size="large" style={[tw`py-5 `, { borderTopWidth: 1, borderColor: '#eee' }]} color="#000000" />
        }
      </View>
      }





    </SafeAreaView>
  )
}

export default Selector

const styles = StyleSheet.create({})