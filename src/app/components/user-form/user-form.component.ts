import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserMapper } from 'src/app/mappers/user.mapper';
import { UserApiInterface } from 'src/app/models/user-api.interface';
import { UserTableInterface } from 'src/app/models/user-table.interface';
import { UserFormStateService } from 'src/app/services/user-form-state.service';
import { UserModalService } from 'src/app/services/user-modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: UserApiInterface;
  @Input() isFormForEditDetails: boolean;
  @Output() update: EventEmitter<UserApiInterface> = new EventEmitter<UserApiInterface>();
  @Output() create: EventEmitter<UserApiInterface> = new EventEmitter<UserApiInterface>();

  public isModalDialogVisible: boolean;
  public users: Array<UserTableInterface>;
  public userForm: FormGroup;
  public updatedUser: UserApiInterface;
  public createdUser: UserApiInterface;
  public isFirstChanges = true;
  public isFormForEdit: boolean;

  constructor(
    private userService: UserService,
    private userModalService: UserModalService,
    private userMapper: UserMapper,
    private userFormStateService: UserFormStateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFormForEditDetails) {
      this.isFormForEdit = true;
    }

    if (this.isFirstChanges) {
      this.isFirstChanges = false;
      return;
    } else {
      this.userForm.setValue(this.userMapper.mapToFormValue(this.user));
    }
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      street: new FormControl('', Validators.required),
      building: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zipcode: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      website: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      companyScope: new FormControl('', Validators.required),
    });
    this.getModalStatus();
    this.getFormStatus();
  }


  private getModalStatus(): void {
    this.userModalService.getModalStatus().subscribe((isModalDialogVisible) => {
      this.isModalDialogVisible = isModalDialogVisible;
    });
  }
  private getFormStatus(): void {
    this.userFormStateService
      .getFormStatus()
      .subscribe((isFormForEdit: boolean) => {
        this.isFormForEdit = isFormForEdit;
      });
  }

  public submit(): void {
    if (this.userForm.valid) {
      if (!this.isFormForEdit) {
        this.userService.createUser(this.userMapper.mapToCreateUpdateDto(this.userForm.value))
          .subscribe((user) => {
            this.createdUser = user;
            this.create.emit(this.createdUser);
          });
      }
      this.clickAddUser();
      this.userModalService.modalClose();
      this.userForm.reset();
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  public updateSubmit(): void {
    if (this.isFormForEdit) {
      this.userService.updateUser(this.userForm.value.id,this.userMapper.mapToCreateUpdateDto(this.userForm.value))
        .subscribe((user) => {
          this.updatedUser = user;
          this.update.emit(this.updatedUser);
        });
    }
    this.userModalService.modalClose();
  }

  public openModal(): void {
    this.isModalDialogVisible = true;
    this.userModalService.modalOpen()
  }

  public closeModal(): void {
    this.userForm.reset();
    this.userModalService.modalClose();
  }

  public clickAddUser(): void {
    this.userForm.reset();
    this.userFormStateService.changeFormStatus(false);
    this.userFormStateService.setDefaultInitialFormState();
  }
}
