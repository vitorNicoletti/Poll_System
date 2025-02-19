import { Component, inject, input, NgModule, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PollsService } from '../services/polls.service';
import { catchError } from 'rxjs';
import { Option } from '../model/option.type';
import { WebsocketService } from '../services/websocket.service';
import { ButtonComponent } from "../components/button/button.component";
import { DateTime } from "luxon";
import { FormsModule, NgModel } from '@angular/forms';
@Component({
  selector: 'app-view-poll',
  imports: [ButtonComponent,FormsModule],
  templateUrl: './view-poll.component.html',
  styleUrl: './view-poll.component.css'
})
export class ViewPollComponent {
  constructor(private router: Router, private route: ActivatedRoute) { }
  pollService = inject(PollsService);
  websocketService = inject(WebsocketService)
  title!: string
  startDate!: string
  endDate!: string
  pollId!: number
  selectedOption!:number
  openedPoll = false;


  // Saída: 14/02/2025 18:30

  options: Array<Option> = []



  ngOnInit() {

    this.pollId = +this.route.snapshot.paramMap.get('id')!
    this.pollService.getPoll(this.pollId).pipe(
      catchError((err) => {
        console.log(err);
        throw err;
      })
    )
      .subscribe((poll) => {
        this.title = poll.title;
        this.openedPoll = (DateTime.fromISO(poll.start_date) < DateTime.now() && DateTime.now() < DateTime.fromISO(poll.end_date))
        this.startDate = DateTime.fromISO(poll.start_date).toFormat("dd/MM/yyyy HH:mm");
        this.endDate = DateTime.fromISO(poll.end_date).toFormat("dd/MM/yyyy HH:mm");
        
        this.options = poll.options

      })

    this.websocketService.receiveUpdate().subscribe((dados) => {

      this.options.map(option => {
        if (option.id == dados.optionId) {
          console.log(option.votes)
          console.log(dados.votes)
          option.votes = dados.votes
        }
        console.log(option)
      }
      )
    });
  }

  sendVote(){
    this.pollService.sendVote(this.selectedOption).pipe(
      catchError((err) => {
        console.log(err);
        throw err;
      })
    )
    .subscribe(()=>{
      window.alert('Voto confirmado! Obrigado pela participacao')
      this.router.navigateByUrl('/')
    })
  }

}
