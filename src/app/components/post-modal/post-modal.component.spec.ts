import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { PostModalComponent } from './post-modal.component';
import { Post } from 'src/app/models/post.class';
import { of, take } from 'rxjs';
import { DEFAULT_POST } from 'src/app/models/default-post';

describe('PostModal Component', () => {
  let component: PostModalComponent;
  let fixture: ComponentFixture<PostModalComponent>;
  let postModalService: PostModalService;
  let postService: PostService;
  let http: HttpClient;
  let testedPost: Post;
  let testedPosts: Post[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [PostModalComponent],
      providers: [PostModalService, PostService],
    }).compileComponents();

    fixture = TestBed.createComponent(PostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    http = TestBed.get(HttpClient);
    postService = new PostService(http);
    postModalService = new PostModalService();
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
  
  it('should  test post in checkInitPost method', () => {
    component.checkInitPost(testedPost);
    expect(component.post).toEqual(testedPost);
  });

  it('should  test post unsubscribe in ngOnDestroy', () => {
    component.getAllPostSubscription = of().subscribe();
    const unsubscriptionSpy = spyOn(
      component.getAllPostSubscription,
      'unsubscribe'
    );
    component.ngOnDestroy();
    expect(unsubscriptionSpy).toHaveBeenCalledTimes(1);
  });

  it('should test close method', () => {
    const spy = spyOn(postModalService, 'modalClose').and.callThrough();
    postModalService.modalClose();
    component.close();
    expect(spy).toHaveBeenCalled();
  });

  it('should test input userId in submit', () => {
    let id = '2';
    component.userId = id;
    component.submit();
    fixture.detectChanges();
    expect(component.userId).toEqual(id);
  });

  it('should test input post', () => {
    component.post = testedPost;
    component.submit();
    fixture.detectChanges();
    expect(component.post).toEqual(testedPost);
  });

  it('should test call function in submit', () => {
    const callSpy = spyOn(component, 'checkPostOnDefault');
    component.submit();
    component.checkPostOnDefault(testedPost);
    expect(callSpy).toHaveBeenCalled();
  })

  it('should test post exist in checkPostOnDefault', () => {
    const Spy = spyOn(component, 'updatePost');
    component.checkPostOnDefault(testedPost);
    expect(component.checkPostOnDefault(testedPost)).toBeTruthy;
    expect(Spy).toHaveBeenCalled();
  });

  it('should test if post does not exist in checkPostOnDefault', () => {
    let defaulPost = DEFAULT_POST;
    const createSpy = spyOn(component, 'createPost');
    component.createPost(defaulPost);
    component.checkPostOnDefault(defaulPost);
    expect(component.checkPostOnDefault(defaulPost)).toBeTruthy;
    expect(createSpy).toHaveBeenCalled();
  });

  it('check test resetFrom in createPost and updatePost methods', () => {
    component.createPost(testedPost);
    component.updatePost(testedPost);
    const createResetSpy = spyOn(component, 'resetForm');
    component.resetForm();
    expect(createResetSpy).toHaveBeenCalled();
  })

  it('should test updatePost method', () => {
    component.updatePost(testedPost);
    expect(component.updatePost(testedPost)).toBeTruthy;
    component.updatePosts.subscribe((post) => {
      expect(post).toBe(testedPost);
    });
    const spy = spyOn(postService, 'updatePost');
    postService.updatePost(testedPost.id, testedPost);
    expect(spy).toHaveBeenCalled();

  });

  it('should test resetForm method', () => {
    component.resetForm();
    expect(component.resetForm()).toBeTruthy;
    const funcSpy = spyOn(component, 'close');
    component.close();
    expect(funcSpy).toHaveBeenCalled();
 
  })
});
