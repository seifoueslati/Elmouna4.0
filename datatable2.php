<!DOCTYPE html>
<html>
<head>
<?php

require("connect.php");





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
								<h4>DataTable</h4>
							</div>
							<nav aria-label="breadcrumb" role="navigation">
								<ol class="breadcrumb">
									<li class="breadcrumb-item"><a href="index.php">Home</a></li>
									<li class="breadcrumb-item active" aria-current="page">DataTable</li>
								</ol>
							</nav>
						</div>
						<div class="col-md-6 col-sm-12 text-right">
							<div class="dropdown">
								<a class="btn btn-primary dropdown-toggle" href="#" role="button" data-toggle="dropdown">
									ELMOUNA 4.0
							<div class="dropdown-menu dropdown-menu-left">
									

								</div>
								</a>
							</div>
						</div>
					</div>
				</div>
				<html>
  <head>
    <title>WORKER</title>
  </head>
  <body>
 
  </body>
</html>
				<!-- Simple Datatable start -->
				<div class="pd-20 bg-white border-radius-4 box-shadow mb-30">
					<div class="clearfix mb-20">
						<div class="pull-left">
							<h3 class="text-blue">Workers Table</h3>
							</div>
					</div>
					
					<div class="row">
						<table class="data-table stripe hover nowrap">
							<thead>


							</script>				
								<tr>
									<th class="table-plus datatable-nosort">Id</th>
									<th>User </th>
									<th>Password</th>
									<th>Type</th>
									<th class="datatable-nosort">Action</th>
								</tr>
							</thead>
							<tbody>
							
							<?php


$sql = "select * from worker";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
  
	 //echo "id: ";
	?>

								<tr>


						
									<td class="table-plus"><?php echo $row["id"] ;?></td>
									<td><?php echo $row["username"] ;?></td>
									<td><?php echo $row["pass"] ;?></td>
									<td><?php echo $row["type"] ;?> </td>
									
									<td>
										<div class="dropdown">
											<a class="btn btn-outline-primary dropdown-toggle" href="#" role="button" data-toggle="dropdown">
												<i class="fa fa-ellipsis-h"></i>
											</a>
											<div class="dropdown-menu dropdown-menu-right">
												<a class="dropdown-item" href="datatable2.php"><i class="fa fa-eye"></i> View</a>
												<?php
												echo "<a data-toggle='modal' data-target='#exampleModal".$row['id']."' class='dropdown-item'"."'><i class='fa fa-pencil'></i> Edit</a>";
												echo "<a class='dropdown-item' href='deleteworker.php?id=".$row['id']."'><i class='fa fa-trash'></i> Delete</a>";
												?>
											</div>
										</div>
									</td>
								</tr>
								<div class="modal fade" id="exampleModal<?php echo $row['id']; ?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
												  <div class="modal-dialog" role="document">
													<div class="modal-content">
													  <div class="modal-header">
														<h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
														<button type="button" class="close" data-dismiss="modal" aria-label="Close">
														  <span aria-hidden="true">&times;</span>
														</button>
													  </div>
													  <div class="modal-body">
														<form method="post" action="updateworker.php?id=<?php echo $row['id'];?>">
													<center>
													<img src="vendors/images/worker.jpg" alt="worker" class="worker">
												 </center>
													  UserName : <input type="text" name="username" placeholder="Entrer votre username" value="<?php echo $row['username'];?>" /><br />
													  Password : <input type="pass" name="pass" placeholder="Entrer votre pass" value="<?php echo $row['pass'];?>" /><br />
													  Type: <select type="select" name="type" placeholder="Entrer votre type" /> 
													  <option> 1</option>
														 <option> 2</option>

													  </select><br />
													  
													  <button class="btn btn-primary" type="submit" value="Submit">Save changes</button>
													</form>
													  </div>
													  <div class="modal-footer">
														<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
													  </div>
													</div>
												  </div>
												</div>
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
	</script>
	<!-- Modal -->

</body>
</html>