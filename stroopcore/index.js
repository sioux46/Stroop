//index.js

var version = 0.33;
////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// F U N C T I O N S
////////////////////////////////////////////////////////////////////

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
  // if ( phaseNum == 0 || phaseNum == 1 ) return; // ignorer pretest
  var trial = {};

//  trial.observateur = observateur;
  trial.participant = participant;
  trial.condition = condition[0];
  let datetime = dateTime();
  trial.date = datetime.date;
  trial.time = datetime.time;
  trial.phase = phaseNames[phaseNum];
  trial.ligne = line + 1;
  trial.col = col + 1;
  trial.mot = $(`#word${col}`).text();
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
  if ( phaseNames[phaseNum] != "Pretest1" && phaseNames[phaseNum] != "Pretest2" )
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

// ev.keyCode === 13
////////////////////////////////////////////////  Fin F U N C T I O N S

//*********************************************************************
//*********************************************************************
// ********************************************************** R E A D Y
$(document).ready(function () {

///////////////////////////////////////////////////////////////////////
                                                    // saisie clavier
  $(document).on("keypress", function(ev) {

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
      if ( phaseNum < 5 ) { // < 5
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

  // doTest3
  $("#boutDoTest3").on("click", function (ev) {
    $("#Test3").css({"display":"none"});
    itemTab = objTest3;
    initPhase();
  });

  //
  $("#downloadProto").on("click", function (ev) {
    location = `https://sioux.univ-paris8.fr/stroop/data.php?participant=${proto[0].participant}`;
  });
  //////////////////////////////////////////////////////
  //
  $("#dataAll").on("dblclick", function (ev) {
    location = "https://sioux.univ-paris8.fr/stroop/data.php";
  });

  $("#dataOne").css("left", `${String(window.innerWidth - 80)}px`);

  $("#dataOne").on("dblclick", function (ev) {
    let id = "";
    id = String(prompt("participant"));
    if ( id ) {
      //location = `https://sioux.univ-paris8.fr/stroop/data.php?participant=${id}`;
      location = "https://sioux.univ-paris8.fr/stroop/data.php?participant=" + id;
    }
  });


/////////////////////////////////////////
  objPretest1 = buildObjTab(strPre1);
  objPretest2 = buildObjTab(strPre2);
  objTest1 = buildObjTab(strPhase1);
  objTest2 = buildObjTab(strPhase2);
  objTest3 = buildObjTab(strPhase3);

  $("#participant").val("");
  $("#lieu").val("");
  $("#observateur").val("");

  $("#lieu").css("display", "none");
  $("#observateur").css("display", "none");

  $("#version").text(`Sébastien Poitrenaud pour LutinUserlab v${version}`);

  //$("#Pretest1").css({"display":"block"});  // DEBBUG
  $("#accueil").css({"display":"block"});  // start manip
  $("#participant").focus();
  suite = "boutPretest1";



}); // ******************************************************  F I N   R E A D Y
//  ****************************************************************************

var phaseNames = ["Pretest1", "Test1", "Pretest2", "Test2", "Test3"];

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

/**************************************************************************/
var strPhase1 = [["VERT-NOIR","JAUNE-NOIR","ROUGE-NOIR","BLEU-NOIR","JAUNE-NOIR"],["VERT-NOIR","ROUGE-NOIR","BLEU-NOIR","VERT-NOIR","BLEU-NOIR"],
["ROUGE-NOIR","JAUNE-NOIR","BLEU-NOIR","VERT-NOIR","ROUGE-NOIR"],["JAUNE-NOIR","JAUNE-NOIR","VERT-NOIR","BLEU-NOIR","ROUGE-NOIR"],["VERT-NOIR","JAUNE-NOIR","BLEU-NOIR","ROUGE-NOIR","ROUGE-NOIR"],["BLEU-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR","ROUGE-NOIR"],["VERT-NOIR","BLEU-NOIR","ROUGE-NOIR","VERT-NOIR","BLEU-NOIR"],["JAUNE-NOIR","JAUNE-NOIR","BLEU-NOIR","ROUGE-NOIR","VERT-NOIR"],["BLEU-NOIR","JAUNE-NOIR","VERT-NOIR","ROUGE-NOIR","BLEU-NOIR"],["VERT-NOIR","ROUGE-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR"]];
/**************************************************************************/
/**************************************************************************/
var strPhase2 = [["BLEU-VERT","JAUNE-BLEU","BLEU-JAUNE","ROUGE-VERT","BLEU-ROUGE"],["VERT-JAUNE","JAUNE-BLEU","ROUGE-BLEU","VERT-JAUNE","JAUNE-VERT"],
["VERT-ROUGE","ROUGE-BLEU","VERT-JAUNE","JAUNE-VERT","JAUNE-ROUGE"],["JAUNE-JAUNE","ROUGE-VERT","JAUNE-ROUGE","VERT-BLEU","BLEU-VERT"],["BLEU-JAUNE","ROUGE-BLEU","JAUNE-VERT","JAUNE-ROUGE","VERT-BLEU"],["ROUGE-VERT","BLEU-ROUGE","VERT-JAUNE","JAUNE-ROUGE","VERT-BLEU"],["ROUGE-VERT","JAUNE-VERT","BLEU-ROUGE","ROUGE-BLEU","VERT-BLEU"],["BLEU-VERT","VERT-ROUGE","JAUNE-JAUNE","JAUNE-VERT","JAUNE-ROUGE"],["BLEU-ROUGE","ROUGE-BLEU","ROUGE-JAUNE","JAUNE-VERT","ROUGE-BLEU"],["VERT-ROUGE","BLEU-JAUNE","ROUGE-BLEU","VERT-JAUNE","BLEU-ROUGE"]];
/**************************************************************************/
var strPhase3 = [["VIE-ROUGE","NOIR-JAUNE","BOUTEILLE-ROUGE","ROSE-VERT","TRISTE-BLEU"],["VIN-VERT","FAMILLE-BLEU","BIERE-BLEU","SOLEIL-JAUNE","VERRE-ROUGE"],
["JOIE-JAUNE","WISKY-VERT","TERRASSE-ROUGE","ADDICTION-BLEU","AMOUR-JAUNE"],["COLERE-ROUGE","IVRE-BLEU","TENDRESSE-VERT","VACANCES-JAUNE","SODA-ROUGE"],["AMER-BLEU","VOYAGE-JAUNE","RHUM-VERT","CHERIR-ROUGE","SOLITUDE-BLEU"],["GIN-JAUNE","AGREABLE-BLEU","ANXIETE-ROUGE","ARGENT-JAUNE","DESSERT-VERT"],["LIQUIDE-ROUGE","SOIREE-VERT","VODKA-JAUNE","CIGARETTE-BLEU","FETE-BLEU"],["ABSENT-VERT","DESIR-JAUNE","DIGESTIF-BLEU","CAFE-ROUGE","NOURRITURE-VERT"],["AMITIE-ROUGE","LITRE-JAUNE","SOURIRE-VERT","ALCOOL-BLEU","MORT-ROUGE"],["COKTAIL-JAUNE","APERITIF-ROUGE","RIRE-BLEU","BOIRE-VERT","AFFECTION-JAUNE"]];
/**************************************************************************/

var strPre1 =[["VERT-NOIR","ROUGE-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR"]];
var strPre2 = [["COKTAIL-ROUGE","APERITIF-BLEU","RIRE-JAUNE","BOIRE-VERT","AFFECTION-BLEU"]];

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
