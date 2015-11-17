'use strict';

angular.module('visForDocreq', [])
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
'use strict';

angular.module('visForDocreq')
    .service('visUtils', function () {


        var selectionForPathBool = false;
        var settings;
        var network;
        var nodes;
        var edges;
        var nodeIndex = [];
        var selectionForPath = [];
        var stabilizeTimer = 0;

        var stronglyConnectedComponents = [];
        var deactivateCtrlForPathAnalytics = false;

        var serviceObject = this;

        /**
         * Main function.
         * Takes data and creates the visjs network.
         *
         * @param edgePack [{}]
         * @param nodePack [{}]
         * @param container DOM element for vishjs canvas
         * @param settingsImport user settings
         */
        serviceObject.redrawAll = function (edgePack, nodePack, container, settingsImport) {

            settings = settingsImport;

            nodes = new vis.DataSet();
            edges = new vis.DataSet();


            var nodesData = [];
            var edgesData = [];

            //edgePack = Array which contains edgeData <-> nodePack = ...
            for (var i = 0; i < edgePack.length; i++) {
                edgesData.push({
                    id: i,
                    to: edgePack[i].target,
                    from: edgePack[i].source
                });
            }

            for (var t = 0; t < nodePack.length; t++) {
                nodesData.push({
                    id: nodePack[t].id,
                    label: nodePack[t].label,
                    type: nodePack[t].type
                });
                nodeIndex.push(nodePack[t].id);
            }

            if (settings.useImage) {
                for (var m = 0; m < nodesData.length; m++) {
                    nodesData[m].shape = 'image';
                    nodesData[m].image = settings.imagePath + nodesData[m].type + '-icon.png';

                    switch (nodesData[m].type) {
                        case 'Role':
                            nodesData[m].mass = 20;
                            break;
                        case 'BusinessTask':
                            nodesData[m].mass = 10;
                            break;
                        case 'Document':
                            nodesData[m].mass = 5;
                            break;
                    }
                }
            } else {
                for (var e = 0; e < nodesData.length; e++) {
                    switch (nodesData[e].type) {
                        case 'Role':
                            nodesData[e].shape = 'star';
                            nodesData[e].mass = 20;
                            break;
                        case 'BusinessTask':
                            nodesData[e].shape = 'triangle';
                            nodesData[e].mass = 10;
                            break;
                        case 'Document':
                            nodesData[e].shape = 'square';
                            nodesData[e].mass = 5;
                            break;
                    }
                }
            }

            nodes.add(nodesData);
            edges.add(edgesData);

            var data = {
                nodes: nodes,
                edges: edges
            };
            network = new vis.Network(container, data, settings.options);

            network.on('stabilized', onStabilized);
            network.on('click', onClick);
            network.moveTo({
                scale: 0.00000000000000000000000000000000000000001
            });

            function onStabilized() {
                if (stabilizeTimer === 0) {
                    network.zoomExtent(false);
                }

                network.off('stabilized'); //dont reset view after first stabilization
            }
        };

        /**
         * Allows to set new data by using directive 2 way binding.
         *
         * @param edgePack
         * @param nodePack
         */
        serviceObject.updateData = function (edgePack, nodePack) {

            nodes.update(edgePack);
            edges.update(nodePack);
        };

        /**
         * Changes between the path or single selection mode.
         *
         * @param choice
         */
        serviceObject.setPathOrSelectionMode = function (choice, reset) {

            if(!nodes && !edges || (deactivateCtrlForPathAnalytics && reset)) {
                return;
            }

            if (choice === 'path') {
                selectionForPathBool = true;
                selectionForPath = [];

            } else {
                selectionForPathBool = false;
                selectionForPath = [];
            }
            if(reset) {
                var allNodes = nodes.get();
                var allEdges = edges.get();
                restoreOnUnselect(allNodes, allEdges);

                nodes.update(allNodes);
                edges.update(allEdges);
            }
        };

        /**
         * Return node succ as Array of nodeIds.
         *
         * @param nodeId
         * @param allEdges
         * @returns {Array}
         */
        function succ(nodeId, allEdges) {

            var connectedNodes = [];

            for (var i = 0; i < allEdges.length; i++) {
                var edge = allEdges[i];

                if (edge.from === nodeId) {
                    connectedNodes.push(edge.to);
                }
            }
            return connectedNodes;
        }

        var count = 0;
        var stack = [];

        /**
         * Gets called if the users click inside the visjs context.
         *
         * @param selectedItems
         */
        function onClick(selectedItems) {

            var allNodes = nodes.get();
            var allEdges = edges.get();

            var hide = false;
            deactivateCtrlForPathAnalytics = false;

            // no path
            if (!selectionForPathBool) {

                if (selectedItems.nodes.length !== 1) {
                    restoreOnUnselect(allNodes, allEdges);


                } else {
                    hide = true;
                    for (var i = 0; i < allEdges.length; i++) {
                        allEdges[i].inConnectionList = (allEdges[i].from === selectedItems.nodes[0] || allEdges[i].to === selectedItems.nodes[0]);
                    }

                    clearLevelOfSeperation(allNodes); //reset nodes

                    var ids = getConnectedNodes(selectedItems.nodes[0], allEdges, true);

                    if(ids.indexOf(selectedItems.nodes[0]) === -1) {
                        ids.push(selectedItems.nodes[0]);
                    }

                    storeLevelOfSeperation(ids, allNodes); //save node states
                }

            // path
            } else {

                //reset Edges
                for (var i = 0; i < allEdges.length; i++) {
                    allEdges[i].inConnectionList = false;
                }

                //if 'blank' click or third selection -> reset
                if ((!selectedItems.nodes[selectedItems.nodes.length - 1]) || selectionForPath.length > 2) {
                    selectionForPath = [];
                    restoreOnUnselect(allNodes, allEdges);
                } else {
                    for (var p = 0; p < allNodes.length; p++) {
                        allNodes[p].checked = false;
                        if (allNodes[p].id === selectedItems.nodes[selectedItems.nodes.length - 1]) {
                            allNodes[p].inConnectionList = true;
                            selectionForPath.push(allNodes[p]);
                        }
                    }
                }

                //if two selected -> calculate path
                if (selectionForPath.length === 2) {
                    deactivateCtrlForPathAnalytics = true;
                    hide = true;

                    setAllNodesToUnvisited(allNodes);
                    stronglyConnectedComponents = [];

                    for (i = 0; i < allNodes.length; i++) {
                        count = 0;
                        stack = [];

                        if (allNodes[i].state === 'unchecked') {
                            tarjanForStronglyConnectedComponents(allNodes, allEdges, allNodes[i]);
                        }
                    }

                    var alternativeRepresentation = [];

                    for (var i = 0; i < stronglyConnectedComponents.length; i++) {
                        alternativeRepresentation.push({
                            id: i,
                            nodes: stronglyConnectedComponents[i],
                            to: []
                        });
                    }

                    for (var i = 0; i < alternativeRepresentation.length; i++) {
                        for (var j = 0; j < alternativeRepresentation[i].nodes.length; j++) {
                            var su = succ(alternativeRepresentation[i].nodes[j].id, allEdges);
                            for (var k = 0; k < alternativeRepresentation.length; k++) {
                                if (k === i) {
                                    continue;
                                }
                                for (var t = 0; t < alternativeRepresentation[k].nodes.length; t++) {
                                    for (var z = 0; z < su.length; z++) {

                                        if (alternativeRepresentation[k].nodes[t].id === su[z] && $.inArray(k, alternativeRepresentation[i].to) === -1) {
                                            alternativeRepresentation[i].to.push(k);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    var startId = selectionForPath[0].id;
                    var targetId = selectionForPath[1].id;

                    var startIndex, targetIndex;

                    // works perfectly fine
                    for (var i = 0; i < alternativeRepresentation.length; i++) {
                        for (var j = 0; j < alternativeRepresentation[i].nodes.length; j++) {
                            if (alternativeRepresentation[i].nodes[j].id === startId) {

                                startIndex = i;
                            } else if (alternativeRepresentation[i].nodes[j].id === targetId) {
                                targetIndex = i;
                            }
                        }
                    }

                    getAllPathsBetweenSCC(startIndex, targetIndex, alternativeRepresentation);
                    var temp = [];

                    // get back from SCC to normal nodes and set inConnectionList true
                    for (var i = 0; i < alternativeRepresentation.length; i++) {
                        if (alternativeRepresentation[i].highlight) {
                            for (var j = 0; j < alternativeRepresentation[i].nodes.length; j++) {
                                for (var t = 0; t < allNodes.length; t++) {
                                    if (allNodes[t].id === alternativeRepresentation[i].nodes[j].id) {
                                        temp.push(allNodes[t]);
                                        allNodes[t].inConnectionList = true;
                                    }
                                }
                            }
                        }
                    }

                    // highlight edges
                    for (var t = 0; t < temp.length; t++) {
                            for(var i = 0; i < allEdges.length; i++) {
                                if(allEdges[i].to === temp[t].id) {
                                    for(var j = 0; j < temp.length; j++) {
                                        if(temp[j].id === allEdges[i].from) {
                                            allEdges[i].inConnectionList = true;
                                        }
                                    }
                                } else if (allEdges[i].from === temp[t].id) {
                                    for(var j = 0; j < temp.length; j++) {
                                        if(temp[j].id === allEdges[i].to) {
                                            allEdges[i].inConnectionList = true;
                                        }
                                    }
                                }
                            }
                    }

                    serviceObject.setPathOrSelectionMode('selection', false);

                    selectionForPath = [];
                }
            }
            setColor(allNodes, allEdges, hide);

            nodes.update(allNodes);
            edges.update(allEdges);
        }

        function getAllPathsBetweenSCC(currIndex, targetIndex, allSCC) {
            if (currIndex === targetIndex) {
                allSCC[currIndex].highlight = true;
                return true;
            }

            for (var i = 0; i < allSCC[currIndex].to.length; i++) {
                if (getAllPathsBetweenSCC(allSCC[currIndex].to[i], targetIndex, allSCC)) {

                    allSCC[currIndex].highlight = true;
                }
            }

            return allSCC[currIndex].highlight;
        }

        function setAllNodesToUnvisited(allNodes) {

            for (var i = 0; i < allNodes.length; i++) {
                allNodes[i].state = 'unchecked';
            }
        }

        function tarjanForStronglyConnectedComponents(allNodes, allEdges, currentNode) {

            //possible states: unchecked, checked, finished
            //console.log('current:', currentNode.label);
            currentNode.state = 'checked';

            count++;
            currentNode.in = count;
            currentNode.l = count;

            stack.push(currentNode);
            currentNode.onStack = true;

            var su = succ(currentNode.id, allEdges);

            for (var i = 0; i < su.length; i++) {
                var next = getNodeById(su[i], allNodes);
                //console.log(next);

                if (!next.onStack) {
                    tarjanForStronglyConnectedComponents(allNodes, allEdges, next);
                    currentNode.l = currentNode.l > next.l ? next.l : currentNode.l;
                } else {
                    currentNode.l = currentNode.l > next.in ? next.in : currentNode.l;
                }

            }

            //strong connected component
            if (currentNode.l === currentNode.in) {

                var component = [];

                while (stack[stack.length - 1].id !== currentNode.id) {
                    var w = stack.pop();
                    w.onStack = false;
                    component.push(w);
                }

                var w = stack.pop();
                w.onStack = false;
                component.push(w);


                addComponentWithoutDuplicate(component);
            }

            currentNode.state = 'finished';
            count++;
        }

        function addComponentWithoutDuplicate(comp) {

            var valid = true;
            angular.forEach(stronglyConnectedComponents, function (current) {
                    //if length matches -> check in detail
                    if (current.length === comp.length) {

                        for (var j = 0; j < comp.length; j++) {

                            if (current[0].id === comp[j].id) {
                                valid = false;
                            }
                        }
                    }
                }
            );

            if (valid) {
                stronglyConnectedComponents.push(comp);
            }
        }

        function getNodeById(nodeId, allNodes) {
            for (var i = 0; i < allNodes.length; i++) {
                if (allNodes[i].id === nodeId) {
                    return allNodes[i];
                }
            }
            return null;
        }

        /**
         * Sets all Nodes (Color and Label) on unselect (!visjs can still
         * think that it is selected) and sets the edges color and width on default.
         * @param {[object]} allNodes
         * @param {[object]} allEdges
         */
        function restoreOnUnselect(allNodes, allEdges) {
            var nodeId;
            for (nodeId in allNodes) {
                if (allNodes.hasOwnProperty(nodeId)) {
                    if (settings.useImage) {
                        allNodes[nodeId].image = settings.imagePath + allNodes[nodeId].type + '-icon.png';
                    } else {
                        allNodes[nodeId].color = settings.colDefault;
                    }
                    if (allNodes[nodeId].oldLabel !== undefined) {
                        allNodes[nodeId].label = allNodes[nodeId].oldLabel;
                        allNodes[nodeId].oldLabel = undefined;
                    }
                    allNodes[nodeId].levelOfSeperation = undefined;
                    allNodes[nodeId].inConnectionList = undefined;
                }
            }

            for (var i = 0; i < allEdges.length; i++) {
                allEdges[i].color = settings.colDefault;
                allEdges[i].width = settings.edgWidthDef;
                allEdges[i].inConnectionList = false;
            }
        }

        /**
         * update the allNodes object with the level of separation.
         */
        function storeLevelOfSeperation(nodeIdsForHighlighting, allNodes) {

            for (var i = 0; i < nodeIdsForHighlighting.length; i++) {
                for (var j = 0; j < allNodes.length; j++) {

                    if (allNodes[j].id === nodeIdsForHighlighting[i]) {
                        allNodes[j].levelOfSeperation = 1;
                        allNodes[j].inConnectionList = true;
                    }
                }

            }
        }

        /**
         * Setting attr levelOfSeperation of all nodes = undefined
         *
         * @param {[object]} allNodes
         */
        function clearLevelOfSeperation(allNodes) {
            for (var nodeId in allNodes) {
                if (allNodes.hasOwnProperty(nodeId)) {

                    allNodes[nodeId].levelOfSeperation = undefined;
                    allNodes[nodeId].inConnectionList = undefined;
                }
            }
        }

        /**
         * Get a list of nodes that are connected to the supplied nodeId with edges.
         * @param nodeId - current node
         * @param allEdges - all edges
         * @param bothDirections - interprete graph as undirected
         * @returns Array of Ids
         */
        function getConnectedNodes(nodeId, allEdges, bothDirections) {
            var connectedNodes = [];

            for (var i = 0; i < allEdges.length; i++) {
                var edge = allEdges[i];
                if (edge.to === nodeId && bothDirections && connectedNodes.indexOf(edge.from) === -1) {
                    connectedNodes.push(edge.from);
                }
                else if (edge.from === nodeId && connectedNodes.indexOf(edge.to) === -1) {
                    connectedNodes.push(edge.to);
                }
            }
            return connectedNodes;
        }

        /**
         * Sets color for Nodes and Edges
         * @param {boolean} hide (for unselected objects)
         * @param allEdges
         * @param allNodes
         */
        function setColor(allNodes, allEdges, hide) {
            //nodes
            for (var t = 0; t < allNodes.length; t++) {

                if (allNodes[t].inConnectionList === true) {
                    if (settings.useImage) {
                        allNodes[t].image = settings.imagePath + allNodes[t].type + '-icon.png';
                    } else {
                        allNodes[t].color = settings.colSelect;
                    }
                    if (allNodes[t].oldLabel !== undefined) {
                        allNodes[t].label = allNodes[t].oldLabel;
                        allNodes[t].oldLabel = undefined;
                    }
                }
                else {
                    if (hide) {
                        if (settings.useImage) {
                            allNodes[t].image = settings.imagePath + 'blank.png';

                        } else {
                            allNodes[t].color = settings.colUn;
                        }
                        if (allNodes[t].oldLabel === undefined) {
                            allNodes[t].oldLabel = allNodes[t].label;
                            allNodes[t].label = '';
                        }
                    } else {
                        if (settings.useImage) {
                            allNodes[t].image = settings.imagePath + allNodes[t].type + '-icon.png';
                        } else {
                            allNodes[t].color = settings.colDefault;
                        }
                    }
                }
            }

            //edges
            for (var i = 0; i < allEdges.length; i++) {
                if (allEdges[i].inConnectionList) {
                    allEdges[i].color = settings.colSelect;
                    allEdges[i].width = settings.edgWidthDef;
                } else {

                    if (hide) {
                        allEdges[i].color = settings.colUn;
                        allEdges[i].width = settings.edgWidthUn;
                    } else {
                        allEdges[i].width = settings.edgWidthUn;
                        allEdges[i].color = settings.colDefault;
                    }
                }
            }
        }

        return serviceObject;
    }
);