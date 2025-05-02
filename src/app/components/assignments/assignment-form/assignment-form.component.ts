import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Assignment } from '../../../models/assignment.model';
import { AssignmentService } from '../../../services/assignment.service';
import { TrainerService } from '../../../services/trainer.service';
import { ClassService } from '../../../services/class.service';
import { Trainer } from '../../../models/trainer.model';
import { GymClass } from '../../../models/class.model';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './assignment-form.component.html',
  styleUrl: './assignment-form.component.css'
})
export class AssignmentFormComponent implements OnInit {
  assignmentForm: FormGroup;
  isEditMode = false;
  assignmentId: string | null = null;
  submitted = false;

  trainers: Trainer[] = [];
  classes: GymClass[] = [];

  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private trainerService: TrainerService,
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.assignmentForm = this.fb.group({
      trainerId: ['', Validators.required],
      classId: ['', Validators.required],
      day: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.assignmentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.assignmentId;

    this.trainerService.getTrainers().subscribe(data => this.trainers = data);
    this.classService.getClasses().subscribe(data => this.classes = data);

    if (this.isEditMode && this.assignmentId) {
      this.assignmentService.getAssignment(this.assignmentId).subscribe(data => {
        this.assignmentForm.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.assignmentForm.invalid) return;

    const data = this.assignmentForm.value;

    if (this.isEditMode && this.assignmentId) {
      this.assignmentService.updateAssignment(this.assignmentId, data).subscribe(() => {
        this.router.navigate(['/assignments']);
      });
    } else {
      this.assignmentService.addAssignment(data).subscribe(() => {
        this.router.navigate(['/assignments']);
      });
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.assignmentForm.reset();
  }

  get f() {
    return this.assignmentForm.controls;
  }
}
