import { OpaqueToken } from '@angular/core';


export const X_LENGTH = new OpaqueToken('X_LENGTH');
export const Y_LENGTH = new OpaqueToken('Y_LENGTH');


export interface Position {
  x: number;
  y: number;
}

export interface LifeState {
  alive: number;
}
