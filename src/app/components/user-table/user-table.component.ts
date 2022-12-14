
import { ChangeDetectorRef, Component,OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonRounded } from '@progress/kendo-angular-buttons';
import { CellClickEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { Observable, of, switchMap, takeUntil } from 'rxjs';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { DEFAULT_USER } from 'src/app/models/default-user';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserFormInterface } from 'src/app/models/user-form.interface';
import { UserTableInterface } from 'src/app/models/user-table.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    ` tr.bold{
      font-weight:700 !important;
    },
    .open-user-modal-btn{
      margin: 15px;
      background-color: #ff6358;
      color: white;
      font-size: 16px;
      border-radius: 4px;
  }
    `
  ]
})
export class UserTableComponent extends BaseComponent implements OnInit {
  public users: Array<UserTableInterface> = [];
  public usersFromApi: Array<UserApiInterface> = [];
  public user: UserApiInterface;
  public updatedUser: UserFormInterface;
  public updatedUsers: UserFormInterface[] = [];
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
      this.users = this.userMapper.mapToViewModel(users); 
      this.usersFromApi = users;
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

  public changeUser(): void {
    this.cd.detectChanges();
    this.getAllUsers();
  }
  
  public changedUser(user: UserFormInterface): void {
    console.log(user, 'updated or created user');
    this.updatedUser = user;
    this.updatedUsers.push(this.updatedUser);
  }
  
  public viewUpdatedUser(users: UserTableInterface[]): void {
    console.log(users, ' users after update');
    this.users = users;
  }

  public submit(): void {
   this.users.filter((user: UserTableInterface) => user.isEdited).forEach((user) => user.isEdited = false);
    console.log('submit works');
     this.defineRequest().pipe(takeUntil(this.destroy$)).subscribe((user) => {
        this.changeUser();
      })
    } 
  

  public defineRequest(): Observable<UserApiInterface> { 
    if(!this.updatedUser.id){
      console.log('создаем юзера')
      return this.userService.createUser(this.updatedUser)
    } 
    console.log(this.updatedUsers, ' from submit')
    if(this.updatedUsers.length === 1) {
      console.log('апдейтим 1 юзера')
        return this.userService.updateUser(this.updatedUser.id,this.userMapper.mapToCreateUpdateDto(this.updatedUser)) 
      } else {
        console.log('апдейтим много юзеров')
        this.updatedUsers.map((user: UserFormInterface) => {
          const id = user.id as string;
          return this.userService.updateUser(id,this.userMapper.mapToCreateUpdateDto(user)).subscribe(() => {
            this.getAllUsers()
          })
        
        })
      }
      return of(this.userMapper.mapToCreateUpdateDto(this.updatedUser))
  }

  public rowCallback = (context: RowClassArgs) => {
    if (context.dataItem.isEdited) {
      return { bold: true };
    } 
    return { bold: false }
  }
}

