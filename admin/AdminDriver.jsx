import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAllDrivers } from '../services/graphql';
import tw from 'twrnc'
import { ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { FlatList } from 'react-native';
import { selectedDriverAtom } from '../atoms/admin';
import { useRecoilState } from 'recoil'
import { TextInput } from 'react-native';


const AdminDriver = ({ navigation }) => {
    const [drivers, setDrivers] = useState([])
    const [driver, setDriver] = useRecoilState(selectedDriverAtom)

    const [search, setSearch] = useState('')

    const getUsers = () => {
        console.log('call')
        getAllDrivers(search)
        .then((data) => {
            setDrivers(data)
        })
        .catch((err) => {
            console.log(err);
            getUsers()
        })

    }
    useEffect(() => {
        getUsers()
    }, [search]);

    return (
        <View style={tw`flex-1 flex bg-white px-2`} >


            <View style={tw`flex flex-row  justify-between relative items-center border-b border-[#eee] py-5 bg-gray-50 `} >
                <Text style={tw`text-[25px] font-bold`} >Conductores</Text>
                {drivers.length > 0 && <Text style={tw`text-20px py-2 px-3 bg-gray-200 rounded-lg`}> {drivers.length} </Text>}

                <View style={tw`absolute -bottom-6 w-full items-center `} >
                    <TouchableOpacity style={tw` p-3 rounded-full bg-white shadow-lg z-20 border border-[#aaa] `} onPress={() => { setDrivers([]); getUsers() }} >
                        <Icon
                            type='antdesign' color='black' size={20} name='reload1'
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <TextInput
                value={search}
                autoCapitalize='words'
                cursorColor='black'
                onChangeText={text => setSearch(text)}
                editable
                maxLength={40}
                placeholder='Buscar conductores'
                style={tw`absolute bottom-2 z-10 left-2 right-2 rounded-xl text-[18px] text-black shadow-sm border py-3 text-center`}

            />

            <View style={tw`flex-1 flex ${drivers.length === 0 ? 'items-center justify-center' : ''} `} >
                {drivers.length > 0 ?
                    <FlatList
                        data={drivers}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => { setDriver(item); navigation.navigate('DriverStatus') }}
                                style={tw`flex flex-row w-full items-center justify-between py-3 border-b border-[#eee] `} >
                                <View style={tw`flex flex-row items-center `} >
                                    <Icon
                                        type='antdesign' name='idcard'
                                        color='black' size={30}
                                        style={tw`pr-2`}
                                    />
                                    <View>
                                        <Text style={tw`text-lg font-bold`} > {item.name} </Text>
                                        <Text> +53 {item.phone} </Text>

                                    </View>
                                </View>


                                <View>
                                    <Icon
                                        type='antdesign' name='bank'
                                        color='black' size={20}
                                        style={tw`pb-3`}
                                    />
                                    <Text> {item.balance} c/u </Text>
                                </View>

                                <View>
                                    <Icon
                                        type='fontawesome5' name='lock'
                                        color='black' size={20}
                                        style={tw`pb-3`}
                                    />
                                    <Text> {item.password} </Text>
                                </View>

                            </TouchableOpacity>
                        )}
                    /> :
                    <ActivityIndicator size="large" color="black" />
                }
            </View>
        </View>
    )
}

export default AdminDriver

const styles = StyleSheet.create({})