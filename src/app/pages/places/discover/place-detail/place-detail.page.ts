import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/pages/bookings/create-booking/create-booking.component';
import { Place } from 'src/app/models/place.model';
import { PlacesService } from 'src/app/services/places/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placesService: PlacesService,
    private actionSheet: ActionSheetController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }

  onBookPlace() {
    this.actionSheet.create(
      {
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select')
            }
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random')
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      }).then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    // Ebben az esetben ha üres a nav stack, mindig forward-os animációt fog alkalmazni
    // De ha van a stackban akkor is ezt csinálja, ez egy bug állítólag.
    // this.router.navigateByUrl('places/tabs/discover');

    // NavController használatával, mi magunk adhatjuk meg, hogy milyen animációt alkalmazzon
    // Így ha üres is a stack, nem fog az előfordulni, hogy előrefele mutató animációt alkalmaz
    // this.navCtrl.navigateBack('places/tabs/discover');
    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place
      }
    }).then(modalELe => {
      modalELe.present();
      return modalELe.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data);
      console.log(resultData.role);

      if (resultData.role === 'confirm') {
        console.log('BOOKED!');
      }

    });
    
  }
}
