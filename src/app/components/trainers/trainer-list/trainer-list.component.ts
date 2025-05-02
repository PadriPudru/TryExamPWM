import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrainerService } from '../../../services/trainer.service';
import { Trainer } from '../../../models/trainer.model';

@Component({
  selector: 'app-trainer-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trainer-list.component.html',
  styleUrl: './trainer-list.component.css'
})
export class TrainerListComponent implements OnInit {
  trainers: Trainer[] = [];

  constructor(private trainerService: TrainerService) {}

  ngOnInit(): void {
    this.trainerService.getTrainers().subscribe(trainers => this.trainers = trainers);
  }

  deleteTrainer(id: string) {
    if (confirm('Delete trainer?')) {
      this.trainerService.deleteTrainer(id).subscribe(() => {
        this.trainers = this.trainers.filter(t => t.id !== id);
      });
    }
  }
}
