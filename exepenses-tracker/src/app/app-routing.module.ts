import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'dashboard', component: HomeComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'settings', component: SettingsComponent },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
