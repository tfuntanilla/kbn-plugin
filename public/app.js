import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';

import listOfIndicesPage from './templates/index.html';
import listOfEntitiesPage from './templates/entities.html';
import updateChildPage from './templates/update.html';

import _ from 'lodash';
import jsonFormatter from 'jsonformatter';
import 'angular-ui-bootstrap';
import 'angular-sanitize';

// TODO is this how you're supposed to load 3rd party css?
import '../node_modules/jsonformatter/dist/json-formatter.min.css';

uiRoutes.enable();
uiRoutes
.when('/', {
  template: listOfIndicesPage,
  controller: 'listOfIndicesPageController',
  controllerAs: 'ctrl'
})
.when('/index/:name', {
  template: listOfEntitiesPage,
  controller: 'listOfEntitiesPageController',
  controllerAs: 'ctrl'
})
.when('/index/:name/type/:type/update/:id', {
   template: updateChildPage,
   controller: 'updateChildPageController',
   controllerAs: 'ctrl'
});


uiModules
.get('app/log_engine', ['jsonFormatter', 'ui.bootstrap'])
.controller('listOfIndicesPageController', function ($http) {

  $http.get('../api/log_engine/indices').then((response) => {
    this.indices = response.data;
  });  

})
.controller('listOfEntitiesPageController', function ($routeParams, $http, $uibModal) {

  this.index = $routeParams.name;
  $http.get(`../api/log_engine/index/${this.index}`).then((response) => {
    this.entities = response.data;
  });

  // search for entity via query
  this.searchRequest = function() {

    $http.post(`http://127.0.0.1:8080/api/log_engine/querysearch/${this.index}`, this.query).then((response) =>{ 
      this.entities = response.data;
    });

  };

  this.animationsEnabled = true;

  // create and save new entity
  this.createNewEntity = function(size) {

    let $scope = this;

    var modalInstance = $uibModal.open({
      animation: this.animationsEnabled,
      templateUrl: 'newEntityModal.html',
      controller: function($scope, $uibModalInstance){

        $scope.save = function() {
          $uibModalInstance.close();
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

  // update entity
  this.updateEntity = function (size, entity) {

    console.log(entity);
    let $scope = this;

    var modalInstance = $uibModal.open({
      animation: this.animationsEnabled,
      templateUrl: 'updateModal.html',
      controller: function($scope, $uibModalInstance){

        $scope.entity = entity;
        // $scope.selected = {
        //   item: $scope.items[0]
        // };

        $scope.ok = function () {
          $uibModalInstance.close();
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      },
      size: size,
      resolve: {
        items: function () {
          return $scope.entity
        }
      }
    });

    modalInstance.result.then(function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  this.toggleAnimation = function () {
    this.animationsEnabled = !this.animationsEnabled;
  };


})
.controller('updateChildPageController', function ($routeParams, $http) {

    // angular.element(document).ready(function() {
    //   try{
    //       angular.module("$ngSanitize") 
    //   }catch(err){
    //       console.log("ngSanitize error", err);
    //   }
    // });

   this.index = $routeParams.name;
   this.type = $routeParams.type;
   this.id = $routeParams.id;


   this.hitES = function() {
    $http.get(`../api/log_engine/querysearch/${this.index}/${this.id}/${this.query}`).then((response) => {
      this.entities = response.data;
    });
  };
})
//TODO figure out ngSanitize 
.directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$evalAsync(read);
      });
      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if (attrs.stripBr && html === '<br>') {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
}]);