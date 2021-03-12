<?php
// verifParticipant.php
session_start();
require_once("connectMySQL.php");
$base=connect();
//
header("content-type:text/plain; charset=utf-8");
header("Access-Control-Allow-Origin: *");

$participant = $_POST['participant'];
$requete = "select * from rowdata where `participant` = '" . $participant . "';";
// . '$participant';";
$result = $base->query($requete);
$nbLines =  $result->num_rows;
if ( !$nbLines ) echo 'OK';
else echo' ko';
?>
