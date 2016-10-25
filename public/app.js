import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';

import indexPage from './templates/index.html';
import mainPage from './templates/main.html';
import jsonFormatter from 'jsonformatter';

import _ from 'lodash';
import 'angular-ui-bootstrap';

// Usually, this is added to the HTML, but not sure how to do that here in Kibana
import './css/json-formatter.css';

uiRoutes.enable();
uiRoutes
.when('/', {
  template: indexPage,
  controller: 'indexPageController',
  controllerAs: 'ctrl'
})
.when('/index/:name', {
  template: mainPage,
  controller: 'mainPageController',
  controllerAs: 'ctrl'
})


uiModules
.get('app/log_engine', ['ui.bootstrap', 'jsonFormatter'])
.controller('indexPageController', function ($http) {

  $http.get(`../api/log_engine/indices`).then((response) => {
    this.indices = response.data;
  });  

})
.controller('mainPageController', function ($routeParams, $http, $uibModal) {


  this.index = $routeParams.name;

  // TODO
  // call fetch entities API
  // put all saved entities' name in an array
  this.app = "ClipOnClip";
  this.fetchedEntities = ['entity name 1', 'entity name 2'];

  $http.post(`http://127.0.0.1:8080/clip/entity/fetch?app=${this.app}`).then((response) => {
    // this.fetchedEntities = ...
    console.log(response);
  }); 

  // search for entity via query
  this.getResults = function() {

    // TODO 
    // call API for querying via entity name

    $http.get(`../api/log_engine/index/bank`).then((response) => {
       this.entities = response.data;
    });

  };

  this.displayResults = function(data) {
    this.entities = data;
  };

  this.animationsEnabled = true;

  this.createNewEntity = function() {

    let $scope = this;

    // not to be assigned to any other value throughout this function
    // this needs to be the parent window
    let $ctrl = this;

    var modalInstance = $uibModal.open({
      animation: this.animationsEnabled,
      templateUrl: 'modal.html',
      controller: function($scope, $uibModalInstance) {

        console.log($ctrl);
        
        $scope.save = function() {

          var isValidQuery = false;

          // TODO
          // change the API call to save API
          $http.get(`../api/log_engine/index/bank`).then((response) => {
            isValidQuery = true;
            $scope.data = response.data;
            if (isValidQuery) {
              $ctrl.displayResults($scope.data);
              $scope.validationErrorAlert = false;
              $uibModalInstance.close();
            } else {
              $scope.validationErrorAlert = true;
            }
          });
        };


        $scope.query = function() {

          var isValidQuery = false;

          // TODO
          // change the API call to query API
          $http.get(`../api/log_engine/index/bank`).then((response) => {
            isValidQuery = false;
            $scope.data = response.data;
            if (isValidQuery) {
              $ctrl.displayResults($scope.data);
              $scope.validationErrorAlert = false;
              $uibModalInstance.close();
            } else {
              $scope.validationErrorAlert = true;
            }
          });
        };

        $scope.cancel = function() {
          $scope.validationErrorAlert = false;
          $uibModalInstance.dismiss('cancel');
        };
      },
      size: 'lg',
      resolve: { }
    });

    modalInstance.result.then(function() {
      console.log('Modal dismissed at: ' + new Date());
    });

  };

  // on click of link
  this.join = function() {

    let $scope = this;

    var modalInstance = $uibModal.open({
      animation: this.animationsEnabled,
      templateUrl: 'joinModal.html',
      controller: function($scope, $uibModalInstance) {

        $scope.execJoin = function() {

          // TODO

        }

        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        }

      },
      resolve: { }
    });

    modalInstance.result.then(function() {
      console.log('Modal dismissed at: ' + new Date());
    });

  };

});