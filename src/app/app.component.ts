import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [MenubarModule, RouterOutlet]
})
export class AppComponent {
  title = 'Sujay Halder';
  menuItems: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Home',
        routerLink: ['home']
      },
      {
        label: 'About',
      },
      {
        label: 'Projects',
        routerLink:["#projects"]
      },
      {
        label: 'Services',
        items: [
          {
            label: 'Notes',
            routerLink: ['note']
          },
          {
            label: 'Super App',
            routerLink: ['super']
          },
        ]
      },
      {
        label: 'Blogs',
      },
      {
        label: 'Contacts',
      }
    ];
  }
}
