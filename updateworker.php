<?php
require 'connect.php';

// Get the posted data.
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
	  
	      //identifiants mysql
	  $servername = "localhost:50";
$username = "root";
$password = "";
$dbname = "elmouna";
	if (isset($_GET['id'])) {
    if (!empty($_POST)) {
        // This part is similar to the create.php, but instead we update a record and not insert
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        $username = isset($_POST['username']) ? $_POST['username'] : '';
        $pass= isset($_POST['pass']) ? $_POST['pass'] : '';
        $type = isset($_POST['type']) ? $_POST['type'] : '';
	}
	

  // Update.
  $sql = "UPDATE worker SET username = ?,pass = ?,type = ? WHERE id = ? ";
  $statement = $conn->prepare($sql);
    //$statement = mysqli_query($conn, ); // lerrur hne 
	//$statement->execute();
    //Associer les valeurs et exécuter la requête d'insertion
    $statement->bind_param( 'ssss', $username, $pass, $type, $id); 
    
    if($statement->execute()){
    

      print "ADD Worker " . $username;
    }else{
      //print $mysqli->error; 
    }
	}

 
  }  
 header('Location: datatable2.php');

?>