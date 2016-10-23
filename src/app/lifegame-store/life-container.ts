import { Inject, Injectable, NgZone } from '@angular/core';
import * as lodash from 'lodash';

import { Life } from './life';
import { Position, X_LENGTH, Y_LENGTH } from './types';


@Injectable()
export class LifeContainer {
  private lifes: Life[];

  constructor(
    private zone: NgZone,
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
    // this.zone.runOutsideAngular(() => {
      // this.lifes.forEach(life => {
      //   const aliveLifeCount = life.arounds.reduce((p, position) => {
      //     const targetLife = this.select(position);
      //     return targetLife && targetLife.live ? p + 1 : p;
      //   }, 0);
      //   life.calculateNextLiveState(aliveLifeCount);
      // });
      for (let i = 0; i < this.lifes.length; i = (i + 1) | 0) {
        const life = this.lifes[i];
        let aliveLifeCount: number = 0;
        // const aliveLifeCount = life.arounds.reduce((p, position) => {
        //   const targetLife = this.select(position);
        //   return targetLife && targetLife.live ? p + 1 : p;
        // }, 0);
        for (let j = 0; j < life.arounds.length; j = (j + 1) | 0) {
          const targetLife = this.select(life.arounds[j]);
          if (targetLife && targetLife.live) {
            aliveLifeCount++;
          }
        }
        life.calculateNextLiveState(aliveLifeCount);
      }

      // this.lifes.forEach(life => life.forwardLifeCycle());
      for (let i = 0; i < this.lifes.length; i = (i + 1) | 0) {
        this.lifes[i].forwardLifeCycle();
      }
    // });
  }


  getLifes(): Life[] {
    return this.lifes;
  }


  select(position: Position): Life | undefined {
    // return this.lifes.find(life => life.x === position.x && life.y === position.y);
    for (let i = 0; i < this.lifes.length; i = (i + 1) | 0) {
      const life = this.lifes[i];
      if (life.x === position.x && life.y === position.y) {
        return life;
      }
    }
    return undefined;
  }

}
