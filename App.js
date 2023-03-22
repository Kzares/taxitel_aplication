import { KeyboardAvoidingView } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './screens/MapScreen';
import { Platform } from 'react-native';
import { RecoilRoot, useRecoilState } from 'recoil';
import LoginScreen from './screens/LoginScreen';
import ReactNativeRecoilPersist, {
  ReactNativeRecoilPersistGate,
} from "react-native-recoil-persist";

export default function App() {
  const Stack = createNativeStackNavigator();


  return (
    <RecoilRoot>
      <ReactNativeRecoilPersistGate store={ReactNativeRecoilPersist}>
        <NavigationContainer>
          <SafeAreaProvider>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : 0}
              style={{ flex: 1 }}>

              <Stack.Navigator>


                <Stack.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={{
                  headerShown: false
                }} /> 

              {/** */}
              </Stack.Navigator>


            </KeyboardAvoidingView>
          </SafeAreaProvider>

        </NavigationContainer>
      </ReactNativeRecoilPersistGate>
    </RecoilRoot >
  );
}
