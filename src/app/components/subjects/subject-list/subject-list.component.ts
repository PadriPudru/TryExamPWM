import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from '../../../models/subject.model';
import { SubjectService } from '../../../services/subject.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.css'
})
export class SubjectListComponent implements OnInit {
  subjects: Subject[] = [];
  loading = true;
  error: string | null = null;

  constructor(private subjectService: SubjectService) { }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;
    this.subjectService.getSubjects().subscribe({
      next: (data) => {
        this.subjects = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading subjects: ' + err.message;
        this.loading = false;
      }
    });
  }

  editSubject(subject: Subject): void {
    // This will be handled by the router
  }

  deleteSubject(id: string): void {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.subjectService.deleteSubject(id).subscribe({
        next: () => {
          this.subjects = this.subjects.filter(subject => subject.id !== id);
        },
        error: (err) => {
          this.error = 'Error deleting subject: ' + err.message;
        }
      });
    }
  }
}