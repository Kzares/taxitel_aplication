import { StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import MapView, { Marker } from 'react-native-maps';
import tw from 'twrnc'
import { useRecoilState } from 'recoil';
import { destinationAtom, destinationDescriptionAtom, originAtom, originDescriptionAtom, selectedDestination, showDestinationAtom } from '../atoms/locationAtoms';
import { themeAtom } from '../atoms/themeAtom';
import { darkMap } from '../services/map.js';
import axios from 'axios';
import { getDriversLocation } from '../services/graphql';
import moment from 'moment'

const Map = () => {

  //Global States
  const [origin, setOrigin] = useRecoilState(originAtom)
  const [showDestination, setShowDestination] = useRecoilState(showDestinationAtom)
  const [destination, setDestination] = useRecoilState(destinationAtom)
  const [selectDestin, setSelectDestination] = useRecoilState(selectedDestination)

  //Dark theme global
  const [theme, setTheme] = useRecoilState(themeAtom)

  //Setting a new coordinates when the screen is touched

  const handleOrigin = (latitude, longitude, description) => {

    if (selectDestin) {
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
    mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
    })

  }

  const screenTouch = (coordinates) => {
    handleOrigin(coordinates.latitude, coordinates.longitude, '')

    setTimeout(() =>{
      handleOrigin(coordinates.latitude, coordinates.longitude, 'Ubicacion Personalizada')
    }, 1)
  }

  //Getting the places info
  const [originDescription, setOriginDescription] = useRecoilState(originDescriptionAtom)
  const [destinationDescription, setDestinationDescription] = useRecoilState(destinationDescriptionAtom)

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


  //Map Ref and rezising the map
  const mapRef = useRef(null)
  useEffect(() => {
    if (!showDestination) return
    mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: { top: 200, right: 200, bottom: 200, left: 200 }
    })
    

  }, [origin, destination]);

  //rendering the available Drivers
  const [drivers, setDrivers] = useState([])
  useEffect(() =>{
    getDriversLocation().then(data => setDrivers(data))
  }, [])  


  return (
    <MapView
      ref={mapRef}
      customMapStyle={theme === 'black' ? darkMap : []}
      style={tw`flex-1`}
      initialRegion={{
        latitude: 23.138952,
        longitude: -82.355315  ,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onPress={location => screenTouch(location.nativeEvent.coordinate)}
      
    >
      {showDestination && (
        <Marker
          draggable
          onDragEnd={(e) => {
            setDestination({
              description: 'Destino Personalizado',
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
            getDescription(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, 'destination')

          }}
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
          title='Destino'
          description={destination.description}
          identifier='destination'
          pinColor='green'
        />
      )}

      {origin?.latitude && (
        <Marker
          draggable
          title='Origen'
          description={origin.description}
          identifier='origin'
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          onDragEnd={(e) => {
            setOrigin({
              description: 'Ubicacion Personalizada',
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude
            })
            getDescription(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, 'origin')

          }}
        />
      )}

      {/* Rendering the list of drivers */}
      {drivers.length > 0 && drivers.map((item, index) => (
                    <Marker
                        title={`Conductor: ${item.name} `}
                        description={`Última ubicación conocida: ${moment(item.publishedAt).fromNow()}`}
                        key={index}
                        coordinate={{
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                        }}
                        pinColor='yellow'
                    />
                ))}
    </MapView>
  )
}

export default Map

const styles = StyleSheet.create({})