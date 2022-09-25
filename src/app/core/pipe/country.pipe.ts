import { Pipe, PipeTransform } from '@angular/core';
import { County } from '../models/loopback.model';

@Pipe({
  name: 'countyCategoryId'
})
export class CountyPipe implements PipeTransform {
  transform(countyId: number, county: County[]): any {
    const categoryCounty = county.find(categoryCounty => categoryCounty.id === countyId);
    console.log(categoryCounty);
    return categoryCounty ? categoryCounty.name : "";
  };
}