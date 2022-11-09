import { TestBed } from '@angular/core/testing';
import { PostModalService } from './post-modal.service';


describe('PostModalService', () => {
    let service: PostModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PostModalService);
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

    it('should return observable boolean from getInitialAddingState', () => {
        const state: boolean = false;
        service.getInitialAddingState().subscribe((value) => {
            expect(value).toBe(state)
        })
    })

    it('should check modalStatus for close', () => {
        service.modalClose();
        service.isModalDialogVisible.subscribe(state => {
            expect(state).toBe(false);
        })
    })

    it('should check modalStatus for open', () => {
        service.modalOpen()
        service.isModalDialogVisible.subscribe(state => {
            expect(state).toBe(true);
        })
    })
})
