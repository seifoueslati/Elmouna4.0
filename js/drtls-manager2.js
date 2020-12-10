/**
 * LEAPS - Low Energy Accurate Positioning System.
 *
 * Main UI JS file.
 *
 * Copyright (c) 2016-2018, LEAPS. All rights reserved.
 *
 */
var topicPrefix = 'dwm',        // MQTT topic prefix
    connectionAttempt = 0,      // current connect attempt
    maxConnectionAttempts = 5,  // max connection attempts before giving up
    mqttDebug = {
        general: true,          // general debug info
        node: true,             // log all node messages
        position: true,         // log node position (location) messages
        config: true,           // log node configuration messages
        status: true,           // log node status messages
        data: true,             // log node data messages
        gws: true,              // log gateway messages
        uplink: true            // log uplink messages
    };
    mqttDebug = false;          // delete this line to print all incoming MQTT messages to console (according to types set to true above)

var connections = {             // default connection parameters - overridden with img/plans/connections.json values
       // uri: "ws://192.168.1.9:15675/ws",  // URI to connect to
        user: "",   // user name
        pass: "",   // password
        host:"192.168.1.7",
        port: 15675
    },
    nodes = [],
    gateways = [],
    surfacingNodes = {},    // list of nodes that we know about but not enough info yet to add them to UI
    world = {
        floor: {
            url: null,
            mesh: null
        },
        dimensions: null
    };

var sceneWidth = $(window).width() ,
    sceneHeight = $(window).height() - 10;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, sceneWidth / sceneHeight, 0.1, 1000),
    controls;

var worldZero = new THREE.Vector3(0,0,0),           // "center" of the world
    labelOffset = new THREE.Vector3(0, 0.12, 0.05), // text label offset from the node object
    wsClient;   // WebSocket client

var ortho = false,      // in ortho (pseudo-2D) mode?
    orthoWorldZ = 0.025,    // node Z-coord for pseudo-2D
    orthoLabelZ = 0.15;     // label Z-coord for pseudo-2D

// client configuration options - stored under topicPrefix + 'Config' key in browser's localStorage
var clientConfig = {
    onlineFilter: true,
    showLabels: true,
    positionAverage: true,
    orthoDisplay: true
};

// dynamic label scaling: starting scale
var baseLabelScale = new THREE.Vector3(1, 0.125, 1),
    labelFactor = 5;

// starting position of camera
var cameraStart = new THREE.Vector3(0, 0, 15);

// various configuration options and enums
var CFG = {
    FLOOR_MESH_NAME: "floor",
    WORLD: {
        STATUS_LOADING: 'loading',
        STATUS_CONNECTED: 'connected',
        STATUS_DISCONNECTED: 'disconnected',
        STATUS_ERROR: 'error',
        STATUS_RECONNECTING: 'reconnecting'
    },
    NODE_TYPE: {
        TAG: 'TAG',
        ANCHOR: 'ANCHOR'
    },
    ANCHOR_ROUTING_STATUS: {
        INACTIVE: 'ROUTING_STAT_INACTIVE',
        SELECTED: 'ROUTING_STAT_SELECTED',
        ACTIVE: 'ROUTING_STAT_ACTIVE'
    },
    ANCHOR_ROUTING_CONFIG: {
        OFF: 'ROUTING_CFG_OFF',
        ON: 'ROUTING_CFG_ON',
        AUTO: 'ROUTING_CFG_AUTO'
    },
    FLIPSWITCH: {
        ACTIVE: true,
        INACTIVE: false
    },
    UWB: {
        ACTIVE: true,
        PASSIVE: false,
    },
    UPDATE_RATES: {
        '100 ms/10 Hz': 100,
        '200 ms/5 Hz': 200,
        '500 ms/2 Hz': 500,
        '1 s/1 Hz': 1000,
        '2s/0.5 Hz': 2000,
        '5s/0.2 Hz': 5000,
        '10s/0.1 Hz': 10000,
        '30s/0.03 Hz': 30000,
        '1 min/0.017 Hz': 60000,
        'default': 0
    }
};

var DWM = {
    UPLOAD_URL: '/upload.php',
    OFFLINE_COLOR: '#AAAAAA',
    STATUS: {
        OFFLINE: false,
        ONLINE: true
    },
    UPLINK_TOPIC: {
        LOCATION: 'location',
        CONFIG: 'config',
        STATUS: 'status',
        DATA: 'data'
    },
    DOWNLINK_TOPIC: {
        CONFIG: 'config',
        DATA: 'data'
    },
    TOOLTIPS: {
        TAG: 'Show/hide list of active tags',
        ANCHOR: 'Show/hide list of active anchors',
        GW: 'Show/hide list of gateways'
    }
};

var ANCHOR_COLORS = {
    NO: '#FF0000',   // NO routing = plain anchor
    SELECTED: '#0000FF',   // SELECTED
    ACTIVE: '#00FF00'    // ACTIVE
};

var MOVING_AVERAGE_k = 10;

var worldStatus = CFG.WORLD.STATUS_LOADING,
    configDialogOpen = false,
    nodeListsRefresh = [],  // selectors for node list/s that needs refresh - #node-type-gateway, #node-type-anchor or #node-type-tag or even more generic when searching
    nodeListsSort = [];     // selectors for node list/s that needs sort

// utility functions

function nc() {
    return Math.floor(Math.random() * 2147483647);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

//IE11 String.repeat() polyfill
if (!('repeat' in String.prototype)) {
    String.prototype.repeat = function(num) {
        var repeated = '';
        while (num > 0) {
            repeated += this;
            num--;
        }
        return repeated;
    }
}

function zeroPad(str, num) {
    if (str.length >= num) {
        return str;
    }
    return '0'.repeat(num - str.length) + str;
}

function getTopicName(nodeId, linkDir, topic) {
    return topicPrefix + '/node/' + zeroPad(parseInt(nodeId).toString(16).toLowerCase(), 4) + '/' + linkDir + '/' + topic;
}

function byteLen(str) {
    return unescape(encodeURI(str)).length;
}

function trimUntilMaxByteLen(str, max) {
    while(byteLen(str) > max) {
        str = str.substring(0, str.length - 1);
    }
    return str;
}

function hexToBase64(hexString) {
    var bytes = [],
            binString;
    for (var i = 0; i < hexString.length - 1; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    binString = String.fromCharCode.apply(String, bytes);
    return btoa(binString);
}

function base64ToHex(base64String) {
    var binString = atob(base64String),
            hexArray = [];
    for (var i = 0; i < binString.length; i++) {
        hexArray.push(toHex(binString.charCodeAt(i)));
    }
    return hexArray.join('');
}

function threeColor(color) {
    if (color instanceof String) {
        color = parseInt(color.replace('#', '0x'));
    }
    return color;
}

var baseColors = [
    '2196f3',
    'ffb74d',
    'ff9100',
    '40c4ff',
    'ff8dfb'
];

function toHex(b)
{
    var h = b.toString(16);
    if (h.length == 1) {
        h = '0' + h;
    }
    return h;
}

function idToLabel(id)
{
    return 'DW' + zeroPad(parseInt(id).toString(16).toUpperCase(), 4);
}

// color generator helper
function byteHash() {
    var r = 0;
    for (a in arguments) {
        r += arguments[a] * 7;
    }
    return r % 256;
}

// create the color using algorithm similar to one used in Android app
function getColor(b0, b1, b2) {
    var h = byteHash(b0, b1, b2),
        baseColor = baseColors[h % baseColors.length],
        baseR = parseInt(baseColor.substr(0, 2), 16),
        baseG = parseInt(baseColor.substr(2, 2), 16),
        baseB = parseInt(baseColor.substr(4, 2), 16),
        r = Math.round((baseR + b0) * h / 255) % 255,
        g = Math.round((baseG + b1) * h / 255) % 255,
        b = Math.round((baseB + b2) * h / 255) % 255;

    return '#' + toHex(r) + toHex(g) + toHex(b);
}

function getColorById(id) {
    var b0 = id & 0xff, // always 0 as id only has 2 bytes
        b1 = (id & 0xff00) >> 8,
        b2 = (id & 0xff0000) >> 16;
   return getColor(b0, b1, b2);
}


function roundPosFixed(val) {
    return parseFloat(val).toFixed(2);
}

function posString(val) {
    if (isNaN(val)) {
        return "NaN";
    }
    return roundPosFixed(val);
}

// two decimals rounding helper
function roundPos(val) {
    return parseFloat(parseFloat(val).toFixed(2));
}

// add .round() function to vector prototype
THREE.Vector3.prototype.round = function() {
    this.x = roundPos(this.x);
    this.y = roundPos(this.y);
    this.z = roundPos(this.z);
    return this;
}

// moving average helper
function movingAverage(prev, now) {
    // MOVING_AVERAGE(o,n,k)       (((k)*(o)+(n))/((k)+1))
    return (parseFloat(MOVING_AVERAGE_k * prev) + parseFloat(now)) / (MOVING_AVERAGE_k + 1);
}

// add .setMovingAverage() to vector prototype
THREE.Vector3.prototype.setMovingAverage = function(x, y, z) {
    // not before, not now!
    var oldIsNaN = isNaN(this.x) || isNaN(this.y) || isNaN(this.z),
        newIsNaN = isNaN(x) || isNaN(y) || isNaN(z);
    if (clientConfig.positionAverage && !oldIsNaN && !newIsNaN) {
        this.x = movingAverage(this.x, x);
        this.y = movingAverage(this.y, y);
        this.z = movingAverage(this.z, z);
        return this;
    }
    // else
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
}

// initialize camera
camera.position = cameraStart;
camera.lookAt(worldZero);


// initialize rendering
var renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true
});
renderer.setSize(sceneWidth, sceneHeight);
renderer.setClearColor(0xffffff);
document.getElementById('scene').appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xf0f0f0));

// tracing configuration
var trace = false,
    traceDistance = 0.25,
    traceCount = 10,
    traceFadeSpeed = 1000;


function redrawAllNodesPosition() {
    if (nodes != null) {
        for (var id in nodes) {
            var node = nodes[id];
            if ('rawPosition' in node.userData) {
                var pos = node.userData.rawPosition;
                nodePositionSet(id, pos.x, pos.y, pos.z, pos.quality, true);
            }
        }
    }
}

