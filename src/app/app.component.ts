import { Component } from '@angular/core';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserApiInterface } from './models/user-api.interface';
import { UserTableInterface } from './models/user-table.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'user-app';

  public user: UserApiInterface;
  public updatedUser: UserApiInterface;
  public createdUser: UserApiInterface;


  public updateRow(eventData: UserApiInterface): void {
    this.user = eventData;
  }

  public updateUser(event: UserApiInterface): void {
    this.updatedUser = event;
  }

  public createUser(event: UserApiInterface): void {
   this.createdUser = event;
  }
}
