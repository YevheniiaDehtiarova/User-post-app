import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { createdPost, Post } from 'src/app/models/post.interface';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit, OnChanges {
  @Input() post: Post;
  @Input() userId: string;
  @Output() public updatePost = new EventEmitter<Post>();
  @Output() public createPost = new EventEmitter<Post>();
  @Output() public cancelCreatePost = new EventEmitter<boolean>();
  public postForm: FormGroup;
  public isPostModalDialogVisible: boolean;
  public isPostFormForEdit: boolean;
  public updatedPost: Post;
  public createdPost: Post;
  public isFirstChanges = true;
  private initialFormState: Post;

  constructor(private postModalService: PostModalService,
              private postFormStateService: PostFormStateService,
              private postService: PostService) { }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      title: new FormControl(this.post?.title ?? '', Validators.required),
      body: new FormControl(this.post?.body ?? '', [Validators.required]),
    });
    this.getModalStatus();
    this.getFormStatus();
    this.getInitialFormState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFirstChanges) {
      this.isFirstChanges = false;
      return;
    } else {
      this.postForm.setValue((this.post));
    }
  }

  private getModalStatus(): void {
    this.postModalService.getModalStatus().subscribe((isModalDialogVisible) => {
      this.isPostModalDialogVisible = isModalDialogVisible;
    });
  }
  
  private getFormStatus(): void {
    this.postFormStateService.getFormStatus().subscribe((isFormForEdit: boolean) => {
        this.isPostFormForEdit = isFormForEdit;
      });
  }

   private getInitialFormState(): void {
    this.postFormStateService.getInitialFormState()
      .subscribe((initState: Post) => {this.initialFormState = initState;});
  }

  public openModal(): void {
    this.isPostModalDialogVisible = true;
    this.postModalService.modalOpen();
  }

  public closeModal(): void {
    this.postForm.reset();
    this.postModalService.modalClose();
    this.cancelCreatePost.emit(true);
  }

   public updateCurrentPost(): void{
    const id = this.initialFormState.id as string;
    const updatedPost = {
      userId: this.initialFormState.userId,
      id: this.initialFormState.id,
      title: this.postForm.value.title,
      body: this.postForm.value.body
    }
    if (this.isPostFormForEdit) {
      this.postService.updatePost(id, updatedPost)
        .subscribe((post) => {
          this.updatedPost = post;
          this.updatePost.emit(this.updatedPost);
        });
    }
    this.postModalService.modalClose();
   }

 public submit(): void{
    if (this.postForm.valid) {
      if (!this.isPostFormForEdit) {
        const newPost: createdPost= {
          userId: this.userId,
          title: this.postForm.value.title,
          body: this.postForm.value.body
        }
        this.postService.createPost(newPost)
          .subscribe((post) => {
            this.createdPost = post;
            this.createPost.emit(this.createdPost);
          });
      }
      this.clickAddPost();
      this.postModalService.modalClose();
      this.postForm.reset();
    } else {
      this.postForm.markAllAsTouched();
    }
  }

  public clickAddPost(): void {
    this.postForm.reset();
    this.postFormStateService.changeFormStatus(false);
    this.postFormStateService.setDefaultInitialFormState();
  }
}