function containsNotNull(obj, prop) {
    return (prop in obj) && (obj[prop] != null);
}

function removeFromScene(obj) {
    scene.remove(obj);
    if (containsNotNull(obj, 'geometry')) {
        obj.geometry.dispose();
    }
    if (containsNotNull(obj, 'material')) {
        if (containsNotNull(obj.material, 'materials')) {
            // MultiMaterial - floorplan
            for (var i in obj.material.materials) {
                obj.material.materials[i].dispose();
            }
        } else {
            // Maps - labels
            if (containsNotNull(obj.material, 'map')) {
                obj.material.map.dispose();
            }
            obj.material.dispose();
        }
    }
    if (containsNotNull(obj, 'texture')) {
        obj.texture.dispose();
    }
    if (containsNotNull(obj, 'dispose')) {
        obj.dispose();
    }
}

function scaleLabel(label, scale) {
    // scale x & y only
    scale = Math.max(5, scale);
    label.scale.set(baseLabelScale.x * scale, baseLabelScale.y * scale, baseLabelScale.z);
    return label;
}

function computeLabelScale(camera, label) {
    // controls.target.length() ~ zoom factor
    var distance = camera.position.distanceTo(label.position);
    return distance / labelFactor;
}

function rescaleAllLabels() {
    if (nodes != null) {
        for (var id in nodes) {
            var node = nodes[id];
            if (containsNotNull(node, 'label')) {
                scaleLabel(node.label, computeLabelScale(camera, node.label));
            }
        }
    }
}

function loadConfig() {
    var configKey = topicPrefix + 'Config';
    if (configKey in window.localStorage) {
        try {
            clientConfig = $.parseJSON(window.localStorage[configKey]);
            if (mqttDebug && mqttDebug.general) {
                console.log('client config', clientConfig);
            }
        } catch (ex) {
            // NOOP - let the defaults be set on error
        }
    }
}

function updateClientConfig(values) {
    loadConfig();
    $.extend(clientConfig, values);
    window.localStorage[topicPrefix + 'Config'] = JSON.stringify(clientConfig);
}

function initControls(camera, scene) {
    controls = new THREE.TrackballControls(camera, scene);
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 0.2;
    controls.panSpeed = 1.5;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.addEventListener('end', function(event) {
        rescaleAllLabels();
    }, false);
}

// view resetting to defaults
function resetView()
{
    controls.target0 = new THREE.Vector3(0, 0, 0);
    controls.position0 = cameraStart;
    controls.up0 = new THREE.Vector3(0, 1, 0);
    controls.reset();
    rescaleAllLabels();
}

function orthoDisplay() {
    updateClientConfig({orthoDisplay: true});
    initControls(camera, document.getElementById('scene'));
    controls.rotateSpeed = 0.0;
    resetView();
    redrawAllNodesPosition();
}

function threeDisplay() {
    updateClientConfig({orthoDisplay: false});
    initControls(camera, document.getElementById('scene'));
    controls.rotateSpeed = 2.0;
    resetView();
    redrawAllNodesPosition();
}

// load config and init the saved view type
loadConfig();
clientConfig.orthoDisplay ? orthoDisplay() : threeDisplay();

// mouse intersect implementation
function mouseClick(e) {
    var mouse = new THREE.Vector2(),
        raycaster = new THREE.Raycaster(), 
        intersects, 
        obj;
    mouse.x = (e.clientX / sceneWidth) * 2 - 1;
    mouse.y = - (e.clientY / sceneHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children);
    for (var i in intersects) {
        obj = intersects[i].object;
        if (('nodeId' in obj.userData) && !obj.userData.isTrace && !configDialogOpen && !$('#hamburger-contents').is(':visible')) {
            // active node object hit
            (function(highlight) {
                openConfigDialog(highlight.userData.nodeId);
                highlight.scale.set(2, 2, 2);
                setTimeout(function() {
                    highlight.scale.set(1, 1, 1);
                }, 500);
            })(obj);
        }
    }
}

// animation code
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
// initialize animating
animate();

// drop trace of the node shape
function dropTrace(node, force)
{
    // traces not initialized yet - node has not moved anyway
    if (!('trace' in node)) {
        return;
    }
    if ((node.trace.count >= traceCount) && !force) {
        return;
    }
    var traceObject = node.clone();
    traceObject.userData.isTrace = true;
    traceObject.material = node.material.clone();
    scene.add(traceObject);
    node.trace.lastPos = node.position.clone();
    node.trace.count++;
    var fadeInterval = setInterval(function(){
        traceObject.material.opacity -= 0.01;
        if (traceObject.material.opacity <= 0) {
            removeFromScene(traceObject);
            clearInterval(fadeInterval);
            node.trace.count--;
        }
    }, 1000 / traceFadeSpeed);
}


function nodePositionSet(id, x, y, z, quality, immediate)
{
    var illegalPosition = false;
    if(isNaN(x) || isNaN(y) || isNaN(z)) {
        illegalPosition = true;
    }
    if (!!mqttDebug && mqttDebug.position) {
        console.log(id.toString(16), 'position', x, y, z, quality);
    }
    if (isNewNode(id)) {
        var nodeDef = {
            id: id,
            rawPosition: new THREE.Vector3(x, y, z)
        };
        if (!initNode(nodeDef, !illegalPosition)) {
            // not enough info to add to the list, do not act further on this node
            return;
        }
    }

    var node = nodes[id],
        rawPos,
        worldPos = new THREE.Vector3();

    if (('rawPosition' in node.userData) && (node.userData.config.nodeType == CFG.NODE_TYPE.TAG)) {
        // position already received & tag, we can compute moving average
        rawPos = node.userData.rawPosition.clone();
        rawPos.setMovingAverage(x, y, z);
    } else {
        // first position or anchor: just set it
        rawPos = new THREE.Vector3(x, y, z);
    }
   
    if(node.userData.config.nodeType == CFG.NODE_TYPE.TAG) {
        increaseCounter(id, 'loc');
    }
    
    setNodePosUI(id, rawPos);
    
    if (!node.visible && !illegalPosition) {
        setNodeSceneVisibility(id, true);
    }
    
    node.userData.rawPosition = rawPos;

    if (illegalPosition) {
        // disregard illegal position from now on
        return;
    }

    worldPos.set(rawPos.x - worldZero.x, rawPos.y - worldZero.y, rawPos.z - worldZero.z).round();

    if (!immediate && trace) {
        if (!('trace' in node)) {
            node.trace = {
                lastPos: node.position.clone(),
                count: 0
            };
        }
        if (node.trace.lastPos.distanceTo(worldPos) >= traceDistance) {
            dropTrace(node);
        }
    }

    if (!clientConfig.orthoDisplay) {
        node.position.set(worldPos.x, worldPos.y, worldPos.z);
    } else {
        node.position.set(worldPos.x, worldPos.y, orthoWorldZ);
    }

    if (containsNotNull(node, 'label')) {
        if (!clientConfig.orthoDisplay) {
            node.label.position.set(worldPos.x + labelOffset.x, worldPos.y + labelOffset.y, worldPos.z + labelOffset.z);
        } else {
            node.label.position.set(worldPos.x + labelOffset.x, worldPos.y + labelOffset.y, orthoLabelZ);
        }
        scaleLabel(node.label, computeLabelScale(camera, node.label))
    }
}

// do we need to reinit (remove and add back) the node for this configuration change?
function nodeReinitNeeded(oldConfig, config) {
    // node type or label changed
    if ((oldConfig.nodeType != config.nodeType) || (oldConfig.label != config.label)) {
        return true;
    }
    // anchor node and routing mode changed
    if (config.nodeType == CFG.NODE_TYPE.ANCHOR) {
        if (oldConfig.anchor.routingStatus != config.anchor.routingStatus) {
            return true;
        }
    }
    return false;
}

function nodeConfigSet(nodeId, config)
{
    if (!!mqttDebug && mqttDebug.config) {
        console.log(nodeId.toString(16), 'config', config);
    }
    if (isNewNode(nodeId)) {
        if (!('label' in config)) {
            config.label = idToLabel(nodeId);
        }
        var nodeDef = {
            id: nodeId,
            config: config,
        };
        if (!initNode(nodeDef)) {
            return;
        }
    }
    var node = nodes[nodeId],
        oldConfig = node.userData.config;
    if (nodeReinitNeeded(oldConfig, config)) {
        // handle node type or name change
        removeNode(nodeId);
        initNode({
            id: nodeId,
            config: config
        });
    }
    node.userData.config = $.extend(node.userData.config, config);
    // we have anchor position with this config -> use it as node position
    if (('nodeType' in config) && (config.nodeType == CFG.NODE_TYPE.ANCHOR) && ('position' in config.anchor)) {
        var pos = config.anchor.position;
        nodePositionSet(nodeId, pos.x, pos.y, pos.z, pos.quality, true);
    }
}

function nodeStatusSet(id, status)
{
    if (!!mqttDebug && mqttDebug.status) {
        console.log(id.toString(16), 'status', status);
    }
    if (isNewNode(id)) {
        var nodeDef = {
            id: id,
            status: status
        };
        if (!initNode(nodeDef)) {
            return;
        }
    }
    var node = nodes[id];
    node.userData.status = status;
    switch (status) {
        case DWM.STATUS.ONLINE:
            clearTimeout(node.userData.delayHide);
            $('#' + getNodeDataUIId(id) + ' h4').removeClass('ui-state-error').addClass('ui-state-default');
            if (clientConfig.onlineFilter) {
                showNode(id);
                doSearch('', '#' + getNodeDataUIId(id));
            }
            break;
        case DWM.STATUS.OFFLINE:
            $('#' + getNodeDataUIId(id) + ' h4').removeClass('ui-state-default').addClass('ui-state-error');
            if (clientConfig.onlineFilter) {
                hideNode(id);
            }
            break;
    }
}

