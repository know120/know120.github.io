import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { CardComponent } from 'src/app/sharedComponent/card/card.component';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, CardModule, CardComponent],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent {

}
