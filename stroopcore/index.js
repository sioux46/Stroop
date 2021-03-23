//index.js

var version = "0.42 ";
////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// F U N C T I O N S
////////////////////////////////////////////////////////////////////

/* non utilisé
//////// construit un tableau de nbIndexes de 0 à nbIndexes-1 index en ordre aléatoire
//////// appel: buildSignListIndex(8) ---> [2, 3, 6, 1, 5, 4, 7, 0]
function numAlea (nb) {
  var result = (Math.random() * nb).toFixed(0); // PAS TOUCHE! retourne une string!!!
  if ( result == nb ) result = 0;
  //console.log(result);
  return result;
}

function buildSignListIndex ( nbIndexes ) {

  var orgList = [];
  var list = [];
  var index, val;
  var filter = (function(x) { return x != val; }); // sans remise

  for ( var i = 0; i < nbIndexes; i++ ) orgList.push(i);

  for ( i = 0; i < nbIndexes; i++ ) {
    index = Number(numAlea(orgList.length));
    val = orgList[index];
    list.push(val);
    orgList = orgList.filter (filter);
  }
  return list;
}
//////////
*/

//    sauver tableau double entrée dans fichier csv
function toCsvFile(twoWayTable) {
  let csvContent = "data:text/csv;charset=utf-8," + twoWayTable.map(e => e.join(",")).join("\n");
  window.open(csvContent);
}

//
function buildObjTab(table) {
  let objTab = [], obj,  objLig;
  for ( let lig = 0; lig < table.length; lig++ ) {
    objLig = [];
    for ( let col = 0; col < 5; col++ ) {
      obj = {};
      obj.mot = table[lig][col].split("-")[0];
      obj.couleur = table[lig][col].split("-")[1];
      objLig[col] = obj;
    }
    objTab[lig] = objLig;
  }
  return objTab;
}

//
function dateTime() {
	var dt = new Date();
	var date = dt.getDate().toString();
	if (date.length == 1) date = '0' + date;
	var month = (dt.getMonth() + 1).toString();
	if (month.length == 1) month = '0' + month;
	var year = dt.getYear() + 1900;

	date = year + '-' + month + '-' + date;
	var time = dt.toTimeString().match(/^(.{8})/)[1];
	return {date:date, time:time};
}

// verif nouveau participant
function verifNewParticipant () {
  $.ajax({
    'url': 'verifParticipant.php',
    'type': 'post',
    'data': { participant: participant },
    'complete': function(xhr, result) {
      if (result != 'success') {
        alert ( 'Erreur réseau ', 'Stroop error!');
      }
      else {
        var reponse = xhr.responseText;
        if ( reponse == "OK" ) {
          $("#accueil").css({"display":"none"});
          $("#Pretest1").css({"display":"block"});
          suite = "Pretest1";
          flagAccuiel = false;
          return true;
        }
        else {
          $("#participant").text("");
          alert("Cet identifiant est déjà utilisé");
          $("#participant").focus();
          return false;
        }
      }
    }
  });
}

// sauve proto sur bd
function saveProtoToBase () {
  $.ajax({
    'url': 'ajaxSave.php',
    'type': 'post',
    'data': { data: JSON.stringify(proto) },
    'complete': function(xhr, result) {
      if (result != 'success') {
        alert ( 'Erreur réseau. Protocole non sauvé.', 'Stroop error!');
      }
      else {
        var reponse = xhr.responseText;
      }
    }
  });
}

//
function now () {
  return new Date().getTime();
}

