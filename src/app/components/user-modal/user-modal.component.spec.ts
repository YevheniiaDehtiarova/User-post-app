import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserFormInterface } from 'src/app/models/user-form.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';
import { UserModalComponent } from './user-modal.component';

describe('User Modal Component', () => {
  let component: UserModalComponent;
  let fixture: ComponentFixture<UserModalComponent>;
  let testedUser: UserApiInterface;
  let testedFormUser: UserFormInterface;
  let userModalService: UserModalService;
  let userService: UserService;
  let userMapper: UserMapper;
  let http: HttpClient;
  let userFormStateService: UserFormStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserModalComponent],
      providers: [
        UserService,
        UserModalService,
        UserFormStateService,
        { provide: UserMapper, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserModalComponent);
    component = fixture.componentInstance;
    http = TestBed.get(HttpClient);
    userService = new UserService(http);
    userModalService = new UserModalService();
    userMapper = new UserMapper();
    userFormStateService = new UserFormStateService();

    fixture.detectChanges();
    testedUser = {
      id: '',
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

  it('should test getFormStatus', () => {
    let mockedValue = false;
    component.getFormStatus();
    userFormStateService.getFormStatus().subscribe((value) => {
      expect(value).toBe(mockedValue);
    });
    expect(component.isFormForEdit).toBe(mockedValue);
  });

  it('should test work of service in getFormstatus', () => {
    const spy = spyOn(userFormStateService, 'getFormStatus');
    userFormStateService.getFormStatus();
    component.getFormStatus();
    expect(spy).toHaveBeenCalled();
  });

  it('should call function in init', () => {
    const getStatusSpy = spyOn(component, 'getFormStatus');
    component.ngOnInit();
    expect(getStatusSpy).toHaveBeenCalled();
  });

  it('should userForm unSubscribe', () => {
    component.userFormSubscription = of().subscribe();
    const unsubscriptionSpy = spyOn(
      component.userFormSubscription,
      'unsubscribe'
    );
    component.ngOnDestroy();
    expect(unsubscriptionSpy).toHaveBeenCalledTimes(1);
  });

  it('should test closeModal', () => {
    const spy = spyOn(userModalService, 'modalClose');
    userModalService.modalClose();
    component.closeModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should test submit if form valid', () => {
    const mockedUserFormValue = component.userFormComponent?.userForm;
    mockedUserFormValue?.valid;
    const spyService = spyOn(userService, 'createUser');
    userService.createUser(testedUser);
    component.submit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should test submit if form invalid', () => {
    const mockedUserFormValue = component.userFormComponent?.userForm;
    mockedUserFormValue?.invalid;
    component.submit();
    expect(component.userFormComponent?.userForm.markAllAsTouched()).toBeTruthy;
  });

  it('should test subscribe in submit', () => {
    component.submit();
    userService.createUser(testedUser).subscribe((user) => {
      expect(user).toBe(testedUser);
      expect(component.createOutputUser(testedUser)).toBeTruthy;
    });
    const spy = spyOn(component, 'createOutputUser');
    component.createOutputUser(testedUser);
    expect(spy).toHaveBeenCalled();
  });

  it('test creating in createOutputUser', () => {
    component.createOutputUser(testedUser);
    component.creating.subscribe((value: UserApiInterface) => {
      expect(value.email).toBe('test@example.com');
      expect(value.firstName).toBe('user1');
      value = testedUser;
    });
    expect(testedUser).toBe(testedUser);

    const spy = spyOn(component, 'closeModal');
    component.closeModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should test updateSubmit', () => {
    const spyService = spyOn(userService, 'updateUser');
    userService.updateUser(testedUser.id, testedUser);
    component.updateSubmit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should test call function updateSubmit', () => {
    const spyFunc = spyOn(component, 'changeUpdatedProperty');
    component.changeUpdatedProperty(false);
    component.updateSubmit();
    expect(spyFunc).toHaveBeenCalled();
  });

  it('should test createOutputUser', () => {
    component.updateOutputUser(testedUser);
    component.updating.subscribe((value: UserApiInterface) => {
      expect(value).toBe(testedUser);
    });
    expect(testedUser).toBe(testedUser);
    component.updatingDetail.subscribe((value: UserApiInterface) => {
      expect(value).toBe(testedUser);
    });
    const spy = spyOn(component, 'closeModal');
    component.closeModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should test changeUpdatedProperty', () => {
    const fakedValue =false;
    component.changeUpdatedProperty(false)
    expect(component.isFormForEdit).toBe(fakedValue);
    expect(component.isUserDetailFormEdit).toBe(fakedValue);
  })
});
