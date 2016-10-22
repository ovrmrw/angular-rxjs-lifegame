import 'babel-polyfill';
import 'zone.js/dist/zone-node';
import { Subject, BehaviorSubject, Observable } from 'rxjs/Rx';
import * as lodash from 'lodash';
declare const Zone: any;


/////////////////////// PREPARE ///////////////////////
class Dispatcher<T> extends Subject<T>{
  constructor() { super() }
}

interface Position {
  x: number
  y: number
}

interface LifeState {
  x: number
  y: number
  live: boolean
}


/////////////////////// ACTION /////////////////////// 
class AliveAction {
  constructor(public positions: Position[]) { }
}
class NextAction {
  constructor() { }
}
type Action = AliveAction | NextAction;


/////////////////////// LIFE ///////////////////////
class Life implements LifeState {
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


/////////////////////// LIFE CONTAINER ///////////////////////
class LifeContainer {
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


/////////////////////// MAIN ///////////////////////
Zone.current.fork({ name: 'myZone' }).runGuarded(() => {

  const lifeContainer = new LifeContainer(5, 5);

  const dispatcher$ = new Dispatcher<Action>();
  const provider$ = new BehaviorSubject<LifeState[]>(lifeContainer.getLifes());


  dispatcher$
    .scan<LifeContainer>((container, action) => {
      if (action instanceof AliveAction) {
        action.positions.forEach(position => container.vitalize(position))
        return container
      } else if (action instanceof NextAction) {
        container.tickLifeCycle()
        return container
      } else {
        return container
      }
    }, lifeContainer)
    .map<LifeState[]>(container => {
      const lifes = container.getLifes().map(life => lodash.pick(life, ['x', 'y', 'live']) as LifeState)
      return lodash.cloneDeep(lifes)
    })
    .subscribe(lifes => {
      provider$.next(lifes)
    })


  provider$
    .subscribe(lifes => {
      console.log(lifes)
    })


  dispatcher$.next(new AliveAction([{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 99, y: 99 }]));
  console.time('NextActions')
  lodash.range(0, 9).forEach(() => {
    dispatcher$.next(new NextAction());
  })
  console.timeEnd('NextActions')

});
