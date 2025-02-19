import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, input, signal } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  message = input.required<String>()
  @Input() clickable = true
  @Input() clickableteste:boolean = true;
}
