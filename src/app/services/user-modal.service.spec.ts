import { TestBed } from '@angular/core/testing';
import { UserModalService } from './user-modal.service';


describe('UserModalService', () => {
    let service: UserModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UserModalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test return observable boolean from getModalStatus method', () => {
        const state: boolean = false;
        service.getModalStatus().subscribe((value) => {
            expect(value).toBe(state)
        })
    })

    it('should test return observable boolean from getAddingState method', () => {
        const state: boolean = false;
        service.getAddingState().subscribe((value) => {
            expect(value).toBe(state)
        })
    })

    it('should test modalStatus for open method', () => {
        service.modalOpen()
        service.isModalDialog.subscribe(state => {
            expect(state).toBe(true);
        })
        service.isAddingState.subscribe(state => {
            expect(state).toBe(false);
        })
    })

    it('should test modalStatus for close method', () => {
        service.modalClose();
        service.isModalDialog.subscribe(state => {
            expect(state).toBe(false);
        })
    })
})
