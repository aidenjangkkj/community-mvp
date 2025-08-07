export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;    
  createdAt: any;
}

export interface Comment {
  id: string;
  postId: string;
  text: string;
  author: string;
  createdAt: any;
}