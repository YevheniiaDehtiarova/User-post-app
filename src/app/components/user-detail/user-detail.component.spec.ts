import {ComponentFixture,fakeAsync,TestBed} from '@angular/core/testing';
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
import { of } from 'rxjs';
import { Post } from 'src/app/models/post.class';

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

  it('should test user in initUser', fakeAsync(() => {
    let response: UserApiInterface;
    component.initUser();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.user).toEqual(response);
    });
  }));

  it('should test work postService in initAllPosts', () => {
    const spy = spyOn(postService, 'getAllPosts').and.callThrough();
    postService.getAllPosts();
    component.initAllPosts();
    expect(spy).toHaveBeenCalled();
  });

  it('should test posts in initAllPosts', fakeAsync(() => {
    let response: Post[];
    fixture.detectChanges();
    component.initAllPosts();
    fixture.whenStable().then(() => {
      expect(component.posts).toEqual(response);
    });
  }));

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

  it('should test updateUser method', () => {
    component.updateUser(testedUser);
    userService.getUser(testedUser.id).subscribe((value) => {
      expect(value).toBe(component.user);
    });
    expect(testedUser).toBeTruthy();
  });

  it('should  test unsubscribe in ngOnDestroy', () => {
    component.userSubscription = of().subscribe();
    component.getAllPostsSubcription = of().subscribe();
    component.userModalStatusSubscription = of().subscribe();
    component.userFormStatusSubscription = of().subscribe();
    const unsubscriptionUserSpy = spyOn(
      component.userSubscription,
      'unsubscribe'
    );
    const unsubscriptionPostsSpy = spyOn(component.getAllPostsSubcription,'unsubscribe');
    const unsubscriptionUserModalSpy = spyOn(component.userModalStatusSubscription,'unsubscribe');
    const unsubscriptionUserFormSpy = spyOn(component.userFormStatusSubscription,'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscriptionUserSpy).toHaveBeenCalledTimes(1);
    expect(unsubscriptionPostsSpy).toHaveBeenCalledTimes(1);
    expect(unsubscriptionUserModalSpy).toHaveBeenCalledTimes(1);
    expect(unsubscriptionUserFormSpy).toHaveBeenCalledTimes(1);
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
});
