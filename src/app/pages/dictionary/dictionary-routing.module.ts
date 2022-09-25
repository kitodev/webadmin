import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DictionaryComponent } from './dictionary.component';
import { DictionaryListComponent } from './dictionary-list/dictionary-list.component';
import { FieldsOfWorkComponent } from './fields-of-work/fields-of-work.component';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { FieldsOfWorkCategoryComponent } from './fields-of-work-category/fields-of-work-category.component';
import { FieldsOfWorkListComponent } from './fields-of-work/fields-of-work-list/fields-of-work-list.component';
import { FieldsOfWorkCategoryListComponent } from './fields-of-work-category/fields-of-work-category-list/fields-of-work-category-list.component';
import { QualificationListComponent } from './qualification/qualification-list/qualification-list.component';
import { QualificationComponent } from './qualification/qualification.component';
import { CityListComponent } from './city/city-list/city-list.component';
import { CityComponent } from './city/city.component';
import { SpareTimeListComponent } from './spare-time/spare-time-list/spare-time-list.component';
import { SpareTimeComponent } from './spare-time/spare-time.component';
import { ReferersListComponent } from './referers/referers-list/referers-list.component';
import { ReferersComponent } from './referers/referers.component';
import { LanguageListComponent } from './language/language-list/language-list.component';
import { LanguageComponent } from './language/language.component';
import { FieldsOfStudyComponent } from './fields-of-study/fields-of-study.component';
import { FieldsOfStudyListComponent } from './fields-of-study/fields-of-study-list/fields-of-study-list.component';
import { CountryListComponent } from './country/country-list/country-list.component';
import { CountryComponent } from './country/country.component';
import { DrivingLicenceListComponent } from './driving-licence/driving-licence-list/driving-licence-list.component';
import { DrivingLicenceComponent } from './driving-licence/driving-licence.component';
import { WorkTypeMdListComponent } from './work-type-md/work-type-md-list/work-type-md-list.component';
import { WorkTypeMdComponent } from './work-type-md/work-type-md.component';
import { ComputerSkillListComponent } from './computer-skill/computer-skill-list/computer-skill-list.component';
import { ComputerSkillComponent } from './computer-skill/computer-skill.component';
import { ComputerSkillCategoryListComponent } from './computer-skill-category/computer-skill-category-list/computer-skill-category-list.component';
import { ComputerSkillCategoryComponent } from './computer-skill-category/computer-skill-category.component';
import { FieldsOfStudyCategoryComponent } from './fields-of-study-category/fields-of-study-category.component';
import { FieldsOfStudyCategoryListComponent } from './fields-of-study-category/fields-of-study-category-list/fields-of-study-category-list.component';

const routes: Routes = [
      {
        path: 'list',
        component: DictionaryListComponent,
      },
      {
        path: 'dictionary/new',
        component: DictionaryComponent,
      },
      {
        path: 'detail/:id',
        component: DictionaryComponent,
      },
      {
        path: 'fields-of-works/list',
        component: FieldsOfWorkListComponent,
      },
      {
        path: 'fields-of-works/detail/:id',
        component: FieldsOfWorkComponent,
      },
      {
        path: 'fields-of-works/new',
        component: FieldsOfWorkComponent,
      },
      {
        path: 'fields-of-study/list',
        component: FieldsOfStudyListComponent,
      },
      {
        path: 'fields-of-study/detail/:id',
        component: FieldsOfStudyComponent,
      },
      {
        path: 'fields-of-study/new',
        component: FieldsOfStudyComponent,
      },
      {
        path: 'fields-of-study-category/list',
        component: FieldsOfStudyCategoryListComponent,
      },
      {
        path: 'fields-of-study-category/detail/:id',
        component: FieldsOfStudyCategoryComponent,
      },
      {
        path: 'fields-of-study-category/new',
        component: FieldsOfStudyCategoryComponent,
      },
      {
        path: 'fields-of-work-category/list',
        component: FieldsOfWorkCategoryListComponent,
      },
      {
        path: 'fields-of-work-category/detail/:id',
        component: FieldsOfWorkCategoryComponent,
      },
      {
        path: 'fields-of-work-category/new',
        component: FieldsOfWorkCategoryComponent,
      },
      {
        path: 'qualifications/list',
        component: QualificationListComponent,
      },
      {
        path: 'qualifications/new',
        component: QualificationComponent,
      },
      {
        path: 'qualifications/detail/:id',
        component: QualificationComponent,
      },
      {
        path: 'city/list',
        component: CityListComponent,
      },
      {
        path: 'city/new',
        component: CityComponent,
      },
      {
        path: 'city/detail/:id',
        component: CityComponent,
      },
      {
        path: 'spare-times/list',
        component: SpareTimeListComponent,
      },
      {
        path: 'spare-timess/new',
        component: SpareTimeComponent,
      },
      {
        path: 'spare-times/detail/:id',
        component: SpareTimeComponent,
      },
      {
        path: 'referers/list',
        component: ReferersListComponent,
      },
      {
        path: 'referers/new',
        component: ReferersComponent,
      },
      {
        path: 'referers/detail/:id',
        component: ReferersComponent,
      },
      {
        path: 'languages/list',
        component: LanguageListComponent,
      },
      {
        path: 'languages/new',
        component: LanguageComponent,
      },
      {
        path: 'languages/detail/:id',
        component: LanguageComponent,
      },
      {
        path: 'country/list',
        component: CountryListComponent,
      },
      {
        path: 'country/new',
        component: CountryComponent,
      },
      {
        path: 'country/detail/:id',
        component: CountryComponent,
      },
      {
        path: 'driving-licences/list',
        component: DrivingLicenceListComponent,
      },
      {
        path: 'driving-licences/new',
        component: DrivingLicenceComponent,
      },
      {
        path: 'driving-licences/detail/:id',
        component: DrivingLicenceComponent,
      },
      {
        path: 'work-type-mds/list',
        component: WorkTypeMdListComponent,
      },
      {
        path: 'work-type-mds/new',
        component: WorkTypeMdComponent,
      },
      {
        path: 'work-type-mds/detail/:id',
        component: WorkTypeMdComponent,
      },
      {
        path: 'computer-skills/list',
        component: ComputerSkillListComponent,
      },
      {
        path: 'computer-skills/new',
        component: ComputerSkillComponent,
      },
      {
        path: 'computer-skills/detail/:id',
        component: ComputerSkillComponent,
      },
      {
        path: 'computer-skills-category/list',
        component: ComputerSkillCategoryListComponent,
      },
      {
        path: 'computer-skills-category/new',
        component: ComputerSkillCategoryComponent,
      },
      {
        path: 'computer-skills-category/detail/:id',
        component: ComputerSkillCategoryComponent,
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictionarydRoutingModule { }
