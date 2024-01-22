import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {CoCModel} from "../models/coc.model";
import {map, Observable} from "rxjs";

@Injectable({ providedIn: "root" })
export class CoCService {
  public cocModel: CoCModel = {
    valid: false
  };

  constructor(private http: HttpClient) {

  }

  isCocNumberValid(number: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ovio-api-key': 'ee5d17d3e9156af45385bcdba619b9df3c1b9b7dcf70273936743f006a401fdd'
    });

    return this.http.get<any[]>(`https://api.overheid.io/v3/suggest/openkvk/${number}`, {headers})
      .pipe(
        map((objects) => {

          return objects.some((object: any) => {
            return this.cocModel.valid = object['kvknummer'].toString() === number;
          });
        })
      );
  }
}

