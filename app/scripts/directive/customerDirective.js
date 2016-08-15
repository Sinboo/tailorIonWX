/**
 * Created by wxb on 16/6/22.
 */
'use strict';

angular.module('tailorIon.directives')
  .directive('aDisabled', function() {
    return {
      compile: function(tElement, tAttrs, transclude) {
        //Disable ngClick
        tAttrs["ngClick"] = "!("+tAttrs["aDisabled"]+") && ("+tAttrs["ngClick"]+")";

        //Toggle "disabled" to class when aDisabled becomes true
        return function (scope, iElement, iAttrs) {
          scope.$watch(iAttrs["aDisabled"], function(newValue) {
            if (newValue !== undefined) {
              iElement.toggleClass("disabled", newValue);
            }
          });

          //Disable href on click
          iElement.on("click", function(e) {
            if (scope.$eval(iAttrs["aDisabled"])) {
              e.preventDefault();
            }
          });
        };
      }
    };
  })
  .directive('heightBind', function() {
    return {
      scope: {
        heightValue: '='
      },
      link: function($scope, $element) {
        $scope.$watch(function() {
          $scope.heightValue = $element.height();
        });
      }
    }
})