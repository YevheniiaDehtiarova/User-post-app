import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DEFAULT_POST } from '../models/default-post';
import { Post } from '../models/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostFormStateService {
  private initialPostFormState: BehaviorSubject<Post> = new BehaviorSubject<Post>(DEFAULT_POST);
  private isPostFormForEdit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public getFormStatus(): Observable<boolean> {
    return this.isPostFormForEdit.asObservable();
  }

  public getInitialFormState(): Observable<Post> {
    return this.initialPostFormState.asObservable();
  }

  public setInitialFormState(initState: Post): void {
    this.initialPostFormState.next(initState);
  }

  public changeFormStatus(status: boolean): void {
    this.isPostFormForEdit.next(status);
  }
}
