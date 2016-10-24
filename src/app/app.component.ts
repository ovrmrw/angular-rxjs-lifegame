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
    <div>generation counter: {{counter}}</div>
    <div>FPS: {{fps}}</div>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = `Life Game (${this.xLength}x${this.yLength})`;
  counter: number = 0;
  xRange: number[];
  yRange: number[];
  lifes: LifeState[][];
  startTime: number;
  fps: string;

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
    this.service.initializeLifes();

    this.startTime = new Date().valueOf();

    this.store.getState().subscribe(lifes => {
      this.lifes = lifes;
      this.counter = this.counter + 1;
      this.fps = (this.counter / (new Date().valueOf() - this.startTime) * 1000).toFixed(2);
      this.cd.markForCheck();
      requestAnimationFrame(() => this.service.forwardLifesGeneration());
    });
  }

}
