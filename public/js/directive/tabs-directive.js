define(['app'], function(app) {
   return app.directive('tabs', function(){
       return{
           restrict: 'AE',
           link: function(scope, element, attributes) {
                element.bind('click', function(){
                    $(this).addClass('w-nav-active').removeClass('w-nav-default');
                    $(this).siblings().removeClass('w-nav-active').addClass('w-nav-default')
                })
           }
       }
   })
});