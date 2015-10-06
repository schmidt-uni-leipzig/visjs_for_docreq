'use strict';

angular.module('testApp', []).controller('mainCtrl', ['$scope', function($scope) {

    $scope.showViz = false;
    $scope.showOverlay = true;


    var count = 0;
    $scope.showResult = function (){
        if(count === 0){

            $scope.showViz = !$scope.showViz;
            count++;
        }
    };


    //test data
    $scope.data = {
        edges: [{'label': null, 'source': '1302588862', 'target': '-1129215256', 'weight': 0}, {
            'label': null,
            'source': '1816631207',
            'target': '-1048518525',
            'weight': 0
        }, {'label': null, 'source': '-1597060310', 'target': '352242694', 'weight': 0}, {
            'label': null,
            'source': '736000078',
            'target': '790299',
            'weight': 0
        }, {'label': null, 'source': '-218241992', 'target': '-247222559', 'weight': 0}, {
            'label': null,
            'source': '790299',
            'target': '-1048518525',
            'weight': 0
        }, {'label': null, 'source': '-277991050', 'target': '-1472615325', 'weight': 0}, {
            'label': null,
            'source': '-1108162889',
            'target': '667437134',
            'weight': 0
        }, {'label': null, 'source': '790299', 'target': '-1330414436', 'weight': 0}, {
            'label': null,
            'source': '-1048518525',
            'target': '-1897352637',
            'weight': 0
        }, {'label': null, 'source': '756996844', 'target': '-1018407606', 'weight': 0}, {
            'label': null,
            'source': '-35860008',
            'target': '-1091328096',
            'weight': 0
        }, {'label': null, 'source': '-1129215256', 'target': '-1597060310', 'weight': 0}, {
            'label': null,
            'source': '-35860008',
            'target': '-1475753121',
            'weight': 0
        }, {'label': null, 'source': '-777123061', 'target': '1551773261', 'weight': 0}, {
            'label': null,
            'source': '557033435',
            'target': '-1330414436',
            'weight': 0
        }, {'label': null, 'source': '593337556', 'target': '-1472615325', 'weight': 0}, {
            'label': null,
            'source': '1890886321',
            'target': '-277991050',
            'weight': 0
        }, {'label': null, 'source': '-247222559', 'target': '-1160397572', 'weight': 0}, {
            'label': null,
            'source': '756996844',
            'target': '1890886321',
            'weight': 0
        }, {'label': null, 'source': '542572468', 'target': '1302588862', 'weight': 0}, {
            'label': null,
            'source': '138922794',
            'target': '-1743058847',
            'weight': 0
        }, {'label': null, 'source': '-1475753121', 'target': '1694828982', 'weight': 0}, {
            'label': null,
            'source': '-1091328096',
            'target': '-1743058847',
            'weight': 0
        }, {'label': null, 'source': '-1330414436', 'target': '-731721707', 'weight': 0}, {
            'label': null,
            'source': '1551773261',
            'target': '-1597060310',
            'weight': 0
        }, {'label': null, 'source': '-191649356', 'target': '1932639311', 'weight': 0}, {
            'label': null,
            'source': '593337556',
            'target': '-1597060310',
            'weight': 0
        }, {'label': null, 'source': '-1472615325', 'target': '542572468', 'weight': 0}, {
            'label': null,
            'source': '-595699606',
            'target': '-1018407606',
            'weight': 0
        }, {'label': null, 'source': '542572468', 'target': '-1597060310', 'weight': 0}, {
            'label': null,
            'source': '-1743058847',
            'target': '-536710416',
            'weight': 0
        }, {'label': null, 'source': '352242694', 'target': '619354594', 'weight': 0}, {
            'label': null,
            'source': '-2072969277',
            'target': '1890886321',
            'weight': 0
        }, {'label': null, 'source': '-1743058847', 'target': '-1597060310', 'weight': 0}, {
            'label': null,
            'source': '1932639311',
            'target': '-595699606',
            'weight': 0
        }, {'label': null, 'source': '593337556', 'target': '667437134', 'weight': 0}, {
            'label': null,
            'source': '542572468',
            'target': '-777123061',
            'weight': 0
        }, {'label': null, 'source': '-35860008', 'target': '-536710416', 'weight': 0}, {
            'label': null,
            'source': '-35860008',
            'target': '619354594',
            'weight': 0
        }, {'label': null, 'source': '756996844', 'target': '736000078', 'weight': 0}, {
            'label': null,
            'source': '-1018407606',
            'target': '-2072969277',
            'weight': 0
        }, {'label': null, 'source': '593337556', 'target': '-777123061', 'weight': 0}, {
            'label': null,
            'source': '619354594',
            'target': '-1108162889',
            'weight': 0
        }, {'label': null, 'source': '1694828982', 'target': '-1018407606', 'weight': 0}, {
            'label': null,
            'source': '593337556',
            'target': '138922794',
            'weight': 0
        }, {'label': null, 'source': '756996844', 'target': '1932639311', 'weight': 0}, {
            'label': null,
            'source': '-191649356',
            'target': '-1475753121',
            'weight': 0
        }, {'label': null, 'source': '542572468', 'target': '-1091328096', 'weight': 0}, {
            'label': null,
            'source': '-1129215256',
            'target': '-777123061',
            'weight': 0
        }, {'label': null, 'source': '-35860008', 'target': '1302588862', 'weight': 0}, {
            'label': null,
            'source': '-731721707',
            'target': '-1048518525',
            'weight': 0
        }, {'label': null, 'source': '667437134', 'target': '-402393953', 'weight': 0}, {
            'label': null,
            'source': '-536710416',
            'target': '-1743058847',
            'weight': 0
        }, {'label': null, 'source': '-1743058847', 'target': '138922794', 'weight': 0}],

        nodes: [{
            'group': null,
            'id': '1890886321',
            'label': 'Erstellung Vergabevorschlag',
            'level': 0,
            'type': 'BusinessTask'
        }, {
            'group': null,
            'id': '736000078',
            'label': 'Handbuch erstellen',
            'level': 0,
            'type': 'BusinessTask'
        }, {'group': null, 'id': '756996844', 'label': 'Anlagenplaner', 'level': 0, 'type': 'Role'}, {
            'group': null,
            'id': '-1018407606',
            'label': 'Prüfung, Bewertung Angebote',
            'level': 0,
            'type': 'BusinessTask'
        }, {'group': null, 'id': '1551773261', 'label': 'Abnahmeprotokoll', 'level': 0, 'type': 'Document'}, {
            'group': null,
            'id': '-247222559',
            'label': 'Abwasser-, Wasser-, Gasanlagen bedienen',
            'level': 0,
            'type': 'BusinessTask'
        }, {'group': null, 'id': '542572468', 'label': 'Vertrag', 'level': 0, 'type': 'Document'}, {
            'group': null,
            'id': '-1129215256',
            'label': 'Lieferschein',
            'level': 0,
            'type': 'Document'
        }, {
            'group': null,
            'id': '-1597060310',
            'label': 'Prüfung Rechnung',
            'level': 0,
            'type': 'BusinessTask'
        }, {
            'group': null,
            'id': '-1472615325',
            'label': 'Verträge abschließen',
            'level': 0,
            'type': 'BusinessTask'
        }, {'group': null, 'id': '-35860008', 'label': 'Lieferant', 'level': 0, 'type': 'Role'}, {
            'group': null,
            'id': '-731721707',
            'label': 'Wartungsbericht',
            'level': 0,
            'type': 'Document'
        }, {'group': null, 'id': '593337556', 'label': 'Anlagenbetreiber', 'level': 0, 'type': 'Role'}, {
            'group': null,
            'id': '-218241992',
            'label': 'Anlagenhersteller',
            'level': 0,
            'type': 'Role'
        }, {'group': null, 'id': '-1743058847', 'label': 'Schlussrechnung', 'level': 0, 'type': 'Document'}, {
            'group': null,
            'id': '1694828982',
            'label': 'Angebot',
            'level': 0,
            'type': 'Document'
        }, {
            'group': null,
            'id': '-1330414436',
            'label': 'Wartung durchführen',
            'level': 0,
            'type': 'BusinessTask'
        }, {'group': null, 'id': '667437134', 'label': 'Belegbuchung', 'level': 0, 'type': 'BusinessTask'}, {
            'group': null,
            'id': '-1091328096',
            'label': 'Erstellung Rechnung Debitor',
            'level': 0,
            'type': 'BusinessTask'
        }, {
            'group': null,
            'id': '-1475753121',
            'label': 'Erstellung Angebot',
            'level': 0,
            'type': 'BusinessTask'
        }, {
            'group': null,
            'id': '-1108162889',
            'label': 'Schlusszahlungsannahme',
            'level': 0,
            'type': 'Document'
        }, {'group': null, 'id': '790299', 'label': 'Handbuch', 'level': 0, 'type': 'Document'}, {
            'group': null,
            'id': '-1897352637',
            'label': 'Gutachten',
            'level': 0,
            'type': 'Document'
        }, {
            'group': null,
            'id': '557033435',
            'label': 'Instandhaltungsdienstleister',
            'level': 0,
            'type': 'Role'
        }, {'group': null, 'id': '1816631207', 'label': 'Sachverständiger', 'level': 0, 'type': 'Role'}, {
            'group': null,
            'id': '138922794',
            'label': 'Empfang Rechnung',
            'level': 0,
            'type': 'BusinessTask'
        }, {
            'group': null,
            'id': '-777123061',
            'label': 'Abnahme durchführen',
            'level': 0,
            'type': 'BusinessTask'
        }, {'group': null, 'id': '-191649356', 'label': 'Ausschreibung', 'level': 0, 'type': 'Document'}, {
            'group': null,
            'id': '1302588862',
            'label': 'Anlieferung Komponenten',
            'level': 0,
            'type': 'BusinessTask'
        }, {
            'group': null,
            'id': '-536710416',
            'label': 'Weiterleitung Rechnung Debitor',
            'level': 0,
            'type': 'BusinessTask'
        }, {'group': null, 'id': '-402393953', 'label': 'Buchungsbeleg', 'level': 0, 'type': 'Document'}, {
            'group': null,
            'id': '-2072969277',
            'label': 'Preisspiegel',
            'level': 0,
            'type': 'Document'
        }, {
            'group': null,
            'id': '352242694',
            'label': 'Schlusszahlungsmitteilung',
            'level': 0,
            'type': 'Document'
        }, {
            'group': null,
            'id': '1932639311',
            'label': 'Kostenkalkulation basierend auf Equipment',
            'level': 0,
            'type': 'BusinessTask'
        }, {
            'group': null,
            'id': '-1048518525',
            'label': 'Gutachten erstellen',
            'level': 0,
            'type': 'BusinessTask'
        }, {'group': null, 'id': '-277991050', 'label': 'Vergabeprotokoll', 'level': 0, 'type': 'Document'}, {
            'group': null,
            'id': '619354594',
            'label': 'Zahlungsannahme',
            'level': 0,
            'type': 'BusinessTask'
        }, {'group': null, 'id': '-595699606', 'label': 'Kostenberechnung', 'level': 0, 'type': 'Document'}, {
            'group': null,
            'id': '-1160397572',
            'label': 'Bedienungs-/ Gebrauchsanleitung',
            'level': 0,
            'type': 'Document'
        }]

    };

    /**
     * Global settings for the graph.
     *
     * Explanations:
     *
     *  If useImage = false:
     *
     *  colDefault: nodes and edges default color
     *  colSelect: nodes and edges color if selected
     *  edgWidthDef: default width for edges
     *
     *  If anything selected:
     *
     *  colUn: Color of unselected Nodes and Edges
     *  edgWidthUn: width for unselected edges
     *
     *  Other:
     *
     *  useImage: uses images instead of different shapes
     *  hideEdgesOnDrag: speaks for itself (-> increases performance)
     *
     *  options: object used by Network constructor. attributes are perfectly explained on  http://visjs.org/docs/network.html
     *
     * @type {{colDefault: string, colSelect: string, colUn: string, colFont: string, edgWidthDef: number, edgWidthUn: number, useImage: boolean, hideEdgesOnDrag: boolean}}
     */
    $scope.settings = {

        colDefault: 'grey',
        colSelect: 'green',
        colFont: 'black',
        colUn: 'white',
        edgWidthDef: 1.0,
        edgWidthUn: 1.0,
        useImage: true,
        imagePath: 'images/',
        options: {
            nodes: {
                fontSize: 20,
                color: {
                    background: 'grey',
                    border: 'grey'
                },
                radius: 20,
                widthMin: 50,
                widthMax: 50
            },
            edges: {
                width: 1.0,
                widthSelectionMultiplier: 1,
                style: 'arrow'
            },
            physics: {
                barnesHut: {
                    centralGravity: 0.5
                }
            },
            hideEdgesOnDrag: false,
            smoothEdges: false,
            stabilize: true,
            stabilizationIterations: 0
        }

    };
}]);