angular.module('npmalerts', ['ui.bootstrap'])
	.controller('SignUpCtrl', ['$scope', '$http', '$location', 'Subscription', function ($scope, $http, $location, subscription) {
		$scope.alerts = [];

		$scope.email = ($location.search()).email;
		$scope.url = ($location.search()).repo;

		$scope.isAdding = !($scope.email && $scope.url);

		$scope.displayAlert = function(msg) {
			$scope.alerts.push({type: 'danger', msg: msg });
		};

		$scope.displaySuccess = function(msg) {
			$scope.alerts.push({type: 'success', msg: msg });
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
			$scope.alerts = [];
			if ($scope.isAdding) {
				$scope.submitWatch();
			} else {
				$scope.submitUnwatch();
			}
		};

		$scope.submitWatch = function() {
			subscription.add($scope.email, $scope.url, !!$scope.ignorePatches)
				.success(function(){
					$scope.url = '';
					$scope.displaySuccess('Done! Now when there\'s a new package version available we\'ll let you know.');
				})
				.error(function(data) {
					ga('send', 'exception', { 'exDescription': 'SignupError' });

					_.each(data.messages, $scope.displayAlert);
				});
		};

		$scope.submitUnwatch = function() {
			subscription.remove($scope.email, $scope.url)
				.success(function(){
					$scope.url = '';
					$scope.displaySuccess('Done! You won\'t receive any more notifications about that project.');
				})
				.error(function(data) {
					ga('send', 'exception', { 'exDescription': 'RemoveSubscriptionError' });

					_.each(data.messages, $scope.displayAlert);
				});
		};
	}]);