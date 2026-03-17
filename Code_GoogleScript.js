// Code à copier dans Extensions > Apps Script de votre Google Sheet
// Puis déployer en tant qu'application web (execute as me, access: anyone)

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet;
  var data = JSON.parse(e.postData.contents);

  // SÉLECTION DE LA FEUILLE EN FONCTION DE LA FAMILLE
  // Les valeurs reçues du formulaire sont "sudry" et "lumbroso"
  if (data.famille === "sudry") {
    sheet = ss.getSheetByName("Famille Bitton");
  } else if (data.famille === "lumbroso") {
    sheet = ss.getSheetByName("Famille Anidjar");
  }

  // Fallback : Si la feuille n'existe pas ou famille non spécifiée, on prend la feuille active par défaut
  if (!sheet) {
    sheet = ss.getActiveSheet();
  }
  
  // Formatage de la date locale (utile si vous voulez l'ajouter ailleurs, mais retirée du message)
  var date = new Date();
  var dateStr = Utilities.formatDate(date, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
  
  // Ajout de la ligne correspondant aux colonnes : 
  // A: Nom Prenom | B: présence | C: nombre de personne | D: total | E: message pour les marier
  
  var nomComplet = data.nom + " " + data.prenom; 
  var messageSimple = data.message; // Juste le message, sans la date

  sheet.appendRow([
    nomComplet,        // Col A : Nom Prenom
    data.presence,     // Col B : présence
    data.nombre,       // Col C : nombre de personne
    "",                // Col D : total (Laissé vide)
    messageSimple      // Col E : message uniquement
  ]);
  
  // Retourne une réponse JSON (nécessaire même si ignored par le client en no-cors)
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

