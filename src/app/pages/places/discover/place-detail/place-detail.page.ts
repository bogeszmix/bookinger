import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  constructor(
    private router: Router,
    private navCtrl: NavController) { }

  ngOnInit() {
  }

  onBookPlace() {
    // Ebben az esetben ha üres a nav stack, mindig forward-os animációt fog alkalmazni
    // De ha van a stackban akkor is ezt csinálja, ez egy bug állítólag.
    //this.router.navigateByUrl('places/tabs/discover');

    // NavController használatával, mi magunk adhatjuk meg, hogy milyen animációt alkalmazzon
    // Így ha üres is a stack, nem fog az előfordulni, hogy előrefele mutató animációt alkalmaz
    this.navCtrl.navigateBack('places/tabs/discover');
  }
}
