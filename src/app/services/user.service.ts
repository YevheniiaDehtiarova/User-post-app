import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserApiInterface } from '../models/user-api.interface';
import { userRoutes } from '../routes/user.routes';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  public getAllUsers(): Observable<Array<UserApiInterface>> {
    const apiUrl = userRoutes.getUsers;

    return this.http.get<Array<UserApiInterface>>(apiUrl);
  }

  public getUser(id: string): Observable<UserApiInterface> {
    const apiUrl = userRoutes.getUserById.replace('${id}', `${id}`);

    return this.http.get<UserApiInterface>(apiUrl);
  }

  public createUser(user: UserApiInterface): Observable<UserApiInterface> {
    const apiUrl = userRoutes.createUser;

    return this.http.post<UserApiInterface>(apiUrl, user);
  }

  public updateUser(
    id: string,
    user: UserApiInterface
  ): Observable<UserApiInterface> {
    const apiUrl = userRoutes.updateUser.replace('${id}', id);

    return this.http.put<UserApiInterface>(apiUrl, user);
  }
}
