import { Routes } from '@angular/router';
import { SelectionComponent } from './pages/selection/selection.component';
import { NameComponent } from './pages/name/name.component';
import { ChoiceComponent } from './pages/choice/choice.component';
import { ResultComponent } from './pages/result/result.component';

export const routes: Routes = [
  {
    path: 'selection',
    component: SelectionComponent,
  },
  {
    path: 'name',
    component: NameComponent,
  },
  {
    path: 'choice',
    component: ChoiceComponent,
  },
  {
    path: 'result',
    component: ResultComponent,
  },
  {
    path: '**',
    redirectTo: 'selection',
  },
];
