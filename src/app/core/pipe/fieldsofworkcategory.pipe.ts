import { Pipe, PipeTransform } from '@angular/core';
import { FieldsOfWorkCategory, TagCategory } from '../models/loopback.model';

@Pipe({
  name: 'categoryById'
})
export class FieldsOfCategoryByIdPipe implements PipeTransform {
  transform(categoryId: number, categories: FieldsOfWorkCategory[]): any {
    const category = categories.find(category => category.id === categoryId);
    //console.log(category);
    return category ? category.name : "";
  };
}