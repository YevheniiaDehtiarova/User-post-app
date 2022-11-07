import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { PostModalComponent } from './post-modal.component';
import { Post } from 'src/app/models/post.class';
import { of } from 'rxjs';

describe('PostModal Component', () => {
  let component: PostModalComponent;
  let fixture: ComponentFixture<PostModalComponent>;
  let postModalService: PostModalService;
  let postService: PostService;
  let http: HttpClient;
  let testedPost: Post;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [PostModalComponent],
      providers: [  PostModalService, PostService],
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
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check subscription in init' , () => {
    let response: Post[];
    component.ngOnInit();
    fixture.whenStable().then(() => {
        expect(component.postLength).toEqual(response.length)
    })
  })

  it ('should check post in checkInitPost' , () => {
    component.checkInitPost(testedPost);
    expect(component.post).toEqual(testedPost)
  })

  it('should post unsubscribe', () => {
    component.getAllPostSubscription = of().subscribe();
    const unsubscriptionSpy = spyOn(component.getAllPostSubscription,'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscriptionSpy).toHaveBeenCalledTimes(1);
  });

  it('should test close method', () => {
   const spy = spyOn(postModalService, 'modalClose').and.callThrough();
   postModalService.modalClose();
   component.close();
   expect(spy).toHaveBeenCalled()
  })
});
