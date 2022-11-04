import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostFormStateService } from 'src/app/services/post-form-state.service';
import { PostModalService } from 'src/app/services/post-modal.service';
import { PostService } from 'src/app/services/post.service';
import { PostComponent } from './post.component';
import {
    HttpClientTestingModule,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Comment } from '../../models/comment.interface';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Post } from 'src/app/models/post.interface';
import { findElement } from '@progress/kendo-angular-common';

describe('Post Component', () => {
    let component: PostComponent;
    let fixture: ComponentFixture<PostComponent>;
    let postModalService: PostModalService;
    let postService: PostService;
    let http: HttpClient;
    let postFormStateService: PostFormStateService;

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
        const testPostId = '2';
        postService.getCommentById(testPostId).subscribe((value) => {
            expect(value).toEqual(testComments);
        });
    });

    it('check input posts when post conponent init', () => {
        const testPosts: Post[] = [
            {
                body: '',
                comments: [
                    { postId: '2', id: '3', name: 'aaa', email: 'bbb', body: 'cccc' },
                ],
                id: '22',
                title: '',
                userId: '3',
            },
        ];
        component.posts = testPosts;

        fixture.detectChanges();
        expect(component.posts).toEqual(testPosts);
    });

    it('check method addPost'), () => {
        const testStatus = true;
        component.addPost();
        expect(component.isPostModalDialogVisible).toBe(testStatus);
    }

    it('check method editPost', () => {
        const testPost: Post = {
            body: '',
            comments: [
                { postId: '2', id: '3', name: 'aaa', email: 'bbb', body: 'cccc' },
            ],
            id: '22',
            title: '',
            userId: '3',
        }
        const testStatus = true;
        component.editPost(testPost);
        expect(component.post).toBe(testPost);
        expect(component.isPostModalDialogVisible).toBe(testStatus);
        expect(postFormStateService.setInitialFormState(testPost)).toBeTruthy;
    })

    it('check delete method', () => {
        const testPost: Post =
        {
            body: '', id: '22', title: '', userId: '3',
            comments: [{ postId: '2', id: '3', name: 'aaa', email: 'bbb', body: 'cccc' }]
        }
        const testPosts = [
            {
                body: '', id: '22', title: '', userId: '32',
                comments: [{ postId: '2', id: '3', name: 'aaa', email: 'bbb', body: 'cccc' }]
            },
            {
                body: '', id: '23', title: '', userId: '33',
                comments: [{ postId: '2', id: '3', name: 'aaa', email: 'bbb', body: 'cccc' }]
            }
        ];
        //const filterPosts = testPosts.filter((item) => testPost.id === item.id)
        component.deletePost(testPost);
        expect(postService.deletePost(testPost.id)).toBeTruthy();
        //expect(component.posts).toEqual(filterPosts)
    })

    /*it('check viewUpdatedPost', () => {
      const testPost: Post = {
          userId: '2',
          id: '13',
          title: "dolorum ut in voluptas mollitia et saepe quo animi",
          body: "aut dicta possimus sint mollitia voluptas commodi quo doloremque\niste corrupti reiciendis voluptatem eius rerum\nsit cumque quod eligendi laborum minima\nperferendis recusandae assumenda consectetur porro architecto ipsum ipsam",
          comments: [
              {
                  postId: '1',
                  id: '1',
                  name: "id labore ex et quam laborum",
                  email: "Eliseo@gardner.biz",
                  body: "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
              },
          ]
        }  
      const testFindElement = component.posts.find((post) => post.id !== testPost.id) as Post;
      //const tetstedComments = component.postsWithComments.find((post) => post.id !== testPost.id)?.comments
      expect(component.findElement).toBe(testFindElement);
      //expect(testPost.comments).toBe(tetstedComments);
      //expect(component.viewUpdatedPost(testPost)).toBeTruthy();
      //component.viewUpdatedPost(testPost);
    })*/

    /*it('check findedElemnt', () => {
   
       const testPosts: Post[] = [
           {
             body: 'Hello September',
             comments: [
               { postId: '1', id: '3', name: 'odio adipisci rerum aut animi', email: 'Nikita@garfield.biz', body: 'quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione' },
             ],
             id: '122',
             title: 'Hello autumm cvhnvfj',
             userId: '1',
           },
         ];
   
       const testPost: Post = {
           userId: '1',
           id: '122',
           title: "Hello autumm cvhnvfj",
           body: "Hello September",
           comments: [
               {
                   postId: '1',
                   id: '3',
                   name: "odio adipisci rerum aut animi",
                   email: "Nikita@garfield.biz",
                   body: "quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione"
               },
           ]
         } 
       const findElement = testPosts.find((post) => post.id === testPost.id) as Post;
       component.viewUpdatedPost(testPost);
       expect(component.findElement).toEqual(findElement);
       
   
    })/*
   })*/
})
