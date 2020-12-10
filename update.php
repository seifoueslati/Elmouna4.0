<?php
// Include database connection file
$conn = mysqli_connect("localhost", "root", "", "elmouna");
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
    if(count($_POST)>0) {
    mysqli_query($conn,"UPDATE tasks set  nl='" . $_POST['nl'] . "', state='" . $_POST['state'] . "' ,qte='" . $_POST['qte'] . "', doneby='" . $_POST['doneby'] . "' , scanby='" . $_POST['scanby'] . "', productname='" . $_POST['productname'] . "'  WHERE id='" . $_POST['id'] . "'");
     
     header("location: datatable.php");
     exit();
    }
    $result = mysqli_query($conn,"SELECT * FROM tasks WHERE id='" . $_GET['id'] . "'");
    $row= mysqli_fetch_array($result);
  
?>
 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <title>Update Task</title>
    <?php include('include/head.php'); ?>
    <link rel="stylesheet" type="text/css" href="src/plugins/datatables/media/css/jquery.dataTables.css">
    <link rel="stylesheet" type="text/css" href="src/plugins/datatables/media/css/dataTables.bootstrap4.css">
    <link rel="stylesheet" type="text/css" href="src/plugins/datatables/media/css/responsive.dataTables.css">
</head>
<body>
    <?php include('include/header.php'); ?>
    <?php include('include/sidebar.php'); ?>
</head>
<body>

        <div class="container" style="margin-left: 300px">
            <div class="row">
                <div class="col-lg-12">
                   <br> <br> <br> <br>
                     <h2>Update Task</h2>
                      <br>
                    <form action="<?php echo htmlspecialchars(basename($_SERVER['REQUEST_URI'])); ?>" method="post">
                         <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" name="productname" class="form-control" value="<?php echo $row["productname"]; ?>" maxlength="50" required="">
                            
                        </div>
                        <div class="form-group">
                            <label>Node Location</label>
                            <input type="text" name="nl" class="form-control" value="<?php echo $row["nl"]; ?>" maxlength="50" required="">
                            
                        </div>
                        <div class="form-group ">
                            <label>State</label>
                            <input type="text" name="state" class="form-control" value="<?php echo $row["state"]; ?>" maxlength="30" required="">
                        </div>
                        <div class="form-group">
                            <label>Quantité</label>
                            <input type="text" name="qte" class="form-control" value="<?php echo $row["qte"]; ?>" maxlength="12"required="">
                        </div>
                        <div class="form-group">
                            <label>Done By</label>
                            <input type="text" name="doneby" class="form-control" value="<?php echo $row["doneby"]; ?>" maxlength="30">
                        </div>
                        <div class="form-group">
                            <label>Scan By</label>
                            <input type="text" name="scanby" class="form-control" value="<?php echo $row["scanby"]; ?>" maxlength="30">
                        </div>
                        <input type="hidden" name="id" value="<?php echo $row["id"]; ?>"/>
                        <input type="submit" class="btn btn-primary" value="Submit">
                        <a href="datatable.php" class="btn btn-default">Cancel</a>
                    </form>
                </div>
            </div>  
        </div>
</body>
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
</html>