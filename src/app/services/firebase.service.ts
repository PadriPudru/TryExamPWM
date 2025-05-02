import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  getCollection<T>(path: string): Observable<T[]> {
    const ref = collection(this.firestore, path);
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  getDocument<T>(path: string, id: string): Observable<T> {
    const ref = doc(this.firestore, path, id);
    return docData(ref, { idField: 'id' }) as Observable<T>;
  }

  addDocument<T extends { [key: string]: any }>(path: string, data: T): Observable<any> {
    const ref = collection(this.firestore, path);
    return from(addDoc(ref, data));
  }

  updateDocument<T extends { [key: string]: any }>(path: string, id: string, data: T): Observable<void> {
    const ref = doc(this.firestore, path, id);
    return from(updateDoc(ref, { ...data }));
  }

  deleteDocument(path: string, id: string): Observable<void> {
    const ref = doc(this.firestore, path, id);
    return from(deleteDoc(ref));
  }
}
