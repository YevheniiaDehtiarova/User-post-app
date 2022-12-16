import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserFormInterface } from 'src/app/models/user-form.interface';
import { UserTableInterface } from 'src/app/models/user-table.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from '../base/base.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent extends BaseComponent implements OnInit {
  @ViewChild(UserFormComponent) public userFormComponent: UserFormComponent;
  @Input('user') user: UserApiInterface;
  @Input('users') usersFromTable: UserTableInterface[] = [];
  @Input() isUserDetailFormEdit: boolean;

  @Output() updatingUserDetail = new EventEmitter<UserFormInterface>();
  @Output() updatedUsersFromTable = new EventEmitter<UserTableInterface[]>();
  @Output() changingUser = new EventEmitter<UserFormInterface>();
  public isFormForEdit: boolean;

  constructor(
    private userModalService: UserModalService,
    public userService: UserService,
    public userMapper: UserMapper,
    private userFormStateService: UserFormStateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getFormStatus();
  }

  public getFormStatus(): void {
    this.userFormStateService
      .getFormStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormForEdit: boolean) => {
        this.isFormForEdit = isFormForEdit;
      });
  }

  public closeModal(): void {
    this.userFormComponent?.userForm.reset();
    this.userModalService.modalClose();
  }

  public applyUser(): void {
    if (this.userFormComponent?.userForm?.valid) {
      const mappedUser = this.userMapper.mapFromFormToTableValue(this.userFormComponent?.userForm?.value);
      if (!this.isFormForEdit && !this.isUserDetailFormEdit) {
        this.createUser(mappedUser);
      } else {
        this.updateUser(mappedUser);
      }
      this.changeUpdatedProperty(false);
      this.changingUser.emit(this.userFormComponent.userForm.value);
      this.closeModal();
    } 
    else {
      this.userFormComponent?.userForm.markAllAsTouched();
    }
  }

  public createUser(user: UserTableInterface): void {
    this.usersFromTable.push(user); 
    this.updatedUsersFromTable.emit(this.usersFromTable);
  }

  public updateUser(user: UserTableInterface): void {
        if (this.usersFromTable.length) {
          const findedTableElement = this.usersFromTable.find((user: UserTableInterface) => user.id === this.userFormComponent.userForm.value.id) as UserTableInterface;
          const index = this.usersFromTable.indexOf(findedTableElement);
          this.usersFromTable.splice(index, 1, user);
          this.updatedUsersFromTable.emit(this.usersFromTable);
        } else {
          this.updatingUserDetail.emit(this.userFormComponent?.userForm?.value);
        }
  }

  public changeUpdatedProperty(value: boolean): void {
    this.isFormForEdit = value;
    this.isUserDetailFormEdit = value;
  }
}
