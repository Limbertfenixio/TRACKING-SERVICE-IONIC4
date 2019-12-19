import { Injectable } from '@angular/core';
import * as simplify from 'simplify-js';
import { CustomGeoposition } from '../models/custom-geoposition';
import { BehaviorSubject, Observable } from 'rxjs';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { ApiService } from './api.service';
import { Localizacion } from '../models/localizacion';

@Injectable({
  providedIn: 'root'
})
export class TrankingServiceService {

  minPrec : number = 25;
  positionPila : number = 2;
  positionArray : CustomGeoposition[] = [];
  prevPosition : CustomGeoposition = null;
  _actualPos: BehaviorSubject<Geoposition> = new BehaviorSubject<Geoposition>(null);
  actualPos : Observable<Geoposition> = this._actualPos.asObservable();
  datac : any = [];
  cont : any = 0;
  
  constructor(public geolocation : Geolocation, private apiService : ApiService) { }
  
  public starTracking() : void {
    this.geolocation.watchPosition({enableHighAccuracy: true}).subscribe(actualPosition =>  {
      if(actualPosition.coords !== undefined){
      
        if (actualPosition.coords.speed > 0 && actualPosition.coords.accuracy < this.minPrec) {

          this.positionArray.push(new CustomGeoposition(actualPosition));

          if (this.positionArray.length > this.positionPila) {
            
            if(this.prevPosition==null){
              this.prevPosition = this.positionArray[0];
            }
            this.positionArray.unshift(this.prevPosition);

            let filteredPoints = simplify(this.positionArray, 15, true);
            this.positionArray = [];
            filteredPoints.unshift(this.prevPosition);

            this.parseFilteredPoints(filteredPoints);
          }
        }
        
          
          this.datac = [];
          this.datac = {
            lat : actualPosition.coords.latitude,
            lon : actualPosition.coords.longitude
          }
          this.cont++;

          if(this.cont == 15){
            this.createData(this.datac);
            this.cont = 0;
          }

          console.log(this.datac);

          console.log('Latitud: ' + actualPosition.coords.latitude);
          console.log('Longitud: ' + actualPosition.coords.longitude);
      }
    }, onError => {
      console.log(onError.message)
    });
  }

  parseFilteredPoints(filteredPoints: CustomGeoposition[]){
    filteredPoints.forEach(point => {
      this._actualPos.next( point );
      this.prevPosition = point;
    });
  }

  createData(data){
    this.apiService.create(data).subscribe( (localizacion : Localizacion) =>{
      console.log('exito' , localizacion);
    })
  }
}

