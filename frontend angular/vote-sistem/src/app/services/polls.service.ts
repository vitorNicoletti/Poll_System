import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Poll } from '../model/poll.type';

@Injectable({
  providedIn: 'root'
})
export class PollsService {
  http = inject(HttpClient)
  getAllPolls(){
    const url = 'http://localhost:3000/api/v1/polls/';
    return this.http.get<Array<Poll>>(url);
  }
  getPoll(id:number){
    const url = `http://localhost:3000/api/v1/polls/${id}`;
    return this.http.get<Poll>(url);
  }
  sendVote(pollID:number,optionId:number){
    const url = `http://localhost:3000/api/v1/polls/${pollID}/vote`
    return this.http.put(url,{optionId:optionId})
  }
}
