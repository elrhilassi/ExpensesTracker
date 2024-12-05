import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { HomeComponent } from './home/home.component';
import { NgChartsModule } from 'ng2-charts';
import { NgChartsConfiguration } from 'ng2-charts';

import { ExpensesComponent } from './expenses/expenses.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-- Add this import
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingsComponent } from './settings/settings.component';
@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    HomeComponent,
    ExpensesComponent,
    TransactionsHistoryComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
