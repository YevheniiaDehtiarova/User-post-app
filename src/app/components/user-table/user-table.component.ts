import { ChangeDetectorRef, Component,EventEmitter,Input,OnChanges,OnDestroy,OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonRounded } from '@progress/kendo-angular-buttons';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { Subscription, takeUntil } from 'rxjs';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { DEFAULT_USER } from 'src/app/models/default-user';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserTableInterface } from 'src/app/models/user-table.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent extends BaseComponent implements OnInit {
  public users: Array<UserTableInterface> = [];
  public usersFromApi: Array<UserApiInterface> = [];
  public user: UserApiInterface;
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
    console.log(users, 'users form api')
      this.users = this.userMapper.mapToViewModel(users);
      this.usersFromApi = users;
    });
  }

  public editUser(dataItem: UserTableInterface): void {
    this.user = this.usersFromApi?.find(
      (user) => Number(user.id) === dataItem.id
    ) as UserApiInterface;

    this.openModal();
    this.changeUserFormstate(true);
     this.userFormStateService.setInitialFormState(this.user);
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

}
