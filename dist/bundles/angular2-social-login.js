(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Observable')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Observable'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.angular2SocialLogin = {}),global.ng.core,global.Rx));
}(this, (function (exports,core,Observable) { 'use strict';

var AuthService = (function () {
    function AuthService() {
    }
    AuthService.prototype.login = function (provider) {
        var _this = this;
        return Observable.Observable.create(function (observer) {
            switch (provider) {
                case "google":
                    if (typeof (_this.gauth) == "undefined") {
                        _this.gauth = gapi.auth2.getAuthInstance();
                    }
                    if (!_this.gauth.isSignedIn.get()) {
                        _this.gauth.signIn().then(function () {
                            localStorage.setItem('_login_provider', 'google');
                            observer.next(_this._fetchGoogleUserDetails());
                            observer.complete();
                        });
                    }
                    else {
                        localStorage.setItem('_login_provider', 'google');
                        observer.next(_this._fetchGoogleUserDetails());
                        observer.complete();
                    }
                    break;
                case "facebook":
                    FB.getLoginStatus(function (response) {
                        if (response.status === "connected") {
                            FB.api('/me?fields=first_name,last_name,email,picture', function (res) {
                                if (!res || res.error) {
                                    observer.error(res.error);
                                }
                                else {
                                    var userDetails = {
                                        first_name: res.first_name,
                                        last_name: res.last_name,
                                        email: res.email,
                                        uid: res.id,
                                        provider: "facebook",
                                        image: res.picture.data.url,
                                        token: response.authResponse.accessToken,
                                        idToken: '',
                                    };
                                    localStorage.setItem('_login_provider', 'facebook');
                                    observer.next(userDetails);
                                    observer.complete();
                                }
                            });
                        }
                        else {
                            FB.login(function (response) {
                                if (response.status === "connected") {
                                    FB.api('/me?fields=first_name,last_name,email,picture', function (res) {
                                        if (!res || res.error) {
                                            observer.error(res.error);
                                        }
                                        else {
                                            var userDetails = {
                                                first_name: res.first_name,
                                                last_name: res.last_name,
                                                email: res.email,
                                                uid: res.id,
                                                provider: "facebook",
                                                image: res.picture.data.url,
                                                token: response.authResponse.accessToken,
                                                idToken: '',
                                            };
                                            localStorage.setItem('_login_provider', 'facebook');
                                            observer.next(userDetails);
                                            observer.complete();
                                        }
                                    });
                                }
                            }, { scope: 'email' });
                        }
                    });
                    break;
                case "linkedin":
                    IN.User.authorize(function () {
                        IN.API.Raw("/people/~:(id,first-name,last-name,email-address,picture-url)").result(function (res) {
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
    AuthService.prototype.logout = function () {
        var provider = localStorage.getItem("_login_provider");
        return Observable.Observable.create(function (observer) {
            switch (provider) {
                case "google":
                    var gElement = document.getElementById("gSignout");
                    if (typeof (gElement) != 'undefined' && gElement != null) {
                        gElement.remove();
                    }
                    var d = document, gSignout = void 0;
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
                    FB.logout(function (res) {
                        localStorage.removeItem('_login_provider');
                        observer.next(true);
                        observer.complete();
                    });
                    break;
                case "linkedin":
                    IN.User.logout(function () {
                        localStorage.removeItem('_login_provider');
                        observer.next(true);
                        observer.complete();
                    }, {});
                    break;
            }
        });
    };
    AuthService.prototype._fetchGoogleUserDetails = function () {
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
        { type: core.Injectable },
    ];
    /** @nocollapse */
    AuthService.ctorParameters = function () { return []; };
    return AuthService;
}());

var Angular2SocialLoginModule = (function () {
    function Angular2SocialLoginModule() {
    }
    Angular2SocialLoginModule.loadProvidersScripts = function (config) {
        var loadProvidersScripts = {
            google: function (info) {
                var d = document, gJs, ref = d.getElementsByTagName('script')[0];
                gJs = d.createElement('script');
                gJs.async = true;
                gJs.src = "//apis.google.com/js/platform.js";
                gJs.onload = function () {
                    gapi.load('auth2', function () {
                        gapi.auth2.init({
                            client_id: info["clientId"],
                            scope: 'email'
                        });
                    });
                };
                ref.parentNode.insertBefore(gJs, ref);
            },
            linkedin: function (info) {
                var lIN, d = document, ref = d.getElementsByTagName('script')[0];
                lIN = d.createElement('script');
                lIN.async = false;
                lIN.src = "//platform.linkedin.com/in.js";
                lIN.text = ("api_key: " + info["clientId"]).replace("\"", "");
                ref.parentNode.insertBefore(lIN, ref);
            },
            facebook: function (info) {
                var d = document, fbJs, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                fbJs = d.createElement('script');
                fbJs.id = id;
                fbJs.async = true;
                fbJs.src = "//connect.facebook.net/en_US/sdk.js";
                fbJs.onload = function () {
                    FB.init({
                        appId: info["clientId"],
                        status: true,
                        cookie: true,
                        xfbml: true,
                        version: info["apiVersion"]
                    });
                };
                ref.parentNode.insertBefore(fbJs, ref);
            }
        };
        Object.keys(config).forEach(function (provider) {
            loadProvidersScripts[provider](config[provider]);
        });
    };
    Angular2SocialLoginModule.decorators = [
        { type: core.NgModule, args: [{
                    providers: [AuthService]
                },] },
    ];
    /** @nocollapse */
    Angular2SocialLoginModule.ctorParameters = function () { return []; };
    return Angular2SocialLoginModule;
}());

exports.Angular2SocialLoginModule = Angular2SocialLoginModule;
exports.AuthService = AuthService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
