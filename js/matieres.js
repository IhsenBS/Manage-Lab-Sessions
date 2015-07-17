function controller($scope,$http) {
  var site = "https://api.parse.com/1/classes/";
  $scope.matiere;
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

  $scope.change = function() {
    $scope.classe = angular.copy($scope.classes[$scope.selected]);
  };

    $scope.select = function(i) {
    $scope.matiere2 = angular.copy($scope.matieres[i]);
  };



  $scope.send = function(){
    $scope.matiere.classeId = $scope.classe.objectId;
    $http.post(site+"Matieres",$scope.matiere,{
      headers:{
        'X-Parse-Application-Id': appId,
        'X-Parse-REST-API-Key':apiKey
      }})
    .success(function(response) {
      $http.get(site+"Matieres",{
        headers:{
          'X-Parse-Application-Id': appId,
          'X-Parse-REST-API-Key':apiKey
        }})
      .success(function(response) { $scope.matieres = response.results });

    });
  }

  $scope.edit = function(){
    $http.put(site+"Matieres"+"/"+$scope.matiere2.objectId,$scope.matiere2,{
      headers:{
        'X-Parse-Application-Id': appId,
        'X-Parse-REST-API-Key':apiKey
      }})
    .success(function(response) { 
      $http.get(site+"Matieres",{
        headers:{
          'X-Parse-Application-Id': appId,
          'X-Parse-REST-API-Key':apiKey
        }})
      .success(function(response) { $scope.matieres = response.results });

    });
  }

  $scope.delete = function(){
    $http.delete(site+"Matieres"+"/"+$scope.matiere2.objectId,{
      headers:{
        'X-Parse-Application-Id': appId,
        'X-Parse-REST-API-Key':apiKey
      }})
    .success(function(response) { 
      $scope.matiere2.nom ="";
      $http.get(site+"Matieres",{
        headers:{
          'X-Parse-Application-Id': appId,
          'X-Parse-REST-API-Key':apiKey
        }})
      .success(function(response) { $scope.matieres = response.results });

    });
  }

}