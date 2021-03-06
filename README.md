# angular2-social-auth
Simple client side social authentication for Angular 2.x | 4.x application.
<br>
this module is a fork of: https://github.com/heresy/angular2-social-login.git


# Supported sites:
- Google
- Facebook
- LinkedIN

## Getting started
### Installation

#### via npm

```shell
npm install angular2-social-auth --save
```
### Adding angular2-social-auth to your project
Add `map` for **`angular2-social-auth`** in your `systemjs.config`
```javascript
'angular2-social-auth': 'node_modules/angular2-social-auth/dist/bundles/angular2-social-login.min.js'
```
### Main module configuration
```javascript
import { NgModule }      from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { Angular2SocialLoginModule } from "angular2-social-auth";

let providers = {
    "google": {
      "clientId": "GOOGLE_CLIENT_ID"
    },
    "linkedin": {
      "clientId": "LINKEDIN_CLIENT_ID"
    },
    "facebook": {
      "clientId": "FACEBOOK_CLIENT_ID",
      "apiVersion": "<version>" //like v2.4
    }
  };

@NgModule({
  imports: [
      BrowserModule,
      Angular2SocialLoginModule
  ],
  declarations: [AppComponent],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(){}
}

Angular2SocialLoginModule.loadProvidersScripts(providers);
```
### Component configuration for `login()` and `logout()`:
For `login(provider: string)` provider is required it should be anyone(case-sensitive) "facebook", "google", "linkedin" .
```javascript
...
import { AuthService } from "angular2-social-auth";
...
@Component({
    ...
})
export class AppComponent implements OnDestroy {
  ...
  constructor(public _auth: AuthService){ }

  signIn(provider){
    this._auth.login(provider).subscribe(
      (data) => {
                  console.log(data);
                  //user data
                  //first_name, last_name, image, uid, provider, email, token (returns  accessToken for Facebook and Google no token for linkedIn)
                }
    )
  }

  logout(){
    this._auth.logout().subscribe(
      (data)=>{
        //return a boolean value.
      }
    )
  }

  ...

}
```
