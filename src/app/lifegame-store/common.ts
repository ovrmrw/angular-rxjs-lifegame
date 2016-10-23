import { Injectable, Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';


@Injectable()
export class Dispatcher<T> extends Subject<T> {
  next(action: T) { super.next(action); }
}


export class Provider<T> extends Subject<T> {
  next(state: T) { super.next(state); }
}


export class ReducerContainer<T> extends Observable<T> {
}


export interface StateReducer<T> {
  (state: T, dispatcher: Dispatcher<any>): Observable<T>;
}


export interface NonStateReducer<T> {
  (dispatcher: Dispatcher<any>): Observable<T>;
}


@Pipe({
  name: 'asyncState',
  pure: false
})
export class AsyncStatePipe<T> implements PipeTransform, OnDestroy {
  private subscription: Subscription;
  private latestValue: T | null = null;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  transform(observable: Observable<T>, debugMode: boolean = false): T | null {
    if (debugMode) { console.log('AsyncStatePipe: transform() is called.'); }
    if (!this.subscription) {
      /* should pass here only for the first-time. */
      this.subscription = observable
        .distinctUntilChanged()
        .subscribe(state => {
          this.latestValue = state;
          // this.cd.markForCheck();
          if (debugMode) { console.log('AsyncStatePipe: markForCheck() is called.'); }
        }, err => {
          console.error('Error from AsyncStatePipe:', err);
        });
      if (debugMode) { console.log('AsyncStatePipe: Subscription is created.', observable); }
    }
    return this.latestValue;
  }
}
