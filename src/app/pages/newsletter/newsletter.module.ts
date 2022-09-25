import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from '../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponentModule } from 'src/app/shared/form/form-component.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { FileBasedUnsubscriberComponent } from '../email-subscriber/file-based-unsubscriber/file-based-unsubscriber.component';
import { HCNewsletterComponent } from './hc-newsletter.component';
import { MDNewsletterComponent } from './md-newsletter/md-newsletter.component';
import { HCNewsletterListComponent } from './hc-newsletter-list/hc-newsletter-list.component';
import { MDNewsletterListComponent } from './md-newsletter/md-newsletter-list/md-newsletter-list.component';
import { NewsletterRoutingModule } from './newsletter-routing.module';

@NgModule({
  declarations: [
    //FileBasedUnsubscriberComponent,
    HCNewsletterListComponent,
    HCNewsletterComponent,
    MDNewsletterListComponent,
    MDNewsletterComponent,
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    ReactiveFormsModule,
    FormsModule,
    NewsletterRoutingModule,
    NgbModule,
    NgxPaginationModule,
    DropdownMenusModule,
    FormComponentModule
  ]
})
export class NewsletterModule { }
