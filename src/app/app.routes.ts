import { Routes } from '@angular/router';

export const routes: Routes = [
    {
  path: 'courses',
  loadChildren: () =>
    import('./modules/course/course.routes').then(m => m.COURSE_ROUTES),
}

];
