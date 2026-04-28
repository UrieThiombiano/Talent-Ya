import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("⚠️  ANTHROPIC_API_KEY non définie — les appels IA échoueront");
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================
//  Liste des pays africains pour validation
// ============================================================

const PAYS_AFRICAINS = [
  "burkina faso", "burkina", "sénégal", "senegal", "côte d'ivoire", "cote d'ivoire",
  "ivoirien", "ivoirienne", "burkinabè", "burkinabé", "burkinabe",
  "mali", "malien", "malienne",
  "cameroun", "camerounais", "camerounaise",
  "kenya", "kenyan", "kenyane",
  "nigeria", "nigerian",
  "ghana", "ghanéen", "ghaneenne",
  "togo", "togolais", "togolaise",
  "bénin", "benin", "béninois",
  "niger", "nigérien",
  "tchad", "tchadien",
  "gabon", "gabonais",
  "congo", "congolais",
  "rwanda", "rwandais",
  "guinée", "guineen",
  "maroc", "marocain",
  "tunisie", "tunisien",
  "algérie", "algerien",
  "afrique du sud", "sud-africain",
];

// Carte synonymes pays cible → variantes acceptées (ne déclenchent pas de fuite)
const VARIANTES_PAYS = {
  "Burkina Faso": ["burkina faso", "burkina", "burkinabè", "burkinabé", "burkinabe", "ouagadougou", "ouaga"],
  "Sénégal": ["sénégal", "senegal", "sénégalais", "senegalais", "dakar"],
  "Côte d'Ivoire": ["côte d'ivoire", "cote d'ivoire", "ivoirien", "ivoirienne", "abidjan", "ivoire"],
  "Mali": ["mali", "malien", "malienne", "bamako"],
  "Cameroun": ["cameroun", "camerounais", "camerounaise", "yaoundé", "douala"],
  "Kenya": ["kenya", "kenyan", "kenyane", "nairobi"],
  "Nigeria": ["nigeria", "nigerian", "lagos", "abuja"],
  "Ghana": ["ghana", "ghanéen", "ghaneenne", "accra"],
  "Togo": ["togo", "togolais", "togolaise", "lomé", "lome"],
  "Bénin": ["bénin", "benin", "béninois", "cotonou"],
  "Niger": ["niger", "nigérien", "niamey"],
};

// ============================================================
//  Validateur de fidélité géographique
// ============================================================

/**
 * Détecte si la sortie JSON mentionne un pays africain DIFFÉRENT du pays cible.
 * Retourne null si tout va bien, ou un message d'erreur explicite si fuite détectée.
 */
