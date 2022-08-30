import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserModalService {
  public isModalDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAddingState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  public getModalStatus(): Observable<boolean> {
    return this.isModalDialog.asObservable();
  }

  public modalOpen(): void {
    this.isModalDialog.next(true);
    this.isAddingState.next(false);
  }

  public modalClose(): void {
    this.isModalDialog.next(false);
  }
}