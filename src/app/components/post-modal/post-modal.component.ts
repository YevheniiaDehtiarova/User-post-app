import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { PostFormComponent } from '../post-form/post-form.component';
import { Subscription, take } from 'rxjs';
import { DEFAULT_POST } from 'src/app/models/default-post';
import { Post } from 'src/app/models/post.class';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.css']
})
export class PostModalComponent implements OnInit, OnDestroy {
  @Input('post') post: Post;
  @Input('userId') userId: string;
  @Input() posts: Array<Post>;
  @Output() updatePosts = new EventEmitter<Post>();
  @Output() createPosts = new EventEmitter<Post>();
  public postLength: number;
  public updatedPost: Post;
  public getAllPostSubscription: Subscription;

  @ViewChild(PostFormComponent) public postFormComponent: PostFormComponent;

  constructor( public postModalService: PostModalService,
               public postService: PostService, 
               public cd: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    if(this.getAllPostSubscription){
      this.getAllPostSubscription.unsubscribe();
    }
  }


  ngOnInit(): void {
    this.getAllPostSubscription = this.postService.getAllPosts().pipe(take(1)).
    subscribe((posts: Post[]) => this.postLength = posts.length);
    this.checkInitPost(this.post);
  }

  public checkInitPost(post: Post): Subscription | null {
    this.post = post;
    return !post ? this.getAllPostSubscription : null;
  }


  public close(): void {
    this.postModalService.modalClose();
    this.postFormComponent?.postForm.reset();
  }

  public submit(): void{
    if(this.postFormComponent.postForm.valid) {
      const post: Post = {
        id: this.postFormComponent.postForm.value.postId ? this.postFormComponent.postForm.value.postId : this.postLength + 1,
        userId:  this.userId,
        title: this.postFormComponent.postForm.value.title,
        body: this.postFormComponent.postForm.value.body,
      }

      if(this.post != DEFAULT_POST){
        this.postService.updatePost(this.post.id, post).subscribe((post)=> {
            this.updatePosts.emit(post);
            this.postFormComponent.postForm.reset();
            this.close();
        })
      } else {
        this.postService.createPost(post).subscribe((post)=> {
          this.createPosts.emit(post);
          this.postFormComponent.postForm.reset();
          this.close();
        })
      }
    }
  }

}
