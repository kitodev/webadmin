import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DictionaryComponent } from './dictionary.component';
import { DictionaryListComponent } from './dictionary-list/dictionary-list.component';

import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from '../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { DictionarydRoutingModule } from './dictionary-routing.module';
import { CategoryByIdPipe } from 'src/app/core/pipe/tagcategorybyid.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponentModule } from 'src/app/shared/form/form-component.module';
import { CheckboxComponent } from 'src/app/shared/form/checkbox/checkbox.component';
import { SelectComponent } from 'src/app/shared/form/select/select.component';
import { FieldsOfWorkComponent } from './fields-of-work/fields-of-work.component';
import { FieldsOfWorkCategoryComponent } from './fields-of-work-category/fields-of-work-category.component';
import { FieldsOfWorkListComponent } from './fields-of-work/fields-of-work-list/fields-of-work-list.component';
import { FieldsOfWorkCategoryListComponent } from './fields-of-work-category/fields-of-work-category-list/fields-of-work-category-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QualificationListComponent } from './qualification/qualification-list/qualification-list.component';
import { FieldsOfStudyCategoryComponent } from './fields-of-study-category/fields-of-study-category.component';
import { FieldsOfStudyComponent } from './fields-of-study/fields-of-study.component';
import { WorkTypeMdComponent } from './work-type-md/work-type-md.component';
import { ComputerSkillCategoryComponent } from './computer-skill-category/computer-skill-category.component';
import { ComputerSkillComponent } from './computer-skill/computer-skill.component';
import { ReferersComponent } from './referers/referers.component';
import { CountryComponent } from './country/country.component';
import { CityComponent } from './city/city.component';
import { LanguageComponent } from './language/language.component';
import { DrivingLicenceComponent } from './driving-licence/driving-licence.component';
import { SpareTimeComponent } from './spare-time/spare-time.component';
import { QualificationComponent } from './qualification/qualification.component';
import { CityListComponent } from './city/city-list/city-list.component';
import { CountyPipe } from 'src/app/core/pipe/country.pipe';
import { SpareTimeListComponent } from './spare-time/spare-time-list/spare-time-list.component';
import { ReferersListComponent } from './referers/referers-list/referers-list.component';
import { LanguageListComponent } from './language/language-list/language-list.component';
import { CountryListComponent } from './country/country-list/country-list.component';
import { DrivingLicenceListComponent } from './driving-licence/driving-licence-list/driving-licence-list.component';
import { FieldsOfStudyListComponent } from './fields-of-study/fields-of-study-list/fields-of-study-list.component';
import { WorkTypeMdListComponent } from './work-type-md/work-type-md-list/work-type-md-list.component';
import { ComputerSkillListComponent } from './computer-skill/computer-skill-list/computer-skill-list.component';
import { ComputerSkillCategoryListComponent } from './computer-skill-category/computer-skill-category-list/computer-skill-category-list.component';
import { FieldsOfStudyCategoryListComponent } from './fields-of-study-category/fields-of-study-category-list/fields-of-study-category-list.component';
import { FieldsOfCategoryByIdPipe } from 'src/app/core/pipe/fieldsofworkcategory.pipe';
import { SharedModule } from 'src/app/shared';

import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    DictionaryComponent,
    DictionaryListComponent,
    CategoryByIdPipe,
    //CountyPipe,
    FieldsOfCategoryByIdPipe,
    FieldsOfCategoryByIdPipe,
    FieldsOfWorkComponent,
    FieldsOfWorkCategoryComponent,
    FieldsOfWorkListComponent,
    FieldsOfWorkCategoryListComponent,
    QualificationListComponent,
    QualificationComponent,
    CityListComponent,
    CityComponent,
    FieldsOfStudyCategoryComponent,
    FieldsOfStudyComponent,
    WorkTypeMdComponent,
    ComputerSkillCategoryComponent,
    ComputerSkillComponent,
    ReferersComponent,
    CountryComponent,
    CityComponent,
    LanguageComponent,
    DrivingLicenceComponent,
    SpareTimeComponent,
    CityListComponent,
    SpareTimeListComponent,
    ReferersListComponent,
    LanguageListComponent,
    CountryListComponent,
    DrivingLicenceListComponent,
    FieldsOfStudyListComponent,
    WorkTypeMdListComponent,
    ComputerSkillComponent,
    ComputerSkillCategoryListComponent,
    ComputerSkillListComponent,
    FieldsOfStudyCategoryListComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    DictionarydRoutingModule,
    InlineSVGModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    DropdownMenusModule,
    FormComponentModule
  ]
})
export class DictionaryModule { }
