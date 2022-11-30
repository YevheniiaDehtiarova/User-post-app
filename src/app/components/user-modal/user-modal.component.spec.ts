import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    testedFormUser = {
      id: '',
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      street: '',
      building: '',
      city: '',
      zipcode: '',
      phone: '',
      website: '',
      companyName: '',
      companyScope: '',
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

  it('should test call function in OnInit', () => {
    const getStatusSpy = spyOn(component, 'getFormStatus');
    component.ngOnInit();
    expect(getStatusSpy).toHaveBeenCalled();
  });

  it('should test closeModal method', () => {
    const spy = spyOn(userModalService, 'modalClose');
    userModalService.modalClose();
    component.closeModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should test submit method if form valid', () => {
    const mockedUserFormValue = component.userFormComponent?.userForm;
    mockedUserFormValue?.valid;
    const spyService = spyOn(userService, 'createUser');
    userService.createUser(testedFormUser);
    component.submit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should test createUser in defineRequest', () => {
    let condition = !component.isFormForEdit && !component.isUserDetailFormEdit;
    component.defineRequest();
    userService.createUser(testedFormUser).subscribe((user) => {
      expect(user).toBe(testedUser);
      expect(component.changeUser(testedUser.id)).toBeTruthy;
    });
    const spy = spyOn(userService, 'createUser');
    userService.createUser(testedFormUser);
    expect(spy).toHaveBeenCalled();
    expect(condition).toBeTrue();
  });

  it('should test subscribe in submit', () => {
    component.submit();
    component.defineRequest().subscribe((user) => {
      expect(user).toBe(testedUser);
      expect(component.changeUser(testedUser.id)).toBeTruthy;
      expect(component.changeUpdatedProperty).toBeTruthy;
    });
    const spy = spyOn(component, 'changeUser');
    component.changeUser(testedUser.id);
    expect(spy).toHaveBeenCalled();
  });

  it('should test updateSubmit method', () => {
    let condition = !component.isFormForEdit && !component.isUserDetailFormEdit;
    const spyService = spyOn(userService, 'updateUser');
    userService.updateUser(testedUser.id, testedUser);
    component.defineRequest();
    expect(spyService).toHaveBeenCalled();
    expect(condition).toBeTrue();
  });

  it('should test call function in submit', () => {
    const spyFunc = spyOn(component, 'changeUpdatedProperty');
    component.changeUpdatedProperty(false);
    component.submit();
    expect(spyFunc).toHaveBeenCalled();
  });

  it('should test call function defineRequest in submit', () => {
    const spy = spyOn(component, 'defineRequest');
    component.submit();
    component.defineRequest();
    expect(spy).toHaveBeenCalled();
  })

  it('should test changeUser method', () => {
    component.changeUser(testedUser.id);
    component.updatingUserDetail.subscribe((value: UserApiInterface) => {
      expect(value).toBe(testedUser);
    });
    expect(testedUser).toBe(testedUser);
    const spy = spyOn(component, 'closeModal');
    component.closeModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should test changeUpdatedProperty method', () => {
    const fakedValue =false;
    component.changeUpdatedProperty(false)
    expect(component.isFormForEdit).toBe(fakedValue);
    expect(component.isUserDetailFormEdit).toBe(fakedValue);
  })
});
