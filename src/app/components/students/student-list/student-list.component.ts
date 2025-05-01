import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../../services/student.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  loading = true;
  error: string | null = null;

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading students: ' + err.message;
        this.loading = false;
      }
    });
  }

  editStudent(student: Student): void {
    // This will be handled by the router
  }

  deleteStudent(id: string): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter(student => student.id !== id);
        },
        error: (err) => {
          this.error = 'Error deleting student: ' + err.message;
        }
      });
    }
  }
}