function writeTrialToProto() {
  var trial = {};

  trial.observateur = ""; // observateur;
  trial.participant = participant;
  trial.condition = condition;
  let datetime = dateTime();
  trial.date = datetime.date;
  trial.time = datetime.time;
  trial.phase = phaseNames[phaseNum];
  trial.ligne = line + 1;
  trial.col = col + 1;
  trial.mot = $(`#word${col}`).text();   //.toLowerCase();
  trial.couleur = itemTab[line][col].couleur;
  trial.rep = $(`#box${col}`).text();
  trial.timeRep = now() - trialTime;
  if ( trial.phase == "Pretest1" || trial.phase == "Test1") {
    if ( trial.rep == trial.mot[0] ) trial.err = 0;
    else trial.err = 1;
  }
  else {
    if ( trial.rep == trial.couleur[0] ) trial.err = 0;
    else trial.err = 1;
  }

  proto.push(trial);
}

//
function goodCharAnswers() {
  for ( let i = 0; i < 5; i++ ) {
    if ( $(`#box${i}`).text() != $(`#word${i}`).text()[0] ) return false;
  }
  return true;
}

//
function goodColorAnswers() {
  for ( let i = 0; i < 5; i++ ) {
    if ( $(`#box${i}`).text() != itemTab[0][i].couleur[0] ) return false;
  }
  return true;
}

//
function displayTrial() {
  for ( let i = 0; i < 5; i++ ) {
    $(`#box${i}`).html("&nbsp;");
    $(`#word${i}`).text(itemTab[line][i].mot);
    let c = itemTab[line][i].couleur;
    $(`#word${i}`).css("color", couleurs[c]);
  }
  if ( phaseNames[phaseNum] != "Pretest1" && phaseNames[phaseNum] != "Pretest2" && phaseNames[phaseNum] != "Pretest3" )
                            $("#page-num").text(`${line + 1}/${itemTab.length}`);

  // $("#mobile-keyboard").focus();
  trialTime = now();
}

//
function initPhase() {
  var phase = phaseNames[phaseNum];
  line = 0;
  col = 0;
  if ( phase == "Pretest1" || phase == "Test1" ) $("#trial-consigne").text("Tapez la première lettre de chaque mot.");
  else $("#trial-consigne").text("Tapez la première lettre de la couleur de l'encre dans laquelle le mot est écrit.");
  $(`#box${col}`).css("border","2px solid black");
  displayTrial();
  $("#boutTrial").css({"display":"none"});
  suite = "";
  $("#boutPhase").css({"display":"none"});
  $("#doPhase").css({"display":"block"});
  waitForKey = true;
}

// lecture fichier .txt items phase 3
function readFile(ev) {
  var file = ev.target.files[0];
  if ( !file || !( file.name.match(/.txt$/)) ) return;
  var reader = new FileReader();
  reader.onload = function(ev2) {
    previousDocContent = ev2.target.result;
    try {
      custom_Phase3 = JSON.parse(previousDocContent);
    } catch (ex) {
      alert("Erreur de lecture: vérifier la syntaxe du fichier");
    }
    $("#openFileInput").val(""); // erase previous value
  };
  reader.readAsText(file);
}

////////////////////////////////////////////////  Fin F U N C T I O N S
///////////////////////////////////////////////////////////////////////

