
<!DOCTYPE html>
<html>
<style>
	.btn {
  border: none;
  background-color: 	#00CED1;
  padding: 14px 28px;
  font-size: 50px;
  cursor: pointer;
  display: inline-block;
}

/* On mouse-over */
.btn:hover {background: #eee;}

.success {color: green;}
.info {color: dodgerblue;}
.warning {color: orange;}
.danger {color: red;}
.default {color: black;}
</style>
<head>
<?php

require("connect.php");





?>


<?php

if ($_SERVER["REQUEST_METHOD"] == "POST")
{


	$req = "INSERT INTO tasks (nl, state, qte, scanby, productname) VALUES(?, ?, ?, ?, ?)";
	$statement = $conn->prepare($req);
 
    $statement->bind_param( 'sssss', $_POST["nl"], $_POST["state"], $_POST["qte"],$_POST["scanby"],$_POST["productname"]); 
    

	if($statement->execute()){
	//	header('Location: datatable.php');


}else{
 // print $mysqli->error; 
 die("S'il vous plaît entrez votre adresse name");
}


}

?>
	<?php include('include/head.php'); ?>
	<link rel="stylesheet" type="text/css" href="src/plugins/datatables/media/css/jquery.dataTables.css">
	<link rel="stylesheet" type="text/css" href="src/plugins/datatables/media/css/dataTables.bootstrap4.css">
	<link rel="stylesheet" type="text/css" href="src/plugins/datatables/media/css/responsive.dataTables.css">
</head>
<body>
	<?php include('include/header.php'); ?>
	<?php include('include/sidebar.php'); ?>
	<div class="main-container">
		<div class="pd-ltr-20 customscroll customscroll-10-p height-100-p xs-pd-20-10">
			<div class="min-height-200px">
				<div class="page-header">
					<div class="row">
						<div class="col-md-6 col-sm-12">
							<div class="title">
								<h4>Tasks Table</h4>
							</div>
							<nav aria-label="breadcrumb" role="navigation">
								<ol class="breadcrumb">
									<li class="breadcrumb-item"><a href="index.php">Home</a></li>
									<li class="breadcrumb-item active" aria-current="page">Tasks Table</li>
								</ol>
							</nav>
						</div>
						<div class="col-md-6 col-sm-12 text-right">
							<div class="dropdown">
								<a class="btn btn-primary dropdown-toggle" href="#" role="button" data-toggle="dropdown">
									January 2018
								</a>
								<div class="dropdown-menu dropdown-menu-right">
									<a class="dropdown-item" href="#">Export List</a>
									<a class="dropdown-item" href="#">Policies</a>
									<a class="dropdown-item" href="#">View Assets</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Simple Datatable start -->
				<div class="pd-20 bg-white border-radius-4 box-shadow mb-30">
					<div class="clearfix mb-20">
						<div class="pull-left">
							<h3 class="text-blue">Tasks Table</h3>
							</div>
					</div>
					<div class="container" ng-app="myApp" ng-controller="usersCtrl"><br>
 
<br>
					<div class="row">
						<table class="data-table stripe hover nowrap">
							<thead>


							</script>				
								<tr>
									<th>id</th>
									<th class="table-plus datatable-nosort">Product Name</th>
									<th>Node Location</th>
									<th>Scanned by</th>
									<th>Done by</th>
									<th>State</th>
									<th class="datatable-nosort">Action</th>
									<th class="datatable-nosort">Marks as</th>
								</tr>
							</thead>
							<tbody>
							<?php


$sql = "select * from tasks";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
  
	 

	?>

								<tr>


							<td><?php echo $row["id"] ;?></td>
									<td class="table-plus"><?php echo $row["productname"] ;?></td>
									<td><?php echo $row["nl"] ;?></td>
									<td><?php echo $row["scanby"] ;?></td>
									<td><?php echo $row["doneby"] ;?> </td>
									<td><?php $s=$row["state"] ; if ($s==0) {echo "To do";} elseif ($s==1){echo "Doing";} elseif($s==2){echo "Done";}; ?></td>
									<td>
										<div class="dropdown">
											<a class="btn btn-outline-primary dropdown-toggle" href="#" role="button" data-toggle="dropdown">
												<i class="fa fa-ellipsis-h"></i>
											</a>
											<div class="dropdown-menu dropdown-menu-right">
												
												<a class="dropdown-item" href="update.php?id=<?php echo $row["id"]; ?>"><i class="fa fa-pencil"></i> Edit</a>
												<a class="dropdown-item" href="delete.php?id=<?php echo $id=$row["id"] ;?>" ><i class="fa fa-trash"></i> Delete</a>
											</div>
										</div>
									</td>
									<td>
										<div class="dropdown">
											<a class="btn btn-outline-primary dropdown-toggle" href="#" role="button" data-toggle="dropdown">
												<i class="fa fa-ellipsis-h"></i>
											</a>
											<div class="dropdown-menu dropdown-menu-right">
												<a class="dropdown-item" href="todo.php?id=<?php echo $id=$row["id"] ;?>"><i class="fa fa-pencil"></i> To do</a>
												<a class="dropdown-item" href="doing.php?id=<?php echo $id=$row["id"] ;?>"><i class="fa fa-pencil"></i> Doing</a>
												<a class="dropdown-item" href="done.php?id=<?php echo $id=$row["id"] ;?>" ><i class="fa fa-pencil"></i> Done</a>
											</div>
										</div>
									</td>
								</tr>
								
						<?php
  }
} else {
  echo "0 results";
}
$conn->close();

				?>
					
														</tbody>
						</table>
					</div>
				</div>
				<!-- Simple Datatable End -->
				<!-- multiple select row Datatable start -->
				
				<!-- Export Datatable End -->
			</div>

			<?php include('include/footer.php'); ?>
		</div>
	</div>
	<?php include('include/script.php'); ?>
	<script src="src/plugins/datatables/media/js/jquery.dataTables.min.js"></script>
	<script src="src/plugins/datatables/media/js/dataTables.bootstrap4.js"></script>
	<script src="src/plugins/datatables/media/js/dataTables.responsive.js"></script>
	<script src="src/plugins/datatables/media/js/responsive.bootstrap4.js"></script>
	<!-- buttons for Export datatable -->
	<script src="src/plugins/datatables/media/js/button/dataTables.buttons.js"></script>
	<script src="src/plugins/datatables/media/js/button/buttons.bootstrap4.js"></script>
	<script src="src/plugins/datatables/media/js/button/buttons.print.js"></script>
	<script src="src/plugins/datatables/media/js/button/buttons.html5.js"></script>
	<script src="src/plugins/datatables/media/js/button/buttons.flash.js"></script>
	<script src="src/plugins/datatables/media/js/button/pdfmake.min.js"></script>
	<script src="src/plugins/datatables/media/js/button/vfs_fonts.js"></script>
	<script>
		$('document').ready(function(){
			$('.data-table').DataTable({
				scrollCollapse: true,
				autoWidth: false,
				responsive: true,
				columnDefs: [{
					targets: "datatable-nosort",
					orderable: false,
				}],
				"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
				"language": {
					"info": "_START_-_END_ of _TOTAL_ entries",
					searchPlaceholder: "Search"
				},
			});
			$('.data-table-export').DataTable({
				scrollCollapse: true,
				autoWidth: false,
				responsive: true,
				columnDefs: [{
					targets: "datatable-nosort",
					orderable: false,
				}],
				"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
				"language": {
					"info": "_START_-_END_ of _TOTAL_ entries",
					searchPlaceholder: "Search"
				},
				dom: 'Bfrtip',
				buttons: [
				'copy', 'csv', 'pdf', 'print'
				]
			});
			var table = $('.select-row').DataTable();
			$('.select-row tbody').on('click', 'tr', function () {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
				}
				else {
					table.$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
				}
			});
			var multipletable = $('.multiple-select-row').DataTable();
			$('.multiple-select-row tbody').on('click', 'tr', function () {
				$(this).toggleClass('selected');
			});
		});


		 $scope.deletetask = function(id) {  
    
     	$sql1="delete from tasks where id= '$id' ";
    
      
    } 
	</script>
</body>
</html>