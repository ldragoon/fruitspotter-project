// https://github.com/ccoenraets/ionic2-realty
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class MarksProvider {

  marks: any;

  constructor(public http: Http) { }

  load() {
    return this.http.get('assets/data/marks.json').map(response => response.json());
  }
}
