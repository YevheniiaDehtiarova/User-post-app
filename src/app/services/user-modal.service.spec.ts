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

    it('should return observable boolean from getModalStatus', () => {
        const state: boolean = false;
        service.getModalStatus().subscribe((value) => {
            expect(value).toBe(state)
        })
    })

    it('should return observable boolean from getAddingState', () => {
        const state: boolean = false;
        service.getAddingState().subscribe((value) => {
            expect(value).toBe(state)
        })
    })

    it('should check modalStatus for open', () => {
        service.modalOpen()
        service.isModalDialog.subscribe(state => {
            expect(state).toBe(true);
        })
        service.isAddingState.subscribe(state => {
            expect(state).toBe(false);
        })
    })

    it('should check modalStatus for close', () => {
        service.modalClose();
        service.isModalDialog.subscribe(state => {
            expect(state).toBe(false);
        })
    })
})
