/**
 * Created by wxb on 15/12/20.
 */
'use strict';

angular.module('tailorIon.controllers')
	.controller('FabricSearchCtrl', function($scope, fabricService, $location, $state, $ionicPopup, localStorageService, loginService) {
		var searchObject = $location.search();
		loginService.initUser(searchObject);
		
		$scope.formData = {};
		
		$scope.searchFabric = function (formData) {
			var param = {};
			param.ID = localStorageService.cookie.get('user').merchantNumber;
			param.color = formData.color == "" ? undefined : formData.color;
			param.productNumber = formData.productNumber == "" ? undefined : formData.productNumber;
			param = JSON.parse(JSON.stringify(param));
			fabricService.searchFabric(param).then(function(data){
				if (data && data.success == true) {
					$scope.queriedProducts = data.data;
					if ($scope.queriedProducts.length > 0) {
						$state.go('fabric.fabricSearchResult', {itemList: $scope.queriedProducts})
					}
					else {
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
		
	});
