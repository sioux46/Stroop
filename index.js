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


////////////////////////////////////////////////  Fin F U N C T I O N S

//*********************************************************************
//*********************************************************************
// ********************************************************** R E A D Y
$(document).ready(function () {

  // accueil
  $("#boutPretest1").on("click", function (ev) {
    $("#accueil").css({"display":"none"});
    $("#pretest1").css({"display":"block"});
  });
  // doPretest1
  $("#boutDoPretest1").on("click", function (ev) {
    $("#pretest1").css({"display":"none"});
    $("#doPretest1").css({"display":"block"});
  });

  $("#accueil").css({"display":"block"});

}); // ******************************************************  F I N   R E A D Y
//  ****************************************************************************


var strPhase1 = [["VERT-NOIR","JAUNE-NOIR","ROUGE-NOIR","BLEU-NOIR","JAUNE-NOIR"],["VERT-NOIR","ROUGE-NOIR","BLEU-NOIR","VERT-NOIR","BLEU-NOIR"],["ROUGE-NOIR","JAUNE-NOIR","BLEU-NOIR","VERT-NOIR","ROUGE-NOIR"],["JAUNE-NOIR","JAUNE-NOIR","VERT-NOIR","BLEU-NOIR","ROUGE-NOIR"],["VERT-NOIR","JAUNE-NOIR","BLEU-NOIR","ROUGE-NOIR","ROUGE-NOIR"],["BLEU-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR","ROUGE-NOIRE"],["VERT-NOIR","BLEU-NOIR","ROUGE-NOIR","VERT-NOIR","BLEU-NOIR"],["JAUNE-NOIR","JAUNE-NOIR","BLEU-NOIR","ROUGE-NOIR","VERT-NOIR"],["BLEU-NOIR","JAUNE-NOIR","VERT-NOIR","ROUGE-NOIR","BLEU-NOIR"],["VERT-NOIR","ROUGE-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR"]];

var strPre1 =[["VERT-NOIR","ROUGE-NOIR","JAUNE-NOIR","VERT-NOIR","JAUNE-NOIR"]];
var strPre2 = [["COKTAIL-ORANGE","APERITIF-ROUGE","RIRE-BLEU","BOIRE-VERT","AFFECTION-ORANGE"]];

var objPretest1 = buildObjTab(strPre1);
var objPretest2 = buildObjTab(strPre2);
var objPhase1 = buildObjTab(strPhase1);
