import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchFilter'})
export class FilterPipe implements PipeTransform {

    transform(list: any[], filterText: string): any {
        if(!list || !filterText) {
            return list;
        }

        filterText = filterText.toLowerCase();
        console.log(filterText);
        // return list.filter(item => {
        //     const jsonitem = JSON.stringify(item).toLowerCase();
        //     return jsonitem.includes(filterText);
        // })

        return list ? list.filter(item => item.name.search(new RegExp(filterText, 'i')) > -1) : [];
    }
}