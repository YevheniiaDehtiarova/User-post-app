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
  public updatedUser: UserApiInterface;
  public createdUser: UserApiInterface;

  public users: Array<UserTableInterface> = [];
  public usersFromApi: Array<UserApiInterface> = [];
  public user: UserApiInterface;
  public rounded: ButtonRounded = 'medium';

  constructor(
    private userService: UserService,
    private userMapper: UserMapper,
    private modalService: UserModalService,
    private userFormStateService: UserFormStateService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.getAllUsers();
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

  public onEdit(dataItem: UserTableInterface): void {
    this.user = this.usersFromApi?.find(
      (user) => Number(user.id) === dataItem.id
    ) as UserApiInterface;

    this.modalService.modalOpen();
    this.userFormStateService.changeFormStatus(true);
    this.userFormStateService.setInitialFormState(this.user);
  }

  public openModal(): void {
    this.modalService.modalOpen();
  }

  public editModal(): void {
    this.modalService.modalOpen();
    this.userFormStateService.changeFormStatus(false);
    this.userFormStateService.setDefaultInitialFormState();
  }

  public doubleClick(): void {
    this.router.navigate(['/user-detail', this.user.id]);
  }

  public cellClickHandler(cellData: CellClickEvent) {
    this.user = cellData.dataItem;
  }

  public updateUser(event: UserApiInterface): void {
    this.updatedUser = event;
    this.cd.detectChanges();
    this.getAllUsers();
  }

  public createUser(event: UserApiInterface): void {
   this.createdUser = event;
   this.cd.detectChanges();
   this.getAllUsers();
  }

}
