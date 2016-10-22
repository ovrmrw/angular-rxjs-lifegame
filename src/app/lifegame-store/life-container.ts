import { Inject, Injectable } from '@angular/core';
import * as lodash from 'lodash';

import { Life } from './life';
import { Position, X_LENGTH, Y_LENGTH } from './types';


@Injectable()
export class LifeContainer {
  private lifes: Life[]

  constructor(
    @Inject(X_LENGTH) private xLength: number,
    @Inject(Y_LENGTH) private yLength: number,
  ) {
    this.lifes = []
    const xRange = lodash.range(0, xLength)
    const yRange = lodash.range(0, yLength)
    xRange.forEach(x => {
      yRange.forEach(y => {
        this.addLife(new Life(x, y))
      })
    })
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
        const targetLife = this.select(position.x, position.y)
        return targetLife && targetLife.live ? p + 1 : p
      }, 0)
      life.calculateNextLiveState(aliveLifeCount)
    })

    this.lifes.forEach(life => life.forwardLifeCycle())
  }

  getLifes(): Life[] {
    return this.lifes;
  }

  select(x: number, y: number): Life | undefined {
    return this.lifes.find(life => life.x === x && life.y === y)
  }
}
