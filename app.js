(function(){
'use strict';

angular.module('mySearchingApp', [])
.controller('SearchMyAppController', SearchMyAppController)
.service('SearchMyAppService', SearchMyAppService)


SearchMyAppController.$inject = ['SearchMyAppService'];
function SearchMyAppController(SearchMyAppService) {
  var search = this;

  var promise = SearchMyAppService.getItems();

  search.value = "";

  search.display = false;

  promise.then( function(response) {
    var items = response.data.menu_items;
    SearchMyAppService.items = response.data.menu_items;
  })
  .catch( function(error) {
    window.alert("Something is wrong!");
  });

  search.buttonIsClicked = function() {
    if (search.value=="") {
      search.display = true;
      search.list = [];
    }
    else{
      SearchMyAppService.buttonIsCliked(search.value);
      search.list = [];
      search.list = SearchMyAppService.searchedItems;
      if(search.list.length===0){
        search.display = true;
      }
      else{
        search.display = false;
      }
    }
  };

  search.removeItem = function(index) {
    SearchMyAppService.removeItem(index);
    if(search.list.length===0){
      search.display = true;
    }
    else{
      search.display = false;
    }
  };
};


SearchMyAppService.$inject = ['$http'];
function SearchMyAppService($http) {
  var service = this;

  service.display = false;

  service.getItems = function(){
    var response = $http({
      method:'GET',
      url:'http://davids-restaurant.herokuapp.com/menu_items.json'
    })

    return response;
  }

  service.buttonIsCliked = function(string) {
    var searchedItems = [];
    var i;
    for (i=0; i<service.items.length; i++ ) {
      if (service.items[i].description.indexOf(string)!==-1) {
        searchedItems.push(service.items[i]);
      }
    }
    service.searchedItems = searchedItems;
  };

    service.removeItem = function(index) {
      service.searchedItems.splice(index, 1);
    };
  };

})();
