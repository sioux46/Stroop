<?php
// ajaxSave.php
session_start();
require_once("connectMySQL.php");
$base=connect();
//
header("content-type:text/plain; charset=utf-8");
header("Access-Control-Allow-Origin: *");

$base->autocommit(FALSE); // section critique

$rawdata = json_decode($_POST['data'], true);

for ( $i = 0; $i < count($rawdata); $i++ ) {

  $query = "INSERT INTO `rowdata` SET `observateur` = '" . $rawdata[$i]['observateur'] . "' ";

  $query = $query . ", `participant` = '" . $rawdata[$i]['participant'] . "'";

  $query = $query . ", `date` = '" . $rawdata[$i]['date'] . "'";

  $query = $query . ", `time` = '" . $rawdata[$i]['time'] . "'";

  $query = $query . ", `lieu` = '" . $rawdata[$i]['lieu'] . "'";

  $query = $query . ", `phase` = '" . $rawdata[$i]['phase'] . "'";

  $query = $query . ", `ligne` = '" . $rawdata[$i]['ligne'] . "'";

  $query = $query . ", `col` = '" . $rawdata[$i]['col'] . "'";

  $query = $query . ", `mot` = '" . $rawdata[$i]['mot'] . "'";

  $query = $query . ", `couleur` = '" . $rawdata[$i]['couleur'] . "'";

  $query = $query . ", `rep` = '" . $rawdata[$i]['rep'] . "'";

  $query = $query . ", `err` = '" . $rawdata[$i]['err'] . "'";

  $query = $query . ", `timeRep` = '" . $rawdata[$i]['timeRep'] . "';";


  $result = $base->query($query);

  if ( $base->errno == 0 ) $reponse = "ok";
  else {
    $base->rollback(); // annulation écriture
    $reponse = $base->errno . ' '. $base->error . ' erreur!!! ' . $query;
    echo 'rep: ' . $reponse . ' query: ' . $query . ' IIIII ';
    exit(1);
  }
  echo ' query: ' . $query;
  echo '
  ';
}
//echo 'count: ' . count($rawdata). ' rep: ' . $reponse . ' query: ' . $query;
$base->commit(); // fin section critique
?>
