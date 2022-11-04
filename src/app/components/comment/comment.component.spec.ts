import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PostForm Component', () => {
    let component: CommentComponent;
    let fixture: ComponentFixture<CommentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CommentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CommentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /*it('check input data when comment form component init', () => {
        const testComment: Comment = {
             id: '3', name: 'aaa', email: 'bbb', body: 'cccc' , postId: '1'
        };
        component.comment = testComment;

        //fixture.detectChanges();

        expect(component.comment.name).toEqual(testComment.name);

        /*const controlTitle = component.postForm.get('title') as FormControl;
        const controlBody = component.postForm.get('body') as FormControl;

        expect(controlTitle.value).toEqual(post.title);
        expect(controlBody.value).toEqual(post.body);*/
    });


