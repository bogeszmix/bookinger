import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElementRef: ElementRef;

  private _BASE_G_MAP_URL = 'https://maps.googleapis.com/maps/api/js?key=';
  private _gMapKey = environment.gMapApiKey;

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getGoogleMaps().then(
      googleMaps => {
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 16
        });
      
      googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      })
      }
    ).catch(err => {
      console.log(err);
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const windows = window as any;
    const googleModule = windows.google;

    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${this._BASE_G_MAP_URL}${this._gMapKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = windows.google;
        if(loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available!');
        }
      }
    });

  }

}