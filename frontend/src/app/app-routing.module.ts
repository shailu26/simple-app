import {
  NgModule
} from '@angular/core';

import {
  CommonModule,
  Location
} from '@angular/common';

import {
  Route,
  RouterModule
} from '@angular/router';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { HomeComponent } from './components/home/home.component';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'

  },
  {
    path: 'home',
    component: HomeComponent,

  },
  {
    path: 'edit-user/:userId',
    component: EditUserComponent,

  },
  {
    path: 'newuser',
    component: NewUserComponent,

  },
  {
    path: '**',
    redirectTo: 'Error',

  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'
    })
  ],
  declarations: [],
  exports: [RouterModule],

})
export class AppRoutingModule {

  constructor(private _location: Location) {}
}
