// File: src/screens/PostDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Comment } from '../../types';
import CommentItem from '../../components/CommentItem';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { formatTimestamp } from '../utils/formatTimestamp';

type DetailProps = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

const PostDetailScreen: React.FC<DetailProps> = ({ route }) => {
  const { post } = route.params;
  const [nickname, setNickname] = useState<string>('익명');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const commentsRef = collection(db, 'posts', post.id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        postId: post.id,
        ...(doc.data() as Omit<Comment, 'id' | 'postId'>)
      }));
      setComments(list);
    });
    return () => unsubscribe();
  }, [post.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('잠깐!', '댓글을 입력해주세요.');
      return;
    }
    try {
      await addDoc(collection(db, 'posts', post.id, 'comments'), {
        text: newComment.trim(),
        createdAt: serverTimestamp(),
        author: nickname.trim(),
      });
      setNewComment('');
    } catch (error: any) {
      Alert.alert('오류', error.message);
    }
  };
  const formattedDate = formatTimestamp(post.createdAt);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentItem comment={item} />}
        ListHeaderComponent={
          <View className="p-4">
            <Text className="text-2xl font-bold mb-2">{post.title}</Text>
            <Text className="text-sm text-gray-500 mb-2">
              작성자: {post.author} | 작성일: {formattedDate}
            </Text>
            <Text className="text-base mb-4">{post.content}</Text>
            {post.imageUrl && (
              <Image
                source={{ uri: post.imageUrl }}
                className="w-full h-48 mb-4 rounded-md"
                resizeMode="stretch"
              />
            )}
            <Text className="text-lg font-semibold ml-1 mb-2">댓글</Text>
          </View>
        }
        ListFooterComponent={
          <View className="p-4">
            <View className='flex-row items-center'>
                <Text className='mr-2 mb-2'>닉네임</Text>
            <TextInput
                    className="border border-gray-300 rounded-md mb-2 text-center"
                    placeholder="미 작성 시 익명으로 표기"
                    value={nickname}
                    onChangeText={setNickname}
                  />
            </View>
            
            <TextInput
              className="border border-gray-300 rounded-md px-3 py-2 mb-2"
              placeholder="댓글을 입력해주세요"
              value={newComment}
              onChangeText={setNewComment}
            />
            
            <Pressable className="bg-green-500 rounded-md py-2" onPress={handleAddComment}>
              <Text className="text-center text-white font-semibold">댓글 등록</Text>
            </Pressable>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

export default PostDetailScreen;
