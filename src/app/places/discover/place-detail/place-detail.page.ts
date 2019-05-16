import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    NavController,
    ModalController,
    ActionSheetController,
    LoadingController,
    AlertController
} from '@ionic/angular';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
    private _placeSubs: Subscription;
    isBookable = false;
    isLoading = false;
    place: Place;

    constructor(
        private navCtrl: NavController,
        private route: ActivatedRoute,
        private router: Router,
        private placesService: PlacesService,
        private modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        private bookingService: BookingService,
        private loadingCtrl: LoadingController,
        private authService: AuthService,
        private alertCtrl: AlertController
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
          if (!paramMap.has('placeId')) {
            this.navCtrl.navigateBack('/places/tabs/discover');
            return;
          }
          this.isLoading = true;
          this._placeSubs = this.placesService
            .getPlace(paramMap.get('placeId'))
            .subscribe(
              place => {
                this.place = place;
                this.isBookable = place.userId !== this.authService.userId;
                this.isLoading = false;
              },
              error => {
                this.alertCtrl
                  .create({
                    header: 'An error ocurred!',
                    message: 'Could not load place.',
                    buttons: [
                      {
                        text: 'Okay',
                        handler: () => {
                          this.router.navigate(['/places/tabs/discover']);
                        }
                      }
                    ]
                  })
                  .then(alertEl => alertEl.present());
              }
            );
        });
      }

    ngOnDestroy() {
        if (this._placeSubs) {
            this._placeSubs.unsubscribe();
        }
    }

    onBookPlace() {
        // this.router.navigateByUrl('/places/tabs/discover');
        // this.navCtrl.navigateBack('/places/tabs/discover');
        // this.navCtrl.pop();
        this.actionSheetCtrl
            .create({
                header: 'Choose an Action',
                buttons: [
                    {
                        text: 'Select Date',
                        handler: () => {
                            this.openBookingModal('select');
                        }
                    },
                    {
                        text: 'Random Date',
                        handler: () => {
                            this.openBookingModal('random');
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    }
                ]
            })
            .then(actionSheetEl => {
                actionSheetEl.present();
            });
    }

    openBookingModal(mode: 'select' | 'random') {
        console.log(mode);
        this.modalCtrl
            .create({
                component: CreateBookingComponent,
                componentProps: {
                    selectedPlace: this.place,
                    selectedMode: mode
                }
            })
            .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(resultData => {
                console.log(resultData.data, resultData.role);

                if (resultData.role === 'confirm') {
                    this.loadingCtrl
                        .create({
                            message: 'Booking place...'
                        })
                        .then(loadingEl => {
                            loadingEl.present();
                            const data = resultData.data.bookingData;
                            this.bookingService.addBooking(
                                this.place.id,
                                this.place.title,
                                this.place.imageUrl,
                                data.firstName,
                                data.lastName,
                                data.guestNumber,
                                data.startDate,
                                data.endDate
                            ).subscribe(() => {
                                loadingEl.dismiss();
                            });
                        });
                }
            });
    }
}
