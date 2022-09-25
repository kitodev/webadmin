import { Routes } from '@angular/router';
import { AppRoutes } from '../shared/system/AppRoutes';


const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: 'position',
    loadChildren: () =>
      import('./position/position.module').then((m) => m.PositionModule),
  },
  {
    path: 'workers',
    loadChildren: () =>
      import('./workers/workers.module').then((m) => m.WorkersModule),
  },
  {
    path: 'dictionary',
    loadChildren: () =>
      import('./dictionary/dictionary.module').then((m) => m.DictionaryModule),
  },
  {
    path: 'company',
    loadChildren: () =>
      import('./company/company.module').then((m) => m.CompanyModule),
  },
  {
    path: 'offices',
    loadChildren: () =>
      import('./offices/offices.module').then((m) => m.OfficesModule),
  },
  {
    path: 'email-subscriber',
    loadChildren: () =>
      import('./email-subscriber/email-subscriber.module').then((m) => m.EmailSubscriberModule),
  },
  {
    path: 'newsletter',
    loadChildren: () =>
      import('./newsletter/newsletter.module').then((m) => m.NewsletterModule),
  },
  // {
  //   path: AppRoutes.JOBS_POST_OFFICE,
  //   loadChildren: () =>
  //     import('./jobs-post-office/jobs-post-office.module').then((m) => m.JobsPostOfficeModule),
  // },

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
