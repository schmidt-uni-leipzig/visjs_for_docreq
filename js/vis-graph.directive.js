'use strict';

angular.module('visForDocreq')
    .directive('visGraph', ['visUtils', '$timeout',
    function (visUtils, $timeout){

        return {
            restrict: 'E',
            scope: {
                data: '=',
                settings: '=',
                height: '@'
            },  template: '<div style="width:100%; height: {{height}}" id="__vistemplate"></div>',
            link: function (scope){

                $timeout(function(){
                    visUtils.setPathOrSelectionMode('selection');
                }, 1000);
                var firstTimeRendering = true;

                var container = $('#__vistemplate')[0];


                var body = $('body');
                //its necessary to bind this object to the body DOM element, because 'visjs' seems to override events on the __vistemplate div.
                body.keydown(function(event){

                    if(event.keyCode === 17) {
                        visUtils.setPathOrSelectionMode('path', true);
                    }
                });

                body.keyup(function(event){

                    if(event.keyCode === 17) {
                        visUtils.setPathOrSelectionMode('selection', true);
                    }
                });

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