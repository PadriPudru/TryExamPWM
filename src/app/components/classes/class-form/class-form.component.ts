import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GymClass } from '../../../models/class.model';
import { ClassService } from '../../../services/class.service';

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './class-form.component.html',
  styleUrl: './class-form.component.css'
})
export class ClassFormComponent implements OnInit {
  classForm: FormGroup;
  isEditMode = false;
  classId: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      difficulty: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.classId;

    if (this.isEditMode && this.classId) {
      this.classService.getClass(this.classId).subscribe(data => {
        this.classForm.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.classForm.invalid) return;

    const data = this.classForm.value;

    if (this.isEditMode && this.classId) {
      this.classService.updateClass(this.classId, data).subscribe(() => {
        this.router.navigate(['/classes']);
      });
    } else {
      this.classService.addClass(data).subscribe(() => {
        this.router.navigate(['/classes']);
      });
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.classForm.reset();
  }

  get f() {
    return this.classForm.controls;
  }
}
