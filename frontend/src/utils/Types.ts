export interface Comment {
  _id: string;
  content: string;
  username: string;
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  picture?: string;
  comments: Comment[];
  author: string;
  authorAvatar: string;
  userId: string;
}

export interface NewPost {
  title: string;
  description: string;
  picture: string;
  userId: string;
}