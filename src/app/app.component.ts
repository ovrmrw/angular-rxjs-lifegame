import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import * as lodash from 'lodash';

import { AppService } from './app.service';
import { Store, LifeState, X_LENGTH, Y_LENGTH } from './lifegame-store';


@Component({
  selector: 'app-root',
  template: `
    <h1>{{title}}</h1>    
    <div *ngFor="let x of xRange" class="row">
      <span *ngFor="let y of yRange" class="cell" [ngClass]="{'cell--active': !!lifes[x][y].alive}"></span> 
    </div>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = `Life Game (${this.xLength}x${this.yLength})`;
  xRange: number[];
  yRange: number[];
  lifes: LifeState[][];

  constructor(
    private service: AppService,
    private store: Store,
    private cd: ChangeDetectorRef,
    @Inject(X_LENGTH) private xLength: number,
    @Inject(Y_LENGTH) private yLength: number,
  ) {
    this.xRange = lodash.range(0, xLength);
    this.yRange = lodash.range(0, yLength);
  }


  ngOnInit() {
    this.service.initializeLifeContainer();

    this.store.getState().subscribe(lifes => {
      this.lifes = lifes;
      this.cd.markForCheck();
      requestAnimationFrame(() => this.service.nextAction());
    });
  }

}
