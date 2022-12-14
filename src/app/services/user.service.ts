import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserMapper } from '../mappers/user.mapper';
import { UserApiInterface } from '../models/user-api.interface';
import { UserFormInterface } from '../models/user-form.interface';
import { userRoutes } from '../routes/user.routes';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient, ) {}
  public  userMapper = new UserMapper()

  public getAllUsers(): Observable<Array<UserApiInterface>> {
    const apiUrl = userRoutes.getUsers;

    return this.http.get<Array<UserApiInterface>>(apiUrl);
  }

  public getUser(id: string | null): Observable<UserApiInterface> {
    const apiUrl = userRoutes.getUserById.replace('${id}', `${id}`);

    return this.http.get<UserApiInterface>(apiUrl);
  }

  public createUser(user: UserFormInterface): Observable<UserApiInterface> {
    let updatedUser = this.userMapper.mapToCreateUpdateDto(user);

    const apiUrl = userRoutes.createUser;

    return this.http.post<UserApiInterface>(apiUrl, updatedUser);
  }

  public updateUser(
    id: string,
    user: UserApiInterface
  ): Observable<UserApiInterface> {
    const apiUrl = userRoutes.updateUser.replace('${id}', id);

    return this.http.put<UserApiInterface>(apiUrl, user);
  }
}
