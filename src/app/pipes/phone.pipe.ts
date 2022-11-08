import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phone' })
@Injectable({
  providedIn: 'platform',
})
export class PhonePipe implements PipeTransform {
  public transform(phone: string): string {
    if (!phone) {
      return 'null';
    }

    const chunk = phone.match(/^\+380\d{3}\d{2}\d{2}\d{2}$/);

    if (chunk) {
      console.log(chunk);
      const strArr = chunk[0].toString().split('').slice(3, 13);
      strArr.splice(3, 0, '-');
      strArr.splice(7, 0, '-');
      strArr.splice(10, 0, '-');
      const newStr = strArr.join('');
      return newStr;
    }

    return '';
  }
}
