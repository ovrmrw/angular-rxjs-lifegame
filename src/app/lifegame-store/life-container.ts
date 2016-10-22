import { Injectable } from '@angular/core';
import * as lodash from 'lodash';

import { Life } from './life';
import { Position } from './types';


@Injectable()
export class LifeContainer {
  private lifes: Life[]

  constructor(xCount: number, yCount: number) {
    this.lifes = []
    const xRange = lodash.range(0, xCount)
    const yRange = lodash.range(0, yCount)
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
