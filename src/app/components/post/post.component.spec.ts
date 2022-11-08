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
import { of } from 'rxjs';
import { Post } from 'src/app/models/post.class';
import { ActivatedRoute } from '@angular/router';
import { util } from '@progress/kendo-drawing';

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

  it('check splicePosts', () => {
    const testPost: Post = testedPost;
    component.splicePosts(testPost, component.posts);
    const index = component.posts.indexOf(testPost);
    expect(component.posts?.splice(index, 1, testPost)).toBeTruthy();
  });

  it('check definePostsWithComments', () => {
    component.definePostsWithComments(testedPosts);
    expect(component.postsWithComments).toEqual(testedPosts)
  })

  it('check input posts when post conponent init', () => {
    const testPosts: Post[] = [];
    testPosts.push(testedPost);
    component.posts = testPosts;

    fixture.detectChanges();
    expect(component.posts).toEqual(testPosts);
  });

  it('should test createCommentSubscription', () => {
    component.createCommentSubscription(testedPost);
    expect(component.createCommentSubscription(testedPost)).toBeTruthy();
  })

  it('check modifyPosts', () => {
    let testedComments = testedPost.comments as Comment[];
    const testCommentFromPost  = testedPost.comments as Comment[];
    component.modifyPosts(testedPosts,testedComments);
    expect(testedPost.id === testedComments[0].postId).toBeFalse();
    expect(testedComments).toBe(testCommentFromPost);
    expect(component.splicePosts(testedPost, component.posts)).toBeTruthy;
    expect(component.definePostsWithComments(component.posts)).toBeTruthy;
  })

  it('check initPostWithComments', () => {
     component.initPostsWithcomments(testedPosts);
     expect(testedPosts).toBeTruthy();
  });

  it('check commentObservable', () => {
    let id = testedPost.id;
    component.commentObservable(id);
    expect(postService.getCommentById(id)).toBeTruthy();
  })

  it('check work of service in commentObservable', () => {
    let id = testedPost.id;
    const spy = spyOn(postService,'getCommentById').and.callThrough();
    postService.getCommentById(id)
    component.commentObservable(id);
    expect(spy).toHaveBeenCalled();
  })

  it('check post in method addPost', () => {
    const testPost = DEFAULT_POST;
    component.addPost();
    expect(component.post).toBe(testPost);
  });

  it('check changePostModalDialogVisible', () => {
    component.changePostModalDialogVisible();
    expect(component.isPostModalDialogVisible).toBeTruthy();
  });

  it('check modalopen in changePostModalDialogVisible', () => {
    const spy = spyOn(postModalService,'modalOpen').and.callThrough();
    postModalService.modalOpen();
    component.postModalOpen();
    expect(spy).toHaveBeenCalled();
  })

  it('check value from changeFormStatus', () => {
    const fakeValue = false;
    const spy = spyOn(postFormStateService,'changeFormStatus').and.callThrough();
    postFormStateService.changeFormStatus(fakeValue);
    component.changeFormStatus(fakeValue);
    expect(spy).toHaveBeenCalled();
  })

  it('check status in method addPost', () => {
    component.addPost();
    expect(component.isPostModalDialogVisible).toBeTrue();
  });

  it('check method editPost', () => {
    const testPost: Post = testedPost;
    const testStatus = true;
    component.editPost(testPost);
    expect(component.post).toBe(testPost);
    expect(component.isPostModalDialogVisible).toBe(testStatus);
    expect(postFormStateService.setInitialFormState(testPost)).toBeTruthy;
  });

  it('check deletePost method', () => {
    const testPost: Post = testedPost;
    component.deletePost(testPost);
    expect(postService.deletePost(testPost.id)).toBeTruthy();
    let id  = testedPost.id;
    const spy = spyOn(postService,'deletePost').and.callThrough();
    postService.deletePost(id);
    component.deletePost(testedPost);
    expect(spy).toHaveBeenCalled();
    postService.deletePost(id).subscribe((value) => {
      expect(component.filterPost(testedPosts, testedPost))
    })
    expect(component.filterPost(testedPosts, testedPost)).toBeTruthy;
  });


  it('check post in filterPost', () => {
      component.filterPost(testedPosts, testedPost);
      const filteredPosts = testedPosts.filter((item) => testedPost.id === item.id);
      expect(testedPosts).toEqual(filteredPosts);  
  })

  it('check viewUpdatedPost', () => {
    component.viewUpdatedPost(testedPost);
    const testFindElement = component.posts?.find(
      (post) => post?.id !== testedPost.id
    ) as Post;
    testedPosts.find(post => {
      expect(post.id ===testedPost.id).toBeTruthy;
    })
    component.postsWithComments?.find((post)=> {
      expect(post.id === testedPost.id).toBeTruthy;
    })
 
    expect(component.findElement).toBe(testFindElement);
  });

  it('check showHidecomments method', () => {
    const testShowComments = !component.showComments;
    component.showHideComments();
    expect(component.showComments).toBe(testShowComments);
  });

  it('check viewCreatedPost', () => {
    const testPost: Post = testedPost;
    component.viewCreatedPost(testPost);
    expect(component.posts?.push(testPost)).toBeTruthy();
  });

  it('should comment unsubscribe', () => {
    component.commentsSubscription = of().subscribe();
    const unsubscriptionSpy = spyOn(
      component.commentsSubscription,
      'unsubscribe'
    );
    component.ngOnDestroy();
    expect(unsubscriptionSpy).toHaveBeenCalledTimes(1);
  });

  it('should modal status unsubscribe', () => {
    component.modalStatusSubscription = of().subscribe();
    const unsubscriptionSpy = spyOn(
      component.modalStatusSubscription,
      'unsubscribe'
    );
    component.ngOnDestroy();
    expect(unsubscriptionSpy).toHaveBeenCalledTimes(1);
  });
});
