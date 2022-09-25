import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { UserDeletionLogsComponent } from './user-deletion-logs/user-deletion-logs.component';
import { UserHcListComponent } from './user-hc/user-hc-list/user-hc-list.component';
import { UserHcComponent } from './user-hc/user-hc.component';
import { WorkersListComponent } from './workers-list/workers-list.component';
import { WorkersComponent } from './workers.component';

const routes: Routes = [
      {
        path: 'user-hc/list',
        component: UserHcListComponent,
      },
      {
        path: 'user-hc/detail/:id',
        component: UserHcComponent,
      },
      {
        path: 'user-hc/new',
        component: UserHcComponent,
      },
      {
        path: 'list',
        component: WorkersListComponent,
      },
      {
        path: 'workers/new',
        component: WorkersComponent,
      },
      {
        path: 'detail/:id',
        component: WorkersComponent,
      },
      {
        path: 'user-deletion-logs',
        component: UserDeletionLogsComponent,
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkersRoutingModule { }
