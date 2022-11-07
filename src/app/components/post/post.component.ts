import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostModalService } from 'src/app/services/post-modal.service';
import { Comment } from 'src/app/models/comment.interface';
import { PostService } from 'src/app/services/post.service';
import { DEFAULT_POST } from 'src/app/models/default-post';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post.class';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() posts: Array<Post> = [];
  public comments$: Observable<Array<Comment>>;
  public isPostModalDialogVisible: boolean = false;
  public showComments: boolean = false;
  public post: Post;
  public userId: string;
  public commentsSubscription: Subscription;
  public modalStatusSubscription: Subscription;
  public postsWithComments: Array<Post>;
  public findElement: Post;

  constructor(
    private postModalService: PostModalService,
    private postFormStateService: PostFormStateService,
    private postService: PostService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    if (this.commentsSubscription) {
      this.commentsSubscription.unsubscribe();
    }
    if (this.modalStatusSubscription) {
      this.modalStatusSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    //this.userId = this.activateRoute.snapshot.paramMap.get('id') as string; // find how to test
   this.calculateUserId();
    this.getModalStatus();
    this.posts?.map((post: Post) => {
      this.createCommentSubscription(post)
    });
  }

  public calculateUserId(): string{
    this.userId = this.activateRoute.snapshot.paramMap.get('id') as string;
    return this.userId;
  }

  public createCommentSubscription(post: Post): Subscription {
    this.comments$ = this.postService.getCommentById(post.id);
    return this.commentsSubscription = this.comments$.subscribe(
      (comment: Array<Comment>) => {
        this.posts.forEach((post) => {
          if (post.id == comment[0]?.postId) {
            post.comments = comment;
            this.splicePosts(post, this.posts);
            this.postsWithComments = [...this.posts];
          }
        });
      }
    );
  }

  public getModalStatus(): void {
    this.modalStatusSubscription = this.postModalService
      .getModalStatus()
      .subscribe((isModalDialogVisible) => {
        this.isPostModalDialogVisible = isModalDialogVisible;
      });
  }

  public addPost(): void {
    this.post = DEFAULT_POST;
    this.postFormStateService.changeFormStatus(false);
   this.changePostModalDialogVisible();
  }

  public editPost(post: Post): void {
    this.post = post;
    this.changePostModalDialogVisible();
    this.postFormStateService.changeFormStatus(true);
    this.postFormStateService.setInitialFormState(post);
  }

  public changePostModalDialogVisible(): void {
    this.isPostModalDialogVisible = true;
    this.postModalService.modalOpen();
  }

  public deletePost(post: Post): void {
    this.postService.deletePost(post.id).subscribe((data) => {
      this.posts = this.posts.filter((item) => post.id !== item.id);
    });
  }

  public viewUpdatedPost(event: Post): void {
    this.findElement = this.posts?.find((post) => post.id === event.id) as Post;
    event.comments = this.postsWithComments?.find(
      (post) => post.id === event.id
    )?.comments || [];
    this.splicePosts(this.findElement, this.posts);
  }

  public showHideComments(): void {
    this.showComments = !this.showComments;
  }

  public viewCreatedPost(event: Post): void {
    this.posts.push(event);
  }

  public splicePosts(post: Post, posts: Post[]): Post [] {
    const index = posts.indexOf(post);
    return posts.splice(index, 1, post);
  }

}
