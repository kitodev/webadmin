import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from '../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponentModule } from 'src/app/shared/form/form-component.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HCSubscriberListComponent } from './hc-subscriber/hc-subscriber-list/hc-subscriber-list.component';
import { HCSubscriberComponent } from './hc-subscriber/hc-subscriber.component';
//import { FileBasedUnsubscriberComponent } from './file-based-unsubscriber/file-based-unsubscriber.component';
import { MDSubscriberListComponent } from './md-subscriber/md-subscriber-list/md-subscriber-list.component';
import { EmailSubscriberRoutingModule } from './email-subscriber-routing.module';
import { MDSubscriberComponent } from './md-subscriber/md-subscriber.component';
import { SharedModule } from 'src/app/shared';

@NgModule({
  declarations: [
    //FileBasedUnsubscriberComponent,
    HCSubscriberComponent,
    HCSubscriberListComponent,
    HCSubscriberComponent,
    MDSubscriberListComponent,
    MDSubscriberComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgbModule,
    EmailSubscriberRoutingModule,
    NgxPaginationModule,
    DropdownMenusModule,
    FormComponentModule
  ]
})
export class EmailSubscriberModule { }
