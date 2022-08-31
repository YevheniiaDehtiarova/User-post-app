import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Post } from 'src/app/models/post.interface';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostModalService } from 'src/app/services/post-modal.service';
import { Comment } from 'src/app/models/comment.interface'
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Output() needUpdate = new EventEmitter<boolean>();
  public comments$: Observable<Array<Comment>>;
  public isPostModalDialogVisible: boolean = false;
  public updatedPost: Post;
  public showComments: boolean = false;

  constructor(
    private postModalService: PostModalService,
    private postFormStateService: PostFormStateService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.getModalStatus();
    this.comments$ = this.postService.getComments().pipe(
      map((comments) => {
        return comments.filter((comment: Comment) => {
          return comment.postId == this.post.id;
        });
      })
    );
  }

  public getModalStatus(): void {
    this.postModalService.getModalStatus().subscribe((isModalDialogVisible) => {
      this.isPostModalDialogVisible = isModalDialogVisible;
    });
  }

  public addPost(): void {
    this.postModalService.modalOpen();
    this.postFormStateService.changeFormStatus(false);
    this.postFormStateService.setDefaultInitialFormState();
  }

  public editPost(post: Post): void {
    this.postModalService.modalOpen();
    this.isPostModalDialogVisible = true;
    this.postFormStateService.changeFormStatus(true);
    this.postFormStateService.setInitialFormState(post);
    this.updatedPost = post;
  }

  public deletePost(): void {
    this.postService.deletePost(this.post.id).subscribe((data) => {
      this.needUpdate.emit(true);
    });
  }

  getUpdatedPost(event: Post): void {
    this.post = event;
  }

  public showHideComments(): void {
    this.showComments = !this.showComments;
  }
}
