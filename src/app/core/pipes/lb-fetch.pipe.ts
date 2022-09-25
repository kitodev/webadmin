import { Pipe, PipeTransform } from '@angular/core';
import { LoopbackService } from '../services/loopback.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Pipe({
    name: 'lbFetch'
})
export class LbFetchPipe implements PipeTransform {
    constructor(
        private loopbackService: LoopbackService,
    ) { }

    transform(value: any, ...args: any[]): any {
        if (!value) {
            return of('');
        }
        return this.loopbackService.getValue(args[0], value, args[1]).pipe(
            map((el: any) => {
                return el;
            })
        );
    }

}
