import { Component } from '@angular/core';
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [DashboardComponent]
})
export class AppComponent {
  title = 'Sujay Halder';
}
