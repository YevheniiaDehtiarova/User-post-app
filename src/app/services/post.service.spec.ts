import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Post } from '../models/post.class';
import { PostService } from './post.service';


describe('PostService', () => {
  let service: PostService;
  let httpController: HttpTestingController;
  let testedPost: Post;
  let url = 'http://localhost:3000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PostService);
    httpController = TestBed.inject(HttpTestingController);

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

  it('should test return posts from getAllPosts', () => {
    const expectedPosts: Post[] = [];
    expectedPosts.push(testedPost);
    service.getAllPosts().subscribe((posts) => {
      expect(posts).toEqual(expectedPosts);
  });
    const req = httpController.expectOne({method: 'GET',url: `${url}/posts`});
    req.flush(expectedPosts);
  });

  it('should test create post in createPost', () => {
    service.createPost(testedPost).subscribe((post) => {
      expect(post).toEqual(testedPost);
  });
  const req = httpController.expectOne({ method: 'POST', url: `${url}/posts` })
  req.flush(testedPost);
  })

  it('should test update post in updatePost', () => {
    const id ='1';
    service.updatePost(id, testedPost).subscribe((post)=>{
      expect(post).toEqual(testedPost);
    });
    const req = httpController.expectOne({method: 'PUT',url: `${url}/posts/${id}`});
    req.flush(testedPost);
  })

  it('should test delete post in deletePost', () => {
    const id ='1';
    service.deletePost(id).subscribe((post)=>{
      expect(post).toEqual(testedPost);
    });
    const req = httpController.expectOne({method: 'DELETE',url: `${url}/posts/${id}`});
    req.flush(testedPost);
  })

  it('should test return comments in getComments and in getCommentById', () => {
    const expectedComments = [
      { postId: '2', id: '3', name: 'aaa', email: 'bbb', body: 'cccc' },
    ]
    service.getComments().subscribe((comments) => {
      expect(comments).toEqual(expectedComments);
  });
    const req = httpController.expectOne({method: 'GET',url: `${url}/comments`});
    req.flush(expectedComments);
  })
});
