import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  @ViewChild(UserFormComponent) public userFormComponent: UserFormComponent;
  @Input() user: UserApiInterface;
  @Input() isUserDetailFormEdit: boolean;
  @Output() creating = new EventEmitter<UserApiInterface>();
  @Output() updating = new EventEmitter<UserApiInterface>();
  @Output() updatingDetail = new EventEmitter<UserApiInterface>();
  public isFormForEdit: boolean;

  constructor(private userModalService: UserModalService,
              private userService: UserService,
              private userMapper: UserMapper,
              private userFormStateService: UserFormStateService) { }

  ngOnInit(): void {
    this.getFormStatus();
    console.log(this.isFormForEdit);
    console.log(this.isUserDetailFormEdit)
  }

  private getFormStatus(): void {
    this.userFormStateService
      .getFormStatus()
      .subscribe((isFormForEdit: boolean) => {
        this.isFormForEdit = isFormForEdit;
      });
  }

  public closeModal(): void {
    this.userFormComponent.userForm.reset();
    this.userModalService.modalClose();
  }

  public submit(): void {
    if (this.userFormComponent.userForm.valid) {
      if (!this.isFormForEdit) {
        this.userService.createUser(this.userMapper.mapToCreateUpdateDto(this.userFormComponent.userForm.value))
          .subscribe((user) => {
            this.creating.emit(user);
            this.closeModal();
          });
      }
    } else {
      this.userFormComponent.userForm.markAllAsTouched();
    }
  }

  public updateSubmit(): void {
    if (this.isFormForEdit || this.isUserDetailFormEdit) {
      this.userService.updateUser(this.userFormComponent.userForm.value.id,
        this.userMapper.mapToCreateUpdateDto(this.userFormComponent.userForm.value))
        .subscribe((user) => {
          this.updating.emit(user);
          this.updatingDetail.emit(user);
          this.isFormForEdit = false;
          this.closeModal();
        });
    }
  }

  public clickAddUser(): void {
    this.userFormComponent.userForm.reset();
    this.userFormStateService.changeFormStatus(false);
    this.userFormStateService.setDefaultInitialFormState();
  }
}
