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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test return observable from getFormStatus method', () => {
    service.getFormStatus().subscribe((value) => {
      expect(value).toBe(false);
    })
  })

  it('should test return observable from getFormState method', () => {
    service.getFormState().subscribe((value) => {
      expect(value).toBe(DEFAULT_USER);
    })
  })


  it('should  test setInitialFormState method', () => {
    const initState: UserFormInterface = DEFAULT_USER;
    const mappedState = UserMapper.prototype.mapToCreateUpdateDto(initState)
    service.setInitialFormState(mappedState);
    service.getFormState().subscribe(state => {
      expect(state).toEqual(initState);
    })
  })

  it('should test changeFormStatus method', () => {
    const initState: boolean = false;
    service.changeFormStatus(initState);
    service.getFormStatus().subscribe(state => {
      expect(state).toBe(initState);
    })
  })
})
