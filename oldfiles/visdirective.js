'use strict';

angular.module('webApp')
  .controller('graphCtrl', function ($scope, $timeout){;




    //simulates a backend data change
    //  $timeout(function (){
    //      $scope.graph = {
    //        edges: [],
    //        nodes: [{
    //          'group': null,
    //          'id': '1890886321',
    //          'label': 'Erstellung Vergabevorschlag',
    //          'level': 0,
    //          'type': 'BusinessTask'
    //        }, {
    //          'group': null,
    //          'id': '736000078',
    //          'label': 'Handbuch erstellen',
    //          'level': 0,
    //          'type': 'BusinessTask'
    //        }, {'group': null, 'id': '756996844', 'label': 'Anlagenplaner', 'level': 0, 'type': 'Role'}, {
    //          'group': null,
    //          'id': '-1018407606',
    //          'label': 'Prüfung, Bewertung Angebote',
    //          'level': 0,
    //          'type': 'BusinessTask'
    //        }, {'group': null, 'id': '1551773261', 'label': 'Abnahmeprotokoll', 'level': 0, 'type': 'Document'}, {
    //          'group': null,
    //          'id': '-247222559',
    //          'label': 'Abwasser-, Wasser-, Gasanlagen bedienen',
    //          'level': 0,
    //          'type': 'BusinessTask'
    //        }, {'group': null, 'id': '542572468', 'label': 'Vertrag', 'level': 0, 'type': 'Document'}, {
    //          'group': null,
    //          'id': '-1129215256',
    //          'label': 'Lieferschein',
    //          'level': 0,
    //          'type': 'Document'
    //        }]
    //      }}, 10000);
    //
    //

  });


angular.module('webApp')
  .directive('visGraph',
  function (){

    return {
      restrict: 'E',
      scope: {
        graph: '=',
        showResult: '=',
        settings: '='
      },
      template: '<div id="__vistemplate"  ></div>',

      link: function ($scope){

        var container = document.getElementById('__vistemplate');




        $scope.$watch('graph', function (newValue){

          if (newValue) {
            var myCallBack = function() {
              $scope.$apply(function () {
                $scope.showResult();
              });
            };
            redrawAll($scope.graph.edges, $scope.graph.nodes, container, $scope.settings,  myCallBack);
          }

        });
      }
    };
  });
