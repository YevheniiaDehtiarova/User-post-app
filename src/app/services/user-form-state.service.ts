import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { UserMapper } from '../mappers/user.mapper';
import { DEFAULT_USER } from '../models/default-user';
import { UserApiInterface } from '../models/user-api.interface';
import { UserFormInterface } from '../models/user-form.interface';

@Injectable({
  providedIn: 'root'
})
export class UserFormStateService {
  public initialFormState: BehaviorSubject<UserFormInterface> = new BehaviorSubject<UserFormInterface>(DEFAULT_USER);
  public isFormForEdit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private userMapper: UserMapper){}

  public getFormStatus(): Observable<boolean> {
    return this.isFormForEdit.asObservable();
  }

  public getFormState(): Observable<UserFormInterface>{
    return this.initialFormState.asObservable();
  }

  public setInitialFormState(initState: UserApiInterface): void {
    this.initialFormState.next(this.userMapper.mapToFormValue(initState))
  }

  public changeFormStatus(status: boolean): void {
    this.isFormForEdit.next(status);
  }
}