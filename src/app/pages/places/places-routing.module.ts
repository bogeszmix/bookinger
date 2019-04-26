import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacesPage } from './places.page';

// A path sorrend megadása számít, előszőr a hard code-os kell, és csak utána a dinamikus, mint az offers-nél.
const routes: Routes = [
    {
        path: 'tabs',
        component: PlacesPage,
        children: [
            { 
                path: 'discover',
                children: [
                    { path: '', loadChildren: './discover/discover.module#DiscoverPageModule' },
                    { path: ':placeId', loadChildren: './discover/place-detail/place-detail.module#PlaceDetailPageModule'}
                ]
            },
            {
                path: 'offers',
                children: [
                    { path: '', loadChildren: './offers/offers.module#OffersPageModule'},
                    { path: 'new', loadChildren: './offers/new-offer/new-offer.module#NewOfferPageModule' },
                    { path: 'edit/:editOfferId', loadChildren: './offers/edit-offer/edit-offer.module#EditOfferPageModule' },
                    { path: ':bookedOfferId', loadChildren: './offers/offer-bookings/offer-bookings.module#OfferBookingsPageModule' },
                ]
            },
            {
                path: '',
                redirectTo: '/places/tabs/discover',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/places/tabs/discover',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlacesRoutingModule {}