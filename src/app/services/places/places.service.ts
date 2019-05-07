import { Injectable } from '@angular/core';
import { Place } from 'src/app/models/place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg',
      149.99),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://www.silverkris.com/wp-content/uploads/2017/06/romantic-paris.jpg',
      189.99),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://wallpaperplay.com/walls/full/1/8/6/215620.jpg',
      99.99),
  ];

  constructor() {}

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
}
