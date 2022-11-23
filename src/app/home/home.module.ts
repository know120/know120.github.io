import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenubarModule } from 'primeng/menubar';
import {CardModule} from 'primeng/card';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        MenubarModule,
        CardModule
    ],
    exports: [
        DashboardComponent
    ]

})
export class HomeModule { }
