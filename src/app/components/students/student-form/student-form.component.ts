import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Student } from '../../../models/student.model';
import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode = false;
  studentId: string | null = null;
  loading = false;
  error: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.studentId;

    if (this.isEditMode && this.studentId) {
      this.loadStudent(this.studentId);
    }
  }

  loadStudent(id: string): void {
    this.loading = true;
    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        if (student) {
          this.studentForm.patchValue({
            name: student.name,
            email: student.email
          });
        } else {
          this.error = 'Student not found';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading student: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.studentForm.invalid) {
      return;
    }

    this.loading = true;
    const studentData: Student = this.studentForm.value;

    if (this.isEditMode && this.studentId) {
      this.studentService.updateStudent(this.studentId, studentData).subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: (err) => {
          this.error = 'Error updating student: ' + err.message;
          this.loading = false;
        }
      });
    } else {
      this.studentService.addStudent(studentData).subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: (err) => {
          this.error = 'Error adding student: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.submitted = false;
    if (this.isEditMode && this.studentId) {
      this.loadStudent(this.studentId);
    } else {
      this.studentForm.reset();
    }
  }

  // Getter for easy access to form fields
  get f() { return this.studentForm.controls; }
}