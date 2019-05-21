import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  private _placeSubs: Subscription;
  place: Place;
  placeId: string;
  form: FormGroup;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this._placeSubs = this.placesService.getPlace(paramMap.get('placeId')).subscribe( (place: Place) => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          })
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An error occured!',
          message: 'Place could not be fetched. Please try again later.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/places/tabs/offers']);
              }
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  ngOnDestroy() {
    if (this._placeSubs) {
      this._placeSubs.unsubscribe();
    }
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Update place...'
    }).then(loadingEl =>{
      loadingEl.present();
      this.placesService.updatePlace(this.place.id, this.form.value.title, this.form.value.description).subscribe(
        () => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/places/tabs/offers']);
        }
      );
    });
    
  }
}