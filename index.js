//index.js


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

/* sauve proto sur bd
function MODEL_AJAX(data, url) {
$.ajax({
  'url': url,
  'data': { 'data':theData },
  'complete': function(xhr, result) {
    //
    if (result != 'success') {
      //
    }
    else {
      var reponse = xhr.responseText;
      if (reponse != 'OK') {
        //
      }
      else {
        //
      }
    }
  }
});
}*/

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

// sauve proto sur bd
function saveProtToBase() {
  var waitingCycles = proto;
  if ( waitingCycles.length ) {
    $.ajax({
      'url': 'connectMySQL.php',
      'type': 'post',
      'complete': function(xhr, result) {
        if (result != 'success') {
        //  modalAlert ( 'Network failure. Waiting cycle not saved.', 'Drumy error!');
        }
        else {
          var reponse = xhr.responseText;

          $.ajax({
            'url': 'ajaxSave.php',
            'type': 'post',
            'data': { data: JSON.stringify(waitingCycles.shift()) },
            'complete': function(xhr, result) {
              if (result != 'success') {
                modalAlert ( 'Erreur réseau. Protocole non sauvé.', 'Stroop error!');
              }
              else {
                var reponse = xhr.responseText;
              }
            }
          }); // fin ajax 2
        }
      }
    });// fin ajax 1
  }
}

//
function writeTrialToProto() {
  // if ( phaseNum == 0 || phaseNum == 1 ) return; // ignorer pretest
  var trial = {};

  trial.observateur = observateur;
  trial.participant = participant;
  trial.lieu = lieu;
  let datetime = dateTime();
  trial.date = datetime.date;
  trial.time = datetime.time;
  trial.phase = phaseNames[phaseNum];
  trial.ligne = line;
  trial.col = col;
  trial.mot = $(`#word${col}`).text();
  trial.couleur = itemTab[line][col].couleur;
  trial.rep = $(`#box${col}`).text();
  trial.timeRep = 0;

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
}

//
function initPhase() {
  var phase = phaseNames[phaseNum];
  line = 0;
  col = 0;
  $(`#box${col}`).css("border","2px solid black");
  displayTrial();
  $("#boutTrial").css({"display":"none"});
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
    if ( !waitForKey ) return;

    waitForKey = false;
    writeTrialToProto();

    $(`#box${col}`).text((ev.originalEvent.key).toUpperCase());
    $(`#box${col}`).css("border","2px solid white");
    if ( col < 4 ) $(`#box${col+1}`).css("border","2px solid black");
    if ( col == 4 ) {
      /*                                        À REMETTRE ÀPRES DEBBUG
      if ( phaseNames[phaseNum] == "pretest1" &&
              !goodCharAnswers() ) {  // erreur pretest1
        alert("Vous avez fait une erreur. On recommence.");
        initPhase();
        return;
      }
      if ( phaseNames[phaseNum] == "pretest2" &&
              !goodColorAnswers() ) {  // erreur pretest2
        alert("Vous avez fait une erreur. On recommence.");
        initPhase();
        return;
      }
      */
      if ( line < itemTab.length - 1 ) $("#boutTrial").css({"display":"block"});
      else $("#boutPhase").css({"display":"block"});
      return;
    }
    col++;
    echo = true;
    waitForKey = true;
  });

///////////////////////////////////////////////////////////////////////
  // phase suivante
  $("#boutPhase").on("click", function (ev) {
    $("#doPhase").css({"display":"none"});
    phaseNum++;
    $(`#${phaseNames[phaseNum]}`).css({"display":"block"});
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
    waitForKey = true;
    console.log(`ligne: ${line}`);
    console.log(line);
  });
///////////////////////////////////////////////////////////////////////
  // accueil
  $("#boutPretest1").on("click", function (ev) {
    $("#accueil").css({"display":"none"});
    $("#pretest1").css({"display":"block"});
  });

  // doPretest1
  $("#boutDoPretest1").on("click", function (ev) {
    $("#pretest1").css({"display":"none"});
    itemTab = objPretest1;
    initPhase();
  });

  // doTest1
  $("#boutDoTest1").on("click", function (ev) {
    $("#test1").css({"display":"none"});
    itemTab = objTest1;
    initPhase();
  });

  // doPretest2
  $("#boutDoPretest2").on("click", function (ev) {
    $("#pretest2").css({"display":"none"});
    itemTab = objPretest2;
    initPhase();
  });

  // doTest2
  $("#boutDoTest2").on("click", function (ev) {
    $("#test2").css({"display":"none"});
    itemTab = objTest2;
    initPhase();
  });

  // doTest3
  $("#boutDoTest3").on("click", function (ev) {
    $("#test3").css({"display":"none"});
    itemTab = objTest3;
    initPhase();
  });


/////////////////////////////////////////
  objPretest1 = buildObjTab(strPre1);
  objPretest2 = buildObjTab(strPre2);
  objTest1 = buildObjTab(strPhase1);
  objTest2 = buildObjTab(strPhase2);
  objTest3 = buildObjTab(strPhase3);

  $("#accueil").css({"display":"block"});

}); // ******************************************************  F I N   R E A D Y
//  ****************************************************************************

