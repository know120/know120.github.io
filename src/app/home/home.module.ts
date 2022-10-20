import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenubarModule } from 'primeng/menubar';


@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        MenubarModule,
    ],
    exports: [
        DashboardComponent
    ]

})
export class HomeModule { }
