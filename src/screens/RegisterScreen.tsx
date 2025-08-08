import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const handleRegister = async () => {
   if (!nickname.trim()) {
     Alert.alert('Validation', '닉네임을 입력해주세요.');
     return;
   }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
     // 프로필에 닉네임 저장
     await updateProfile(userCred.user, { displayName: nickname.trim() });
      navigation.replace('Login');
    } catch (error: any) {
      Alert.alert('회원 가입 오류', error.message);
    }
  };
  return (
    <View className="flex-1 justify-center p-4 bg-white">
           <TextInput
       className="border border-gray-300 rounded-md px-3 py-2 mb-4"
       placeholder="닉네임"
       value={nickname}
       onChangeText={setNickname}
     />
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable className="bg-green-500 rounded-md py-3" onPress={handleRegister}>
        <Text className="text-center text-white font-semibold">회원가입</Text>
      </Pressable>
    </View>
  );
};

export default RegisterScreen;