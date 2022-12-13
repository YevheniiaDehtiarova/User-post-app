import { Inject, Injectable } from '@angular/core';
import { UserApiInterface } from '../models/user-api.interface';
import { UserFormInterface } from '../models/user-form.interface';
import { UserTableInterface } from '../models/user-table.interface';

@Injectable({providedIn: 'root'})
export class UserMapper {
  public mapToViewModel(
    users: Array<UserApiInterface>
  ): Array<UserTableInterface> {
    return users.map((user: UserApiInterface) => {
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        address: `${user.address.city} ${user.address.street} ${user.address.building}`,
        phone: user.phone,
      };
    });
  }
 
  public mapToCreateUpdateDto(user: UserFormInterface): UserApiInterface {
    return {
      id: user?.id as string,
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user?.userName,
      email: user?.email,
      address: {
        street: user?.street,
        building: user?.building,
        city: user?.city,
        zipcode: user?.zipcode,
      },
      phone: user?.phone,
      website: user?.website,
      company: {
        name: user?.companyName,
        scope: user?.companyScope,
      },
    };
  }

  public mapToFormValue(user: UserApiInterface): UserFormInterface {
    return { 
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.username,
      email: user.email,
      street: user.address?.street,
      building: user.address?.building,
      city: user.address?.city,
      zipcode: user.address?.zipcode,
      phone: user.phone,
      website: user.website,
      companyName: user.company?.name,
      companyScope: user.company?.scope,
    };
  }

  public mapFromFormToTableValue(userForm: UserFormInterface): UserTableInterface{
    return {
      id: userForm.id ? userForm.id : 'null',
      name: `${userForm.firstName} ${userForm.lastName}`,
      email: userForm.email,
      address:  `${userForm.zipcode} ${userForm.city} ${userForm.street} ${userForm.building}`,
      phone: userForm.phone,
    }
  }

  public mapFormTableToformValue(user: UserTableInterface): UserFormInterface{ // подумать завтра
    console.log(user);
    return {
      id: user.id ? user.id: 'null',
      firstName: user.name,
      lastName: user.name,
      userName: user.name,
      email: user.email,
      street: user.address,
      building: user.address,
      city: user.address,
      zipcode: user.address,
      phone: user.phone,
      website: user.phone,
      companyName: user.name,
      companyScope: user.name,
    }
  }
}
