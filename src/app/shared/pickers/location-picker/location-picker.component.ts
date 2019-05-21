import { PlaceLocation } from './../../../places/location.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  private _BASE_GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
  private _BASE_STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?center=';
  private _gMapKey = environment.gMapApiKey;

  selectedLocationImage: string;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient) { }

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl.create({component: MapModalComponent}).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }

        const pickedLocation: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          staticMapImageUrl: null
        };

        this.isLoading = true;

        this.getAddress(modalData.data.lat, modalData.data.lng).pipe(
          switchMap(address => {
            pickedLocation.address = address;
            return of(this.getMapImage(
              pickedLocation.lat,
              pickedLocation.lng,
              16,
              500,
              300,
              'roadmap'));
        })).subscribe(staticMapImage => {
          pickedLocation.staticMapImageUrl = staticMapImage;
          this.selectedLocationImage = staticMapImage;
          this.isLoading = false;
        });
      });
      modalEl.present();
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>(`${this._BASE_GEOCODING_URL}${lat},${lng}&key=${this._gMapKey}`).pipe(
      map(geoData => {
        if (!geoData || !geoData.results || geoData.results.length === 0) {
          return null;
        }
        return geoData.results[0].formatted_address;
      })
    );
  }

  private getMapImage(
    lat: number,
    lng: number,
    zoom: number,
    width: number,
    height: number,
    mapType: string) {
    return `
    ${this._BASE_STATIC_MAP_URL}
    ${lat},
    ${lng}
    &zoom=${zoom}
    &size=${width}x${height}
    &maptype=${mapType}
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${this._gMapKey}`;
  }

}
