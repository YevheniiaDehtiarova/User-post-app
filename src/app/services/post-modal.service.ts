import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostModalService {
  public isModalDialogVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAddingState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public getInitialAddingState(): Observable<boolean> {
    return this.isAddingState.asObservable();
  }

  public getModalStatus(): Observable<boolean> {
    return this.isModalDialogVisible.asObservable();
  }

  public modalClose(): void {
    this.isModalDialogVisible.next(false);
  }

  public modalOpen(): void {
    this.isModalDialogVisible.next(true);
  }
}