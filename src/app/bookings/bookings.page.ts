import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';

import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit, OnDestroy {
    private _bookingsSubj: Subscription;
    loadedBookings: Booking[];

    constructor(
        private bookingService: BookingService,
        private loadingCtrl: LoadingController
    ) {}

    ngOnInit() {
        this._bookingsSubj = this.bookingService.bookings.subscribe(
            (bookings: Booking[]) => {
                this.loadedBookings = bookings;
            }
        );
    }

    ngOnDestroy() {
        if (this._bookingsSubj) {
            this._bookingsSubj.unsubscribe();
        }
    }

    onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
        slidingEl.close();
        this.loadingCtrl
            .create({
                message: 'Cancelling...'
            })
            .then(loadingEL => {
                loadingEL.present();
                this.bookingService.cancelBooking(bookingId).subscribe(() => {
                    loadingEL.dismiss();
                });
            });
        // cancel booking wiht id offerId
    }
}