function nodeDataUISet(id)
{
    var node = nodes[id];
    if (node.userData.data.received) {
        $('#' + nodeConfig.getFieldName(id, 'received')).text(moment(node.userData.data.received).format());
    }
    if (node.userData.data.data) {
        $('#' + nodeConfig.getFieldName(id, 'nodeUplink')).val(base64ToHex(node.userData.data.data));
    }
}

function nodeDataSet(id, data)
{
    if (isNewNode(id)) {
        var nodeDef = {
            id: id,
            data: {
                received: new Date(),
                data: data
            }
        };
        if (!initNode(nodeDef)) {
            return;
        }
    }
    var node = nodes[id];
    node.userData.data = {
        received: new Date(),
        data: data  // base64
    };
    increaseCounter(id, 'iot');
    nodeDataUISet(id);
}

function initNodeTypeUI(id, name, nodeType) {
    var nodeTypeId = 'node-type-' + id;
    if (!$('#' + nodeTypeId).length) {
        var nodeTypeDataId = 'node-type-' + id + '-data',
            nodeTypeCountId = 'node-type-' + id + '-count',
            toolTip = DWM.TOOLTIPS[nodeType.toUpperCase()];
        $('<div id="' +  nodeTypeId + '" class="node-type"><h3 id="nodes-'+id+'-header" title="' + toolTip + '">' + name + ' (<span id="'+nodeTypeCountId+'">0</span>)</h3><div id="' + nodeTypeDataId + '" class="node-type-data"></div>').appendTo('#ui-nodes');
    }
}

function getNodeDataUIId(id){
    return 'node-' + id + '-data';
}

function setNodePosUI(id, rawPos) {
    var node = nodes[id],
        nodePrefix = 'node-' + id,
        posPrefix = nodePrefix + '-pos';

    $('#' + posPrefix + '-x').text('x: ' + posString(rawPos.x));
    $('#' + posPrefix + '-y').text('y: ' + posString(rawPos.y));
    $('#' + posPrefix + '-z').text('z: ' + posString(rawPos.z));
    // refresh values in cfg dialog, if open - only for tags
    if (node.userData.config.nodeType == CFG.NODE_TYPE.TAG) {
        var fieldPrefix = 'node-' + id + '-' + 'tagPosition-pos';
        $('#' + fieldPrefix + '-x').val(roundPosFixed(rawPos.x));
        $('#' + fieldPrefix + '-y').val(roundPosFixed(rawPos.y));
        $('#' + fieldPrefix + '-z').val(roundPosFixed(rawPos.z));
    }
}

function addNodeUI(id, mode, name, color, iotCounter, locCounter) {
    var nodeDataId = getNodeDataUIId(id),
        modePart = mode.toLowerCase(),
        nodePrefix = 'node-' + id,
        posPrefix = nodePrefix + '-pos',
        nodeIdHex = zeroPad(parseInt(id).toString(16).toUpperCase(), 4),
        wrapper = $('<div class="node-ui" id="'+nodeDataId+'"></div>').data({nodeId: id, nodeType: mode, visible: true}),
        markup = $('<h4 class="node-data js-node-config ui-button ui-corner-all ui-state-default ui-helper-clearfix"><div class="color-mark"></div><span class="node-name" id="node-'+id+'-name">'+name+'</span><span class="node-id"> id: 0x' + nodeIdHex + '</span><div class="node-position" id="node-'+id+'-pos"></div><div class="node-counters" id="node-'+id+'-counters"></div></a></h4>').appendTo(wrapper);
    
    $(wrapper).appendTo('#node-type-' + modePart + '-data');
    $('<span class="node-coord" id="' + posPrefix + '-x">x:</span>').appendTo('#' + posPrefix);
    $('<span class="node-coord" id="' + posPrefix + '-y">y:</span>').appendTo('#' + posPrefix);
    $('<span class="node-coord" id="' + posPrefix + '-z">z:</span>').appendTo('#' + posPrefix);
    $('#' + nodeDataId + ' .color-mark').css('background', color);
    if (locCounter) {
        $('<span class="counter counter-loc"><span class = "title" >loc: </span><span class="value">0</span ></span>').appendTo('#node-' + id + '-counters');
    }
    if (iotCounter) {
        $('<span class="counter counter-iot"><span class="title">iot: </span><span class="value">0</span></span>').appendTo('#node-' + id + '-counters');
    }
    refreshNodeCount('#node-type-' + modePart);
    nodeListRefresh('#node-type-' + modePart);
    nodeListSort('#node-type-' + modePart);
}

function increaseCounter(id, type) {
    var currentValSelector = '#node-' + id + '-counters .counter-' + type + ' .value',
        current = parseInt($(currentValSelector).text());
    $(currentValSelector).html(current + 1);
}

// mark node list as needing refresh
function nodeListRefresh(nodeList) {
    nodeListsRefresh.push(nodeList);
}

// mark node list as needing sort
function nodeListSort(nodeList) {
    nodeListsSort.push(nodeList);
}

function refreshNodeListsIfDirty() {
    if (nodeListsRefresh.length) {
        $(nodeListsRefresh.join(',')).sortedAccordion("refresh");
        nodeListsRefresh = [];
    }
    if (nodeListsSort.length) {
        $(nodeListsSort.join(',')).sortedAccordion("sort");
        nodeListsSort = [];
    }
}

function refreshNodeCount(nodeTypeId) {
    var cnt = 0;
    $(nodeTypeId + ' .node-ui').each(function(){
        if ($(this).data('visible')) {
            cnt++;
        }
    })
    $(nodeTypeId + '-count').text(cnt);
}

function hideGatewayUI(id) {
    var gatewayDataId = getNodeDataUIId(id),
        $gw = $('#' + gatewayDataId);

    if ($gw.data('visible')) {
        $gw.hide();
        $gw.data('visible', false);
        refreshNodeCount('#node-type-gateway');
        nodeListRefresh('#node-type-gateway');
    }
}

function showGatewayUI(id) {
    var gatewayDataId = getNodeDataUIId(id),
        $gw = $('#' + gatewayDataId);
    
    if (!$gw.data('visible')) {
        $gw.show();
        $gw.data('visible', true);
        refreshNodeCount('#node-type-gateway');
        nodeListRefresh('#node-type-gateway');
        nodeListSort('#node-type-gateway');
    }
}

function removeGatewayUI(id) {
    var gatewayDataId = getNodeDataUIId(id),
        $gateway = $('#' + gatewayDataId);
    
    $gateway.remove();
    delete gateways[id];
    refreshNodeCount('#node-type-gateway');
    nodeListRefresh('#node-type-gateway');
}

// find first non-localhost IPv4 address from the list given by gateway
function findNonLocalIPv4(ips) {
    var ipRe = /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/i,
        ip,
        match,
        i;
    
    for (i in ips) {
        ip = ips[i];
        match = ip.match(ipRe);
        // 127.0.0.1 -> 0 => 127.0.0.1, 1 => 127, 2 => 0, 3 => 0, 4 => 1
        if (match && (match.length == 5)) {
            if (match[0] != '127.0.0.1') {
                return ip;
            }
        }
    }
    
    return null;
}

function addGatewayUI(id, hexId, data, color) {
    if (id in gateways) {
        // already there, remove first
        removeGatewayUI(id);
    }
    var gatewayDataId = getNodeDataUIId(id);
    var gatewayIdHex = hexId.toUpperCase();
 	var wrapper = $('<div class="node-ui node-gateway" id="' + gatewayDataId + '"></div>').data({gatewayId: id, nodeType: 'gw', visible: true});
    var ipAddr = findNonLocalIPv4(data.ipAddress);
	if(!hexId.includes("deca"))
		var  markup = $('<h4 class="node-data js-gateway-dialog ui-button ui-corner-all ui-state-default ui-helper-clearfix"><span class="node-name" id="node-' + id + '-name"><div class="color-mark"></div>PROXY' + gatewayIdHex + '</span><span class="node-id">' + gatewayIdHex + '</span><span class="node-ip">' + ipAddr + '</span></a></h4>').appendTo(wrapper);
	else
		var  markup = $('<h4 class="node-data js-gateway-dialog ui-button ui-corner-all ui-state-default ui-helper-clearfix"><span class="node-name" id="node-' + id + '-name"><div class="color-mark"></div>' + gatewayIdHex + '</span><span class="node-id">' + gatewayIdHex + '</span><span class="node-ip">' + ipAddr + '</span></a></h4>').appendTo(wrapper);


    $(wrapper).appendTo('#node-type-gateway-data');
    $('#' + gatewayDataId + ' .color-mark').css('background', color);
    gateways[id] = data;
    refreshNodeCount('#node-type-gateway');
    nodeListRefresh('#node-type-gateway');
    nodeListSort('#node-type-gateway');
    doSearch();
}

function hideNodeUI(id) {
    var nodeDataId = getNodeDataUIId(id),
        modePart = nodes[id].userData.config.nodeType.toLowerCase(),
        $node = $('#' + nodeDataId);
    if ($node.data('visible')) {
        $node.hide();
        $node.data('visible', false);
        refreshNodeCount('#node-type-' + modePart);
        nodeListRefresh('#node-type-' + modePart);
    }
}

function showNodeUI(id) {
    var nodeDataId = getNodeDataUIId(id),
        modePart = nodes[id].userData.config.nodeType.toLowerCase(),
        $node = $('#' + nodeDataId);
    if (!$node.data('visible') && !nodes[id].filtered) {
        $node.show();
        $node.data('visible', true);
        refreshNodeCount('#node-type-' + modePart);
        nodeListRefresh('#node-type-' + modePart);
        nodeListSort('#node-type-' + modePart);
    }
}

function removeNodeUI(id) {
    var nodeDataId = getNodeDataUIId(id),
        modePart = nodes[id].userData.config.nodeType.toLowerCase(),
        $node = $('#' + nodeDataId);
    $node.remove();
    refreshNodeCount('#node-type-' + modePart);
    nodeListRefresh('#node-type-' + modePart);
}

