import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Trainer } from '../models/trainer.model';

@Injectable({ providedIn: 'root' })
export class TrainerService {
  private collection = 'trainers';

  constructor(private firebaseService: FirebaseService) {}

  getTrainers() {
    return this.firebaseService.getCollection<Trainer>(this.collection);
  }

  getTrainer(id: string) {
    return this.firebaseService.getDocument<Trainer>(this.collection, id);
  }

  addTrainer(data: Trainer) {
    return this.firebaseService.addDocument<Trainer>(this.collection, data);
  }

  updateTrainer(id: string, data: Trainer) {
    return this.firebaseService.updateDocument<Trainer>(this.collection, id, data);
  }

  deleteTrainer(id: string) {
    return this.firebaseService.deleteDocument(this.collection, id);
  }
}
