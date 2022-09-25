import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { OfficesListComponent } from './offices-list/offices-list.component';
import { OfficesComponent } from './offices.component';

const routes: Routes = [
      {
        path: 'list',
        component: OfficesListComponent,
      },
      {
        path: 'offices/new',
        component: OfficesComponent,
      },
      {
        path: 'detail/:id',
        component: OfficesComponent,
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficesRoutingModule { }
