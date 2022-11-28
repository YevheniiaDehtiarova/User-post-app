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
  @Input() isUserDetailFormEdit: boolean;
  @Output() creating = new EventEmitter<UserApiInterface>();
  @Output() updating = new EventEmitter<UserApiInterface>();
  @Output() updatingDetail = new EventEmitter<UserApiInterface>();
  public isFormForEdit: boolean;

  constructor(
    private userModalService: UserModalService,
    private userService: UserService,
    private userMapper: UserMapper,
    private userFormStateService: UserFormStateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getFormStatus();
  }

  public getFormStatus(): void {
  this.userFormStateService.getFormStatus()
  .pipe(takeUntil(this.destroy$))
  .subscribe((isFormForEdit: boolean) => {
        this.isFormForEdit = isFormForEdit;
      });
  }

  public closeModal(): void {
    this.userFormComponent?.userForm.reset();
    this.userModalService.modalClose();
  }

  public submit(): void {
    if (this.userFormComponent?.userForm?.valid) {
      this.defineRequest().pipe(takeUntil(this.destroy$)).subscribe((user) => {
        this.createOutputUser(user);
        this.changeUpdatedProperty(false);
      })
    } else {
      this.userFormComponent?.userForm.markAllAsTouched(); 
    }
  }

  public defineRequest(): Observable<UserApiInterface> {
    return (!this.isFormForEdit || !this.isUserDetailFormEdit) 
    ? this.userService.createUser(this.userMapper.mapToCreateUpdateDto(this.userFormComponent?.userForm?.value))
    : this.userService.updateUser(this.userFormComponent?.userForm?.value?.id, this.userFormComponent?.userForm?.value)         
  }

  public createOutputUser(user:UserApiInterface) {
    this.creating.emit(user);
    this.closeModal();
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
