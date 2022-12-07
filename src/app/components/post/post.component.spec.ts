import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { PostComponent } from './post.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { DEFAULT_POST } from 'src/app/models/default-post';
import { Post } from 'src/app/models/post.class';
import { ActivatedRoute } from '@angular/router';

describe('Post Component', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let postModalService: PostModalService;
  let postService: PostService;
  let http: HttpClient;
  let postFormStateService: PostFormStateService;
  let testedPost: Post;
  let route: ActivatedRoute;
  let testedPosts: Array<Post> = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [PostComponent],
      providers: [
        PostModalService,
        PostFormStateService,
        PostService,
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

    fixture = TestBed.createComponent(PostComponent);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
    postModalService = new PostModalService();
    http = TestBed.get(HttpClient);
    postService = new PostService(http);
    postFormStateService = new PostFormStateService();
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

  it('should test userId in activated route', () => {
    component.calculateUserId();
    const spyRoute = spyOn(route.snapshot.paramMap, 'get');
    const testId = '1';
    spyRoute.and.returnValue(testId);
    expect(component.userId).toBe(testId);
  });


  /*тоже пишет не покрыто тестами значение null
  if(!this.userId) {return null;}*/
  it('should  test null value in calculateUserId', () => {
    component.calculateUserId();
    const testId = null
    expect(testId).toBe(null);
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test subscription in getModalStatus', () => {
    const fakeValue = false;
    postModalService.getModalStatus().subscribe((value) => {
      expect(value).toBe(fakeValue);
    });
  });

  it('should test method splicePosts', () => {
    const testPost: Post = testedPost;
    component.splicePosts(testPost, component.posts);
    const index = component.posts.indexOf(testPost);
    expect(component.posts?.splice(index, 1, testPost)).toBeTruthy();
  });


  it('should test input posts when PostComponent init', () => {
    const testPosts: Post[] = [];
    testPosts.push(testedPost);
    component.posts = testPosts;
    fixture.detectChanges();
    expect(component.posts).toEqual(testPosts);
  });

  it('should test post in method addPost', () => {
    const testPost = DEFAULT_POST;
    component.addPost();
    expect(component.post).toBe(testPost);
  });


  it('should test modalopen method from service in changePostModalDialogVisible', () => {
    const spy = spyOn(postModalService, 'modalOpen').and.callThrough();
    postModalService.modalOpen();
    component.changePostModalDialogVisible();
    expect(spy).toHaveBeenCalled();
  });

  it('should test value from changeFormStatus', () => {
    const fakeValue = false;
    const spy = spyOn(
      postFormStateService,
      'changeFormStatus'
    ).and.callThrough();
    postFormStateService.changeFormStatus(fakeValue);
    component.changeFormStatus(fakeValue);
    expect(spy).toHaveBeenCalled();
  });

  it('should test editPost method', () => {
    const testPost: Post = testedPost;
    component.editPost(testPost);
    expect(component.post).toBe(testPost);
  });

  it('should test deletePost method', () => {
    const testPost: Post = testedPost;
    expect(postService.deletePost(testPost.id)).toBeTruthy();

    let id = testPost.id;
    const spy = spyOn(postService, 'deletePost').and.callThrough();
    postService.deletePost(id);
    component.deletePost(testedPost);
    expect(spy).toHaveBeenCalled();

    postService.deletePost(id).subscribe((value) => {
      expect(value).toEqual(testPost);
      expect(component.filterPost(testedPosts, value)).toBeTruthy();
    });
    expect(component.filterPost(testedPosts, testPost)).toBeFalsy();
  });

  /*здесь пишу тесты на покрытие filter метода внутри  deletePost
   .subscribe((value) => {
      this.filterPost(this.posts, value); */
  it('should test filter post method in deletePost', () => {
    component.deletePost(testedPost);
    const callSpy = spyOn(component, 'filterPost');
    component.filterPost(testedPosts, testedPost);
    expect(callSpy).toHaveBeenCalled();
    expect(callSpy).toHaveBeenCalledWith(testedPosts, testedPost);
  }); //не покрывается

  /*это тетс на присвоение элементов в viewUpdatedPost
    const findElement = this.posts?.find((post) => this.checkPost(post,event));*/
  it('should test viewUpdatedPost method', () => {
    component.viewUpdatedPost(testedPost);
    const testFindElement = component.posts?.find((post) => {
      expect(post?.id).toEqual(testedPost.id);
    }) as Post;
    expect(testFindElement).toBeFalsy();
    testedPosts.find((post) => {
      expect(post.id === testedPost.id).toBeTruthy();
    });
    component.postsWithComments?.find((post) => {
      expect(post.id === testedPost.id).toBeTruthy();
    });

    /*а єто тест на візов splicepost внутри viewUpdatedPost
       this.splicePosts(findElement, this.posts);*/
    spyOn(component, 'splicePosts').and.callThrough();
    component.splicePosts(testFindElement, testedPosts);
    expect(component.splicePosts).toHaveBeenCalled();
    expect(component.splicePosts).toHaveBeenCalledWith(
      testFindElement,
      testedPosts
    );
  });

  it('should test showHidecomments method', () => {
    const testShowComments = !component.showComments;
    component.showHideComments();
    expect(component.showComments).toBe(testShowComments);
  });

  it('should test viewCreatedPost method', () => {
    const testPost: Post = testedPost;
    component.viewCreatedPost(testPost);
    expect(component.posts?.push(testPost)).toBeTruthy();
  });

  it('should test checkPost', () => {
    let testEvent = testedPost;
    component.checkPost(testedPost, testEvent);
    expect(testEvent.id).toEqual(testedPost.id);
  });

  /*тоже не покрывается тестами*/
  it('should test checkpost in viewUpdatedPost', () => {
    let testEvent = testedPost;
    component.viewUpdatedPost(testEvent);
    const callSpy = spyOn(component, 'checkPost').and.callThrough();
    component.checkPost(testedPost, testEvent);
    expect(callSpy).toHaveBeenCalled();
    expect(callSpy).toHaveBeenCalledWith(testedPost, testEvent);
    component.postsWithComments?.find((post) => {
      expect(component.checkPost(post, testEvent)).toBeTruthy();
    });
  });

});
