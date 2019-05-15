import { Injectable } from '@angular/core';

import { Booking } from './booking.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BookingService {
    private _bookings = new BehaviorSubject<Booking[]>([
        {
            id: 'xyz',
            placeId: 'p1',
            placeTitle: 'Manhattan Mansion',
            guestNumber: 2,
            userId: 'abc',
            bookedFrom: new Date(),
            bookedTo: new Date(),
            firstName: 'Sanyi',
            lastName: 'Gomez',
            placeImage:
                'https://media-cdn.tripadvisor.com/media/photo-s/09/46/2a/cc/beauty-place.jpg'
        }
    ]);

    constructor(private authService: AuthService) {}

    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date
    ) {
        const newBooking = new Booking(
            Math.random().toString(),
            placeId,
            this.authService.userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo
        );
        return this._bookings.pipe(
            take(1),
            delay(1000),
            tap((bookings: Booking[]) => {
                this._bookings.next(bookings.concat(newBooking));
            })
        );
    }

    cancelBooking(bookingId: string) {
        return this._bookings.pipe(
            take(1),
            delay(1000),
            tap((bookings: Booking[]) => {
                this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
            })
        ); 
    }
}
