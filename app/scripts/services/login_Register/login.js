'use strict';

angular.module('tailorIon')
  .factory('loginUrl', function (publicFunc) {
    var prefix = '/api/v1/';
    var url = {
      login: {
        url: 'login',
        method: 'POST'
      },
      change_password: {
        url: 'account/{ID}/passwd',
        method: 'PUT'
      }
    };
    return publicFunc.urlAddPrefix(url, prefix);
  })
  .service('loginService', function (httpService, loginUrl, localStorageService) {
    this.login = function (postData) {
      return httpService.http(postData, loginUrl.login, {})
    };
    this.initUser = function (searchObject) {
      console.log('searchObject', searchObject);
      if (searchObject && _.has(searchObject, 'mNumber') && _.has(searchObject, 'openId')) {
        var authData = {};
        // authData.merchantNumber = 'AAAE';
        authData.merchantNumber = searchObject['mNumber'];
        // authData.token = 'myToken';
        authData.token = searchObject['openId'];
        authData.CLIENT = 4;
        localStorageService.cookie.set('user', authData);
        console.log(localStorageService.cookie.get('user', authData));
      }
      
      // if(!localStorageService.cookie.get('user')){
      //   localStorageService.cookie.set('user', {anonymous: true});
      // }
      // if(localStorageService.cookie.get('user') && (new Date().getDate() - localStorageService.cookie.get('user').lastLoginTime ) > 7) {
      //   localStorageService.cookie.set('user', {anonymous: true});
      // }
    };
    this.changePassword = function (queryParams) {
      return httpService.http({}, loginUrl.change_password, queryParams)
    }
  });
