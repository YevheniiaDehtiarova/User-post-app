import { PhonePipe } from "./phone.pipe";

describe('Phone Pipe', () => {
    const pipe = new PhonePipe();
  
    it('should tetst anf transform case 1 sucessfully', () => {
      expect(pipe.transform('+380956724902')).toBe('095-672-49-02');
    });

    it('should test and transform case 2 sucessfully', () => {
        expect(pipe.transform('+380661618617')).toBe('066-161-86-17');
      });

    it('should test if phone empty', () => {
      expect(pipe.transform('')).toBe('null')
    })

    it('should test return nothing', () => {
      expect(pipe.transform('null')).toBe('')
    })
  });