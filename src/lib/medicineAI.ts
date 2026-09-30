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

  // Default fallback for any custom medicine added
  return {
    name: medicineName,
    salt: 'Active Pharmaceutical Formulation',
    category: 'Therapeutic Prescription Medicine',
    primaryUses: ['Symptomatic Relief & Treatment', 'Targeted Pharmaceutical Care as per Prescription'],
    causesAndConditions: ['Pathogen suppression and metabolic regulation'],
    dosageAdvice: 'Administer strictly as instructed on prescription by a registered medical practitioner.',
    precautions: ['Check expiry date before dispensing', 'Store in a cool dry place below 25°C away from direct sunlight', 'Keep out of reach of children'],
    sideEffects: ['Consult a pharmacist or physician if any unexpected symptoms develop'],
    aiClinicalTip: 'Verify batch number, pack intactness, and patient prescription before dispensing at billing counter.',
    substitutes: ['Consult registered pharmacist for salt-equivalent alternatives in inventory.'],
  };
}
