import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserApiInterface } from '../models/user-api.interface';
import { UserService } from './user.service';


describe('UserService', () => {
    let service: UserService;
    let httpController: HttpTestingController;
    let testedUser: UserApiInterface;
    let url = 'http://localhost:3000';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(UserService);
        httpController = TestBed.inject(HttpTestingController);
        testedUser = {
            id: '1',
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            address: {
                street: '',
                building: '',
                city: '',
                zipcode: '',
            },
            phone: '',
            website: '',
            company: {
                name: '',
                scope: '',
            },
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test return users from getAllUsers method', () => {
        let testedUsers: Array<UserApiInterface> = [];
        testedUsers.push(testedUser);
        service.getAllUsers().subscribe((res) => {
            expect(res).toEqual(testedUsers);
        });
        const req = httpController.expectOne({method: 'GET',url: `${url}/users`});
        req.flush(testedUsers);
    });

    it('should test return user from getUser method', () => {
        const id = '1';
        service.getUser(id).subscribe((user) => {
            expect(user).toEqual(testedUser);
        });
        const req = httpController.expectOne({ method: 'GET', url: `${url}/users/${id}` });
        req.flush(testedUser);
    })

    it('should test createUser method', () => {
        service.createUser(testedUser).subscribe((user) => {
            expect(user).toEqual(testedUser);
        });
        const req = httpController.expectOne({ method: 'POST', url: `${url}/users` })
        req.flush(testedUser);
    })

    it('should test updateUser method', () => {
        const id = '1';
        service.updateUser(id, testedUser).subscribe((user) => {
            expect(user).toEqual(testedUser);
        });

        const req = httpController.expectOne({method: 'PUT',url: `${url}/users/${id}`});
        req.flush(testedUser);
    })
})
