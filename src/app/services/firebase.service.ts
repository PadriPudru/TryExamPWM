import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  constructor() { }

  getFirestore() {
    return this.db;
  }
}