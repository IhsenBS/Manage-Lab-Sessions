function download(filename, text) {
	var pom = document.createElement('a');
	pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	pom.setAttribute('download', filename);

	if (document.createEvent) {
		var event = document.createEvent('MouseEvents');
		event.initEvent('click', true, true);
		pom.dispatchEvent(event);
	}
	else {
		pom.click();
	}
}

function controller($scope,$http, filterFilter) {
	var site = "https://api.parse.com/1/classes/";

	//init
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

	$http.get(site+"Etudiants",{
		headers:{
			'X-Parse-Application-Id': appId,
			'X-Parse-REST-API-Key':apiKey
		}})
	.success(function(response) { $scope.etudiants = response.results });

	$http.get(site+"Notes",{
		headers:{
			'X-Parse-Application-Id': appId,
			'X-Parse-REST-API-Key':apiKey
		}})
	.success(function(response) { $scope.notes = response.results });

	$scope.change = function() {
		$scope.classe = angular.copy($scope.classes[$scope.selectedClasse]);
	};

	$scope.change2 = function() {

		$scope.groupe = angular.copy($scope.groupes[$scope.selectedGroupe]);
	};


	$scope.change3 = function() {

		$scope.matiere = angular.copy($scope.matieres[$scope.selectedMatiere]);
		$scope.coefs = [];

		var seances = filterFilter($scope.seances, {matiereId:$scope.matiere.objectId});
		for(var i=0;i<seances.length;i++){		
			$scope.coefs.push(( {
				id : $scope.coefs.length,
				nom : seances[i].nom,
				valeur : 1
			}));
		}
	};

	$scope.export = function(){
		$scope.result="";

		var seances = filterFilter($scope.seances, {matiereId:$scope.matiere.objectId});
		var etudiants = filterFilter($scope.etudiants, {groupeId:$scope.groupe.objectId});
		var notes = filterFilter($scope.notes, {matiereId:$scope.matiere.objectId,groupeId:$scope.groupe.objectId});
		 //premiere ligne
		$scope.result += " ;";
		for(var i=0;i<seances.length;i++){
			$scope.result += seances[i].nom +";";
		}
		$scope.result += "Moyenne;\n";

		//ligne de chaque etudiant
		var coefs=0;
		for(var i=0;i<etudiants.length;i++){
			$scope.result += etudiants[i].prenom + " " + etudiants[i].nom + ";";
			var moyenne=0;
			coefs=0;
			for(var j=0;j<seances.length;j++){
				var note = filterFilter(notes, {etudiantId:etudiants[i].objectId,seanceId:seances[j].objectId});
				if (note.length == 0) $scope.result += "0;";
				else {
					$scope.result += note[ note.length - 1].note + ";";
					moyenne+= parseInt(note[ note.length - 1].note) * parseInt($scope.coefs[j].valeur);
				}
				coefs += parseInt($scope.coefs[j].valeur);

			}
			moyenne = moyenne / coefs;
			$scope.result += moyenne + "\r\n";
		}

		//derniere ligne 
		$scope.result += "Coefficients;";
		for(var i=0;i<$scope.coefs.length;i++)
			$scope.result += $scope.coefs[i].valeur + ";";
		$scope.result += coefs + "\r\n";

		//telecharger
		download("notes.csv",$scope.result);
	};

}