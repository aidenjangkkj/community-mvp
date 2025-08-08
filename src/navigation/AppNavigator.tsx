import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PostListScreen from '../screens/PostListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import { Post } from 'types';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  PostList: undefined;
  PostDetail: { post: Post };
  CreatePost: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="PostList" component={PostListScreen} options={{ title: '전체글' }} />
    <Stack.Screen
      name="PostDetail"
      component={PostDetailScreen}
      options={({ route }) => ({ title: route.params.post.title })}
    />
    <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: '글쓰기' }} />
  </Stack.Navigator>
);

export default AppNavigator;