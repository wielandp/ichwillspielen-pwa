import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MytransListComponent } from './mytrans-list/mytrans-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DayCalComponent } from './day-cal/day-cal.component';
import { CodesListComponent } from "./codes-list/codes-list.component";

const routes: Routes = [
  { path: '',        component: DayCalComponent },
  { path: 'login',   component: DayCalComponent },
  { path: 'mytrans', component: MytransListComponent },
  { path: 'codes',   component: CodesListComponent },
  { path: '**',      component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  DayCalComponent,
  MytransListComponent,
  PageNotFoundComponent,
]