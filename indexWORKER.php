<!DOCTYPE html>
<html>
<head>
	<?php include('include/head.php'); ?>
	<meta charset="utf-8">
	<link rel="stylesheet" href="3rdps/css/jquery-ui.min.css">
    <link rel="stylesheet" href="css/drtls-manager.css?2018-07-08">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script>
$(document).ready(function(){
   $('#content').load("demo/index.html");

});
</script>

</head>
<body >
	<?php

require("connect.php");
if(!isset($_SESSION)) 
{ 
	session_start(); 
} 
if(isset($_GET['id'])) {
	$sql = "UPDATE tasks SET doneby='".$_SESSION['username']."' , state=2 WHERE  id='".$_GET['id']."'";
	$result = $conn->query($sql);
	

}
	 
	  ?>




  















<style>
.buttonw {
 align:left;
  border: none;
  color: white;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 2px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
}

.buttonw1 {
  background-color: white; 
  color: black; 
  border: 2px solid blue;
}

.buttonw1:hover {
  background-color: blue;
  color: white;
}


</style>


	<?php include('include/header.php'); ?>
	<?php include('include/sidebar.php'); ?>
	<div class="main-container">
		<div class="pd-ltr-20 customscroll customscroll-10-p height-100-p xs-pd-20-10">
			
			<div class="bg-white pd-20 box-shadow border-radius-5 mb-30">
				<h4 class="mb-30">Live View</h4>
				<div class="row">
					<div id="content" class="col-sm-12 col-md-8 col-lg-9 xs-mb-20">
					
					</div>
					<div class="col-sm-12 col-md-4 col-lg-3" >
						<h5 class="mb-30 weight-500" >   TODAY'S WORK</h5>
<script>

document.getElementById("content").onload = function(){click1("cell_98_91");};

</script>
						<script type="text/javascript">
function click1(){
//var str1="c";

var x = document.getElementById(arguments[1]);

  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  var x = document.getElementById(arguments[1].concat("done"));

if (x.style.display === "none") {
  x.style.display = "block";
} else {
  x.style.display = "none";
}
	document.getElementById(arguments[0]).click();



}
		


</script>				
						<?php


