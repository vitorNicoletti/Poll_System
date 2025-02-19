import { Component, input } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-card',
  imports: [ButtonComponent],
  templateUrl: './poll-card.component.html',
  styleUrl: './poll-card.component.css'
})
export class PollCardComponent {
  constructor(private router: Router) {}

  routeToPoll(){
    this.router.navigateByUrl(`/${this.id()}`)
  }
  title = input.required()
  startDate = input.required()
  endDate = input.required()
  id = input.required()
  
}
