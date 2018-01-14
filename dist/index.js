export function BatchAction() {
    return function BatchActionMarker(constructor) {
        return class extends constructor {
            constructor() {
                super(...arguments);
                this.isBatchAction = true;
            }
        };
    };
}
export function enableBatchReducer(reduce) {
    return function batchReducer(state, action) {
        if (action['isBatchAction']) {
            let batchActions = action['payload'];
            return batchActions.reduce(batchReducer, state);
        }
        else {
            return reduce(state, action);
        }
    };
}
