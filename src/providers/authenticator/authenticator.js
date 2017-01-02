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
import { Http, Headers } from '@angular/http';
import { HttpService } from '../http-service/http-service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { BaseObservable } from '../../utilities/base-observable';
export var Authenticator = (function (_super) {
    __extends(Authenticator, _super);
    function Authenticator(http, httpService) {
        _super.call(this);
        this.http = http;
        this.httpService = httpService;
        this.guestToken = 'MCLXGi20lLDTXRBTWkiz7sbQXRx5qk8IPEcwTFBhlYPTDfG0WZDDAhjYHDuIaBEX';
        this.guestEmail = 'guest@guest.com';
        this.guestPassword = 'guest';
        this.guestUid = '57d5a393b1ba1b20289231e0';
        this.userLoadFilter = '?filter[include]=userSettings&filter[include]=exerciseSets';
        this._user = null;
    }
    Object.defineProperty(Authenticator.prototype, "user", {
        get: function () {
            return this._user;
        },
        enumerable: true,
        configurable: true
    });
    Authenticator.prototype.saveUserSettings = function () {
        return this.httpService.putPersistedObject(HttpService.
            userSettings(this.user.id), this.user.settings);
    };
    Authenticator.prototype.setUser = function (user) {
        if (this._user != null && this._user.id == user.id) {
            return;
        }
        this._user = user;
        for (var subscriberId in this.subscribers) {
            this.subscribers[subscriberId].next(user);
        }
    };
    Object.defineProperty(Authenticator.prototype, "token", {
        get: function () {
            return localStorage.getItem(Authenticator.tokenKey);
        },
        set: function (token) {
            localStorage.setItem(Authenticator.tokenKey, token);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Authenticator.prototype, "uid", {
        get: function () {
            var id = localStorage.getItem(Authenticator.uidKey);
            if (id != null) {
                return parseInt(id);
            }
            return null;
        },
        set: function (token) {
            localStorage.setItem(Authenticator.uidKey, token.toString());
        },
        enumerable: true,
        configurable: true
    });
    Authenticator.prototype.unsetUser = function () {
        this._user = null;
        localStorage.removeItem(Authenticator.tokenKey);
        localStorage.removeItem(Authenticator.uidKey);
        for (var subscriberId in this.subscribers) {
            this.subscribers[subscriberId].next(null);
        }
    };
    Authenticator.newRequestOptions = function () {
        return {
            headers: new Headers({
                'Authorization': localStorage.getItem(Authenticator.tokenKey),
                'Content-Type': 'application/json'
            })
        };
    };
    Authenticator.prototype.createUser = function (email, password, username) {
        return this.httpService.postPersistedObject(HttpService.ClientsCollection, {
            username: username,
            password: password,
            email: email
        });
    };
    Authenticator.prototype.loginGuest = function () {
        localStorage.setItem(Authenticator.tokenKey, this.guestToken);
        localStorage.setItem(Authenticator.uidKey, this.guestUid);
        return this.loadUser();
    };
    Authenticator.prototype.login = function (email, password) {
        var _this = this;
        this.token = '';
        return this.http.post('/api/Clients/login', JSON.stringify({
            email: email,
            password: password
        }), Authenticator.newRequestOptions())
            .map(function (response) {
            var data = _this.handleErrors(response);
            _this.token = data['id'];
            _this.uid = data['userId'];
            return data['userId'];
        }).flatMap(function (id, index) {
            return _this.loadUser();
        });
    };
    Authenticator.prototype.loadUser = function () {
        var _this = this;
        return this.http.get('/api/Clients/' + localStorage.getItem(Authenticator.uidKey) + this.userLoadFilter, Authenticator.newRequestOptions())
            .map(function (response) {
            var user = _this.handleErrors(response);
            _this.setUser(new AuthUser(user));
        });
    };
    Authenticator.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        return ErrorObservable.create(errMsg);
    };
    Authenticator.prototype.handleErrors = function (response) {
        var data = response.json();
        if (data.hasOwnProperty('error')) {
            throw this.createError(data['error']);
        }
        return data;
    };
    Authenticator.prototype.checkLocalAuthData = function () {
        var hasLocalAuthData = (this.token != null && this.uid != null);
        if (!hasLocalAuthData) {
            return Observable.throw(null);
        }
        return this.loadUser();
    };
    Authenticator.prototype.createError = function (error) {
        var authErrors = new AuthErrors();
        if (error.hasOwnProperty('details') && error['details'].
            hasOwnProperty('messages')) {
            var messages = error['details']['messages'];
            for (var key in messages) {
                if (messages[key].length > 0) {
                    authErrors.add(key, messages[key][0]);
                }
            }
        }
        else {
            authErrors.add('error', error['message']);
        }
        return authErrors;
    };
    Authenticator.prototype.logout = function () {
        var options = Authenticator.newRequestOptions();
        this.unsetUser();
        return this.httpService.postPersistedObject(HttpService.logout(), {}, options)
            .map(function (res) {
            return res;
        });
    };
    Authenticator.tokenKey = 'auth_token';
    Authenticator.uidKey = 'uid';
    Authenticator = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http, HttpService])
    ], Authenticator);
    return Authenticator;
}(BaseObservable));
export var AuthErrors = (function () {
    function AuthErrors() {
        this._subjects = [];
        this._messages = [];
        this._count = 0;
    }
    AuthErrors.prototype.add = function (subject, message) {
        this._subjects.push(subject);
        this._messages.push(message);
    };
    Object.defineProperty(AuthErrors.prototype, "count", {
        get: function () {
            return this._subjects.length;
        },
        enumerable: true,
        configurable: true
    });
    AuthErrors.prototype.subject = function (index) {
        return this._subjects[index];
    };
    AuthErrors.prototype.message = function (index) {
        return this._messages[index];
    };
    return AuthErrors;
}());
var AuthUser = (function () {
    function AuthUser(rawUser) {
        Object.assign(this, rawUser);
        this.settings = new AuthUserSettings(rawUser['userSettings']);
        this.membershipEnds = new Date(rawUser['membershipExpiry']);
        this.rawExerciseSets = rawUser['exerciseSets'];
    }
    return AuthUser;
}());
var AuthUserSettings = (function () {
    function AuthUserSettings(rawSettings) {
        Object.assign(this, rawSettings);
    }
    return AuthUserSettings;
}());
var LoginSubscription = (function (_super) {
    __extends(LoginSubscription, _super);
    function LoginSubscription(unsubsribe, id) {
        _super.call(this, function () {
            unsubsribe(id);
        });
    }
    return LoginSubscription;
}(Subscription));
//# sourceMappingURL=authenticator.js.map