import { PositionHcDetailsComponent } from './position-hc-details/position-hc-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { PositionHcComponent } from './position-hc.component';
import { PositionHcListComponent } from './position-hc-list/position-hc-list.component';
import { PositionMdListComponent } from './position-md/position-md-list/position-md-list.component';
import { PositionMdComponent } from './position-md/position-md.component';

const routes: Routes = [
  {
    path: 'position-hc/list',
    component:  PositionHcListComponent,
  },
  {
    path: 'position-hc/new',
    component: PositionHcComponent,
  },
  {
    path: 'detail/:id',
    component: PositionHcComponent,
  },
  {
    path: 'position-hc/details/:id',
    component: PositionHcDetailsComponent,
  },
  {
    path: 'position-md/list',
    component:  PositionMdListComponent,
  },
  {
    path: 'position-md/new',
    component: PositionMdComponent,
  },
  {
    path: 'detail/:id',
    component: PositionMdComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionRoutingModule { }
