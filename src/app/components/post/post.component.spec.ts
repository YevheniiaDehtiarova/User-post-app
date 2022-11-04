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

describe('Post Component', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let postModalService: PostModalService;
  let postService: PostService;
  let http: HttpClient;
  let postFormStateService: PostFormStateService;
  let testedPost: Post;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [PostComponent],
      providers: [PostModalService, PostFormStateService, PostService],
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
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

  it('check comments in ngOnInit', () => {
    const testComments: Comment[] = [
      { postId: '1', id: '2', name: '', email: 'acfzasgvf', body: 'svgxdsebg' },
    ];
    postService.getCommentById(component.post?.id).subscribe((value) => {
      expect(value).toBe(testComments);
    });
  });

  it('check splicePosts', () => {
    const testPost: Post = testedPost;
    component.splicePosts(testPost, component.posts);
    const index = component.posts.indexOf(testPost);
    expect(component.posts?.splice(index, 1, testPost)).toBeTruthy();
  });

  it('check commentSubscriprion', () => {
    const testPost: Post = testedPost;

    const testComments: Comment[] = [
      { postId: '1', id: '2', name: '', email: 'acfzasgvf', body: 'svgxdsebg' },
    ];
    component.createCommentSubscription(testPost);
    postService.getCommentById(testPost.id).subscribe((value) => {
      expect(value).toBe(testComments);
    });
  });

  it('check input posts when post conponent init', () => {
    const testPosts: Post[] = [];
    testPosts.push(testedPost);
    component.posts = testPosts;

    fixture.detectChanges();
    expect(component.posts).toEqual(testPosts);
  });

  it('check post in method addPost', () => {
    const testPost = DEFAULT_POST;
    component.addPost();
    expect(component.post).toBe(testPost);
  });

  it('check changePostModalDialogVisible', () => {
    component.changePostModalDialogVisible();
    expect(component.isPostModalDialogVisible).toBeTruthy();
  });

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

  it('check delete method', () => {
    const testPost: Post = testedPost;
    component.deletePost(testPost);
    expect(postService.deletePost(testPost.id)).toBeTruthy();
  });

  it('check viewUpdatedPost', () => {
    const testPost: Post = testedPost;
    component.viewUpdatedPost(testPost);
    const testedPosts = [];
    testedPosts.push(testPost);
    const testFindElement = component.posts?.find(
      (post) => post?.id !== testPost.id
    ) as Post;
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
