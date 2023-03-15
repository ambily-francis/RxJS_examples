import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  buffer,
  interval, map,
  mergeMap,
  Subject,
  Subscription,
  takeUntil,
  toArray,
  window, windowCount, windowTime, windowToggle, windowWhen
} from 'rxjs';

@Component({
  selector: 'app-transformations',
  templateUrl: './transformations.component.html',
  styleUrls: ['./transformations.component.scss']
})
export class TransformationsComponent implements OnDestroy, OnInit{
  _onDestroy = new Subject();
  arr: any[] = [];
  sum: number| undefined;
  heading: string='';
  show:boolean= false;
  showStatics:boolean=false;
  sub?: Subscription;

  ngOnInit() {
    this.arr = [];
  }

  bufferFn(){
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.reset();
    this.arr.length = 0;
    this.heading ='Output for buffer operator';
    this.show = true;
    let source1$ = interval(500);
    this.sub =source1$.pipe(takeUntil(this._onDestroy),buffer(interval(1000))).subscribe(data=>
    {
      this.arr = [...this.arr, [...data]]
    });

  }
  windowFn() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.reset();
    this.arr.length = 0;
    this.heading ='Output for window operator';
    this.show = true;
    let  source1$ = interval(1000).pipe(
      map(i => String.fromCharCode(97 + (i % 26)))
    );
    this.sub= source1$
      .pipe(
        window(interval(2000)),
        mergeMap(window => window.pipe(toArray()))
      )
      .subscribe(data => {
        this.arr = [...this.arr, [...data]];
      });
  }

  windowTimeFn(){
    if (this.sub) {
      this.sub.unsubscribe();

    }
    this.reset();
    this.arr.length = 0;
    this.heading ='Output for window Time operator';
    this.show = true;
    let source1$ = interval(500);
    this.sub = source1$.pipe(takeUntil(this._onDestroy),windowTime(1000),mergeMap((val: any)=> val.pipe(toArray())))
      .subscribe((data: any)=>{
        this.arr = [...this.arr, [...data]];
      });
  }

  windowToggleFn(){
    if (this.sub) {
      this.sub.unsubscribe();

    }
    this.reset();
    this.arr.length = 0;
    this.heading ='Output for window Toggle operator';
    this.show = true;
    let source1$ = interval(500);
    this.sub= source1$.pipe(windowToggle(interval(1000),()=>interval(2000)),
      mergeMap((val)=> val.pipe(toArray()))).subscribe(data=>{
      this.arr = [...this.arr, [...data]];
    });
  }
  windowCountFn(){
    if (this.sub) {
      this.sub.unsubscribe();

    }
    this.reset();
    this.arr.length = 0;
    this.heading ='Output for window Count operator';
    this.show = true;
    this.showStatics=true;
    let source1$ = interval(500);
    this.sub= source1$.pipe(windowCount(3),mergeMap(val=> val.pipe(toArray())))
      .subscribe(data=>{
        this.sum= this.totalFn(data);
        this.arr.push(this.sum);
      });
  }

  windowWhenFn(){
    if (this.sub) {
      this.sub.unsubscribe();

    }
    this.reset();
    this.arr.length = 0;
    this.heading ='Output for window When operator';
    this.show = true;
    let source1$ = interval(500);
    this.sub= source1$.pipe(windowWhen(()=>interval(2000)),
      mergeMap((val)=> val.pipe(toArray()))).subscribe(data=>{
      this.arr = [...this.arr, [...data]];
    });

  }
  totalFn(arr: any){
    if(!Array.isArray(arr)) return;
    let sum=0;
    arr.forEach(each => {
      sum+=each;
    });
    return sum;
  }

  reset(){
    this.arr.length = 0;
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.showStatics=false;

  }
  ngOnDestroy(){
    this._onDestroy.next(true);
    this._onDestroy.next(null);
    this._onDestroy.unsubscribe();
  }
}
