import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base';
import { TouchableOpacity } from 'react-native';
import { selectedRequestAtom } from '../atoms/admin';
import { useRecoilState } from 'recoil'
import tw from 'twrnc'
import { publishDriver } from '../services/graphql';

const DriverDetail = ({navigation}) => {
    const [driver, setDriver] = useRecoilState(selectedRequestAtom)

    const acceptDriver = () =>{
        publishDriver(driver.id).then(() => navigation.navigate('AdminDriverRequests') ).catch(() => { console.log('fail') ,acceptDriver()})
    }

    return (
        <View style={tw`px-3 pt-5 flex-1 bg-white`}>
            <View style={tw`flex  w-full pb-5 border-b border-[#eee] `} >

                <View>

                    <View style={tw`flex flex-row items-center py-1`} >

                        <Text style={tw`text-[25px] font-semibold`} > {driver.name} </Text>
                    </View>

                    <Text> +53 {driver.phone} </Text>
                </View>

                <View style={tw`flex flex-row items-center justify-between pt-4`} >
                <TouchableOpacity style={tw`flex-row items-center bg-black justify-center px-3 py-2 border rounded-xl shadow-sm`} onPress={() => {}} >
                        <Icon
                            type='antdesign' color='white' size={28} name='deleteuser'
                        />
                        <Text style={tw`text-white`} >Negar solicitud</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={tw`flex-row items-center justify-center px-3 py-2 border rounded-xl shadow-sm`} onPress={acceptDriver} >
                        <Icon
                            type='antdesign' color='black' size={28} name='check' style={tw`pr-2`}
                        />
                        <Text >Verificar</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default DriverDetail

const styles = StyleSheet.create({})