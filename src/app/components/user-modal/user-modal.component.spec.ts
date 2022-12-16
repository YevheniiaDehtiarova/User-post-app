import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMapper } from 'src/app/mappers/user.mapper';import { UserFormInterface } from 'src/app/models/user-form.interface';
import { UserTableInterface } from 'src/app/models/user-table.interface';
;
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';
import { UserModalComponent } from './user-modal.component';

describe('User Modal Component', () => {
  let component: UserModalComponent;
  let fixture: ComponentFixture<UserModalComponent>;
  let userModalService: UserModalService;
  let http: HttpClient;
  let userFormStateService: UserFormStateService;
  let testedFormUser: UserFormInterface;
  let testedUser: UserTableInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserModalComponent],
      providers: [
        UserService,
        UserModalService,
        UserFormStateService,
        { provide: UserMapper, useClass: UserMapper },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserModalComponent);
    component = fixture.componentInstance;
    http = TestBed.get(HttpClient);
    userModalService = new UserModalService();
    userFormStateService = new UserFormStateService();
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
  testedUser = { id: '1', name: '', email: '', address: '', phone: '' };

    fixture.detectChanges();
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
    const mockedUserFormValue = true;
    component.applyUser();
    expect(mockedUserFormValue).toBeTruthy();
  });

  it('should test updateUser in applyUser', () => {
    let condition = component.isFormForEdit && component.isUserDetailFormEdit;
    component.applyUser();
    const spy = spyOn(component, 'updateUser');
    component.updateUser(testedUser);
    expect(spy).toHaveBeenCalled();
    expect(condition).toBeFalse();
  });

  it('should test call changeUpdatedProperty function in applyUser()', () => {
    const spyFunc = spyOn(component, 'changeUpdatedProperty');
    component.changeUpdatedProperty(false);
    component.applyUser();
    expect(spyFunc).toHaveBeenCalled();
  });
  
  it('should test emit im applyUser', () => {
    spyOn(component.changingUser, 'emit');
    component.applyUser();
    component.changingUser.emit(component.userFormComponent?.userForm?.value)
    expect(component.changingUser.emit).toHaveBeenCalled();
  })
  
  it('should test condition in applyUser', () => {
    component.isFormForEdit = false;
    component.isUserDetailFormEdit = false;
    let condition = !component.isFormForEdit && !component.isUserDetailFormEdit;
    expect(condition).toBeTrue();
    component.applyUser();
    const spy = spyOn(component, 'createUser');
    component.createUser(testedUser);
    expect(spy).toHaveBeenCalled();
  })

 it('should test changeUser method', () => {
    component.applyUser();
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

  it('should test method createUser', () => {
    let usersFromTable:UserTableInterface[]  = [];
    component.createUser(testedUser);
    expect(component.usersFromTable.length).toEqual(1);
  })
  
  it('should test emit in createUser()', () => {
    let usersFromTable:UserTableInterface[]  = [];
    component.createUser(testedUser);
    spyOn(component.updatedUsersFromTable, 'emit');
    component.updatedUsersFromTable.emit(usersFromTable)
    expect(component.updatedUsersFromTable.emit).toHaveBeenCalled();
  })

  it('should test push in array in createUser', () => {
    component.createUser(testedUser);
    expect(component.usersFromTable.push(testedUser)).toBe(2)
  })

  it('should test emit in updateUser()', () => {
    let usersFromTable:UserTableInterface[]  = [];
    component.updateUser(testedUser);
    spyOn(component.updatedUsersFromTable, 'emit');
    component.updatedUsersFromTable.emit(usersFromTable)
    expect(component.updatedUsersFromTable.emit).toHaveBeenCalled();
  })
  
});
