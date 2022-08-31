import {
  Component,
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

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: UserApiInterface;

  public isUserModalDialogVisible: boolean;
  public users: Array<UserTableInterface>;
  public userForm: FormGroup;
  public isFirstChanges = true;
  public isFormForEdit: boolean;

  constructor(
    private userModalService: UserModalService,
    private userMapper: UserMapper,
    private userFormStateService: UserFormStateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFirstChanges) {
      this.isFirstChanges = false;
      return;
    } else {
      this.userForm.setValue(this.userMapper.mapToFormValue(this.user));
    }
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      id: new FormControl(this.user?.id ?? ''),
      firstName: new FormControl(this.user?.firstName ??'', [Validators.required]),
      lastName: new FormControl(this.user?.lastName ??'', [Validators.required]),
      userName: new FormControl(this.user?.username ??'', [Validators.required]),
      email: new FormControl(this.user?.email ??'', [Validators.required, Validators.email]),
      street: new FormControl(this.user?.address.street ??'', Validators.required),
      building: new FormControl(this.user?.address.building ??'', Validators.required),
      city: new FormControl(this.user?.address.city ??'', Validators.required),
      zipcode: new FormControl(this.user?.address.zipcode ??'', Validators.required),
      phone: new FormControl(this.user?.phone ??'', Validators.required),
      website: new FormControl(this.user?.website ??'', Validators.required),
      companyName: new FormControl(this.user?.company.name ??'', Validators.required),
      companyScope: new FormControl(this.user?.company.scope ??'', Validators.required),
    });
    this.getModalStatus();
    this.getFormStatus();
  }


  private getModalStatus(): void {
    this.userModalService.getModalStatus().subscribe((isModalDialogVisible) => {
      this.isUserModalDialogVisible = isModalDialogVisible;
    });
  }
  private getFormStatus(): void {
    this.userFormStateService
      .getFormStatus()
      .subscribe((isFormForEdit: boolean) => {
        this.isFormForEdit = isFormForEdit;
      });
  }


  public openModal(): void {
    this.isUserModalDialogVisible = true;
    this.userModalService.modalOpen()
  }

  // public closeModal(): void {
  //   this.userForm.reset();
  //   this.userModalService.modalClose();
  // }

  public clickAddUser(): void {
    this.userForm.reset();
    this.userFormStateService.changeFormStatus(false);
    this.userFormStateService.setDefaultInitialFormState();
  }
}
