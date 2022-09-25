import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyComponent } from './company.component';

const routes: Routes = [
      {
        path: 'list',
        component: CompanyListComponent,
      },
      {
        path: 'company/new',
        component: CompanyComponent,
      },
      {
        path: 'detail/:id',
        component: CompanyComponent,
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
