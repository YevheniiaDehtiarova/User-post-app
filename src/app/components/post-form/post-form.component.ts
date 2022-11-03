import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post.interface';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent implements OnInit {
  @Input() post: Post;
  public postForm: FormGroup;

  ngOnInit(): void {
    console.log(this.post, 'post')
    this.postForm = new FormGroup({
      title: new FormControl(this.post?.title ?? '', Validators.required),
      body: new FormControl(this.post?.body ?? '', Validators.required),
      postId: new FormControl(this.post ? this.post.id : null),
    });
  }

}
