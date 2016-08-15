/**
 * Created by wxb on 15/12/20.
 */
'use strict';

angular.module('tailorIon.controllers')
	.controller('FabricBuyDetailCtrl', function($scope, fabricService, $state, big, $ionicPopup, localStorageService, ionicToast, upyun, rfc4122, $ionicLoading, toaster, commonService) {
		$scope.formData = {};
		$scope.itemList = $state.params.itemList;
		$scope.remark = '';
		$scope.big = big;
		$scope.truncateDecimals = commonService.truncateDecimals;


		var totalPrice = []
		angular.forEach($scope.itemList, function (item) {
      if (item.formData.remark) {
        $scope.remark = $scope.remark + item.formData.remark + '\n';
      }
			totalPrice.push(big.make(item.formData.quantity).times(item.formData.product.price));
		});
		$scope.fabricFee = big.sum(totalPrice);

		$scope.providerId = localStorageService.cookie.get('user').merchantNumber;

		fabricService.addressBook($scope.providerId).then(function (data) {
			if (data && data.success == true) {
				$scope.addresses = data.data;
				console.log($scope.addresses)
			}
			else if (data && data.success == false) {
				toaster.pop('error', data.error.message);
			}
		});

    fabricService.getPayment($scope.providerId).then(function (data) {
      console.log(data)
    });


		$scope.validate = function () {
			// if (!$scope.address) {ionicToast.show('请选择面料品牌!', 'middle', false, 2000);return false;}
			return true;
		};

		$scope.generate = function () {
			$scope.generated = true;
			console.log($scope.formData.address);
		};
		
		$scope.dateNow = new Date().getTime();

		//choose img
		$scope.openFileDialog = function() {
			ionic.trigger('click', {
				target: document.getElementById('file')
			});
		};

		$(document).on("change", ".uploadImage", function(e){
			e.preventDefault();
			$scope.upload();
		});

		upyun.on('uploading', function(progress) {
			$ionicLoading.show({
				template: '<ion-spinner></ion-spinner><br/>' + progress + "%",
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			if (progress === 100) {
				$ionicLoading.hide();
			}
		});


		//upload image
		$scope.upload = function() {
			var uuidString = rfc4122.v4();
			var last = '{.suffix}';
			var imgUrl = '/' + uuidString + last;
			upyun.set('save-key', imgUrl);
			upyun.upload('uploadForm', function(err, response, image){
				if (err) console.error(err);
				if (image.code === 200 && image.message === 'ok') {
					$scope.image = {};
					$scope.image.ready = true;
					$scope.image.url = image.absUrl;
					console.log($scope.image.url)
				}
				$scope.$apply();
			});
		};

		$scope.deleteImage = function () {
			$ionicPopup.confirm({
				title: '删除图片?',
				template: '您想要删除图片或更换图片?',
				buttons: [{ text: '取消' }, { text: '确认', type: 'button-positive', onTap: function(e) {return 'ok'}}]
			}).then(function(res) {
				console.log(res)
				if(res == 'ok') {
					$scope.image.url = "";
					$scope.image.ready = false;
				}
				else {}
			});
		};

		fabricService.getPayment($scope.providerId).then(function (data) {
			$scope.payment = data.data;
			console.log($scope.payment)
		});

    $scope.buyFabric = function () {
      var postData = {};
      postData.fabricFee = $scope.fabricFee;
      postData.totalPrice = $scope.fabricFee;
			postData.totalPrice4CNY = postData.totalPrice.times($scope.payment.rate == null ? 1 : $scope.payment.rate);
			postData.totalPrice4CNY = commonService.truncateDecimals(postData.totalPrice4CNY.toFixed(4), 2);
			postData.remark = $scope.remark == '' ? undefined : $scope.remark;
      postData.voucherUrl = $scope.image.url;
      postData.items = [];
      angular.forEach($scope.itemList, function (item) {
        var postItem = {};
        postItem.brand = item.formData.product.brand.number;
        postItem.itemPrice = item.formData.quantity * item.formData.product.price;
        postItem.unitPrice = item.formData.product.price;
        postItem.customerName = item.formData.customerName;
        postItem.breadth = item.formData.product.breadth;
        postItem.color = item.formData.product.color;
        postItem.colorDesc = item.formData.product.colorDesc;
        postItem.composition = item.formData.product.composition;
        postItem.figure = item.formData.product.figure;
        postItem.productNumber = item.formData.product.productNumber;
        postItem.quantity = item.formData.quantity;
        postItem.remark = item.formData.product.remark;
        postItem.yarnCount = item.formData.product.yarnCount;
        postData.items.push(postItem);
      });

      if ($scope.formData.address.addressType == 1) {
        postData.rcvFactory = {};
        postData.rcvFactory.number = $scope.formData.address.number;
      }
      if ($scope.formData.address.addressType == 2) {
        postData.rcvAddress = {};
        postData.rcvAddress.number = $scope.formData.address.number;
      }
      postData = JSON.parse(JSON.stringify(postData));
      fabricService.buyFabric($scope.providerId, postData).then(function (data) {
        if (data && data.success == true) {
          toaster.pop('success', '面料购买完成,请等待面料商发货.');
          $state.go('fabric.fabricBuy', {afterBuy: true})
        }
        else if (data && data.success == false) {
          toaster.pop('error', data.error.message);
        }
      })

    }


	});
