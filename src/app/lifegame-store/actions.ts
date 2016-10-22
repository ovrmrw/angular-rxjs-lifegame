import { Position } from './types';


export class AliveAction {
  constructor(public positions: Position[]) { }
}

export class NextAction {
  constructor() { }
}


export type Action = AliveAction | NextAction;
