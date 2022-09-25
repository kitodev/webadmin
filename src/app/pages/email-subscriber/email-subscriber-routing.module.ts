import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
//import { FileBasedUnsubscriberComponent } from './file-based-unsubscriber/file-based-unsubscriber.component';
import { HCSubscriberListComponent } from './hc-subscriber/hc-subscriber-list/hc-subscriber-list.component';
import { HCSubscriberComponent } from './hc-subscriber/hc-subscriber.component';
import { MDSubscriberListComponent } from './md-subscriber/md-subscriber-list/md-subscriber-list.component';
import { MDSubscriberComponent } from './md-subscriber/md-subscriber.component';

const routes: Routes = [
      {
        path: 'hc-subscriber/list',
        component:  HCSubscriberListComponent,
      },
      {
        path: 'hc-subscriber/new',
        component: HCSubscriberComponent,
      },
      {
        path: 'md-subscriber/list',
        component:  MDSubscriberListComponent,
      },
      {
        path: 'md-subscriber/new',
        component: MDSubscriberComponent,
      },
      // {
      //   path: 'file-based-unsubscriber',
      //   component: FileBasedUnsubscriberComponent,
      // },
      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailSubscriberRoutingModule { }
