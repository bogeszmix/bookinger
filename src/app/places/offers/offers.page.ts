import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  private _placeSub: Subscription;
  offers: Place[];


  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this._placeSub = this.placesService.places.subscribe( (places: Place[]) =>{
      this.offers = places;
    });
  }

  ngOnDestroy() {
    if (this._placeSub) {
      this._placeSub.unsubscribe();
    }
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
    console.log('Editing item', offerId);
  }
}
