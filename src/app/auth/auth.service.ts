import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user-model';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient) {}

  autoLogin() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parsedData = JSON.parse(storedData.value) as {
          userId: string,
          token: string,
          tokenExpirationDate: string,
          email: string
        };
        const expirationDate = new Date(parsedData.tokenExpirationDate);
        if (expirationDate <= new Date()) {
          return null;
        }

        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationDate
        );

        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
        }


      }),
      map(user => {
        return !!user;
      })
    );
  }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebaseAPIKey}`,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
    ).pipe(
      tap(userData => {
        this.setUserData(userData);
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebaseAPIKey}`,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
    ).pipe(
      tap(userData => {
        this.setUserData(userData);
      })
    );
  }

  logout() {
    this._user.next(null);
  }

  setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    this._user.next(new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    ));
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);

  }

  storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Plugins.Storage.set({key: 'authData', value: data});
  }
}
