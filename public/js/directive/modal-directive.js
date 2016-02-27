define(['app'], function(app) {
   app.directive('modalBtn', function() {
       return {
           restrict: 'AE',
           link: function(scope, element, attributes) {
               element.bind('click', function(event){
                   var id = $(this).attr("data-modal");
                   $("#"+id).modal('show');
               })
           }
       }
   })
});