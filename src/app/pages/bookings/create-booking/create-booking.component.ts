import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Place } from 'src/app/models/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  onBookPlace() {
    this.modalCtrl.dismiss({
      message: 'Dummy Modal message'
    }, 'confirm');
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
