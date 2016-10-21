import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';

import listOfIndicesPage from './templates/index.html';
import mainPage from './templates/main.html';

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
.get('app/log_engine', ['ui.bootstrap'])
.controller('listOfIndicesPageController', function ($http) {

  $http.get('../api/log_engine/indices').then((response) => {
    this.indices = response.data;
  });  

})
.controller('mainPageController', function ($routeParams, $http, $uibModal) {

  this.index = $routeParams.name;

  // search for entity via query
  this.getResults = function() {

    
    
    // if (nameSearch)
    // get method with entity name as the require parameter
    // else
    // post method with query as the required body
    $http.post(`http://127.0.0.1:8080/api/log_engine/querysearch/${this.index}`, this.query).then((response) =>{ 
      this.entities = response.data;
    });

  };

  this.animationsEnabled = true;

  this.createNewEntity = function(size) {

    let $scope = this;

    var modalInstance = $uibModal.open({
      animation: this.animationsEnabled,
      templateUrl: 'modal.html',
      controller: function($scope, $uibModalInstance) {

        $scope.isValid = false;

        $scope.validationErrorAlert = false;

        $scope.validateButton = true;
        $scope.saveButton = false;
        $scope.queryButton = false;

        $scope.validate = function() {

          // TODO
          // validate method
          // $http.post(`http://127.0.0.1:8080/api/log_engine/querysearch/${this.index}`, this.query).then((response) =>{ 
          //  $scope.isValid = get this from the response
          // });

          $scope.isValid = false;

          if ($scope.isValid) {
            $scope.validateButton = false;
            $scope.saveButton = true;
            $scope.queryButton = true;
          } else {
            $scope.validationErrorAlert = true; 
          }

        };

        $scope.save = function() {
          $uibModalInstance.close();
        };

        $scope.query = function() {

          // TODO
          // query method

        };

        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };
      },
      size: size,
      resolve: {
        
      }
    });

    modalInstance.result.then(function() {
      console.log('Modal dismissed at: ' + new Date());
    });

  };

});