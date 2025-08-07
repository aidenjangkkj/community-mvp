import React from 'react';
import { Pressable, Text } from 'react-native';
import { Post } from '../types';

interface Props {
  post: Post;
  onPress: () => void;
}

const PostItem: React.FC<Props> = ({ post, onPress }) => (
  <Pressable className="p-4 border-b border-gray-200" onPress={onPress}>
    <Text className="text-lg">{post.title}</Text>
  </Pressable>
);

export default PostItem;