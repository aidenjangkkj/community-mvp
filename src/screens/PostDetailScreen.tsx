// src/screens/PostDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Comment } from '../../types';
import { db, auth } from '../firebase/firebaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { formatTimestamp } from '../../src/utils/formatTimestamp';
import CommentItem from '../../components/CommentItem';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export default function PostDetailScreen({ route, navigation }: Props) {
  const { post } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const user = auth.currentUser;
  const nickname = user?.displayName ?? '익명';

  useEffect(() => {
    const q = query(collection(db, 'posts', post.id, 'comments'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) =>
      setComments(snap.docs.map((d) => ({ id: d.id, postId: post.id, ...(d.data() as any) })))
    );
    return () => unsub();
  }, [post.id]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'posts', post.id, 'comments'), {
      author: nickname,
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
    setText('');
  };
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'posts', post.id));
      Alert.alert('알림', '글을 삭제 했습니다.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('오류', '삭제에 실패했습니다.');
    }
  };

  const date = formatTimestamp(post.createdAt);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FlatList
        data={comments}
        keyExtractor={(c) => c.id}
        ListHeaderComponent={() => (
          <>
            <View className="m-4 rounded-2xl bg-white p-4 shadow">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="flex-1 text-2xl font-bold text-gray-900">{post.title}</Text>
                {user?.uid === post.authorUid && (
                  <Pressable
                    className="flex-none rounded-md bg-red-500 px-3 py-2"
                    onPress={handleDelete}>
                    <Text className="text-white">삭제</Text>
                  </Pressable>
                )}
              </View>
              <Text className="mb-3 text-sm text-gray-500">
                {post.author} | {date}
              </Text>
              {post.imageUrl && (
                <Image
                  source={{ uri: post.imageUrl }}
                  resizeMode="contain"
                  className="mb-3 h-48 w-full rounded-lg"
                />
              )}
              <Text className="text-base text-gray-700">{post.content}</Text>
            </View>
            <Text className="mx-4 mb-2 mt-4 text-lg font-semibold">댓글</Text>
          </>
        )}
        renderItem={({ item }) => <CommentItem comment={item} />}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <View className="absolute bottom-0 w-full flex-row items-center border-t border-gray-200 bg-white p-4">
        <TextInput
          className="mr-2 flex-1 rounded-full border border-gray-300 px-4 py-2"
          placeholder="댓글을 입력하세요..."
          value={text}
          onChangeText={setText}
        />
        <Pressable className="rounded-full bg-blue-600 px-4 py-2" onPress={handleAdd}>
          <Text className="text-white">작성</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
