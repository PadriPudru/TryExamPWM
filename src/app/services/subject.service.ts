import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Subject } from '../models/subject.model';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  Firestore 
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private db: Firestore;
  private subjectsCollection = 'subjects';

  constructor(private firebaseService: FirebaseService) {
    this.db = this.firebaseService.getFirestore();
  }

  // Get all subjects
  getSubjects(): Observable<Subject[]> {
    const subjectsRef = collection(this.db, this.subjectsCollection);
    return from(getDocs(subjectsRef)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data } as Subject;
        });
      })
    );
  }

  // Get a subject by ID
  getSubject(id: string): Observable<Subject | null> {
    const subjectRef = doc(this.db, this.subjectsCollection, id);
    return from(getDoc(subjectRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          return { id: docSnap.id, ...data } as Subject;
        } else {
          return null;
        }
      })
    );
  }

  // Add a new subject
  addSubject(subject: Subject): Observable<string> {
    const subjectsRef = collection(this.db, this.subjectsCollection);
    return from(addDoc(subjectsRef, subject)).pipe(
      map(docRef => docRef.id)
    );
  }

  // Update a subject
  updateSubject(id: string, subject: Partial<Subject>): Observable<void> {
    const subjectRef = doc(this.db, this.subjectsCollection, id);
    return from(updateDoc(subjectRef, subject as any));
  }

  // Delete a subject
  deleteSubject(id: string): Observable<void> {
    const subjectRef = doc(this.db, this.subjectsCollection, id);
    return from(deleteDoc(subjectRef));
  }
}