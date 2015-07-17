'use strict';

var app = angular.module('app', ['ngSanitize', 'ui.select']);

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

app.controller('controller',function($scope,$http,filterFilter) {
	var site = "https://api.parse.com/1/classes/";
	$scope.binomes = [];
	$scope.etudiant= {};
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


	$scope.change4 = function() {

		$scope.matiere = angular.copy($scope.matieres[$scope.selectedMatiere]);
	};

	$scope.change5 = function() {

		$scope.seance = angular.copy($scope.seances[$scope.selectedSeance]);
	};

	$scope.select = function(i) {

		$scope.etudiant2 = angular.copy($scope.etudiants[i]);
	};

	$scope.valider = function(i) {
		var elem1 = document.getElementById('row1');
		elem1.parentNode.removeChild(elem1);
		var elem2 = document.getElementById('row2');
		elem2.parentNode.removeChild(elem2);
		var elem3 = document.getElementById('bouton_valider');
		elem3.parentNode.removeChild(elem3);

		$scope.etudiants = filterFilter($scope.etudiants, {groupeId:$scope.groupe.objectId});

		var anciensBinomes = true;

		//seance a été demarré ou non
		var notes = filterFilter($scope.notes, {seanceId:$scope.seance.objectId,groupeId:$scope.groupe.objectId});
		if(notes.length > 0){

			anciensBinomes = false;

			//recuperer liste des anciennes notes
			for(var i = 0;i<notes[0].totalBinomes;i++){
				$scope.binomes.push(( {
					id : $scope.binomes.length,
					eleves : [],
					etats : []
				}));
			}
			for(var i=0;i<notes.length;i++){

				var id = notes[i].etudiantId;
				var etudiant = filterFilter($scope.etudiants, {objectId:id});
				var nom_etudiant = etudiant[0].nom;
				var prenom_etudiant = etudiant[0].prenom;

				if (filterFilter($scope.binomes[notes[i].numBinome].eleves, {objectId : id }).length == 0)
				{
					$scope.binomes[notes[i].numBinome].eleves.push(( {
						objectId : notes[i].etudiantId,
						nom : nom_etudiant,
						prenom : prenom_etudiant
					}));
				}
				$scope.binomes[notes[i].numBinome].homework=notes[i].homework;
				$scope.binomes[notes[i].numBinome].note=notes[i].note;
				$scope.binomes[notes[i].numBinome].remarque=notes[i].remarque;
				$scope.binomes[notes[i].numBinome].etat=notes[i].etat;
			}
		}

		//premiere seance ou non
		var seances = filterFilter($scope.seances, {matiereId:$scope.matiere.objectId});
		var indexSeance = -1;
		for(var i = 0;i<seances.length;i++)
			if(seances[i].objectId == $scope.seance.objectId) indexSeance = i;
		console.log(indexSeance);
		$scope.premiereSeance = true;
		if(indexSeance>0){
			$scope.premiereSeance = false;
			$scope.precSeance = indexSeance - 1;
			for(var i=0;i<$scope.binomes.length;i++){
				for(var j=0;j<$scope.binomes[i].eleves.length;j++){
					var id = $scope.binomes[i].eleves[j].objectId;
					var prec = filterFilter($scope.notes, {etudiantId:id,seanceId:seances[indexSeance-1].objectId});

					if (prec.length == 0)  $scope.binomes[i].etats.push({etat : "Absent",idEtudiant : id });
					else $scope.binomes[i].etats.push({ etat : prec[prec.length - 1].etat ,idEtudiant : id});
				}
			}

		} else anciensBinomes = false;

		if ( anciensBinomes == true){
			$scope.ancien = true;
		}
		$scope.valide = 1;
	};

	$scope.ajouter = function(){

		$scope.binomes.push(( {
			id : $scope.binomes.length,
			etats : [],
			eleves : []
		}));
		$scope.ancien = false;

	}

	$scope.anciensBinomes = function(){
		$scope.ancien = false;

		var notes = filterFilter($scope.notes, {seanceId:$scope.seances[$scope.precSeance].objectId,groupeId:$scope.groupe.objectId});
		var seances = filterFilter($scope.seances, {matiereId:$scope.matiere.objectId});

		//recuperer liste des anciennes notes
		for(var i = 0;i<notes[0].totalBinomes;i++){
			$scope.binomes.push(( {
				id : $scope.binomes.length,
				eleves : [],
				etats : []
			}));
		}
		for(var i=0;i<notes.length;i++){
			var id = notes[i].etudiantId;
			var etudiant = filterFilter($scope.etudiants, {objectId:id});
			var nom_etudiant = etudiant[0].nom;
			var prenom_etudiant = etudiant[0].prenom;

			if (filterFilter($scope.binomes[notes[i].numBinome].eleves, {objectId : id }).length == 0)
			{
				$scope.binomes[notes[i].numBinome].eleves.push(( {
					objectId : notes[i].etudiantId,
					nom : nom_etudiant,
					prenom : prenom_etudiant
				}));
			}
		}

		for(var i=0;i<$scope.binomes.length;i++){
			for(var j=0;j<$scope.binomes[i].eleves.length;j++){
				var id = $scope.binomes[i].eleves[j].objectId;
				var prec = filterFilter($scope.notes, {etudiantId:id,seanceId:seances[$scope.precSeance].objectId});

				if (prec.length == 0)  $scope.binomes[i].etats.push({etat : "Absent",idEtudiant : id });
				else $scope.binomes[i].etats.push({ etat : prec[prec.length - 1].etat ,idEtudiant : id});
			}
		}
	}

	$scope.add = function(){

		$scope.binomes[$scope.binomes.length - 1].eleves.push($scope.etudiant.selected);

		if($scope.premiereSeance == false){
			var id = $scope.etudiant.selected.objectId;
			var prec = filterFilter($scope.notes, {etudiantId:id,seanceId:$scope.seances[$scope.precSeance].objectId});
			if (prec.length == 0)  $scope.binomes[$scope.binomes.length - 1].etats.push({etat : "Absent",idEtudiant : id });
			else $scope.binomes[$scope.binomes.length - 1].etats.push({ etat : prec[prec.length - 1].etat ,idEtudiant : id});
		}


	}

	$scope.save = function(){
		var result="";
		var i=0;
		for(i=0;i<$scope.binomes.length;i++){
			var j=0;
			for(j=0;j<$scope.binomes[i].eleves.length;j++){
				var note = new Object();
				note.etudiantId = $scope.binomes[i].eleves[j].objectId;
				note.matiereId = $scope.matiere.objectId;
				note.seanceId = $scope.seance.objectId;
				note.groupeId = $scope.groupe.objectId;
				note.numBinome = i;
				note.totalBinomes = $scope.binomes.length;
				note.homework = $scope.binomes[i].homework;
				note.note = $scope.binomes[i].note;
				note.remarque = $scope.binomes[i].remarque;
				note.etat = $scope.binomes[i].etat;
				$http.post(site+"Notes",note,{
					headers:{
						'X-Parse-Application-Id': appId,
						'X-Parse-REST-API-Key':apiKey
					}})
				.success();
			}
		}
	}



});