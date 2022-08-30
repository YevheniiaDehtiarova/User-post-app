import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createdPost, Post } from '../models/post.interface';
import { postRoutes } from '../routes/post.routes';

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
}