import { TestBed } from '@angular/core/testing';
import { DEFAULT_POST } from '../models/default-post';
import { PostFormStateService } from './post-form-state.service';
import { Post } from '../models/post.interface';


describe('PostFormStateService', () => {
  let service: PostFormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostFormStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('check value from initial post form state'), () => {
    service.initialPostFormState.subscribe((value) => {
      expect(value).toBe(DEFAULT_POST);
    })
  }

  it('check is post form for edit state'), () => {
    service.isPostFormForEdit.subscribe((value) => {
      expect(value).toBe(false);
    })
  }

  it('should return observable boolean from getFormStatus'), () => {
    service.getFormStatus().subscribe((value) =>
      expect(value).toBe(false))
  }

  it('should return post value from getInitialFormState', () => {
    const post: Post = DEFAULT_POST;
    service.getInitialFormState().subscribe((value) => {
      expect(value).toBe(post)
    })
  })

  it('should check  input value setInitialFromState', () => {
    const post = DEFAULT_POST;
     expect(service.setInitialFormState(post)).toBe();
    })

    it('should check input value from changeFormStatus'), () => {
      expect(service.changeFormStatus(false)).toBe();
    }

  })

