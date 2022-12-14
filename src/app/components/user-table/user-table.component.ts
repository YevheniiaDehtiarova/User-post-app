import { ChangeDetectorRef, Component,OnInit,  ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonRounded } from '@progress/kendo-angular-buttons';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { Observable, takeUntil } from 'rxjs';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { DEFAULT_USER } from 'src/app/models/default-user';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserFormInterface } from 'src/app/models/user-form.interface';
import { UserTableInterface } from 'src/app/models/user-table.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from '../base/base.component';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent extends BaseComponent implements OnInit {
  public users: Array<UserTableInterface> = [];
  public usersFromApi: Array<UserApiInterface> = [];
  public user: UserApiInterface;
  public updatedUser: UserFormInterface;
  public rounded: ButtonRounded = 'medium';
  public isUserModalDialogVisible: boolean;
  public userMapper = new UserMapper();

  constructor(
    private userService: UserService,
    private userModalService: UserModalService,
    private userFormStateService: UserFormStateService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.getAllUsers();
    this.getModalStatus();
  }

  public getModalStatus(): void {
  this.userModalService.getModalStatus().pipe(takeUntil(this.destroy$)).subscribe((isModalDialogVisible) => {
      this.isUserModalDialogVisible = isModalDialogVisible;
    });
  }

  public getAllUsers(): void {
  this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe((users: Array<UserApiInterface>) => {
      this.users = this.userMapper.mapToViewModel(users); //не покрывается
      this.usersFromApi = users; // не покрывается
    });
  }

  public editUser(dataItem: UserTableInterface): void {
    this.user = this.usersFromApi?.find(
      (user) => user.id === dataItem.id
    ) as UserApiInterface;

    this.openModal();
    this.changeUserFormstate(true);
    //this.userFormStateService.setInitialFormState(this.user);
  }

  public openModal(): void {
    this.userModalService.modalOpen();
  }

  public changeUserFormstate(value: boolean): void {
    this.userFormStateService.changeFormStatus(value);
  }

  public addUser(): void {
    this.user = this.userMapper.mapToCreateUpdateDto(DEFAULT_USER);
    this.openModal();
    this.changeUserFormstate(false);
  }

  public doubleClick(): void {
      this.router.navigate(['/user-detail', this.user?.id]);
  }
  
  public cellClickHandler(cellData: CellClickEvent) {
    this.user = cellData.dataItem;
  }

  /*public changeUser(): void {
    this.cd.detectChanges();
    this.getAllUsers();
  }*/
  
  public changedUser(user: UserFormInterface): void {
    console.log(user, 'updated or created user');
    this.updatedUser = user;
  }
  public viewUpdatedUser(users: UserTableInterface[]): void {
    console.log(users, ' users after update');
    this.users = users;
  }

  public submit(): void {
    console.log('submit works');
     this.defineRequest().pipe(takeUntil(this.destroy$)).subscribe((user) => {
        console.log(user, ' user after subscribe');
        //this.changeUser(user.id);
        /*this.changeUpdatedProperty(false);*/
      })
    } 
  

  public defineRequest(): Observable<UserApiInterface> {
    return (!this.updatedUser.id)
    ? this.userService.createUser(this.updatedUser)
    : this.userService.updateUser(this.updatedUser.id,this.userMapper.mapToCreateUpdateDto(this.updatedUser))         
  }
  /*public changeUpdatedProperty(value: boolean): void {
    this.isFormForEdit = value;
    this.isUserDetailFormEdit = value;
  }*/

}
