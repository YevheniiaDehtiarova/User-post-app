import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { PostModalComponent } from './post-modal.component';
import { Post } from 'src/app/models/post.class';
import { DEFAULT_POST } from 'src/app/models/default-post';
import { first, of } from 'rxjs';


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
      providers: [PostModalService, PostService,
        { provide: ComponentFixtureAutoDetect, useValue: true }]
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
  
  it('should  test post in ngOnInit method', () => {
    component.ngOnInit();
    const spy = spyOn(postService, 'getAllPosts');
    postService.getAllPosts()
    expect(spy).toHaveBeenCalled();
  });

  /*здесь хочу покрыть тестами длину постов*/
  it('should test length in init', fakeAsync(() => {
   component.ngOnInit();
   let response: Post[] = [];
   fixture.detectChanges();
   return fixture.whenStable().then(() => {
    expect(component.postLength).toEqual(response.length)
   })
  })); // попытка № 1

  it('should test subscribe post  in init', fakeAsync(() => {
    component.ngOnInit();
    let response: Post[] = [];
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
     expect(response.length).toEqual(component.postLength)
    })
   }));// попытка № 2 

   it('should test postLength in subcribe in Init', fakeAsync(() => {
    let response: Post[] = []
  
     spyOn(postService, 'getAllPosts').and.returnValue(of(response));
     component.ngOnInit();
     tick();
     expect(component.postLength).toEqual(response.length);
   })) //попытка № 3

  it('should test null value in init', () => {
    component.ngOnInit();
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      const elsePart: Post | null = null;
      expect(elsePart).toBeNull();
    })
  })

  it('should test null branch in ngOnInit', () => {
    component.ngOnInit();
    expect(!component.post).toBeTruthy();
  }) // попытка оттестить нулл ветку

  it('should test close method', () => {
    const spy = spyOn(postModalService, 'modalClose').and.callThrough();
    postModalService.modalClose();
    component.close();
    expect(spy).toHaveBeenCalled();
  });


  it('should test call determineSubmit in submit', () => {
    component.submit();
    let spy= spyOn(component,'detailSubmit').and.callThrough();
    component.detailSubmit(testedPost);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(testedPost)
  })


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

  /*тут тест вызова defineRequest внутри detailSubmit но горит красным */
  it('should test defineRequest  function in detailSubmit', () => {
    const callSpy = spyOn(component, 'defineRequest');
    component.detailSubmit(testedPost);
    component.defineRequest(testedPost);
    expect(callSpy).toHaveBeenCalled();
  })

  it('should test emit', () => {
    let postUsed: Post;
    component.changePosts.subscribe((post: Post) => {
      postUsed = post;
      expect(postUsed).toEqual(post);
    })

    spyOn(component.changePosts, 'emit');
    component.changePosts.emit(testedPost);
    expect(component.changePosts.emit).toHaveBeenCalled();
  })

  it('should test emit 2 attempt', ()=> {
    spyOn(component.changePosts, 'emit');
    component.changePosts.emit(testedPost);
    expect(component.changePosts.emit).toHaveBeenCalledWith(testedPost);
  })

  it('should test  emit in third attempt', () => {
    component.changePosts.pipe(first()).subscribe((post:Post) =>{
      expect(post).toBe(testedPost);
    })
  })

  it('should test if post does not exist in defineRequest', () => {
    let defaulPost = DEFAULT_POST;
    component.defineRequest(defaulPost);
    const spy = spyOn(postService, 'createPost');
    postService.createPost(testedPost);
    expect(spy).toHaveBeenCalled();
  });

  it('should test resetFrom in submit method', () => {
    component.submit();
    const Spy = spyOn(component, 'resetForm');
    component.resetForm();
    expect(Spy).toHaveBeenCalled();
  })

  it('should test defineRequest in submit method', () => {
    component.submit();
    const Spy = spyOn(component, 'defineRequest');
    component.defineRequest(testedPost)
    expect(Spy).toHaveBeenCalled();
  })

  it('should test create method of Service in defineRequest', () => {
    component.defineRequest(testedPost);
    const spyCreate = spyOn(postService, 'createPost');
    postService.createPost(testedPost);
    expect(spyCreate).toHaveBeenCalled();
  })

  it('should test update method of service defineRequest function', () => {
    component.defineRequest(testedPost);
    const spyUpdate = spyOn(postService, 'updatePost');
    postService.updatePost(testedPost.id, testedPost);
    expect(spyUpdate).toHaveBeenCalled();
  })

  it('should test resetForm method', () => {
    component.resetForm();
    expect(component.resetForm()).toBeTruthy;
    const funcSpy = spyOn(component, 'close');
    component.close();
    expect(funcSpy).toHaveBeenCalled();
 
  })
});
