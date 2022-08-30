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
export class PostFormComponent implements OnInit {
  @Input() post: Post;
  @Input() userId: string;

  public postForm: FormGroup;
  public isPostModalDialogVisible: boolean;
  public isPostFormForEdit: boolean;
  public isFirstChange: boolean = true;

  constructor(private postModalService: PostModalService,
              private postFormStateService: PostFormStateService) { }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      title: new FormControl(this.post?.title ?? '', Validators.required),
      body: new FormControl(this.post?.body ?? '', Validators.required),
      postId: new FormControl(this.post ? this.post.id : null)
    });
  
    this.getModalStatus();
    this.getFormStatus();
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

}
