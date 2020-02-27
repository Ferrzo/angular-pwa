import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  private connectionChanged$ = new Subject<boolean>();
  constructor() {
    addEventListener('offline', () => this.updateConnectionChanged());
    addEventListener('online', () => this.updateConnectionChanged());
  }

  get isOnline() {
    return !!navigator.onLine;
  }

  get connectionChanged() {
    return this.connectionChanged$.asObservable();
  }

  private updateConnectionChanged() {
    this.connectionChanged$.next(navigator.onLine);
  }
}
