import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Post } from '../../types';
import { db } from '../firebase/firebaseConfig';
import { formatTimestamp } from '../utils/formatTimestamp';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'PostList'>;

const PostListScreen: React.FC<Props> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Post, 'id'>) }));
      setPosts(list);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 p-4 bg-white">
<FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const date = formatTimestamp(item.createdAt);
          return (
            <Pressable
              className="p-4 border-b border-gray-200"
              onPress={() => navigation.navigate('PostDetail', { post: item })}
            >
              <Text className="text-lg font-bold mb-1">{item.title}</Text>
              <Text className="text-sm text-gray-500">
                {item.author} | {date}
              </Text>
            </Pressable>
          );
        }}
        className="mb-4"
      />
      <Pressable className="bg-blue-500 rounded-md py-3" onPress={() => navigation.navigate('CreatePost')}>
        <Text className="text-center text-white font-semibold">글쓰기</Text>
      </Pressable>
    </View>
  );
};

export default PostListScreen;
