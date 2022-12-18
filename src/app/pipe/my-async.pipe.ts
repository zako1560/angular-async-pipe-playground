import {ChangeDetectorRef, EventEmitter, OnDestroy, Pipe, PipeTransform, ɵisPromise, ɵisSubscribable} from '@angular/core';
import {Observable, Subscribable, Unsubscribable} from 'rxjs';

import {invalidPipeArgumentError} from './invalid_pipe_argument_error';

interface SubscriptionStrategy {
  createSubscription(async: Subscribable<any>|Promise<any>, updateLatestValue: any): Unsubscribable
      |Promise<any>;
  dispose(subscription: Unsubscribable|Promise<any>): void;
}

class SubscribableStrategy implements SubscriptionStrategy {
  createSubscription(async: Subscribable<any>, updateLatestValue: any): Unsubscribable {
    return async.subscribe({
      next: updateLatestValue,
      error: (e: any) => {
        throw e;
      }
    });
  }

  dispose(subscription: Unsubscribable): void {
    subscription.unsubscribe();
  }
}

class PromiseStrategy implements SubscriptionStrategy {
  createSubscription(async: Promise<any>, updateLatestValue: (v: any) => any): Promise<any> {
    return async.then(updateLatestValue, e => {
      throw e;
    });
  }

  dispose(subscription: Promise<any>): void {}
}

const _promiseStrategy = new PromiseStrategy();
const _subscribableStrategy = new SubscribableStrategy();

@Pipe({
  name: 'myAsync',
  pure: false,
})
export class MyAsyncPipe implements OnDestroy, PipeTransform {

  private _ref: ChangeDetectorRef|null;
  private _latestValue: any = null;

  private _subscription: Unsubscribable|Promise<any>|null = null;
  private _obj: Subscribable<any>|Promise<any>|EventEmitter<any>|null = null;
  private _strategy: SubscriptionStrategy|null = null;

  constructor(ref: ChangeDetectorRef) {
    // Assign `ref` into `this._ref` manually instead of declaring `_ref` in the constructor
    // parameter list, as the type of `this._ref` includes `null` unlike the type of `ref`.
    this._ref = ref;
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._dispose();
    }
    // Clear the `ChangeDetectorRef` and its association with the view data, to mitigate
    // potential memory leaks in Observables that could otherwise cause the view data to
    // be retained.
    // https://github.com/angular/angular/issues/17624
    this._ref = null;
  }

  transform<T>(obj: Observable<T>|Subscribable<T>|Promise<T>|null|undefined): T|null {
    // block1
    if (!this._obj) {
      if (obj) {
        this._subscribe(obj);
      }
      this._log('block1')
      return this._latestValue;
    }

    // block2
    if (obj !== this._obj) {
      this._log('block2')
      this._dispose();
      return this.transform(obj);
    }

    // block3
    this._log('block3')
    return this._latestValue;
  }

  private _subscribe(obj: Subscribable<any>|Promise<any>|EventEmitter<any>): void {
    this._obj = obj;
    this._strategy = this._selectStrategy(obj);
    this._subscription = this._strategy.createSubscription(
        obj, (value: Object) => this._updateLatestValue(obj, value));
  }

  private _selectStrategy(obj: Subscribable<any>|Promise<any>|EventEmitter<any>): SubscriptionStrategy {
    if (ɵisPromise(obj)) {
      return _promiseStrategy;
    }

    if (ɵisSubscribable(obj)) {
      return _subscribableStrategy;
    }

    throw invalidPipeArgumentError(MyAsyncPipe, obj);
  }

  private _dispose(): void {
    // Note: `dispose` is only called if a subscription has been initialized before, indicating
    // that `this._strategy` is also available.
    this._strategy!.dispose(this._subscription!);
    this._latestValue = null;
    this._subscription = null;
    this._obj = null;
  }

  private _updateLatestValue(async: any, value: Object): void {
    if (async === this._obj) {
      this._latestValue = value;
      // Note: `this._ref` is only cleared in `ngOnDestroy` so is known to be available when a
      // value is being updated.
      this._ref!.markForCheck();
    }
  }

  private _log(block: string) {
    console.groupCollapsed(block);
    console.log('_obj', this._obj);
    console.log('_latestValue', this._latestValue);
    console.groupEnd();
  }

}
