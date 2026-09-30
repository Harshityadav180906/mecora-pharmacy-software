export interface AIMedicineInfo {
  name: string;
  salt: string;
  category: string;
  primaryUses: string[];
  causesAndConditions: string[];
  dosageAdvice: string;
  precautions: string[];
  sideEffects: string[];
  aiClinicalTip: string;
  substitutes: string[];
}

export function predictMedicineDetails(medicineName: string): AIMedicineInfo {
  const nameLower = medicineName.toLowerCase();

  if (nameLower.includes('pan') || nameLower.includes('pantoprazole')) {
    return {
      name: medicineName,
      salt: 'Pantoprazole Sodium (40mg)',
      category: 'Proton Pump Inhibitor (PPI) / Antacid',
      primaryUses: ['Gastric Acidity & Heartburn', 'Gastroesophageal Reflux Disease (GERD)', 'Peptic & Duodenal Ulcers', 'Zollinger-Ellison Syndrome'],
      causesAndConditions: ['Excess stomach acid production', 'Pain during swallowing & acid reflux', 'Stomach mucosal irritation caused by painkillers/NSAIDs'],
      dosageAdvice: 'Take 1 tablet daily in the morning, 30-60 minutes BEFORE breakfast with plain water. Swallow whole without crushing.',
      precautions: ['Do not crush or chew enteric-coated tablets', 'Avoid alcohol and spicy food during treatment', 'Consult doctor if symptoms persist over 14 days'],
      sideEffects: ['Mild headache', 'Diarrhea or constipation', 'Nausea / abdominal fullness'],
      aiClinicalTip: 'Recommended to co-prescribe with NSAIDs (like Ibuprofen/Diclofenac) to prevent drug-induced gastric irritation.',
      substitutes: ['Pan-D', 'Pantocid 40', 'Pantodac 40', 'Rabeprazole 20mg'],
    };
  }

  if (nameLower.includes('taxim') || nameLower.includes('cefixime')) {
    return {
      name: medicineName,
      salt: 'Cefixime Trihydrate (200mg)',
      category: '3rd Generation Cephalosporin Antibiotic',
      primaryUses: ['Typhoid Fever', 'Urinary Tract Infections (UTI)', 'Respiratory Tract Infections (Bronchitis/Pneumonia)', 'Tonsillitis & Sinusitis'],
      causesAndConditions: ['Susceptible Gram-negative & Gram-positive bacterial pathogens', 'Persistent fever and throat infection'],
      dosageAdvice: 'Take 1 tablet twice daily (every 12 hours) after food. Complete the full 5 to 7 days prescribed course even if symptoms subside.',
      precautions: ['Complete full antibiotic course to avoid antimicrobial resistance', 'Safe in penicillin allergy (unless severe)', 'Stay well-hydrated'],
      sideEffects: ['Loose stools / mild diarrhea', 'Stomach discomfort', 'Flatulence'],
      aiClinicalTip: 'Often combined with Ofloxacin (Cefixime + Ofloxacin) for resistant enteric typhoid cases.',
      substitutes: ['Zifi 200', 'Mahacef 200', 'Cefspan 200', 'Omnicef'],
    };
  }

  if (nameLower.includes('dox') || nameLower.includes('doxycycline')) {
    return {
      name: medicineName,
      salt: 'Doxycycline Hyclate (100mg)',
      category: 'Tetracycline Broad-Spectrum Antibiotic',
      primaryUses: ['Severe Acne Vulgaris', 'Chlamydia & STD Infections', 'Tick-Borne / Rickettsial Fever', 'Skin & Soft Tissue Infections'],
      causesAndConditions: ['Bacterial proliferation in skin pores (Cutibacterium acnes)', 'Respiratory & atypical chest infections'],
      dosageAdvice: 'Take 1 capsule twice daily with a FULL glass of water. Remain upright (do NOT lie down) for at least 30 minutes to prevent esophageal ulceration.',
      precautions: ['Do not take with milk, dairy, iron, or antacids (reduces absorption by 50%)', 'Increases photosensitivity: use sunscreen'],
      sideEffects: ['Sun sensitivity / sunburn', 'Nausea if taken on empty stomach', 'Tooth discoloration in children under 8'],
      aiClinicalTip: 'Strictly advice patient to drink 250ml water and avoid lying down for 30 mins after taking this capsule.',
      substitutes: ['Doxicip 100', 'Microdox-LBX', 'Doxt-SL', 'Minocycline 50mg'],
    };
  }

  if (nameLower.includes('flagyl') || nameLower.includes('metronidazole')) {
    return {
      name: medicineName,
      salt: 'Metronidazole (400mg)',
      category: 'Nitroimidazole Amebicide & Antiprotozoal',
      primaryUses: ['Amebic Dysentery & Diarrhea', 'Dental & Gum Infections', 'Bacterial Vaginosis / Trichomoniasis', 'Anaerobic Abdominal Infections'],
      causesAndConditions: ['Entamoeba histolytica parasitic infection', 'Anaerobic bacteria in gums, root canals, or GI tract'],
      dosageAdvice: 'Take 1 tablet three times daily after meals for 5 to 7 days as prescribed.',
      precautions: ['ABSOLUTELY NO ALCOHOL for 48 hours after treatment (causes severe disulfiram-like violent vomiting and flushing)'],
      sideEffects: ['Metallic taste in mouth', 'Darkened/reddish-brown urine (harmless)', 'Mild nausea'],
      aiClinicalTip: 'Often combined with Norfloxacin or Ciprofloxacin for acute infectious loose motions (Metrogyl-O / Norflox-TZ).',
      substitutes: ['Metrogyl 400', 'Aldazole', 'Flagyl 200', 'Tinidazole 500mg'],
    };
  }

  if (nameLower.includes('ciplox') || nameLower.includes('ciprofloxacin')) {
    return {
      name: medicineName,
      salt: 'Ciprofloxacin Hydrochloride (500mg)',
      category: 'Fluoroquinolone Antibacterial',
      primaryUses: ['Severe Diarrhea / Food Poisoning', 'Urinary Tract Infections (UTI)', 'Bone & Joint Infections', 'Infectious Eye/Ear Drops'],
      causesAndConditions: ['E. coli, Salmonella, Shigella, and Pseudomonas bacterial infections'],
      dosageAdvice: 'Take 1 tablet every 12 hours with water. Avoid calcium or milk products within 2 hours of dosage.',
      precautions: ['Drink at least 2-3 liters of water daily to prevent crystalluria', 'Report immediate tendon pain or swelling'],
      sideEffects: ['Nausea', 'Mild insomnia or nervousness', 'Tendon sensitivity in athletes'],
      aiClinicalTip: 'Ensure patient avoids dairy/calcium supplements around the dose timing.',
      substitutes: ['Cifran 500', 'Ciprobid 500', 'Zoxan 500', 'Ofloxacin 400mg'],
    };
  }

  if (nameLower.includes('brufen') || nameLower.includes('ibuprofen')) {
    return {
      name: medicineName,
      salt: 'Ibuprofen (400mg)',
      category: 'Non-Steroidal Anti-Inflammatory Drug (NSAID)',
      primaryUses: ['Headache & Migraine Pain', 'Dental & Toothache Pain', 'Arthritis & Joint Inflammation', 'Period / Dysmenorrhea Pain'],
      causesAndConditions: ['Inhibition of COX-1 and COX-2 enzymes reducing inflammatory prostaglandin synthesis'],
      dosageAdvice: 'Take 1 tablet 2-3 times daily strictly AFTER food or milk to prevent stomach pain.',
      precautions: ['Do not take on empty stomach', 'Avoid if patient has active peptic ulcer or kidney impairment', 'Limit duration to minimum effective days'],
      sideEffects: ['Stomach burning / acidity', 'Mild nausea', 'Dizziness'],
      aiClinicalTip: 'Combine with Paracetamol (Combiflam: Ibuprofen + Paracetamol) for synergistic pain relief.',
      substitutes: ['Combiflam', 'Ibugesic Plus', 'Brufen 200', 'Naproxen 250mg'],
    };
  }

  if (nameLower.includes('mox') || nameLower.includes('amoxicillin')) {
    return {
      name: medicineName,
      salt: 'Amoxicillin Trihydrate (500mg)',
      category: 'Broad-Spectrum Penicillin Antibiotic',
      primaryUses: ['Throat Infection (Pharyngitis/Tonsillitis)', 'Ear & Sinus Infection (Otitis Media)', 'Dental Abscess', 'Chest Infection'],
      causesAndConditions: ['Streptococcus, H. influenzae, and susceptible bacterial pathogens'],
      dosageAdvice: 'Take 1 capsule every 8 hours (3 times daily) with or without food. Complete entire course.',
      precautions: ['Verify patient has NO allergy to penicillin / ampicillin group of drugs', 'Complete 5-day cycle'],
      sideEffects: ['Skin rash (if allergic)', 'Mild diarrhea', 'Nausea'],
      aiClinicalTip: 'For beta-lactamase producing resistant bacteria, suggest Amoxicillin + Clavulanic Acid (Augmentin / Moxikind-CV).',
      substitutes: ['Novamox 500', 'Moxikind 500', 'Augmentin 625', 'Ampicillin 500mg'],
    };
  }

  if (nameLower.includes('azee') || nameLower.includes('azithromycin')) {
    return {
      name: medicineName,
      salt: 'Azithromycin Dihydrate (500mg)',
      category: 'Macrolide Antibiotic (3-Day / 5-Day Course)',
      primaryUses: ['Throat Infection & Sore Throat', 'Community Acquired Pneumonia', 'Skin Infections', 'Typhoid (Second Line)'],
      causesAndConditions: ['Intracellular bacterial infection targeting 50S ribosomal subunit'],
      dosageAdvice: 'Take 1 tablet once daily at the SAME time for 3 or 5 days, 1 hour before or 2 hours after a meal.',
      precautions: ['Maintain exact daily timing', 'Caution in patients with cardiac arrhythmia / QT prolongation'],
      sideEffects: ['Mild abdominal cramps', 'Nausea', 'Headache'],
      aiClinicalTip: 'Popular for fast 3-day compliance in acute upper respiratory tract infections.',
      substitutes: ['Azy 500', 'Azithral 500', 'Zithrox 500', 'Clarithromycin 500mg'],
    };
  }

  if (nameLower.includes('dolo') || nameLower.includes('paracetamol') || nameLower.includes('calpol')) {
    return {
      name: medicineName,
      salt: 'Paracetamol / Acetaminophen (650mg)',
      category: 'Antipyretic (Fever Reducer) & Mild Analgesic',
      primaryUses: ['High Fever & Viral Infections', 'Body Ache & Headache', 'Post-Vaccination Fever', 'Mild Musculoskeletal Pain'],
      causesAndConditions: ['Pyrogenic fever elevation, body fatigue, seasonal influenza, dengue/chikungunya pain management'],
      dosageAdvice: 'Take 1 tablet every 6 to 8 hours as needed for fever. Maximum 4000mg (4 grams) per 24 hours.',
      precautions: ['Do not exceed 4g/day to avoid acute liver toxicity', 'Avoid concurrent alcohol intake', 'Check other cold medicines for hidden paracetamol'],
      sideEffects: ['Very well tolerated; rare allergic rash in hypersensitive individuals'],
      aiClinicalTip: 'Safe first-line analgesic during pregnancy and dengue fever (where NSAIDs like Aspirin/Ibuprofen are contraindicated).',
      substitutes: ['Calpol 650', 'Crocin 650', 'Pacimol 650', 'Sumo-L 650'],
    };
  }

  if (nameLower.includes('montair') || nameLower.includes('montelukast')) {
    return {
      name: medicineName,
      salt: 'Montelukast Sodium (10mg) + Levocetirizine (5mg)',
      category: 'Leukotriene Receptor Antagonist + Antihistaminic',
      primaryUses: ['Allergic Rhinitis (Sneezing, Runny Nose)', 'Seasonal Pollen Allergies', 'Asthma Maintenance', 'Skin Hives / Urticaria'],
      causesAndConditions: ['Histamine H1 and cysteinyl leukotriene inflammatory pathway activation during seasonal change'],
      dosageAdvice: 'Take 1 tablet ONCE daily at NIGHT before bed, as it can cause mild drowsiness.',
      precautions: ['May cause mild daytime sedation', 'Avoid driving or operating machinery immediately after dose'],
      sideEffects: ['Drowsiness / sleepiness', 'Dry mouth', 'Headache'],
      aiClinicalTip: 'Nighttime administration is best to ensure peak antihistamine coverage during early morning allergy spikes.',
      substitutes: ['Montek-LC', 'Telekast-L', 'Levocet-M', 'Bilastine + Montelukast'],
    };
  }

  if (nameLower.includes('telma') || nameLower.includes('telmisartan')) {
    return {
      name: medicineName,
      salt: 'Telmisartan (40mg)',
      category: 'Angiotensin II Receptor Blocker (ARB) / Antihypertensive',
      primaryUses: ['Essential Hypertension (High Blood Pressure)', 'Cardiovascular Risk Reduction', 'Diabetic Nephropathy Protection'],
      causesAndConditions: ['Vascular constriction and elevated systemic blood pressure'],
      dosageAdvice: 'Take 1 tablet ONCE daily at the exact same time every morning with or without food. Do not skip days.',
      precautions: ['Do not stop abruptly without doctor consultation', 'Monitor potassium levels and kidney function periodically'],
      sideEffects: ['Mild dizziness when standing up', 'Fatigue', 'Sinus congestion'],
      aiClinicalTip: 'Long 24-hour half-life provides excellent morning blood pressure surge protection.',
      substitutes: ['Telmikind 40', 'Telpres 40', 'Arbitel 40', 'Losartan 50mg'],
    };
  }

  if (nameLower.includes('vicks') || nameLower.includes('inhaler') || nameLower.includes('nasal')) {
    return {
      name: medicineName,
      salt: 'Menthol, Camphor, Eucalyptus Oil',
      category: 'Nasal Decongestant / Topical Inhalant',
      primaryUses: ['Nasal congestion', 'blocked nose', 'cold/flu', 'sinusitis'],
      causesAndConditions: ['Mucosal swelling from viral upper respiratory infection'],
      dosageAdvice: 'Inhale through each nostril 2-3 times, repeat every 2 hours as needed',
      precautions: ['External use only', 'do not ingest', 'not for children under 6'],
      sideEffects: ['Mild nasal irritation', 'sneezing'],
      aiClinicalTip: 'Temporary relief only - for persistent congestion recommend oral decongestant',
      substitutes: ['Otrivin Nasal Spray', 'Nasivion', 'Sinarest Nasal Drops'],
    };
  }

  if (nameLower.includes('cetiri') || nameLower.includes('cetzine') || nameLower.includes('zyrtec') || nameLower.includes('allerg')) {
    return {
      name: medicineName,
      salt: 'Cetirizine Hydrochloride (10mg)',
      category: 'Second-Generation Antihistamine',
      primaryUses: ['Allergic rhinitis', 'hay fever', 'urticaria/hives', 'itchy watery eyes'],
      causesAndConditions: ['Histamine H1 receptor mediated allergic response'],
      dosageAdvice: '1 tablet once daily, preferably at night',
      precautions: ['May cause drowsiness', 'avoid alcohol'],
      sideEffects: ['Drowsiness', 'dry mouth', 'fatigue'],
      aiClinicalTip: 'Less sedating than first-gen antihistamines but still advise caution with driving',
      substitutes: ['Alerid 10', 'Okacet', 'Levocet 5mg', 'Fexofenadine 120mg'],
    };
  }

  if (nameLower.includes('omeprazole') || nameLower.includes('omez')) {
    return {
      name: medicineName,
      salt: 'Omeprazole (20mg)',
      category: 'Proton Pump Inhibitor (PPI)',
      primaryUses: ['Acid reflux', 'GERD', 'peptic ulcers', 'H. pylori eradication'],
      causesAndConditions: ['Excess gastric acid secretion'],
      dosageAdvice: '1 capsule daily before breakfast, swallow whole',
      precautions: ['Long-term use may affect calcium/magnesium absorption'],
      sideEffects: ['Headache', 'nausea', 'flatulence'],
      aiClinicalTip: 'For H. pylori, combine with Amoxicillin + Clarithromycin (triple therapy)',
      substitutes: ['Omez 20', 'Ocid 20', 'Pantoprazole 40mg', 'Esomeprazole 40mg'],
    };
  }

  if (nameLower.includes('diclofenac') || nameLower.includes('voveran') || nameLower.includes('voltaren')) {
    return {
      name: medicineName,
      salt: 'Diclofenac Sodium (50mg)',
      category: 'NSAID / Anti-inflammatory Analgesic',
      primaryUses: ['Severe joint pain', 'back pain', 'post-surgical pain', 'sports injuries'],
      causesAndConditions: ['COX-2 mediated inflammation and prostaglandin synthesis'],
      dosageAdvice: '1 tablet 2-3 times daily after food',
      precautions: ['Contraindicated in heart disease', 'avoid with aspirin'],
      sideEffects: ['Stomach pain', 'nausea', 'elevated liver enzymes'],
      aiClinicalTip: 'Always co-prescribe a PPI (Pantoprazole) to prevent gastric erosion',
      substitutes: ['Voveran SR 100', 'Reactin', 'Diclomax', 'Aceclofenac 100mg'],
    };
  }

  if (nameLower.includes('ors') || nameLower.includes('electral') || nameLower.includes('electrolyte')) {
    return {
      name: medicineName,
      salt: 'Sodium Chloride, Potassium Chloride, Sodium Citrate, Dextrose',
      category: 'Oral Rehydration Salt / Electrolyte Replacement',
      primaryUses: ['Dehydration from diarrhea', 'vomiting', 'heat stroke', 'post-exercise'],
      causesAndConditions: ['Electrolyte imbalance and fluid loss'],
      dosageAdvice: 'Dissolve 1 sachet in 1 liter of clean drinking water. Sip frequently.',
      precautions: ['Prepare fresh solution every 24 hours', 'discard unused portion'],
      sideEffects: ['None when used as directed'],
      aiClinicalTip: 'WHO-recommended first-line treatment for acute watery diarrhea dehydration',
      substitutes: ['Electrobion', 'Enerzal', 'Pedialyte', 'Glucon-D ORS'],
    };
  }

  if (nameLower.includes('betadine') || nameLower.includes('povidone') || nameLower.includes('iodine')) {
    return {
      name: medicineName,
      salt: 'Povidone-Iodine (5% / 10%)',
      category: 'Topical Antiseptic / Germicide',
      primaryUses: ['Wound disinfection', 'surgical site preparation', 'skin infections', 'gargle for sore throat'],
      causesAndConditions: ['Prevention of bacterial, viral, and fungal wound contamination'],
      dosageAdvice: 'Apply undiluted to wound with cotton; for gargle dilute 1:10 with water',
      precautions: ['Avoid in iodine/shellfish allergy', 'not for deep puncture wounds'],
      sideEffects: ['Local staining', 'mild skin irritation'],
      aiClinicalTip: 'Use gargle formulation (not surgical scrub) for pharyngitis',
      substitutes: ['Wokadine', 'Cipladine', 'Hydrogen Peroxide 3%', 'Savlon'],
    };
  }

  if (nameLower.includes('cough') || nameLower.includes('benadryl') || nameLower.includes('corex') || nameLower.includes('syrup')) {
    return {
      name: medicineName,
      salt: 'Diphenhydramine + Ammonium Chloride + Sodium Citrate',
      category: 'Antitussive + Expectorant Cough Suppressant',
      primaryUses: ['Dry cough', 'allergic cough', 'productive cough', 'throat irritation'],
      causesAndConditions: ['Cough reflex triggered by pharyngeal/bronchial irritation'],
      dosageAdvice: '10ml (2 teaspoons) 3-4 times daily after meals',
      precautions: ['Causes significant drowsiness', 'avoid driving', 'do not combine with alcohol'],
      sideEffects: ['Drowsiness', 'dry mouth', 'thickened bronchial secretions'],
      aiClinicalTip: 'For dry cough use suppressant (Dextromethorphan), for wet cough use expectorant (Guaifenesin/Ambroxol)',
      substitutes: ['Grilinctus', 'Ascoril-D', 'Honitus', 'Zedex'],
    };
  }

  if (nameLower.includes('vitamin') || nameLower.includes('supradyn') || nameLower.includes('becosules') || nameLower.includes('multivit') || nameLower.includes('b-complex')) {
    return {
      name: medicineName,
      salt: 'B-Complex (B1, B2, B3, B5, B6, B12) + Vitamin C + Folic Acid + Zinc',
      category: 'Multivitamin & Mineral Supplement',
      primaryUses: ['Nutritional deficiency', 'fatigue', 'post-illness recovery', 'immune support'],
      causesAndConditions: ['Dietary insufficiency', 'malabsorption', 'convalescence'],
      dosageAdvice: '1 capsule/tablet daily after lunch or dinner',
      precautions: ['Not a substitute for balanced diet', 'store away from moisture'],
      sideEffects: ['Bright yellow urine (harmless B2 excretion)', 'mild nausea if taken empty stomach'],
      aiClinicalTip: 'Recommend Vitamin D3 supplement alongside in Indian population (widespread deficiency)',
      substitutes: ['Zincovit', 'Revital', 'Shelcal 500', 'A to Z NS'],
    };
  }

  if (nameLower.includes('aspirin') || nameLower.includes('disprin') || nameLower.includes('ecosprin')) {
    return {
      name: medicineName,
      salt: 'Acetylsalicylic Acid (75mg / 150mg / 325mg)',
      category: 'Antiplatelet / NSAID / Antipyretic',
      primaryUses: ['Blood thinning for heart attack prevention', 'mild pain', 'fever', 'anti-inflammatory'],
      causesAndConditions: ['Platelet aggregation prevention in cardiovascular disease'],
      dosageAdvice: 'Low-dose (75mg) daily for cardiac; 325-650mg for pain/fever',
      precautions: ['NEVER give to children under 16 (Reye\'s syndrome risk)', 'avoid in dengue'],
      sideEffects: ['Stomach bleeding', 'gastric irritation', 'tinnitus at high doses'],
      aiClinicalTip: 'Low-dose aspirin (75mg) is a lifesaving anti-platelet in post-MI patients',
      substitutes: ['Ecosprin 75', 'CV Aspirin', 'Clopidogrel 75mg'],
    };
  }

  if (nameLower.includes('deriphyllin') || nameLower.includes('theophyllin') || nameLower.includes('aminophyllin')) {
    return {
      name: medicineName,
      salt: 'Etofylline + Theophylline',
      category: 'Bronchodilator / Xanthine Derivative',
      primaryUses: ['Asthma', 'COPD', 'chronic bronchitis', 'wheezing'],
      causesAndConditions: ['Bronchospasm and airway obstruction'],
      dosageAdvice: '1 tablet 2-3 times daily after food',
      precautions: ['Narrow therapeutic window', 'monitor blood levels in elderly'],
      sideEffects: ['Palpitations', 'insomnia', 'tremors', 'GI upset'],
      aiClinicalTip: 'Avoid excessive caffeine intake during treatment as both are xanthines',
      substitutes: ['Theo-Asthalin', 'Ventorlin', 'Duolin inhaler'],
    };
  }

  if (nameLower.includes('candid') || nameLower.includes('clotrimazole') || nameLower.includes('cream') || nameLower.includes('ointment') || nameLower.includes('fungal')) {
    return {
      name: medicineName,
      salt: 'Clotrimazole (1% w/w)',
      category: 'Topical Antifungal',
      primaryUses: ['Ringworm', 'athlete\'s foot', 'jock itch', 'candidal skin infections', 'diaper rash'],
      causesAndConditions: ['Dermatophyte and Candida fungal skin colonization'],
      dosageAdvice: 'Apply thin layer to affected area 2-3 times daily for 2-4 weeks',
      precautions: ['Complete full course even if symptoms resolve early to prevent recurrence'],
      sideEffects: ['Mild local burning or itching on first application'],
      aiClinicalTip: 'Keep the affected area clean and dry. Use antifungal powder for moisture-prone areas.',
      substitutes: ['Canesten', 'Ring Guard', 'Luliconazole 1%', 'Terbinafine cream'],
    };
  }

  if (nameLower.includes('eye drop') || nameLower.includes('moxiflox') || nameLower.includes('milflox') || nameLower.includes('oflox eye')) {
    return {
      name: medicineName,
      salt: 'Moxifloxacin Ophthalmic (0.5%)',
      category: 'Ophthalmic Fluoroquinolone Antibiotic',
      primaryUses: ['Bacterial conjunctivitis', 'eye infection', 'post-cataract surgery prophylaxis'],
      causesAndConditions: ['Bacterial keratitis and conjunctival infection'],
      dosageAdvice: 'Instill 1-2 drops in affected eye 3 times daily for 5-7 days',
      precautions: ['Avoid touching dropper tip to eye', 'discard bottle 28 days after opening'],
      sideEffects: ['Transient stinging', 'blurred vision for 1-2 minutes'],
      aiClinicalTip: 'If both eye drops and ointment are prescribed, use drops first, ointment 5 min later',
      substitutes: ['Vigamox', 'Moxicip', 'Ofloxacin eye drops', 'Tobramycin eye drops'],
    };
  }

  if (nameLower.includes('ranitidine') || nameLower.includes('rantac') || nameLower.includes('aciloc') || nameLower.includes('zinetac')) {
    return {
      name: medicineName,
      salt: 'Ranitidine Hydrochloride (150mg)',
      category: 'H2 Receptor Blocker / Antacid',
      primaryUses: ['Acidity', 'heartburn', 'gastric ulcer', 'duodenal ulcer'],
      causesAndConditions: ['Excess acid secretion via histamine H2 pathway'],
      dosageAdvice: '1 tablet twice daily (morning and night) before meals',
      precautions: ['Avoid long-term unsupervised use'],
      sideEffects: ['Headache', 'constipation', 'mild dizziness'],
      aiClinicalTip: 'PPIs (like Pantoprazole) are more potent; use Ranitidine for milder cases or as step-down',
      substitutes: ['Rantac 150', 'Aciloc 150', 'Famotidine 20mg', 'Zinetac 150'],
    };
  }

  if (nameLower.includes('ondansetron') || nameLower.includes('emeset') || nameLower.includes('vomikind') || nameLower.includes('vomit') || nameLower.includes('nausea')) {
    return {
      name: medicineName,
      salt: 'Ondansetron Hydrochloride (4mg)',
      category: '5-HT3 Receptor Antagonist / Antiemetic',
      primaryUses: ['Nausea', 'vomiting', 'motion sickness', 'chemotherapy-induced vomiting'],
      causesAndConditions: ['Serotonin-mediated vomiting reflex'],
      dosageAdvice: '1 tablet 30 minutes before meals or as needed; mouth-dissolving tablet placed on tongue',
      precautions: ['May cause constipation', 'use with caution in liver impairment'],
      sideEffects: ['Headache', 'constipation', 'fatigue'],
      aiClinicalTip: 'Mouth-dissolving tablets (MD/ODT) are ideal for patients who cannot swallow due to active vomiting',
      substitutes: ['Ondem MD', 'Vomistop', 'Domperidone 10mg', 'Emeset 4'],
    };
  }

  if (nameLower.includes('loperamide') || nameLower.includes('imodium') || nameLower.includes('eldoper') || nameLower.includes('diarrhea') || nameLower.includes('loose motion')) {
    return {
      name: medicineName,
      salt: 'Loperamide Hydrochloride (2mg)',
      category: 'Anti-Diarrheal / Opioid Receptor Agonist (Peripheral)',
      primaryUses: ['Acute diarrhea', 'traveler\'s diarrhea', 'IBS-related diarrhea'],
      causesAndConditions: ['Increased intestinal motility and fluid secretion'],
      dosageAdvice: '2 capsules initially, then 1 capsule after each loose stool (max 8 per day)',
      precautions: ['Not for bloody/dysenteric diarrhea', 'do not use in children under 6'],
      sideEffects: ['Constipation', 'bloating', 'drowsiness'],
      aiClinicalTip: 'Always combine with ORS for rehydration. Do NOT use if fever with bloody stools (suggests bacterial dysentery).',
      substitutes: ['Imodium', 'Lopamide', 'Loperamide Plus'],
    };
  }

  // Smart fallback - try to extract useful info from the product name
  const formTypes: Record<string, string> = {
    'tablet': 'Oral Tablet', 'tab': 'Oral Tablet', 'cap': 'Oral Capsule', 'capsule': 'Oral Capsule',
    'syrup': 'Oral Syrup/Liquid', 'suspension': 'Oral Suspension', 'drops': 'Drops',
    'gel': 'Topical Gel', 'spray': 'Topical Spray', 'lotion': 'Topical Lotion',
    'injection': 'Injectable', 'inj': 'Injectable', 'powder': 'Powder/Sachet',
    'patch': 'Transdermal Patch', 'suppository': 'Rectal/Vaginal Suppository',
  };

  const therapeuticHints: Record<string, { category: string; uses: string[]; tip: string }> = {
    'pain': { category: 'Analgesic / Pain Reliever', uses: ['Pain management', 'Inflammation relief'], tip: 'Monitor for gastric side effects with prolonged use.' },
    'cold': { category: 'Cold & Flu Remedy', uses: ['Common cold symptoms', 'Nasal congestion', 'Runny nose'], tip: 'Symptomatic relief only; encourage fluids and rest.' },
    'fever': { category: 'Antipyretic', uses: ['Fever reduction', 'Body ache relief'], tip: 'Ensure adequate hydration during fever episodes.' },
    'cough': { category: 'Antitussive / Cough Remedy', uses: ['Cough suppression', 'Throat soothing'], tip: 'Identify if dry or productive cough for appropriate treatment.' },
    'stomach': { category: 'Gastrointestinal Medicine', uses: ['Stomach discomfort', 'Digestive support'], tip: 'Take with or after food to reduce GI irritation.' },
    'heart': { category: 'Cardiovascular Medicine', uses: ['Heart health support', 'Blood pressure management'], tip: 'Regular monitoring of vitals recommended.' },
    'blood': { category: 'Hematological Agent', uses: ['Blood-related condition management'], tip: 'Periodic blood tests recommended during treatment.' },
    'skin': { category: 'Dermatological Preparation', uses: ['Skin condition treatment', 'Topical application'], tip: 'Keep affected area clean and dry before application.' },
    'eye': { category: 'Ophthalmic Preparation', uses: ['Eye care & treatment'], tip: 'Avoid touching dropper tip; discard 28 days after opening.' },
    'ear': { category: 'Otic Preparation', uses: ['Ear infection/condition treatment'], tip: 'Warm drops to body temperature before instilling.' },
    'tooth': { category: 'Dental/Oral Care', uses: ['Dental pain relief', 'Oral hygiene'], tip: 'Recommend dental consultation for persistent issues.' },
    'throat': { category: 'Throat Care', uses: ['Sore throat relief', 'Pharyngeal soothing'], tip: 'Gargle with warm salt water as adjunct therapy.' },
    'vitamin': { category: 'Nutritional Supplement', uses: ['Vitamin supplementation', 'Nutritional support'], tip: 'Best absorbed when taken with meals.' },
    'protein': { category: 'Protein Supplement', uses: ['Protein supplementation', 'Muscle recovery'], tip: 'Combine with balanced diet for optimal results.' },
    'calcium': { category: 'Calcium Supplement', uses: ['Calcium supplementation', 'Bone health'], tip: 'Take with Vitamin D3 for better absorption.' },
    'iron': { category: 'Iron Supplement', uses: ['Iron deficiency anemia', 'Hemoglobin boost'], tip: 'Take with Vitamin C (orange juice) for better absorption. May cause dark stools.' },
    'zinc': { category: 'Zinc Supplement', uses: ['Zinc supplementation', 'Immune support'], tip: 'Avoid taking with dairy or calcium simultaneously.' },
  };

  let detectedForm = 'Pharmaceutical Preparation';
  for (const [key, form] of Object.entries(formTypes)) {
    if (nameLower.includes(key)) { detectedForm = form; break; }
  }

  let detectedCategory = 'Therapeutic Medicine';
  let detectedUses = ['As prescribed by physician', 'Symptomatic treatment'];
  let detectedTip = 'Verify batch number and expiry before dispensing. Consult pharmacist for salt-equivalent alternatives.';
  for (const [key, hint] of Object.entries(therapeuticHints)) {
    if (nameLower.includes(key)) {
      detectedCategory = hint.category;
      detectedUses = hint.uses;
      detectedTip = hint.tip;
      break;
    }
  }

  return {
    name: medicineName,
    salt: `${detectedForm} — Refer packaging for exact salt composition`,
    category: detectedCategory,
    primaryUses: detectedUses,
    causesAndConditions: [`Indicated for management of conditions related to ${detectedCategory.toLowerCase()}`],
    dosageAdvice: 'Administer strictly as instructed on prescription by a registered medical practitioner.',
    precautions: ['Check expiry date before dispensing', 'Store in a cool dry place below 25°C away from direct sunlight', 'Keep out of reach of children'],
    sideEffects: ['Consult a pharmacist or physician if any unexpected symptoms develop'],
    aiClinicalTip: detectedTip,
    substitutes: ['Consult registered pharmacist for salt-equivalent alternatives in inventory.'],
  };
}
