import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { db,storage,auth } from '../firebase/firebaseConfig';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const CreatePostScreen: React.FC<Props> = ({ navigation }) => {
    const user = auth.currentUser;
    const nickname = user?.displayName ?? '익명';
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
    if (!nickname.trim() || !title.trim() || !content.trim()) {
      Alert.alert('잠깐!', '제목, 내용을 모두 입력해주세요.');
      return;
    }

    let downloadUrl: string | null = null;
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();


        const fileRef = storageRef(storage, `posts/${Date.now()}`);


        await uploadBytes(fileRef, blob);

        downloadUrl = await getDownloadURL(fileRef);
      } catch (e: any) {
        Alert.alert('오류', '이미지 업로드에 실패했습니다.');
        return;
      }
    }

    try {
      await addDoc(collection(db, 'posts'), {
        author: nickname.trim(),
        authorUid: user!.uid,
        title: title.trim(),
        content: content.trim(),
        imageUrl: downloadUrl,
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