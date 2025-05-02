import { Routes } from '@angular/router';

// Trainer Components
import { TrainerListComponent } from './components/trainers/trainer-list/trainer-list.component';
import { TrainerFormComponent } from './components/trainers/trainer-form/trainer-form.component';

// Class Components
import { ClassListComponent } from './components/classes/class-list/class-list.component';
import { ClassFormComponent } from './components/classes/class-form/class-form.component';

// Assignment Components
import { AssignmentListComponent } from './components/assignments/assignment-list/assignment-list.component';
import { AssignmentFormComponent } from './components/assignments/assignment-form/assignment-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/trainers', pathMatch: 'full' },

  { path: 'trainers', component: TrainerListComponent },
  { path: 'trainers/new', component: TrainerFormComponent },
  { path: 'trainers/edit/:id', component: TrainerFormComponent },

  { path: 'classes', component: ClassListComponent },
  { path: 'classes/new', component: ClassFormComponent },
  { path: 'classes/edit/:id', component: ClassFormComponent },

  { path: 'assignments', component: AssignmentListComponent },
  { path: 'assignments/new', component: AssignmentFormComponent },
  { path: 'assignments/edit/:id', component: AssignmentFormComponent },

  { path: '**', redirectTo: '/trainers' }
];