var phaseNames = ["pretest1", "test1", "pretest2", "test2", "test3"];

var waitForKey = false;
var phaseNum;
var itemTab;
var line;
var col;
var phaseNum = 0;

var proto = [];
var participant = "";
var lieu = "";
var observateur = "";


var strPhase1 = [["VERT-NOIR","JAUNE-NOIR","ROUGE-NOIR","BLEU-NOIR","JAUNE-NOIR"],["VERT-NOIR","ROUGE-NOIR","BLEU-NOIR","VERT-NOIR","BLEU-NOIR"]];
/*
,["ROUGE-NOIR","JAUNE-NOIR","BLEU-NOIR","VERT-NOIR","ROUGE-NOIR"],["JAUNE-NOIR","JAUNE-NOIR","VERT-NOIR","BLEU-NOIR","ROUGE-NOIR"],["VERT-NOIR","JAUNE-NOIR","BLEU-NOIR","ROUGE-NOIR","ROUGE-NOIR"],["BLEU-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR","ROUGE-NOIRE"],["VERT-NOIR","BLEU-NOIR","ROUGE-NOIR","VERT-NOIR","BLEU-NOIR"],["JAUNE-NOIR","JAUNE-NOIR","BLEU-NOIR","ROUGE-NOIR","VERT-NOIR"],["BLEU-NOIR","JAUNE-NOIR","VERT-NOIR","ROUGE-NOIR","BLEU-NOIR"],["VERT-NOIR","ROUGE-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR"]];
*/
var couleurs = {};
couleurs.BLEU = "blue";
couleurs.VERT = "green";
couleurs.JAUNE = "#BABA00";
couleurs.ROUGE = "red";

var strPhase2 = [["BLEU-VERT","JAUNE-BLEU","BLEU-JAUNE","ROUGE-VERT","BLEU-ROUGE"],["VERT-JAUNE","JAUNE-BLEU","ROUGE-BLEU","VERT-JAUNE","JAUNE-VERT"]];
/*
,["VERT-ROUGE","ROUGE-BLEU","VERT-JAUNE","JAUNE-VERT","JAUNE-ROUGE"],["JAUNE-JAUNE","ROUGE-VERT","JAUNE-ROUGE","VERT-BLEU","BLEU-VERT"],["BLEU-JAUNE","ROUGE-BLEU","JAUNE-VERT","JAUNE-ROUGE","VERT-BLEU"],["ROUGE-VERT","BLEU-ROUGE","VERT-JAUNE","JAUNE-ROUGE","VERT-BLEU"],["ROUGE-VERT","JAUNE-VERT","BLEU-ROUGE","ROUGE-BLEU","VERT-BLEU"],["BLEU-VERT","VERT-ROUGE","JAUNE-JAUNE","JAUNE-VERT","JAUNE-ROUGE"],["BLEU-ROUGE","ROUGE-BLEU","ROUGE-JAUNE","JAUNE-VERT","ROUGE-BLEU"],["VERT-ROUGE","BLEU-JAUNE","ROUGE-BLEU","VERT-JAUNE","BLEU-ROUGE"]];*/

var strPhase3 = [["VIE-ROUGE","NOIR-JAUNE","BOUTEILLE-ROUGE","ROSE-VERT","TRISTE-BLEU"],["VIN-VERT","FAMILLE-BLEU","BIERE-BLEU","SOLEIL-JAUNE","VERRE-ROUGE"]];
/*
,["JOIE-JAUNE","WISKY-VERT","TERRASSE-ROUGE","ADDICTION-BLEU","AMOUR-JAUNE"],["COLERE-ROUGE","IVRE-BLEU","TENDRESSE-VERT","VACANCES-JAUNE","SODA-ROUGE"],["AMER-BLEU","VOYAGE-JAUNE","RHUM-VERT","CHERIR-ROUGE","SOLITUDE-BLEU"],["GIN-JAUNE","AGREABLE-BLEU","ANXIETE-ROUGE","ARGENT-JAUNE","DESSERT-VERT"],["LIQUIDE-ROUGE","SOIREE-VERT","VODKA-JAUNE","CIGARETTE-BLEU","FETE-BLEU"],["ABSENT-VERT","DESIR-JAUNE","DIGESTIF-BLEU","CAFE-ROUGE","NOURRITURE-VERT"],["AMITIE-ROUGE","LITRE-JAUNE","SOURIRE-VERT","ALCOOL-BLEU","MORT-ROUGE"],["COKTAIL-JAUNE","APERITIF-ROUGE","RIRE-BLEU","BOIRE-VERT","AFFECTION-JAUNE"]];*/

var strPre1 =[["VERT-NOIR","ROUGE-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR"]];
var strPre2 = [["COKTAIL-ROUGE","APERITIF-BLEU","RIRE-JAUNE","BOIRE-VERT","AFFECTION-BLEU"]];

var objPretest1;
var objPretest2;
var objTest1;
var objTest2;
var objTest3;
