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
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
export var ExerciseSetSelectorPage = (function () {
    function ExerciseSetSelectorPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.onSelect = navParams.get('onSelect');
        this.selectionId = navParams.get('currentSelectionId');
        this.exerciseSets = navParams.get('exerciseSets');
        this.createCategories();
        console.dir(this.categories);
    }
    ExerciseSetSelectorPage.prototype.onOk = function () {
        this.onSelect(this.selectionId);
        this.navCtrl.pop();
    };
    ExerciseSetSelectorPage.prototype.onCancel = function () {
        this.navCtrl.pop();
    };
    ExerciseSetSelectorPage.prototype.createCategories = function () {
        var categoriesObj = {};
        for (var _i = 0, _a = this.exerciseSets; _i < _a.length; _i++) {
            var set = _a[_i];
            if (!categoriesObj.hasOwnProperty(set.category)) {
                categoriesObj[set.category] =
                    new ExerciseSetCategory(set.category);
            }
            categoriesObj[set.category].push(new ExerciseSetSelection(set.name, set.id));
        }
        this.categories = [];
        for (var key in categoriesObj) {
            this.sortByName(categoriesObj[key]);
            this.categories.push(categoriesObj[key]);
        }
        this.sortByName(this.categories);
    };
    ExerciseSetSelectorPage.prototype.sortByName = function (a) {
        a.sort(function (n1, n2) {
            return n1.name.toLowerCase().localeCompare(n2.name.toLowerCase());
        });
    };
    ExerciseSetSelectorPage.prototype.close = function () {
        this.navCtrl.pop();
    };
    ExerciseSetSelectorPage = __decorate([
        Component({
            selector: 'exercise-set-selector',template:/*ion-inline-start:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\exercise-set-preview\exercise-set-selector.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Select Exercise Set</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n\n  <ion-list radio-group [(ngModel)]="selectionId">\n\n    <ion-item-group *ngFor="let category of categories; let idx = index">\n\n      <ion-item-divider color="light">\n\n        <button ion-button (click)="category.toggleHidden()" color="primary" small clear icon-left>\n\n          <ion-icon [name]="category.icon"></ion-icon>\n\n          {{ category.name }}\n\n        </button>\n\n      </ion-item-divider>\n\n      <ion-list [hidden]="category.hidden">\n\n        <ion-item *ngFor="let selection of category; let idx = index">\n\n          <ion-label class="radio-selection">{{ selection.name }}</ion-label>\n\n          <ion-radio [value]="selection.id"></ion-radio>\n\n        </ion-item>\n\n      </ion-list>   \n\n    </ion-item-group>\n\n  </ion-list>\n\n  <button (click)="onOk()" ion-button color="primary" small>\n\n    <ion-icon name="checkmark-circle"></ion-icon>\n\n  </button>\n\n  <button (click)="onCancel()" ion-button color="danger" small>\n\n    <ion-icon name="close-circle"></ion-icon>\n\n  </button>\n\n</ion-content>'/*ion-inline-end:"C:\Bitnami\wampstack-5.6.22-0\apps\sc-metronone\src\pages\exercise-set-preview\exercise-set-selector.html"*/,
        }), 
        __metadata('design:paramtypes', [NavController, NavParams])
    ], ExerciseSetSelectorPage);
    return ExerciseSetSelectorPage;
}());
export var ExerciseSetCategory = (function (_super) {
    __extends(ExerciseSetCategory, _super);
    function ExerciseSetCategory(name) {
        _super.call(this);
        this.name = name;
        this.iconIndex = 0;
        this.hidden = true;
        this.icon = ExerciseSetCategory.Icons[0];
        this.hidden = true;
        this.icon = ExerciseSetCategory.Icons[this.iconIndex];
    }
    ExerciseSetCategory.prototype.toggleHidden = function () {
        this.hidden = !this.hidden;
        this.toggleIcon();
    };
    ExerciseSetCategory.prototype.toggleIcon = function () {
        this.iconIndex = (this.iconIndex + 1) % 2;
        this.icon = ExerciseSetCategory.Icons[this.iconIndex];
    };
    ExerciseSetCategory.Icons = ['add-circle', 'remove-circle'];
    return ExerciseSetCategory;
}(Array));
export var ExerciseSetSelection = (function () {
    function ExerciseSetSelection(name, id) {
        this.name = name;
        this.id = id;
    }
    return ExerciseSetSelection;
}());
//# sourceMappingURL=exercise-set-selector.js.map