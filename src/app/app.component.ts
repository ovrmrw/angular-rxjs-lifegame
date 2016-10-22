import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { AppService } from './app.service';
import { Store, LifeState } from './lifegame-store';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{title}}</h1>
    <div><button (click)="nextCycle()">Next</button></div>
    <div>{{lifes | json}}</div>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'app works!';
  lifes: LifeState[];

  constructor(
    private service: AppService,
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {
    this.service.aliveAction(0, 1);
    this.service.aliveAction(1, 1);
    this.service.aliveAction(2, 1);
    this.service.aliveAction(5, 1);
    this.service.aliveAction(6, 2);
    this.service.aliveAction(7, 3);
    this.service.aliveAction(6, 3);
    this.service.aliveAction(5, 2);

    this.store.getState().subscribe(lifes => {
      this.lifes = lifes;
      this.cd.markForCheck();
      console.log('next');
      requestAnimationFrame(() => this.service.nextAction());
    });
  }

  nextCycle(): void {
    this.service.nextAction();
  }

}
