<?php
function connect()
{
	define("MYHOST","localhost");
	define("MYUSER","sioux");
	define("MYPASS","sioux");
	define("MYBASE","stoop");

	$idcomW = new mysqli(MYHOST,MYUSER,MYPASS,MYBASE);
	if (!$idcomW)
	{
	  echo "<script type=text/javascript>";
		echo "alert('Connexion mode Write Impossible à la base STROOP')</script>";
		exit();
	}
	$idcomW->query("SET sql_mode = 'ONLY_FULL_GROUP_BY'");
	return $idcomW;
}
?>
