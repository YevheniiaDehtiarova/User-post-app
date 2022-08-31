import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.interface';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostModalService } from 'src/app/services/post-modal.service';
import { Comment } from 'src/app/models/comment.interface';
import { PostService } from 'src/app/services/post.service';
import { DEFAULT_POST } from 'src/app/models/default-post';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() posts: Array<Post>;
  public comments$: Observable<Array<Comment>>;
  public isPostModalDialogVisible: boolean = false;
  public showComments: boolean = false;
  public post: Post;
  public userId: string;
  public commentsSubscription: Subscription;
  public modalStatusSubscription: Subscription;
  public deletePostSubscription: Subscription;

  constructor(
    private postModalService: PostModalService,
    private postFormStateService: PostFormStateService,
    private postService: PostService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.commentsSubscription.unsubscribe();
    this.modalStatusSubscription.unsubscribe();
    this.deletePostSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.paramMap.get('id') as string;
    this.getModalStatus();
    this.posts?.map((post: Post) => {
      this.comments$ = this.postService.getCommentById(post.id);
      this.commentsSubscription = this.comments$.subscribe(
        (comment: Array<Comment>) => {
          this.posts.forEach((post) => {
            if (post.id == comment[0]?.postId) {
              const index = this.posts.indexOf(post);
              post.comments = comment;
              this.posts.splice(index, 1, post);
            }
          });
        }
      );
    });
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
    this.postModalService.modalOpen();
    this.postFormStateService.changeFormStatus(false);
    this.isPostModalDialogVisible = true;
  }

  public editPost(post: Post): void {
    this.post = post;
    this.postModalService.modalOpen();
    this.isPostModalDialogVisible = true;
    this.postFormStateService.changeFormStatus(true);
    this.postFormStateService.setInitialFormState(post);
  }

  public deletePost(post: Post): void {
    this.deletePostSubscription = this.postService
      .deletePost(post.id)
      .subscribe((data) => {
        this.posts = this.posts.filter((item) => post.id !== item.id);
      });
  }

  public viewUpdatedPost(event: Post): void {
    const findElement = this.posts.find((post) => post.id === event.id) as Post;
    const index = this.posts.indexOf(findElement);
    this.posts.splice(index, 1, event);
  }

  public showHideComments(): void {
    this.showComments = !this.showComments;
  }

  public viewCreatedPost(event: Post): void {
    this.posts.push(event);
  }
}
