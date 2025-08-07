import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const CreatePostScreen: React.FC<Props> = ({ navigation }) => {
  const defaultNickname = auth.currentUser?.displayName || '익명';
  const [nickname, setNickname] = useState<string>(defaultNickname);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
      if (!result.canceled) setImageUrl(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('잠깐!', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    const author = nickname.trim() || defaultNickname;
    try {
      await addDoc(collection(db, 'posts'), {
        author,
        title,
        content,
        imageUrl: imageUrl || null,
        createdAt: serverTimestamp(),
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('오류', error.message);
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
              <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        placeholder="닉네임(미 작성 시 익명으로 표기)"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className="border border-gray-300 rounded-md px-3 py-2 h-24 mb-4"
        placeholder="내용"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Pressable className="bg-yellow-500 rounded-md py-2 mb-4" onPress={pickImage}>
        <Text className="text-center text-white font-semibold">이미지 선택</Text>
      </Pressable>
      {imageUrl && <Image source={{ uri: imageUrl }} className="w-full h-48 mb-4 rounded-md" />}
      <Pressable className="bg-blue-500 rounded-md py-3" onPress={handleSubmit}>
        <Text className="text-center text-white font-semibold">작성</Text>
      </Pressable>
    </View>
  );
};

export default CreatePostScreen;