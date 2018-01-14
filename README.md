# Do not use it yet - this is in pre-alpha (14.01.2018)
# Batch Action Reducer for ngrx

## Why?

Sometimes you have many actions which are fired at same time. Imagine an action **LOAD_PRODUCT**. After the product is loaded successfully you would like to add the data into some normalized entities states. E.g. products (for price and productNumber) and productImages (for url and caption), productAttributes, productTags, etc. You do not want to reinvent the wheel, so you use the actions given by the entities branches and dispatch it to store one for one. E.g. `ADD_TO_PRODUCTS`, `ADD_TO_PRODUCTS_IMAGES`, `ADD_TO_PRODUCTS_ATTRIBUTES`, and perhaps many more. This can be very ugly in your redux dev tools, the state is recalculated after every dispatch and your selectors are running hot. A better way would be, if you could dispatch one action and this action fires all the sub actions internally without dispatching this many actions publicly.

## What it does
Batch Action Reducer for ngrx is a little module with two parts. An decorator which marks an action as a batch action and a metareducer which react on this marked actions.

## How to use

### 1. Install it
```
npm install --save ngrx-batch-action-reducer
```

### 2. Register enableBatchReducer as metareducer

Before you can use an batch action you have to register the metareducer for it which handles the batch actions for you.

Here is an example with ngrx-store-freeze included

```typescript
import {enableBatchReducer} from 'ngrx-batch-action-reducer'

export const metaReducers: MetaReducer<AppState>[] = !environment.production ?
[storeFreeze, enableBatchReducer] :
[enableBatchReducer];

@NgModule({
     ...
     imports: [
         ....
         StoreModule.forRoot(appReducer, { metaReducers }),
     ]
 ...
})
```

### 3. Create your batch action class

First you have to create your action which will "include" all the actions which will be fire at once. To mark it as a batch action you must decorate it with `@BatchAction()`. Your payload will be a tuple of the actions. The order given in this tupel will be the order for firing the actions one after one internally. If FooAction depends on BarAction you should set in your tuple first.


```typescript
import { Action } from '@ngrx/store';
import { BatchAction } from 'ngrx-batch-action-reducer';

export const FOO = 'Foo';
export const BAR = 'Bar';
export const MULTI = 'Multi';

export class FooAction implements Action {
    readonly type = FOO;
}

export class BarAction implements Action {
    readonly type = BAR;
    constructor(payload: {somePayload: number}) {}
}

@BatchAction() //<-- this is our batch action
export class MultiAction implements Action {
    readonly type = MULTI;
    constructor(payload: [
        FooAction, 
        BarAction,
        //place more actions here
    ]) {}
}

```

### 4. Use your batch action
```typescript
//somewhere in you code

this.store.dispatch(new MultiAction([
    new FooAction(), 
    new BarACtion({somePayload: 5}),
    //place more actions here
]))
```

You can use it in your effects as well.

```typescript
@Effect() makeMulti$: Observable<MultiAction> = this.actions$.ofType(SOMETHING_HAPPEND)
    .mergeMap((action: SomethingHappenedAction) => {
        let someData = action.payload.data;

        return Observable.of(new MultiAction(
            new FooAction(),
            new BarAction({somePayload: 5}),
            //place more actions here
        ]))
    })

```

## What next?

This is my very first module I have created. I guess there are some things which can be done better. Discussions and PRs are welcome.

## Credits
The idea is discussed here [ngrx issue #468](https://github.com/ngrx/platform/issues/468). Another solution is batch-actions-helper which can be found here [batch-actions-helper](https://gitlab.com/linagora/petals-cockpit/blob/master/frontend/src/app/shared/helpers/batch-actions.helper.ts).
