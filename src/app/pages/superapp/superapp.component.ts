import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-superapp',
  standalone: true,
  imports: [CommonModule, InputTextModule, FormsModule],
  templateUrl: './superapp.component.html',
  styleUrls: ['./superapp.component.css']
})
export class SuperappComponent {
  appURLs: string[] = [];
  urlToAdd: string | undefined;
  urlToOpen: string = "";
  showFrame:boolean = false;

  ngOnInit(): void {

  }

  addApp() {
    console.log(this.urlToAdd);
    if (this.urlToAdd != undefined && this.urlToAdd.length > 0)
      this.appURLs.push(this.urlToAdd);
    this.urlToAdd = "";
    console.log(this.appURLs);

  }

  openApp(url : string) {
    this.urlToOpen = url;
    this.showFrame = true;
    $('#app').load(this.urlToOpen);
  }
}
