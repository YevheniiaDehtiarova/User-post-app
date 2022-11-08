import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserFormInterface } from 'src/app/models/user-form.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent implements OnInit, OnDestroy {
  @ViewChild(UserFormComponent) public userFormComponent: UserFormComponent;
  @Input('user') user: UserApiInterface;
  @Input() isUserDetailFormEdit: boolean;
  @Output() creating = new EventEmitter<UserApiInterface>();
  @Output() updating = new EventEmitter<UserApiInterface>();
  @Output() updatingDetail = new EventEmitter<UserApiInterface>();
  public isFormForEdit: boolean;
  public userFormSubscription: Subscription;

  constructor(
    private userModalService: UserModalService,
    private userService: UserService,
    private userMapper: UserMapper,
    private userFormStateService: UserFormStateService
  ) { }

  ngOnDestroy(): void {
    if (this.userFormSubscription) {
      this.userFormSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getFormStatus();
  }

  public getFormStatus(): void {
    this.userFormSubscription = this.userFormStateService.getFormStatus().
      subscribe((isFormForEdit: boolean) => {
        this.isFormForEdit = isFormForEdit;
      });
  }

  public closeModal(): void {
    this.userFormComponent?.userForm.reset();
    this.userModalService.modalClose();
  }

  public submit(): void {
    if (this.userFormComponent?.userForm?.valid) {
      this.userService
        .createUser(
          this.userMapper.mapToCreateUpdateDto(
            this.userFormComponent?.userForm?.value
          )
        )
        .subscribe((user) => {
          this.createOutputUser(user);
        });
    } else {
      this.userFormComponent?.userForm.markAllAsTouched();
    }
  }

  public createOutputUser(user:UserApiInterface) {
    this.creating.emit(user);
    this.closeModal();
  }

  public updateSubmit(): void {
    this.userService.updateUser(this.userFormComponent?.userForm?.value?.id, this.userFormComponent?.userForm?.value)
      .subscribe((user) => {
        this.updateOutputUser(user);
        this.changeUpdatedProperty(false);
      });
  }

  public changeUpdatedProperty(value: boolean): void {
    this.isFormForEdit = value;
    this.isUserDetailFormEdit = value;
  }

  public updateOutputUser(user: UserApiInterface):void {
    this.updating.emit(user);
    this.updatingDetail.emit(user);
    this.closeModal();
  }
}
