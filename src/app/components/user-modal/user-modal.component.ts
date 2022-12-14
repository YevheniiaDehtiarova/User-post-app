import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription, takeUntil } from 'rxjs';
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

  @Output() updatingUserDetail = new EventEmitter<string>();
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
    console.log(this.usersFromTable, ' usersFromTable from table');
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
    console.log(this.userFormComponent?.userForm?.valid, ' valid of form');
    if (this.userFormComponent?.userForm?.valid) {
      if (!this.isFormForEdit && !this.isUserDetailFormEdit) {
        //apply new user
        const mappedUser = this.userMapper.mapFromFormToTableValue(
          this.userFormComponent?.userForm?.value
        );
        this.usersFromTable.push(mappedUser);
        this.updatedUsersFromTable.emit(this.usersFromTable);
        this.changingUser.emit(this.userFormComponent?.userForm?.value);
        console.log(
          mappedUser,
          this.usersFromTable,
          'что передаем наверх при создании'
        );
      } else {
        //update exist user
        const editedTableElement = this.userMapper.mapFromFormToTableValue(
          this.userFormComponent?.userForm?.value
        );
        console.log(editedTableElement, ' элемент что редачим');
        if (this.usersFromTable.length) {
          console.log('редактируем из таблицы');
          const findedTableElement = this.usersFromTable.find((user: UserTableInterface) =>user.id === this.userFormComponent.userForm.value.id) as UserTableInterface;
          const index = this.usersFromTable.indexOf(findedTableElement);
          this.usersFromTable.splice(index, 1, editedTableElement);
          this.updatedUsersFromTable.emit(this.usersFromTable);
          this.changingUser.emit(this.userFormComponent.userForm.value)
        } else {
          console.log('редактируем из деталей');
          this.updatingUserDetail.emit(this.userFormComponent.userForm.value.id);
          this.changingUser.emit(this.userFormComponent.userForm.value);
        }
      }
      this.changeUpdatedProperty(false);
      this.closeModal();
    } else {
      this.userFormComponent?.userForm.markAllAsTouched();
    }
  }


  public changeUpdatedProperty(value: boolean): void {
    this.isFormForEdit = value;
    this.isUserDetailFormEdit = value;
  }
}
