import { Component, OnInit, Input } from '@angular/core';
import { Place } from 'src/app/models/place.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {
  @Input('offer') offer: Place;

  constructor() { }

  ngOnInit() {}

  getDummyDate() {
    return new Date();
  }

}
