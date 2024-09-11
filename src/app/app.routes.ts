import { Routes } from '@angular/router';
import { SuperappComponent } from './pages/superapp/superapp.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NoteComponent } from './pages/note/note.component';

export const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'home', component: DashboardComponent},
    {path: 'super', component: SuperappComponent},
    {path: 'note', component: NoteComponent},
];
