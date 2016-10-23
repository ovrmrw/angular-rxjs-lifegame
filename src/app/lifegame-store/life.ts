import { LifeState } from './types';


export class Life implements LifeState {
  nextAliveState: number;

  constructor(
    public alive: number = 0,
  ) { }

}
