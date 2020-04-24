<!DOCTYPE html>
<?php
// Nomenclature : [Années depuis 2020].[Mois].[Jour].[Nombre dans la journée]
$version = "0.01";
?>
<html lang="fr" xml:lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html charset=utf-8" />
	<meta name="viewport" content="width=device-width,  initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, maximum-scale=0.5, user-scalable=yes"> <!--  -->
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<title>Stroop Lutin</title>

	<!-- ====== Bootstrap ====== -->
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
	<!-- jQuery library -->
	<script src="https://code.jquery.com/jquery-3.3.1.min.js" crossorigin="anonymous"></script>
	<script src="https://cdn.rawgit.com/mgalante/jquery.redirect/master/jquery.redirect.js"></script>
  <!-- Popper -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
	<!-- Latest compiled JavaScript -->
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
	<!-- awesome -->
	<script defer src="https://use.fontawesome.com/releases/v5.8.1/js/all.js" integrity="sha384-g5uSoOSBd7KkhAMlnQILrecXvzst9TdC09/VM+pjDTCM+1il8RHz5fKANTFFb+gQ" crossorigin="anonymous"></script>
	<!-- STROOP -->
	<link rel="stylesheet" href="index.css">
	<link rel="stylesheet" href="helpIndex.css">
</head>
<!-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<body class="">
	<div id="stroop" class="text-center">
<!-- ************************************* -->
		<div id="accueil" class="section form-signin">
		  <div class="h3 mb-3 font-weight-large">Bienvenue dans STROOP!</div>
			<br>
			<br>
		  <label for="participant" class="sr-only">Participant</label>
		  <input id="participant" type="text" class="form-control" placeholder="Nom du participant" required="" autofocus="">
			<label for="lieu" class="sr-only">lieu</label>
		  <input id="lieu" type="text" class="form-control" placeholder="Lieu de la passation" required="" autofocus="">
		  <!--<label for="inputPassword" class="sr-only">Password</label>
		  <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="">-->
			<br>
		  <!--<div class="checkbox mb-3">
		    <label>
		      <input type="checkbox" value="remember-me"> Remember me
		    </label>
		  </div>-->
		  <button id="boutPretest1" class="btn btn-lg btn-primary btn-block">Cliquez-moi pour commencer</button>
		</div> <!-- fin accueil -->
<!-- ************************************* pretest1 -->
		<div id="pretest1" class="section consigne">
			<div class="consigne-texte">
				<br/><br/><br/>
				<h5 class="blue-text">
					MERCI D'AVOIR DONNE VOTRE ACCORD POUR REALISER CET EXERCICE.
				</h5>
				<br/>
				<h5>
				Cinq mots vont s'afficher.
				<br/>
				Pour chacun des mots, tapez la première lettre du mot dans la case correspondante à droite des mots.
				<br/><br/>
				Exemple:
				<br/>
				Si on a les mots <b>CHAT BLEU CAROTTE RIRE ROUGE</b>, tapez <b>C, B, C, R, R</b>.
			</h5>
				<br/>
			</div>
			<div class="form-signin">
				<button id="boutDoPretest1" class="btn btn-lg btn-primary btn-block">Cliquez-moi pour commencer</button>
			</div>
		</div> <!-- fin pretest1 -->
<!-- ************************************* test1 -->
		<div id="test1" class="section consigne">
			<div class="consigne-texte">
				<br/><br/><br/>
				<h5>Très bien!</h5>
				<br/>
				<h5>
				Maintenant nous allons refaire la même chose 10 fois,
				<br/>
				 mais il faut taper la premiere lettre de chaque mot le plus vite possible.
			</h5>
				<br/>
			</div>
			<br/>
			<div class="form-signin">
				<button id="boutDoTest1" class="btn btn-lg btn-primary btn-block">Cliquez-moi pour commencer</button>
			</div>
		</div> <!-- fin test1 -->
