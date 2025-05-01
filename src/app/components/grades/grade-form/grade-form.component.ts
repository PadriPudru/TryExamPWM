import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Grade } from '../../../models/grade.model';
import { GradeService } from '../../../services/grade.service';
import { StudentService } from '../../../services/student.service';
import { SubjectService } from '../../../services/subject.service';
import { Student } from '../../../models/student.model';
import { Subject } from '../../../models/subject.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-grade-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './grade-form.component.html',
  styleUrl: './grade-form.component.css'
})
export class GradeFormComponent implements OnInit {
  gradeForm: FormGroup;
  isEditMode = false;
  gradeId: string | null = null;
  loading = false;
  error: string | null = null;
  submitted = false;
  students: Student[] = [];
  subjects: Subject[] = [];

  constructor(
    private fb: FormBuilder,
    private gradeService: GradeService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.gradeForm = this.fb.group({
      studentId: ['', [Validators.required]],
      subjectId: ['', [Validators.required]],
      grade: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.loadStudentsAndSubjects();
    
    this.gradeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.gradeId;

    if (this.isEditMode && this.gradeId) {
      this.loadGrade(this.gradeId);
    }
  }

  loadStudentsAndSubjects(): void {
    this.loading = true;
    
    forkJoin({
      students: this.studentService.getStudents(),
      subjects: this.subjectService.getSubjects()
    }).subscribe({
      next: (data) => {
        this.students = data.students;
        this.subjects = data.subjects;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading data: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadGrade(id: string): void {
    this.loading = true;
    this.gradeService.getGrade(id).subscribe({
      next: (grade) => {
        if (grade) {
          this.gradeForm.patchValue({
            studentId: grade.studentId,
            subjectId: grade.subjectId,
            grade: grade.grade
          });
        } else {
          this.error = 'Grade not found';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading grade: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.gradeForm.invalid) {
      return;
    }

    this.loading = true;
    const gradeData: Grade = this.gradeForm.value;

    if (this.isEditMode && this.gradeId) {
      this.gradeService.updateGrade(this.gradeId, gradeData).subscribe({
        next: () => {
          this.router.navigate(['/grades']);
        },
        error: (err) => {
          this.error = 'Error updating grade: ' + err.message;
          this.loading = false;
        }
      });
    } else {
      this.gradeService.addGrade(gradeData).subscribe({
        next: () => {
          this.router.navigate(['/grades']);
        },
        error: (err) => {
          this.error = 'Error adding grade: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.submitted = false;
    if (this.isEditMode && this.gradeId) {
      this.loadGrade(this.gradeId);
    } else {
      this.gradeForm.reset();
    }
  }

  // Getter for easy access to form fields
  get f() { return this.gradeForm.controls; }
}