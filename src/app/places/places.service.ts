import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
    availableFrom: Date;
    availableTo: Date;
    description: string;
    imageUrl: string;
    price: number;
    title: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    private _BASE_DB_URL = 'https://bookinger-ionic-tutorial.firebaseio.com/';

    private _places = new BehaviorSubject<Place[]>([]);

    get places() {
        return this._places.asObservable();
    }

    constructor(private authService: AuthService, private http: HttpClient) {}

    getPlace(id: string) {
        return this.http.get<PlaceData>(`${this._BASE_DB_URL}/offered-places/${id}.json`).pipe(
            map(resData => {
                return new Place(
                    id,
                    resData.title,
                    resData.description,
                    resData.imageUrl,
                    resData.price,
                    new Date(resData.availableFrom),
                    new Date(resData.availableTo),
                    resData.userId
                )
            })
        );
    }

    fetchPlaces() {
        return this.http
            .get<{ [key: string]: PlaceData }>(
                this._BASE_DB_URL + 'offered-places.json'
            )
            .pipe(
                map(resData => {
                    const places = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            places.push(
                                new Place(
                                    key,
                                    resData[key].title,
                                    resData[key].description,
                                    resData[key].imageUrl,
                                    resData[key].price,
                                    new Date(resData[key].availableFrom),
                                    new Date(resData[key].availableTo),
                                    resData[key].userId
                                )
                            );
                        }
                    }
                    return places;
                }),
                tap(places => {
                    this._places.next(places);
                })
            );
    }

    addPlace(
        title: string,
        description: string,
        price: number,
        dateFrom: Date,
        dateTo: Date
    ) {
        let generatedId: string;
        const newPlace = new Place(
            Math.random().toString(),
            title,
            description,
            'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
            price,
            dateFrom,
            dateTo,
            this.authService.userId
        );

        return this.http
            .post<{ name: string }>(this._BASE_DB_URL + 'offered-places.json', {
                ...newPlace,
                id: null
            })
            .pipe(
                switchMap(resData => {
                    generatedId = resData.name;
                    return this._places;
                }),
                take(1),
                tap(places => {
                    newPlace.id = generatedId;
                    this._places.next(places.concat(newPlace));
                })
            );

        /* return this._places.pipe(
            take(1),
            delay(1000),
            tap((places: Place[]) => {
                this._places.next(places.concat(newPlace));
            })
        ); */
    }

    updatePlace(placeId: string, title: string, description: string) {
        let updatedPlaces: Place[];

        return this.places.pipe(
            take(1),
            switchMap( places => {
                if (!places ||places.length <= 0) {
                    return this.fetchPlaces();
                } else {
                    return of(places);
                }
            }),
            switchMap( places => {
                const updatedPlaceIndex = places.findIndex(
                    pl => pl.id === placeId
                );
                updatedPlaces = [...places];
                const old = updatedPlaces[updatedPlaceIndex];
                updatedPlaces[updatedPlaceIndex] = new Place(
                    old.id,
                    title,
                    description,
                    old.imageUrl,
                    old.price,
                    old.availableFrom,
                    old.availableTo,
                    old.userId
            );
            return this.http.put(
                `${this._BASE_DB_URL}/offered-places/${placeId}.json`,
                { ...updatedPlaces[updatedPlaceIndex], id: null}
                );
            }),
            tap(() => {
                this._places.next(updatedPlaces);
            })
        );
        
    }
}
