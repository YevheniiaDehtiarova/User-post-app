import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post.interface';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { PostService } from 'src/app/services/post.service';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { UserModalService } from 'src/app/services/user-modal.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  @Output() formStatus = new EventEmitter<boolean>();

  public userId: string;
  public user: UserApiInterface;
  public posts: Array<Post>;
  public isFormForEdit: boolean;
  public isUserDetailFormEdit: boolean;
  public isUserModalDialogVisible: boolean;
  public userSubscription: Subscription;
  public getAllPostsSubcription: Subscription;
  public userModalStatusSubscription: Subscription;
  public userFormStatusSubscription: Subscription;

  constructor(
    private userService: UserService,
    private activateRoute: ActivatedRoute,
    private postService: PostService,
    private userModalService: UserModalService,
    private userFormStateService: UserFormStateService,
    private location: Location
  ) {}

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.getAllPostsSubcription.unsubscribe();
    this.userModalStatusSubscription.unsubscribe();
    this.userFormStatusSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.paramMap.get('id') as string;
    this.userSubscription = this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
    });
    this.getAllPostsSubcription = this.postService.getAllPosts().subscribe((posts) => {
      this.posts = posts.filter((post) => post.userId == this.userId);
    });
    this.getUserModalStatus();
    this.getUserFormStatus();

  }

  private getUserModalStatus(): void {
   this.userModalStatusSubscription =  this.userModalService.getModalStatus().subscribe((isModalDialogVisible) => {
      this.isUserModalDialogVisible = isModalDialogVisible;
    });
  }

  private getUserFormStatus(): void {
   this.userFormStatusSubscription =  this.userFormStateService.getFormStatus().subscribe((isFormForEdit: boolean) => {
        this.isFormForEdit = isFormForEdit;
      });
  }


public updateUser(event: UserApiInterface): void{
  this.userSubscription = this.userService.getUser(event.id).subscribe((user) => {
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

}
