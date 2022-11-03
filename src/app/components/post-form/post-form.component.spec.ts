import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { Post } from 'src/app/models/post.interface';
import { PostFormComponent } from './post-form.component';


describe('PostForm Component', () => {
    let component: PostFormComponent;
    let fixture: ComponentFixture<PostFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PostFormComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PostFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with 3 controls', () => {
        expect(component.postForm.contains('title')).toBeTruthy()
        expect(component.postForm.contains('body')).toBeTruthy()
        expect(component.postForm.contains('postId')).toBeTruthy()
    })

    it('should mark title control as invalid if empty value', () => {
        const control = component.postForm.get('title') as FormControl;
        control.setValue('')
        expect(control.valid).toBeFalsy()
    })

    it('should mark body control as invalid if empty value', () => {
        const control = component.postForm.get('body') as FormControl;
        control.setValue('')
        expect(control.valid).toBeFalsy()
    })

    it('check input data when post form conponent init', () => {
        const post: Post = {
            body: "",
            comments: [{ postId: '2', id: '3', name: 'aaa', email: 'bbb', body: 'cccc' }],
            id: '22',
            title: "",
            userId: '3'
        };
        component.post = post;

        fixture.detectChanges();

        const controlTitle = component.postForm.get('title') as FormControl;
        const controlBody = component.postForm.get('body') as FormControl;

        expect(controlTitle.value).toEqual(post.title);
        expect(controlBody.value).toEqual(post.body);
    });

});
