
import {Comment} from '../models/comment.interface'
export interface Post {
  userId: string;
  id: string;
  title: string;
  body: string;
  comments?: Array<Comment>;
}

export interface createdPost {
  userId: string;
  title: string;
  body: string;
}
