import { Component, Input, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostModalService } from 'src/app/services/post-modal.service';
import { Comment } from 'src/app/models/comment.interface';
import { PostService } from 'src/app/services/post.service';
import { DEFAULT_POST } from 'src/app/models/default-post';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post.class';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent extends BaseComponent implements OnInit {
  @Input() posts: Array<Post> = [];
  public comments$: Observable<Array<Comment>>;
  public isPostModalDialogVisible: boolean = false;
  public showComments: boolean = false;
  public post: Post;
  public userId: string;
  public postsWithComments: Array<Post>;

  constructor(
    private postModalService: PostModalService,
    private postFormStateService: PostFormStateService,
    private postService: PostService,
    private activateRoute: ActivatedRoute
  ) {
    super();
  }


  ngOnInit(): void {
    this.calculateUserId();
    this.getModalStatus();
    this.initPostsWithcomments(this.posts);
  }


  public initPostsWithcomments(posts: Post[]): void {
    posts?.map((post: Post) => {
      this.createCommentSubscription(post);
    });
  }

  public calculateUserId(): string {
    this.userId = this.activateRoute.snapshot.paramMap.get('id') as string;
    return this.userId;
  }

  public createCommentSubscription(post: Post): void {
    this.comments$ = this.commentObservable(post.id);
     this.comments$.pipe(takeUntil(this.destroy$)).subscribe(
      (comment: Array<Comment>) => {
        this.modifyPosts(this.posts, comment);
      }
    );
  
  }

  public commentObservable(id: string): Observable<Array<Comment>>{
    return this.postService.getCommentById(id)
  }

  public modifyPosts(posts: Post [],comment: Array<Comment>): void {
    posts.forEach((post) => {
      if (post.id == comment[0]?.postId) {
        post.comments = comment;
        this.splicePosts(post, this.posts);
        this.definePostsWithComments(this.posts)
      }
    });
  }

  public definePostsWithComments(posts: Post []): void {
    this.postsWithComments = [...posts];
  }

  public getModalStatus(): void {
   this.postModalService
      .getModalStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isModalDialogVisible) => {
        this.isPostModalDialogVisible = isModalDialogVisible;
      });
  }

  public addPost(): void {
    this.post = DEFAULT_POST;
    this.changeFormStatus(false);
    this.changePostModalDialogVisible();
  }

  public editPost(post: Post): void {
    this.post = post;
    this.changePostModalDialogVisible();
    this.changeFormStatus(true);
    this.postFormStateService.setInitialFormState(post);
  }

  public changeFormStatus(value: boolean): void {
    this.postFormStateService.changeFormStatus(value);
  }

  public changePostModalDialogVisible(): void {
    this.isPostModalDialogVisible = true;
    this.postModalOpen();
  }

  public postModalOpen(): void {
    this.postModalService.modalOpen();
  }

  public deletePost(post: Post): void {
    this.postService.deletePost(post.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.filterPost(this.posts, post)
    });
  }

  public filterPost(posts: Post[], post: Post): void {
    this.posts = posts.filter((item) => post.id !== item.id);
  }

  public viewUpdatedPost(event: Post): void {
    const findElement = this.posts.find((post) => post.id === event.id);
    if (findElement){
      findElement.comments =
      this.postsWithComments?.find((post) => post.id === event.id)?.comments ||
      []; 
      this.splicePosts(findElement, this.posts);
    }
  }

  public showHideComments(): void {
    this.showComments = !this.showComments;
  }

  public viewCreatedPost(event: Post): void {
    this.posts.push(event);
  }

  public splicePosts(post: Post, posts: Post[]): Post[] {
    const index = posts.indexOf(post);
    return posts.splice(index, 1, post);
  }
}
