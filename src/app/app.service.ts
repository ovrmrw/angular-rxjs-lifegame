import { Injectable } from '@angular/core';

import { Dispatcher, Action, AliveAction, NextAction } from './lifegame-store';


@Injectable()
export class AppService {
  constructor(
    private dispatcher$: Dispatcher<Action>,
  ) { }


  aliveAction(x: number, y: number): void {
    this.dispatcher$.next(new AliveAction([{ x, y }]));
  }

  nextAction(): void {
    this.dispatcher$.next(new NextAction());
  }

}
