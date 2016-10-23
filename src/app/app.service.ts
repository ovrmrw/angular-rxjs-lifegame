import { Injectable, Inject } from '@angular/core';

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

    for (let x = 0; x < this.xLength; x = (x + 1) | 0) {
      for (let y = 0; y < this.yLength; y = (y + 1) | 0) {
        if (Math.random() > 0.75) {
          positions.push({ x, y });
        }
      }
    }
    this.dispatcher$.next(new AliveAction(positions));
  }


  nextAction(): void {
    this.dispatcher$.next(new NextAction());
  }

}
