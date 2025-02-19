import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./all-polls/all-polls.component').then(
                m => m.AllPollsComponent
            )
        }
    },
    {
        path: ':id',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./view-poll/view-poll.component').then(
                m => m.ViewPollComponent
            )
        }
    }



];