//*********************************************************************
//*********************************************************************
// ********************************************************** R E A D Y
$(document).ready(function () {

  // readFile input dialog
  $("#openFileInput").on("change", readFile);

  // click on #boutInputPhase3
  $("#boutInputPhase3").on("click", function () {
    $("#openFileInput").attr("accept", ".txt");
    $("#openFileInput").trigger("click");
  });

  // click on #boutInputImg
  $("#boutInputImg").on("click", function () {
    $("#openFileInput").attr("accept", ".png, .jpg");
    $("#openFileInput").trigger("click");
  });

  // show phase3 and img files load button
  if ( condition == "X" ) {
    $("#boutInputPhase3").css("display", "block");
    // $("#boutInputImg").css("display", "block"); // en attente
  }

///////////////////////////////////////////////////////////////////////
                                                    // saisie clavier
  $(document).on("keypress", function(ev) {

    if ( flagAccuiel ) return;

    if (ev.keyCode === 13 || ev.keyCode === 32 ) {

      if ( col == 4 && suite == "boutTrial" ) {
        $("#boutTrial").trigger("click");
      }
      else if ( col == 4 && suite == "boutPhase" ) {
        $("#boutPhase").trigger("click");
      }
      else if ( suite == "boutPretest1" ) {
        $(`#${suite}`).trigger("click");
      }
      else if ( suite ) {
        $(`#boutDo${suite}`).trigger("click");
      }
      return;
    }

    if ( !waitForKey ) return;

    waitForKey = false;
    var theChar = ev.originalEvent.key;
    if ( theChar.match(/[A-Za-z]/) ) {

      $(`#box${col}`).text((theChar).toUpperCase());
      writeTrialToProto();
      trialTime = now();

      $(`#box${col}`).css("border","2px solid white");
      if ( col < 4 ) $(`#box${col+1}`).css("border","2px solid black");
      if ( col == 4 ) {
        /*                                        À REMETTRE ÀPRES DEBBUG */
        if ( phaseNames[phaseNum] == "Pretest1" &&
                !goodCharAnswers() ) {  // erreur pretest1
          alert("Vous avez fait une erreur. On recommence.");
          initPhase();
          return;
        }
        if ( phaseNames[phaseNum] == "Pretest2" &&
                !goodColorAnswers() ) {  // erreur pretest2
          alert("Vous avez fait une erreur. On recommence.");
          initPhase();
          return;
        }
        if ( phaseNames[phaseNum] == "Pretest3" &&
                !goodColorAnswers() ) {  // erreur pretest3
          alert("Vous avez fait une erreur. On recommence.");
          initPhase();
          return;
        }
        /*                                  FIN   À REMETTRE ÀPRES DEBBUG  */
        if ( line < itemTab.length - 1 ) {
          $("#boutTrial").css({"display":"block"});
          suite = "boutTrial";
        }
        else {
          $("#boutPhase").css({"display":"block"});
          suite = "boutPhase";
        }
        return;
      }
      col++;
    }
    waitForKey = true;
  });

///////////////////////////////////////////////////////////////////////
  // essai suivant
  $("#boutTrial").on("click", function (ev) {
    line++;
    col = 0;
    $(`#box${col}`).css("border","2px solid black");
    displayTrial();
    $("#boutTrial").css({"display":"none"});
    $("#doPhase").css({"display":"block"});
    suite = "";
    waitForKey = true;
    console.log(`ligne: ${line}`);
    console.log(line);
  });

  ///////////////////////////////////////////////////////////////////////
    // phase suivante
    $("#boutPhase").on("click", function (ev) {
      $("#doPhase").css({"display":"none"});
      suite = "";
      phaseNum++;
      if ( phaseNum < 6 ) { // < 5
        $(`#${phaseNames[phaseNum]}`).css({"display":"block"});
        suite = phaseNames[phaseNum];
      }
      else {
        saveProtoToBase();
        $("#endStroop").css({"display":"block"});
      }
    });

///////////////////////////////////////////////////////////////////////
  $("#participant").on("change", function (ev) {
    participant = $("#participant").val();
  });

  $("#lieu").on("change", function (ev) {
    lieu = $("#lieu").val();
  });

  $("#observateur").on("change", function (ev) {
    observateur = $("#observateur").val();
  });
//////////////////////////////////////////////////
// accueil
  $("#boutPretest1").on("click", function (ev) {

    /*
    if ( !observateur || observateur.length > 15 ) {
      alert("Vérifier le nom de l'observateur");
      return;
    }

    if ( !lieu || lieu.length > 14 ) {
      alert("Vérifier le nom du lieu.");
      return;
    }
    */

    if ( condition == "X" && custom_Phase3.length == 0 ) {
      alert("Choisir un fichier pour la phase 3");
      return;
    }

    participant = $.trim(participant);
    if (  !participant ||
          participant.length > 15 ||
          !participant.match(/^(\w|_|-)+$/) ) {
      //$("#boutPretest1").blur();
      $("#participant").focus();
      alert("Vérifier l'identifiant ( caractères autorisés: alphanumérique, tiret haut et tiret bas, maximum 15 caractères)");
      return;
    }
    verifNewParticipant();
  });
  //////////////////
  $("#participant").on("blur", function (ev) {
    //verifNewParticipant();
  });
  ////////////////////////////////////////////////
  // doPretest1
  $("#boutDoPretest1").on("click", function (ev) {
    $("#Pretest1").css({"display":"none"});
    itemTab = objPretest1;
    initPhase();
  });

  // doTest1
  $("#boutDoTest1").on("click", function (ev) {
    $("#Test1").css({"display":"none"});
    itemTab = objTest1;
    initPhase();
  });

  // doPretest2
  $("#boutDoPretest2").on("click", function (ev) {
    $("#Pretest2").css({"display":"none"});
    itemTab = objPretest2;
    initPhase();
  });

  // doTest2
  $("#boutDoTest2").on("click", function (ev) {
    $("#Test2").css({"display":"none"});
    itemTab = objTest2;
    initPhase();
  });

  // doPretest3
  $("#boutDoPretest3").on("click", function (ev) {
    $("#Pretest3").css({"display":"none"});
    itemTab = objPretest3;
    initPhase();
  });

  // doTest3
  $("#boutDoTest3").on("click", function (ev) {
    $("#Test3").css({"display":"none"});
    itemTab = objTest3;
    initPhase();
  });

  ///////////////////////////////////////////////
  //
  $("#downloadProto").on("click", function (ev) { // fin passation
    location = `data.php?participant=${proto[0].participant}&literal=yes`;
  });
  ///////////////////////////////////////////////////
  //
  $("#dataAll").on("dblclick", function (ev) { // toute la table
    //location = "https://sioux.univ-paris8.fr/stroop/stroopcore/data.php";
    location = "data.php";
  });
  //////////////////////////////////////////////////
  $("#dataOne").css("left", `${String(window.innerWidth - 80)}px`);
  $("#dataOne").on("dblclick", function (ev) { // 1 identifiant
    let id = "";
    id = String(prompt("Identifiant:"));
    if ( id ) {
//      location = `https://sioux.univ-paris8.fr/stroop/stroopcore/data.php?participant=${id}`;
        location = `data.php?participant=${id}`;
    }
  });
  ///////////////////////////////////////////////////

/////////////////////////////////////////
  // gestion conditions /////////////////
    // images
  if ( condition == "EB" || condition == "ES" )
              $("#face").attr("src", condition + ".png");
  else $("#face").css("display", "none");

    // mots
  objPretest1 = buildObjTab(prePhase1);
  objPretest2 = buildObjTab(prePhase2);
  objPretest3 = buildObjTab(prePhase3);
  objTest1 = buildObjTab(classic_Phase1);
  objTest2 = buildObjTab(classic_Phase2);
  if ( condition == "C" ) objTest3 = buildObjTab(classic_Phase3);
  else if ( condition == "X" ) objTest3 = buildObjTab(custom_Phase3);
  else if ( condition == "A" ) objTest3 = buildObjTab(alcool_Phase3);
  else if ( condition == "E" || condition == "EB" || condition == "ES" ) objTest3 = buildObjTab(emotion_Phase3);
  else alert ( 'Erreur ! Condition invalide: ' + condition );
  ////////////////////////////////////////

  $("#participant").val("");
  $("#lieu").val("");
  $("#observateur").val("");

  $("#lieu").css("display", "none");
  $("#observateur").css("display", "none");

  $("#version").text(`Sébastien Poitrenaud pour LutinUserlab v${version}`);

  //$("#Pretest1").css({"display":"block"});  // DEBBUG

  // start manip
  $("#accueil").css({"display":"block"});
  $("#participant").focus();
  suite = "boutPretest1";



}); // ******************************************************  F I N   R E A D Y
//  ****************************************************************************

