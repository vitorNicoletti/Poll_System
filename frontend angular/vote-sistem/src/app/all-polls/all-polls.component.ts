import { Component, inject, signal } from '@angular/core';
import { PollCardComponent } from "../components/poll-card/poll-card.component";
import { PollsService } from '../services/polls.service';
import { catchError } from 'rxjs';
import { Poll } from '../model/poll.type';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-all-polls',
  imports: [PollCardComponent],
  templateUrl: './all-polls.component.html',
  styleUrls: ['./all-polls.component.css']
})
export class AllPollsComponent {
  pollService = inject(PollsService);
  emAndamento = signal<Array<Poll>>([]);
  naoIniciadas = signal<Array<Poll>>([]);
  finalizadas = signal<Array<Poll>>([]);

  ngOnInit(): void {
    this.pollService.getAllPolls().pipe(
      catchError((err) => {
        console.log(err);
        throw err;
      })
    )
    .subscribe((polls) => {
      // Arrays temporários (fora do loop)
      const emAndamentoTemp: Poll[] = [];
      const naoIniciadasTemp: Poll[] = [];
      const finalizadasTemp: Poll[] = [];

      for (const poll of polls) {
        const startDate = DateTime.fromISO(poll.start_date);
        const endDate = DateTime.fromISO(poll.end_date);
        const currentDate = DateTime.now();


        if (currentDate < startDate) {
          poll.start_date = startDate.toFormat("dd/MM/yyyy HH:mm")
          poll.end_date = endDate.toFormat("dd/MM/yyyy HH:mm")
          naoIniciadasTemp.push(poll); 
        } 

        else if (currentDate >= startDate && currentDate <= endDate) {
          poll.start_date = startDate.toFormat("dd/MM/yyyy HH:mm")
          poll.end_date = endDate.toFormat("dd/MM/yyyy HH:mm")
          emAndamentoTemp.push(poll); 
        } 

        else if (currentDate > endDate) {
          poll.start_date = startDate.toFormat("dd/MM/yyyy HH:mm")
          poll.end_date = endDate.toFormat("dd/MM/yyyy HH:mm")
          finalizadasTemp.push(poll); 
        }
      }

      this.naoIniciadas.set(naoIniciadasTemp);
      this.emAndamento.set(emAndamentoTemp);
      this.finalizadas.set(finalizadasTemp);
    });
  }
}
