import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpService} from '../../providers/http-service/http-service';
import {Observable} from 'rxjs/Observable';

// @todo This should be rewriten so that only one audio file is downloaded and
// along with a list of soundName => offsetTime items. Doing all these get is 
// ridiculous. 

@Injectable()
export class AudioBuffers {
  private audioFileTest = new RegExp("\.(mp3|wav|ogg)", "i");
  private _audioContext: AudioContext;

  private _buffers: {[key: string]: AudioBuffer} = null;
  private data: any;
  private sources: Array<Source> = new Array<Source>();
  constructor(private httpService: HttpService) {
  }

  get buffers() : {[key: string]: AudioBuffer} {
    return this._buffers;
  }

  get audioContext() : AudioContext {
    return this._audioContext;
  }

  get silence() : AudioBuffer {
    return this._buffers['silence'];
  }
  
  private init(audioContext: AudioContext) {
    this._audioContext = audioContext;
    let rate = audioContext.sampleRate;
    // Audio Files
    this.sources[SourceType.AudioFile.toString()] = new Source(
      SourceType.AudioFile,
      'arraybuffer', (name: string, rawData: ArrayBuffer) => 
        this.createFromAudioFile(name, rawData)
    );
  }

  private createFromAudioFile(name: string, rawData: ArrayBuffer) {
    this._audioContext.decodeAudioData(rawData, 
      (buffer) => this._buffers[name] = buffer, 
      () => {throw new Error('Could not decode ' + name);});
  }

  public loadAll(audioContext: AudioContext): Observable<void> {
    if (this._buffers != null) {
      return Observable.of(null);
    }
    this._buffers = {}; 
    this.init(audioContext);
    let promise = this.httpService.getPersistedObject('assets/resource-library.json')
    .toPromise()
    .then((library) => {
      let urls: Array<[string, string]> = new Array<[string, string]>();
      let items: Object [] = library['sc-group']['sc-audio']['items']; 
      for (let i = 0; i < items.length; i++) {
        urls.push(<[string, string]>[items[i]['name'], items[i]['location']]);
      }
      return Promise.resolve(urls);})
    .then((array) => {
      let promises: Array<Promise<any>> = [];
      this.load(array, promises);
      return Promise.all(promises);})
    .then((value) => {
      return Promise.resolve();
    });
    return Observable.fromPromise(promise);
  }

  private load(sources: Array<[string, string]>, promises: Array<Promise<any>>): void{
    // Not sure what to do with the name
    if (sources.length == 0) {
      return;
    }
    let type: SourceType = null;
    let nameAndUrl = sources.pop();
    let name: string = nameAndUrl[0];
    let url: string = nameAndUrl[1];
    if (this.audioFileTest.test(url)) {
      type = SourceType.AudioFile;
    }
    if (type == null) {
      throw new Error('Invalid file type: ' + url);
    }
    promises.push(this.fetch(name, url, this.sources[type.toString()], sources, promises));
  }

  private fetch(name: string, url: string, type: Source, 
    sources: Array<[string, string]>, promises:Array<Promise<any>>) : Promise<any> {
    // this.http.get()
    this.load(sources, promises);
    return new Promise<any>((resolve, reject) => {
      var req = new XMLHttpRequest();
      if (type) {
        req.responseType = type.responseType;
      } 
      req.open('GET', url)
      req.onload = () => {
        if (req.status == 200) {
          type.bufferCreator(name, req.response);
          resolve('OK');
        }
        else {
          reject(req.statusText);
        }
      }
      req.onerror = () => { reject('HTTP_ERROR'); }
      req.send();
    });
  }
}

enum SourceType {
  AudioFile
}

class Source {
  constructor(public type: SourceType, public responseType: string, 
    public bufferCreator: (name: string, rawData: ArrayBuffer) => void) {
  }
}