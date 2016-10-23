import { Inject, Injectable, NgZone } from '@angular/core';

import { Life } from './life';
import { Position, X_LENGTH, Y_LENGTH } from './types';


@Injectable()
export class LifeContainer {
  private lifes: Life[][];

  constructor(
    private zone: NgZone,
    @Inject(X_LENGTH) private xLength: number,
    @Inject(Y_LENGTH) private yLength: number,
  ) {
    this.lifes = [];

    for (let x = 0; x < xLength; x = (x + 1) | 0) {
      const innerLifes: Life[] = [];
      for (let y = 0; y < yLength; y = (y + 1) | 0) {
        innerLifes.push(new Life());
      }
      this.lifes.push(innerLifes);
    }
  }


  turnAlive(position: Position): void {
    this.lifes[position.x][position.y].alive = 1;
  }


  tickLifeCycle(): void {
    this.zone.runOutsideAngular(() => {
      for (let x = 0; x < this.xLength; x = (x + 1) | 0) {
        for (let y = 0; y < this.yLength; y = (y + 1) | 0) {
          const life = this.lifes[x][y];

          const left = y > 0 ? this.lifes[x][y - 1].alive : 0;
          const right = y < this.yLength - 1 ? this.lifes[x][y + 1].alive : 0;

          const leftTop = x > 0 && y > 0 ? this.lifes[x - 1][y - 1].alive : 0;
          const centerTop = x > 0 ? this.lifes[x - 1][y].alive : 0;
          const rightTop = x > 0 && y < this.yLength - 1 ? this.lifes[x - 1][y + 1].alive : 0;

          const leftBottom = x < this.xLength - 1 && y > 0 ? this.lifes[x + 1][y - 1].alive : 0;
          const centerBottom = x < this.xLength - 1 ? this.lifes[x + 1][y].alive : 0;
          const rightBottom = x < this.xLength - 1 && y < this.yLength - 1 ? this.lifes[x + 1][y + 1].alive : 0;

          const aliveCount = [left, right, leftTop, centerTop, rightTop, leftBottom, centerBottom, rightBottom]
            .reduce((p, value) => p + value);

          if (!life.alive && aliveCount === 3) { // birth
            life.nextAliveState = 1;
          } else if (life.alive && aliveCount > 1 && aliveCount < 4) { // alive
            life.nextAliveState = 1;
          } else { // dead
            life.nextAliveState = 0;
          }
        }
      }

      for (let x = 0; x < this.xLength; x = (x + 1) | 0) {
        for (let y = 0; y < this.yLength; y = (y + 1) | 0) {
          const life = this.lifes[x][y];
          life.alive = life.nextAliveState;
        }
      }
    });
  }


  getLifes(): Life[][] {
    return this.lifes;
  }

}
