function controller($scope,$http) {
	var site = "https://api.parse.com/1/classes/";
	$scope.etudiant;

	$http.get(site+"Classes",{
		headers:{
			'X-Parse-Application-Id': appId,
			'X-Parse-REST-API-Key':apiKey
		}})
	.success(function(response) {$scope.classes = response.results });

	$http.get(site+"Groupes",{
		headers:{
			'X-Parse-Application-Id': appId,
			'X-Parse-REST-API-Key':apiKey
		}})
	.success(function(response) { $scope.groupes = response.results });

	$http.get(site+"Etudiants",{
		headers:{
			'X-Parse-Application-Id': appId,
			'X-Parse-REST-API-Key':apiKey
		}})
	.success(function(response) { $scope.etudiants = response.results });

	$scope.change = function() {
		$scope.classe = angular.copy($scope.classes[$scope.selectedClasse]);
	};

	$scope.change2 = function() {

		$scope.groupe = angular.copy($scope.groupes[$scope.selectedGroupe]);
	};

	$scope.change3 = function() {

		$scope.etudiant2 = angular.copy($scope.etudiants[$scope.selectedEtudiant]);
	};

	$scope.select = function(i) {

		$scope.etudiant2 = angular.copy($scope.etudiants[i]);
	};

	$scope.send = function(){
		$scope.etudiant.groupeId = $scope.groupe.objectId;
		$http.post(site+"Etudiants",$scope.etudiant,{
			headers:{
				'X-Parse-Application-Id': appId,
				'X-Parse-REST-API-Key':apiKey
			}})
		.success(function(response) {
			$http.get(site+"Etudiants",{
				headers:{
					'X-Parse-Application-Id': appId,
					'X-Parse-REST-API-Key':apiKey
				}})
			.success(function(response) { 
				$scope.etudiants = response.results;				
				$scope.etudiant.nom ="";
				$scope.etudiant.prenom ="";
			});

		});
	}

	$scope.edit = function(){
		$http.put(site+"Etudiants"+"/"+$scope.etudiant2.objectId,$scope.etudiant2,{
			headers:{
				'X-Parse-Application-Id': appId,
				'X-Parse-REST-API-Key':apiKey
			}})
		.success(function(response) { 
			$http.get(site+"Etudiants",{
				headers:{
					'X-Parse-Application-Id': appId,
					'X-Parse-REST-API-Key':apiKey
				}})
			.success(function(response) { $scope.etudiants = response.results });

		});
	}

	$scope.delete = function(){
		$http.delete(site+"Etudiants"+"/"+$scope.etudiant2.objectId,{
			headers:{
				'X-Parse-Application-Id': appId,
				'X-Parse-REST-API-Key':apiKey
			}})
		.success(function(response) { 
			$scope.etudiant2.nom ="";
			$scope.etudiant2.prenom ="";
			$http.get(site+"Etudiants",{
				headers:{
					'X-Parse-Application-Id': appId,
					'X-Parse-REST-API-Key':apiKey
				}})
			.success(function(response) { $scope.etudiants = response.results });

		});
	}





}