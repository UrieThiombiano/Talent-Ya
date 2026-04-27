export const SECTORS = [
  { id: "agri", name: "Agriculture & Agro-business" },
  { id: "tech", name: "Tech & Numérique" },
  { id: "finance", name: "Banque & Microfinance" },
  { id: "sante", name: "Santé & ONG" },
  { id: "mines", name: "Mines & Énergie" },
  { id: "edu", name: "Éducation & Formation" },
  { id: "btp", name: "BTP & Infrastructure" },
  { id: "comm", name: "Marketing & Communication" },
  { id: "log", name: "Logistique & Transport" },
  { id: "rh", name: "RH & Administration" },
];

export const DEMO_OFFER = `Poste : Chargé(e) de projet Suivi-Évaluation
Organisation : ONG internationale basée à Ouagadougou
Secteur : Développement / Santé communautaire

Missions :
- Concevoir et déployer le système de suivi-évaluation des projets
- Élaborer les cadres logiques et indicateurs SMART
- Produire les rapports trimestriels aux bailleurs (UE, USAID)
- Renforcer les capacités des équipes terrain
- Coordonner les enquêtes de base et études d'impact

Profil :
- Bac+4/5 en sciences sociales, statistiques ou équivalent
- 3 ans d'expérience minimum en S&E sur projets ONG
- Maîtrise de KoboToolbox, SPSS ou STATA
- Français courant, anglais professionnel
- Connaissance du contexte sahélien appréciée`;

export const DEMO_CV = `AMINATA BARRY
Spécialiste Suivi-Évaluation
aminata.barry@email.com · +226 70 00 00 00 · Ouagadougou

EXPÉRIENCE
2022-2024 — Assistante S&E, Plan International, Ouagadougou
- Collecte de données terrain dans 12 villages du Sahel
- Saisie sur KoboToolbox
- Participation aux rapports projet

2020-2022 — Stagiaire, Mairie de Ouaga
- Aide au service planification
- Tableurs Excel

FORMATION
2019 — Master Sociologie, Université Joseph Ki-Zerbo
2016 — Licence Sociologie

LANGUES
Français (maternel), Mooré, Anglais (notions)

INFORMATIQUE
Word, Excel, Kobo`;

