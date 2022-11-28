import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { PostFormComponent } from '../post-form/post-form.component';
import { Subscription, take, takeUntil } from 'rxjs';
import { DEFAULT_POST } from 'src/app/models/default-post';
import { Post } from 'src/app/models/post.class';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.css']
})
export class PostModalComponent extends BaseComponent implements OnInit{
  @Input('post') post: Post;
  @Input('userId') userId: string;
  @Input() posts: Array<Post>;
  @Output() updatePosts = new EventEmitter<Post>();
  @Output() createPosts = new EventEmitter<Post>();
  public postLength: number;

  @ViewChild(PostFormComponent) public postFormComponent: PostFormComponent;

  constructor( public postModalService: PostModalService,
               public postService: PostService, 
               public cd: ChangeDetectorRef) {
    super();
  }


  ngOnInit(): void {
    !this.post ? this.postService.getAllPosts()
    .pipe(takeUntil(this.destroy$))
    .subscribe((posts: Post[]) => this.postLength = posts.length) : null;
  }

  public close(): void {
    this.postModalService.modalClose();
    this.postFormComponent?.postForm.reset();
  }

  public submit(): void{
    if(this.postFormComponent?.postForm?.valid) {
      const post: Post = {
        id: this.postFormComponent?.postForm?.value.postId ? this.postFormComponent.postForm.value.postId : this.postLength + 1,
        userId:  this.userId,
        title: this.postFormComponent?.postForm?.value.title,
        body: this.postFormComponent?.postForm?.value.body,
      }
      this.checkPostOnDefault(post);
    }
  }


  public checkPostOnDefault(post:Post): void {
    if(this.post != DEFAULT_POST){
      this.updatePost(post);
    } else {
      this.createPost(post);
    }
  }

  public createPost(post: Post): void {
    this.postService.createPost(post)
    .pipe(takeUntil(this.destroy$))
    .subscribe((post)=> {
      this.createPosts.emit(post);
  })
  this.resetForm();
}

  public updatePost(post: Post): void {
    this.postService.updatePost(this.post?.id, post)
    .pipe(takeUntil(this.destroy$)).subscribe((post) => {
      this.updatePosts.emit(post);
    })
    this.resetForm();

  }
  public resetForm(): void {
    this.postFormComponent?.postForm?.reset();
    this.close();
  }
}

