import { TestBed } from '@angular/core/testing';
import { DEFAULT_POST } from '../models/default-post';
import { Post } from '../models/post.class';
import { PostFormStateService } from './post-form-state.service';


describe('PostFormStateService', () => {
  let service: PostFormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [ HttpClientTestingModule],
      // providers: [UserService]
    });
    service = TestBed.inject(PostFormStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*it('check value from initial post form state'), () => {
    service.initialPostFormState.subscribe((value) => {
      expect(value).toBe(DEFAULT_POST);
    })
  }*/

  /*it('check is post form for edit state'), () => {
    service.isPostFormForEdit.subscribe((value) => {
      expect(value).toBe(false);
    })
  }*/

  it('should return observable boolean from getFormStatus', () => {
    const state: boolean = false;
    service.getFormStatus().subscribe((value) => {
      expect(value).toBe(state)
    })
  })


  it('should return post value from getInitialFormState', () => {
    const post: Post = DEFAULT_POST;
    service.getInitialFormState().subscribe((value) => {
      expect(value).toBe(post)
    })
  })

  it('should  check setInitialFormState', () => {
    const testPost: Post = DEFAULT_POST;
    service.setInitialFormState(testPost);
    service.initialPost.subscribe(post => {
      expect(post).toBe(testPost);
    })
  })

  it('should check changeFormStatus', () => {
    service.changeFormStatus(false);
    service.postState.subscribe(state => {
      expect(state).toBe(false);
    })
  })
})
