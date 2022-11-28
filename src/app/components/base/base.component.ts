import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-base',
  template: '<h1>Life is good </h1>',
})
export class BaseComponent implements OnDestroy {

  constructor() { }
  
  public destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  } 
}
