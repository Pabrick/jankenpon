import { Routes } from '@angular/router';
import { SelectionPageComponent } from './pages/selection-page/selection-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';

export const routes: Routes = [
  {
    path: '',
    component: SelectionPageComponent,
  },
  {
    path: 'game',
    component: GamePageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
