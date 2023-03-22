import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAllUsers } from '../services/graphql';
import tw from 'twrnc'
import { ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/base';
import { FlatList } from 'react-native';
import { adminUserId } from '../atoms/admin';
import { useRecoilState } from 'recoil'


const AdminUsers = ({ navigation }) => {
    const [users, setUsers] = useState([])
    const [userTrip, setUserTrip] = useRecoilState(adminUserId)

    const getUsers = () => {
        console.log('call')
        getAllUsers().then((data) => {
            setUsers(data)
            console.log(data)
        }
        )
            .catch((err) => {
                console.log(err);
                getUsers()
            }
            )

    }
    console.log(users)

    useEffect(() => {
        getUsers()
    }, []);
    return (
        <View style={tw`flex-1 flex bg-white px-2`} >

            <View style={tw`flex flex-row  justify-between relative items-center border-b border-[#eee] py-5 bg-gray-50 `} >
                <Text style={tw`text-[25px] font-bold`} >Usuarios</Text>
                {users.length > 0 && <Text style={tw`text-20px py-2 px-3 bg-gray-200 rounded-lg`}> {users.length} </Text>}

                <View style={tw`absolute -bottom-6 w-full items-center `} >
                    <TouchableOpacity style={tw` p-3 rounded-full bg-white shadow-lg z-20 border border-[#aaa] `} onPress={() => { setUsers([]); getUsers() }} >
                        <Icon
                            type='antdesign' color='black' size={20} name='reload1'
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={tw`flex-1 flex ${users.length === 0 ? 'items-center justify-center' : ''} `} >
                {users.length > 0 ?
                    <FlatList
                        data={users}
                        style={tw`pt-5`}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => { setUserTrip(item); navigation.navigate('UserTrips') }}
                                style={tw`flex flex-row w-full items-center justify-between py-3 border-b border-[#eee] `} >
                                <View style={tw`flex flex-row items-center`} >
                                    <Icon
                                        type='entypo' name='user'
                                        color='black' size={30}
                                        style={tw`pb-3`}
                                    />
                                    <View>
                                        <Text style={tw`text-lg font-bold`} > {item.name} </Text>
                                        <Text> +53 {item.phone} </Text>

                                    </View>
                                </View>

                                <View>
                                    <Icon
                                        type='entypo' name='lock'
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

export default AdminUsers

const styles = StyleSheet.create({})