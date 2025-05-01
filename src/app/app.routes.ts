import { Routes } from '@angular/router';

// Student Components
import { StudentListComponent } from './components/students/student-list/student-list.component';
import { StudentFormComponent } from './components/students/student-form/student-form.component';

// Subject Components
import { SubjectListComponent } from './components/subjects/subject-list/subject-list.component';
import { SubjectFormComponent } from './components/subjects/subject-form/subject-form.component';

// Grade Components
import { GradeListComponent } from './components/grades/grade-list/grade-list.component';
import { GradeFormComponent } from './components/grades/grade-form/grade-form.component';

export const routes: Routes = [
  // Default route
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  
  // Student routes
  { path: 'students', component: StudentListComponent },
  { path: 'students/new', component: StudentFormComponent },
  { path: 'students/edit/:id', component: StudentFormComponent },
  
  // Subject routes
  { path: 'subjects', component: SubjectListComponent },
  { path: 'subjects/new', component: SubjectFormComponent },
  { path: 'subjects/edit/:id', component: SubjectFormComponent },
  
  // Grade routes
  { path: 'grades', component: GradeListComponent },
  { path: 'grades/new', component: GradeFormComponent },
  { path: 'grades/edit/:id', component: GradeFormComponent },
  
  // Wildcard route for 404
  { path: '**', redirectTo: '/students' }
];
