'use strict';

angular.module('tailorIon')
  .factory('fabricUrl', function (publicFunc) {
    var prefix = '/api/v1/supplier/';
    var url = {
      fabric_search: {
        url: 'wxStore/{ID}/fabric',
        method: 'GET'
      },
      address_book: {
        url: 'wxStore/{ID}/shop/addressBook',
        method: 'GET'
      },
      set_factoryAddress: {
        url: 'wxStore/{ID}/shop/addressBook/factory',
        method: 'POST'
      },
      update_factoryAddress: {
        url: 'wxStore/{ID}/shop/addressBook/factory/{FactoryID}',
        method: 'PUT'
      },
      set_addressBook: {
        url: 'wxStore/{ID}/shop/addressBook/address',
        method: 'POST'
      },
      update_addressBook: {
        url: 'wxStore/{ID}/shop/addressBook/address/{addressID}',
        method: 'PUT'
      },
      get_factoryAddress: {
        url: 'wxStore/{ID}/shop/addressBook/factory',
        method: 'GET'
      },
      get_addressBook: {
        url: 'wxStore/{ID}/shop/addressBook/address',
        method: 'GET'
      },
      buy_fabric: {
        url: 'wxStore/{merchantNumber}/purchase',
        method: 'POST'
      },
      apply_shop: {
        url: 'wxStore/{ID}/shop/apply',
        method: 'POST'
      },
      get_payment: {
        url: 'wxStore/{ID}',
        method: 'GET'
      }

    };
    return publicFunc.urlAddPrefix(url, prefix);
  })
  .service('fabricService', function (httpService, fabricUrl) {
    this.searchFabric = function (queryParams) {
      return httpService.http({}, fabricUrl.fabric_search, queryParams)
    };
    this.addressBook = function (ID) {
      return httpService.http({}, fabricUrl.address_book, {ID: ID})
    };
    this.setFactoryAddress = function (ID, data) {
      return httpService.http(data, fabricUrl.set_factoryAddress, {ID: ID})
    };
    this.updateFactoryAddress = function (ID, FactoryID, data) {
      return httpService.http(data, fabricUrl.update_factoryAddress, {ID: ID, FactoryID: FactoryID})
    };
    this.getFactoryAddress = function (queryParams) {
      return httpService.http({}, fabricUrl.get_factoryAddress, queryParams)
    };
    this.setAddressBook = function (ID, data) {
      return httpService.http(data, fabricUrl.set_addressBook, {ID: ID})
    };
    this.updateAddressBook = function (ID, addressID, data) {
      return httpService.http(data, fabricUrl.update_addressBook, {ID: ID, addressID: addressID})
    };
    this.getAddressBook = function (queryParams) {
      return httpService.http({}, fabricUrl.get_addressBook, queryParams)
    };
    this.buyFabric = function (ID, data) {
      return httpService.http(data, fabricUrl.buy_fabric, {merchantNumber: ID})
    };
    this.applyShop = function (ID, data) {
      return httpService.http(data, fabricUrl.apply_shop, {ID: ID})
    };
    this.getPayment = function (ID) {
      return httpService.http({}, fabricUrl.get_payment, {ID: ID})
    };


  });
