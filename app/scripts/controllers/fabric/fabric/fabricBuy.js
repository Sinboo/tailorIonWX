/**
 * Created by wxb on 15/12/20.
 */
'use strict';

angular.module('tailorIon.controllers')
	.controller('FabricBuyCtrl', function($scope, fabricService, $location, $state, $ionicPopup, localStorageService, ionicToast, loginService) {
		var searchObject = $location.search();
		loginService.initUser(searchObject);
		
		if ($state.params.afterBuy) {
			$scope.formDatas = [
				{formData: {}}
			];
		}
		
		$scope.formDatas = [
			{formData: {}}
		];

		$scope.add = function () {
			console.log('yes');
			var tmp = {formData: {customerName: $scope.formDatas[0].formData.customerName}};
			$scope.formDatas.push(tmp);
			console.log($scope.formDatas);
		};

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
			for (var i = 0; i < $scope.formDatas.length; i++) {
				if (!$scope.formDatas[i].formData.product) {ionicToast.show('请选择面料品牌!', 'middle', false, 2000);return false;}
			}
			return true;
		};

		$scope.nextStep = function () {
			console.log($scope.formDatas);
			$state.go('fabric.fabricBuyDetail', {itemList: $scope.formDatas})
		};
		
		$scope.deleteFabric = function (index) {
			$ionicPopup.confirm({
				title: '删除面料',
				template: '确定删除此块面料?',
				cancelText: '取消',
				okText: '确定'
			}).then(function(res) {
				if (res) {
					if ($scope.formDatas.length > 1) {
						$scope.formDatas.splice(index, 1);
					}
					else {
						$scope.formDatas = [
							{formData: {}}
						];
					}
				}
			});
		}
		
	});
