<?php 

require 'connect.php';


  // Vérifie qu'il provient d'un formulaire
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
	  
	 

	$id= 0;
	$username = $_POST["username"]; 
    $pass= $_POST["pass"]; 

    $type = $_POST["type"];
    
  
    if (!isset($username) ){
      die("S'il vous plaît entrez votre adresse name");
    }
    
	
	    if (!isset($pass)){
      die("S'il vous plaît entrez votre pass");
    }
    if (!isset($type)){
      die("S'il vous plaît entrez votre adresse type");
    }
    //print "Salut " . $username ;
	

	   //Ouvrir une nouvelle connexion au serveur MySQL
    //$mysqli = new mysqli($servername, $username, $password, $dbname);
	//$mysqli.safe_mode  = On
    
    //Afficher toute erreur de connexion
   // if ($mysqli->connect_error) {
     // die('Error : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
    //}  
    
    //préparer la requête d'insertion SQL
	$req = "INSERT INTO worker (id,username,pass,type) VALUES(?, ?, ?, ?)";
	$statement = $conn->prepare($req);
    //$statement = mysqli_query($conn, ); // lerrur hne 
	//$statement->execute();
    //Associer les valeurs et exécuter la requête d'insertion
    $statement->bind_param( 'ssss', $id, $username, $pass, $type); 
    
    if($statement->execute()){
		    header('Location: datatable2.php');

      print "ADD Worker " . $username;
    }else{
      //print $mysqli->error; 
    }
  }
?>
  