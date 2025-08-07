// src/components/PostItem.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Post } from '../types';
import { formatTimestamp } from '../src/utils/formatTimestamp';

interface Props {
  post: Post;
  onPress: () => void;
}

const PostItem: React.FC<Props> = ({ post, onPress }) => {
  const date = formatTimestamp(post.createdAt);
  return (
    <Pressable onPress={onPress} className="mb-4">
      <View className="bg-white rounded-2xl shadow-md p-4">
        <Text className="text-xl font-semibold mb-1 text-gray-900">
          {post.title}
        </Text>
        <Text className="text-sm text-gray-500 mb-2">
          {post.author} · {date}
        </Text>
        <Text
          className="text-base text-gray-700 line-clamp-2"
          numberOfLines={2}
        >
          {post.content}
        </Text>
      </View>
    </Pressable>
  );
};

export default PostItem;
