// src/screens/PostListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Post } from '../../types';
import { db } from '../firebase/firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import PostItem from '../../components/PostItem';

type Props = NativeStackScreenProps<RootStackParamList, 'PostList'>;

export default function PostListScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setPosts(
        snap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, 'id'>),
        }))
      );
    });
    return () => unsub();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={posts}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
          />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-8">
            아직 작성된 글이 없습니다.
          </Text>
        }
      />
      <Pressable
        className="absolute bottom-8 right-8 bg-blue-600 rounded-full p-4 shadow-lg"
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text className="text-white text-2xl">＋</Text>
      </Pressable>
    </View>
  );
}
