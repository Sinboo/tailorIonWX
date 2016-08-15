/**
 * Created by wxb on 15/12/20.
 */
'use strict';

angular.module('tailorIon.controllers')
	.controller('CoopModifyAddressDetailCtrl', function($scope, fabricService, commonService, $state, dataSetterGetter, $ionicPopup, localStorageService, ionicToast, PAGE_SIZE, toaster) {
    dataSetterGetter.set('detailAddress', undefined);

    $scope.formData = $state.params.formData;
    $scope.formData.phone = parseInt($scope.formData.phone);
    $scope.formData.zip = parseInt($scope.formData.zip);
    $scope.formData.cityObj = {};
    $scope.formData.division = {};
    $scope.formData.cityObj.name = $scope.formData.city;
    $scope.formData.cityObj.number = $scope.formData.cityNumber;
    $scope.formData.division.name = $scope.formData.province;
    $scope.formData.division.number = $scope.formData.provinceNumber;

    if ($scope.formData.addressType == 1) {
      $scope.formData.addressType = {type: 0, name: '工厂地址' };
    }
    if ($scope.formData.addressType == 2 && $scope.formData.type ==1) {
      $scope.formData.addressType = {type: 1, name: '我的地址' };
    }
    if ($scope.formData.addressType == 2 && $scope.formData.type ==2) {
      $scope.formData.addressType = {type: 2, name: '其他地址' };
    }

    console.log($scope.formData);


    $scope.divisions = localStorageService.get('divisions');
    if (!$scope.divisions) {
      baseService.getDivision().then(function (data) {
        if (data && data.data.length>0) {
          $scope.divisions = data.data;
          localStorageService.set('divisions', data.data);
        }
      });
    }

    $scope.addressTypes = [
      {type: 0, name: '工厂地址' },
      {type: 1, name: '我的地址' },
      {type: 2, name: '其他地址' }
    ];

    $scope.mustInputErrorTips = {
      required: '请填写必填项'
    };

    $scope.getFabrics = function (productNumber, color) {
      var param = {};
      param.ID = localStorageService.cookie.get('user').merchantNumber;
      param.color = color == "" ? undefined : color;
      param.productNumber = productNumber == "" ? undefined : productNumber;
      param = JSON.parse(JSON.stringify(param));
      fabricService.searchFabric(param).then(function(data){
        if (data && data.success == true) {
          $scope.queriedProducts = data.data;
          if ($scope.queriedProducts.length == 0) {
            $ionicPopup.alert({
              title: '提示',
              template: '没有查询到相关产品!'
            });
          }
        }
        else if (data && data.success == false) {
          toaster.pop('error', data.error.message);
        }
      });
    };

    $scope.validate = function () {
      if (!$scope.formData.addressType) {ionicToast.show('请选择地址类型!', 'middle', false, 2000);return false;}
      if (!$scope.formData.division) {ionicToast.show('请选择省、直辖市!', 'middle', false, 2000);return false;}
      if (!$scope.formData.cityObj) {ionicToast.show('请选择地级市、区!', 'middle', false, 2000);return false;}
      if (!commonService.regMobile($scope.formData.phone)) {ionicToast.show('请填写正确的手机号!', 'middle', false, 2000);return false;}
      return true;
    };

    $scope.submitAddress = function () {
      console.log($scope.formData);
      var postData = {};
      angular.copy($scope.formData, postData);
      postData.city = postData.cityObj.name;
      postData.cityNumber = postData.cityObj.number;
      postData.province = postData.division.name;
      postData.provinceNumber = postData.division.number;
      delete postData.cityObj;
      delete postData.division;
      if ($scope.formData.addressType.type == 0 ) {
        delete postData.addressType;
        fabricService.updateFactoryAddress(localStorageService.cookie.get('user').merchantNumber, $scope.formData.number, postData).then(function (data) {
          if (data && data.success == true) {
            toaster.pop('success', '地址修改成功!');
            dataSetterGetter.set('detailAddress', $scope.formData);
            $state.go($state.params.state)
          }
          else if (data && data.success == false) {
            toaster.pop('error', data.error.message);
          }
        })
      }
      else {
        postData.type = postData.addressType.type;
        delete postData.addressType;
        fabricService.updateAddressBook(localStorageService.cookie.get('user').merchantNumber, $scope.formData.number, postData).then(function (data) {
          if (data && data.success == true) {
            toaster.pop('success', '地址修改成功!');
            dataSetterGetter.set('detailAddress', $scope.formData);
            $state.go($state.params.state)
          }
          else if (data && data.success == false) {
            toaster.pop('error', data.error.message);
          }
        })
      }
    }


		

		
	});
