import { Component, OnInit } from '@angular/core';
import { ApidataService } from '../apidata.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  selected: string = 'Dashboard'; // Default selected item

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen to route changes and update the selected item based on the current URL
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSelectedItem();
      });

    // Initial route check
    this.updateSelectedItem();
  }

  updateSelectedItem(): void {
    const currentUrl = this.router.url;

    if (currentUrl.includes('dashboard')) {
      this.selected = 'Dashboard';
    } else if (currentUrl.includes('expenses')) {
      this.selected = 'Expenses';
    } else if (currentUrl.includes('settings')) {
      this.selected = 'Settings';
    }
  }

  select(item: string): void {
    this.selected = item;
  }
}
