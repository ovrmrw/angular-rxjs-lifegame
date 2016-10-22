import { LifeState, Position } from './types';


export class Life implements LifeState {
  arounds: Position[]
  private nextLiveState: boolean

  constructor(
    public x: number,
    public y: number,
    public live: boolean = false,
  ) {
    this.arounds = this.generateArounds(x, y)
  }

  generateArounds(x: number, y: number): Position[] {
    const left = { x, y: y - 1 };
    const right = { x, y: y + 1 };
    const leftTop = Object.assign({}, left, { x: x - 1 });
    const centerTop = { x: x - 1, y };
    const rightTop = Object.assign({}, right, { x: x - 1 });
    const leftBottom = Object.assign({}, left, { x: x + 1 });
    const centerBottom = { x: x + 1, y };
    const rightBottom = Object.assign({}, right, { x: x + 1 });
    return [leftTop, centerTop, rightTop, left, right, leftBottom, centerBottom, rightBottom];
  }

  calculateNextLiveState(aliveLifeCount: number): void {
    if (!this.live && aliveLifeCount === 3) { // birth
      this.nextLiveState = true
    } else if (this.live && aliveLifeCount > 1 && aliveLifeCount < 4) { // alive
      this.nextLiveState = true
    } else { // dead
      this.nextLiveState = false
    }
  }

  forwardLifeCycle(): void {
    this.live = this.nextLiveState
  }
}
