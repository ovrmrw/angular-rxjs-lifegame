import { NgModule } from '@angular/core';

import { Dispatcher } from './common';
import { Store } from './store';
import { LifeContainer } from './life-container';
import { X_LENGTH, Y_LENGTH } from './types';


@NgModule({
  providers: [
    Dispatcher, Store, LifeContainer,
    { provide: X_LENGTH, useValue: 100 },
    { provide: Y_LENGTH, useValue: 100 },
  ],
})
export class StoreModule { }
