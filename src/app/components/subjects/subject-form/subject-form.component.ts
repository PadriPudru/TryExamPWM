import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from '../../../models/subject.model';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './subject-form.component.html',
  styleUrl: './subject-form.component.css'
})
export class SubjectFormComponent implements OnInit {
  subjectForm: FormGroup;
  isEditMode = false;
  subjectId: string | null = null;
  loading = false;
  error: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.subjectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.subjectId;

    if (this.isEditMode && this.subjectId) {
      this.loadSubject(this.subjectId);
    }
  }

  loadSubject(id: string): void {
    this.loading = true;
    this.subjectService.getSubject(id).subscribe({
      next: (subject) => {
        if (subject) {
          this.subjectForm.patchValue({
            name: subject.name,
            description: subject.description
          });
        } else {
          this.error = 'Subject not found';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading subject: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.subjectForm.invalid) {
      return;
    }

    this.loading = true;
    const subjectData: Subject = this.subjectForm.value;

    if (this.isEditMode && this.subjectId) {
      this.subjectService.updateSubject(this.subjectId, subjectData).subscribe({
        next: () => {
          this.router.navigate(['/subjects']);
        },
        error: (err) => {
          this.error = 'Error updating subject: ' + err.message;
          this.loading = false;
        }
      });
    } else {
      this.subjectService.addSubject(subjectData).subscribe({
        next: () => {
          this.router.navigate(['/subjects']);
        },
        error: (err) => {
          this.error = 'Error adding subject: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.submitted = false;
    if (this.isEditMode && this.subjectId) {
      this.loadSubject(this.subjectId);
    } else {
      this.subjectForm.reset();
    }
  }

  // Getter for easy access to form fields
  get f() { return this.subjectForm.controls; }
}