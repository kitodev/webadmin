import { Pipe, PipeTransform } from '@angular/core';
import { FieldsOfStudyCategory } from '../models/loopback.model';

@Pipe({
  name: 'categoryById'
})
export class FieldsOfCategoryByIdPipe implements PipeTransform {
  transform(categoryId: number, categories: FieldsOfStudyCategory[]): any {
    const category = categories.find(category => category.id === categoryId);
    return category ? category.name : "";
  };
}