'use strict';

angular.module('testApp')
    .directive('visGraph', ['visUtils',
    function (visUtils){

        return {
            restrict: 'E',
            scope: {
                data: '=',
                settings: '=',
                height: '@'
            },  template: '<div style="width:100%; height: {{height}}" id="__vistemplate"  ></div>',

            link: function (scope){

                var firstTimeRendering = true;

                var container = document.getElementById('__vistemplate');


                scope.$watch('data', function (newValue){

                    if(firstTimeRendering && newValue){

                        visUtils.redrawAll(scope.data.edges, scope.data.nodes, container, scope.settings);
                        firstTimeRendering = false;

                    } else if (newValue) {
                        visUtils.updateData(scope.data.edges, scope.data.nodes);
                    }

                });
            }
        };
    }]);

