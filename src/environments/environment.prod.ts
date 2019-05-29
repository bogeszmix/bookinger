import { maps } from '../gmap';
import { firebase } from 'src/firebase';

export const environment = {
  production: true,
  gMapApiKey: maps.googleMapsKey,
  firebaseAPIKey: firebase.firebaseAPIKey
};
