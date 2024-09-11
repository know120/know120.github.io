import { Component } from '@angular/core';
import { MenuItem, SharedModule } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: true,
    imports: [CardModule, SharedModule, MenubarModule]
})
export class DashboardComponent {

}
