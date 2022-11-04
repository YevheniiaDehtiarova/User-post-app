import { TestBed } from '@angular/core/testing';
import { UserMapper } from '../mappers/user.mapper';
import { DEFAULT_USER } from '../models/default-user';
import { UserApiInterface } from '../models/user-api.interface';
import { UserFormInterface } from '../models/user-form.interface';
import { UserFormStateService } from './user-form-state.service';


describe('UserFormStateService', () => {
  let service: UserFormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
         providers: [UserMapper]
    });
    service = TestBed.inject(UserFormStateService);
    //service = new UserFormStateService(new UserMapper())  //1 way yet
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('check value from initialFormState'), () => {
    const defaultValue: UserFormInterface = DEFAULT_USER;
    service.initialFormState.subscribe((value) => {
      expect(value).toBe(defaultValue);
    })
  }

  it('check value isFormForEdit'), () => {
    service.isFormForEdit.subscribe((value) => {
      expect(value).toBe(false);
    })
  }


  it('should  check setInitialFormState', () => {
    const initState: UserFormInterface = DEFAULT_USER; 
    const mappedState = UserMapper.prototype.mapToCreateUpdateDto(initState)
    service.setInitialFormState(mappedState); 
    service.getFormState().subscribe(state => {
      expect(state).toEqual(initState);
    })
  })

  it('should check changeFormStatus', () => {
    const initState: boolean = false;
    service.changeFormStatus(initState);
    service.getFormStatus().subscribe(state => {
      expect(state).toBe(initState);
    })
  })

})
