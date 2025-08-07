import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace('PostList');
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white p-4">
      <TextInput
        className="mb-4 rounded-md border-2 border-gray-500 px-3 py-2"
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="mb-4 rounded-md border-2 border-gray-500 px-3 py-2"
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity className="mb-2 rounded-md bg-blue-500 py-3" onPress={handleLogin}>
        <Text className="text-center font-semibold text-white">로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="py-3 rounded-md border border-gray-400 bg-white"
        onPress={() => navigation.navigate('Register')}>
        <Text className="text-center font-semibold text-blue-500">회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;