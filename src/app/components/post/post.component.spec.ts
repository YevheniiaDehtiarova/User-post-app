import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { tap } from 'rxjs/internal/operators/tap';

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

  it('should test if in initPostsWithcomments', () => {
    component.initPostsWithcomments(testedPosts);
    let testedComments = testedPost.comments as Comment[];
    expect(testedPost.id === testedComments[0].postId).toBeFalse();
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
    let testedComments = testedPost.comments as Comment[];
    const testCommentFromPost = testedPost.comments as Comment[];
    component.initPostsWithcomments(testedPosts);
    expect(testedPost.id === testedComments[0].postId).toBeTruthy;
    expect(testedComments).toBe(testCommentFromPost);
    expect(component.splicePosts(testedPost, component.posts)).toBeTruthy;
    expect(component.definePostsWithComments(component.posts)).toBeTruthy;

    spyOn(component, 'splicePosts');
    component.splicePosts(testedPost, component.posts);
    expect(component.splicePosts).toHaveBeenCalled();
  });

  it('should check modifyPosts', () => {
    let index = 1;
    let testedComment: Comment[] = [];
    component.modifyPosts(testedPost, index, testedComment);
    expect(component.modifyPosts(testedPost, index, testedComment)).toBeTruthy;

    spyOn(component, 'splicePosts');
    component.splicePosts(testedPost, component.posts);
    expect(component.splicePosts).toHaveBeenCalled();
    expect(component.splicePosts(testedPost, component.posts)).toBeTruthy;

    spyOn(component, 'definePostsWithComments');
    component.definePostsWithComments(component.posts);
    expect(component.definePostsWithComments).toHaveBeenCalled();
  });

  it('should test work of service in initPostsWithcomments', () => {
    let id = testedPost.id;
    const spy = spyOn(postService, 'getCommentById').and.callThrough();
    postService.getCommentById(id);
    component.initPostsWithcomments(testedPosts);
    expect(spy).toHaveBeenCalled();
  });

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
    expect(postFormStateService.setInitialFormState(testPost)).toBeTruthy;
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
      expect(component.filterPost(testedPosts, value)).toBeTruthy;

      const callSpy = spyOn(component, 'filterPost');
      component.filterPost(testedPosts, value);
      expect(callSpy).toHaveBeenCalled();
    });
    expect(component.filterPost(testedPosts, testPost)).toBeTruthy;
  });

  it('should test viewUpdatedPost method', () => {
    component.viewUpdatedPost(testedPost);
    const testFindElement = component.posts?.find((post) => {
      expect(post?.id).toEqual(testedPost.id);
    }) as Post;
    expect(testFindElement).toBeTruthy;
    testedPosts.find((post) => {
      expect(post.id === testedPost.id).toBeTruthy;
    });
    component.postsWithComments?.find((post) => {
      expect(post.id === testedPost.id).toBeTruthy;
    });

    spyOn(component, 'splicePosts');
    component.splicePosts(testFindElement, testedPosts);
    expect(component.splicePosts).toHaveBeenCalled();
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

  it('should test checkpost in viewUpdatedPost', () => {
    let testEvent = testedPost;
    component.viewUpdatedPost(testEvent);
    const callSpy = spyOn(component, 'checkPost');
    component.checkPost(testedPost, testEvent);
    expect(callSpy).toHaveBeenCalled();
    component.postsWithComments?.find((post) => {
      expect(component.checkPost(post, testEvent)).toBeTruthy;
    });
  });
});
