import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Trainer } from '../../../models/trainer.model';
import { TrainerService } from '../../../services/trainer.service';

@Component({
  selector: 'app-trainer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './trainer-form.component.html',
  styleUrl: './trainer-form.component.css'
})
export class TrainerFormComponent implements OnInit {
  trainerForm: FormGroup;
  isEditMode = false;
  trainerId: string | null = null;
  loading = false;
  error: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private trainerService: TrainerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.trainerForm = this.fb.group({
      name: ['', [Validators.required]],
      specialty: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.trainerId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.trainerId;

    if (this.isEditMode && this.trainerId) {
      this.trainerService.getTrainer(this.trainerId).subscribe({
        next: (trainer) => {
          this.trainerForm.patchValue(trainer);
        },
        error: (err) => {
          this.error = 'Error loading trainer: ' + err.message;
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.trainerForm.invalid) return;

    const data = this.trainerForm.value;

    if (this.isEditMode && this.trainerId) {
      this.trainerService.updateTrainer(this.trainerId, data).subscribe(() => {
        this.router.navigate(['/trainers']);
      });
    } else {
      this.trainerService.addTrainer(data).subscribe(() => {
        this.router.navigate(['/trainers']);
      });
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.trainerForm.reset();
  }

  get f() {
    return this.trainerForm.controls;
  }
}
