import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post.interface';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostService } from 'src/app/services/post.service';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { UserModalService } from 'src/app/services/user-modal.service';
import { PostModalService } from 'src/app/services/post-modal.service';
import { DEFAULT_POST } from 'src/app/models/default-post';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  @Output() formStatus = new EventEmitter<boolean>();

  public userId: string;
  public user: UserApiInterface;
  public posts: Array<Post>;
  public post: Post;
  public isFormForEdit: boolean;
  public isUserDetailFormEdit: boolean;
  public location: Location;
  public isPostModalDialogVisible: boolean;
  public isUserModalDialogVisible: boolean;

  constructor(
    private userService: UserService,
    private activateRoute: ActivatedRoute,
    private postService: PostService,
    private userModalService: UserModalService,
    private postModalService: PostModalService,
    private userFormStateService: UserFormStateService,
    private postFormStateService: PostFormStateService,
  ) {}

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.paramMap.get('id') as string;
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
    });
    this.postService.getAllPosts().subscribe((posts) => {
      this.posts = posts.filter((post) => post.userId == this.userId);
    });
    this.getUserModalStatus();
    this.getPostModalStatus();
    this.getUserFormStatus();
  }

  private getUserModalStatus(): void {
    this.userModalService.getModalStatus().subscribe((isModalDialogVisible) => {
      this.isUserModalDialogVisible = isModalDialogVisible;
    });
  }

  private getPostModalStatus(): void {
    this.postModalService.getModalStatus().subscribe((isModalDialogVisible) => {
      this.isPostModalDialogVisible = isModalDialogVisible;
    });
  }

  private getUserFormStatus(): void {
    this.userFormStateService.getFormStatus().subscribe((isFormForEdit: boolean) => {
        this.isFormForEdit = isFormForEdit;
        console.log(this.isFormForEdit)
      });
  }

  public addPost(): void {
    this.post = DEFAULT_POST;
    this.postModalService.modalOpen();
    this.postFormStateService.changeFormStatus(false);
    this.postFormStateService.setDefaultInitialFormState();
    this. isPostModalDialogVisible = true;
  }

  public updateUser(event: UserApiInterface): void{
    this.userService.getUser(event.id).subscribe((user) => {
      this.user = user;
    });
  }

  public openUserModal(): void {
    this.isUserModalDialogVisible = true;
    this.userModalService.modalOpen();
    this.isFormForEdit = true;
    this.isUserDetailFormEdit = true;
  }

  public goBack(): void {
    this.location.back();
  }

  public deletePost(event: boolean): void{
    if(event){
      this.postService.getAllPosts().subscribe((posts) => {
        this.posts = posts.filter((post) => post.userId == this.userId);
      });
    }
  }

  getCreatedPost(event: Post): void {
    this.posts.push(event);
  }
}
