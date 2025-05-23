import { Injectable } from '@angular/core';
import { Coordinates } from '../BaseSecurity/coordinates';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationServiceService {

  constructor() { }

  getCurrentCoordinates(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coordinates: Coordinates = {
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString()
            };
            resolve(coordinates);
          },
          (error) => {
            console.error('Error getting coordinates:', error);
            reject(error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        reject('Geolocation not supported');
      }
    });
  }
}
