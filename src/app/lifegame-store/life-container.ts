import { Inject, Injectable } from '@angular/core';
import * as lodash from 'lodash';

import { Life } from './life';
import { Position, X_LENGTH, Y_LENGTH } from './types';


@Injectable()
export class LifeContainer {
  private lifes: Life[];

  constructor(
    @Inject(X_LENGTH) private xLength: number,
    @Inject(Y_LENGTH) private yLength: number,
  ) {
    this.lifes = [];

    lodash.range(0, xLength).forEach(x => {
      lodash.range(0, yLength).forEach(y => {
        this.addLife(new Life(x, y));
      });
    });
  }


  addLife(life: Life): void {
    this.lifes.push(life);
  }


  vitalize(position: Position): void {
    this.lifes
      .filter(life => life.x === position.x && life.y === position.y)
      .map(life => life.live = true);
  }


  tickLifeCycle(): void {
    this.lifes.forEach(life => {
      const aliveLifeCount = life.arounds.reduce((p, position) => {
        const targetLife = this.select(position);
        return targetLife && targetLife.live ? p + 1 : p;
      }, 0)
      life.calculateNextLiveState(aliveLifeCount)
    })

    this.lifes.forEach(life => life.forwardLifeCycle())
  }


  getLifes(): Life[] {
    return this.lifes;
  }


  select(position: Position): Life | undefined {
    return this.lifes.find(life => life.x === position.x && life.y === position.y);
  }

}
