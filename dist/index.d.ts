import { ActionReducer, Action } from "@ngrx/store";
export interface BatchActionType extends Action {
    payload: Array<any>;
}
export declare function BatchAction(): <T extends new (...args: any[]) => BatchActionType>(constructor: T) => {
    new (...args: any[]): {
        isBatchAction: boolean;
        payload: any[];
        type: string;
    };
} & T;
export declare function enableBatchReducer<S>(reduce: ActionReducer<S>): ActionReducer<S>;