function addUserData(object, def) {
    var defaults = {
        nodeId: def.id,
        lastMessage: null,
        status: DWM.STATUS.ONLINE,
        gwHexId: 'DEAD0000',    // this default value ensures black labels until actual GW info arrives
        config: {
            label: def.config.label,
            nodeType: def.config.nodeType,
            ble: CFG.FLIPSWITCH.ACTIVE,
            leds: CFG.FLIPSWITCH.ACTIVE,
            uwbFirmwareUpdate: CFG.FLIPSWITCH.ACTIVE,
            // anchor specific
            anchor: {
                initiator: CFG.FLIPSWITCH.INACTIVE,
                routingStatus: CFG.ANCHOR_ROUTING_STATUS.NO,
                position: new THREE.Vector3()
            },
            // tag specific
            tag: {
                stationaryDetection: CFG.FLIPSWITCH.ACTIVE,
                responsive: CFG.FLIPSWITCH.ACTIVE,
                locationEngine: CFG.FLIPSWITCH.ACTIVE,
                nomUpdateRate: CFG.UPDATE_RATES.default,
                statUpdateRate: CFG.UPDATE_RATES.default,
            }
        },
        data: {
            received: null,
            data: null,
        },
        // non-changeable info
        info: {
            bridge: CFG.FLIPSWITCH.ACTIVE
        }
    };
    object.userData = $.extend(defaults, def);
    return object;
}

// render text into a sprite
function createTextSprite(text, color)
{
    var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            fontSize = '128';

    canvas.width = 2048;
    canvas.height = 256;

    context.font = '600 ' + fontSize + 'px Arial, Helvetica, sans-serif';
    context.fillStyle = color;
    context.lineWidth = 8;
    context.strokeStyle = "rgb(255, 255, 255)";
    context.textAlign = "center";
    context.fillText(text, canvas.width / 2, fontSize);
    //use this for stroke: context.strokeText(text, canvas.width / 2, fontSize);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({map: texture, lights: true}),
    sprite = new THREE.Sprite(spriteMaterial);
    sprite.name = 'LABEL-' + text;

    return sprite;
}

function createLabelSprite(nodeId, visible) {
    var node = nodes[nodeId],
        nodeData = node.userData,
        //color = createGatewayColor(node.userData.gwHexId),
        entityLabelSprite = createTextSprite(nodeData.config.label, "rgb(100,100,100)");
        
    if (containsNotNull(node, 'label')) {
        removeFromScene(node.label);
        node.label = null;
    }
    
    entityLabelSprite.position.set(node.position.x + labelOffset.x, node.position.y  + labelOffset.y, node.position.z + labelOffset.z).round();
    scene.add(entityLabelSprite);
    entityLabelSprite.visible = clientConfig.showLabels && visible;
    node.label = entityLabelSprite;
    scaleLabel(node.label, computeLabelScale(camera, node.label));
}

function createNodeColor(id, config)
{
    if (config.nodeType == CFG.NODE_TYPE.ANCHOR) {
        switch (config.anchor.routingStatus) {
            case CFG.ANCHOR_ROUTING_STATUS.SELECTED:
                return ANCHOR_COLORS.SELECTED;
            case CFG.ANCHOR_ROUTING_STATUS.ACTIVE:
                return ANCHOR_COLORS.ACTIVE;
            default:
                return ANCHOR_COLORS.NO;
        }
    }
    return getColorById(id);
}

function createGatewayColor(hexId) {
    var b0 = 0,
        b1 = parseInt(hexId.substring(hexId.length - 2, hexId.length), 16),
        b2 = parseInt(hexId.substring(hexId.length - 4, hexId.length - 2), 16);
   return getColor(b0, b1, b2);
}

function recreateLabelSprites() {
    if (nodes != null) {
        for (var id in nodes) {
            createLabelSprite(id, nodes[id].label.visible);
        }
    }
}

function createNodeMesh(id, nodeType, color)
{
    switch (nodeType) {
        case CFG.NODE_TYPE.ANCHOR:
            var entityGeometry = new THREE.ConeGeometry(0.2, 0.2, 3),
                entityMaterial = new THREE.MeshPhongMaterial({transparent: true, color: color}),
                mesh = new THREE.Mesh(entityGeometry, entityMaterial);
            mesh.name = 'NODE-MESH-AN-' + id;
            return mesh;
            break;
        case CFG.NODE_TYPE.TAG:
            var entityGeometry = new THREE.SphereGeometry(0.1, 16, 16),
                entityMaterial = new THREE.MeshPhongMaterial({transparent: true, color: color}),
                mesh = new THREE.Mesh(entityGeometry, entityMaterial);
            mesh.name = 'NODE-MESH-TN-' + id;
            return mesh;
            break;
    }
}

function initNodeTag(def, visible) {
    var color = createNodeColor(def.id, def.config),
        entityMesh = createNodeMesh(def.id, def.config.nodeType, color),
        withUserData = addUserData(entityMesh, def);
    withUserData.visible = visible;
    scene.add(withUserData);
    addNodeUI(def.id, CFG.NODE_TYPE.TAG, def.config.label, color, true, true);
    nodes[def.id] = entityMesh;
    createLabelSprite(def.id, visible);
    return nodes[def.id];
}

function initNodeAnchor(def, visible) {
    var color = createNodeColor(def.id, def.config),
        entityMesh = createNodeMesh(def.id, def.config.nodeType, color)
        entityMesh.rotation.x = deg2rad(-90);
    var withUserData = addUserData(entityMesh, def);
    withUserData.visible = visible;
    scene.add(withUserData);
    addNodeUI(def.id, CFG.NODE_TYPE.ANCHOR, def.config.label,  color, true, false);
    nodes[def.id] = entityMesh;
    createLabelSprite(def.id, visible);
    return nodes[def.id];
}

function isNewNode(id) {
    return !(id in nodes);
}

// make sure we have enough information about this node to be presentable in UI
function isPresentable(id) {
    if (!isNewNode(id)) {
        // node already there
        return true;
    }
    if (id in surfacingNodes) {
        var surfacingNode = surfacingNodes[id];
        if (mqttDebug && mqttDebug.general) {
            console.log('is presentable?', surfacingNode);
        }
        if ('config' in surfacingNode) {
            if (surfacingNode.config.nodeType == CFG.NODE_TYPE.ANCHOR) {
                return true;
            } else {
                return ('rawPosition' in surfacingNode);
            }
        }
    }
    return false;
}

function isValidPosition(position) {
    return !isNaN(position.x) && !isNaN(position.y) && !isNaN(position.z);
}

function hasValidPosition(nodeDef) {
    if (('rawPosition' in nodeDef) && (nodeDef.rawPosition)) {
        return isValidPosition(nodeDef.rawPosition);
    }
    return false;
}

function addNodeFromSurfacing(id) {
    var nodeDef = surfacingNodes[id],
        visible = true,
        invalidPosition = !hasValidPosition(nodeDef);
    
    if (('status' in nodeDef) && (nodeDef['status'] == DWM.STATUS.OFFLINE)) {
        visible = false;
    }
    switch (nodeDef.config.nodeType) {
        case CFG.NODE_TYPE.ANCHOR:
            initNodeAnchor(nodeDef, visible);
            break;
        case CFG.NODE_TYPE.TAG:
            initNodeTag(nodeDef, visible && !invalidPosition);
            break;
    }
    delete surfacingNodes[id];
    if ('status' in nodeDef) {
        nodeStatusSet(id, nodeDef.status);
    }
    var modePart = nodeDef.config.nodeType.toLowerCase();
    doSearch('', '#' + getNodeDataUIId(id));
    nodeListRefresh('#node-type-' + modePart);
    nodeListSort('#node-type-' + modePart);
}

function initNode(nodeDef) {
    if (isNewNode(nodeDef.id)) {
        if (!(nodeDef.id in surfacingNodes)) {
            surfacingNodes[nodeDef.id] = nodeDef;
        } else {
            $.extend(surfacingNodes[nodeDef.id], nodeDef);
        }
        if (isPresentable(nodeDef.id)) {
            addNodeFromSurfacing(nodeDef.id);
            refreshNodeListsIfDirty();
            return true;
        }
    }
    return false;
}

function removeNodeScene(nodeId) {
    if (isNewNode(nodeId)) {
        // no such node, done here
        return true;
    }
    var node = nodes[nodeId];
    if (containsNotNull(node, 'label')) {
        removeFromScene(node.label);
        node.label = null;
    }
    removeFromScene(node);
}

function removeNode(nodeId) {
    removeNodeScene(nodeId);
    removeNodeUI(nodeId);
    delete nodes[nodeId];
    delete surfacingNodes[nodeId];
}

function setNodeSceneVisibility(nodeId, visibility) {
    if (!(nodeId in nodes)) {
        // no such node, done here
        return true;
    }
    var node = nodes[nodeId],
        // if we wish to display the node, it has to have a valid position - and anchors always have
        validPosition = hasValidPosition(node.userData) || (node.userData.config.nodeType == CFG.NODE_TYPE.ANCHOR);
    if (node.visible == visibility) {
        // already there or filtered by search
        return;
    }
    if (containsNotNull(node, 'label')) {
        // moreso if we are to display the label, it has to be enabled
        node.label.visible = visibility && clientConfig.showLabels && validPosition && !node.filtered;
    }
    node.visible = visibility && validPosition && !node.filtered;
}

function hideNode(nodeId, immediate) {
    var hideDelay = 0;
    if (!(nodeId in nodes)) {
        return;
    }
    if (clientConfig.positionAverage && !immediate) {
        var node = nodes[nodeId];
        if (node.userData.config.nodeType == CFG.NODE_TYPE.TAG) {
            hideDelay = Math.max(5000, 5 * node.userData.config.tag.nomUpdateRate);
        } else {
            hideDelay = 0;
        }
    }
    nodes[nodeId].userData.delayHide = setTimeout(function() {
        setNodeSceneVisibility(nodeId, false);
        hideNodeUI(nodeId);
    }, hideDelay);
}

function showNode(nodeId) {
    if (clientConfig.onlineFilter) {
        if (nodes[nodeId].userData.status == DWM.STATUS.OFFLINE) {
            // refuse to show offline nodes if onlineFilter enabled
            return;
        }
    }
    clearTimeout(nodes[nodeId].userData.delayHide);
    setNodeSceneVisibility(nodeId, true);
    showNodeUI(nodeId);
}

