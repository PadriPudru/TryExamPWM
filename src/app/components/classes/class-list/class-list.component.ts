import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClassService } from '../../../services/class.service';
import { GymClass } from '../../../models/class.model';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.css'
})
export class ClassListComponent implements OnInit {
  classes: GymClass[] = [];

  constructor(private classService: ClassService) {}

  ngOnInit(): void {
    this.classService.getClasses().subscribe(data => this.classes = data);
  }

  deleteClass(id: string): void {
    if (confirm('Delete class?')) {
      this.classService.deleteClass(id).subscribe(() => {
        this.classes = this.classes.filter(c => c.id !== id);
      });
    }
  }
}
