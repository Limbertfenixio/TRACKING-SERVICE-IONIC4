import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Localizacion } from '../models/localizacion';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient : HttpClient) { }

  PHP_API_SERVER = "http://192.168.1.208/prueba1r";
  //PHP_API_SERVER = "http://www.autoserver.net";

  read() : Observable<Localizacion[]>{
    return this.httpClient.get<Localizacion[]>(`${this.PHP_API_SERVER}/read.php`);
  }

  create(localizacion : Localizacion) : Observable<Localizacion>{
    return this.httpClient.post<Localizacion>(`${this.PHP_API_SERVER}/create.php`, localizacion);
  }
}