var phaseNames = ["Pretest1", "Test1", "Pretest2", "Test2", "Pretest3", "Test3"];

var waitForKey = false;
var itemTab;
var line;
var col;
var phaseNum = 0;

var trialTime;
var suite = "";

var proto = [];
var participant = "";
var lieu = "";
var observateur = "";

var flagAccuiel = true;

/**************************************************************************/
var classic_Phase1 = [["VERT-NOIR","JAUNE-NOIR","ROUGE-NOIR","BLEU-NOIR","JAUNE-NOIR"],
//];/*
["VERT-NOIR","ROUGE-NOIR","BLEU-NOIR","VERT-NOIR","BLEU-NOIR"],
["ROUGE-NOIR","JAUNE-NOIR","BLEU-NOIR","VERT-NOIR","ROUGE-NOIR"],["JAUNE-NOIR","JAUNE-NOIR","VERT-NOIR","BLEU-NOIR","ROUGE-NOIR"],["VERT-NOIR","JAUNE-NOIR","BLEU-NOIR","ROUGE-NOIR","ROUGE-NOIR"],["BLEU-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR","ROUGE-NOIR"],["VERT-NOIR","BLEU-NOIR","ROUGE-NOIR","VERT-NOIR","BLEU-NOIR"],["JAUNE-NOIR","JAUNE-NOIR","BLEU-NOIR","ROUGE-NOIR","VERT-NOIR"],["BLEU-NOIR","JAUNE-NOIR","VERT-NOIR","ROUGE-NOIR","BLEU-NOIR"],["VERT-NOIR","ROUGE-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR"]];
//*/
/**************************************************************************/
/**************************************************************************/
var classic_Phase2 = [["BLEU-VERT","JAUNE-BLEU","BLEU-JAUNE","ROUGE-VERT","BLEU-ROUGE"],
//];/*
["VERT-JAUNE","JAUNE-BLEU","ROUGE-BLEU","VERT-JAUNE","JAUNE-VERT"],
["VERT-ROUGE","ROUGE-BLEU","VERT-JAUNE","JAUNE-VERT","JAUNE-ROUGE"],["JAUNE-JAUNE","ROUGE-VERT","JAUNE-ROUGE","VERT-BLEU","BLEU-VERT"],["BLEU-JAUNE","ROUGE-BLEU","JAUNE-VERT","JAUNE-ROUGE","VERT-BLEU"],["ROUGE-VERT","BLEU-ROUGE","VERT-JAUNE","JAUNE-ROUGE","VERT-BLEU"],["ROUGE-VERT","JAUNE-VERT","BLEU-ROUGE","ROUGE-BLEU","VERT-BLEU"],["BLEU-VERT","VERT-ROUGE","JAUNE-JAUNE","JAUNE-VERT","JAUNE-ROUGE"],["BLEU-ROUGE","ROUGE-BLEU","ROUGE-JAUNE","JAUNE-VERT","ROUGE-BLEU"],["VERT-ROUGE","BLEU-JAUNE","ROUGE-BLEU","VERT-JAUNE","BLEU-ROUGE"]];
//*/
/**************************************************************************/
//                   P H A S E   3

