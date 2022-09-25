import { Pipe, PipeTransform } from '@angular/core';
import { TagCategory } from '../models/loopback.model';

@Pipe({
  name: 'categoryById'
})
export class CategoryByIdPipe implements PipeTransform {
  transform(categoryId: number, categories: TagCategory[]): any {
    const category = categories.find(category => category.id === categoryId);
    console.log(category);
    return category ? category.name : "";
  };
}