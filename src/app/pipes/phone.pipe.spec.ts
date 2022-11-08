import { PhonePipe } from "./phone.pipe";

describe('Phone Pipe', () => {
    const pipe = new PhonePipe();
  
    it('Transform case 1 sucessfully', () => {
      expect(pipe.transform('+380956724902')).toBe('095-672-49-02');
    });

    it('Transform case 2 sucessfully', () => {
        expect(pipe.transform('+380661618617')).toBe('066-161-86-17');
      });
  });