import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Grade } from '../models/grade.model';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  Firestore,
  query,
  where
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private db: Firestore;
  private gradesCollection = 'grades';

  constructor(private firebaseService: FirebaseService) {
    this.db = this.firebaseService.getFirestore();
  }

  // Get all grades
  getGrades(): Observable<Grade[]> {
    const gradesRef = collection(this.db, this.gradesCollection);
    return from(getDocs(gradesRef)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data } as Grade;
        });
      })
    );
  }

  // Get grades by student ID
  getGradesByStudent(studentId: string): Observable<Grade[]> {
    const gradesRef = collection(this.db, this.gradesCollection);
    const q = query(gradesRef, where('studentId', '==', studentId));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data } as Grade;
        });
      })
    );
  }

  // Get grades by subject ID
  getGradesBySubject(subjectId: string): Observable<Grade[]> {
    const gradesRef = collection(this.db, this.gradesCollection);
    const q = query(gradesRef, where('subjectId', '==', subjectId));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data } as Grade;
        });
      })
    );
  }

  // Get a grade by ID
  getGrade(id: string): Observable<Grade | null> {
    const gradeRef = doc(this.db, this.gradesCollection, id);
    return from(getDoc(gradeRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          return { id: docSnap.id, ...data } as Grade;
        } else {
          return null;
        }
      })
    );
  }

  // Add a new grade
  addGrade(grade: Grade): Observable<string> {
    const gradesRef = collection(this.db, this.gradesCollection);
    return from(addDoc(gradesRef, grade)).pipe(
      map(docRef => docRef.id)
    );
  }

  // Update a grade
  updateGrade(id: string, grade: Partial<Grade>): Observable<void> {
    const gradeRef = doc(this.db, this.gradesCollection, id);
    return from(updateDoc(gradeRef, grade as any));
  }

  // Delete a grade
  deleteGrade(id: string): Observable<void> {
    const gradeRef = doc(this.db, this.gradesCollection, id);
    return from(deleteDoc(gradeRef));
  }
}