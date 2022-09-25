import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'userpath'
})
export class UserpathPipe implements PipeTransform {

  transform(value: any, uid: number | string, ...args: any[]): string | null {
    const uidStr = uid.toString();
    if (isNaN(parseInt(uidStr, 10))) {
      const userPath = uidStr;
      const path = `user/${userPath}/`;
      return environment.loopbackUrl + path + value;
      return null;
    } else {
      const userPath = uidStr.substring(uidStr.length - 3) + '/' + uidStr;
      const path = `user/${userPath}/`;
      return environment.loopbackUrl + path + value;
    }
  }

}
