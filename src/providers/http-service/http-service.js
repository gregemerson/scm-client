var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Authenticator } from '../authenticator/authenticator';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
export var HttpService = (function (_super) {
    __extends(HttpService, _super);
    function HttpService(http) {
        var _this = this;
        _super.call(this, function (subscriber) {
            var key = Math.random().toString();
            _this.subscribers[key] = subscriber;
            return new HttpServiceErrorSubscription(function () {
                delete _this.subscribers[key];
            });
        });
        this.http = http;
        this.subscribers = {};
    }
    Object.defineProperty(HttpService, "ClientsCollection", {
        get: function () { return '/api/Clients/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpService, "ExerciseSetCollection", {
        get: function () { return '/api/ExerciseSets/'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpService, "ExerciseCollection", {
        get: function () { return '/api/Exercises/'; },
        enumerable: true,
        configurable: true
    });
    HttpService.exerciseSetExercises = function (exerciseSetId) {
        return '/api/ExerciseSets/' + exerciseSetId.toString() + '/exercises';
    };
    HttpService.createdExercises = function (exerciseSetId) {
        return '/api/ExerciseSets/' + exerciseSetId.toString() + '/createdExercises';
    };
    HttpService.exercise = function (exerciseId) {
        return '/api/Exercises/' + exerciseId.toString();
    };
    HttpService.userSettings = function (userId) {
        return 'api/Clients/' + userId.toString() + '/userSettings';
    };
    HttpService.exerciseSetExercise = function (exerciseSetId, exerciseId) {
        return 'api/ExerciseSets/' + exerciseSetId.toString() + '/exercises/' + exerciseId.toString();
    };
    HttpService.clientExerciseSets = function (clientId) {
        return 'api/Clients/' + clientId.toString() + '/exerciseSets';
    };
    HttpService.clientExerciseSet = function (clientId, exerciseSetId) {
        return 'api/Clients/' + clientId.toString() + '/exerciseSets/' + exerciseSetId;
    };
    HttpService.logout = function () {
        return 'api/Clients/logout';
    };
    HttpService.removeExerciseSet = function (clientId, exerciseSetId) {
        return 'api/Clients/' + clientId.toString() + '/exerciseSets/rel/' + exerciseSetId;
    };
    HttpService.shareExerciseSet = function (clientId) {
        return 'api/Clients/' + clientId.toString() + '/sharedExerciseSets';
    };
    HttpService.prototype.postPersistedObject = function (url, data, requestOptions) {
        var _this = this;
        if (requestOptions === void 0) { requestOptions = Authenticator.newRequestOptions(); }
        return this.http.post(url, data, requestOptions)
            .map(function (response) { return _this.processResponse(response); });
    };
    HttpService.prototype.putPersistedObject = function (url, data, requestOptions) {
        var _this = this;
        if (requestOptions === void 0) { requestOptions = Authenticator.newRequestOptions(); }
        return this.http.put(url, data, requestOptions)
            .map(function (response) { return _this.processResponse(response); });
    };
    HttpService.prototype.getPersistedObject = function (url, requestOptions) {
        var _this = this;
        if (requestOptions === void 0) { requestOptions = Authenticator.newRequestOptions(); }
        return this.http.get(url, requestOptions)
            .map(function (response) { return _this.processResponse(response); });
    };
    HttpService.prototype.deletePersistedObject = function (url, requestOptions) {
        var _this = this;
        if (requestOptions === void 0) { requestOptions = Authenticator.newRequestOptions(); }
        return this.http.delete(url, requestOptions)
            .map(function (response) { return _this.processResponse(response); });
    };
    HttpService.prototype.processResponse = function (response) {
        var obj;
        var errors = [];
        try {
            obj = response.json();
            errors = this.parseForErrors(obj);
        }
        catch (err) {
            // Nothing to do..
            return new PersistedObject();
        }
        if (errors.length > 0) {
            throw errors;
        }
        return obj;
    };
    HttpService.prototype.handleError = function (error) {
        var errMsg = error.message ? error.message : 'Server error';
        console.log(errMsg); // log to console instead
        return Observable.throw(errMsg);
    };
    // @todo Need to check for status 200
    HttpService.prototype.parseForErrors = function (obj) {
        var errors = [];
        if (!obj.hasOwnProperty('error')) {
            return [];
        }
        var error = obj['error'];
        if (error.hasOwnProperty('code')) {
            var code = error['code'];
            for (var globalCode in HttpService.globalErrorCodes) {
                if (globalCode == code) {
                    errors.push({
                        code: globalCode,
                        message: HttpService.globalErrorCodes[code]
                    });
                    for (var id in this.subscribers) {
                        if (!this.subscribers[id]) {
                            this.subscribers[id].next(errors);
                        }
                    }
                    return errors;
                }
            }
        }
        // Do generic error parsing here
        if (error.hasOwnProperty('details') && error['details'].
            hasOwnProperty('messages')) {
            var messages = error['details']['messages'];
            for (var key in messages) {
                errors.push({
                    code: key,
                    message: messages[key]
                });
            }
        }
        else {
            errors.push({
                code: 'Unknown',
                message: error['error'].toString()
            });
        }
        return errors;
    };
    HttpService.globalErrorCodes = {
        INVALID_TOKEN: 'Your session has expired, please re-log in.',
        AUTHORIZATION_REQUIRED: 'Unauthorized access attempt.'
    };
    HttpService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http])
    ], HttpService);
    return HttpService;
}(Observable));
var HttpServiceErrorSubscription = (function (_super) {
    __extends(HttpServiceErrorSubscription, _super);
    function HttpServiceErrorSubscription(unsubsribe) {
        _super.call(this, function () {
            unsubsribe();
        });
    }
    return HttpServiceErrorSubscription;
}(Subscription));
export var HttpServiceError = (function () {
    function HttpServiceError() {
    }
    return HttpServiceError;
}());
export var PersistedObject = (function (_super) {
    __extends(PersistedObject, _super);
    function PersistedObject() {
        _super.apply(this, arguments);
    }
    return PersistedObject;
}(Object));
//# sourceMappingURL=http-service.js.map