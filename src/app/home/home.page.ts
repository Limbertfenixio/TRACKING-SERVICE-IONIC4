import { Component, OnInit, ViewChild, ElementRef, ɵConsole} from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';
import { R3TargetBinder } from '@angular/compiler';
import { GoogleMap, GoogleMapsEvent, LatLng} from "@ionic-native/google-maps";
import { TrankingServiceService } from '../services/tranking-service.service';
import { ApiService } from '../services/api.service';
import { Localizacion } from '../models/localizacion';

declare var plugin : any;
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  /*map: any;
  
  options : GeolocationOptions;
  currentPos : Geoposition;
  success: PositionCallback;
  error : PositionError;
  
  constructor(private geolocation : Geolocation) {}

  ngOnInit(){
    this.getUserPosition();
  }

  getUserPosition(){
    this.options = {
    enableHighAccuracy : false
    };
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos;     

        console.log(pos);
        this.addMap(pos.coords.latitude,pos.coords.longitude);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    ;
    })

    
  }

  addMap(lat,long){

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
    center: latLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
    var mapElement = document.getElementById('map')
    this.map = new google.maps.Map(mapElement, mapOptions);
   this.addMarker();
    google.maps.event.addListenerOnce(this.map, 'idle' , () => {
      console.log('okey');
    })
  }

 addMarker(){

    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
    });
         
    let infoWindow = new google.maps.InfoWindow({

    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });

  }*/

  map : GoogleMap;
  prevPosition : Geoposition; 
  localizacions : Localizacion[];  
  pos : any;
  

  constructor(private trackingService: TrankingServiceService, private apiService: ApiService, private geolocation: Geolocation) {}

  ngOnInit(){
    this.geolocation.getCurrentPosition().then((pos) =>{
      this.pos = pos;
    })
    this.setMap(this.pos);
    this.loadMap();
    this.trackingService.starTracking();
    this.trackingService.actualPos.subscribe(pos => {
      if(pos != null){
        //this.drawRoute(pos);
        //
      }
    });
    this.apiService.read().subscribe( (localizacion : Localizacion[]) => {
      this.localizacions = localizacion;
      console.log(this.localizacions);
    })

  }

  setMap(pos : Geoposition){
    
    let controls : any = {compass: true , myLocationButton: false, indoorPicker: false, zoom: true,
                          mapTypeControl : false, streetViewControl : false}

    this.map = new GoogleMap('map', {
      'backgroundColor' : 'white',
      'controls' : {
        'compass' : controls.compass,
        'myLocationButton' : controls.myLocationButton,
        'indoorPicker' : controls.indoorPicker,
        'zoom' : controls.zoom,
        'mapTypeControl' : controls.mapTypeControl,
        'streestViewControl' : controls.streetViewControl
      },
      'gestures' : {
        'scroll' : true,
        'tilt' : true,
        'rotate' : true,
        'zoom' : true
      },
      'camera' : {
        'target': {
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude
        },
        'tilt': 30,
        'zoom': 20,
      }
    });
  }


  loadMap(){
    
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
      (map) => {
        this.map.clear();
        this.map.off();
        this.map.setMapTypeId(plugin.google.maps.MapTypeId.ROADMAP);
        this.map.setMyLocationEnabled(true);
      },(error)=>{
        console.error("Error:", error);
      }
    );
  }

  drawRoute(pos : Geoposition){
    if(this.prevPosition==null){
      this.prevPosition = pos;
    }

    this.map.addPolyline({
      points: [new LatLng(this.prevPosition.coords.latitude, this.prevPosition.coords.longitude),
                new LatLng(pos.coords.latitude, pos.coords.longitude)],
      visible : true,
      color: '#FF0000',
      width: 4,
    }).then( res => {
      this.prevPosition = pos;
    }).catch( err => {
      console.log('error' , JSON.stringify(err));
    });

    
  }

  
}
