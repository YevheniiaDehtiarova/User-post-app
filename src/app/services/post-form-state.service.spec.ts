import { TestBed } from '@angular/core/testing';
import { DEFAULT_POST } from '../models/default-post';
import { Post } from '../models/post.class';
import { PostFormStateService } from './post-form-state.service';


describe('PostFormStateService', () => {
  let service: PostFormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    service = TestBed.inject(PostFormStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test return observable boolean from getFormStatus method', () => {
    const state: boolean = false;
    service.getFormStatus().subscribe((value) => {
      expect(value).toBe(state)
    })
  })


  it('should test return post value from getInitialFormState method', () => {
    const post: Post = DEFAULT_POST;
    service.getInitialFormState().subscribe((value) => {
      expect(value).toBe(post)
    })
  })

  it('should test setInitialFormState method', () => {
    const testPost: Post = DEFAULT_POST;
    service.setInitialFormState(testPost);
    service.initialPost.subscribe(post => {
      expect(post).toBe(testPost);
    })
  })

  it('should test changeFormStatus method', () => {
    service.changeFormStatus(false);
    service.postState.subscribe(state => {
      expect(state).toBe(false);
    })
  })
})