function hideLabel(nodeId) {
    if (nodeId in nodes) {
        if (containsNotNull(nodes[nodeId], 'label')) {
            nodes[nodeId].label.visible = false;
        }
    }
}

function showLabel(nodeId) {
    var show = true;
    if (nodeId in nodes) {
        if (containsNotNull(nodes[nodeId], 'label')) {
            if (clientConfig.onlineFilter) {
                show = (nodes[nodeId].userData.status == DWM.STATUS.ONLINE);
            }
            nodes[nodeId].label.visible = show;
        }
    }
}

function wsPublish(topicName, data, qos) {
    try {
        var message = new Paho.MQTT.Message(JSON.stringify(data));
        message.destinationName = topicName;
        message.qos = qos;
        if (!!mqttDebug && mqttDebug.downlink) {
            console.log('sending to', topicName, data);
        }
        wsClient.send(message);
    } catch (ex) {
        console.log('Error sending message', ex);
    }
}

function setWorldStatus(status, additional)
{
    var $el = $('#status-left').removeClass().addClass('ui-corner-all'),
        $ico = $('#status-left span.ui-icon'),
        $text = $('#status-left span.text'),
        msg;

    worldStatus = status;
    switch(status) {
        case CFG.WORLD.STATUS_LOADING:
            $el.addClass('ui-state-highlight');
            $ico.addClass('ui-icon ui-icon-clock');
            msg = 'Loading/MQTT Connecting...';
            break;
        case CFG.WORLD.STATUS_CONNECTED:
            $el.addClass('ui-state-default');
            $ico.addClass('ui-icon ui-icon-check');
            msg = 'MQTT Connected';
            break;
        case CFG.WORLD.STATUS_DISCONNECTED:
            $el.addClass('ui-state-error');
            $ico.addClass('ui-icon ui-icon-circle-close');
            msg = 'MQTT Disconnected/offline';
            // set all nodes to offline - whole world is offline
            for (var nodeId in nodes) {
                nodeStatusSet(nodeId, DWM.STATUS.OFFLINE);
            }
            // all gateways, too
            for (var gatewayId in gateways) {
                removeGatewayUI(gatewayId);
            }
            break;
        case CFG.WORLD.STATUS_ERROR:
            $el.addClass('ui-state-error');
            $ico.addClass('ui-icon ui-icon-circle-close');
            msg = 'Error loading world';
        case CFG.WORLD.STATUS_RECONNECTING:
            $el.addClass('ui-state-highlight');
            $ico.addClass('ui-icon ui-icon-clock');
            msg = 'MQTT Reconnecting...';
            break;
    }
    if (additional) {
        msg = msg + ': ' + additional;
    }
    $text.text(msg);
}

function handleNodeMessage(topicInfo, payload) {
    var nodeId = parseInt(topicInfo[2], 16), // node id in hex
        direction = topicInfo[3],
        topicName = topicInfo[4];

    if (!!mqttDebug && mqttDebug.node) {
        console.log('received message from node 0x' + topicInfo[2] + ' on topic ' + topicName + ' :', payload);
    }

    if (direction !== 'uplink') {
        // safety net - also not interested in downlink messages and should not be getting those
        console.log('Message direction not uplink, discarding');
        return;
    }
    if (!nodeId) {
        // invalid hex node id - log and discard this message
        console.log('Error parsing node id ' + topicInfo[2] + ' as hex num, discarding');
        return;
    }
    try {
        switch (topicName) {
            case DWM.UPLINK_TOPIC.LOCATION:
                nodePositionSet(nodeId, payload.position.x, payload.position.y, payload.position.z, payload.position.quality);
                break;
            case DWM.UPLINK_TOPIC.CONFIG:
                nodeConfigSet(nodeId, payload.configuration);
                break;
            case DWM.UPLINK_TOPIC.STATUS:
                nodeStatusSet(nodeId, payload.present);
                break;
            case DWM.UPLINK_TOPIC.DATA:
                nodeDataSet(nodeId, payload.data);
                break;
        }
        // all messages can lead to display - apply filter again
        //doSearch('', '#' + getNodeDataUIId(nodeId));
    } catch (ex) {
        console.log('Error processing incoming message', ex);
    }
}

function handleGatewayMessage(topicInfo, payload) {
    var gatewayId = parseInt(topicInfo[2], 16),
        direction = topicInfo[3],
	gatewayHexId = topicInfo[2];
   
    if (mqttDebug && mqttDebug.gws) {
        console.log('GW', topicInfo, gatewayId, payload);
    }
    if (payload === null) {
        removeGatewayUI(gatewayId);

	if(!gatewayHexId.includes("deca"))
	    for (var nodeId in nodes) {
        	nodeStatusSet(nodeId, DWM.STATUS.OFFLINE);
        }
    } else {
        if ('managedNodeIds' in payload) {
/*            for (var id in payload.managedNodeIds) {
                var nodeId = payload.managedNodeIds[id];
                if (!(nodeId in nodes) || !(nodes[nodeId].userData)) {
                    surfacingNodes[nodeId].gwHexId = gatewayHexId;
                } else {
                    nodes[nodeId].userData.gwHexId = gatewayHexId;
                }
            }*/
           // recreateLabelSprites();
        }
        if ('networkId' in payload) {
            var color = createGatewayColor(gatewayHexId);
            addGatewayUI(gatewayId, gatewayHexId, payload, color);
        }
    }
}

function handleUplinkMessage(message) {
    var topicInfo = message.destinationName.split('/'),
        prefix = topicInfo[0],
        context = topicInfo[1];
    if (prefix !== topicPrefix) {
        // safety net, should never happen
        console.log('Got message with unknown prefix ' + prefix + ', discarding');
        return;
    }
    // wrapped-around with exception catching - exception thrown in wsClient callback functions seem to disconnect the client!
    try {
        var payload = null;     // null payload signals empty message - GW went offline and such
        if (message.payloadString.length > 0) {
            payload = $.parseJSON(message.payloadString);
        }
        switch (context) {
            case 'node':
                handleNodeMessage(topicInfo, payload);
                break;
            case 'gateway':
                handleGatewayMessage(topicInfo, payload);
                break;
        }
        refreshNodeListsIfDirty();
    } catch (ex) {
        console.log('Error parsing incoming JSON', ex);
    }
}

function handleConnectionLost(responseObj) {
    console.log('WS connection lost', responseObj);
    setWorldStatus(CFG.WORLD.STATUS_DISCONNECTED, responseObj.errorMessage);
    initReconnection();
}

function initReconnection() {
    if (connectionAttempt >= maxConnectionAttempts) {
        setWorldStatus(CFG.WORLD.STATUS_ERROR, '' + maxConnectionAttempts + ' reconnection attempts and no success, gave up');
        return;
    }
    connectClient(connections.user, connections.pass, true);
}

function setupClient(wsUri) {
    //console.log('WS Connecting to ' + wsUri);
    var clientName = "leapsWebClient" + nc();
    wsClient = new Paho.MQTT.Client("192.168.1.7", Number(15675), clientName);
    wsClient.onConnectionLost = handleConnectionLost;
    wsClient.onMessageArrived = handleUplinkMessage;
}

function connectClient(userName, password, reconnecting) {
    connectionAttempt++;
    if (reconnecting) {
        setWorldStatus(CFG.WORLD.STATUS_RECONNECTING, '#' + connectionAttempt);
    } else {
        setWorldStatus(CFG.WORLD.STATUS_LOADING, '#' + connectionAttempt);
    }
    try {
        wsClient.connect({
            userName: userName,
            password: password,
            onSuccess: function() {
                connectionAttempt = 0;
                console.log('WS client connected, subscribing');
                //subscribe to /leaps/+/uplink/status - to see all node ids presence and to subscribe to each node's essential topic(s)
                wsClient.subscribe(topicPrefix + '/node/+/uplink/+', {
                    onSuccess: function(grantedQos) {
                        console.log('WS client subscribed to all node uplinks');
                        setWorldStatus(CFG.WORLD.STATUS_CONNECTED);
                    },
                    onFailure: function(invocationContext, errorCode, errorMessage) {
                        console.log('Error subscribing to node topics', invocationContext, errorCode, errorMessage);
                    }
                });
                wsClient.subscribe(topicPrefix + '/gateway/+/uplink', {
                    onSuccess: function(grantedQos) {
                        console.log('WS client subscribed to all gateway uplinks');
                    },
                    onFailure: function(invocationContext, errorCode, errorMessage) {
                        console.log('Error subscribing to gateway topics', invocationContext, errorCode, errorMessage);
                    }
                })
            },
            onFailure: function(message) {
                console.log('WS connection failed', message);
                setWorldStatus(CFG.WORLD.STATUS_DISCONNECTED, message.errorMessage);
                initReconnection();
            }
        });
    } catch (ex) {
        console.log('WS client connect() threw exception', ex);
    }
}

function initWorldConnections(def) {
    setupClient(connections.uri);
    connectClient(connections.user, connections.pass);
}

