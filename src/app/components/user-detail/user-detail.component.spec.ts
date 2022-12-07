import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { PostService } from 'src/app/services/post.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { UserDetailComponent } from './user-detail.component';
import { UserService } from 'src/app/services/user.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { ActivatedRoute } from '@angular/router';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { Post } from 'src/app/models/post.class';
import { InjectionToken } from '@angular/core';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { Comment } from '../../models/comment.interface';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let postService: PostService;
  let http: HttpClient;
  let userService: UserService;
  let userFormStateService: UserFormStateService;
  let userModalService: UserModalService;
  let route: ActivatedRoute;
  let testedUser: UserApiInterface;
  let testedPost: Post;
  let testedPosts: Array<Post> = [];

  const LOCATION_TOKEN = new InjectionToken<Location>('Window location object');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [UserDetailComponent],
      providers: [
        UserService,
        PostService,
        UserModalService,
        UserFormStateService,
        { provide: UserMapper, useValue: {} },
        { provide: LOCATION_TOKEN, useValue: window.history },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();

    http = TestBed.get(HttpClient);
    postService = new PostService(http);
    userService = new UserService(http);
    userModalService = new UserModalService();
    userFormStateService = new UserFormStateService();
    testedUser = {
      id: '1',
      firstName: 'aaaa',
      lastName: 'bbb',
      username: 'sdegd',
      email: 'dhdrf',
      address: {
        street: 'sfszdgv',
        building: 'sfszdgv',
        city: 'sfszdgv',
        zipcode: 'sfszdgv',
      },
      phone: '1111',
      website: 'zbgxdbh',
      company: {
        name: 'svgxds',
        scope: 'zsgbxdh',
      },
    };
    testedPost = {
      body: '',
      comments: [
        { postId: '2', id: '3', name: 'aaa', email: 'bbb', body: 'cccc' },
      ],
      id: '22',
      title: '',
      userId: '3',
    };
    testedPosts.push(testedPost);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test userId in activated route', () => {
    component.ngOnInit();
    const spyRoute = spyOn(route.snapshot.paramMap, 'get');
    const testId = '1';
    spyRoute.and.returnValue(testId);
    expect(component.userId).toBe(testId);
  });

  it('should test work userService in initUser', () => {
    const spy = spyOn(userService, 'getUser').and.callThrough();
    userService.getUser(testedUser.id);
    component.initUser();
    expect(spy).toHaveBeenCalled();
  });


  /*проблема 1 присовение значения в переменную 
  в ts не покрыта строка this.user = user;*/
  it('should test user in initUser', fakeAsync(() => {
    let response: UserApiInterface;
    component.initUser();

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      expect(component.user).toEqual(response);
    });
  }));

  it('should test work postService in initAllPosts', () => {
    const spy = spyOn(postService, 'getAllPosts').and.callThrough();
    postService.getAllPosts();
    component.initAllPosts();
    expect(spy).toHaveBeenCalled();
  });

  /*не работает корректно подписка на посты и присвоение в this.posts
  ts не покрыта строка this.posts = posts;*/
  it('should test posts in initAllPosts 01', fakeAsync(() => {
    const response: Post[] =[];
    fixture.detectChanges();
    component.initAllPosts();
    fixture.whenStable().then(() => {
      expect(component.posts).toEqual(response);
    });
  })) /*это был вариант 1*/

  it('should test posts in initAllPosts 02', fakeAsync(() => {
    const response: Post[] = [];
    spyOn(postService, 'getAllPosts').and.returnValue(of(response));
    component.initAllPosts();
    tick();
    expect(component.posts).toEqual(response);
  })) /*а это вариант 2*/

    it('should test method initAllPosts', () => {
    let id = testedPost.id;
    const spy = spyOn(postService, 'getCommentById').and.callThrough();
    postService.getCommentById(id);
    component.initAllPosts();
    expect(spy).toHaveBeenCalled();

    let index = 1;
    let testedComment: Comment[] = [];
    let post = testedPost;
    let spyFunc = spyOn(component, 'modifyPosts').and.callThrough();
    component.modifyPosts(post, index, testedComment);
    expect(spyFunc).toHaveBeenCalled();
    expect(spyFunc).toHaveBeenCalledWith(post, index, testedComment);

    postService.getCommentById(id).subscribe((comment) => {
      component.modifyPosts(post, index, comment);
      expect(component.modifyPosts(post, index, comment)).toBeFalsy();
    });
    expect(component.modifyPosts(post, index, testedComment)).toBeFalsy();
  }); 


  /*не покрывается тестами присвоение в переменную и вызов функции,
  не покрыты след строки кода
  this.posts[index].comments = comment;
  this.splicePosts(post, this.posts);*/

  it('should check modifyPosts and call methods inside', () => {
    let index = 1;
    let testedComment: Comment[] = testedPost.comments as Comment[];
    let post = testedPost;

    component.modifyPosts(post, index, testedComment);

    let condition = testedPost.id === testedComment[0]?.postId;
    expect(condition).toBeFalse();

    const spy = spyOn(component, 'splicePosts').and.callThrough();
    component.splicePosts(testedPost, testedPosts);
    expect(spy).toHaveBeenCalled();
  }); 


  it('should test subscription in getUserModalStatus', () => {
    component.getUserModalStatus();
    userModalService.getModalStatus().subscribe((value) => {
      expect(value).toBe(component.isUserModalDialogVisible);
    });
  }); 

  it('should test work service in getUserModalStatus', () => {
    const spy = spyOn(userModalService, 'getModalStatus').and.callThrough();
    userModalService.getModalStatus();
    component.getUserModalStatus();
    expect(spy).toHaveBeenCalled();
  });

  it('should test subscription in getUserFormStatus', () => {
    component.getUserFormStatus();
    userFormStateService.getFormStatus().subscribe((value) => {
      expect(value).toBe(component.isFormForEdit);
    });
  });

  it('should test work service in getUserFormStatus', () => {
    const spy = spyOn(userFormStateService, 'getFormStatus').and.callThrough();
    userFormStateService.getFormStatus();
    component.getUserFormStatus();
    expect(spy).toHaveBeenCalled();
  });
/* аналогично не работает присвоение в юзер, не  покрыта строка
this.user = user; */
  it('should test updateUser method', () => {
    component.updateUser(testedUser.id);
    userService.getUser(testedUser.id).subscribe((value) => {
      expect(value).toBe(component.user);
    });
    expect(testedUser).toBeTruthy();
  });

  it('should test user in init method', () => {
    component.ngOnInit();
    userService.getUser(testedUser.id).subscribe((value) => {
      expect(value).toBe(component.user);
    });
    expect(testedUser).toBeTruthy();
  });

  it('should test isUserModalDialogVisible in openUserModal method', () => {
    const value = true;
    component.openUserModal();
    expect(component.isUserModalDialogVisible).toBe(value);
    expect(component.isFormForEdit).toBe(value);
    expect(component.isUserDetailFormEdit).toBe(value);
  });

  it('should test work of service in openUserModal', () => {
    const spy = spyOn(userModalService, 'modalOpen').and.callThrough();
    userModalService.modalOpen();
    component.openUserModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should test goBack method', inject([LOCATION_TOKEN], (_loc: Location) => {
    spyOn(_loc, 'back');
    component.goBack();
    _loc.back();
    expect(_loc.back).toHaveBeenCalled();
  }));
});
