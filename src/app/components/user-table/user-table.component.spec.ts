import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserFormInterface } from 'src/app/models/user-form.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';
import { UserTableComponent } from './user-table.component';


describe('User Table Component', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  let testedUser: UserApiInterface;
  let userModalService: UserModalService;
  let userService: UserService;
  let userMapper: UserMapper;
  let http: HttpClient;
  let userFormStateService: UserFormStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserTableComponent],
      providers: [
        UserService,
        UserModalService,
        UserFormStateService,
        { provide: UserMapper, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;
    http = TestBed.get(HttpClient);
    userService = new UserService(http);
    userModalService = new UserModalService();
    userMapper = new UserMapper();
    userFormStateService = new UserFormStateService(new UserMapper());

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

  it('should test service in getAllUsers method', () => {
    const spy = spyOn(userService, 'getAllUsers');
    userService.getAllUsers();
    component.getAllUsers();
    expect(spy).toHaveBeenCalled();
  })

  it('should test subscribe in getAllUsers method', fakeAsync(() => {
    const response: UserApiInterface[] = [];
    spyOn(userService, 'getAllUsers').and.returnValue(of(response))
    component.getAllUsers();
    tick();
    expect(component.usersFromApi).toEqual(response);
    expect(component.users).toEqual(userMapper.mapToViewModel(response))
  }));

  it('should test getModalStatus' , () => {
    component.getModalStatus();
    userModalService.getModalStatus().subscribe((value)=> {
        expect(component.isUserModalDialogVisible).toBe(value)
    })
  })

  it('should test subscr in getModalStatus', fakeAsync(() => {
    const response: boolean = false;
    spyOn(userModalService, 'getModalStatus').and.returnValue(of(response))
    component.getModalStatus();
    tick();
    expect(component.isUserModalDialogVisible).toBe(response)
  }))

  it('should test work of service in getModalStatus', () => {
    const spy = spyOn(userModalService,'getModalStatus');
    userModalService.getModalStatus();
    component.getModalStatus();
    expect(spy).toHaveBeenCalled();
  })

});




