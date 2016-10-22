import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';


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
