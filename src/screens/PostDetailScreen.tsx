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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Comment } from '../../types';
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { formatTimestamp } from '../../src/utils/formatTimestamp';
import CommentItem from '../../components/CommentItem';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export default function PostDetailScreen({ route }: Props) {
  const { post } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'posts', post.id, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, snap =>
      setComments(
        snap.docs.map(d => ({ id: d.id, postId: post.id, ...(d.data() as any) }))
      )
    );
    return () => unsub();
  }, [post.id]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'posts', post.id, 'comments'), {
      author: '익명',
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
    setText('');
  };

  const date = formatTimestamp(post.createdAt);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={comments}
        keyExtractor={c => c.id}
        ListHeaderComponent={
          <View className="bg-white rounded-2xl shadow p-4 m-4">
            <Text className="text-2xl font-bold mb-1 text-gray-900">
              {post.title}
            </Text>
            <Text className="text-sm text-gray-500 mb-3">
              {post.author} · {date}
            </Text>
            {post.imageUrl && (
              <Image
                source={{ uri: post.imageUrl }}
                resizeMode="contain"
                className="w-full h-48 rounded-lg mb-3"
              />
            )}
            <Text className="text-base text-gray-700">{post.content}</Text>
            <Text className="text-lg font-semibold mt-6">댓글</Text>
          </View>
        }
        renderItem={({ item }) => <CommentItem comment={item} />}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <View className="absolute bottom-0 w-full bg-white p-4 border-t border-gray-200 flex-row items-center">
        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
          placeholder="댓글을 입력하세요..."
          value={text}
          onChangeText={setText}
        />
        <Pressable
          className="bg-blue-600 rounded-full px-4 py-2"
          onPress={handleAdd}
        >
          <Text className="text-white">전송</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
