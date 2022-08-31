import { ChangeDetectorRef, Component,EventEmitter,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonRounded } from '@progress/kendo-angular-buttons';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserTableInterface } from 'src/app/models/user-table.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent implements OnInit, OnChanges {
  public users: Array<UserTableInterface> = [];
  public usersFromApi: Array<UserApiInterface> = [];
  public user: UserApiInterface;
  public rounded: ButtonRounded = 'medium';
  public isUserModalDialogVisible: boolean = false;

  constructor(
    private userService: UserService,
    private userMapper: UserMapper,
    private userModalService: UserModalService,
    private userFormStateService: UserFormStateService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.getAllUsers();
    this.getModalStatus();
  }

  private getModalStatus(): void {
    this.userModalService.getModalStatus().subscribe((isModalDialogVisible) => {
      this.isUserModalDialogVisible = isModalDialogVisible;
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.cd.detectChanges();
    this.getAllUsers();
  }

  public getAllUsers(): void {
    this.userService.getUsers().subscribe((users: Array<UserApiInterface>) => {
      this.users = this.userMapper.mapToViewModel(users);
      this.usersFromApi = users;
    });
  }

  public editUser(dataItem: UserTableInterface): void {
    this.user = this.usersFromApi?.find(
      (user) => Number(user.id) === dataItem.id
    ) as UserApiInterface;

    this.openModal();
    this.isUserModalDialogVisible = true;
    this.userFormStateService.changeFormStatus(true);
    this.userFormStateService.setInitialFormState(this.user);
  }

  public openModal(): void {
    this.userModalService.modalOpen();
  }

  public addUser(): void {
    console.log(this.isUserModalDialogVisible);
    this.openModal();
    this.isUserModalDialogVisible = true;
    this.userFormStateService.changeFormStatus(false);
    this.userFormStateService.setDefaultInitialFormState();
    this.isUserModalDialogVisible = true;
    console.log(this.isUserModalDialogVisible);
  }

  public doubleClick(): void {
    console.log(this.user)
    this.router.navigate(['/user-detail', this.user.id]);
  }
  
  public cellClickHandler(cellData: CellClickEvent) {
    this.user = cellData.dataItem;
  }

  public updateUser(event: UserApiInterface): void {
    this.cd.detectChanges();
    this.getAllUsers();
  }

  public createUser(event: UserApiInterface): void {
   console.log(event);
   this.cd.detectChanges();
   this.getAllUsers();
  }
}
