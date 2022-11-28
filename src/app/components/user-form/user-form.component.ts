import {Component,Input,OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserApiInterface } from 'src/app/models/user-api.interface';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  @Input('user') user: UserApiInterface;
  public userForm: FormGroup;

  ngOnInit(): void {
    console.log('init form');
    this.userForm = new FormGroup({
      id: new FormControl(this.user?.id ?? ''),
      firstName: new FormControl(this.user?.firstName ?? '', [Validators.required,]),
      lastName: new FormControl(this.user?.lastName ?? '', [Validators.required,]),
      userName: new FormControl(this.user?.username ?? '', [Validators.required,]),
      email: new FormControl(this.user?.email ?? '', [Validators.required, Validators.email,]),
      street: new FormControl(this.user?.address.street ?? '', Validators.required),
      building: new FormControl(this.user?.address.building ?? '', Validators.required),
      city: new FormControl(this.user?.address.city ?? '', Validators.required),
      zipcode: new FormControl(this.user?.address.zipcode ?? '', Validators.required),
      phone: new FormControl(this.user?.phone ?? '', Validators.required),
      website: new FormControl(this.user?.website ?? '', Validators.required),
      companyName: new FormControl( this.user?.company.name ?? '', Validators.required),
      companyScope: new FormControl(this.user?.company.scope ?? '', Validators.required),
    });
    console.log(this.userForm, 'user form from form');
  }
}
