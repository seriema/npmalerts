angular.module('npmalerts', ['ui.bootstrap']);
function SignUpCtrl($scope, $http, $location) {
    $scope.alerts = [];

    $scope.email = ($location.search()).email;
    $scope.url = ($location.search()).repo;

    $scope.isAdding = !($scope.email && $scope.url);

    $scope.displayAlert = function(msg) {
        $scope.alerts.push({type: 'danger', msg: msg });
    };

    $scope.showWatch = function() {
        $scope.isAdding = true;
    };

    $scope.showUnwatch = function() {
        $scope.isAdding = false;
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.submit = function() {
        if ($scope.isAdding) {
            $scope.submitWatch();
        } else {
            $scope.submitUnwatch();
        }
    };

    $scope.submitWatch = function() {
        $scope.alerts = [];

        var data = { email: $scope.email, repo: $scope.url, patch: !!$scope.ignorePatches };
        $http.put('/api/subscriptions', data).success(function(){
            ga('send', 'event', 'subscriptions', 'signup');

            $scope.url = '';
            $scope.alerts.push({type: 'success', msg: 'Done! Now when there\'s a new package version available we\'ll let you know.'});
        }).error(function(data) {
            ga('send', 'exception', { 'exDescription': 'SignupError' });

            if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    $scope.displayAlert(data[i].msg);
                }
            } else {
                $scope.displayAlert(data);
            }
        });
    };

    $scope.submitUnwatch = function() {
        $scope.alerts = [];

        $http.delete('/api/subscriptions?email='+$scope.email+'&repo='+$scope.url).success(function(){
            ga('send', 'event', 'subscriptions', 'remove');

            $scope.url = '';
            $scope.alerts.push({type: 'success', msg: 'Done! You won\'t receive any more notifications about that project.'});
        }).error(function(data) {
            ga('send', 'exception', { 'exDescription': 'RemoveSubscriptionError' });

            if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    $scope.displayAlert(data[i].msg);
                }
            } else {
                $scope.displayAlert(data);
            }
        });
    };
}