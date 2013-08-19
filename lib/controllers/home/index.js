angular.module('npmalerts', ['ui.bootstrap']);
function SignUpCtrl($scope, $http) {
    $scope.alerts = [];

    $scope.addAlert = function() {
        $scope.alerts.push({msg: "Another alert!"});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.submitWatch = function() {
        var data = { email: $scope.email, repo: $scope.url };
        $scope.alerts = [];

        $http.put('/api/subscriptions', data).success(function(){
            $scope.alerts.push({type: 'success', msg: 'Done! Now when there\'s a new package version available we\'ll let you know.'});
        }).error(function(data) {
            if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    $scope.alerts.push({type: 'error', msg: data[i].msg });
                }
            } else {
                $scope.alerts.push({type: 'error', msg: data });
            }
        });
    };
}