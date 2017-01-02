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
import { ResourceLibrary } from '../../providers/resource-library/resource-library';
import 'rxjs/add/operator/map';
export var AudioBuffers = (function () {
    function AudioBuffers(http, resourceLibrary) {
        this.http = http;
        this.resourceLibrary = resourceLibrary;
        this.audioFileTest = new RegExp("\.(mp3|wav|ogg)", "i");
        // private jsonFileTest = new RegExp("\.json(\?.*)?$", "i");
        //private audioFileTest = new RegExp("\.(mp3|wav|ogg)(\?.*)?$", "i");
        //private base64AudioTest = new RegExp("^data:audio");
        //private jsFileTest = new RegExp("\.js(\?.*)?$", "i");
        // NEED TO DEFINE A DICTIONARY FOR THIS
        this._buffers = null;
        this.sources = new Array();
    }
    Object.defineProperty(AudioBuffers.prototype, "buffers", {
        get: function () {
            return this._buffers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioBuffers.prototype, "audioContext", {
        get: function () {
            return this._audioContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioBuffers.prototype, "silence", {
        get: function () {
            return this._buffers['silence'];
        },
        enumerable: true,
        configurable: true
    });
    AudioBuffers.prototype.init = function (audioContext) {
        var _this = this;
        this._audioContext = audioContext;
        var rate = audioContext.sampleRate;
        // Audio Files
        this.sources[SourceType.AudioFile.toString()] = new Source(SourceType.AudioFile, 'arraybuffer', function (name, rawData) {
            return _this.createFromAudioFile(name, rawData);
        });
    };
    AudioBuffers.prototype.createFromAudioFile = function (name, rawData) {
        var _this = this;
        this._audioContext.decodeAudioData(rawData, function (buffer) { return _this._buffers[name] = buffer; }, function () { throw new Error('Could not decode ' + name); });
    };
    AudioBuffers.prototype.loadAll = function (libraryUrl, audioContext) {
        var _this = this;
        if (this._buffers != null) {
            return Promise.resolve();
        }
        this._buffers = {};
        this.init(audioContext);
        return this.resourceLibrary.load().then(function (library) {
            var urls = new Array();
            var items = library['sc-group']['sc-audio']['items'];
            for (var i = 0; i < items.length; i++) {
                urls.push([items[i]['name'], items[i]['location']]);
            }
            return Promise.resolve(urls);
        }).then(function (array) {
            var promises = [];
            _this.load(array, promises);
            return Promise.all(promises);
        }).then(function (value) {
            return Promise.resolve();
        });
    };
    AudioBuffers.prototype.load = function (sources, promises) {
        // Not sure what to do with the name
        if (sources.length == 0) {
            return;
        }
        var type = null;
        var nameAndUrl = sources.pop();
        var name = nameAndUrl[0];
        var url = nameAndUrl[1];
        if (this.audioFileTest.test(url)) {
            type = SourceType.AudioFile;
        }
        /*
        if (this.jsonFileTest.test(url)) {
    
        }
        if (this.jsFileTest.test(url)) {
          
        }
        if (this.base64AudioTest.test(url)) {
          
        }
        */
        if (type == null) {
            throw new Error('Invalid file type: ' + url);
        }
        promises.push(this.fetch(name, url, this.sources[type.toString()], sources, promises));
    };
    AudioBuffers.prototype.fetch = function (name, url, type, sources, promises) {
        // this.http.get()
        this.load(sources, promises);
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            if (type) {
                req.responseType = type.responseType;
            }
            req.open('GET', url);
            req.onload = function () {
                if (req.status == 200) {
                    type.bufferCreator(name, req.response);
                    resolve('ok');
                }
                else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function () { reject(Error('Network Error')); };
            req.send();
        });
    };
    AudioBuffers = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Http, ResourceLibrary])
    ], AudioBuffers);
    return AudioBuffers;
}());
var Base64 = (function () {
    function Base64() {
    }
    // DECODE UTILITIES
    Base64.prototype.b64ToUint6 = function (nChr) {
        return nChr > 64 && nChr < 91 ? nChr - 65
            : nChr > 96 && nChr < 123 ? nChr - 71
                : nChr > 47 && nChr < 58 ? nChr + 4
                    : nChr === 43 ? 62
                        : nChr === 47 ? 63
                            : 0;
    };
    // Decode Base64 to Uint8Array
    // ---------------------------
    Base64.prototype.decode = function (sBase64, nBlocksSize) {
        var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, '');
        var nInLen = sB64Enc.length;
        var nOutLen = nBlocksSize
            ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize
            : nInLen * 3 + 1 >> 2;
        var taBytes = new Uint8Array(nOutLen);
        for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
            nMod4 = nInIdx & 3;
            nUint24 |= this.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 1) {
                for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                    taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                }
                nUint24 = 0;
            }
        }
        return taBytes;
    };
    return Base64;
}());
var SourceType;
(function (SourceType) {
    SourceType[SourceType["AudioFile"] = 0] = "AudioFile";
})(SourceType || (SourceType = {}));
var Source = (function () {
    function Source(type, responseType, bufferCreator) {
        this.type = type;
        this.responseType = responseType;
        this.bufferCreator = bufferCreator;
    }
    return Source;
}());
//# sourceMappingURL=audio-buffers.js.map