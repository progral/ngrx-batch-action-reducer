import { ActionReducer, Action } from "@ngrx/store";

interface BatchActionType extends Action {
    payload: Array<any>;
}

export function BatchAction() {
    return function BatchActionMarker<T extends { new(...args: any[]): BatchActionType }>(constructor: T) {
        return class extends constructor {
            private isBatchAction: boolean = true;
        }
    }
}

export function enableBatchReducer<S>(reduce: ActionReducer<S>): ActionReducer<S> {
    return function batchReducer(state: S, action: Action): S {
        if (action['isBatchAction']) {
            let batchActions = action['payload'];
            return batchActions.reduce(batchReducer, state);
        } else {
            return reduce(state, action);
        }
    };
}
