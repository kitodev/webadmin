import { Pipe, PipeTransform } from '@angular/core';
import { City } from '../models/loopback.model';

@Pipe({
  name: 'cityCategoryId'
})
export class CityPipe implements PipeTransform {
  transform(countyId: number, county: City[]): any {
    const categoryCounty = county.find(categoryCounty => categoryCounty.id === countyId);
    console.log(categoryCounty);
    return categoryCounty ? categoryCounty.name : "";
  };
}