// common functions for node config dialogs
var nodeConfig = 
{
    getFieldName: function(nodeId, name, prefix) {
        if (prefix) {
            name = prefix + name.charAt(0).toUpperCase() + name.substring(1);
        }
        return 'node-' + nodeId + '-' + name;
    },
    cfgRoutingTypeOptions: function() {
        var routingTypes = [];
        routingTypes[CFG.ANCHOR_ROUTING_CONFIG.OFF] = 'Off';
        routingTypes[CFG.ANCHOR_ROUTING_CONFIG.ON] = 'On';
        routingTypes[CFG.ANCHOR_ROUTING_CONFIG.AUTO] = 'Auto';
	return routingTypes;
    },
    cfgNodeTypeOptions: function() {
        var nodeTypes = [];
        nodeTypes[CFG.NODE_TYPE.TAG] = 'Tag';
        nodeTypes[CFG.NODE_TYPE.ANCHOR] = 'Anchor';
        return nodeTypes;
    },
    cfgUpdateRateOptions: function()
    {
        var updateRates = [];
        for (name in CFG.UPDATE_RATES) {
            updateRates[CFG.UPDATE_RATES[name]] = name;
        }
        return updateRates;
    },
    changeNodeMode: function(dialog, nodeId, nodeType) {
        // what to disable - anchor- or tag- specific fields
        var disableModeText = (nodeType != CFG.NODE_TYPE.ANCHOR) ? 'anchor' : 'tag',
            enableModeText = (nodeType == CFG.NODE_TYPE.ANCHOR) ? 'anchor' : 'tag',
            removeTypeClass = 'leaps-form-' + disableModeText,
            addTypeClass = 'leaps-form-' + enableModeText,
            // concat class names - see class="leaps-<type>-only" in var markup=... above
            disableModeClass = 'leaps-' + disableModeText + '-only',
            enableModeClass = 'leaps-' + enableModeText + '-only';
        // delete removeTypeClass, add addTypeClass for dialog (effectively and visually does nothing IIRC) - nodetype-specific fields (table rows - tr's) are not being removed and added-just being hidden and displayed
        $(dialog).removeClass(removeTypeClass).addClass(addTypeClass);
        // disabling part - find .<disableModeClass> elements in dialog subtree, hide them, then find input,select elements within those and make them disabled
        $(dialog + ' .' + disableModeClass).hide();
        $(dialog + ' .' + disableModeClass + ':not(.disabled) input,select').prop('disabled', true);
        // enabling part - opposite of disable above - display (=show()) and enable form elements having parent (<tr>) with .<enableModeClass>
        $(dialog + ' .' + enableModeClass).show();
        $(dialog + ' .' + enableModeClass + ':not(.disabled) input,select').prop('disabled', false);
        // if target is tag type, set update rates to defaults
        if (nodeType == CFG.NODE_TYPE.TAG) {
            $('#' + nodeConfig.getFieldName(nodeId, 'nomUpdateRate')).val(0);
            $('#' + nodeConfig.getFieldName(nodeId, 'statUpdateRate')).val(0);
        }
    }
};

var dialogForm =
{
    getElement: function(name) {
        return $('div.ui-dialog-content *[name=' + name + ']');
    },
    getFieldValue: function(name) {
        var $element = dialogForm.getElement(name);
        if ($element.is('input[type=checkbox]')) {
            return $element.prop('checked');
        }
        return $element.val();
    },
    fillFieldValue: function(name, value) {
        var $element = dialogForm.getElement(name);
        if ($element.is('input[type=checkbox]')) {
            return $element.prop('checked', value);
        }
        return $element.val(value);
    },
    addExtra: function(html, extra) {
        if (extra) {
            html = html + extra + ' ';
        }
        return html;
    },
    textField: function(name, label, trExtra, fieldExtra) {
        var html = dialogForm.addExtra('<tr ', trExtra) + '><td><label for="' + name + '">' + label + '</label></td><td><input name="' + name + '" id="' + name + '" type="text" ';
        return dialogForm.addExtra(html, fieldExtra) + '/></td></tr>';
    },
    selectField: function(name, label, options, trExtra, fieldExtra) {
        var html = dialogForm.addExtra('<tr ', trExtra) + '><td><label for="' + name + '">' + label + '</label></td><td><select name="' + name + '" id="' + name + '" ';
        html = dialogForm.addExtra(html, fieldExtra) + '>';
        for (i in options) {
            html = html + '<option value="' + i + '">' + options[i] + '</option>';
        }
        return html;
    },
    checkField: function(name, label, trExtra, fieldExtra) {
        var html = dialogForm.addExtra('<tr ', trExtra) + '><td><label for="' + name + '">' + label + '</label></td><td><input type="checkbox" name="' + name + '" id="' + name + '" ';
        html = dialogForm.addExtra(html, fieldExtra) + '></td></tr>';
        return html;
    },
    labelRow: function(label, tdExtra) {
        var html = '<tr><td>' + label + ' ';
        return dialogForm.addExtra(html, tdExtra) + '</td></tr>';
    },
    textareaRow: function(name, label, trExtra, fieldExtra) {
        var html = dialogForm.addExtra('<tr ', trExtra) + '><td><textarea name="' + name + '" id="' + name + '" ';
        html = dialogForm.addExtra(html, fieldExtra) + '></textarea></td></tr>';
        return html;
    },
    buttonRow: function(name, label, trExtra, fieldExtra, cellContent) {
        var html = dialogForm.addExtra('<tr ', trExtra) + '><td>';
        if (cellContent) {
            html = html + cellContent;
        }
        html = html + '<button type="button" name="' + name + '" id="' + name + '" ';
        html = dialogForm.addExtra(html, fieldExtra) + '>' + label + '</button></td></tr>';
        return html;
    }
};