/**************************************************************************/
var custom_Phase3 = [];
/**************************************************************************/
var classic_Phase3 = [];
/**************************************************************************/
var alcool_Phase3 = [["VIE-ROUGE","NOIR-JAUNE","BOUTEILLE-ROUGE","ROSE-VERT","TRISTE-BLEU"],
//];/*
["VIN-VERT","FAMILLE-BLEU","BIERE-BLEU","SOLEIL-JAUNE","VERRE-ROUGE"],["JOIE-JAUNE","WISKY-VERT","TERRASSE-ROUGE","ADDICTION-BLEU","AMOUR-JAUNE"],["COLERE-ROUGE","IVRE-BLEU","TENDRESSE-VERT","VACANCES-JAUNE","SODA-ROUGE"],["AMER-BLEU","VOYAGE-JAUNE","RHUM-VERT","CHERIR-ROUGE","SOLITUDE-BLEU"],["GIN-JAUNE","AGREABLE-BLEU","ANXIETE-ROUGE","ARGENT-JAUNE","DESSERT-VERT"],["LIQUIDE-ROUGE","SOIREE-VERT","VODKA-JAUNE","CIGARETTE-BLEU","FETE-BLEU"],["ABSENT-VERT","DESIR-JAUNE","DIGESTIF-BLEU","CAFE-ROUGE","NOURRITURE-VERT"],["AMITIE-ROUGE","LITRE-JAUNE","SOURIRE-VERT","ALCOOL-BLEU","MORT-ROUGE"],["COKTAIL-JAUNE","APERITIF-ROUGE","RIRE-BLEU","BOIRE-VERT","AFFECTION-JAUNE"]];
//*/
/**************************************************************************/
var emotion_Phase3 =
[["AFFLICTION-ROUGE","BONHEUR-JAUNE","DÉLAISSEMENT-ROUGE","EXULTATION-VERT","DÉSESPOIR-BLEU"],
//];/*
["JOIE-VERT","ESSEULÉ-BLEU","LIESSE-BLEU","ISOLEMENT-JAUNE","CONTENTEMENT-ROUGE"],
["ABATTEMENT-JAUNE","DÉLICE-VERT","MÉLANCOLIE-ROUGE","PLAISIR-BLEU","MOROSITÉ-JAUNE"],
["RÉGAL-ROUGE","NOSTALGIE-BLEU","SATISFACTION-VERT","PESSIMISME-JAUNE","VOLUPTÉ-ROUGE"],
["SANS ESPOIR-BLEU","BADINAGE-JAUNE","SPLEEN-VERT","ÉGAYER-ROUGE","TRISTESSE-BLEU"],
["ALLÉGRESSE-JAUNE","CHAGRIN-BLEU","EUPHORIE-ROUGE","ABANDON-JAUNE","HEUREUX-VERT"],
["ENNUI-ROUGE","JUBILATION-VERT","INCONSOLABLE-JAUNE","BÉNÉFIQUE-BLEU","LUGUBRE-BLEU"],
["DÉLECTATION-VERT","MAUSSADE-JAUNE","JOUISSANCE-BLEU","MORNE-ROUGE","POSITIF-VERT"],
["NAVRÉ-JAUNE","RÉJOUISSANCE-VERT","PEINE-BLEU","SENSUALITÉ-ROUGE","SENSUALITÉ-ROUGE"],
["MALHEUR-JAUNE","AMUSEMENT-ROUGE","SOLITUDE-BLEU","BONNE HUMEUR-VERT","TACITURNE-JAUNE"]];
//*/

/**************************************************************************/
var prePhase1 =[["VERT-NOIR","ROUGE-NOIR","JAUNE-NOIR","VERT-NOIR","BLEU-NOIR"]];
/**************************************************************************/
var prePhase2 = [["BLEU-JAUNE","VERT-BLEU","ROUGE-JAUNE","JAUNE-VERT","VERT-BLEU"]];
/**************************************************************************/
var prePhase3 = [["TABLE-ROUGE","RUSE-BLEU","OISEAU-JAUNE","BOIRE-VERT","AFFECTION-BLEU"]];
/**************************************************************************/

var couleurs = {};
couleurs.BLEU = "blue";
couleurs.VERT = "green";
couleurs.JAUNE = "#BABA00";
couleurs.ROUGE = "red";

var objPretest1;
var objPretest2;
var objTest1;
var objTest2;
var objTest3;
