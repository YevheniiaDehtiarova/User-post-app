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

    it('should test return observable boolean from getModalStatus method', () => {
        const state: boolean = false;
        service.getModalStatus().subscribe((value) => {
            expect(value).toBe(state)
        })
    })

    it('should test return observable boolean from getInitialAddingState', () => {
        const state: boolean = false;
        service.getInitialAddingState().subscribe((value) => {
            expect(value).toBe(state)
        })
    })

    it('should test modalStatus for close method', () => {
        service.modalClose();
        service.isModalDialogVisible.subscribe(state => {
            expect(state).toBe(false);
        })
    })

    it('should test modalStatus for open method', () => {
        service.modalOpen()
        service.isModalDialogVisible.subscribe(state => {
            expect(state).toBe(true);
        })
    })
})
