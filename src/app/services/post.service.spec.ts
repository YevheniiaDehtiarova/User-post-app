import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Post } from '../models/post.class';
import { PostService } from './post.service';


describe('PostService', () => {
  let service: PostService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let testedPost: Post;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PostService);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new PostService(httpClientSpy);
    testedPost = {
      body: '',
      comments: [
        { postId: '2', id: '3', name: 'aaa', email: 'bbb', body: 'cccc' },
      ],
      id: '22',
      title: '',
      userId: '3',
    }

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return posts from getAllPosts', () => {
    const expectedPosts: Post[] = [];
    expectedPosts.push(testedPost);
    httpClientSpy.get.and.returnValue(of(expectedPosts));

    service.getAllPosts().subscribe({
      next: (posts) => {
        expect(posts).withContext('expected posts').toEqual(expectedPosts);
      },
    });
    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });

  it('should test getCommentById', () => {
    const spy = spyOn(service, 'getComments');
    service.getComments();
    expect(spy).toHaveBeenCalled();
  })
});
