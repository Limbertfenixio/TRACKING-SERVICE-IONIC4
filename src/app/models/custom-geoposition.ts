import {Geoposition} from "@ionic-native/geolocation/ngx";

export class CustomGeoposition implements Geoposition{
    coords: import("@ionic-native/geolocation/ngx").Coordinates;    
    timestamp: number;
    x: any;
    y: any;

    constructor(geoposition: Geoposition){
        this.coords = geoposition.coords;
        this.timestamp = geoposition.timestamp;
        this.x = geoposition.coords.latitude;
        this.y = geoposition.coords.longitude;
    }
}
