/**
 * Created by wxb on 15/12/20.
 */
'use strict';

angular.module('tailorIon.controllers')
	.controller('CoopApplicationCtrl', function($scope, publicFunc, $location, commonService, fabricService, $state, $ionicPopup, localStorageService, ionicToast, SHOP_TYPE, toaster, loginService) {
		var searchObject = $location.search();
		loginService.initUser(searchObject);
		
		$scope.formData = {};
		$scope.providerId = localStorageService.cookie.get('user').merchantNumber;
		$scope.shopTypes = publicFunc.mapToArray(SHOP_TYPE);
		console.log($scope.shopTypes)

		$scope.clientBases = [
			'高端', '中高端', '中端', '中低端', '低端'
		];

		$scope.mustInputErrorTips = {
			required: '请填写必填项'
		};



		$scope.validate = function () {
			if (!commonService.regMobile($scope.formData.phone)) {ionicToast.show('请填写正确的手机号!', 'middle', false, 2000);return false;}
			return true;
		};

		$scope.submit = function () {
			var postData = {};
			angular.copy($scope.formData, postData);
			postData.shopType = postData.shopType.shortName;
			postData = JSON.parse(JSON.stringify(postData));
			fabricService.applyShop($scope.providerId, postData).then(function (data) {
				if (data && data.success == true) {
					toaster.pop('success', '采购合作申请提交成功');
					$scope.formData = {};
				}
				else if (data && data.success == false) {
					toaster.pop('error', data.error.message);
				}
			})

		}


		

		
	});
