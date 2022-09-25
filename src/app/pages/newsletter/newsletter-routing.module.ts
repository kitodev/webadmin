import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import { HCNewsletterListComponent } from './hc-newsletter-list/hc-newsletter-list.component';
import { HCNewsletterComponent } from './hc-newsletter.component';
import { MDNewsletterListComponent } from './md-newsletter/md-newsletter-list/md-newsletter-list.component';
import { MDNewsletterComponent } from './md-newsletter/md-newsletter.component';


const routes: Routes = [
      {
        path: 'hc-newsletter/:id',
        component:  HCNewsletterListComponent,
      },
      {
        path: 'hc-newsletter/new',
        component: HCNewsletterComponent,
      },
      {
        path: 'detail/:id',
        component: HCNewsletterComponent,
      },
      {
        path: 'md-newsletter/:id',
        component:  MDNewsletterListComponent,
      },
      {
        path: 'md-newsletter/new',
        component: MDNewsletterComponent,
      },
      {
        path: 'md-newsletter/detail/:id',
        component: MDNewsletterComponent,
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterRoutingModule { }
