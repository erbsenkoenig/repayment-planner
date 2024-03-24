import { Route } from '@angular/router';
import { PlannerComponent } from './feature-planner/planner.component';
import { NotFoundComponent } from './feature-not-found/not-found.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: PlannerComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
