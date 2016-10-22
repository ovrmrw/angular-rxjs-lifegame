import { Injectable, Inject } from '@angular/core';
import * as lodash from 'lodash';

import { Dispatcher, Action, AliveAction, NextAction, Position, X_LENGTH, Y_LENGTH } from './lifegame-store';


@Injectable()
export class AppService {
  constructor(
    private dispatcher$: Dispatcher<Action>,
    @Inject(X_LENGTH) private xLength: number,
    @Inject(Y_LENGTH) private yLength: number,
  ) { }


  initializeLifeContainer(): void {
    const positions: Position[] = [];
    lodash.range(0, this.xLength).forEach(x => {
      lodash.range(0, this.yLength).forEach(y => {
        if (Math.random() < 0.3) {
          positions.push({ x, y });
        }
      });
    });
    this.dispatcher$.next(new AliveAction(positions));
  }

  nextAction(): void {
    this.dispatcher$.next(new NextAction());
  }

}
