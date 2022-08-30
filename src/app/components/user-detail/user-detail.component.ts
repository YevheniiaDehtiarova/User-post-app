import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post.interface';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';

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
  public isOpenPostModal: boolean;
  public isModalDialogVisible: boolean;
  public isFormForEdit: boolean;
  public isModalAddDialogVisible: boolean;

  constructor(
    private userService: UserService,
    private activateRoute: ActivatedRoute,
    private postService: PostService,
    private userModalService: UserModalService,
    private userFormStateService: UserFormStateService,
    private postModalService: PostModalService,
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
    this.getUserFormStatus();
  }

  private getUserModalStatus(): void {
    this.userModalService.getModalStatus().subscribe((isModalDialogVisible) => {
      this.isModalDialogVisible = isModalDialogVisible;
    });
  }

  private getUserFormStatus(): void {
    this.userFormStateService.getFormStatus().subscribe((isFormForEdit: boolean) => {
        this.isFormForEdit = isFormForEdit;
      });
  }

  public addPost(): void {
    this.postModalService.modalOpen();
    this.postFormStateService.changeFormStatus(false);
    this.postFormStateService.setDefaultInitialFormState();
    this.isModalAddDialogVisible = true;
  }

  public updateUser(): void{
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
    });
  }

  openUserModal(): void {
    this.isModalDialogVisible = true;
    this.userModalService.modalOpen();
    this.isFormForEdit = true;
  }

  public goBack(): void {
  }

  public newPost(event: Post): void{
    console.log(event);
    this.isModalAddDialogVisible = false;
    this.posts.push(event);
  }

  public deletePost(event: boolean): void{
    console.log(event)
    if(event){
      this.postService.getAllPosts().subscribe((posts) => {
        this.posts = posts.filter((post) => post.userId == this.userId);
      });
    }
  }
}
