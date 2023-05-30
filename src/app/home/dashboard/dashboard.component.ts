import { Component, OnInit } from '@angular/core';
import { MenuItem, SharedModule } from 'primeng/api';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: true,
    imports: [CardModule, SharedModule]
})
export class DashboardComponent {

    items!: MenuItem[];

    constructor() { }

    ngOnInit(): void {
        
    }
}
