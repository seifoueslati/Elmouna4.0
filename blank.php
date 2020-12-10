<!--
/**
 * LEAPS - Low Energy Accurate Positioning System.
 *
 * Main UI HTML file.
 *
 * Copyright (c) 2016-2018, LEAPS. All rights reserved.
 *
 */
-->
<!DOCTYPE html>
<html>
    <head>
	<?php include('include/head.php'); ?>
        <meta charset="UTF-8">
        <title>DRTLS Web Manager</title>
        <link rel="stylesheet" href="3rdps/css/jquery-ui.min.css">
        <link rel="stylesheet" href="css/drtls-manager.css?2018-07-08">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <title>Demo - JavaScript A* Search Algorithm</title>
		<link rel="stylesheet" type="text/css" media="screen, projection" href="demo/demo.css" />
      
    </head>
    <body >
	
	<?php include('include/sidebar.php'); ?>
        <div id="scene">
             <div id="buttons">
                <div id="hamburger">
                    <button id="button-hamburger"><span></span><span></span><span></span></button>
                    <div id="hamburger-contents">
                        <button id="button-world-properties" title="Change floorplan settings">Floorplan</button>
                        <button id="button-online-filter" title="Toggle display of offline nodes">Hide offline</button>
                        <button id="button-show-labels" title="Toggle display of node labels">Show labels</button>
                        <button id="button-ma" title="Smooth tag positions by averaging">Position average</button>
                        <a id="button-save-image" title="Save screen">Snapshot</a>
                       
                    </div>
                </div>
            
                <button id="button-reset-view" title="Go back to initial view">Reset view</button>
            </div>
        </div>
        <div id="ui-right">
            <div id="node-search" title="Start typing name or id to filter nodes"><input type="text" class="js-node-search" placeholder="Start typing name or id to filter nodes" /></div>
            <div id="ui-nodes"></div>
        </div>
        <script>

           // startConnect();
                    </script>

        <div id="status-left" class="ui-corner-all"><span class="ui-icon"></span><span class="text">Loading</span></div>
        <script src="3rdps/js/jquery-3.1.1.min.js"></script>
        <script src="3rdps/js/jquery-ui.min.js"></script>
        <script src="3rdps/js/three.js"></script>
        <script src="3rdps/js/controls/TrackballControls.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.min.js" type="text/javascript"></script>
        <script src="3rdps/js/moment.min.js"></script>
        <script src="js/jqueryui-sorted-accordion.js"></script>
        <script src="js/drtls-manager2.js"></script>
    </body>
</html>
