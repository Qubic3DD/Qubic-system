import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type AssignmentEvent = {
  action: 'assign' | 'unassign';
  driverId?: number;
  deviceId?: string;
};

@Injectable({ providedIn: 'root' })
export class AssignmentEventsService {
  private subject = new Subject<AssignmentEvent>();

  emit(event: AssignmentEvent): void {
    this.subject.next(event);
  }

  get events$(): Observable<AssignmentEvent> {
    return this.subject.asObservable();
  }
}


