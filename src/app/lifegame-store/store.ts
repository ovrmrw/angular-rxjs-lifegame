import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import * as lodash from 'lodash';

import { Dispatcher, Provider } from './common';
import { Action, AliveAction, NextAction } from './actions';
import { LifeContainer } from './life-container';
import { LifeState, Position } from './types';


@Injectable()
export class Store {
  readonly provider$: Provider<LifeState[]>;

  constructor(
    private dispatcher$: Dispatcher<Action>,
    private lifeContainer: LifeContainer,
  ) {
    this.provider$ = new BehaviorSubject<LifeState[]>(lifeContainer.getLifes());
    this.createStore();
  }


  createStore() {
    this.dispatcher$
      .scan<LifeContainer>((container, action) => {
        if (action instanceof AliveAction) {
          action.positions.forEach(position => container.vitalize(position));
          return container;
        } else if (action instanceof NextAction) {
          container.tickLifeCycle();
          return container;
        } else {
          return container;
        }
      }, this.lifeContainer)
      .map<LifeState[]>(container => {
        const lifes = container.getLifes().map(life => lodash.pick(life, ['x', 'y', 'live']) as LifeState);
        return lodash.cloneDeep(lifes);
      })
      .subscribe(lifes => {
        this.provider$.next(lifes);
      });
  }


  getState(): Observable<LifeState[]> {
    return this.provider$;
  }

}