function openConfigDialog(nodeId)
{
    if (configDialogOpen) {
        // prevent opening multiple dialogs as the builtin overlay click-catcher does not work reliably over the scene
        return;
    }
    configDialogOpen = true;
    var node = nodes[nodeId],
        nodeData = node.userData,
        fillFieldValues = function(coll) {
            $.each(coll, function(k, v){
                if ($.isPlainObject(v)) {
                    // handle substruct (anchor, tag-specific config)
                    $.each(v, function(sk, sv){
                        //k: tag, sk: nomUpdateRate, sv: 100
                        dialogForm.fillFieldValue(nodeConfig.getFieldName(nodeId, sk, k), sv);
                    });
                } else {
                    dialogForm.fillFieldValue(nodeConfig.getFieldName(nodeId, k), v);
                }
            });
        },
        positionFields = function(name, label, trExtra, fieldExtra) {
            var html = dialogForm.addExtra('<tr ', trExtra) + '><td>' + label +'</td><td>' +
                        dialogForm.addExtra('<input type="text" ', fieldExtra) + 'class="node-pos" name="' + name + '-pos-x" id="' + name + '-pos-x" />' +
                        dialogForm.addExtra('<input type="text" ', fieldExtra) + 'class="node-pos" name="' + name + '-pos-y" id="' + name + '-pos-y" />' +
                        dialogForm.addExtra('<input type="text" ', fieldExtra) + 'class="node-pos" name="' + name + '-pos-z" id="' + name + '-pos-z" />' +
                '</td></tr>';
            return html;
        },
        markup = 
            '<div id="node-cfg-dialog">' +
            '<div id="node-cfg-tabs">' +
            '<ul>' +
            '<li><a href="#node-cfg-form">Configuration</a></li>' +
            '<li class="hide-button-pane"><a href="#node-messages">Messages</a></li>' +
            '</ul>' +
            '<div id="node-cfg-form"><form><table>' +
            dialogForm.textField(nodeConfig.getFieldName(nodeId, 'label'), 'Name (up to 16 bytes)', '', 'maxlength="16"') +
            dialogForm.textField(nodeConfig.getFieldName(nodeId, 'id'), 'Node ID', '', 'readonly="readonly" disabled="disabled"') +
            dialogForm.checkField(nodeConfig.getFieldName(nodeId, 'uwbFirmwareUpdate'), 'UWB Firmware Update') +
            dialogForm.checkField(nodeConfig.getFieldName(nodeId, 'leds'), 'LEDs') +
            dialogForm.checkField(nodeConfig.getFieldName(nodeId, 'ble'), 'BLE') +
            dialogForm.selectField(nodeConfig.getFieldName(nodeId, 'nodeType'), 'Node Type', nodeConfig.cfgNodeTypeOptions(), '', 'class="js-mode-change"') +
            '<tr><td colspan="2"><div class="ui-dialog-buttonpane ui-widget-content ui-hr"></div></td></tr>' +
            // anchor-only fields
            dialogForm.checkField(nodeConfig.getFieldName(nodeId, 'anchorInitiator'), 'Initiator', 'class="leaps-anchor-only"') +
            // dialogForm.selectField(nodeConfig.getFieldName(nodeId, 'anchorRoutingConfig'), 'Routing',nodeConfig.cfgRoutingTypeOptions(), 'class="leaps-anchor-only"') +
            dialogForm.selectField(nodeConfig.getFieldName(nodeId, 'anchorRoutingConfig'), 'Routing',nodeConfig.cfgRoutingTypeOptions(), 'style="display: none"') +
	    positionFields(nodeConfig.getFieldName(nodeId, 'anchorPosition'), 'Position [m]', 'class="leaps-anchor-only"') +
            // tag-only fields
            dialogForm.checkField(nodeConfig.getFieldName(nodeId, 'tagLocationEngine'), 'Location Engine', 'class="leaps-tag-only"') +
            dialogForm.checkField(nodeConfig.getFieldName(nodeId, 'tagResponsive'), 'Responsive Mode', 'class="leaps-tag-only"') +
            dialogForm.checkField(nodeConfig.getFieldName(nodeId, 'tagStationaryDetection'), 'Stationary Detection', 'class="leaps-tag-only"') +
            dialogForm.selectField(nodeConfig.getFieldName(nodeId, 'tagNomUpdateRate'), 'Nominal Update Rate', nodeConfig.cfgUpdateRateOptions(), 'class="leaps-tag-only"') +
            dialogForm.selectField(nodeConfig.getFieldName(nodeId, 'tagStatUpdateRate'), 'Stationary Update Rate', nodeConfig.cfgUpdateRateOptions(), 'class="leaps-tag-only"') +
            positionFields(nodeConfig.getFieldName(nodeId, 'tagPosition'), 'Position [m]', 'class="leaps-tag-only disabled"', 'readonly="readonly" disabled="disabled"') +
            '</table></form></div>' +
            '<div id="node-messages"><form><table>' +
            dialogForm.labelRow('Received from node [hex]', '<span id="' + nodeConfig.getFieldName(nodeId, 'received') + '" class="ui-received-time"></span>') +
            dialogForm.textareaRow(nodeConfig.getFieldName(nodeId, 'nodeUplink'), 'Received', null, 'readonly="readonly"') +
            dialogForm.labelRow('Send to node [max. 34B in hex] (e.g. 0123456789abcdef)') +
            dialogForm.textareaRow(nodeConfig.getFieldName(nodeId, 'nodeDownlink'), 'Send') +
            dialogForm.buttonRow(nodeConfig.getFieldName(nodeId, 'send'), 'Send', 'class="ui-send-button"', '', '<span class="ui-data-overwrite"><input type="checkbox" id="' + nodeConfig.getFieldName(nodeId, 'dataOverwrite') + '" name="' + nodeConfig.getFieldName(nodeId, 'dataOverwrite') + '" /> Overwrite last data</span><span class="ui-data-length">0 / 34B</span>') +
            '</table></form></div>' +
            '</div>' +
            '</div>';
    
    getFieldFromNameAttr = function(nameAttr) {
        var re = /node-([0-9]+)-(.*)/,
            np = re.exec(nameAttr);
        return np[2];
    };
    
    getFieldValues = function(dialog) {
        var rawValues = $('form', dialog).serializeArray(),
            fieldName,
            values = {};
        for (var rk in rawValues) {
            fieldName = getFieldFromNameAttr(rawValues[rk].name);
            values[fieldName] = rawValues[rk].value;
        }
        // checkboxes are not serialized (not present in the keys) if they're not checked, adjust
        // missing: false, anything: true
        $('form input[type=checkbox]', dialog).each(function(){
            var fieldName = getFieldFromNameAttr($(this).attr('name'));
            if (!(fieldName in values)) {
                values[fieldName] = false;
            } else {
                values[fieldName] = true;
            }
        });
        // remove helper values
        delete values['id'];
        delete values['nodeUplink'];
        delete values['nodeDownlink'];
        delete values['dataOverwrite'];
        // make couple of value type adjustments - in tag substruct
        var intKeys = {tagNomUpdateRate: 0, tagStatUpdateRate: 0};
        for (var i in intKeys) {
            values[i] = parseInt(values[i]);
        }
        // convert tag and anchor-specifix prefix fields into substruct
        var convertPrefixes = {tag: 0, anchor: 0},
            strippedFieldName;
        for (var k in convertPrefixes) {
            for (var j in values) {
                // is tagSpecificField and not a substruct
                if (!$.isPlainObject(values[j]) && j.indexOf(k) === 0) {
                    // tagSpecificField -> SpecificField
                    strippedFieldName = j.replace(new RegExp('^' + k), '');
                    // SpecificField -> specificField
                    strippedFieldName = strippedFieldName.charAt(0).toLowerCase() + strippedFieldName.substring(1);
                    // values['tag']['specificField'] = values['tagSpecificField']
                    if (!(k in values)) {
                        values[k] = {};
                    }
                    values[k][strippedFieldName] = values[j];
                    // remove values['tagSpecificField']
                    delete values[j];
                }
            }
        }
        // add position for anchor nodes, delete irrelevant substruct
        if (values.nodeType == CFG.NODE_TYPE.ANCHOR) {
            values['anchor']['position'] = {
                x: parseFloat(values['anchor']['position-pos-x']),
                y: parseFloat(values['anchor']['position-pos-y']),
                z: parseFloat(values['anchor']['position-pos-z']),
                quality: 100,
            }
            for(var l in {x: 0, y:0, z: 0}) {
                // delete position if invalid
                if (isNaN(values['anchor']['position'][l])) {
                    delete values['anchor']['position'];
                    break;
                }
            }
            delete values['anchor']['position-pos-x'];
            delete values['anchor']['position-pos-y'];
            delete values['anchor']['position-pos-z'];
            delete values['tag'];
        } else {
            delete values['anchor'];
        }
        
        return values;
    }

    var nodeRowId = 'node-' + nodeId + '-data';

    $('#' + nodeRowId + ' h4').addClass('ui-state-active');
    var dialogInstance = $(markup).dialog({
        title: 'Node properties',
        modal: true,
        draggable: true,
        width: '500px',
        buttons: [
            {
                text: 'Save',
                click: function(e) {
	   	    if(worldStatus != CFG.WORLD.STATUS_CONNECTED) {
                        window.alert("MQTT broker is offline, save node configuration is not possible.");
                        $(this).dialog('close');
                        return;
		    }
                    var config = getFieldValues($(this));
                    wsPublish(getTopicName(nodeId, 'downlink', DWM.DOWNLINK_TOPIC.CONFIG), {configuration: config}, 1);
                    nodeConfigSet(nodeId, config);
                    e.stopImmediatePropagation();
                    $(this).dialog('close');
                },
                icon: 'ui-icon-disk'
            },
            {
                text: 'Cancel',
                click: function(e) {
                    e.stopImmediatePropagation();
                    $(this).dialog('close');
                },
                icon: 'ui-icon-close'
            }
        ],
        open: function(event, ui) {
            $('#node-cfg-tabs').tabs({
                activate: function(event, ui) {
                    if (ui.newTab.hasClass('hide-button-pane')) {
                        dialogInstance.uiDialogButtonPane.hide();
                    } else {
                        dialogInstance.uiDialogButtonPane.show();
                    }
                }
            });
            $('#' + nodeConfig.getFieldName(nodeId, 'nodeDownlink')).on('change keyup focus blur', function(e){
                var val = $(this).val(),
                    replaced = val.replace(/[^0-9a-f]*/gi, '');
                if (replaced.length > 68) {
                    replaced = replaced.substring(0, 68);
                }
                $(this).val(replaced);
                $('#node-messages .ui-data-length').text(Math.floor(replaced.length / 2) + ' / 34B');
            });
            $('#' + nodeConfig.getFieldName(nodeId, 'send')).button({
                'icon': 'ui-icon-circle-arrow-s'
            }).on('click', function(e){
                var data = $('#' + nodeConfig.getFieldName(nodeId, 'nodeDownlink')).val() || '',
                    overwrite = $('#' + nodeConfig.getFieldName(nodeId, 'dataOverwrite')).is(':checked');
                if (!data) {
                    alert('No data to send');
                    return;
                }
                if (!data.match(/^[0-9a-f]*$/i)) {
                    alert('Data not in hexstring format');
                    return;
                }
                // convert data to base64
                var dataBase64 = hexToBase64(data),
                    message = {data: dataBase64, overwrite: overwrite};
                wsPublish(getTopicName(nodeId, 'downlink', DWM.DOWNLINK_TOPIC.DATA), message, 0);
                console.log('user data sent to node ' + nodeId, message);
                e.stopImmediatePropagation();
            });
            $('#' + nodeConfig.getFieldName(nodeId, 'label')).on('change keyup', function(e){
                if (byteLen($(this).val()) > 16) {
                    $(this).val(trimUntilMaxByteLen($(this).val(), 16));
                }
            });
            var fieldValues = {};
            for (k in nodeData.config) {
                fieldValues[k] = nodeData.config[k];
            }
            fieldValues['id'] = '0x' + nodeData.nodeId.toString(16).toUpperCase();
            // add position values
            if ((nodeData.config.nodeType == CFG.NODE_TYPE.ANCHOR) && ('rawPosition' in node.userData)){
                fieldValues['anchorPosition-pos-x'] = node.userData.rawPosition.x;
                fieldValues['anchorPosition-pos-y'] = node.userData.rawPosition.y;
                fieldValues['anchorPosition-pos-z'] = node.userData.rawPosition.z;
            }
            fillFieldValues(fieldValues);
            $('#node-cfg-dialog .js-mode-change').bind('change', function(e){
                nodeConfig.changeNodeMode('#node-cfg-dialog', nodeId, $(e.target).val());
            });
            nodeConfig.changeNodeMode('#node-cfg-dialog', nodeId, nodeData.config.nodeType);
            nodeDataUISet(nodeId);
        },
        close: function(event, ui) {
            $('#node-cfg-tabs').tabs("destroy");
            $('#' + nodeRowId + ' h4').removeClass('ui-state-active');
            $('#node-cfg-dialog').remove();
            configDialogOpen = false;
        }
    }).dialog("instance");
    if (nodeData.status == DWM.STATUS.OFFLINE) {
        $('<span>Node is offline</span>').appendTo(dialogInstance.uiDialogButtonPane);
    }
}

function removeFloorMesh()
{
    var floorMesh = scene.getObjectByName(CFG.FLOOR_MESH_NAME);
    if (floorMesh) {
        removeFromScene(floorMesh);
    }
}

function createFloorMesh(texture, dimensions) {
    var floorGeometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, 0.0001),
        floorMaterialFlat = new THREE.MeshBasicMaterial({color: 0xffffff}),
        floorMaterialPlan = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture}),
        floorMaterial = new THREE.MeshFaceMaterial([floorMaterialFlat, floorMaterialFlat, floorMaterialFlat, floorMaterialFlat, floorMaterialPlan, floorMaterialFlat]);
    return new THREE.Mesh(floorGeometry, floorMaterial);
}

function replaceFloorMesh(imageUrl, dimensions, callback)
{
    var texLoader = new THREE.TextureLoader();
    texLoader.load(imageUrl, function(texture) {
        // make sure we're not resizing the image to the nearest power of two as it screws the image up: https://github.com/mrdoob/three.js/issues/13126
        texture.generateMipmaps = false;
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        // bake the new floor mesh
        var floorMesh = createFloorMesh(texture, dimensions);
        // remove old mesh if there is one
        removeFloorMesh();
        // add the new flor mesh
        floorMesh.name = CFG.FLOOR_MESH_NAME;
        scene.add(floorMesh);
        world.floor = {
            url: imageUrl,
            mesh: floorMesh
        };
        world.dimensions = dimensions;
    }, 
    function(){},   // onProgress deemed unsupported in doc
    function(err){
    });
}

function doSearch(value, selector) {
    var val = value || $('#node-search input').val(), // we can call this function without parameter set to refresh search
        nodeDataSelector = selector || '#ui-nodes .node-ui',
        nodeSearchSelectors = ['.node-name', '.node-id'],
        dirty = false;
    if (val.trim()) {
        var re = new RegExp(val.trim(), 'i');
        $(nodeDataSelector).each(function(){
            var nodeId = $(this).data('nodeId'),
                gatewayId = $(this).data('gatewayId'),
                texts = [];
            for (var s in nodeSearchSelectors) {
                $(nodeSearchSelectors[s], this).each(function(){
                    texts.push($(this).text());
                });
            }
            var allText = texts.join(' ');
            if (allText.search(re) > -1) {
                dirty = true;
                if (nodeId) {
                    nodes[nodeId].filtered = false;
                    showNode(nodeId);
                } else {
                    showGatewayUI(gatewayId);
                }
            } else {
                dirty = true;
                if (nodeId) {
                    hideNode(nodeId, true);
                    nodes[nodeId].filtered = true;
                } else {
                    hideGatewayUI(gatewayId);
                }
            }
        });
    } else {
        $(nodeDataSelector).each(function(){
            var nodeId = $(this).data('nodeId'),
                gatewayId = $(this).data('gatewayId');
            if (nodeId) {
                nodes[nodeId].filtered = false;
                showNode(nodeId);
            } else {
                showGatewayUI(gatewayId);
            }
        });
    }
    if (dirty) {
        nodeListRefresh('#ui-nodes .node-type');
        nodeListSort('#ui-nodes .node-type');
        refreshNodeListsIfDirty();
    }
}

