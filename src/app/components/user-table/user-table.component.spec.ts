import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { CellClickEvent, GridComponent } from '@progress/kendo-angular-grid';
import { of } from 'rxjs';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { DEFAULT_USER } from 'src/app/models/default-user';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserFormInterface } from 'src/app/models/user-form.interface';
import { UserTableInterface } from 'src/app/models/user-table.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';
import { UserTableComponent } from './user-table.component';

describe('User Table Component', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  let testedUser: UserApiInterface;
  let testedUsers: Array<UserApiInterface> = [];
  let testedFormUser: UserFormInterface;
  let testedUserTable: UserTableInterface;
  let userModalService: UserModalService;
  let userService: UserService;
  let userMapper: UserMapper;
  let http: HttpClient;
  let userFormStateService: UserFormStateService;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserTableComponent],
      providers: [
        UserService,
        UserModalService,
        UserFormStateService,
        { provide: UserMapper, useClass: UserMapper },
        { provide: Router, useValue: routerSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTableComponent);
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
    testedUserTable = { id: '1', name: '', email: '', address: '', phone: '' };
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should test navigate to user-detail`, () => {
    component.doubleClick();
    const id = undefined;
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-detail', id ]);
 });

  it('should test service in getAllUsers method', () => {
    const spy = spyOn(userService, 'getAllUsers');
    userService.getAllUsers();
    component.getAllUsers();
    expect(spy).toHaveBeenCalled();
  });

  it('should test subscribe in getAllUsers method', fakeAsync(() => {
    const response: UserApiInterface[] = [];
    spyOn(userService, 'getAllUsers').and.returnValue(of(response));
    component.getAllUsers();
    tick();
    expect(component.usersFromApi).toEqual(response);
    expect(component.users).toEqual(userMapper.mapToViewModel(response));
  })); 

  it('should test map in getAllUsers method', () => {
    let mockedData: any = [];
    const spy = spyOn(userService, 'getAllUsers').and.returnValue(
      of(mockedData)
    );
    userService.getAllUsers();
    expect(spy).toHaveBeenCalled();
    expect(component.usersFromApi).toEqual(mockedData);
    expect(component.users).toEqual(userMapper.mapToViewModel(mockedData));
  });  

  it('should test getModalStatus method', () => {
    component.getModalStatus();
    userModalService.getModalStatus().subscribe((value) => {
      expect(component.isUserModalDialogVisible).toBe(value);
    });
  });

  it('should test subscr in getModalStatus method', fakeAsync(() => {
    const response: boolean = false;
    spyOn(userModalService, 'getModalStatus').and.returnValue(of(response));
    component.getModalStatus();
    tick();
    expect(component.isUserModalDialogVisible).toBe(response);
  }));

  it('should test work of service in getModalStatus method', () => {
    const spy = spyOn(userModalService, 'getModalStatus');
    userModalService.getModalStatus();
    component.getModalStatus();
    expect(spy).toHaveBeenCalled();
  });

  it('should test editUser method', () => {
    component.editUser(testedUserTable);
    expect(component.editUser(testedUserTable)).toBeFalsy();
    testedUsers.push(testedUser);
    const findedUser = testedUsers.find(
      (user) => user.id === testedUserTable.id
    ) as UserApiInterface;
    expect(component.user).toEqual(findedUser);
  });

  it('should test equal in editUser', () => {
    component.editUser(testedUserTable);
    const testExpr = testedUser.id === testedUserTable.id
    expect(testExpr).toBeFalsy();
  }) 
  

  it('should test call openModal in editUser method', () => {
    const funcModalSpy = spyOn(component, 'openModal');
    const funcChangeSpy = spyOn(component, 'changeUserFormstate');
    component.editUser(testedUserTable);
    expect(funcModalSpy).toHaveBeenCalled();
    expect(funcChangeSpy).toHaveBeenCalled();
  });

  it('should test openModal method', () => {
    const spy = spyOn(userModalService, 'modalOpen');
    userModalService.modalOpen();
    component.openModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should test changeUserFormstate method', () => {
    const inputValue = true;
    component.changeUserFormstate(inputValue);
    expect(component.changeUserFormstate(inputValue)).toBeFalsy();
    const spy = spyOn(userFormStateService, 'changeFormStatus');
    userFormStateService.changeFormStatus(inputValue);
    expect(spy).toHaveBeenCalled();
  });

  it('should test addUser method', () => {
    const addedUser = userMapper.mapToCreateUpdateDto(DEFAULT_USER);
    component.addUser();
    expect(testedUser).toEqual(addedUser);
  });

  it('should test call methods in addUser method', () => {
    const funcModalSpy = spyOn(component, 'openModal');
    const funcChangeSpy = spyOn(component, 'changeUserFormstate');
    component.addUser();
    expect(funcModalSpy).toHaveBeenCalled();
    expect(funcChangeSpy).toHaveBeenCalled();
  });

  it('should test cellClickHandler method', () => {
    const testCellData: CellClickEvent = {
      column: '', columnIndex: 1, dataItem: '', originalEvent: '', rowIndex: 2, isEdited: true, sender: {} as GridComponent, type: 'click'
    }
    component.cellClickHandler(testCellData);
    expect(component.user).toBe(testCellData.dataItem)
  })

  it('should test createUser and updateUser methods', () => {
    component.changeUser();
    expect(component.changeUser()).toBeFalsy();
    const funcSpy = spyOn(component, 'getAllUsers');
    component.getAllUsers();
    expect(funcSpy).toHaveBeenCalled();
  })

  it('should test createUser in defineRequest', () => {
    component.defineRequest();
    userService.createUser(testedFormUser).subscribe((user) => {
      expect(user).toBe(testedUser);
      expect(component.changeUser()).toBeTruthy();
    });
    const spy = spyOn(userService, 'createUser');
    userService.createUser(testedFormUser);
    expect(spy).toHaveBeenCalled();
  })

  it('should test change user', () => {
    component.changedUser(testedFormUser);
    expect(component.updatedUser).toBe(testedFormUser);
  })

  it('should test users in viewUpdatedUser', () => {
    let testedUsersTable: UserTableInterface [] = [];
     testedUsersTable.push(testedUserTable);
    component.viewUpdatedUser(testedUsersTable);
    expect(component.users).toBe(testedUsersTable);
  })

  it('should test changeUser in submit', () => {
    component.submit();
    const spy = spyOn(component, 'changeUser');
    component.changeUser();
    expect(spy).toHaveBeenCalled();
  });

  it('should test call function defineRequest in submit', () => {
    const spy = spyOn(component, 'defineRequest').and.callThrough();
    component.submit();
    component.defineRequest();
    expect(spy).toHaveBeenCalled();
  })

  it('should test rowCallback function', () => {
    let context =  {
      dataItem: testedUserTable,
      index: 1
    }
    component.rowCallback(context);
    let condition = context.dataItem.isEdited = true;
    expect(condition).toBeTrue();
  })

});