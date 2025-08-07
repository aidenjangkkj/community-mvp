// src/components/CommentItem.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Comment } from '../types';
import { format } from 'date-fns';

interface Props {
  comment: Comment;
}

const CommentItem: React.FC<Props> = ({ comment }) => {
  const date = comment.createdAt?.toDate
    ? format(comment.createdAt.toDate(), 'yyyy-MM-dd HH:mm')
    : '';
  return (
    <View className="p-2 border-b border-gray-100">
      <Text className="text-sm text-gray-500 mb-1">
        {comment.author} | {date}
      </Text>
      <Text className="text-base">{comment.text}</Text>
    </View>
  );
};

export default CommentItem;
