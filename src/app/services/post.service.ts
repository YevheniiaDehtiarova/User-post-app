import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { postRoutes } from '../routes/post.routes';
import { Comment } from '../models/comment.interface';
import { Post } from '../models/post.class';
import { createdPost } from '../models/created-post.interface';

@Injectable()
export class PostService {
  constructor(private http: HttpClient) {}

  public getAllPosts(): Observable<Array<Post>> {
    const apiUrl = postRoutes.getAll;

    return this.http.get<Array<Post>>(apiUrl);
  }

  public getPostById(id: string): Observable<Post> {
    const apiUrl = postRoutes.getById.replace('${id}', id);

    return this.http.get<Post>(apiUrl);
  }

  public createPost(post: createdPost): Observable<Post> {
    const apiUrl = postRoutes.create;

    return this.http.post<Post>(apiUrl, post);
  }

  public updatePost(id: string, post: Post): Observable<Post> {
    const apiUrl = postRoutes.update.replace('${id}', id);

    return this.http.put<Post>(apiUrl, post);
  }

  public deletePost(id: string): Observable<Post> {
    const apiUrl = postRoutes.delete.replace('${id}', id);

    return this.http.delete<Post>(apiUrl);
  }

  public getComments(): Observable<Array<Comment>> {
    const apiUrl = postRoutes.getComments;

    return this.http.get<Array<Comment>>(apiUrl);
  }

  public getCommentById(id: string): Observable<Array<Comment>> {
    return this.getComments().pipe(
      map((comments: Array<Comment>) => {
        return comments.filter((comment: Comment) => {
          return comment.postId == id;
        });
      })
    );
  }
}