export const MODULES = [
  {
    id: "cv-afro",
    title: "Le CV qui marche en Afrique",
    desc: "Mise en forme, photo, longueur, langues — les vrais codes locaux.",
    icon: "FileText",
    duration: "8 min",
    content: [
      { h: "Format & longueur", p: "1 à 2 pages, jamais 3. Les recruteurs africains lisent vite : ils zappent au-delà. Un Bac+5 sénior peut atteindre 2 pages, un junior reste à 1." },
      { h: "Photo : oui ou non ?", p: "Au Burkina, Sénégal, Côte d'Ivoire : la photo professionnelle est ATTENDUE pour la plupart des postes. Pour les ONG internationales et le tech, elle devient optionnelle. Évitez le selfie." },
      { h: "Coordonnées complètes", p: "Téléphone (préfixe pays), e-mail pro, ville. LinkedIn si actif. Évitez les e-mails type fatou-la-belle@yahoo.fr." },
      { h: "Sections incontournables", p: "État civil léger, profil (3 lignes), expériences (chrono inverse), formation, langues (préciser : courant, professionnel, notions), compétences techniques, centres d'intérêt courts." },
      { h: "Langues locales", p: "Mooré, wolof, dioula, lingala : VALORISEZ-LES. Un recruteur local y voit un atout terrain immédiat." },
    ],
  },
  {
    id: "mots-cles",
    title: "Les mots-clés qui font passer le filtre",
    desc: "Comment cibler les ATS et le regard du recruteur en 1 lecture.",
    icon: "Target",
    duration: "6 min",
    content: [
      { h: "ATS, c'est quoi ?", p: "Les Applicant Tracking Systems filtrent les CV avant l'humain. De plus en plus de groupes (banques, télécoms, multinationales) en utilisent en Afrique. Sans les bons mots, votre CV ne sera jamais lu." },
      { h: "La règle d'or", p: "Reprenez les mots EXACTS de l'offre. Si l'offre dit 'suivi-évaluation', n'écrivez pas seulement 'M&E'. Mettez les deux." },
      { h: "Mots-clés sectoriels typiques", p: "ONG/Bailleurs : logframe, indicateurs SMART, KoboToolbox, S&E. Banque : KYC, AML, BCEAO. Tech : agile, REST, mobile money. Mines : HSE, ISO 14001." },
      { h: "Densité raisonnable", p: "5 à 10 mots-clés bien intégrés, pas une liste à la fin. Le bourrage se voit." },
      { h: "Verbes d'action", p: "Coordonné, déployé, formé, optimisé, négocié. Ils créent le mouvement et l'impact." },
    ],
  },
  {
    id: "lettre",
    title: "Lettre de motivation : la version courte gagne",
    desc: "Une page max, une histoire, une preuve.",
    icon: "Send",
    duration: "5 min",
    content: [
      { h: "Structure en 3 temps", p: "1) Pourquoi VOUS (1 paragraphe percutant). 2) Pourquoi cette ORGANISATION (montrez que vous l'avez étudiée). 3) Ce que vous APPORTEZ concrètement (1 ou 2 réalisations chiffrées)." },
      { h: "L'accroche qui tue", p: "Évitez 'Par la présente'. Préférez : 'Quand j'ai vu votre annonce, j'ai relu mes 3 ans à coordonner le déploiement de KoboToolbox dans 12 villages — c'est exactement ce que vous cherchez.'" },
      { h: "Personnalisez le destinataire", p: "Cherchez le nom du DRH ou du responsable. 'Madame, Monsieur' fonctionne, mais 'Madame Compaoré' fait mieux." },
      { h: "Erreurs locales fréquentes", p: "Trop de 'humblement', 'votre haute considération'. Soyez respectueux mais direct. Le recruteur veut un PRO, pas un solliciteur." },
      { h: "Adaptez au canal", p: "ONG : ton plaidoyer, lexique sectoriel. Multinationale : ton corporate. PME locale : ton chaleureux et pragmatique." },
    ],
  },
  {
    id: "entretien",
    title: "Réussir l'entretien — codes africains",
    desc: "Préparation, posture, questions pièges, négociation.",
    icon: "Briefcase",
    duration: "10 min",
    content: [
      { h: "La méthode STAR", p: "Pour chaque réponse comportementale : Situation, Tâche, Action, Résultat. Évitez les généralités. 'J'ai coordonné une équipe de 8 personnes pour collecter 3 200 questionnaires en 6 semaines.'" },
      { h: "Tenue", p: "Costume ou tailleur sobre pour banque/cabinet. Tenue propre et soignée pour ONG (pas costume cravate forcément). Wax élégant : oui, dans les bons contextes." },
      { h: "Question 'Parlez-moi de vous'", p: "90 secondes maximum. Présent (rôle actuel) → Passé (parcours pertinent) → Futur (pourquoi ce poste). Pas votre vie depuis l'enfance." },
      { h: "Salaire — la zone tabou", p: "Ne donnez JAMAIS le premier chiffre. Renvoyez : 'Quel est le budget prévu pour ce poste ?'. Si forcé, donnez une fourchette basée sur les grilles du secteur (ex : ONG INGO Bac+5 : 600k-1.2M FCFA selon poste)." },
      { h: "Questions à poser", p: "Toujours en avoir 2-3 prêtes. 'Quels sont les enjeux des 6 prochains mois ?' 'Comment mesurez-vous la réussite à ce poste ?'" },
    ],
  },
  {
    id: "linkedin",
    title: "LinkedIn pour candidats africains",
    desc: "Profil, réseau, contenu : se faire repérer sans se cramer.",
    icon: "Users",
    duration: "7 min",
    content: [
      { h: "Photo & bannière", p: "Photo nette, fond uni ou flouté. Bannière : skyline de votre ville, ou bannière sectorielle. Évitez la bannière par défaut." },
      { h: "Le titre, votre vitrine", p: "Pas seulement 'Étudiant à...'. Plutôt : 'Spécialiste S&E | KoboToolbox · SPSS | Cherche poste ONG Sahel'." },
      { h: "Section À propos", p: "3 paragraphes courts. Qui vous êtes, ce que vous faites, ce que vous cherchez. Mots-clés du secteur. Appel à action en bas." },
      { h: "Réseau ciblé", p: "Connectez DRH, recruteurs sectoriels, alumni de votre école. Message court de connexion : pas de copier-coller générique." },
      { h: "Open To Work", p: "Activez-le en mode discret si vous êtes en poste. Visible si vous cherchez activement." },
    ],
  },
  {
    id: "ong-bailleurs",
    title: "Décoder les offres ONG & bailleurs",
    desc: "USAID, UE, AFD, BAD : les attentes ne sont pas les mêmes.",
    icon: "GraduationCap",
    duration: "8 min",
    content: [
      { h: "Le vocabulaire bailleur", p: "Outcome ≠ output. Logframe, ToC (Theory of Change), MEAL (Monitoring, Evaluation, Accountability, Learning). Maîtrisez le lexique avant de candidater." },
      { h: "USAID", p: "Très procédural. Cherchent expérience programmes USAID antérieurs. Connaissance des Markings, Branding, ADS chapter. Anglais professionnel obligatoire." },
      { h: "UE / DUE", p: "PRAG, FED, OPSYS. Très axé conformité, audits, sauvegarde environnementale. Français suffisant souvent." },
      { h: "AFD / Expertise France", p: "Approche projet pays, dialogue avec les administrations. Bonne connaissance du contexte politique appréciée." },
      { h: "ONG locales vs INGO", p: "INGO : process, hiérarchie, salaires plus élevés. ONG locale : polyvalence, terrain, ancrage communautaire. Adaptez votre récit." },
    ],
  },
];
