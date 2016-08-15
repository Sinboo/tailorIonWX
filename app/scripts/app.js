// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tailorIon.controllers', []);
angular.module('tailorIon.directives', []);

angular.module('gitdao', []);

angular
  .module('tailorIon', [
    'ionic',
    'toaster',
    'gitdao',
    'Big',
    'upyun',
    'uuid',
    'wilddog',
    'ion-sticky',
    'ionic-table',
    'angularValidateWithToast',
    'ionic-toast',
    'ionic.ui.modalService',
    'ionic-datepicker',
    'ionic-modal-select',
    'tailorIon.controllers',
    'tailorIon.directives',
    'ionic-table',
    'LocalStorageModule',
    'config'
  ])

.run(function($ionicPlatform, $rootScope, localStorageService, loginService, $location, $state, $ionicLoading) {
  loginService.initUser();

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeSuccess',
    function (event, toState, toParams, fromState, fromParams) {
      $ionicLoading.hide();

    });

  $rootScope.$on('$stateChangeError',
    function (event, toState, toParams, fromState, fromParams, error) {
      if (error.state) {
        $state.go('error');
      }
      if (error == "Not Authorized") {
        $state.go("notAuthorized");
      }
    });

  $rootScope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams) {
      // console.log(fromState, toState)

      if (toState.name == 'login') return;

      if (localStorageService.cookie.get('user') == undefined || localStorageService.cookie.get('user').anonymous) {
        event.preventDefault();
        $state.go("login", {from: fromState.name});
      }

      $ionicLoading.hide();
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
    });
  
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: '加载中...'})
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide()
  });

})
  .config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      setLabel: '确定',
      todayLabel: "今天",
      closeLabel: "取消",
      mondayFirst: false,
      weeksList: ["日", "一", "二", "三", "四", "五", "六"],
      monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: false,
      dateFormat: 'yyyy MM dd',
      closeOnSelect: true,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })
  .config(function (localStorageServiceProvider, $httpProvider) {
    localStorageServiceProvider
      .setPrefix('tailorIon');

    $httpProvider.interceptors.push('myHttpInterceptor');
    $httpProvider.interceptors.push('myHttpHeader');
    $httpProvider.defaults.withCredentials = true;

    // $httpProvider.interceptors.push(function($rootScope) {
    //   return {
    //     request: function(config) {
    //       $rootScope.$broadcast('loading:show');
    //       return config
    //     },
    //     response: function(response) {
    //       $rootScope.$broadcast('loading:hide');
    //       return response
    //     }
    //   }
    // })
  })
  .config(['upyunProvider',function(upyunProvider) {
    upyunProvider.config({
      form_api_secret: 'ZeJhPE68fuX7jRkPMeFXOOyBl40=',
      bucket: 'imtailor'
    });
  }])
  
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('fabric', {
      url: '/1',
      abstract: true,
      templateUrl: 'templates/common/fabric/fabricMenu.html',
      controller: 'FabricMenuCtrl'
      // resolve: {
      //   security:function($q, localStorageService) {
      //     if(localStorageService.cookie.get('user').merchantType !== 'FABRIC'){
      //       return $q.reject("Not Authorized");
      //     }
      //   }
      // }
    })
    .state('fabric.fabricSearch', {
      url: '/fabricSearch',
      views: {
        'fabric-search': {
          templateUrl: 'templates/fabric/fabricSearch.html',
          controller: 'FabricSearchCtrl'
        }
      }
    })
    .state('fabric.fabricSearchResult', {
      url: '/fabricSearchResult',
      views: {
        'fabric-search': {
          templateUrl: 'templates/fabric/detailPage/fabricSearchResult.html',
          controller: 'FabricSearchResultCtrl'
        }
      },
      params: {itemList: null}
    })
    
    .state('fabric.fabricBuy', {
      url: '/fabricBuy',
      views: {
        'fabric-buy': {
          templateUrl: 'templates/fabric/fabricBuy.html',
          controller: 'FabricBuyCtrl'
        }
      },
      params: {afterBuy: null}
    })
    .state('fabric.fabricBuyDetail', {
      url: '/fabricBuyDetail',
      views: {
        'fabric-buy': {
          templateUrl: 'templates/fabric/detailPage/fabricBuyDetail.html',
          controller: 'FabricBuyDetailCtrl'
        }
      },
      params: {itemList: null}
    })

    .state('fabric.coopApplication', {
      url: '/coopApplication',
      views: {
        'coop-application': {
          templateUrl: 'templates/coop/coopApplication.html',
          controller: 'CoopApplicationCtrl'
        }
      }
    })
    .state('fabric.coopSetAddress', {
      url: '/coopSetAddress',
      views: {
        'coop-setAddress': {
          templateUrl: 'templates/coop/coopSetAddress.html',
          controller: 'CoopSetAddressCtrl'
        }
      }
    })
    .state('fabric.coopModifyAddressFactory', {
      url: '/coopModifyAddressFactory',
      views: {
        'coop-modifyAddress': {
          templateUrl: 'templates/coop/coopModifyAddress.html',
          controller: 'CoopModifyAddressCtrl'
        }
      }
    })
    .state('fabric.coopModifyAddressMe', {
      url: '/coopModifyAddressMe',
      views: {
        'coop-modifyAddress': {
          templateUrl: 'templates/coop/coopModifyAddress.html',
          controller: 'CoopModifyAddressCtrl'
        }
      }
    })
    .state('fabric.coopModifyAddressOther', {
      url: '/coopModifyAddressOther',
      views: {
        'coop-modifyAddress': {
          templateUrl: 'templates/coop/coopModifyAddress.html',
          controller: 'CoopModifyAddressCtrl'
        }
      }
    })
    .state('fabric.coopModifyAddressDetail', {
      url: '/coopModifyAddressDetail',
      views: {
        'coop-modifyAddress': {
          templateUrl: 'templates/coop/coopModifyAddressDetail.html',
          controller: 'CoopModifyAddressDetailCtrl'
        }
      },
      params: {formData: null, state: null}
    })
    


  .state('error', {
    url: '^/err',
    templateUrl: 'templates/error.html'
  })
  .state('notAuthorized', {
    url: '^/notAuthorized',
    templateUrl: 'templates/notAuthorized.html'
  })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/1/fabricSearch');
});


