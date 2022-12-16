import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { PostService } from 'src/app/services/post.service';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { UserModalService } from 'src/app/services/user-modal.service';
import { forkJoin,takeUntil,tap} from 'rxjs';
import { Post } from 'src/app/models/post.class';
import { BaseComponent } from '../base/base.component';
import { Comment } from 'src/app/models/comment.interface';
import { UserFormInterface } from 'src/app/models/user-form.interface';
import { UserMapper } from 'src/app/mappers/user.mapper';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent extends BaseComponent implements OnInit {
  public userId: string | null;
  public user: UserApiInterface;
  public posts: Array<Post> = [];
  public isFormForEdit: boolean;
  public isUserDetailFormEdit: boolean;
  public isUserModalDialogVisible: boolean;

  constructor(
    private userService: UserService,
    private activateRoute: ActivatedRoute,
    private postService: PostService,
    private userModalService: UserModalService,
    private userFormStateService: UserFormStateService,
    private location: Location,
    private cd: ChangeDetectorRef,
    public userMapper: UserMapper,
  ) {
    super();
  }

  ngOnInit(): void {
    this.calculateUserId();
    this.initAllPosts();
    this.initUser();
    this.getUserModalStatus();
    this.getUserFormStatus();
  }

  public initUser(): void {
    this.userService
      .getUser(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
      });
  }

  public calculateUserId(): string | null {
    this.userId = this.activateRoute.snapshot.paramMap.get('id');
    if (!this.userId) {
      return null;
    }
    return this.userId;
  }

  public initAllPosts(): void {
    this.postService
      .getAllPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((posts) => {
        this.posts = posts;
        this.posts.filter((post) => {
          post.userId === this.userId;
        });
      });
    if (this.posts.length) {
      forkJoin([
        this.posts?.map((post: Post, index: number) => {
          this.postService
            .getCommentById(post?.id)
            .pipe(
              tap((comment: Array<Comment>) =>
                this.modifyPosts(post, index, comment)
              )
            );
        }),
      ])
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  public modifyPosts(post: Post, index: number, comment: Array<Comment>): void {
    if (post.id == comment[0]?.postId) {
      this.posts[index].comments = comment;
      this.splicePosts(post, this.posts);
    }
  }

  public splicePosts(post: Post, posts: Post[]): Post[] {
    const index = posts?.indexOf(post);
    return posts.splice(index, 1, post);
  }

  public getUserModalStatus(): void {
    this.userModalService
      .getModalStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isModalDialogVisible) => {
        this.isUserModalDialogVisible = isModalDialogVisible;
      });
  }

  public getUserFormStatus(): void {
    this.userFormStateService
      .getFormStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormForEdit: boolean) => {
        this.isFormForEdit = isFormForEdit;
      });
  }

  public updateUser(user: UserFormInterface): void {
    this.user = this.userMapper.mapToCreateUpdateDto(user);
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
  public submit(): void {
    this.userService.updateUser(this.user?.id,this.user).pipe(takeUntil(this.destroy$)).subscribe();
  }
}
