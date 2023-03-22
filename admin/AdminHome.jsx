import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { sesionAtom } from '../atoms/sesionAtom';
import { useRecoilState } from 'recoil';
import tw from 'twrnc'

const AdminHome = ({ navigation }) => {
    const [sesion, setSesion] = useRecoilState(sesionAtom)
   

    return (
        <SafeAreaView style={tw`px-3 pt-5 flex-1 bg-white`} >

           

            <View style={tw`flex flex-row items-center justify-between w-full pb-5 border-b border-[#eee] `} >

                <View>

                    <View style={tw`flex flex-row items-center py-1`} >
                        <Icon
                            type='antdesign' color='black' size={28} name='user'
                        />
                        <Text style={tw`text-[25px] font-semibold`} > {sesion.name} </Text>
                    </View>

                    <Text> +53 {sesion.number} </Text>
                </View>

                <TouchableOpacity onPress={() => {
                    setSesion({});
                }} >
                    <Icon
                        type='materialicons' color='black' size={28} name='logout'
                    />
                    <Text >Cerrar Sesion</Text>
                </TouchableOpacity>

            </View>

            {/* The admin selections */}

            <ScrollView>

                <TouchableOpacity style={tw`flex-row items-center p-5 pl-0 w-full `} onPress={() => navigation.navigate('AdminUsers')}>
                    <Icon style={tw`mr-4 rounded-full bg-gray-400 p-3`}
                        color='white'
                        size={18}
                        type='entypo' name='user'
                    />
                    <View>
                        <Text style={tw`font-semibold text-lg`}> Usuarios </Text>
                        <Text style={tw`text-gray-500 `}> Lista de todos los usuarios registrados</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity style={tw`flex-row items-center p-5 pl-0 w-full `} onPress={() => navigation.navigate('AdminDriver')}>
                    <Icon style={tw`mr-4 rounded-full bg-gray-400 p-3`}
                        name='car'
                        type='fontisto'
                        color='white'
                        size={18}
                    />
                    <View>
                        <Text style={tw`font-semibold text-lg`}> Conductores </Text>
                        <Text style={tw`text-gray-500 `}> Lista de todos los conductores verificados</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity style={tw`flex-row items-center p-5 pl-0 w-full `} >
                    <Icon style={tw`mr-4 rounded-full bg-gray-400 p-3`}
                        name='lock-clock'
                        type='materialicons'
                        color='white'
                        size={18}
                    />
                    <View>
                        <Text style={tw`font-semibold text-lg`}> Solicitudes de cuentas </Text>
                        <Text style={tw`text-gray-500 flex-1`}> Solicitudes de verificación de cuentas de conductores</Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity style={tw`flex-row items-center p-5 pl-0 w-full `} onPress={() => navigation.navigate('AdminTrips')} >
                    <Icon style={tw`mr-4 rounded-full bg-gray-400 p-3`}
                        name='list'
                        type='entypo'
                        color='white'
                        size={18}
                    />
                    <View>
                        <Text style={tw`font-semibold text-lg`}> Lista de Viajes</Text>
                        <Text style={tw`text-gray-500 flex-1`}> Lista de todos los viajes activos</Text>
                    </View>

                </TouchableOpacity>


            </ScrollView>

        </SafeAreaView>
    )
}

export default AdminHome

const styles = StyleSheet.create({})