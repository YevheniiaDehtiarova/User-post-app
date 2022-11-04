
import {Comment} from '../models/comment.interface';

export class Post {
  userId: string;
  id: string;
  title: string;
  body: string;
  comments?: Array<Comment>;
}