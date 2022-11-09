import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserFormComponent } from './user-form.component';
import { FormControl } from '@angular/forms';

describe('UserFormComponent', () => {
    let component: UserFormComponent;
    let fixture: ComponentFixture<UserFormComponent>;
    let testedUser: UserApiInterface;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
            declarations: [UserFormComponent],
            providers: [],
        }).compileComponents();

        fixture = TestBed.createComponent(UserFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        testedUser = {
            id: '1',
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            address: {
                street: '',
                building: '',
                city: '',
                zipcode: '',
            },
            phone: '',
            website: '',
            company: {
                name: '',
                scope: '',
            },
        };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should test creating form with 13 controls', () => {
        expect(component.userForm.contains('id')).toBeTruthy();
        expect(component.userForm.contains('firstName')).toBeTruthy();
        expect(component.userForm.contains('lastName')).toBeTruthy();
        expect(component.userForm.contains('email')).toBeTruthy();
        expect(component.userForm.contains('street')).toBeTruthy();
        expect(component.userForm.contains('building')).toBeTruthy();
        expect(component.userForm.contains('city')).toBeTruthy();
        expect(component.userForm.contains('zipcode')).toBeTruthy();
        expect(component.userForm.contains('phone')).toBeTruthy();
        expect(component.userForm.contains('website')).toBeTruthy();
        expect(component.userForm.contains('companyName')).toBeTruthy();
        expect(component.userForm.contains('companyScope')).toBeTruthy();
    })

    it('should test if form invalid', () => {
        component.userForm.get('firstName')?.setValue('');
        component.userForm.get('lastName')?.setValue('');
        component.userForm.get('userName')?.setValue('');
        component.userForm.get('email')?.setValue('');
        component.userForm.get('street')?.setValue('');
        component.userForm.get('building')?.setValue('');
        component.userForm.get('city')?.setValue('');
        component.userForm.get('zipcode')?.setValue('');
        component.userForm.get('phone')?.setValue('');
        component.userForm.get('website')?.setValue('');
        component.userForm.get('companyName')?.setValue('');
        component.userForm.get('companyScope')?.setValue('');

        expect(component.userForm.valid).toBeFalsy();
    });

    it('should test email field validity', () => {
        const email = component.userForm.get('email') as FormControl;
        expect(email.valid).toBeFalsy();

        email.setValue('');
        expect(email.hasError('required')).toBeTruthy();
    });

    it('should test input data when userFormComponent init', () => {
        component.user = testedUser;
        fixture.detectChanges();

        expect(component.userForm.get('firstName')?.value).toEqual(testedUser.firstName);
        expect(component.userForm.get('lastName')?.value).toEqual(testedUser.lastName);
        expect(component.userForm.get('userName')?.value).toEqual(testedUser.username);
        expect(component.userForm.get('email')?.value).toEqual(testedUser.email);
        expect(component.userForm.get('street')?.value).toEqual(testedUser.address.street);
        expect(component.userForm.get('building')?.value).toEqual(testedUser.address.building);
        expect(component.userForm.get('city')?.value).toEqual(testedUser.address.city);
        expect(component.userForm.get('zipcode')?.value).toEqual(testedUser.address.zipcode);
        expect(component.userForm.get('phone')?.value).toEqual(testedUser.phone);
        expect(component.userForm.get('website')?.value).toEqual(testedUser.website);
        expect(component.userForm.get('companyName')?.value).toEqual(testedUser.company.name);
        expect(component.userForm.get('companyScope')?.value).toEqual(testedUser.company.scope);
    });

});
