var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";
export var BaseObservable = (function (_super) {
    __extends(BaseObservable, _super);
    function BaseObservable() {
        var _this = this;
        _super.call(this, function (subscriber) {
            var key = _this.getNewId();
            _this.subscribers[key] = subscriber;
            return new BaseObservableSubscription(function () {
                delete _this.subscribers[key];
            });
        });
        this.subscribers = {};
        this.subscriberId = 0;
    }
    BaseObservable.prototype.getNewId = function () {
        this.subscriberId += Number.MIN_VALUE;
        return this.subscriberId.toString();
    };
    return BaseObservable;
}(Observable));
export var BaseObservableSubscription = (function (_super) {
    __extends(BaseObservableSubscription, _super);
    function BaseObservableSubscription(remove) {
        _super.call(this, remove);
    }
    return BaseObservableSubscription;
}(Subscription));
//# sourceMappingURL=base-observable.js.map