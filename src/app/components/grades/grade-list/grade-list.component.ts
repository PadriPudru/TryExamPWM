import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Grade } from '../../../models/grade.model';
import { GradeService } from '../../../services/grade.service';
import { StudentService } from '../../../services/student.service';
import { SubjectService } from '../../../services/subject.service';
import { Student } from '../../../models/student.model';
import { Subject } from '../../../models/subject.model';
import { forkJoin } from 'rxjs';

interface GradeViewModel {
  id?: string;
  studentId: string;
  subjectId: string;
  grade: number;
  studentName: string;
  subjectName: string;
}

@Component({
  selector: 'app-grade-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './grade-list.component.html',
  styleUrl: './grade-list.component.css'
})
export class GradeListComponent implements OnInit {
  grades: GradeViewModel[] = [];
  loading = true;
  error: string | null = null;
  students: Student[] = [];
  subjects: Subject[] = [];

  constructor(
    private gradeService: GradeService,
    private studentService: StudentService,
    private subjectService: SubjectService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    forkJoin({
      grades: this.gradeService.getGrades(),
      students: this.studentService.getStudents(),
      subjects: this.subjectService.getSubjects()
    }).subscribe({
      next: (data) => {
        this.students = data.students;
        this.subjects = data.subjects;
        
        this.grades = data.grades.map(grade => {
          const student = this.students.find(s => s.id === grade.studentId);
          const subject = this.subjects.find(s => s.id === grade.subjectId);
          
          return {
            ...grade,
            studentName: student ? student.name : 'Unknown Student',
            subjectName: subject ? subject.name : 'Unknown Subject'
          };
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading data: ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteGrade(id: string): void {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.gradeService.deleteGrade(id).subscribe({
        next: () => {
          this.grades = this.grades.filter(grade => grade.id !== id);
        },
        error: (err) => {
          this.error = 'Error deleting grade: ' + err.message;
        }
      });
    }
  }
}