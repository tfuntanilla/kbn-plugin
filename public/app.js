import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';

import indexPage from './templates/index.html';
import mainPage from './templates/main.html';
import jsonFormatter from 'jsonformatter';

import _ from 'lodash';
import 'angular-ui-bootstrap';
import 'angular-sanitize';

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
.get('app/log_engine', ['ui.bootstrap', 'jsonFormatter', 'ngSanitize'])
.controller('indexPageController', function ($http) {

  $http.get(`../api/log_engine/indices`).then((response) => {
    console.log(response.data);
    this.indices = response.data;
  });  

})
.controller('mainPageController', function ($routeParams, $http, $uibModal) {


  this.index = $routeParams.name;

  // TODO figure out how to get the values for these
  // this.app = ?
  // this.env = ?

  // TODO: fix url
  // fetch all entities for this app-env
  // this.app = 'TestApp';
  // this.env = 'TestEnv';
  // $http.post(`http://127.0.0.1:8080/clip/entity/fetchAllEntities?app=${this.app}&env=${this.env}`).then((response) => {
  //   this.fetchedEntities = response.data;
  //   console.log(response);
  // }); 

  // DUMMY DATA
  this.fetchedEntities = ['entity a', 'entity b', 'entity c'];

  // search for entity via query
  let $res_ent = this;
  this.getResults = function() {

    if ($res_ent.entityName === undefined) {
      console.log("No entity selected.");
      return;
    }

    // TODO 
    // this.app = ?
    // this.env = ?
    // this.entityName = $res_ent.entityName;
    console.log($res_ent.entityName);

    // TODO: fix url
    // fetch entity via entity name
    // $http.get(`http://127.0.0.1:8080/clip/entity/fetchEntity?app=${this.app}&env=${this.env}&entity=${this.entityName}`).then((response) => {
    //   this.fetchedEntities = response.data;
    //   console.log(response);
    // });

    // FOR TESTING
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

          var isValid = false;

          // TODO
          // change the API call to save API
          
          $http.get(`../api/log_engine/index/bank`).then((response) => {
            // TODO
            // depending on the response determing if query is valid or not
            // isValid = ?
            $scope.data = response.data;
            if (isValid) {
              $ctrl.displayResults($scope.data);
              $scope.validationErrorAlert = false;
              $uibModalInstance.close();
            } else {
              $scope.validationErrorAlert = true;
            }
          });
        };


        $scope.query = function() {

          var isValid = false;

          // TODO
          // change the API call to query API
          // $http.get(`http://127.0.0.1:8080/clip/entity/...`).then((response) => {
          $http.get(`../api/log_engine/index/bank`).then((response) => {
            // TODO
            // depending on the response determing if query is valid or not
            // isValid = ?
            $scope.data = response.data;
            if (isValid) {
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

        // TODO
        // fetch entities that can be used for joining

        $scope.fetchedJoinEntities = ['join entity a', 'join entity b'];

        $scope.execJoin = function() {

          if ($scope.joinEntityName === undefined) {
            console.log("No entity selected.");
          }

          console.log($scope.joinEntityName);

          // TODO
          // api call to join the entities

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