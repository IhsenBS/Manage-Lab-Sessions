function controller($scope,$http) {
  var site = "https://api.parse.com/1/classes/";
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

  $scope.change = function() {
    $scope.classe = angular.copy($scope.classes[$scope.selected]);
  };

    $scope.select = function(i) {
    $scope.groupe2 = angular.copy($scope.groupes[i]);
  };



  $scope.send = function(){
    $scope.groupe.classeId = $scope.classe.objectId;
    $http.post(site+"Groupes",$scope.groupe,{
      headers:{
        'X-Parse-Application-Id': appId,
        'X-Parse-REST-API-Key':apiKey
      }})
    .success(function(response) {
      $http.get(site+"Groupes",{
        headers:{
          'X-Parse-Application-Id': appId,
          'X-Parse-REST-API-Key':apiKey
        }})
      .success(function(response) { $scope.groupes = response.results });

    });
  }

  $scope.edit = function(){
    $http.put(site+"Groupes"+"/"+$scope.groupe2.objectId,$scope.groupe2,{
      headers:{
        'X-Parse-Application-Id': appId,
        'X-Parse-REST-API-Key':apiKey
      }})
    .success(function(response) { 
      $http.get(site+"Groupes",{
        headers:{
          'X-Parse-Application-Id': appId,
          'X-Parse-REST-API-Key':apiKey
        }})
      .success(function(response) { $scope.groupes = response.results });

    });
  }

  $scope.delete = function(){
    $http.delete(site+"Groupes"+"/"+$scope.groupe2.objectId,{
      headers:{
        'X-Parse-Application-Id': appId,
        'X-Parse-REST-API-Key':apiKey
      }})
    .success(function(response) { 
      $scope.groupe2.nom ="";
      $http.get(site+"Groupes",{
        headers:{
          'X-Parse-Application-Id': appId,
          'X-Parse-REST-API-Key':apiKey
        }})
      .success(function(response) { $scope.groupes = response.results });

    });
  }

}