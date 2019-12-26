const storage = new Storage('data-defaukt');

var StartApp = angular.module('StartApp', []);

var helpers = function() {
    var toDateIso = function(date) {
        return date.toISOString().substring(0, 10)
    };

    return {
        toDateIso: toDateIso
    };
}();

StartApp.factory('BackgroundApi', ['$http', function($http) {
    var get = function(date) {
        return $http({
            method: 'GET',
            url: '/background',
            params: {
                date: date
            }
        });
    };

    return {
        get: get
    }
}]);

StartApp.controller('LinksController', ['$scope', function($scope) {
    $scope.links = [];

    storage.get()
        .then(data => {
            $scope.linkGroups = data.linkGroups;
            $scope.$apply();
        });
}]);

StartApp.controller('Background', ['$scope', '$sce', 'BackgroundApi', function($scope, $sce, BackgroundApi) {
    storage.get()
        .then(data => {
            $scope.backgroundUrl = data.backgroundUrl;
            $scope.$apply();
        })

    $scope.press = (key) => {
        console.log(key);

        if (key.keyCode == 27) {
            $scope.hide = !$scope.hide;
        }

        if (key.keyCode == 37) {
            $scope.prevBackground();
        }

        if (key.keyCode == 39) {
            $scope.nextBackground();
        }
    };
}]);
