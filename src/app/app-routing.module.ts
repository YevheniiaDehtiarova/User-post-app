import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserTableComponent } from './components/user-table/user-table.component';

const routes: Routes = [
  { path: '', component: UserTableComponent},
  { path: 'users', component: UserTableComponent},
  { path: 'user-detail/:id', component: UserDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
