import {Component, Input} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'field',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './field.component.html',
  styleUrl: './field.component.css'
})

export class FieldComponent {
  @Input() label!: string
  @Input() required!: boolean
  userInput!: string
}
