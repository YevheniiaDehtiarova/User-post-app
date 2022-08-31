import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Post } from 'src/app/models/post.interface';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { PostFormComponent } from '../post-form/post-form.component';
import { take } from 'rxjs';
import { DEFAULT_POST } from 'src/app/models/default-post';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.css']
})
export class PostModalComponent implements OnInit {
  @Input() post: Post;
  @Input() userId: string;
  @Output() updatePosts = new EventEmitter<Post>();
  @Output() createPosts = new EventEmitter<Post>();
  public postsLength: number;

  @ViewChild(PostFormComponent) public postFormComponent: PostFormComponent;

  constructor( public postModalService: PostModalService,
               public postService: PostService) { }

  ngOnInit(): void {
    !this.post ? this.postService.getAllPosts().pipe(take(1)).subscribe((posts: Post[]) => this.postsLength = posts.length) : null;
  }

  public close(): void {
    this.postModalService.modalClose();
  }
  public submit(): void{
    if(this.postFormComponent.postForm.valid) {
      const post: Post = {
        id: this.postFormComponent.postForm.value.postId ? this.postFormComponent.postForm.value.postId : this.postsLength + 1,
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
