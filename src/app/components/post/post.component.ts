import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Post } from 'src/app/models/post.interface';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostModalService } from 'src/app/services/post-modal.service';

import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Output() needUpdate = new EventEmitter<boolean>();
  public isPostModalDialogVisible: boolean = false;

  constructor(private postModalService: PostModalService,
              private postFormStateService: PostFormStateService,
              private postService: PostService) {}
              
  ngOnInit(): void {
    this.getModalStatus();
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

  public editPost():void {
    this.postModalService.modalOpen();
    this.postFormStateService.changeFormStatus(true);
    this.postFormStateService.setInitialFormState(this.post);
    this.isPostModalDialogVisible = !this.isPostModalDialogVisible;
  }

  public deletePost(): void {
    this.postService.deletePost(this.post.id).subscribe(
       data => {
        this.needUpdate.emit(true)
       }
    )
  }

  getUpdatedPost(event: Post): void {
    this.post = event;
  }
}
