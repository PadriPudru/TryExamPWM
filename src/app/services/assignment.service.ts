import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Assignment } from '../models/assignment.model';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private collection = 'assignments';

  constructor(private firebaseService: FirebaseService) {}

  getAssignments() {
    return this.firebaseService.getCollection<Assignment>(this.collection);
  }

  getAssignment(id: string) {
    return this.firebaseService.getDocument<Assignment>(this.collection, id);
  }

  addAssignment(data: Assignment) {
    return this.firebaseService.addDocument<Assignment>(this.collection, data);
  }

  updateAssignment(id: string, data: Assignment) {
    return this.firebaseService.updateDocument<Assignment>(this.collection, id, data);
  }

  deleteAssignment(id: string) {
    return this.firebaseService.deleteDocument(this.collection, id);
  }
}
