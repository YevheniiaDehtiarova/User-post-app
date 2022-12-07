import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { Post } from 'src/app/models/post.class';
import { PostFormComponent } from './post-form.component';


describe('PostForm Component', () => {
    let component: PostFormComponent;
    let fixture: ComponentFixture<PostFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PostFormComponent],
        })
            .compileComponents();

        fixture = TestBed.createComponent(PostFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should test creating form with 3 controls', () => {
        expect(component.postForm.contains('title')).toBeTruthy()
        expect(component.postForm.contains('body')).toBeTruthy()
        expect(component.postForm.contains('postId')).toBeTruthy()
    })

    it('should test mark title control as invalid if empty value', () => {
        const control = component.postForm.get('title') as FormControl;
        control.setValue('')
        expect(control.valid).toBeFalsy()
    })

    it('should test mark body control as invalid if empty value', () => {
        const control = component.postForm.get('body') as FormControl;
        control.setValue('')
        expect(control.valid).toBeFalsy()
    })

    it('should test input data when post form conponent ngOnInit', () => {
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

        /*expect(controlTitle.value).toEqual();
        expect(controlBody.value).toEqual('');*/
    });

});
