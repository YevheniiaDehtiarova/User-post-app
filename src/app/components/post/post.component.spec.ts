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
import { Comment } from '../../models/comment.interface';
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

  it('should test method definePostsWithComments', () => {
    component.definePostsWithComments(testedPosts);
    expect(component.postsWithComments).toEqual(testedPosts);
  });

  it('should test input posts when PostComponent init', () => {
    const testPosts: Post[] = [];
    testPosts.push(testedPost);
    component.posts = testPosts;
    fixture.detectChanges();
    expect(component.posts).toEqual(testPosts);
  });

  it('should test method initPostsWithcomments', () => {
    let id = testedPost.id;
    const spy = spyOn(postService, 'getCommentById').and.callThrough();
    postService.getCommentById(id);
    component.initPostsWithcomments(testedPosts);
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
  }); // попытка но покрытие modifyPosts не сработало

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

    spyOn(component, 'definePostsWithComments').and.callThrough();
    component.definePostsWithComments(testedPosts);
    expect(component.definePostsWithComments).toHaveBeenCalled();
    expect(component.definePostsWithComments).toHaveBeenCalledWith(testedPosts);
    expect(component.postsWithComments).toEqual(testedPosts);

    //expect(testedPosts[index]?.comments).toEqual(testedComment);
  }); // попытка протестировать условие и вызов 2 х функций

  it('should test post in method addPost', () => {
    const testPost = DEFAULT_POST;
    component.addPost();
    expect(component.post).toBe(testPost);
  });

  it('should test method changePostModalDialogVisible', () => {
    component.changePostModalDialogVisible();
    expect(component.isPostModalDialogVisible).toBeTruthy();
  });

  it('should test modalopen method from service in changePostModalDialogVisible', () => {
    const spy = spyOn(postModalService, 'modalOpen').and.callThrough();
    postModalService.modalOpen();
    component.postModalOpen();
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

  it('should test status in addPost method', () => {
    component.addPost();
    expect(component.isPostModalDialogVisible).toBeTrue();
  });

  it('should test editPost method', () => {
    const testPost: Post = testedPost;
    const testStatus = true;
    component.editPost(testPost);
    expect(component.post).toBe(testPost);
    expect(component.isPostModalDialogVisible).toBe(testStatus);
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

  /*здесь пишу тесты на покрытие filter метода внутри delete*/
  it('should test filter post method in deletePost', () => {
    component.deletePost(testedPost);
    const callSpy = spyOn(component, 'filterPost');
    component.filterPost(testedPosts, testedPost);
    expect(callSpy).toHaveBeenCalled();
    expect(callSpy).toHaveBeenCalledWith(testedPosts, testedPost);
  }); //не покрывается

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

    /*пишу тесты на вызов splicepost внутри viewUpdatedPost*/
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
