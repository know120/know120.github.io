import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SuperappComponent } from './pages/superapp/superapp.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [DashboardComponent, MenubarModule, SuperappComponent]
})
export class AppComponent {
  title = 'Sujay Halder';
  menuItems: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Home',
      },
      {
        label: 'About',
      },
      {
        label: 'Projects',
      },
      {
        label: 'Services',
        items: [
          {
            label: 'Notes',
          },
          {
            label: 'Super App',
          },
        ]
      },
      {
        label: 'Blogs',
      },
      {
        label: 'Contact',
      }
    ];
  }
}
