import { PositionHcTabComponent } from './position-hc-details/position-hc-tab/position-hc-tab.component';
import { PositionHcDetailsComponent } from './position-hc-details/position-hc-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DropdownMenusModule } from '../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponentModule } from 'src/app/shared/form/form-component.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PositionHcComponent } from './position-hc.component';
import { PositionMdComponent } from './position-md/position-md.component';
import { PositionHcListComponent } from './position-hc-list/position-hc-list.component';
import { PositionMdListComponent } from './position-md/position-md-list/position-md-list.component';
import { PositionRoutingModule } from './position-routing.module';
import { CityPipe } from 'src/app/core/pipe/countypipe.pipe';
import { SharedModule } from 'src/app/shared';
import { CKEditorModule } from 'ckeditor4-angular';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    PositionHcComponent,
    PositionMdComponent,
    PositionHcListComponent,
    PositionHcDetailsComponent,
    PositionMdListComponent,
    PositionHcTabComponent,
    //CityPipe
  ],
  imports: [
    CommonModule,
    CoreModule,
    InlineSVGModule,
    CKEditorModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    PositionRoutingModule,
    NgbModule,
    NgxPaginationModule,
    DropdownMenusModule,
    FormComponentModule
  ]
})
export class PositionModule { }
