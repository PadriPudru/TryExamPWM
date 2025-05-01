import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Student } from '../models/student.model';
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
export class StudentService {
  private db: Firestore;
  private studentsCollection = 'students';

  constructor(private firebaseService: FirebaseService) {
    this.db = this.firebaseService.getFirestore();
  }

  // Get all students
  getStudents(): Observable<Student[]> {
    const studentsRef = collection(this.db, this.studentsCollection);
    return from(getDocs(studentsRef)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data } as Student;
        });
      })
    );
  }

  // Get a student by ID
  getStudent(id: string): Observable<Student | null> {
    const studentRef = doc(this.db, this.studentsCollection, id);
    return from(getDoc(studentRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          return { id: docSnap.id, ...data } as Student;
        } else {
          return null;
        }
      })
    );
  }

  // Add a new student
  addStudent(student: Student): Observable<string> {
    const studentsRef = collection(this.db, this.studentsCollection);
    return from(addDoc(studentsRef, student)).pipe(
      map(docRef => docRef.id)
    );
  }

  // Update a student
  updateStudent(id: string, student: Partial<Student>): Observable<void> {
    const studentRef = doc(this.db, this.studentsCollection, id);
    return from(updateDoc(studentRef, student as any));
  }

  // Delete a student
  deleteStudent(id: string): Observable<void> {
    const studentRef = doc(this.db, this.studentsCollection, id);
    return from(deleteDoc(studentRef));
  }
}