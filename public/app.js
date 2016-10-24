import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';

import listOfIndicesPage from './templates/index.html';
import mainPage from './templates/main.html';
import jsonFormatter from 'jsonformatter';

import _ from 'lodash';
import 'angular-ui-bootstrap';

uiRoutes.enable();
uiRoutes
.when('/', {
  template: listOfIndicesPage,
  controller: 'listOfIndicesPageController',
  controllerAs: 'ctrl'
})
.when('/index/:name', {
  template: mainPage,
  controller: 'mainPageController',
  controllerAs: 'ctrl'
})


uiModules
.get('app/log_engine', ['ui.bootstrap', 'jsonFormatter'])
.controller('listOfIndicesPageController', function ($http) {

  $http.get('../api/log_engine/indices').then((response) => {
    this.indices = response.data;
  });  

})
.controller('mainPageController', function ($routeParams, $http, $uibModal) {

  // TODO
  // call fetch entities API
  // put all saved entities in an array

  this.index = $routeParams.name;

  // search for entity via query
  this.getResults = function() {

    // TODO 
    // call API for querying via entity name
    // $http.get(`...`).then((response) => {
    //   this.entities = data;
    // };

  };

  this.displayResults = function(data) {
    this.entities = data;
  };

  this.animationsEnabled = true;

  this.createNewEntity = function(size) {

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
      size: size,
      resolve: { }
    });

    modalInstance.result.then(function() {
      console.log('Modal dismissed at: ' + new Date());
    });

  };

});