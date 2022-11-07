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

  it('should test output updatePosts', () => {
    spyOn(component.updatePosts, 'emit');
    component.post = testedPost;
    component.submit();

    expect(component.updatePosts.emit).not.toHaveBeenCalled();
  })

  it('should test output createPosts', () => {
    spyOn(component.createPosts, 'emit');
    component.post = testedPost;
    component.submit();

    expect(component.createPosts.emit).not.toHaveBeenCalled();
  })

  it('should test input userId in submit', () => {
     let id = '2';
     component.userId = id;;
     component.submit();
     fixture.detectChanges();
     expect(component.userId).toEqual(id);
  })

  it('should test input post', () => {
    component.post = testedPost;
    component.submit();
    fixture.detectChanges();
    expect(component.post).toEqual(testedPost);
  });

});
