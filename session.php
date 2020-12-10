<?php
	require("connect.php");
if(isset($_POST['session']))
{
  $sql = "select * from worker where username='".$_POST["username"]."' and pass='".$_POST["pass"]."'";

  $result = $conn->query($sql);
}



if ($result->num_rows > 0) {
  // output data of each row
  session_start();
  while($row = $result->fetch_assoc()) {
    $_SESSION["username"] = $row["username"];
    $_SESSION["pass"] = $row["pass"];
    $_SESSION["type"] = $row["type"];
																				
  }
  if(  $_SESSION["type"] == "0"){
  header('Location: index.php');
} 

if(  $_SESSION["type"] == "1"){
    header('Location: form-basic.php');
  } 

  if(  $_SESSION["type"] == "2"){
    header('Location: indexworker.php');
  } 
  

}
else {
    header('Location: login.php');
}

$conn->close();

				?>