import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {VATModel} from "../models/vat.model";
import {map, Observable} from "rxjs";

@Injectable({ providedIn: "root" })
export class VATService {

  constructor(private http: HttpClient) {

  }

  validateVATNumber(number: string): Observable<boolean> {
    return this.http.get<VATModel>(`https://controleerbtwnummer.eu/api/validate/${number}.json`)
      .pipe(
        map((data) => {
          return data?.valid;
        })
      );
  }
}
