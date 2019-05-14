import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
    private _placeSubs: Subscription;
    loadedPlaces: Place[];
    listedLoadedPlaces: Place[];
    relevantPlaces: Place[];

    constructor(
        private placesService: PlacesService,
        private menuCtrl: MenuController,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this._placeSubs = this.placesService.places.subscribe(
            (places: Place[]) => {
                this.loadedPlaces = places;
                this.relevantPlaces = this.loadedPlaces;
                this.listedLoadedPlaces = this.relevantPlaces.slice(1);
            }
        );
    }

    ngOnDestroy() {
        if (this._placeSubs) {
            this._placeSubs.unsubscribe();
        }
    }

    onOpenMenu() {
        this.menuCtrl.toggle();
    }

    onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
        if (event.detail.value === 'all') {
            this.relevantPlaces = this.loadedPlaces;
            this.listedLoadedPlaces = this.relevantPlaces.slice(1);
        } else {
            this.relevantPlaces = this.loadedPlaces.filter(
                place => place.userId !== this.authService.userId
            );
            this.listedLoadedPlaces = this.relevantPlaces.slice(1);
        }
    }
}
