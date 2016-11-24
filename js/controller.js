var myApp = angular.module('appliVG', ['ngRoute', 'ngAnimate']);

myApp.config(['$routeProvider',
    function($routeProvider) { 
        // Système de routage
        $routeProvider.when('/', {
            templateUrl: 'views/recherche.html'
        });
        $routeProvider.when('/details', {
            templateUrl: 'views/details.html'
        });
        $routeProvider.when('/loading', {
         templateUrl: 'views/loading.html'
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }
]);

myApp.controller('navigationCtrl', function($scope, $http){
    $(document).ready(function() {
        $('select').material_select();
    });
   	$scope.searchMasterCat = function(){
        $http.get('http://localhost:8080/masterRubrique').then(function(data){
            
            $scope.cats = {
                model: "",
                options: angular.copy(data.data)
            };
            $scope.sousCat = {
                model: "",
                options: {}
            };
        });
    }
    $scope.searchMasterCat();
    $scope.choixCat = false;
    
    $scope.listeProduit = null;
    $scope.afficheSousCat = function(id){
        if (id != "") {
            $http.get('http://localhost:8080/sousRubrique/'+id).then(function(data){
                $scope.choixCat = true;
                $scope.sousCat = {
                    model: "",
                    options: angular.copy(data.data)
                };
            });
        }
        else{
            $scope.choixCat = false; 
        }
        
    }
    $scope.afficheDetail = function(id){
        $http.get('http://localhost:8080/produits/'+id).then(function(data){
            console.log(data.data[0]);
            $scope.details = angular.copy(data.data[0]);
            if ($scope.details.quantite_stock > 0) {

                        $scope.details.dispo = true;
                    }
                    else{
                        $scope.details.dispo = false;
                    }
            document.location.href = 'http://127.0.0.1/php/mobileVillageGreen/#/details';
        });
    }

    $scope.rechercher = function(text){
        var code = $scope.cats.model;
        if ((text == undefined || text == "") && code == "") {
            alert('Vous devez remplir le champ de recherche ou choisir une catégorie.');
        }
        else{
            if (code == "") {
                code = 404;
            }
            if (text == undefined || text == "") {
                text = 'texttyperrornotprovided'
            }
            if ($scope.sousCat.model != "") {
                code = $scope.sousCat.model;
            }
            $http.get('http://localhost:8080/searchProducts/'+text+"/"+code).then(function(data){
                $scope.listeProduit = angular.copy(data.data);
                for (var i = 0; i < $scope.listeProduit.length; i++) {
                    console.log($scope.listeProduit[i].quantite_stock);
                    if ($scope.listeProduit[i].quantite_stock > 0) {

                        $scope.listeProduit[i].dispo = true;
                    }
                    else{
                        $scope.listeProduit[i].dispo = false;
                    }
                }
            });
        }
    }
    $scope.reset = function(){
        $scope.cats.model = "";
        $scope.sousCat.model = "";
        $scope.listeProduit = "";
        $scope.choixCat = false;
        document.getElementById('recherProduit').value = "";
    }

});