<!-- ************************************* pretest2 -->
		<div id="pretest2" class="section consigne">
			<div class="consigne-texte">
				<br/><br/><br/>
				<br/><h5>
				Cinq mots vont s'afficher.<br/>
				Pour chacun des mots, tapez la première lettre de <b>la couleur de l'encre </b>dans laquelle le mot est écrit,
				<br/>
				dans la case correspondante à droite des mots.<br/>
				Exemple:
				<br/>
				Si on a les mots <b>CHAT BLEU CAROTTE RIRE ROUGE</b> écrit en <b>ROUGE, VERT, JAUNE, ROUGE, ROUGE,</b><br/>
				 il faut tapez <b>R, V, J, R, R.</b>
				<br/>
				</h5>
				<br/>
			</div>
			<br/>
			<div class="form-signin">
				<button id="boutDoPretest2" class="btn btn-lg btn-primary btn-block">Cliquez-moi pour commencer</button>
			</div>
		</div> <!-- fin pretest2 -->
<!-- ************************************* test2 -->
		<div id="test2" class="section consigne">
			<div class="consigne-texte">
				<br/><br/><br/>
				<h5>Très bien!</h5>
				<br/>
				<h5>
				Maintenant nous allons refaire la même chose 10 fois,
				<br/>
				 mais il faut taper la premiere lettre de la couleur de chaque mot le plus vite possible.
			</h5>
				<br/>
			</div>
			<br/>
			<div class="form-signin">
				<button id="boutDoTest2" class="btn btn-lg btn-primary btn-block">Cliquez-moi pour commencer</button>
			</div>
		</div> <!-- fin test2 -->
		<!-- ************************************* test3 -->
				<div id="test3" class="section consigne">
					<div class="consigne-texte">
						<br/><br/><br/>
						<h5>Très bien!
						<br/>
						<h5>
						nous allons refaire la même chose encore 10 fois, <br/>
						mais avec une autre liste de mots.
						<br/>
						 Il faut ici encore taper la premiere lettre de la couleur de chaque mot le plus vite possible.
					</h5>
						<br/>
					</div>
					<br/>
					<div class="form-signin">
						<button id="boutDoTest3" class="btn btn-lg btn-primary btn-block">Cliquez-moi pour commencer</button>
					</div>
				</div> <!-- fin test3 -->
<!-- ************************************* doPhase -->
		<div id="doPhase" class="section phase">
			<br/><br/><br/><br/>
			<div id="wordpad">
				<div id="wordpad-nums">
					<div class="num">1</div>
					<div class="num">2</div>
					<div class="num">3</div>
					<div class="num">4</div>
					<div class="num">5</div>
				</div>
				<div id="words">
					<div id="word0" class="fiveWords"></div>
					<div id="word1" class="fiveWords"></div>
					<div id="word2" class="fiveWords"></div>
					<div id="word3" class="fiveWords"></div>
					<div id="word4" class="fiveWords"></div>
				</div>
			</div>

			<div id="boxpad">
				<div id="boxpad-nums">
					<div class="num2">1</div>
					<div class="num2">2</div>
					<div class="num2">3</div>
					<div class="num2">4</div>
					<div class="num2">5</div>
				</div>
				<div id="boxes">
					<div id="box0" class="fiveBoxes"></div>
					<div id="box1" class="fiveBoxes"></div>
					<div id="box2" class="fiveBoxes"></div>
					<div id="box3" class="fiveBoxes"></div>
					<div id="box4" class="fiveBoxes"></div>
				</div>
			</div>
			<br/>
			<div class="form-signin">
				<button id="boutTrial" class="btn btn-lg btn-primary btn-block">Suite</button>
				<button id="boutPhase" class="btn btn-lg btn-primary btn-block">Suite</button>
			</div>
		</div> <!-- fin doPhase -->
		<!-- ************************************* test3 -->
				<div id="endStroop" class="section consigne">
					<div class="consigne-texte">
						<br/><br/><br/>
						<h5>Très bien!<br/>
						<br/>
						Merci beaucoup.
						</h5>
						<br/>
					</div>
					<br/>
				</div> <!-- fin test3 -->
<!-- ************************************* -->
	</div> <!-- fin stroop -->
	<script src="index.js"></script>

</body>
</html>
