import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { PostFormComponent } from '../post-form/post-form.component';
import { Observable, Subscription, take, takeUntil } from 'rxjs';
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
  @Input('userId') userId: string | null;
  @Input() posts: Array<Post>;
  @Output() changePosts = new EventEmitter<Post>();
  public postLength: number = 0;

  @ViewChild(PostFormComponent) public postFormComponent: PostFormComponent;

  constructor( public postModalService: PostModalService,
               public postService: PostService, 
               public cd: ChangeDetectorRef) {
    super();
  }


  ngOnInit(): void {
   !this.post ? this.postService.getAllPosts()
        .pipe(takeUntil(this.destroy$))
        .subscribe((posts: Post[]) => this.determinePostLength(posts)) : null; // вызов функции не покрывается
  }

  public determinePostLength(posts: Array<Post>): void {
    this.postLength = posts.length
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
       this.detailSubmit(post); //не покрывается 
    }
  }

  public resetForm(): void {
    this.postFormComponent?.postForm?.reset();
    this.close();
  }

  public detailSubmit(post: Post): void {
    this.defineRequest(post)?.pipe(takeUntil(this.destroy$)) 
      .subscribe((post) => {
        this.changePosts.emit(post);// вот этот вызов не могу покрыть тестами
      })
      this.resetForm();
  }

  public defineRequest(post:Post): Observable<Post> {
    return this.post !== DEFAULT_POST 
    ? this.postService.updatePost(this.post?.id, post)
    : this.postService.createPost(post)
  }
}

