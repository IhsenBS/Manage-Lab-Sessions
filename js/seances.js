function controller($scope,$http) {
	var site = "https://api.parse.com/1/classes/";

	$http.get(site+"Classes",{
		headers:{
			'X-Parse-Application-Id': appId,
			'X-Parse-REST-API-Key':apiKey
		}})
	.success(function(response) {$scope.classes = response.results });

	$http.get(site+"Matieres",{
		headers:{
			'X-Parse-Application-Id': appId,
			'X-Parse-REST-API-Key':apiKey
		}})
	.success(function(response) { $scope.matieres = response.results });

	$http.get(site+"Seances",{
		headers:{
			'X-Parse-Application-Id': appId,
			'X-Parse-REST-API-Key':apiKey
		}})
	.success(function(response) { $scope.seances = response.results });

	$scope.change = function() {
		$scope.classe = angular.copy($scope.classes[$scope.selectedClasse]);
	};

	$scope.change2 = function() {

		$scope.matiere = angular.copy($scope.matieres[$scope.selectedMatiere]);
	};

	$scope.select = function(i) {

		$scope.seance2 = angular.copy($scope.seances[i]);
	};

	$scope.send = function(){
		$scope.seance.matiereId = $scope.matiere.objectId;
		$http.post(site+"Seances",$scope.seance,{
			headers:{
				'X-Parse-Application-Id': appId,
				'X-Parse-REST-API-Key':apiKey
			}})
		.success(function(response) {
			$http.get(site+"Seances",{
				headers:{
					'X-Parse-Application-Id': appId,
					'X-Parse-REST-API-Key':apiKey
				}})
			.success(function(response) { 
				$scope.seances = response.results;				
				$scope.seance.nom ="";
			});

		});
	}

	$scope.edit = function(){
		$http.put(site+"Seances"+"/"+$scope.seance2.objectId,$scope.seance2,{
			headers:{
				'X-Parse-Application-Id': appId,
				'X-Parse-REST-API-Key':apiKey
			}})
		.success(function(response) { 
			$http.get(site+"Seances",{
				headers:{
					'X-Parse-Application-Id': appId,
					'X-Parse-REST-API-Key':apiKey
				}})
			.success(function(response) { $scope.seances = response.results });

		});
	}

	$scope.delete = function(){
		$http.delete(site+"Seances"+"/"+$scope.seance2.objectId,{
			headers:{
				'X-Parse-Application-Id': appId,
				'X-Parse-REST-API-Key':apiKey
			}})
		.success(function(response) { 
			$scope.seance2.nom ="";
			$http.get(site+"Seances",{
				headers:{
					'X-Parse-Application-Id': appId,
					'X-Parse-REST-API-Key':apiKey
				}})
			.success(function(response) { $scope.seances = response.results });

		});
	}





}