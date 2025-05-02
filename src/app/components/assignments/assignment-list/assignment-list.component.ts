import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../../services/assignment.service';
import { TrainerService } from '../../../services/trainer.service';
import { ClassService } from '../../../services/class.service';
import { Assignment } from '../../../models/assignment.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.css'
})
export class AssignmentListComponent implements OnInit {
  assignments: Assignment[] = [];
  trainersMap: any = {};
  classesMap: any = {};

  constructor(
    private assignmentService: AssignmentService,
    private trainerService: TrainerService,
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    this.assignmentService.getAssignments().subscribe(data => this.assignments = data);
    this.trainerService.getTrainers().subscribe(trainers => {
      this.trainersMap = Object.fromEntries(trainers.map(t => [t.id, t.name]));
    });
    this.classService.getClasses().subscribe(classes => {
      this.classesMap = Object.fromEntries(classes.map(c => [c.id, c.name]));
    });
  }

  deleteAssignment(id: string) {
    if (confirm('Delete assignment?')) {
      this.assignmentService.deleteAssignment(id).subscribe(() => {
        this.assignments = this.assignments.filter(a => a.id !== id);
      });
    }
  }
}
