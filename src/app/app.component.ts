import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as lodash from 'lodash';

import { AppService } from './app.service';
import { Store, LifeState, X_LENGTH, Y_LENGTH } from './lifegame-store';


@Component({
  selector: 'app-root',
  template: `
    <h1>{{title}}</h1>    
    <div *ngFor="let x of xRange" class="raw">
      <span *ngFor="let y of yRange" class="cell" [ngClass]="{'cell--active': getLife(x, y) | asyncState}"></span> 
    </div>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'Life Game';
  xRange: number[];
  yRange: number[];

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

    this.store.getState().subscribe(() => {
      requestAnimationFrame(() => {
        this.cd.markForCheck();
        this.service.nextAction();
      });
    });
  }


  getLife(x: number, y: number): Observable<boolean> {
    return this.store.getState()
      .map(lifes => lifes.find(life => life.x === x && life.y === y))
      .map(life => life ? life.live : false);
  }

}