function initWorld(def, mapUrl)
{
    worldZero.set(def.zeroX, def.zeroY, 0);
    initNodeTypeUI('gateway', 'Gateways', 'GW');
    initNodeTypeUI('anchor', 'Anchors', CFG.NODE_TYPE.ANCHOR);
    initNodeTypeUI('tag', 'Tags', CFG.NODE_TYPE.TAG);
    
    replaceFloorMesh(mapUrl + '?' + nc(), new THREE.Vector2(def.dimX, def.dimY));

    $('#ui-nodes .node-type').sortedAccordion({
        collapsible: true,
        active: 1
    });
    $('#node-search').addClass('ui-state-default ui-corner-all ui-node-search')
        .find('input')
        .on('keyup', function(e){
            doSearch();
        });
    $('#ui-nodes').on('click', function(e){
        var $target = $(e.target);
        if ($target.is('.js-node-config') || $target.parents('.js-node-config').length) {
            $target.blur();
            var nodeId = $(e.target).parents('div.node-ui').data('node-id');
            openConfigDialog(nodeId);
            e.preventDefault();
        }
    });
    
    initWorldConnections(def);
}

function loadWorld(connectionsUrl, defUrl, mapUrl) {
    $.ajax({
        url: connectionsUrl + '?' + nc(),
        dataType: 'json',
        success: function(connectionsDef) {
            connections = $.extend(connections, connectionsDef);
            $.ajax({
                url: defUrl + '?' + nc(),
                dataType: 'json',
                success: function(def) {
                    initWorld(def, mapUrl);
                },
                error: function() {
                    setWorldStatus(CFG.WORLD.STATUS_ERROR);
                }
            });
        },
        error: function() {
            setWorldStatus(CFG.WORLD.STATUS_ERROR);
        }
    });
}

$(function(){
    $('#decawave').on('click', function(e){
        window.open($(this).attr('href'), '_blank');
        e.preventDefault();
    });
    $('#button-reset-view')
        .button({
            icon: 'ui-icon-arrowrefresh-1-s'
        })
        .on('click', function(){
            resetView();
        });
    $('#button-ortho')
        .button({
            icon: 'ui-icon-image'
        })
        .on('click', function(){
            if (!clientConfig.orthoDisplay) {
                orthoDisplay();
                $(this).addClass('ui-state-active');
            } else {
                threeDisplay();
                $(this).removeClass('ui-state-active');
            }
        }).addClass(clientConfig.orthoDisplay ? 'ui-state-active': '');
    $('#button-save-image')
        .button({
            icon: 'ui-icon-disk'
        })
        .on('click', function(){
            var dateTimeStr = moment().format('YYYYMMDD-hhmmss');
            $(this).attr({
                href: renderer.domElement.toDataURL().replace(/data:image\/png/, 'data:application/octet-stream'),
                download: 'DRTLS-Web-Manager-screenshot-'+ dateTimeStr + '.png'
            });
        });
    $('#button-help')
        .button({
            icon: 'ui-icon-help'
        })
        .on('click', function(e){
            window.open($(this).attr('href'), '_blank');
            e.preventDefault();
        });
    $('#button-ma')
        .button({
            icon: 'ui-icon-shuffle'
        }).on('click', function(){
            if (!clientConfig.positionAverage) {
                $(this).addClass('ui-state-active');
                updateClientConfig({positionAverage: true});
            } else {
                updateClientConfig({positionAverage: false});
                $(this).removeClass('ui-state-active');
            }
        }).addClass(clientConfig.positionAverage ? 'ui-state-active' : '');
    $('#button-online-filter')
        .button({
            icon: 'ui-icon-comment'
        }).on('click', function(){
            if (!clientConfig.onlineFilter) {
                updateClientConfig({onlineFilter: true});
                $(this).addClass('ui-state-active');
                for (var id in nodes) {
                    if (nodes[id].userData.status == DWM.STATUS.OFFLINE) {
                        hideNode(id, true);
                    }
                }
            } else {
                updateClientConfig({onlineFilter: false});
                $(this).removeClass('ui-state-active');
                for (var id in nodes) {
                    showNode(id);
                }
                doSearch();
            }
        }).addClass(clientConfig.onlineFilter ? 'ui-state-active' : '');
    $('#button-show-labels')
        .button({
            icon: 'ui-icon-info'
        }).on('click', function(){
            if (!clientConfig.showLabels) {
                updateClientConfig({showLabels: true});
                $(this).addClass('ui-state-active');
                for (var id in nodes) {
                    showLabel(id);
                }
            } else {
                updateClientConfig({showLabels: false});
                $(this).removeClass('ui-state-active');
                for (var id in nodes) {
                    hideLabel(id);
                }
            }
        }).addClass(clientConfig.showLabels ? 'ui-state-active' : '');
    $('#button-world-properties')
        .button({
            icon: 'ui-icon-gear'
        }).on('click', function(){
            var coordFields = function(name, label, trExtra, fieldExtra) {
                var html = dialogForm.addExtra('<tr ', trExtra) + '><td>' + label + '</td><td>' +
                    dialogForm.addExtra('<input type="text" ', fieldExtra) + 'class="node-pos" name="' + name + '-coord-x" id="' + name + '-coord-x" />' +
                    dialogForm.addExtra('<input type="text" ', fieldExtra) + 'class="node-pos" name="' + name + '-coord-y" id="' + name + '-coord-y" />' +
                '</td></tr>';
                return html;
            },
            fileField = function(name, label) {
                return '<tr><td>' + label + '</td><td><input type="file" name="' + name +'" id="' + name +'" /></td></tr>';
            }
            markup = 
                '<div id="world-dialog">' +
                '<div id="world-form"><form><input type="hidden" name="floorUrl" class="floorUrl" /><table>' +
                fileField('floorPlanFile', 'Upload image') +
                coordFields('dimensions', 'Aspect ratio x,y (m)') +
                coordFields('zero', 'Origin x,y (m)') +
                '</table></form></div>' +
                '</div>',
            dialogInstance = $(markup).dialog({
                title: 'Floorplan setting',
                modal: true,
                draggable: true,
                width: '500px',
                buttons: [
                    {
                        text: 'Save',
                        click: function() {
                            var dimX = parseFloat(dialogForm.getFieldValue('dimensions-coord-x')),
                                dimY = parseFloat(dialogForm.getFieldValue('dimensions-coord-y')),
                                zeroX = parseFloat(dialogForm.getFieldValue('zero-coord-x')),
                                zeroY = parseFloat(dialogForm.getFieldValue('zero-coord-y'));
                            // upload the file
                            var formData = new FormData();
                            formData.append('floorplan', $('#floorPlanFile').get(0).files[0]);
                            formData.append('dimX', dimX);
                            formData.append('dimY', dimY);
                            formData.append('zeroX', zeroX);
                            formData.append('zeroY', zeroY);

                            var request = new XMLHttpRequest(),
                                $dialog = $(this);
                            request.open('POST', DWM.UPLOAD_URL);
                            request.send(formData);
                            request.onreadystatechange = function() {
                                // 4 = complete
                                if (request.readyState == 4) {
                                    if (request.status == 200) {
                                        // all OK, reload/redraw
                                        worldZero.set(zeroX, zeroY, 0);
                                        replaceFloorMesh('img/plans/floorplan.png', new THREE.Vector2(dimX, dimY));
                                        redrawAllNodesPosition();
                                    }
                                    // close either way
                                    $dialog.dialog('close');
                                }
                            }
                        },
                        icon: 'ui-icon-disk'
                    },
                    {
                        text: 'Cancel',
                        click: function() {
                            $(this).dialog('close');
                        },
                        icon: 'ui-icon-close'
                    }
                ],
                open: function(event, ui) {
                    $('#button-world-properties').addClass('ui-state-active');
                    dialogForm.fillFieldValue('dimensions-coord-x', world.dimensions.x);
                    dialogForm.fillFieldValue('dimensions-coord-y', world.dimensions.y);
                    dialogForm.fillFieldValue('zero-coord-x', worldZero.x);
                    dialogForm.fillFieldValue('zero-coord-y', worldZero.y);
                },
                close: function(event, ui) {
                    $('#button-world-properties').removeClass('ui-state-active');
                    $('#world-dialog').remove();
                }
            });
        });
        $('#button-hamburger span').addClass('ui-corner-all ui-state-active ui-helper-clearfix');
        function openHamburger() {
            $('#hamburger-contents').show();
            $(this).addClass('ui-state-active');
            $('span', this).removeClass('ui-state-active').addClass('ui-state-default');
        }
        function closeHamburger() {
            $('#hamburger-contents').hide();
            $(this).removeClass('ui-state-active');
            $('span', this).removeClass('ui-state-default').addClass('ui-state-active');
        }
        $('#button-hamburger').button()
            .on('click', function() {
                var $contents = $('#hamburger-contents');
                if (!$contents.is(':visible')) {
                    openHamburger();
                } else {
                    closeHamburger();
                }
            });
    $(window).on('click', function(e) {
        if (!$(e.target).is('#button-hamburger')) {
            if ($('#hamburger-contents').is(':visible') && !$(e.target).parents('#button-hamburger').length) {
                e.stopImmediatePropagation();
                closeHamburger();
            }
        }
    });
    window.addEventListener('click', mouseClick, false);
    loadWorld('img/plans/connections.json','img/plans/world.json', 'img/plans/floorplan.png');
});
