/**
 * Created by wxb on 15/12/20.
 */
'use strict';

angular.module('tailorIon.controllers')
	.controller('CoopModifyAddressCtrl', function($scope, fabricService, $location, dataSetterGetter, noBackGoTo, $state, $ionicPopup, localStorageService, ionicToast, PAGE_SIZE, toaster, loginService) {
    var searchObject = $location.search();
    loginService.initUser(searchObject);
    
    $scope.$on("$ionicView.enter", function(event, data){
      if (dataSetterGetter.get('detailAddress')) {
        angular.forEach($scope.addresses, function (item) {
          if (item.number == dataSetterGetter.get('detailAddress').number) {
            item = dataSetterGetter.get('detailAddress');
          }
        });
      }
    });
    
    if ($state.current.name == 'fabric.coopModifyAddressFactory') {
      $scope.choosedType = 0;
    }
    else if ($state.current.name == 'fabric.coopModifyAddressMe') {
      $scope.choosedType = 1;
    }
    else if ($state.current.name == 'fabric.coopModifyAddressOther') {
      $scope.choosedType = 2;
    }
    
    
    

    $scope.noBackGoTo = noBackGoTo;

    $scope.addressType = {
      1: '我的地址', 2: '其他地址'
		};
    $scope.providerId = localStorageService.cookie.get('user').merchantNumber;

    $scope.addresses = [];
    $scope.noMoreItemsAvailable = false;
    var pageIndex = 0;
    var param = {};

    $scope.getAddresses = function (pageIndex, choosedType) {
      param.page = pageIndex;
      param.pageSize = PAGE_SIZE;
      param.ID = $scope.providerId;
      var queryParams = JSON.parse(JSON.stringify(param));
      if (choosedType == 0) {
        fabricService.getFactoryAddress(queryParams).then(function (data) {
          if (data && data.success == true) {
            var newAddresses = data.data.content;
            $scope.addresses = $scope.addresses.concat(newAddresses);
            console.log($scope.addresses);
            if ( data.data.last == true ) {
              $scope.noMoreItemsAvailable = true;
              toaster.pop('warning', '最后一屏数据');
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }
          }
          else if (data && data.success == false) {
            toaster.pop('error', data.error.message);
          }
        }).finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }
      else if (choosedType == 1) {
        queryParams.addressType = 1;
        fabricService.getAddressBook(queryParams).then(function (data) {
          if (data && data.success == true) {
            var newAddresses = data.data.content;
            $scope.addresses = $scope.addresses.concat(newAddresses);
            console.log($scope.addresses);
            if ( data.data.last == true ) {
              $scope.noMoreItemsAvailable = true;
              toaster.pop('warning', '最后一屏数据');
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }
          }
          else if (data && data.success == false) {
            toaster.pop('error', data.error.message);
          }
        }).finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }
      else if (choosedType == 2) {
        queryParams.addressType = 2;
        fabricService.getAddressBook(queryParams).then(function (data) {
          if (data && data.success == true) {
            var newAddresses = data.data.content;
            $scope.addresses = $scope.addresses.concat(newAddresses);
            console.log($scope.addresses);
            if ( data.data.last == true ) {
              $scope.noMoreItemsAvailable = true;
              toaster.pop('warning', '最后一屏数据');
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }
          }
          else if (data && data.success == false) {
            toaster.pop('error', data.error.message);
          }
        }).finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }

    };

    $scope.loadMore = function () {
      $scope.getAddresses(pageIndex, $scope.choosedType);
      pageIndex = pageIndex + 1;
    };

    $scope.loadMore();

    $scope.doRefresh = function () {
      $scope.addresses = [];
      pageIndex = 0;
      $scope.getAddresses(0, $scope.choosedType);
      pageIndex = pageIndex + 1;
      $scope.noMoreItemsAvailable = false;
    };

    $scope.modifyAddress = function (formData) {
      $state.go('fabric.coopModifyAddressDetail', {formData: formData, state: $state.current.name})
    };


		
	});