$sql = "select * from tasks where state='0' Limit 5";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
  
	 //echo "id: ";
	?>

						<div class="mb-30">
							<p class="mb-5 font-18"><?php echo $row["productname"] ;?>&nbsp;&nbsp;&nbsp;&nbsp;<button class="buttonw buttonw1" id=<?php echo $row["id"] ;?> onclick=click1('<?php echo $row["nl"] ;?>','<?php echo $row["id"] ;?>')>DO</button><a style="display:none" class="buttonw buttonw1" id="<?php echo $row["id"]."done" ;?>" href='indexworker.php?id=<?php echo $row["id"];?>'" >DONE</a></p>
						
							<div class="progress border-radius-0" style="height: 10px;">
								<div class="progress-bar bg-blue" role="progressbar" style="width: <?php echo $row["qte"]/30*100 ;?>%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="30"></div>
							</div>
						</div>


						<?php
  }
} else {
  echo "0 results";
}
$conn->close();

				?>
						
						
						

			
						</div>
				</div>
			</div>
			<div class="row clearfix">
				<div class="col-xl-4 col-lg-12 col-md-12 col-sm-12 mb-30">
					<div class="bg-white pd-20 box-shadow border-radius-5 height-100-p">
						<h4 class="mb-30">Devices Managed</h4>
						<div class="device-manage-progress-chart">
							<ul>
								<li class="clearfix">
									<div class="device-name">Window</div>
									<div class="device-progress">
										<div class="progress">
											<div class="progress-bar window border-radius-8" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">
											</div>
										</div>
									</div>
									<div class="device-total">60</div>
								</li>
								<li class="clearfix">
									<div class="device-name">Mac</div>
									<div class="device-progress">
										<div class="progress">
											<div class="progress-bar mac border-radius-8" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 20%;">
											</div>
										</div>
									</div>
									<div class="device-total">20</div>
								</li>
								<li class="clearfix">
									<div class="device-name">Android</div>
									<div class="device-progress">
										<div class="progress">
											<div class="progress-bar android border-radius-8" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 30%;">
											</div>
										</div>
									</div>
									<div class="device-total">30</div>
								</li>
								<li class="clearfix">
									<div class="device-name">Linux</div>
									<div class="device-progress">
										<div class="progress">
											<div class="progress-bar linux border-radius-8" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 10%;">
											</div>
										</div>
									</div>
									<div class="device-total">10</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-30">
					<div class="bg-white pd-20 box-shadow border-radius-5 height-100-p">
						<h4 class="mb-30">Device Usage</h4>
						<div class="clearfix device-usage-chart">
							<div class="width-50-p pull-left">
								<div id="device-usage" style="min-width: 180px; height: 200px; margin: 0 auto"></div>
							</div>
							<div class="width-50-p pull-left">
								<table style="width: 100%;">
									<thead>
										<tr>
											<th class="weight-500"><p>Device</p></th>
											<th class="text-right weight-500"><p>Usage</p></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td width="70%"><p class="weight-500 mb-5"><i class="fa fa-square text-yellow"></i> IE</p></td>
											<td class="text-right weight-400">10%</td>
										</tr>
										<tr>
											<td width="70%"><p class="weight-500 mb-5"><i class="fa fa-square text-green"></i> Chrome</p></td>
											<td class="text-right weight-400">40%</td>
										</tr>
										<tr>
											<td width="70%"><p class="weight-500 mb-5"><i class="fa fa-square text-orange-50"></i> Firefox</p></td>
											<td class="text-right weight-400">30%</td>
										</tr>
										<tr>
											<td width="70%"><p class="weight-500 mb-5"><i class="fa fa-square text-blue-50"></i> Safari</p></td>
											<td class="text-right weight-400">10%</td>
										</tr>
										<tr>
											<td width="70%"><p class="weight-500 mb-5"><i class="fa fa-square text-red-50"></i> Opera</p></td>
											<td class="text-right weight-400">10%</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-30">
					<div class="bg-white pd-20 box-shadow border-radius-5 height-100-p">
						<h4 class="mb-30">Profile Completion</h4>
						<div class="clearfix device-usage-chart">
							<div class="width-50-p pull-left">
								<div id="ram" style="min-width: 160px; max-width: 180px; height: 200px; margin: 0 auto"></div>
							</div>
							<div class="width-50-p pull-left">
								<div id="cpu" style="min-width: 160px; max-width: 180px; height: 200px; margin: 0 auto"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row clearfix">
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-30">
					<div class="bg-white pd-20 box-shadow border-radius-5 height-100-p">
						<h4 class="mb-20">Recent Messages</h4>
						<div class="notification-list mx-h-450 customscroll">
							<ul>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
								<li>
									<a href="#">
										<img src="vendors/images/img.jpg" alt="">
										<h3 class="clearfix">John Doe <span>3 mins ago</span></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-30">
					<div class="bg-white pd-20 box-shadow border-radius-5 height-100-p">
						<h4 class="mb-30">To Do list</h4>
						<div class="to-do-list mx-h-450 customscroll">
							<ul>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck1">
										<label class="custom-control-label" for="customCheck1">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck2">
										<label class="custom-control-label" for="customCheck2">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck3">
										<label class="custom-control-label" for="customCheck3">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck4">
										<label class="custom-control-label" for="customCheck4">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck5">
										<label class="custom-control-label" for="customCheck5">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck6">
										<label class="custom-control-label" for="customCheck6">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck7">
										<label class="custom-control-label" for="customCheck7">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck8">
										<label class="custom-control-label" for="customCheck8">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck9">
										<label class="custom-control-label" for="customCheck9">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck10">
										<label class="custom-control-label" for="customCheck10">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck11">
										<label class="custom-control-label" for="customCheck11">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck12">
										<label class="custom-control-label" for="customCheck12">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck13">
										<label class="custom-control-label" for="customCheck13">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck14">
										<label class="custom-control-label" for="customCheck14">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck15">
										<label class="custom-control-label" for="customCheck15">Check this custom checkbox</label>
									</div>
								</li>
								<li>
									<div class="custom-control custom-checkbox">
										<input type="checkbox" class="custom-control-input" id="customCheck16">
										<label class="custom-control-label" for="customCheck16">Check this custom checkbox</label>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<?php include('include/footer.php'); ?>
		</div>
	</div>
	<?php include('include/script.php'); ?>
	<script src="src/plugins/highcharts-6.0.7/code/highcharts.js"></script>
	<script src="src/plugins/highcharts-6.0.7/code/highcharts-more.js"></script>
	<script type="text/javascript">
		Highcharts.chart('areaspline-chart', {
			chart: {
				type: 'areaspline'
			},
			title: {
				text: ''
			},
			legend: {
				layout: 'vertical',
				align: 'left',
				verticalAlign: 'top',
				x: 70,
				y: 20,
				floating: true,
				borderWidth: 1,
				backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
			},
			xAxis: {
				categories: [
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday',
					'Sunday'
				],
				plotBands: [{
					from: 4.5,
					to: 6.5,
				}],
				gridLineDashStyle: 'longdash',
                gridLineWidth: 1,
                crosshair: true
			},
			yAxis: {
				title: {
					text: ''
				},
				gridLineDashStyle: 'longdash',
			},
			tooltip: {
				shared: true,
				valueSuffix: ' units'
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				areaspline: {
					fillOpacity: 0.6
				}
			},
			series: [{
				name: 'John',
				data: [0, 5, 8, 6, 3, 10, 8],
				color: '#f5956c'
			}, {
				name: 'Jane',
				data: [0, 3, 6, 3, 7, 5, 9],
				color: '#f56767'
			}, {
				name: 'Johnny',
				data: [0, 2, 5, 3, 2, 4, 0],
				color: '#a683eb'
			}, {
				name: 'Daniel',
				data: [0, 4, 7, 3, 0, 7, 4],
				color: '#41ccba'
			}]
		});


		// Device Usage chart
		Highcharts.chart('device-usage', {
			chart: {
				type: 'pie'
			},
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				series: {
					dataLabels: {
						enabled: false,
						format: '{point.name}: {point.y:.1f}%'
					}
				},
				pie: {
					innerSize: 127,
					depth: 45
				}
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
				pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
			},
			series: [{
				name: 'Brands',
				colorByPoint: true,
				data: [{
					name: 'IE',
					y: 10,
					color: '#ecc72f'
				}, {
					name: 'Chrome',
					y: 40,
					color: '#46be8a'
				}, {
					name: 'Firefox',
					y: 30,
					color: '#f2a654'
				}, {
					name: 'Safari',
					y: 10,
					color: '#62a8ea'
				}, {
					name: 'Opera',
					y: 10,
					color: '#e14e50'
				}]
			}]
		});

		// gauge chart
		Highcharts.chart('ram', {

			chart: {
				type: 'gauge',
				plotBackgroundColor: null,
				plotBackgroundImage: null,
				plotBorderWidth: 0,
				plotShadow: false
			},
			title: {
				text: ''
			},
			credits: {
				enabled: false
			},
			pane: {
				startAngle: -150,
				endAngle: 150,
				background: [{
					borderWidth: 0,
					outerRadius: '109%'
				}, {
					borderWidth: 0,
					outerRadius: '107%'
				}, {
				}, {
					backgroundColor: '#fff',
					borderWidth: 0,
					outerRadius: '105%',
					innerRadius: '103%'
				}]
			},

			yAxis: {
				min: 0,
				max: 200,

				minorTickInterval: 'auto',
				minorTickWidth: 1,
				minorTickLength: 10,
				minorTickPosition: 'inside',
				minorTickColor: '#666',

				tickPixelInterval: 30,
				tickWidth: 2,
				tickPosition: 'inside',
				tickLength: 10,
				tickColor: '#666',
				labels: {
					step: 2,
					rotation: 'auto'
				},
				title: {
					text: 'RAM'
				},
				plotBands: [{
					from: 0,
					to: 120,
					color: '#55BF3B'
				}, {
					from: 120,
					to: 160,
					color: '#DDDF0D'
				}, {
					from: 160,
					to: 200,
					color: '#DF5353'
				}]
			},

			series: [{
				name: 'Speed',
				data: [80],
				tooltip: {
					valueSuffix: '%'
				}
			}]
		});
		Highcharts.chart('cpu', {

			chart: {
				type: 'gauge',
				plotBackgroundColor: null,
				plotBackgroundImage: null,
				plotBorderWidth: 0,
				plotShadow: false
			},
			title: {
				text: ''
			},
			credits: {
				enabled: false
			},
			pane: {
				startAngle: -150,
				endAngle: 150,
				background: [{
					borderWidth: 0,
					outerRadius: '109%'
				}, {
					borderWidth: 0,
					outerRadius: '107%'
				}, {
				}, {
					backgroundColor: '#fff',
					borderWidth: 0,
					outerRadius: '105%',
					innerRadius: '103%'
				}]
			},

			yAxis: {
				min: 0,
				max: 200,

				minorTickInterval: 'auto',
				minorTickWidth: 1,
				minorTickLength: 10,
				minorTickPosition: 'inside',
				minorTickColor: '#666',

				tickPixelInterval: 30,
				tickWidth: 2,
				tickPosition: 'inside',
				tickLength: 10,
				tickColor: '#666',
				labels: {
					step: 2,
					rotation: 'auto'
				},
				title: {
					text: 'CPU'
				},
				plotBands: [{
					from: 0,
					to: 120,
					color: '#55BF3B'
				}, {
					from: 120,
					to: 160,
					color: '#DDDF0D'
				}, {
					from: 160,
					to: 200,
					color: '#DF5353'
				}]
			},

			series: [{
				name: 'Speed',
				data: [120],
				tooltip: {
					valueSuffix: ' %'
				}
			}]
		});
	</script>
</body>
</html>