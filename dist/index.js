"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function BatchAction() {
    return function BatchActionMarker(constructor) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.isBatchAction = true;
                return _this;
            }
            return class_1;
        }(constructor));
    };
}
exports.BatchAction = BatchAction;
function enableBatchReducer(reduce) {
    return function batchReducer(state, action) {
        if (action['isBatchAction']) {
            var batchActions = action['payload'];
            return batchActions.reduce(batchReducer, state);
        }
        else {
            return reduce(state, action);
        }
    };
}
exports.enableBatchReducer = enableBatchReducer;
