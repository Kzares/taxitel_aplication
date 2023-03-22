import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/base'
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native'
import { useRecoilState } from 'recoil'
import { showDestinationAtom } from '../atoms/locationAtoms'


const data = [
    {
        id: '123',
        icon: 'home',
        location: 'Inicio',
        destination: 'Personalize su punto de partida',
        show: false,
    },
    {
        id: 456,
        icon: 'briefcase',
        location: 'Destino',
        destination: 'Seleccione su destino manualmente',
        show: true,
    }
]

const NavSelectors = () => {
    const navigation = useNavigation()
    const [showDestination, setShowDestination] = useRecoilState(showDestinationAtom);

    const navigateMap = (show) =>{
        setShowDestination(show)
        navigation.navigate('MapScreen')
    }

    return (


        <FlatList data={data} keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={[tw`bg-gray-200`, { height: 0.5 }]} />}
            renderItem={({ item: { location, destination, icon ,show} }) => (
                <TouchableOpacity style={tw`flex-row items-center p-5 pl-0 w-full `} onPress={() => navigateMap(show)}>
                    <Icon style={tw`mr-4 rounded-full bg-gray-300 p-3`}
                        name={icon}
                        type='ionicon'
                        color='white'
                        size={18}
                    />
                    <View>
                        <Text style={tw`font-semibold text-lg`}> {location}</Text>
                        <Text style={tw`text-gray-500 `}> {destination}  </Text>
                    </View>
                </TouchableOpacity>

            )}
        />
    )
}

export default NavSelectors

const styles = StyleSheet.create({})