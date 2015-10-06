'use strict';

angular.module('testApp', []).service('visUtils', function () {

    var settings;
    var network;
    var nodes;
    var edges;
    var nodeIndex = [];
    var selectionForPath = [];
    var stabilizeTimer = 0;


    var serviceObject = this;

    /**
     * Main function.
     * Takes data and creates the visjs network.
     *
     * @param edgePack [{}]
     * @param nodePack [{}]
     * @param container DOM element for visjs canvas
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

    serviceObject.updateData = function (edgePack, nodePack) {

        nodes.update(edgePack);
        edges.update(nodePack);
    };

    serviceObject.setPathOrSelectionMode = function (choice) {

        var allNodes = nodes.get();
        var allEdges = edges.get();
        restoreOnUnselect(allNodes, allEdges, settings);

        if (choice === 'path') {
            //console.log('path mode');
            network.off('click', onClick);
            network.on('select', onSelect);
            selectionForPath = [];

        } else {
            //console.log('selection mode');
            network.on('click', onClick);
            network.off('select', onSelect);
            selectionForPath = [];
        }

        nodes.update(allNodes);
        edges.update(allEdges);
    };


    /**
     * Highlights the selected node and direct neighbours.
     * @param selectedItems
     */
    function onClick(selectedItems) {

        var allNodes = nodes.get();
        var allEdges = edges.get();


        if (selectedItems.nodes.length !== 1) {
            restoreOnUnselect(allNodes, allEdges, settings);
        } else {
            for (var i = 0; i < allEdges.length; i++) {
                allEdges[i].inConnectionList = (allEdges[i].from === selectedItems.nodes[0] || allEdges[i].to === selectedItems.nodes[0]);
            }

            clearLevelOfSeperation(allNodes); //reset nodes

            var ids = getConnectedNodes(selectedItems.nodes[0], allEdges, true);
            ids.push(selectedItems.nodes[0]);

            storeLevelOfSeperation(ids, allNodes); //save node states

            setColor(allNodes, allEdges, true);
        }

        nodes.update(allNodes);
        edges.update(allEdges);
    }

    /**
     * Selected Nodes are saved in var selectionForPath. After selecting two Nodes
     * it will start a depth-first search, which calculates and highlights all possible ways.
     *
     * @param selectedItems
     */
    function onSelect(selectedItems) {

        var allNodes = nodes.get();
        var allEdges = edges.get();

        var hide = false;

        //reset Edges
        for (var i = 0; i < allEdges.length; i++) {
            allEdges[i].inConnectionList = false;
        }

        //if 'blank' click or third selection -> reset
        if ((!selectedItems.nodes[selectedItems.nodes.length - 1]) || selectionForPath.length > 2) {
            selectionForPath = [];
            restoreOnUnselect(allNodes, allEdges, settings);
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

            //TODO
            //var temp = angular.copy(allNodes);
            //setAllNodesToUnvisited(temp);
            //for(i = 0; i < temp.length; i++){
            //    if(temp[i].state === 'unchecked'){
            //        tarjanForStronglyConnectedComponents(temp, allEdges, temp[i]);
            //    }
            //}

            selectionForPath = [];
        }

        setColor(allNodes, allEdges, hide);
        nodes.update(allNodes);
        edges.update(allEdges);
    }


    //var count = 0;
    //var stack = [];

    //function setAllNodesToUnvisited(allNodes) {
    //
    //    count = 0;
    //    stack = [];
    //
    //    for(var i = 0; i < allNodes.length; i++){
    //        allNodes[i].state = 'unchecked';
    //    }
    //}


    //function tarjanForStronglyConnectedComponents(allNodes, allEdges, currentNode) {

    //currentNode = allNodes[0]

    //possible states: unchecked, checked, finished
    //currentNode.state = 'checked';
    //console.log(allNodes);
    //
    //count++;
    //currentNode.in = count;
    //currentNode.l = count;
    //
    //stack.push(currentNode);
    //currentNode.onStack = true;
    //
    //var su = succ(currentNode.id, allEdges);
    //
    //for(var i = 0; i < su.length; i++) {
    //    var next = getNodeById(su[i], allNodes);
    //    //console.log(next);
    //
    //    if(next.state === 'unchecked') {
    //        tarjanForStronglyConnectedComponents(allNodes, allEdges, next);
    //        currentNode.l = currentNode.l > next.l ? next.l : currentNode.l;
    //    } else if(next.onStack) {
    //        currentNode.l = currentNode.l > next.in ? next.in : currentNode.l;
    //    }
    //
    //}
    //
    //if(currentNode.l === currentNode.in) {
    //    console.log('starke Szkomponente:');
    //    while(stack[stack.length - 1].id !== currentNode.id) {
    //        var w = stack.pop();
    //        w.onStack = false;
    //        console.log(w);
    //    }
    //}
    //
    //currentNode.state = 'finished';
    //count++;

    //Tarjan-visit(G,v){
    //    farbe[v]=grau; zeit=zeit+1; in[v]=zeit; l[v]=zeit;
    //    PUSH(S,v)
    //    FOR EACH u in succ(v) DO {
    //        IF farbe[u]=weiss THEN
    //        { Tarjan-visit[u]; l[v]=min(l[v],l[u]) ;}
    //        ELSEIF u in S THEN l[v]=min(l[v],in[u]);
    //    }
    //    IF (l[v]=in[v]) {
    //        Ausgabe(starke ZshK":)
    //        DO { u=TOP(S); Ausgabe(u); POP(S); }
    //        UNTIL u=v;
    //    }
    //    farbe[v]=schwarz; zeit=zeit+1;
    //}
    //}

    //function getNodeById(nodeId, allNodes) {
    //     for( var i = 0; i < allNodes.length; i++) {
    //         if(allNodes[i].id === nodeId){
    //             return allNodes[i];
    //         }
    //     }
    //    return null;
    //}

    /**
     * Sets all Nodes (Color and Label) on unselect (!visjs can still
     * think that it is selected) and sets the edges color and width on default.
     * @param {[object]} allNodes
     * @param {[object]} allEdges
     */
    function restoreOnUnselect(allNodes, allEdges, settings) {
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
     * Starts a depth-first search and returns an array containing
     * all possible ways between two nodes.
     * @param {int} nodeId
     * @param {[object]} allNodes
     * @param {[object]} allEdges
     * @param {int} targetId
     * @returns {*}
     */
    //function depthFirstSearch(nodeId, allNodes, allEdges, targetId, nodeIndex) {
    //
    //    var nodePos = givePos(nodeId, nodeIndex);
    //    //if found
    //    if (nodeId === targetId) {
    //        console.log('found node: ' + allNodes[givePos(nodeId, nodeIndex)].label);
    //        return [[nodeId]];
    //    }
    //    var neighbours = getConnectedNodes(nodeId, allEdges, false);
    //
    //    //if leaf
    //    if (neighbours.length === 0) {
    //        console.log('it is a leave -> stop!');
    //        return [];
    //        //if cycle
    //    } else if (allNodes[nodePos].checked) {
    //        console.log('we are moving in a cycle ... ');
    //
    //        return [];
    //
    //    } else {
    //        console.log('neighbours are ' + neighbours);
    //        var paths = [];
    //        allNodes[nodePos].checked = true;
    //
    //        for (var i = 0; i < neighbours.length; i++) {
    //            console.log('checking node ' + allNodes[givePos(neighbours[i], nodeIndex)].label);
    //            var temp = depthFirstSearch(neighbours[i], allNodes, allEdges, targetId, nodeIndex);
    //
    //            for (var k = 0; k < temp.length; k++) {
    //                temp[k].push(nodeId);
    //                paths.push(temp[k]);
    //            }
    //
    //        }
    //        allNodes[nodePos].checked = false;
    //        return paths;
    //    }
    //}

    /**
     * Get a list of nodes that are connected to the supplied nodeId with edges.
     * @param nodeId, bothDirections
     * @returns {Array of Ids}
     */
    function getConnectedNodes(nodeId, allEdges, bothDirections) {
        var connectedNodes = [];

        for (var i = 0; i < allEdges.length; i++) {
            var edge = allEdges[i];
            if (edge.to === nodeId && bothDirections) {
                connectedNodes.push(edge.from);
            }
            else if (edge.from === nodeId) {
                connectedNodes.push(edge.to);
            }
        }
        return connectedNodes;
    }

    //function succ(nodeId, allEdges) {
    //
    //    var connectedNodes = [];
    //
    //    for (var i = 0; i < allEdges.length; i++) {
    //        var edge = allEdges[i];
    //
    //        if(edge.from === nodeId) {
    //            connectedNodes.push(edge.to);
    //        }
    //    }
    //    return connectedNodes;
    //}

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
}).directive('visGraph', ['visUtils',
    function (visUtils) {

        return {
            restrict: 'E',
            scope: {
                data: '=',
                settings: '=',
                height: '@'
            }, template: '<div style="width:100%; height: {{height}}" id="__vistemplate"  ></div>',
            link: function (scope) {

                var firstTimeRendering = true;

                var container = $('#__vistemplate')[0];


                var body = $('body');
                //its necessary to bind this object to the body DOM element, because 'visjs' seems to override events on the __vistemplate div.
                body.keydown(function (event) {

                    if (event.keyCode === 17) {
                        visUtils.setPathOrSelectionMode('path');
                    }
                });

                body.keyup(function (event) {

                    if (event.keyCode === 17) {
                        visUtils.setPathOrSelectionMode('selection');
                    }
                });

                scope.$watch('data', function (newValue) {

                    if (firstTimeRendering && newValue) {

                        visUtils.redrawAll(scope.data.edges, scope.data.nodes, container, scope.settings);
                        firstTimeRendering = false;

                    } else if (newValue) {
                        visUtils.updateData(scope.data.edges, scope.data.nodes);
                    }

                });
            }
        };
    }]);