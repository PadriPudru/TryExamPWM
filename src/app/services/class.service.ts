import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { GymClass } from '../models/class.model';

@Injectable({ providedIn: 'root' })
export class ClassService {
  private collection = 'classes';

  constructor(private firebaseService: FirebaseService) {}

  getClasses() {
    return this.firebaseService.getCollection<GymClass>(this.collection);
  }

  getClass(id: string) {
    return this.firebaseService.getDocument<GymClass>(this.collection, id);
  }

  addClass(data: GymClass) {
    return this.firebaseService.addDocument<GymClass>(this.collection, data);
  }

  updateClass(id: string, data: GymClass) {
    return this.firebaseService.updateDocument<GymClass>(this.collection, id, data);
  }

  deleteClass(id: string) {
    return this.firebaseService.deleteDocument(this.collection, id);
  }
}
