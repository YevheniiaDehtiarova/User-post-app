import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Post } from 'src/app/models/post.interface';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { take, Observable, catchError, of, takeUntil } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Output() needUpdate = new EventEmitter<boolean>();

  constructor(private postModalService: PostModalService,
              private postFormStateService: PostFormStateService,
              private postService: PostService) {}



  ngOnInit(): void {
  }
  

  public addPost(): void {
    this.postModalService.modalOpen();
    this.postFormStateService.changeFormStatus(false);
    this.postFormStateService.setDefaultInitialFormState();
  }

  public editPost():void {
    this.postModalService.modalOpen();
    this.postFormStateService.changeFormStatus(true);
    this.postFormStateService.setInitialFormState(this.post)
  }

  public closePostModal(): void {
  }

  public deletePost(): void {
    this.postService.deletePost(this.post.id).subscribe(
       data => {
        console.log(data);
        this.needUpdate.emit(true)
       }
    )
  }

  // public removePost(): void {
  //   this.postsService.removePost(this.post.id.toString()).pipe(
  //     takeUntil(this.destroyed),
  //     catchError(err => of(`Error: ${err}`))
  //   ).subscribe(
  //     data => {
  //       this.isUpdate.emit(true);
  //     }
  //   );
  // }

  updatePosts(): void {
  }

  getUpdatePost(event: Post): void {
    this.post = event;
  }

  // getCreatedPost(event: Post): void{
  //   console.log(event);
  // }
}