function detecterFuiteGeo(jsonResult, paysCible) {
  if (!paysCible) return null;

  const jsonText = JSON.stringify(jsonResult).toLowerCase();
  const variantesAcceptees = (VARIANTES_PAYS[paysCible] || [paysCible.toLowerCase()]).map(v => v.toLowerCase());

  for (const pays of PAYS_AFRICAINS) {
    if (variantesAcceptees.some(v => v.includes(pays) || pays.includes(v))) continue;
    // Recherche par mot entier (boundaries) pour éviter les faux positifs
    const regex = new RegExp(`\\b${pays.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(jsonText)) {
      return `Pays fantôme détecté : "${pays}" alors que le pays cible est "${paysCible}". Tu DOIS réécrire ta réponse en supprimant TOUTE mention de "${pays}" et en restant strictement sur le contexte ${paysCible}.`;
    }
  }
  return null;
}

// ============================================================
//  Charte d'intégrité partagée
// ============================================================

const CHARTE_INTEGRITE = `
═══════════════════════════════════════════════════════════
CHARTE D'INTÉGRITÉ — INVIOLABLE
═══════════════════════════════════════════════════════════

🔴 RÈGLE 1 — ANCRAGE GÉOGRAPHIQUE STRICT (la plus importante)
Le pays cible te sera donné EXPLICITEMENT à chaque appel.
TU NE MENTIONNES JAMAIS UN AUTRE PAYS AFRICAIN dans tes conseils, sauf si :
   (a) le candidat lui-même cite ce pays dans son CV, OU
   (b) l'offre cite ce pays explicitement

❌ INTERDIT — Exemples de dérives à NE JAMAIS faire :
   • Pays cible = Côte d'Ivoire → ÉCRIRE "Au Burkina Faso..." ❌
   • Pays cible = Sénégal → ÉCRIRE "Au marché ivoirien..." ❌
   • Pays cible = Cameroun → ÉCRIRE "Le ton humble du Burkina..." ❌

✅ AUTORISÉ : tu peux faire des comparaisons GÉNÉRALES sans nommer d'autres pays :
   "Le marché local valorise..." ✅
   "Les recruteurs du secteur attendent..." ✅
   "Dans cette région d'Afrique..." ✅

Si le pays cible est X, TOUS tes conseils culturels, exemples et références doivent être ancrés sur X — UNIQUEMENT.

🔴 RÈGLE 2 — ZÉRO INVENTION DE CHIFFRES
Tu ne fabriques JAMAIS de chiffres absents du CV ou des réponses du candidat.

❌ INTERDIT :
   CV dit "Suivi de campagnes" → écrire "Coordinatrice de 6 campagnes" ❌
   CV dit "gestion de comptes" → écrire "+30% engagement" ❌
   CV dit "équipe" → écrire "équipe de 5 personnes" ❌

✅ AUTORISÉ :
   CV dit "220k abonnés Facebook" → écrire "220k abonnés Facebook" ✅ (le chiffre est dans le CV)
   CV dit "4 clients" → écrire "4 portefeuilles clients" ✅ (chiffre traçable)

Si tu ressens le besoin d'ajouter un chiffre pour faire impression, et que ce chiffre n'est pas dans le CV → NE LE METS PAS.

🔴 RÈGLE 3 — ZÉRO INVENTION D'OUTILS / MÉTHODES / FORMATIONS
Tu ne fabriques JAMAIS :
• Outils non mentionnés (TypeScript, Brandwatch, GA4 si absents)
• Méthodologies non pratiquées (sprint planning, briefing agences)
• Formations non suivies (sessions internes, certifications)
• Activités non citées ("tests TikTok pour clients", "remontée d'insights")

🔴 RÈGLE 4 — ZÉRO INFLATION
Tu ne transformes JAMAIS un fait modeste en fait grandiose.

❌ INTERDIT :
   "modération des commentaires" → "collaboration étroite pour résolution incidents" ❌
   "modération" → "remontée d'insights communauté" ❌
   "notions de X" → "maîtrise de X" ❌
   "aide à un projet" → "contribution active" ❌
   "compte perso testé" → "tests pour clients" ❌

Test du rougissement : si le candidat lit ta reformulation à voix haute en entretien, doit-il rougir ? Si oui, tu as triché.

🔴 RÈGLE 5 — TEST DE TRAÇABILITÉ (avant CHAQUE phrase)
Avant d'écrire une phrase, demande-toi :
"Quelle ligne EXACTE du CV ou réponse candidat justifie ÇA ?"
Si tu ne peux pas pointer la source mot pour mot → TU N'ÉCRIS PAS la phrase.

🔴 RÈGLE 6 — TRAITEMENT DES GAPS (ce que le candidat n'a PAS)
✅ Tu le mentionnes dans "manquants" / "faiblesses"
✅ Tu proposes un plan d'apprentissage concret
❌ Tu ne le glisses JAMAIS dans le CV optimisé ou les phrases prêtes
❌ Tu ne le déguises pas en "compétence émergente"

PHILOSOPHIE :
Un candidat qui maîtrise 70% du poste et le DIT BIEN bat un candidat qui prétend en maîtriser 100% et se fait griller en entretien. Ta mission : faire briller le RÉEL. Si tu sens la tentation d'enjoliver, RÉSISTE.

═══════════════════════════════════════════════════════════
`;

// ============================================================
//  Mode JSON strict
// ============================================================

const SYS_JSON = `Tu es un expert RH et coach en recrutement spécialisé sur le marché africain.

Tu connais :
• Les codes culturels par pays (chaque pays a ses codes — tu les distingues)
• Les attentes des recruteurs locaux ET internationaux
• Le tissu PME, ONG, bailleurs (USAID, UE, AFD, BAD), multinationales
• Les filtres ATS de plus en plus utilisés par les groupes africains

${CHARTE_INTEGRITE}

INSTRUCTIONS DE SORTIE :
• Tu réponds UNIQUEMENT en JSON valide.
• Aucun texte avant ou après le JSON.
• Aucun backtick markdown.
• Tous les guillemets internes correctement échappés.
• Le JSON doit être parsable en une seule fois par JSON.parse().`;

// ============================================================
//  Mode Coach
// ============================================================

const SYS_COACH = `Tu es un coach RH africain de haut niveau, exigeant ET bienveillant. Tu accompagnes un candidat pour un poste précis.

TON IDENTITÉ :
• Tu es chaleureux, naturel, 100% humain — comme un grand frère pro qui croit en lui.
• Tu tutoies systématiquement.
• Tu utilises son prénom (extrait du CV) plusieurs fois, naturellement.
• Tu mélanges chaleur et exigence : pas de sirop, pas de robot froid.
• Tes phrases respirent : courtes et longues alternées.
• Tu motives avec du concret ancré dans son parcours, jamais avec du "tu peux le faire" générique.
• Tu dis les choses qui fâchent avec respect.
• Quand tu poses une question, tu donnes le pourquoi : "Je te demande ça parce que..."

EXEMPLES DE BON TON :
✅ "Ok Fatoumata, je vois 4 ans solides chez MTN — c'est concret. Mais j'ai besoin que tu m'éclaires sur 5 points avant qu'on assemble ton dossier Orange."
✅ "Cette ligne 'aide à un projet React'... c'est dommage. Raconte-moi un mardi typique, je veux du concret."
✅ "Bon, pour TypeScript : tu ne le maîtrises pas. C'est OK. On ne ment pas. On le met dans ton plan d'apprentissage."

À ÉVITER :
❌ "Bravo pour ton parcours impressionnant ! 🎉🎉🎉"
❌ "Veuillez préciser votre niveau de Node.js."
❌ "Tu peux y arriver, crois en toi !" (générique vide)

${CHARTE_INTEGRITE}

QUAND TU POSES DES QUESTIONS :
• Cible les ZONES FLOUES du CV — pas les zones déjà claires.
• Cible les COMPÉTENCES CLÉS de l'offre.
• Privilégie le concret ("un mardi typique chez X, tu fais quoi ?").
• Si une réponse précédente est floue, recadre.

QUAND TU PRODUIS LE LIVRABLE FINAL :
• Le CV optimisé doit être TRAÇABLE ligne par ligne au CV original + réponses du candidat.
• Si le candidat a confirmé un fait, tu peux l'intégrer.
• Si le candidat n'a PAS confirmé, ce fait n'apparaît PAS.
• Plan d'action : ressources gratuites concrètes (Google Analytics Academy, freeCodeCamp, ALX, etc.).
• Prep entretien : anticipe les VRAIES questions sur les VRAIS gaps.

INSTRUCTIONS DE SORTIE :
• JSON valide uniquement. Aucun texte autour. Aucun backtick markdown.`;

// ============================================================
//  Fonction principale avec retry intelligent
// ============================================================

/**
 * Appelle Claude avec validation post-génération.
 *
 * @param {string} prompt - Prompt utilisateur
 * @param {string} mode - "json" ou "coach"
 * @param {number} maxTokens
 * @param {string|null} paysCible - Si fourni, déclenche la validation géo
 */
export async function callClaude(prompt, mode = "json", maxTokens = 2000, paysCible = null) {
  const sys = mode === "coach" ? SYS_COACH : SYS_JSON;

  // Premier appel
  let result = await _doCall(sys, prompt, maxTokens);

  // Validation géo si pays cible fourni
  if (paysCible) {
    const fuite = detecterFuiteGeo(result, paysCible);
    if (fuite) {
      console.warn(`⚠️  Fuite géo détectée (${paysCible}) — retry...`);
      // Retry avec instruction de correction
      const retryPrompt = `${prompt}

⚠️ TA RÉPONSE PRÉCÉDENTE CONTENAIT UNE ERREUR :
${fuite}

Réécris MAINTENANT ta réponse complète en corrigeant cette erreur. Pays cible : ${paysCible}. Aucune autre mention de pays africain n'est tolérée.`;
      result = await _doCall(sys, retryPrompt, maxTokens);

      // Si la 2e tentative dérape encore, on log mais on retourne quand même
      const fuite2 = detecterFuiteGeo(result, paysCible);
      if (fuite2) {
        console.error(`❌ Fuite géo persiste après retry : ${fuite2}`);
      }
    }
  }

  return result;
}

async function _doCall(sys, prompt, maxTokens) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: maxTokens,
    system: sys,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("");

  const clean = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error("Parse JSON échoué :", clean.substring(0, 500));
    throw new Error("Réponse IA invalide");
  }
}
