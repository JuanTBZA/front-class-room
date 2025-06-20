import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./modules/users/user.routes').then(m => m.USER_ROUTES)
    
  },
  { path: 'courses', loadComponent: () => import('./modules/course/course-list/course-list.component').then(m => m.CourseListComponent) }

];
