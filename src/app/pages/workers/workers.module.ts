import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from '../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponentModule } from 'src/app/shared/form/form-component.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { WorkersListComponent } from './workers-list/workers-list.component';
import { WorkersComponent } from './workers.component';
import { WorkersRoutingModule } from './workers-routing.module';
import { WorkersListComponent } from './workers-list/workers-list.component';
import { UserMdComponent } from './user-md/user-md.component';
import { UserHcComponent } from './user-hc/user-hc.component';
import { SearchWorkersComponent } from './search-workers/search-workers.component';
import { UserDeletionLogsComponent } from './user-deletion-logs/user-deletion-logs.component';
import { UserHcListComponent } from './user-hc/user-hc-list/user-hc-list.component';
import { SharedModule } from 'src/app/shared';
import { TableComponent } from 'src/app/shared/table/table/table.component';
import { CountyPipe } from 'src/app/core/pipe/country.pipe';

@NgModule({
  declarations: [
    //CountyPipe,
    WorkersComponent,
    WorkersListComponent,
    UserMdComponent,
    UserHcComponent,
    SearchWorkersComponent,
    UserDeletionLogsComponent,
    UserHcListComponent,
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgbModule,
    WorkersRoutingModule,
    NgxPaginationModule,
    DropdownMenusModule,
    FormComponentModule
  ]
})
export class WorkersModule { }
