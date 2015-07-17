function controller($scope,$http) {
  var site = "https://api.parse.com/1/classes/Classes";
  $http.get(site,{
    headers:{
      'X-Parse-Application-Id': appId,
      'X-Parse-REST-API-Key':apiKey
    }})
  .success(function(response) {$scope.classes = response.results });

  $scope.select = function(i) {
    $scope.classe = angular.copy($scope.classes[i]);
  };

  $scope.send = function(){
    $http.post(site,$scope.classe1,{
      headers:{
        'X-Parse-Application-Id': appId,
        'X-Parse-REST-API-Key':apiKey
      }})
    .success(function(response) {
      $http.get(site,{
        headers:{
          'X-Parse-Application-Id': appId,
          'X-Parse-REST-API-Key':apiKey
        }})
      .success(function(response) { $scope.classes = response.results });

    });
  }

  $scope.edit = function(){
    $http.put(site+"/"+$scope.classe.objectId,$scope.classe,{
      headers:{
        'X-Parse-Application-Id': appId,
        'X-Parse-REST-API-Key':apiKey
      }})
    .success(function(response) { 
      $http.get(site,{
        headers:{
          'X-Parse-Application-Id': appId,
          'X-Parse-REST-API-Key':apiKey
        }})
      .success(function(response) { $scope.classes = response.results });

    });
  }

  $scope.delete = function(){
    $http.delete(site+"/"+$scope.classe.objectId,{
      headers:{
        'X-Parse-Application-Id': appId,
        'X-Parse-REST-API-Key':apiKey
      }})
    .success(function(response) { 
      $scope.classe.nom ="";
      $http.get(site,{
        headers:{
          'X-Parse-Application-Id': appId,
          'X-Parse-REST-API-Key':apiKey
        }})
      .success(function(response) { $scope.classes = response.results });

    });
  }

}