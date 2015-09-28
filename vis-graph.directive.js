'use strict';

angular.module('testApp')
    .directive('visGraph', ['visUtils',
    function (visUtils){

        return {
            restrict: 'E',
            scope: {
                data: '=',
                settings: '='
            },  template: '<div id="__vistemplate"  ></div>',

            link: function (scope){

                var container = document.getElementById('__vistemplate');

                scope.$watch('data', function (newValue){

                    if (newValue) {
                        visUtils.redrawAll(scope.data.edges, scope.data.nodes, container, scope.settings);
                    }

                });
            }
        };
    }]);

