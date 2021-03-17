<?php
// data.php
session_start();
require_once("connectMySQL.php");
$base=connect();

header("content-type:text/plain; charset=utf-8");
header("Access-Control-Allow-Origin: *");

$participant = $_GET['participant'];
$literal = $_GET['literal'];

if ( $participant ) {
	$fileName = "stroop_$participant-";
	if ( $literal )
		$requete = "SELECT * FROM rowdata WHERE `participant` = '$participant' ORDER BY `id`";
	else
		$requete = "SELECT * FROM rowdata WHERE `participant` RLIKE '$participant' ORDER BY `id`";
}
else {
	$requete = "SELECT * FROM rowdata ORDER BY `id`";
	$fileName = "stroop-";
}
$result = $base->query($requete);
$array = arrayResult($result, 1);

//arrayToCsvFile($array, "$fileName.csv");
arrayToCsvFile($array, "stroop.csv");
error_reporting(E_ERROR);
header('Content-Type: application/octet-stream;');
header("Content-Disposition: attachment; filename=$fileName" . date('y.m.d-H:i:s') . ".csv;");
header('Content-Length: '.filesize("stroop.csv").';');
readfile("stroop.csv");
//echo json_encode($array);  // debug
//******************************************************************************************

function arrayResult($result, $colTitles) {
	$nbRows = $result->num_rows;

	$nbCols=$result->field_count;
	if ($colTitles) {
		$titres = $result->fetch_fields();
		for($i = 0; $i < $nbCols; $i++) {
			$tab[0][$i] = $titres[$i]->name;
		}
		$nbRows++;
	}
	$i = ($colTitles)? 1: 0;
	for (; $i < $nbRows; $i++) {
		$row = $result->fetch_array(MYSQLI_NUM);

//echo $i, "  ", "***********************************  ";  // debug

		for ($j = 0; $j < $nbCols; $j++) {
			$donn = preg_replace('/<!--/','<--',$row[$j]);   // virer les comm. html
			$tab[$i][$j] = $donn;   // utf8_encode($donn);

//echo utf8_encode($donn), "  ";  // debug

		}
	}
	return($tab);
}
//*********************************************************************************************
function arrayToCsvFile($tab, $fileName) {
	if ($f = @fopen($fileName, 'w')) {
		flock($f, LOCK_SH);
		for ($i = 0; $i < count($tab); $i++) {
			fputcsv($f, $tab[$i]);  // à rétablir à la place du patch
			// patch pour STROOP
			//if ( $i == 9 ) fputcsv($f, strtoupper($tab[$i]));
			//else fputcsv($f, $tab[$i]);
		}
		flock($f, LOCK_UN);
		fclose($f);
	}
	else {
		echo "Impossible d'acc&eacute;der au fichier" . $fileName . ".";
	}
}
?>
