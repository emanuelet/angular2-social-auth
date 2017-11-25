import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
var AuthService = (function() {
  function AuthService() {}
  AuthService.prototype.login = function(provider) {
    var _this = this;
    return Observable.create(function(observer) {
      switch (provider) {
        case "google":
          if (typeof(_this.gauth) == "undefined") {
            _this.gauth = gapi.auth2.getAuthInstance();
          }
          if (!_this.gauth.isSignedIn.get()) {
            _this.gauth.signIn().then(function() {
              localStorage.setItem('_login_provider', 'google');
              observer.next(_this._fetchGoogleUserDetails());
              observer.complete();
            });
          } else {
            localStorage.setItem('_login_provider', 'google');
            observer.next(_this._fetchGoogleUserDetails());
            observer.complete();
          }
          break;
        case "facebook":
          FB.getLoginStatus(function(response) {
            if (response.status === "connected") {
              FB.api('/me?fields=first_name,last_name,email,picture', function(res) {
                if (!res || res.error) {
                  observer.error(res.error);
                } else {
                  var userDetails = {
                    first_name: res.first_name,
                    last_name: res.last_name,
                    email: res.email,
                    uid: res.id,
                    provider: "facebook",
                    image: res.picture.data.url,
                    token: response.authResponse.accessToken,
                    idToken: ''
                  };
                  localStorage.setItem('_login_provider', 'facebook');
                  observer.next(userDetails);
                  observer.complete();
                }
              });
            } else {
              FB.login(function(response) {
                if (response.status === "connected") {
                  FB.api('/me?fields=first_name,last_name,email,picture', function(res) {
                    if (!res || res.error) {
                      observer.error(res.error);
                    } else {
                      var userDetails = {
                        first_name: res.first_name,
                        last_name: res.last_name,
                        email: res.email,
                        uid: res.id,
                        provider: "facebook",
                        image: res.picture.data.url,
                        token: response.authResponse.accessToken,
                        idToken: ''
                      };
                      localStorage.setItem('_login_provider', 'facebook');
                      observer.next(userDetails);
                      observer.complete();
                    }
                  });
                }
              }, {scope: 'email'});
            }
          });
          break;
        case "linkedin":
          IN.User.authorize(function() {
            IN.API.Raw("/people/~:(id,first-name,last-name,email-address,picture-url)").result(function(res) {
              var userDetails = {
                first_name: res.firstName,
                last_name: res.lastName,
                email: res.emailAddress,
                uid: res.id,
                provider: "linkedIN",
                image: res.pictureUrl
              };
              localStorage.setItem('_login_provider', 'linkedin');
              observer.next(userDetails);
              observer.complete();
            });
          });
          break;
      }
    });
  };
  AuthService.prototype.logout = function() {
    var provider = localStorage.getItem("_login_provider");
    return Observable.create(function(observer) {
      switch (provider) {
        case "google":
          var gElement = document.getElementById("gSignout");
          if (typeof(gElement) != 'undefined' && gElement != null) {
            gElement.remove();
          }
          var d = document,
            gSignout = void 0;
          var ref = d.getElementsByTagName('script')[0];
          gSignout = d.createElement('script');
          gSignout.src = "https://accounts.google.com/Logout";
          gSignout.type = "text/javascript";
          gSignout.id = "gSignout";
          localStorage.removeItem('_login_provider');
          observer.next(true);
          observer.complete();
          ref.parentNode.insertBefore(gSignout, ref);
          break;
        case "facebook":
          FB.logout(function(res) {
            localStorage.removeItem('_login_provider');
            observer.next(true);
            observer.complete();
          });
          break;
        case "linkedin":
          IN.User.logout(function() {
            localStorage.removeItem('_login_provider');
            observer.next(true);
            observer.complete();
          }, {});
          break;
      }
    });
  };
  AuthService.prototype._fetchGoogleUserDetails = function() {
    var currentUser = this.gauth.currentUser.get();
    var profile = currentUser.getBasicProfile();
    var idToken = currentUser.getAuthResponse().id_token;
    var accessToken = currentUser.getAuthResponse().access_token;
    return {
      token: accessToken,
      idToken: idToken,
      uid: profile.getId(),
      first_name: profile.getGivenName(),
      last_name: profile.getFamilyName(),
      email: profile.getEmail(),
      image: profile.getImageUrl(),
      provider: "google"
    };
  };
  AuthService.decorators = [
    {
      type: Injectable
    }
  ];
  /** @nocollapse */
  AuthService.ctorParameters = function() {
    return [];
  };
  return AuthService;
}());
export {
  AuthService
};
//# sourceMappingURL=auth.service.js.map

//# sourceMappingURL=auth.service.js.map

//# sourceMappingURL=auth.service.js.map
