import { NgModule } from '@angular/core';

import { Dispatcher } from './common';
import { Store } from './store';
import { LifeContainer } from './life-container';


@NgModule({
  providers: [Dispatcher, Store,
    { provide: LifeContainer, useValue: new LifeContainer(10, 10) }
  ],
})
export class StoreModule { }
