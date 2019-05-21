import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [LocationPickerComponent, MapModalComponent],
  entryComponents: [MapModalComponent]
})
export class SharedModule { }
