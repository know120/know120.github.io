import { Component } from '@angular/core';
import { MenuItem, SharedModule } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Card } from 'src/app/model/card';
import { MenubarModule } from 'primeng/menubar';
import { CardComponent } from 'src/app/sharedComponent/card/card.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: true,
    imports: [CardModule, SharedModule, MenubarModule, CardComponent]
})
export class DashboardComponent {
    currentYear = new Date().getFullYear();
    
    expASL: Card = {
        header: 'Alumnus Software Limited',
        title: 'Full Stack Developer',
        body: 'Developed a web application for one of the leading Tire manufacturing company using Angular 7,Bootstrap 5, .NET Framework, and SQLServer.',
        footer: 'July 2022 - Present'
    };

    expDSS: Card = {
        header: 'Divsoft Software Solutions',
        title: 'Software Engineer',
        body: 'Developed a Over Speed Detection System using CPP and OpenCV. That can receive the speed of the vehicle from a remote server using TCP Connection and Capture the image of vehicle.',
        footer: 'August 2021 - July 2022'
    };

    projDA: Card = {
        header: 'Data Analysis',
        // title: 'Software Engineer',
        body: 'Analysis and Visualization of Political Spending on Facebook.',
        footer: 'Have a look'
    };

    projML: Card = {
        header: 'Machine Learing',
        // title: 'Software Engineer',
        body: 'Covid prediction using Chest X-Ray using Machine Learning.',
        footer: 'Have a look'
    };
      
}
