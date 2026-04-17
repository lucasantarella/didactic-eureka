import { useState, useEffect, useRef, useCallback } from "react";

const DEMO_DATA = {
  interventional: [
    // ── Anti-TNF ──
    { drug: "CT-P13 SC", sponsor: "Celltrion", mechanism: "Anti-TNF (infliximab biosimilar)", phase: "Phase 3", indication: "UC/CD", status: "Active", nctId: "NCT04812366", startDate: "2022-06", estimatedCompletion: "2026-09", dataReadout: "2026-06", enrollmentTarget: 680, regions: ["US", "EU", "Japan"], topSites: ["Boston", "London", "Berlin", "Seoul", "Tokyo"], primaryEndpoint: "Clinical remission at wk 54", notes: "Subcutaneous formulation switch study" },
    { drug: "AVX-470", sponsor: "Avalo Therapeutics", mechanism: "Anti-TNF (oral polyclonal)", phase: "Phase 2", indication: "UC", status: "Recruiting", nctId: "NCT05838547", startDate: "2024-01", estimatedCompletion: "2027-03", dataReadout: "", enrollmentTarget: 200, regions: ["US"], topSites: ["San Diego", "Nashville", "Cleveland"], primaryEndpoint: "Modified Mayo score change at wk 12", notes: "Novel oral anti-TNF; gut-restricted" },
    // ── Anti-Integrin ──
    { drug: "Vedolizumab SC", sponsor: "Takeda", mechanism: "Anti-integrin (α4β7)", phase: "Phase 3", indication: "UC", status: "Active", nctId: "NCT04176834", startDate: "2021-03", estimatedCompletion: "2026-04", dataReadout: "2026-02", enrollmentTarget: 410, regions: ["US", "EU", "Japan", "Global"], topSites: ["New York", "Philadelphia", "Paris", "Tokyo", "Sydney"], primaryEndpoint: "Clinical remission at wk 52 (SC maintenance)", notes: "VISIBLE 3 — SC maintenance extension" },
    { drug: "Etrolizumab", sponsor: "Roche/Genentech", mechanism: "Anti-integrin (β7)", phase: "Phase 3", indication: "UC", status: "Active", nctId: "NCT02163759", startDate: "2020-05", estimatedCompletion: "2026-06", dataReadout: "2026-03", enrollmentTarget: 750, regions: ["US", "EU", "Global"], topSites: ["San Francisco", "London", "Zurich", "Toronto"], primaryEndpoint: "Clinical remission at wk 62", notes: "LAUREL — dual integrin; mixed Ph3 results to date" },
    { drug: "Carotegrast Methyl", sponsor: "EA Pharma/Kissei", mechanism: "Anti-integrin (α4 oral)", phase: "Phase 3", indication: "UC", status: "Recruiting", nctId: "NCT05608200", startDate: "2023-09", estimatedCompletion: "2027-06", dataReadout: "", enrollmentTarget: 500, regions: ["Japan", "US"], topSites: ["Tokyo", "Boston", "Osaka"], primaryEndpoint: "Clinical remission at wk 12", notes: "Oral small molecule integrin inhibitor; first-in-class oral α4" },
    // ── Anti-IL-23 / IL-12/23 ──
    { drug: "Risankizumab", sponsor: "AbbVie", mechanism: "IL-23p19 inhibitor", phase: "Phase 3", indication: "CD", status: "Active", nctId: "NCT03105128", startDate: "2021-01", estimatedCompletion: "2026-08", dataReadout: "2026-05", enrollmentTarget: 850, regions: ["US", "EU", "Japan", "Global"], topSites: ["Chicago", "New York", "London", "Berlin", "Tokyo", "Melbourne"], primaryEndpoint: "Endoscopic response + CDAI remission at wk 52", notes: "ADVANCE/MOTIVATE — long-term maintenance data expected" },
    { drug: "Guselkumab", sponsor: "Johnson & Johnson", mechanism: "IL-23p19 inhibitor", phase: "Phase 3", indication: "UC", status: "Recruiting", nctId: "NCT05765292", startDate: "2023-06", estimatedCompletion: "2027-12", dataReadout: "2027-06", enrollmentTarget: 1050, regions: ["US", "EU", "Global"], topSites: ["Philadelphia", "New York", "London", "Amsterdam", "Toronto", "Sydney"], primaryEndpoint: "Clinical remission at wk 12 (induction) + wk 44 (maintenance)", notes: "ASTRO program — IV induction then SC maintenance" },
    { drug: "Guselkumab", sponsor: "Johnson & Johnson", mechanism: "IL-23p19 inhibitor", phase: "Phase 3", indication: "CD", status: "Recruiting", nctId: "NCT05413278", startDate: "2023-03", estimatedCompletion: "2028-03", dataReadout: "2027-09", enrollmentTarget: 900, regions: ["US", "EU", "Japan", "Global"], topSites: ["Philadelphia", "Boston", "London", "Paris", "Tokyo"], primaryEndpoint: "CDAI clinical remission + endoscopic response at wk 48", notes: "GALAXI 2/3 — pivotal CD program" },
    { drug: "Mirikizumab", sponsor: "Eli Lilly", mechanism: "IL-23p19 inhibitor", phase: "Phase 3", indication: "CD", status: "Recruiting", nctId: "NCT04232553", startDate: "2022-04", estimatedCompletion: "2027-02", dataReadout: "2026-10", enrollmentTarget: 1300, regions: ["US", "EU", "Japan", "Global"], topSites: ["New York", "Houston", "London", "Madrid", "Tokyo", "Seoul"], primaryEndpoint: "Endoscopic response at wk 52", notes: "VIVID-1 — Phase 3 CD pivotal; UC already approved (Omvoh)" },
    { drug: "Brazikumab", sponsor: "AstraZeneca", mechanism: "IL-23p19 inhibitor", phase: "Phase 2b/3", indication: "CD", status: "Recruiting", nctId: "NCT05835830", startDate: "2024-03", estimatedCompletion: "2028-06", dataReadout: "", enrollmentTarget: 600, regions: ["US", "EU"], topSites: ["Boston", "Chicago", "London", "Amsterdam"], primaryEndpoint: "CDAI-based clinical remission at wk 52", notes: "Re-initiated after AZ acquired from Allergan" },
    // ── Anti-TL1A ──
    { drug: "Tulisokibart", sponsor: "Merck (via Prometheus)", mechanism: "Anti-TL1A monoclonal antibody", phase: "Phase 3", indication: "UC", status: "Recruiting", nctId: "NCT06052072", startDate: "2024-01", estimatedCompletion: "2027-09", dataReadout: "2027-03", enrollmentTarget: 1080, regions: ["US", "EU", "Japan", "Global"], topSites: ["New York", "Boston", "San Francisco", "London", "Tokyo", "Seoul", "Sydney"], primaryEndpoint: "Clinical remission per adapted Mayo score at wk 12", notes: "THETIS — first-in-class anti-TL1A in pivotal Ph3 for UC; Ph2 showed 26% vs 1% remission" },
    { drug: "Tulisokibart", sponsor: "Merck (via Prometheus)", mechanism: "Anti-TL1A monoclonal antibody", phase: "Phase 3", indication: "CD", status: "Recruiting", nctId: "NCT06190821", startDate: "2024-06", estimatedCompletion: "2028-06", dataReadout: "2028-01", enrollmentTarget: 900, regions: ["US", "EU", "Global"], topSites: ["New York", "Chicago", "London", "Amsterdam", "Toronto"], primaryEndpoint: "CDAI clinical remission + endoscopic response", notes: "TUSCANY — pivotal CD program for tulisokibart" },
    { drug: "Duvakitug (PRA023)", sponsor: "Roche/Genentech", mechanism: "Anti-TL1A monoclonal antibody", phase: "Phase 3", indication: "UC", status: "Recruiting", nctId: "NCT06334289", startDate: "2024-09", estimatedCompletion: "2028-03", dataReadout: "2027-09", enrollmentTarget: 950, regions: ["US", "EU", "Japan", "Global"], topSites: ["San Francisco", "Boston", "London", "Zurich", "Tokyo", "Melbourne"], primaryEndpoint: "Clinical remission at wk 14 (induction)", notes: "DUVAL — Roche's pivotal TL1A program; licensed from Protagonist" },
    { drug: "Duvakitug (PRA023)", sponsor: "Roche/Genentech", mechanism: "Anti-TL1A monoclonal antibody", phase: "Phase 3", indication: "CD", status: "Not yet recruiting", nctId: "NCT06401234", startDate: "2025-03", estimatedCompletion: "2029-01", dataReadout: "", enrollmentTarget: 800, regions: ["US", "EU", "Global"], topSites: ["San Francisco", "New York", "London", "Paris"], primaryEndpoint: "CDAI remission + endoscopic response at wk 52", notes: "DUVAL-CD — CD pivotal; following UC program" },
    { drug: "TEV-48574", sponsor: "Teva Pharmaceutical", mechanism: "Anti-TL1A monoclonal antibody", phase: "Phase 2", indication: "UC", status: "Recruiting", nctId: "NCT05765389", startDate: "2024-02", estimatedCompletion: "2026-12", dataReadout: "2026-09", enrollmentTarget: 240, regions: ["US", "EU"], topSites: ["New York", "Philadelphia", "Warsaw", "Vienna"], primaryEndpoint: "Clinical remission at wk 12", notes: "Third TL1A entrant; dose-ranging study" },
    // ── JAK / TYK2 / S1P / Oral Small Molecules ──
    { drug: "Upadacitinib", sponsor: "AbbVie", mechanism: "JAK1 selective inhibitor", phase: "Phase 3", indication: "CD", status: "Active", nctId: "NCT03345849", startDate: "2020-08", estimatedCompletion: "2026-11", dataReadout: "2026-08", enrollmentTarget: 1100, regions: ["US", "EU", "Japan", "Global"], topSites: ["Chicago", "New York", "Boston", "London", "Berlin", "Tokyo", "Seoul", "Sydney"], primaryEndpoint: "CDAI clinical remission + endoscopic response at wk 52", notes: "U-EXCEL / U-EXCEED — long-term maintenance; UC already approved" },
    { drug: "Etrasimod", sponsor: "Pfizer", mechanism: "S1P receptor modulator (S1P1,4,5)", phase: "Phase 3", indication: "CD", status: "Recruiting", nctId: "NCT05822297", startDate: "2023-11", estimatedCompletion: "2028-01", dataReadout: "2027-06", enrollmentTarget: 870, regions: ["US", "EU", "Global"], topSites: ["New York", "Philadelphia", "London", "Paris", "Toronto", "Tel Aviv"], primaryEndpoint: "CDAI remission + endoscopic response at wk 52", notes: "PRECISION CD — extending Velsipity from UC to CD" },
    { drug: "Ritlecitinib", sponsor: "Pfizer", mechanism: "JAK3/TEC kinase inhibitor", phase: "Phase 2b", indication: "UC", status: "Recruiting", nctId: "NCT05668390", startDate: "2024-05", estimatedCompletion: "2027-04", dataReadout: "2026-12", enrollmentTarget: 320, regions: ["US", "EU"], topSites: ["New York", "Boston", "London", "Amsterdam", "Madrid"], primaryEndpoint: "Adapted Mayo score change at wk 12", notes: "Novel JAK3 selectivity; approved in alopecia areata" },
    { drug: "Deucravacitinib", sponsor: "Bristol Myers Squibb", mechanism: "TYK2 allosteric inhibitor", phase: "Phase 2", indication: "UC", status: "Recruiting", nctId: "NCT05512480", startDate: "2023-08", estimatedCompletion: "2026-08", dataReadout: "2026-06", enrollmentTarget: 250, regions: ["US", "EU"], topSites: ["New York", "Chicago", "London", "Vienna"], primaryEndpoint: "Clinical remission per modified Mayo at wk 12", notes: "Selective TYK2; differentiated safety profile vs pan-JAK" },
    { drug: "Deucravacitinib", sponsor: "Bristol Myers Squibb", mechanism: "TYK2 allosteric inhibitor", phase: "Phase 2", indication: "CD", status: "Not yet recruiting", nctId: "NCT05890456", startDate: "2025-01", estimatedCompletion: "2027-06", dataReadout: "", enrollmentTarget: 200, regions: ["US", "EU"], topSites: ["Philadelphia", "Boston", "London"], primaryEndpoint: "CDAI remission at wk 12", notes: "CD dose-ranging; dependent on UC Ph2 results" },
    { drug: "Obefazimod", sponsor: "Abivax", mechanism: "miR-124 upregulator (oral)", phase: "Phase 3", indication: "UC", status: "Recruiting", nctId: "NCT05507203", startDate: "2023-04", estimatedCompletion: "2027-06", dataReadout: "2027-01", enrollmentTarget: 1200, regions: ["US", "EU", "Global"], topSites: ["New York", "Paris", "London", "Madrid", "Amsterdam", "Tel Aviv"], primaryEndpoint: "Clinical remission at wk 8 (induction) + wk 50 (maintenance)", notes: "ABTECT — novel MOA; first-in-class miR-124; strong Ph2b data" },
    { drug: "Ozanimod", sponsor: "Bristol Myers Squibb", mechanism: "S1P receptor modulator (S1P1,5)", phase: "Phase 3", indication: "CD", status: "Active", nctId: "NCT03440385", startDate: "2021-07", estimatedCompletion: "2026-12", dataReadout: "2026-09", enrollmentTarget: 750, regions: ["US", "EU", "Global"], topSites: ["New York", "San Francisco", "London", "Amsterdam", "Toronto"], primaryEndpoint: "CDAI remission + endoscopic response at wk 52", notes: "YELLOWSTONE CD — UC already approved (Zeposia)" },
    // ── Novel MOAs ──
    { drug: "Spesolimab", sponsor: "Boehringer Ingelheim", mechanism: "Anti-IL-36R (innate immunity)", phase: "Phase 2", indication: "UC", status: "Recruiting", nctId: "NCT05606861", startDate: "2024-07", estimatedCompletion: "2027-03", dataReadout: "", enrollmentTarget: 180, regions: ["US", "EU"], topSites: ["Boston", "London", "Berlin"], primaryEndpoint: "Modified Mayo score change at wk 12", notes: "IL-36 pathway; new innate immunity approach to UC" },
    { drug: "SER-287", sponsor: "Seres Therapeutics", mechanism: "Microbiome therapeutic (oral)", phase: "Phase 2b", indication: "UC", status: "Active", nctId: "NCT05332456", startDate: "2023-01", estimatedCompletion: "2026-06", dataReadout: "2026-04", enrollmentTarget: 300, regions: ["US"], topSites: ["Boston", "New York", "Houston", "San Francisco"], primaryEndpoint: "Endoscopic improvement at wk 10", notes: "Defined consortium of bacteria; oral capsule" },
    // ── Combination & Bispecifics ──
    { drug: "JNJ-8400 (IL-23+TL1A bispecific)", sponsor: "Johnson & Johnson", mechanism: "IL-23 + TL1A bispecific antibody", phase: "Phase 2", indication: "UC/CD", status: "Recruiting", nctId: "NCT06112345", startDate: "2024-10", estimatedCompletion: "2027-12", dataReadout: "2027-06", enrollmentTarget: 350, regions: ["US", "EU"], topSites: ["Philadelphia", "Boston", "New York", "London", "Amsterdam"], primaryEndpoint: "Clinical remission at wk 14", notes: "Dual-targeting bispecific; first-in-class IL-23×TL1A" },
    { drug: "ABT-950 (TNFα+IL-23 bispecific)", sponsor: "AbbVie", mechanism: "TNFα + IL-23 bispecific antibody", phase: "Phase 1b/2", indication: "CD", status: "Recruiting", nctId: "NCT06209876", startDate: "2025-01", estimatedCompletion: "2028-01", dataReadout: "", enrollmentTarget: 150, regions: ["US"], topSites: ["Chicago", "Boston", "San Francisco"], primaryEndpoint: "Safety + CDAI change at wk 12", notes: "Early-stage dual-cytokine; biologic combo approach" },
    { drug: "Vedolizumab + Adalimumab combo", sponsor: "Takeda/AbbVie (investigator-initiated)", mechanism: "Anti-integrin + Anti-TNF combination", phase: "Phase 2", indication: "CD", status: "Active", nctId: "NCT04518033", startDate: "2022-09", estimatedCompletion: "2026-09", dataReadout: "2026-06", enrollmentTarget: 200, regions: ["US", "EU"], topSites: ["Amsterdam", "Leuven", "London", "New York"], primaryEndpoint: "Endoscopic remission at wk 26", notes: "EXPLORER — dual biologic combination; academic-sponsored" },
  ],
  observational: [
    { study: "EVOLVE (RWE Registry)", sponsor: "AbbVie", type: "Registry", indication: "UC/CD", status: "Recruiting", nctId: "NCT05234567", startDate: "2023-01", estimatedCompletion: "2030-12", enrollmentTarget: 5000, regions: ["US", "EU", "Global"], notes: "Long-term RWE for risankizumab + upadacitinib in IBD" },
    { study: "ENTRUST (Vedolizumab PM)", sponsor: "Takeda", type: "Post-marketing", indication: "UC/CD", status: "Active", nctId: "NCT04567890", startDate: "2020-06", estimatedCompletion: "2027-06", enrollmentTarget: 3500, regions: ["US", "EU", "Japan"], notes: "Real-world vedolizumab effectiveness and safety" },
    { study: "VIVID-REAL", sponsor: "Eli Lilly", type: "Phase 4", indication: "UC", status: "Recruiting", nctId: "NCT06201234", startDate: "2024-06", estimatedCompletion: "2029-12", enrollmentTarget: 2000, regions: ["US", "EU", "Japan"], notes: "Mirikizumab (Omvoh) post-approval real-world outcomes" },
    { study: "LIBERTY Extension", sponsor: "Pfizer", type: "Phase 4", indication: "UC", status: "Active", nctId: "NCT05678901", startDate: "2023-09", estimatedCompletion: "2028-09", enrollmentTarget: 1500, regions: ["US", "EU"], notes: "Long-term etrasimod (Velsipity) safety & durability" },
    { study: "TRUE NORTH OLE", sponsor: "Bristol Myers Squibb", type: "Phase 4", indication: "UC", status: "Active", nctId: "NCT03915769", startDate: "2019-06", estimatedCompletion: "2027-12", enrollmentTarget: 900, regions: ["US", "EU", "Global"], notes: "Ozanimod (Zeposia) open-label extension; 5-yr safety" },
    { study: "SEAVUE Extension", sponsor: "AbbVie", type: "Post-marketing", indication: "UC", status: "Active", nctId: "NCT05012345", startDate: "2022-03", estimatedCompletion: "2027-06", enrollmentTarget: 700, regions: ["US", "EU"], notes: "Upadacitinib vs adalimumab long-term comparative outcomes" },
    { study: "IBD Biobank Network", sponsor: "Crohn's & Colitis Foundation", type: "Observational", indication: "UC/CD", status: "Recruiting", nctId: "NCT05345678", startDate: "2021-01", estimatedCompletion: "2031-12", enrollmentTarget: 10000, regions: ["US"], notes: "Genomic + clinical data biobank for IBD research" },
    { study: "NORDTREAT", sponsor: "Nordic IBD Consortium", type: "Registry", indication: "UC/CD", status: "Active", nctId: "NCT04456789", startDate: "2020-09", estimatedCompletion: "2028-09", enrollmentTarget: 4000, regions: ["EU"], notes: "Pan-Nordic registry comparing biologic treatment strategies" },
  ],
  summary: {
    totalInterventional: 27,
    totalObservational: 8,
    ucTrials: 18,
    cdTrials: 15,
    topMechanisms: ["Anti-IL-23 / IL-12/23", "Anti-TL1A", "JAK / TYK2 / S1P / Oral Small Molecules"],
    keyInsights: [
      "Anti-TL1A is the fastest-growing class with 5 active programs — tulisokibart (Merck/Prometheus) and duvakitug (Roche) are both in Ph3 pivotal trials across UC and CD, creating a head-to-head enrollment race through 2027-2028.",
      "IL-23 inhibitors represent the most competitive segment: 5 drugs across 6 active programs. Guselkumab (J&J) and mirikizumab (Lilly) are both in Ph3 for CD while risankizumab (AbbVie) pursues long-term maintenance data.",
      "Oral small molecules (JAK/TYK2/S1P) are expanding from UC into CD: etrasimod (Pfizer) and ozanimod (BMS) both have active Ph3 CD programs, while deucravacitinib (BMS/TYK2) and ritlecitinib (Pfizer/JAK3) explore novel selectivity in Ph2.",
      "Combination/bispecific approaches are emerging as next-generation: J&J's IL-23+TL1A bispecific (Ph2) and AbbVie's TNFα+IL-23 bispecific (Ph1b/2) signal the industry is moving toward dual-target strategies.",
      "Boston, New York, and London are the highest-density trial cities, each running 10+ concurrent IBD studies — site saturation risk is significant for enrollment-dependent programs.",
      "Key data readout cluster in 2026-2027: at least 12 programs expect primary endpoint data between Q2 2026 and Q4 2027, creating a competitive inflection point for payor and formulary decisions."
    ]
  }
};

const CANNED_REPORTS = [
  {
    id: "active-upcoming",
    label: "Active & Upcoming Trials",
    description: "How many active and upcoming trials are competing for moderate-to-severe UC and CD patients?",
    prompts: [
      `Search ClinicalTrials.gov for active and recruiting Phase 2 and Phase 3 clinical trials for moderate to severe ulcerative colitis 2024 2025 2026. List sponsors, drug names, mechanisms of action, phase, estimated completion dates.`,
      `Search ClinicalTrials.gov for active and recruiting Phase 2 and Phase 3 clinical trials for moderate to severe Crohn's disease 2024 2025 2026. List sponsors, drug names, mechanisms of action, phase, estimated completion dates.`,
      `Search for Phase 4 post-marketing observational registry studies for ulcerative colitis and Crohn's disease IBD 2024 2025 2026 on ClinicalTrials.gov`,
      `Search for recent pharmaceutical company pipeline updates and press releases for ulcerative colitis and Crohn's disease drugs 2025 2026. Include companies like AbbVie, Johnson & Johnson, Pfizer, Takeda, Bristol Myers Squibb, Eli Lilly, Roche, Gilead, Arena, Protagonist, Ventyx.`,
      `Search EU Clinical Trials Register and international registries for ulcerative colitis and Crohn's disease clinical trials 2024 2025 2026 not listed on ClinicalTrials.gov`
    ],
    systemPrompt: `You are a pharmaceutical competitive intelligence analyst specializing in inflammatory bowel disease (IBD). 
    
Your task: Search for and compile a comprehensive list of clinical trials for moderate-to-severe Ulcerative Colitis (UC) and Crohn's Disease (CD).

You MUST return ONLY valid JSON with no markdown, no preamble, no explanation. Return this exact structure:
{
  "interventional": [
    {
      "drug": "drug name",
      "sponsor": "company name",
      "mechanism": "mechanism of action (e.g., JAK1 inhibitor, IL-23 inhibitor, S1P receptor modulator)",
      "phase": "Phase 2 or Phase 3",
      "indication": "UC or CD or UC/CD",
      "status": "Recruiting or Active or Not yet recruiting",
      "nctId": "NCT number if available",
      "startDate": "trial start date as YYYY-MM or YYYY if exact month unknown",
      "estimatedCompletion": "estimated primary completion date as YYYY-MM or YYYY",
      "dataReadout": "expected data readout date if known, else empty string",
      "enrollmentTarget": number or 0 if unknown,
      "regions": ["US", "EU", "China", "Japan", "Global"],
      "topSites": ["city names where major enrollment centers are located, e.g. Boston, London, Tokyo"],
      "primaryEndpoint": "brief description",
      "notes": "any key details about data readouts or recent results"
    }
  ],
  "observational": [
    {
      "study": "study name",
      "sponsor": "company name",
      "type": "Phase 4 / Registry / Post-marketing / Observational",
      "indication": "UC or CD or UC/CD",
      "status": "status",
      "nctId": "NCT number if available",
      "startDate": "YYYY-MM or YYYY",
      "estimatedCompletion": "YYYY-MM or YYYY",
      "enrollmentTarget": number or 0 if unknown,
      "regions": ["US", "EU", "Global"],
      "notes": "details"
    }
  ],
  "summary": {
    "totalInterventional": number,
    "totalObservational": number,
    "ucTrials": number,
    "cdTrials": number,
    "topMechanisms": ["mechanism1", "mechanism2"],
    "keyInsights": ["insight1", "insight2", "insight3"]
  }
}

IMPORTANT FIELD NOTES:
- startDate / estimatedCompletion: Use YYYY-MM format when possible (e.g. "2024-06"), fall back to "2025" if month unknown. These power the timeline overlay.
- regions: Use standard region codes. Include all countries/regions where the trial is running. 
- topSites: List 2-5 major cities where enrollment is happening. These power the geographic heat map.
- enrollmentTarget: The target N for enrollment. Use 0 if unknown.

Be thorough. Include ALL major trials you can find from: ClinicalTrials.gov, EU Clinical Trials Register, company press releases, and pipeline disclosures. Include at minimum 15-25 interventional trials and 5-10 observational studies. Use web search extensively.`
  },
  {
    id: "moa-landscape",
    label: "Mechanism Landscape",
    description: "Map of all mechanisms of action being tested across UC/CD, grouped by therapeutic class with competitive positioning",
    prompts: [
      `Search for anti-TNF drugs in clinical trials or approved for ulcerative colitis Crohn's disease 2024 2025 2026 including biosimilars adalimumab infliximab golimumab certolizumab`,
      `Search for anti-integrin and anti-IL-23 and IL-12/23 drugs in clinical trials for ulcerative colitis Crohn's disease 2024 2025 2026 including vedolizumab etrolizumab risankizumab guselkumab mirikizumab`,
      `Search for anti-TL1A drugs in clinical trials for ulcerative colitis Crohn's disease 2024 2025 2026 including tulisokibart duvakitug PRA023`,
      `Search for JAK inhibitor TYK2 inhibitor S1P modulator oral small molecule drugs in clinical trials for ulcerative colitis Crohn's disease 2024 2025 2026 including upadacitinib tofacitinib etrasimod ozanimod obefazimod`,
      `Search for novel mechanism bispecific antibody combination therapy clinical trials ulcerative colitis Crohn's disease 2024 2025 2026 including PDE4 inhibitor dual targeting IL23 TNF TL1A`
    ],
    systemPrompt: `You are a pharmaceutical competitive intelligence analyst. Compile a complete mechanism-of-action landscape for UC and CD clinical development.

CRITICAL: You MUST organize mechanisms into exactly these 7 groups. Every drug must be classified into one of these groups:

1. "Anti-TNF" — adalimumab, infliximab, golimumab, certolizumab, biosimilars (CT-P13, etc.)
2. "Anti-Integrin" — vedolizumab, natalizumab, etrolizumab, ontamalimab, carotegrast, anti-MAdCAM, α4β7 agents
3. "Anti-IL-23 / IL-12/23" — ustekinumab (IL-12/23), risankizumab, guselkumab, mirikizumab, brazikumab, tildrakizumab (IL-23p19 agents)
4. "Anti-TL1A" — tulisokibart, duvakitug (PRA023), TEV-48574, RG6537, and any other TNFSF15/TL1A-targeting agents
5. "JAK / TYK2 / S1P / Oral Small Molecules" — tofacitinib, upadacitinib, filgotinib, ritlecitinib (JAK), deucravacitinib (TYK2), etrasimod, ozanimod (S1P), obefazimod (miR-124), AhR agonists, and other oral small molecules
6. "Novel MOAs" — PDE4 inhibitors (apremilast), innate immunity targets, microbiome therapies, FMT, stem cell, SMAD7, NKG2D, TLR agonists, and other emerging mechanisms
7. "Combination & Bispecifics" — bispecific antibodies (IL-23+TNFα, IL-23+TL1A, etc.), combination regimens, dual-targeting agents

Return ONLY valid JSON:
{
  "mechanismGroups": [
    {
      "groupId": "anti-tnf",
      "groupLabel": "Anti-TNF",
      "mechanisms": [
        {
          "mechanism": "specific mechanism name (e.g., Anti-TNFα monoclonal antibody)",
          "target": "biological target",
          "drugs": [
            {
              "drug": "name",
              "sponsor": "company",
              "phase": "highest phase (Approved / Phase 3 / Phase 2 / Phase 1)",
              "indication": "UC / CD / Both",
              "status": "Approved / Recruiting / Active / Not yet recruiting",
              "differentiator": "what makes this unique vs. competitors in the group",
              "recentData": "any recent trial results or data readouts"
            }
          ],
          "competitiveIntensity": "High/Medium/Low",
          "outlook": "brief competitive outlook for this specific mechanism"
        }
      ],
      "groupOutlook": "overall strategic assessment for this mechanism group",
      "totalDrugs": number
    }
  ],
  "emergingTargets": [
    {
      "target": "name",
      "group": "which of the 7 groups it falls into",
      "rationale": "why it's interesting",
      "leadProgram": "most advanced drug",
      "sponsor": "company",
      "phase": "phase"
    }
  ],
  "summary": {
    "totalMechanisms": 0,
    "mostCrowded": "group name",
    "fastestGrowing": "group name",
    "keyInsights": ["insight1", "insight2", "insight3"]
  }
}

Be exhaustive within each group. Include ALL approved products AND pipeline candidates. Use web search extensively.`
  },
  {
    id: "sponsor-pipeline",
    label: "Sponsor Pipeline View",
    description: "Which companies have the deepest IBD pipelines and what's their strategy?",
    prompts: [
      `Search for AbbVie, Johnson & Johnson, Pfizer, Takeda, Bristol Myers Squibb IBD pipeline 2025 2026 ulcerative colitis Crohn's disease clinical trials`,
      `Search for Eli Lilly, Roche Genentech, Gilead, Arena Pfizer, Protagonist Therapeutics, Ventyx Biosciences IBD pipeline 2025`,
      `Search for emerging biotech companies with ulcerative colitis or Crohn's disease drugs in clinical development 2024 2025`
    ],
    systemPrompt: `You are a pharmaceutical competitive intelligence analyst. Compile a sponsor-centric view of IBD pipelines.

Return ONLY valid JSON:
{
  "sponsors": [
    {
      "company": "name",
      "marketedProducts": ["product names in IBD"],
      "pipelineAssets": [
        {
          "drug": "name",
          "mechanism": "MOA",
          "phase": "phase",
          "indication": "UC/CD/Both",
          "expectedMilestone": "next catalyst"
        }
      ],
      "strategy": "brief strategic assessment",
      "threatLevel": "High/Medium/Low"
    }
  ],
  "summary": {
    "totalSponsors": 0,
    "keyInsights": ["insight1", "insight2"]
  }
}`
  }
];

// ── Color palette ──
const C = {
  bg: "#0a0c10",
  surface: "#12151c",
  surfaceAlt: "#181c26",
  border: "#1e2333",
  borderHover: "#2a3150",
  text: "#e2e4ea",
  textMuted: "#7a7f94",
  textDim: "#4a4f64",
  accent: "#3b82f6",
  accentDim: "#1e3a5f",
  green: "#22c55e",
  greenDim: "#0a3520",
  amber: "#f59e0b",
  amberDim: "#3d2800",
  red: "#ef4444",
  redDim: "#3d1111",
  purple: "#a855f7",
  purpleDim: "#2d1854",
  cyan: "#06b6d4",
  cyanDim: "#0a2d35",
  pink: "#ec4899",
};

// ── Canonical MOA Groups ──
const MOA_GROUPS = [
  { id: "anti-tnf", label: "Anti-TNF", color: "#ef4444", keywords: ["tnf", "anti-tnf", "adalimumab", "infliximab", "golimumab", "certolizumab", "ct-p13", "biosimilar"] },
  { id: "anti-integrin", label: "Anti-Integrin", color: "#a855f7", keywords: ["integrin", "vedolizumab", "natalizumab", "etrolizumab", "anti-integrin", "α4β7", "a4b7", "madcam"] },
  { id: "anti-il23", label: "Anti-IL-23 / IL-12/23", color: "#22c55e", keywords: ["il-23", "il23", "il-12/23", "il12/23", "il-12", "il12", "p19", "p40", "ustekinumab", "risankizumab", "guselkumab", "mirikizumab", "brazikumab", "tildrakizumab"] },
  { id: "anti-tl1a", label: "Anti-TL1A", color: "#ec4899", keywords: ["tl1a", "anti-tl1a", "tulisokibart", "duvakitug", "tnfsf15", "pra023"] },
  { id: "oral-small-mol", label: "JAK / TYK2 / S1P / Oral Small Molecules", color: "#3b82f6", keywords: ["jak", "jak1", "jak2", "jak3", "tyk2", "tofacitinib", "upadacitinib", "filgotinib", "ritlecitinib", "s1p", "ozanimod", "etrasimod", "amiselimod", "sphingosine", "mir-124", "mir124", "ahr", "aryl hydrocarbon", "obefazimod", "small molecule", "oral"] },
  { id: "novel-moa", label: "Novel MOAs", color: "#06b6d4", keywords: ["pde4", "apremilast", "innate", "nkg2d", "smad7", "mongersen", "nlrx1", "toll-like", "tlr", "sting", "cgas", "microbiome", "fmt", "fecal microbiota", "stem cell", "mesenchymal", "phosphodiesterase", "novel"] },
  { id: "combo-bispecific", label: "Combination & Bispecifics", color: "#f97316", keywords: ["bispecific", "combination", "combo", "dual", "il23+tnf", "il23+tl1a", "tnf+il23", "tl1a+il23", "crossmab", "bispecific antibody", "dual-target"] },
];

function classifyMOAGroup(moa) {
  if (!moa) return MOA_GROUPS[5]; // Novel MOAs fallback
  const lower = moa.toLowerCase();
  // Check combo/bispecific first (higher priority)
  if (lower.includes("bispecific") || lower.includes("combination") || lower.includes("dual") ||
      (lower.includes("+") && (lower.includes("il") || lower.includes("tnf") || lower.includes("tl1a")))) {
    return MOA_GROUPS[6];
  }
  for (const group of MOA_GROUPS) {
    for (const kw of group.keywords) {
      if (lower.includes(kw)) return group;
    }
  }
  return MOA_GROUPS[5]; // Novel MOAs fallback
}

function getMOAColor(moa) {
  return classifyMOAGroup(moa).color;
}

function getMOAGroupLabel(moa) {
  return classifyMOAGroup(moa).label;
}

function getMOAGroupId(moa) {
  return classifyMOAGroup(moa).id;
}

function getPhaseNum(phase) {
  if (!phase) return 0;
  const s = phase.toLowerCase();
  if (s.includes("4") || s.includes("approved") || s.includes("marketed")) return 5;
  if (s.includes("3")) return 4;
  if (s.includes("2/3") || s.includes("2b")) return 3.5;
  if (s.includes("2")) return 3;
  if (s.includes("1")) return 2;
  return 1;
}

function getStatusBadge(status) {
  if (!status) return { color: C.textMuted, bg: C.surfaceAlt, label: "Unknown" };
  const s = status.toLowerCase();
  if (s.includes("recruit")) return { color: C.green, bg: C.greenDim, label: "Recruiting" };
  if (s.includes("active")) return { color: C.accent, bg: C.accentDim, label: "Active" };
  if (s.includes("not yet")) return { color: C.amber, bg: C.amberDim, label: "Upcoming" };
  if (s.includes("complet")) return { color: C.textMuted, bg: C.surfaceAlt, label: "Completed" };
  return { color: C.cyan, bg: C.cyanDim, label: status };
}

// ── Styles ──
const font = "'DM Sans', 'Segoe UI', system-ui, sans-serif";
const monoFont = "'JetBrains Mono', 'Fira Code', monospace";

const styles = {
  app: {
    fontFamily: font,
    background: C.bg,
    color: C.text,
    minHeight: "100vh",
    width: "100%",
  },
  header: {
    padding: "24px 32px",
    borderBottom: `1px solid ${C.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: C.text,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: C.textMuted,
    marginTop: 2,
  },
  main: {
    padding: "24px 32px 40px",
    maxWidth: 1400,
    margin: "0 auto",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: C.textMuted,
    marginBottom: 14,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 12,
  },
  card: (active) => ({
    background: active ? C.surfaceAlt : C.surface,
    border: `1px solid ${active ? C.accent : C.border}`,
    borderRadius: 10,
    padding: "16px 18px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    position: "relative",
    overflow: "hidden",
  }),
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: C.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: C.textMuted,
    lineHeight: 1.5,
  },
  promptBox: {
    display: "flex",
    gap: 10,
    marginTop: 8,
  },
  textarea: {
    flex: 1,
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "12px 16px",
    color: C.text,
    fontSize: 15,
    fontFamily: font,
    resize: "vertical",
    minHeight: 44,
    outline: "none",
  },
  btn: (variant = "primary") => ({
    background: variant === "primary" ? C.accent : C.surface,
    color: variant === "primary" ? "#fff" : C.text,
    border: variant === "primary" ? "none" : `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: font,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
    transition: "all 0.15s",
  }),
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: 14,
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    fontWeight: 600,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: C.textMuted,
    borderBottom: `1px solid ${C.border}`,
    background: C.surface,
    position: "sticky",
    top: 0,
    zIndex: 2,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 12px",
    borderBottom: `1px solid ${C.border}`,
    verticalAlign: "top",
    lineHeight: 1.5,
  },
  badge: (color, bg) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    color: color,
    background: bg,
    whiteSpace: "nowrap",
  }),
  tab: (active) => ({
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: active ? 600 : 500,
    color: active ? C.accent : C.textMuted,
    background: active ? C.accentDim : "transparent",
    border: `1px solid ${active ? C.accent + "44" : "transparent"}`,
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: font,
  }),
  stat: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "16px 20px",
    textAlign: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 700,
    color: C.accent,
    fontFamily: monoFont,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 13,
    color: C.textMuted,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  progress: {
    width: "100%",
    height: 3,
    background: C.border,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 12,
  },
  progressBar: (pct) => ({
    width: `${pct}%`,
    height: "100%",
    background: `linear-gradient(90deg, ${C.accent}, ${C.cyan})`,
    borderRadius: 2,
    transition: "width 0.5s ease",
  }),
};

// ── Sub-components ──

function StatusDot({ status }) {
  const b = getStatusBadge(status);
  return <span style={styles.badge(b.color, b.bg)}>{b.label}</span>;
}

function MOABadge({ moa }) {
  const color = getMOAColor(moa);
  return (
    <span style={{ ...styles.badge(color, color + "18"), maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>
      {moa || "—"}
    </span>
  );
}

function StatsBar({ data }) {
  if (!data?.summary) return null;
  const s = data.summary;
  const stats = [
    { n: s.totalInterventional || 0, label: "Interventional" },
    { n: s.totalObservational || 0, label: "Observational" },
    { n: s.ucTrials || 0, label: "UC Trials" },
    { n: s.cdTrials || 0, label: "CD Trials" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 20 }}>
      {stats.map((s, i) => (
        <div key={i} style={styles.stat}>
          <div style={styles.statNumber}>{s.n}</div>
          <div style={styles.statLabel}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function InsightsPanel({ insights }) {
  if (!insights?.length) return null;
  return (
    <div style={{ background: C.accentDim, border: `1px solid ${C.accent}33`, borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.accent, marginBottom: 8 }}>KEY INSIGHTS</div>
      {insights.map((ins, i) => (
        <div key={i} style={{ fontSize: 14, color: C.text, lineHeight: 1.6, marginBottom: 6, paddingLeft: 14, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, color: C.accent }}>›</span>
          {ins}
        </div>
      ))}
    </div>
  );
}

function TrialTable({ trials, type = "interventional" }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [filter, setFilter] = useState("");

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  let rows = [...(trials || [])];
  if (filter) {
    const f = filter.toLowerCase();
    rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(f));
  }
  if (sortKey) {
    rows.sort((a, b) => {
      let va = a[sortKey] || "", vb = b[sortKey] || "";
      if (sortKey === "phase") { va = getPhaseNum(va); vb = getPhaseNum(vb); }
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  const columns = type === "interventional"
    ? [
        { key: "drug", label: "Drug" },
        { key: "sponsor", label: "Sponsor" },
        { key: "mechanism", label: "Mechanism" },
        { key: "phase", label: "Phase" },
        { key: "indication", label: "Ind." },
        { key: "status", label: "Status" },
        { key: "estimatedCompletion", label: "Est. Completion" },
        { key: "nctId", label: "NCT ID" },
      ]
    : [
        { key: "study", label: "Study" },
        { key: "sponsor", label: "Sponsor" },
        { key: "type", label: "Type" },
        { key: "indication", label: "Ind." },
        { key: "status", label: "Status" },
        { key: "estimatedCompletion", label: "Est. Completion" },
        { key: "nctId", label: "NCT ID" },
      ];

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Filter trials..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ ...styles.textarea, minHeight: 36, maxWidth: 300, padding: "8px 12px", fontSize: 12 }}
        />
      </div>
      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
        <table style={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ ...styles.th, cursor: "pointer" }} onClick={() => toggleSort(col.key)}>
                  {col.label} {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
              <th style={styles.th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} style={{ ...styles.td, textAlign: "center", color: C.textMuted, padding: 24 }}>No trials found</td></tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : C.surface + "88" }}>
                {columns.map((col) => (
                  <td key={col.key} style={styles.td}>
                    {col.key === "mechanism" ? <MOABadge moa={row[col.key]} /> :
                     col.key === "status" ? <StatusDot status={row[col.key]} /> :
                     col.key === "nctId" && row[col.key] ? (
                       <a href={`https://clinicaltrials.gov/study/${row[col.key]}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: C.accent, textDecoration: "none", fontFamily: monoFont, fontSize: 11 }}>
                         {row[col.key]}
                       </a>
                     ) :
                     <span style={{ color: col.key === "drug" || col.key === "study" ? C.text : C.textMuted, fontWeight: col.key === "drug" || col.key === "study" ? 600 : 400 }}>
                       {row[col.key] || "—"}
                     </span>
                    }
                  </td>
                ))}
                <td style={{ ...styles.td, maxWidth: 200, fontSize: 13, color: C.textMuted }}>
                  {row.notes || row.primaryEndpoint || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 13, color: C.textDim, marginTop: 8, textAlign: "right" }}>{rows.length} trial{rows.length !== 1 ? "s" : ""}</div>
    </div>
  );
}

// ── Geographic data for heat map ──
const CITY_COORDS = {
  "boston": { lat: 42.36, lng: -71.06, pop: 4.9 }, "new york": { lat: 40.71, lng: -74.01, pop: 18.8 },
  "philadelphia": { lat: 39.95, lng: -75.17, pop: 6.2 }, "chicago": { lat: 41.88, lng: -87.63, pop: 9.5 },
  "san francisco": { lat: 37.77, lng: -122.42, pop: 4.7 }, "los angeles": { lat: 34.05, lng: -118.24, pop: 13.2 },
  "houston": { lat: 29.76, lng: -95.37, pop: 7.1 }, "atlanta": { lat: 33.75, lng: -84.39, pop: 6.1 },
  "seattle": { lat: 47.61, lng: -122.33, pop: 4.0 }, "denver": { lat: 39.74, lng: -104.99, pop: 2.9 },
  "san diego": { lat: 32.72, lng: -117.16, pop: 3.3 }, "miami": { lat: 25.76, lng: -80.19, pop: 6.2 },
  "dallas": { lat: 32.78, lng: -96.80, pop: 7.6 }, "nashville": { lat: 36.16, lng: -86.78, pop: 1.9 },
  "cleveland": { lat: 41.50, lng: -81.69, pop: 2.1 }, "rochester": { lat: 44.02, lng: -92.47, pop: 0.22 },
  "london": { lat: 51.51, lng: -0.13, pop: 9.5 }, "paris": { lat: 48.86, lng: 2.35, pop: 11.0 },
  "berlin": { lat: 52.52, lng: 13.41, pop: 3.6 }, "amsterdam": { lat: 52.37, lng: 4.90, pop: 1.2 },
  "brussels": { lat: 50.85, lng: 4.35, pop: 2.1 }, "zurich": { lat: 47.37, lng: 8.54, pop: 1.4 },
  "madrid": { lat: 40.42, lng: -3.70, pop: 6.7 }, "rome": { lat: 41.90, lng: 12.50, pop: 4.3 },
  "vienna": { lat: 48.21, lng: 16.37, pop: 1.9 }, "warsaw": { lat: 52.23, lng: 21.01, pop: 1.8 },
  "tokyo": { lat: 35.68, lng: 139.69, pop: 37.4 }, "seoul": { lat: 37.57, lng: 126.98, pop: 9.7 },
  "beijing": { lat: 39.90, lng: 116.40, pop: 21.5 }, "shanghai": { lat: 31.23, lng: 121.47, pop: 28.5 },
  "mumbai": { lat: 19.08, lng: 72.88, pop: 20.7 }, "sydney": { lat: -33.87, lng: 151.21, pop: 5.3 },
  "melbourne": { lat: -37.81, lng: 144.96, pop: 5.0 }, "toronto": { lat: 43.65, lng: -79.38, pop: 6.2 },
  "montreal": { lat: 45.50, lng: -73.57, pop: 4.1 }, "sao paulo": { lat: -23.55, lng: -46.63, pop: 22.0 },
  "tel aviv": { lat: 32.09, lng: 34.78, pop: 4.2 }, "cape town": { lat: -33.93, lng: 18.42, pop: 4.6 },
  "taipei": { lat: 25.03, lng: 121.57, pop: 2.6 }, "singapore": { lat: 1.35, lng: 103.82, pop: 5.9 },
  "leuven": { lat: 50.88, lng: 4.70, pop: 0.1 }, "oxford": { lat: 51.75, lng: -1.25, pop: 0.15 },
  "cambridge": { lat: 52.21, lng: 0.12, pop: 0.13 }, "ann arbor": { lat: 42.28, lng: -83.74, pop: 0.12 },
  "pittsburgh": { lat: 40.44, lng: -79.99, pop: 2.4 }, "durham": { lat: 35.99, lng: -78.90, pop: 0.28 },
  "minneapolis": { lat: 44.98, lng: -93.27, pop: 3.6 }, "baltimore": { lat: 39.29, lng: -76.61, pop: 2.8 },
};

function normalizeCity(city) {
  return city?.toLowerCase().replace(/[^a-z\s]/g, "").trim();
}

// ── a. Trial Density Heat Map (Real Map) ──
function TrialHeatMap({ data }) {
  const [viewMode, setViewMode] = useState("city");
  const [hovered, setHovered] = useState(null);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

  const allTrials = [...(data.interventional || []), ...(data.observational || [])];

  const cityData = {};
  allTrials.forEach(t => {
    (t.topSites || []).forEach(site => {
      const key = normalizeCity(site);
      if (!key) return;
      if (!cityData[key]) cityData[key] = { name: site, trials: [], coords: CITY_COORDS[key] };
      cityData[key].trials.push(t);
    });
  });
  const cities = Object.values(cityData).filter(c => c.coords);
  const maxTrials = Math.max(...cities.map(c => c.trials.length), 1);

  function getHeatColor(intensity) {
    if (intensity > 0.75) return "#ef4444";
    if (intensity > 0.5) return "#f59e0b";
    if (intensity > 0.25) return "#3b82f6";
    return "#22c55e";
  }

  useEffect(() => {
    if (!mapRef.current) return;
    // Load Leaflet CSS + JS dynamically
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    function initMap() {
      if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; }
      const L = window.L;
      if (!L) return;

      const map = L.map(mapRef.current, {
        center: [30, 10],
        zoom: 2,
        minZoom: 2,
        maxZoom: 8,
        zoomControl: true,
        attributionControl: false,
      });

      // Light map tiles with good contrast against dark UI
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      leafletMap.current = map;
      updateMarkers();
    }

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => setTimeout(initMap, 100);
      document.head.appendChild(script);
    }

    return () => {
      if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; }
    };
  }, []);

  function updateMarkers() {
    const L = window.L;
    const map = leafletMap.current;
    if (!L || !map) return;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    cities.forEach(city => {
      const trialCount = city.trials.length;
      const popM = city.coords.pop || 1;
      let intensity, tooltipExtra;

      if (viewMode === "site_saturation") {
        const saturation = trialCount / popM;
        const maxSat = Math.max(...cities.map(c => c.trials.length / (c.coords.pop || 1)), 0.1);
        intensity = saturation / maxSat;
        tooltipExtra = `${saturation.toFixed(1)} trials/M pop`;
      } else {
        intensity = trialCount / maxTrials;
        tooltipExtra = `${trialCount} trial${trialCount !== 1 ? "s" : ""}`;
      }

      const color = getHeatColor(intensity);
      const radius = 8 + intensity * 28;

      // Glow circle
      const glow = L.circleMarker([city.coords.lat, city.coords.lng], {
        radius: radius + 12,
        fillColor: color,
        fillOpacity: 0.2,
        stroke: false,
      }).addTo(map);

      // Main circle
      const marker = L.circleMarker([city.coords.lat, city.coords.lng], {
        radius: radius,
        fillColor: color,
        fillOpacity: 0.8,
        color: "#fff",
        weight: 2,
      }).addTo(map);

      // Tooltip
      const trialList = city.trials.slice(0, 4).map(t =>
        `<div style="font-size:12px;color:#ccc;margin:2px 0;">${(t.drug || t.study || "").slice(0, 30)} — ${(t.sponsor || "").slice(0, 18)}</div>`
      ).join("");
      marker.bindTooltip(
        `<div style="font-family:${font};min-width:180px;">` +
        `<div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">${city.name}</div>` +
        `<div style="font-size:12px;color:#a0a0b0;margin-bottom:6px;">${tooltipExtra}</div>` +
        trialList +
        (city.trials.length > 4 ? `<div style="font-size:11px;color:#666;">+${city.trials.length - 4} more</div>` : "") +
        `</div>`,
        { sticky: true, className: "dark-tooltip", direction: "top", offset: [0, -radius] }
      );

      // Count label for high-density cities
      if (trialCount >= 3) {
        const icon = L.divIcon({
          html: `<div style="font-family:${monoFont};font-size:13px;font-weight:700;color:#fff;text-align:center;text-shadow:0 1px 3px rgba(0,0,0,0.7), 0 0 6px rgba(0,0,0,0.5);line-height:1;">${trialCount}</div>`,
          className: "",
          iconSize: [30, 16],
          iconAnchor: [15, 8],
        });
        const label = L.marker([city.coords.lat, city.coords.lng], { icon, interactive: false }).addTo(map);
        markersRef.current.push(label);
      }

      markersRef.current.push(glow, marker);
    });
  }

  useEffect(() => {
    if (leafletMap.current && window.L) updateMarkers();
  }, [viewMode, data]);

  // Inject dark tooltip styles
  useEffect(() => {
    if (document.getElementById("leaflet-dark-tooltip")) return;
    const style = document.createElement("style");
    style.id = "leaflet-dark-tooltip";
    style.textContent = `
      .dark-tooltip { background: #12151cee !important; border: 1px solid #2a3150 !important; border-radius: 8px !important; padding: 10px 14px !important; box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important; color: #fff !important; }
      .dark-tooltip::before { border-top-color: #2a3150 !important; }
      .leaflet-container { background: #e8e8e8 !important; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>
          Trial Density Heat Map
          <span style={{ fontSize: 13, fontWeight: 400, color: C.textMuted, marginLeft: 8 }}>
            {cities.length} cities across {allTrials.length} trials
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button style={styles.tab(viewMode === "city")} onClick={() => setViewMode("city")}>By City</button>
          <button style={styles.tab(viewMode === "site_saturation")} onClick={() => setViewMode("site_saturation")}>Site Saturation</button>
        </div>
      </div>

      <div style={{ borderRadius: 12, border: `2px solid ${C.borderHover}`, overflow: "hidden", position: "relative" }}>
        <div ref={mapRef} style={{ width: "100%", height: 520 }} />
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { label: viewMode === "site_saturation" ? "Very High Saturation" : "High Density (6+)", color: "#ef4444" },
          { label: viewMode === "site_saturation" ? "High Saturation" : "Medium-High (4–5)", color: "#f59e0b" },
          { label: viewMode === "site_saturation" ? "Moderate Saturation" : "Medium (2–3)", color: "#3b82f6" },
          { label: viewMode === "site_saturation" ? "Low Saturation" : "Low (1)", color: "#22c55e" },
        ].map((l, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: C.textMuted }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: l.color, opacity: 0.7 }} />
            {l.label}
          </span>
        ))}
      </div>
      {viewMode === "site_saturation" && (
        <div style={{ fontSize: 12, color: C.textDim, textAlign: "center", marginTop: 6 }}>
          Site saturation = trials ÷ metro population (millions). High saturation cities may face enrollment competition.
        </div>
      )}
    </div>
  );
}

// ── b. Timeline Overlay ──
function TimelineOverlay({ data }) {
  const [filterMOA, setFilterMOA] = useState("all");
  const [filterInd, setFilterInd] = useState("all");

  const trials = [...(data.interventional || [])];

  function parseDate(d) {
    if (!d) return null;
    if (/^\d{4}-\d{2}/.test(d)) return new Date(d + "-01");
    if (/^\d{4}$/.test(d)) return new Date(d + "-06-01");
    const p = new Date(d);
    return isNaN(p.getTime()) ? null : p;
  }

  // Compute time range
  const now = new Date();
  const minYear = 2022;
  const maxYear = 2030;
  const rangeStart = new Date(minYear, 0, 1);
  const rangeEnd = new Date(maxYear, 11, 31);
  const totalMs = rangeEnd - rangeStart;

  // Collect mechanisms for filter
  const allMOAs = [...new Set(trials.map(t => t.mechanism).filter(Boolean))].sort();
  const allInds = [...new Set(trials.map(t => t.indication).filter(Boolean))].sort();

  let filtered = trials.filter(t => {
    if (filterMOA !== "all" && t.mechanism !== filterMOA) return false;
    if (filterInd !== "all" && !t.indication?.includes(filterInd)) return false;
    return true;
  });

  // Sort by start date
  filtered.sort((a, b) => {
    const da = parseDate(a.startDate) || new Date(2025, 0, 1);
    const db = parseDate(b.startDate) || new Date(2025, 0, 1);
    return da - db;
  });

  const svgW = 900, rowH = 32, topPad = 50, leftPad = 200;
  const svgH = topPad + filtered.length * rowH + 40;
  const chartW = svgW - leftPad - 20;

  function timeToX(date) {
    if (!date) return null;
    const ms = date - rangeStart;
    return leftPad + (ms / totalMs) * chartW;
  }

  const years = [];
  for (let y = minYear; y <= maxYear; y++) years.push(y);
  const nowX = timeToX(now);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
          Trial Timeline — Enrollment & Completion Windows
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <select value={filterMOA} onChange={e => setFilterMOA(e.target.value)}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 13, padding: "4px 8px", fontFamily: font }}>
            <option value="all">All Mechanisms</option>
            {allMOAs.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterInd} onChange={e => setFilterInd(e.target.value)}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 13, padding: "4px 8px", fontFamily: font }}>
            <option value="all">All Indications</option>
            {allInds.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
        <svg viewBox={`0 0 ${svgW} ${Math.max(svgH, 200)}`} width="100%" style={{ display: "block", minHeight: 200 }}>
          <rect width={svgW} height={Math.max(svgH, 200)} fill={C.surface} />

          {/* Year columns */}
          {years.map(y => {
            const x = timeToX(new Date(y, 0, 1));
            return (
              <g key={y}>
                <line x1={x} y1={topPad - 10} x2={x} y2={Math.max(svgH, 200) - 10}
                  stroke={C.border} strokeWidth="0.5" strokeDasharray="3 3" />
                <text x={x + 2} y={topPad - 16} fill={C.textMuted} fontSize="12"
                  fontWeight="600" fontFamily={monoFont}>{y}</text>
              </g>
            );
          })}

          {/* Now line */}
          {nowX && (
            <g>
              <line x1={nowX} y1={topPad - 10} x2={nowX} y2={Math.max(svgH, 200) - 10}
                stroke={C.accent} strokeWidth="1.5" strokeDasharray="4 2" />
              <text x={nowX + 3} y={topPad - 16} fill={C.accent} fontSize="13"
                fontWeight="700" fontFamily={monoFont}>TODAY</text>
            </g>
          )}

          {/* Trial bars */}
          {filtered.map((t, i) => {
            const y = topPad + i * rowH;
            const start = parseDate(t.startDate);
            const end = parseDate(t.estimatedCompletion);
            const readout = parseDate(t.dataReadout);
            const x1 = timeToX(start) || leftPad;
            const x2 = timeToX(end) || (leftPad + chartW * 0.5);
            const color = getMOAColor(t.mechanism);
            const barW = Math.max(x2 - x1, 8);
            const isActive = start && end && now >= start && now <= end;

            return (
              <g key={i}>
                {/* Row stripe */}
                {i % 2 === 1 && <rect x={0} y={y} width={svgW} height={rowH} fill={C.bg} opacity="0.3" />}

                {/* Label */}
                <text x={leftPad - 6} y={y + rowH / 2 + 3} textAnchor="end"
                  fill={C.text} fontSize="13" fontWeight="500" fontFamily={font}>
                  {(t.drug || "?").slice(0, 20)}
                  <tspan fill={C.textDim} fontSize="12"> ({(t.sponsor || "").slice(0, 12)})</tspan>
                </text>

                {/* Gantt bar */}
                <rect x={x1} y={y + 6} width={barW} height={rowH - 12} rx={4}
                  fill={color + "33"} stroke={color} strokeWidth={isActive ? 1.5 : 0.8} />

                {/* Fill for elapsed portion */}
                {isActive && start && (
                  <rect x={x1} y={y + 6} rx={4}
                    width={Math.min(timeToX(now) - x1, barW)} height={rowH - 12}
                    fill={color + "55"} />
                )}

                {/* Phase label inside bar */}
                {barW > 40 && (
                  <text x={x1 + barW / 2} y={y + rowH / 2 + 3} textAnchor="middle"
                    fill={color} fontSize="9" fontWeight="700" fontFamily={monoFont}>
                    {t.phase} • {t.indication}
                  </text>
                )}

                {/* Data readout diamond */}
                {readout && timeToX(readout) && (
                  <g>
                    <polygon points={`${timeToX(readout)},${y + 4} ${timeToX(readout) + 5},${y + rowH / 2} ${timeToX(readout)},${y + rowH - 4} ${timeToX(readout) - 5},${y + rowH / 2}`}
                      fill={C.amber} stroke={C.amber} strokeWidth="1" />
                    <title>Data readout: {t.dataReadout}</title>
                  </g>
                )}

                <title>{`${t.drug} (${t.sponsor}) — ${t.mechanism}\n${t.phase} | ${t.indication}\nStart: ${t.startDate || "?"} | End: ${t.estimatedCompletion || "?"}\n${t.dataReadout ? "Readout: " + t.dataReadout : ""}`}</title>
              </g>
            );
          })}

          {filtered.length === 0 && (
            <text x={svgW / 2} y={100} textAnchor="middle" fill={C.textMuted} fontSize="12" fontFamily={font}>
              No trials match current filters
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.textMuted }}>
          <span style={{ width: 24, height: 8, borderRadius: 3, background: C.accent + "55", border: `1px solid ${C.accent}` }} />
          Active enrollment window
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.textMuted }}>
          <span style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: `8px solid ${C.amber}` }} />
          Data readout
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.textMuted }}>
          <span style={{ width: 1.5, height: 12, background: C.accent, borderRadius: 1 }} />
          Today
        </span>
      </div>

      {/* Overlap analysis */}
      {filtered.length > 1 && (() => {
        const overlaps = [];
        for (let i = 0; i < filtered.length; i++) {
          for (let j = i + 1; j < filtered.length; j++) {
            const a = filtered[i], b = filtered[j];
            if (a.mechanism !== b.mechanism) continue;
            const aS = parseDate(a.startDate), aE = parseDate(a.estimatedCompletion);
            const bS = parseDate(b.startDate), bE = parseDate(b.estimatedCompletion);
            if (aS && aE && bS && bE && aS < bE && bS < aE) {
              const overlapStart = new Date(Math.max(aS, bS));
              const overlapEnd = new Date(Math.min(aE, bE));
              const months = Math.round((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24 * 30));
              if (months > 3) overlaps.push({ a, b, months, moa: a.mechanism });
            }
          }
        }
        if (overlaps.length === 0) return null;
        return (
          <div style={{ marginTop: 12, background: C.amberDim, border: `1px solid ${C.amber}33`, borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.amber, marginBottom: 6 }}>
              ENROLLMENT OVERLAP ALERTS ({overlaps.length})
            </div>
            {overlaps.slice(0, 6).map((o, i) => (
              <div key={i} style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 2 }}>
                <span style={{ color: getMOAColor(o.moa), fontWeight: 600 }}>{o.a.drug}</span>
                {" "}× <span style={{ color: getMOAColor(o.moa), fontWeight: 600 }}>{o.b.drug}</span>
                <span style={{ color: C.textMuted }}> — {o.months}mo overlap ({o.moa})</span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ── c. MOA vs Phase Matrix ──
function MOAPhaseMatrix({ data }) {
  const [indicationFilter, setIndicationFilter] = useState("all");
  const [hovered, setHovered] = useState(null);

  const trials = [...(data.interventional || [])];
  const filtered = indicationFilter === "all" ? trials
    : trials.filter(t => t.indication?.includes(indicationFilter));

  const phases = ["Phase 1", "Phase 2", "Phase 2b/3", "Phase 3", "Approved/Ph4"];
  const phaseLabels = ["Ph 1", "Ph 2", "Ph 2b/3", "Ph 3", "Approved"];

  // Build MOA list
  // Group trials into the 7 canonical MOA groups
  const moaSet = {};
  MOA_GROUPS.forEach(g => {
    moaSet[g.id] = { label: g.label, color: g.color };
    phases.forEach((p, pi) => {
      if (!moaSet[g.id][pi]) moaSet[g.id][pi] = [];
    });
  });
  filtered.forEach(t => {
    const group = classifyMOAGroup(t.mechanism);
    const pi = phases.findIndex(p => {
      const pn = getPhaseNum(t.phase);
      const refN = getPhaseNum(p);
      return Math.abs(pn - refN) < 0.6;
    });
    const idx = pi >= 0 ? pi : 2;
    moaSet[group.id][idx].push(t);
  });

  // Build list in canonical order, filter out empty groups
  const moaList = MOA_GROUPS
    .map(g => [g.label, moaSet[g.id]])
    .filter(([, cols]) => phases.some((_, pi) => (cols[pi] || []).length > 0));

  const cellW = 140, cellH = 56, leftPad = 220, topPad = 42;
  const gridW = leftPad + phases.length * cellW + 10;
  const gridH = topPad + moaList.length * cellH + 10;
  const maxInCell = Math.max(...moaList.flatMap(([, cols]) => phases.map((_, pi) => (cols[pi] || []).length)), 1);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
          MOA × Phase Matrix
          <span style={{ fontSize: 13, fontWeight: 400, color: C.textMuted, marginLeft: 8 }}>
            7 therapeutic classes × development stage
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "UC", "CD"].map(ind => (
            <button key={ind} style={styles.tab(indicationFilter === ind)}
              onClick={() => setIndicationFilter(ind)}>
              {ind === "all" ? "All" : ind}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
        <svg viewBox={`0 0 ${gridW} ${gridH}`} width="100%" style={{ display: "block", minHeight: 300 }}>
          <rect width={gridW} height={gridH} fill={C.surface} />

          {/* Phase column headers */}
          {phases.map((p, i) => (
            <g key={p}>
              <text x={leftPad + i * cellW + cellW / 2} y={28} textAnchor="middle"
                fill={C.textMuted} fontSize="12" fontWeight="700" fontFamily={font}>
                {phaseLabels[i]}
              </text>
              <line x1={leftPad + i * cellW} y1={topPad} x2={leftPad + i * cellW} y2={gridH}
                stroke={C.border} strokeWidth="0.5" />
            </g>
          ))}

          {/* MOA rows */}
          {moaList.map(([moa, columns], mi) => {
            const y = topPad + mi * cellH;
            const color = columns.color || getMOAColor(moa);
            const totalInMOA = phases.reduce((s, _, pi) => s + (columns[pi] || []).length, 0);

            return (
              <g key={moa}>
                {/* Row separator */}
                <line x1={0} y1={y} x2={gridW} y2={y} stroke={C.border} strokeWidth="0.5" />

                {/* MOA label */}
                <text x={leftPad - 10} y={y + cellH / 2 + 3} textAnchor="end"
                  fill={color} fontSize="13" fontWeight="600" fontFamily={font}>
                  {moa.length > 28 ? moa.slice(0, 26) + "…" : moa}
                </text>
                <text x={leftPad - 10} y={y + cellH / 2 + 14} textAnchor="end"
                  fill={C.textDim} fontSize="12" fontFamily={monoFont}>
                  {totalInMOA} total
                </text>

                {/* Phase cells */}
                {phases.map((p, pi) => {
                  const cellTrials = columns[pi] || [];
                  const cx = leftPad + pi * cellW;
                  const count = cellTrials.length;
                  const intensity = count / maxInCell;

                  return (
                    <g key={pi}
                      onMouseEnter={() => setHovered({ moa, phase: p, trials: cellTrials, x: cx, y })}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: count > 0 ? "pointer" : "default" }}>
                      {/* Heat cell background */}
                      <rect x={cx + 2} y={y + 2} width={cellW - 4} height={cellH - 4} rx={6}
                        fill={count > 0 ? color + Math.round(intensity * 60 + 15).toString(16).padStart(2, "0") : "transparent"}
                        stroke={count > 0 ? color + "33" : "transparent"} strokeWidth="1" />

                      {/* Drug bubbles */}
                      {cellTrials.slice(0, 4).map((t, ti) => {
                        const bx = cx + 16 + (ti % 3) * 38;
                        const by = y + 14 + Math.floor(ti / 3) * 22;
                        const sb = getStatusBadge(t.status);
                        return (
                          <g key={ti}>
                            <rect x={bx - 14} y={by - 7} width={36} height={16} rx={4}
                              fill={sb.bg} stroke={sb.color + "55"} strokeWidth="0.5" />
                            <text x={bx + 4} y={by + 4} textAnchor="middle"
                              fill={sb.color} fontSize="8" fontWeight="700" fontFamily={monoFont}>
                              {(t.drug || "?").slice(0, 6)}
                            </text>
                          </g>
                        );
                      })}
                      {cellTrials.length > 4 && (
                        <text x={cx + cellW - 14} y={y + cellH - 8} textAnchor="end"
                          fill={C.textDim} fontSize="12" fontFamily={monoFont}>
                          +{cellTrials.length - 4}
                        </text>
                      )}

                      {/* Count badge */}
                      {count > 0 && (
                        <g>
                          <circle cx={cx + cellW - 14} cy={y + 14} r={9}
                            fill={color} opacity="0.9" />
                          <text x={cx + cellW - 14} y={y + 17} textAnchor="middle"
                            fill="#fff" fontSize="12" fontWeight="700" fontFamily={monoFont}>
                            {count}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Hover detail panel */}
          {hovered && hovered.trials.length > 0 && (() => {
            const px = Math.min(hovered.x + cellW + 5, gridW - 210);
            const py = Math.max(hovered.y - 10, topPad);
            const panelH = 22 + hovered.trials.length * 14;
            return (
              <g>
                <rect x={px} y={py} width={200} height={Math.min(panelH, 120)} rx={6}
                  fill={C.bg} stroke={C.border} strokeWidth="1" />
                <text x={px + 8} y={py + 14} fill={C.accent} fontSize="13" fontWeight="700" fontFamily={font}>
                  {hovered.moa} — {hovered.phase}
                </text>
                {hovered.trials.slice(0, 6).map((t, i) => (
                  <text key={i} x={px + 8} y={py + 28 + i * 13} fill={C.textMuted} fontSize="12" fontFamily={font}>
                    <tspan fill={C.text} fontWeight="500">{(t.drug || "?").slice(0, 15)}</tspan>
                    {" "}({(t.sponsor || "").slice(0, 12)}) — {t.indication}
                  </text>
                ))}
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Legend & summary */}
      <div style={{ display: "flex", gap: 12, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.textMuted }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: C.green + "44", border: `1px solid ${C.green}33` }} />
          Recruiting
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.textMuted }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: C.accentDim, border: `1px solid ${C.accent}33` }} />
          Active
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.textMuted }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: C.amberDim, border: `1px solid ${C.amber}33` }} />
          Upcoming
        </span>
        <span style={{ fontSize: 12, color: C.textDim }}>|</span>
        <span style={{ fontSize: 12, color: C.textDim }}>
          Cell intensity = relative trial count. Hover for details.
        </span>
      </div>

      {/* Crowding analysis */}
      {(() => {
        const crowded = moaList
          .map(([moa, cols]) => ({ moa, total: phases.reduce((s, _, pi) => s + (cols[pi] || []).length, 0) }))
          .sort((a, b) => b.total - a.total);
        const top = crowded.slice(0, 3);
        return (
          <div style={{ marginTop: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>COMPETITIVE DENSITY RANKING</div>
            {top.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? C.red : i === 1 ? C.amber : C.accent, fontFamily: monoFont, width: 20 }}>
                  #{i + 1}
                </span>
                <MOABadge moa={t.moa} />
                <span style={{ fontSize: 13, color: C.textMuted }}>{t.total} programs</span>
                <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2 }}>
                  <div style={{ width: `${(t.total / crowded[0].total) * 100}%`, height: 4, background: getMOAColor(t.moa), borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ── Wrapper: Competitive Visualization Suite ──
function CompetitiveMap({ data }) {
  const [vizTab, setVizTab] = useState("matrix");

  if (!data?.interventional?.length) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
        No interventional trial data available for visualization.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <button style={styles.tab(vizTab === "matrix")} onClick={() => setVizTab("matrix")}>
          MOA × Phase Matrix
        </button>
        <button style={styles.tab(vizTab === "timeline")} onClick={() => setVizTab("timeline")}>
          Timeline Overlay
        </button>
        <button style={styles.tab(vizTab === "heatmap")} onClick={() => setVizTab("heatmap")}>
          Geographic Heat Map
        </button>
      </div>

      {vizTab === "matrix" && <MOAPhaseMatrix data={data} />}
      {vizTab === "timeline" && <TimelineOverlay data={data} />}
      {vizTab === "heatmap" && <TrialHeatMap data={data} />}
    </div>
  );
}

function LoadingState({ messages, progress }) {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div style={{ display: "inline-block", width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginTop: 16, fontSize: 13, color: C.text, fontWeight: 500 }}>Analyzing Clinical Trial Landscape</div>
      <div style={{ marginTop: 6, fontSize: 12, color: C.textMuted }}>Querying registries & pipeline databases...</div>
      {messages.length > 0 && (
        <div style={{ marginTop: 16, maxWidth: 500, margin: "16px auto 0" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ fontSize: 13, color: i === messages.length - 1 ? C.accent : C.textDim, marginBottom: 4, fontFamily: monoFont }}>
              {i === messages.length - 1 ? "▸ " : "✓ "}{msg}
            </div>
          ))}
        </div>
      )}
      <div style={{ ...styles.progress, maxWidth: 400, margin: "16px auto 0" }}>
        <div style={styles.progressBar(progress)} />
      </div>
    </div>
  );
}

// ── Main App ──
export default function IBDCompetitiveIntel() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("table");
  const [tableView, setTableView] = useState("interventional");
  const [error, setError] = useState(null);
  const [rawResponses, setRawResponses] = useState([]);

  const runReport = useCallback(async (report) => {
    setLoading(true);
    setError(null);
    setData(null);
    setLoadingMessages([]);
    setProgress(0);
    setRawResponses([]);

    const allResponses = [];
    const totalSteps = report.prompts.length + 1;

    try {
      for (let i = 0; i < report.prompts.length; i++) {
        setLoadingMessages(prev => [...prev, `Searching: ${report.prompts[i].slice(0, 80)}...`]);
        setProgress(((i + 1) / totalSteps) * 80);

        try {
          const resp = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 4096,
              tools: [{ type: "web_search_20250305", name: "web_search" }],
              messages: [{ role: "user", content: report.prompts[i] }],
            }),
          });
          const d = await resp.json();
          const textParts = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
          allResponses.push(textParts);
        } catch (err) {
          console.error(`Search ${i} failed:`, err);
          allResponses.push("");
        }
      }

      setLoadingMessages(prev => [...prev, "Synthesizing competitive intelligence..."]);
      setProgress(90);
      setRawResponses(allResponses);

      const synthesisPrompt = `Here is raw research data from multiple searches about IBD clinical trials:\n\n${allResponses.map((r, i) => `--- SEARCH ${i + 1} ---\n${r}`).join("\n\n")}\n\nUsing ALL of this data, ${report.description}\n\nIMPORTANT: Return ONLY valid JSON, no markdown fences, no preamble.`;

      const synthResp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 16000,
          system: report.systemPrompt,
          messages: [{ role: "user", content: synthesisPrompt }],
        }),
      });

      const synthData = await synthResp.json();
      const synthText = (synthData.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");

      // Robust JSON repair for truncated responses
      function repairJSON(str) {
        let s = str.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        // Extract from first { to last }
        const firstBrace = s.indexOf("{");
        if (firstBrace === -1) return null;
        s = s.slice(firstBrace);
        // Try parsing as-is first
        try { return JSON.parse(s); } catch (e) { /* continue to repair */ }
        // Remove trailing comma before repair
        s = s.replace(/,\s*$/, "");
        // Count open vs close braces and brackets to close truncated JSON
        let braces = 0, brackets = 0, inString = false, escaped = false;
        for (let i = 0; i < s.length; i++) {
          const ch = s[i];
          if (escaped) { escaped = false; continue; }
          if (ch === "\\") { escaped = true; continue; }
          if (ch === '"') { inString = !inString; continue; }
          if (inString) continue;
          if (ch === "{") braces++;
          if (ch === "}") braces--;
          if (ch === "[") brackets++;
          if (ch === "]") brackets--;
        }
        // If we're inside a string, close it
        if (inString) s += '"';
        // Remove any trailing partial key-value (trailing comma, partial key, colon without value)
        s = s.replace(/,\s*"[^"]*"?\s*:?\s*"?[^"}\]]*$/, "");
        s = s.replace(/,\s*$/, "");
        // Close open brackets and braces
        for (let i = 0; i < brackets; i++) s += "]";
        for (let i = 0; i < braces; i++) s += "}";
        try { return JSON.parse(s); } catch (e2) {
          // Last resort: try to find the largest valid JSON object
          for (let end = s.length; end > 100; end--) {
            try {
              let chunk = s.slice(0, end);
              // Quick close
              const ob = (chunk.match(/{/g) || []).length - (chunk.match(/}/g) || []).length;
              const ab = (chunk.match(/\[/g) || []).length - (chunk.match(/]/g) || []).length;
              chunk = chunk.replace(/,\s*$/, "");
              for (let j = 0; j < ab; j++) chunk += "]";
              for (let j = 0; j < ob; j++) chunk += "}";
              return JSON.parse(chunk);
            } catch (e3) { continue; }
          }
          return null;
        }
      }

      const parsed = repairJSON(synthText);
      if (!parsed) {
        throw new Error("Could not parse structured data from the AI response. Try running the report again.");
      }

      setProgress(100);
      setData(parsed);
      setActiveTab("table");
      setTableView("interventional");

    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while generating the report.");
    } finally {
      setLoading(false);
    }
  }, []);

  const runCustom = useCallback(async () => {
    if (!customPrompt.trim()) return;
    const report = {
      id: "custom",
      label: "Custom Query",
      description: customPrompt,
      prompts: [customPrompt],
      systemPrompt: CANNED_REPORTS[0].systemPrompt,
    };
    setSelectedReport(report);
    await runReport(report);
  }, [customPrompt, runReport]);

  const handleCannedReport = useCallback(async (report) => {
    setSelectedReport(report);
    await runReport(report);
  }, [runReport]);

  const loadDemoData = useCallback(() => {
    setSelectedReport({ id: "demo", label: "Demo Data — Active & Upcoming Trials", description: "Synthetic demonstration data showing 27 interventional trials and 8 observational studies across all 7 MOA groups" });
    setData(DEMO_DATA);
    setRawResponses(["(Demo mode — synthetic data loaded, no API calls made)"]);
    setActiveTab("table");
    setTableView("interventional");
    setError(null);
  }, []);

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>CI</div>
          <div>
            <div style={styles.title}>IBD Competitive Intelligence</div>
            <div style={styles.subtitle}>UC & CD Clinical Trial Landscape • Powered by Live Registry Search</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {data && selectedReport?.id === "demo" && (
            <span style={{ ...styles.badge(C.purple, C.purpleDim), fontSize: 12, marginRight: 6 }}>DEMO MODE</span>
          )}
          <span style={{ width: 6, height: 6, borderRadius: 3, background: C.green }} />
          <span style={{ fontSize: 13, color: C.textMuted }}>Live Data</span>
        </div>
      </div>

      <div style={styles.main}>
        {/* Canned Reports */}
        {!loading && !data && (
          <>
            <div style={styles.section}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={styles.sectionTitle}>Canned Reports</div>
                <button
                  onClick={loadDemoData}
                  style={{
                    background: `linear-gradient(135deg, ${C.purple}22, ${C.cyan}22)`,
                    border: `1px solid ${C.purple}44`,
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: font,
                    color: C.purple,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.background = C.purple + "33"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.purple + "44"; e.currentTarget.style.background = `linear-gradient(135deg, ${C.purple}22, ${C.cyan}22)`; }}
                >
                  ▶ Load Demo Data
                </button>
              </div>
              <div style={styles.cardGrid}>
                {CANNED_REPORTS.map((r) => (
                  <div key={r.id} style={styles.card(selectedReport?.id === r.id)}
                       onClick={() => handleCannedReport(r)}
                       onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; }}
                       onMouseLeave={e => { e.currentTarget.style.borderColor = selectedReport?.id === r.id ? C.accent : C.border; }}>
                    <div style={styles.cardTitle}>{r.label}</div>
                    <div style={styles.cardDesc}>{r.description}</div>
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, color: C.accent, fontFamily: monoFont }}>{r.prompts.length} searches</span>
                      <span style={{ fontSize: 12, color: C.textDim }}>•</span>
                      <span style={{ fontSize: 12, color: C.textDim }}>Click to run</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Custom Query</div>
              <div style={styles.promptBox}>
                <textarea
                  style={styles.textarea}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ask any question about the IBD competitive landscape... e.g., 'What TL1A inhibitors are in development for UC?'"
                  rows={2}
                />
                <button style={styles.btn()} onClick={runCustom}>
                  Search ⟶
                </button>
              </div>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 10 }}>DATA SOURCES</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                {[
                  { name: "ClinicalTrials.gov", desc: "US registry — interventional & observational" },
                  { name: "EU Clinical Trials Register", desc: "European trial registry (EudraCT)" },
                  { name: "Company Press Releases", desc: "Pipeline updates & data readouts" },
                  { name: "FDA / EMA Databases", desc: "Approvals & regulatory actions" },
                  { name: "Conference Abstracts", desc: "DDW, ECCO, UEG, ACG presentations" },
                ].map((src, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ width: 6, height: 6, borderRadius: 3, background: C.accent, marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{src.name}</div>
                      <div style={{ fontSize: 13, color: C.textDim }}>{src.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && <LoadingState messages={loadingMessages} progress={progress} />}

        {/* Error */}
        {error && (
          <div style={{ background: C.redDim, border: `1px solid ${C.red}44`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.red, marginBottom: 4 }}>Error</div>
            <div style={{ fontSize: 12, color: C.text }}>{error}</div>
            <button style={{ ...styles.btn("secondary"), marginTop: 12 }} onClick={() => { setError(null); setData(null); }}>
              ← Back
            </button>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{selectedReport?.label || "Results"}</div>
                <div style={{ fontSize: 14, color: C.textMuted, marginTop: 2 }}>{selectedReport?.description}</div>
              </div>
              <button style={styles.btn("secondary")} onClick={() => { setData(null); setSelectedReport(null); }}>
                ← New Report
              </button>
            </div>

            {/* Stats */}
            {data.summary && <StatsBar data={data} />}
            {data.summary?.keyInsights && <InsightsPanel insights={data.summary.keyInsights} />}

            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              <button style={styles.tab(activeTab === "table")} onClick={() => setActiveTab("table")}>Data Table</button>
              <button style={styles.tab(activeTab === "map")} onClick={() => setActiveTab("map")}>Competitive Map</button>
              <button style={styles.tab(activeTab === "raw")} onClick={() => setActiveTab("raw")}>Raw Research</button>
            </div>

            {activeTab === "table" && (
              <>
                {data.interventional && (
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    <button style={styles.tab(tableView === "interventional")} onClick={() => setTableView("interventional")}>
                      Interventional ({data.interventional?.length || 0})
                    </button>
                    {data.observational && (
                      <button style={styles.tab(tableView === "observational")} onClick={() => setTableView("observational")}>
                        Observational ({data.observational?.length || 0})
                      </button>
                    )}
                    {(data.mechanisms || data.mechanismGroups) && (
                      <button style={styles.tab(tableView === "mechanisms")} onClick={() => setTableView("mechanisms")}>
                        Mechanisms ({data.mechanismGroups?.length || data.mechanisms?.length || 0} groups)
                      </button>
                    )}
                    {data.sponsors && (
                      <button style={styles.tab(tableView === "sponsors")} onClick={() => setTableView("sponsors")}>
                        Sponsors ({data.sponsors?.length || 0})
                      </button>
                    )}
                  </div>
                )}

                {tableView === "interventional" && data.interventional && (
                  <TrialTable trials={data.interventional} type="interventional" />
                )}
                {tableView === "observational" && data.observational && (
                  <TrialTable trials={data.observational} type="observational" />
                )}
                {tableView === "mechanisms" && (data.mechanismGroups || data.mechanisms) && (() => {
                  // Normalize: support both new mechanismGroups format and legacy mechanisms flat list
                  let groups;
                  if (data.mechanismGroups) {
                    groups = data.mechanismGroups;
                  } else if (data.mechanisms) {
                    // Legacy: group mechanisms by classifyMOAGroup
                    const byGroup = {};
                    data.mechanisms.forEach(m => {
                      const g = classifyMOAGroup(m.mechanism);
                      if (!byGroup[g.id]) byGroup[g.id] = { groupId: g.id, groupLabel: g.label, mechanisms: [], groupOutlook: "", totalDrugs: 0 };
                      byGroup[g.id].mechanisms.push(m);
                      byGroup[g.id].totalDrugs += (m.drugs || []).length;
                    });
                    groups = MOA_GROUPS.map(g => byGroup[g.id]).filter(Boolean);
                  }

                  return (
                    <div>
                      {groups.map((group, gi) => {
                        const gColor = MOA_GROUPS.find(g => g.id === group.groupId)?.color || C.textMuted;
                        const totalDrugs = group.totalDrugs || (group.mechanisms || []).reduce((s, m) => s + (m.drugs || []).length, 0);
                        return (
                          <div key={gi} style={{ marginBottom: 16 }}>
                            {/* Group header */}
                            <div style={{
                              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                              background: gColor + "11", border: `1px solid ${gColor}33`, borderRadius: "10px 10px 0 0",
                            }}>
                              <span style={{ width: 12, height: 12, borderRadius: 3, background: gColor, flexShrink: 0 }} />
                              <span style={{ fontSize: 13, fontWeight: 700, color: gColor }}>{group.groupLabel}</span>
                              <span style={{ fontSize: 13, color: C.textMuted, fontFamily: monoFont }}>{totalDrugs} drugs</span>
                              {group.groupOutlook && (
                                <span style={{ fontSize: 12, color: C.textMuted, marginLeft: "auto", maxWidth: 400, textAlign: "right" }}>
                                  {group.groupOutlook}
                                </span>
                              )}
                            </div>
                            {/* Mechanisms within group */}
                            <div style={{ border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
                              <table style={styles.table}>
                                <thead>
                                  <tr>
                                    <th style={{ ...styles.th, width: 160 }}>Mechanism</th>
                                    <th style={styles.th}>Drug</th>
                                    <th style={styles.th}>Sponsor</th>
                                    <th style={{ ...styles.th, width: 80 }}>Phase</th>
                                    <th style={{ ...styles.th, width: 60 }}>Ind.</th>
                                    <th style={{ ...styles.th, width: 80 }}>Status</th>
                                    <th style={styles.th}>Intensity</th>
                                    <th style={{ ...styles.th, maxWidth: 180 }}>Differentiator</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(group.mechanisms || []).map((m, mi) => {
                                    const drugs = m.drugs || [];
                                    return drugs.length > 0 ? drugs.map((d, di) => (
                                      <tr key={`${mi}-${di}`} style={{ background: mi % 2 === 0 ? "transparent" : C.surface + "88" }}>
                                        {di === 0 && (
                                          <td style={{ ...styles.td, fontWeight: 500, color: C.text, borderRight: `2px solid ${gColor}22` }}
                                            rowSpan={drugs.length}>
                                            <div style={{ fontSize: 11 }}>{m.mechanism}</div>
                                            {m.target && <div style={{ fontSize: 9, color: C.textDim, marginTop: 2 }}>{m.target}</div>}
                                          </td>
                                        )}
                                        <td style={{ ...styles.td, fontWeight: 600, color: C.text, fontSize: 12 }}>{d.drug}</td>
                                        <td style={{ ...styles.td, color: C.textMuted }}>{d.sponsor}</td>
                                        <td style={styles.td}>
                                          <span style={styles.badge(
                                            d.phase?.toLowerCase().includes("approved") ? C.green :
                                            d.phase?.includes("3") ? C.accent :
                                            d.phase?.includes("2") ? C.amber : C.textMuted,
                                            d.phase?.toLowerCase().includes("approved") ? C.greenDim :
                                            d.phase?.includes("3") ? C.accentDim :
                                            d.phase?.includes("2") ? C.amberDim : C.surfaceAlt,
                                          )}>{d.phase}</span>
                                        </td>
                                        <td style={{ ...styles.td, color: C.textMuted, fontSize: 11 }}>{d.indication}</td>
                                        <td style={styles.td}><StatusDot status={d.status} /></td>
                                        {di === 0 && (
                                          <td style={styles.td} rowSpan={drugs.length}>
                                            <span style={styles.badge(
                                              m.competitiveIntensity === "High" ? C.red : m.competitiveIntensity === "Medium" ? C.amber : C.green,
                                              m.competitiveIntensity === "High" ? C.redDim : m.competitiveIntensity === "Medium" ? C.amberDim : C.greenDim
                                            )}>{m.competitiveIntensity || "—"}</span>
                                          </td>
                                        )}
                                        <td style={{ ...styles.td, fontSize: 12, color: C.textDim, maxWidth: 180 }}>
                                          {d.differentiator || d.recentData || "—"}
                                        </td>
                                      </tr>
                                    )) : (
                                      <tr key={mi} style={{ background: mi % 2 === 0 ? "transparent" : C.surface + "88" }}>
                                        <td style={{ ...styles.td, fontWeight: 500, color: C.text }}>{m.mechanism}</td>
                                        <td colSpan={5} style={{ ...styles.td, color: C.textDim, fontStyle: "italic" }}>No drugs listed</td>
                                        <td style={styles.td}>
                                          <span style={styles.badge(C.textMuted, C.surfaceAlt)}>{m.competitiveIntensity || "—"}</span>
                                        </td>
                                        <td style={styles.td}>—</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}

                      {/* Emerging targets */}
                      {data.emergingTargets?.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                          <div style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                            background: C.cyanDim, border: `1px solid ${C.cyan}33`, borderRadius: "10px 10px 0 0",
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: C.cyan }}>Emerging Targets</span>
                            <span style={{ fontSize: 13, color: C.textMuted, fontFamily: monoFont }}>{data.emergingTargets.length} targets</span>
                          </div>
                          <div style={{ border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
                            <table style={styles.table}>
                              <thead>
                                <tr>
                                  <th style={styles.th}>Target</th>
                                  <th style={styles.th}>Group</th>
                                  <th style={styles.th}>Lead Program</th>
                                  <th style={styles.th}>Sponsor</th>
                                  <th style={styles.th}>Phase</th>
                                  <th style={styles.th}>Rationale</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.emergingTargets.map((t, i) => (
                                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : C.surface + "88" }}>
                                    <td style={{ ...styles.td, fontWeight: 600, color: C.text }}>{t.target}</td>
                                    <td style={styles.td}><MOABadge moa={t.group || t.target} /></td>
                                    <td style={{ ...styles.td, color: C.text }}>{t.leadProgram}</td>
                                    <td style={{ ...styles.td, color: C.textMuted }}>{t.sponsor}</td>
                                    <td style={styles.td}>
                                      <span style={styles.badge(C.amber, C.amberDim)}>{t.phase}</span>
                                    </td>
                                    <td style={{ ...styles.td, fontSize: 12, color: C.textDim, maxWidth: 200 }}>{t.rationale}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                {tableView === "sponsors" && data.sponsors && (
                  <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Company</th>
                          <th style={styles.th}>Marketed</th>
                          <th style={styles.th}>Pipeline</th>
                          <th style={styles.th}>Strategy</th>
                          <th style={styles.th}>Threat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.sponsors.map((s, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : C.surface + "88" }}>
                            <td style={{ ...styles.td, fontWeight: 600, color: C.text }}>{s.company}</td>
                            <td style={{ ...styles.td, fontSize: 11 }}>{(s.marketedProducts || []).join(", ") || "—"}</td>
                            <td style={styles.td}>
                              {(s.pipelineAssets || []).map((a, ai) => (
                                <div key={ai} style={{ fontSize: 13, marginBottom: 2, color: C.textMuted }}>
                                  <span style={{ color: C.text, fontWeight: 500 }}>{a.drug}</span> — {a.mechanism} — {a.phase}
                                </div>
                              ))}
                            </td>
                            <td style={{ ...styles.td, fontSize: 13, color: C.textMuted, maxWidth: 180 }}>{s.strategy}</td>
                            <td style={styles.td}>
                              <span style={styles.badge(
                                s.threatLevel === "High" ? C.red : s.threatLevel === "Medium" ? C.amber : C.green,
                                s.threatLevel === "High" ? C.redDim : s.threatLevel === "Medium" ? C.amberDim : C.greenDim
                              )}>{s.threatLevel}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {activeTab === "map" && <CompetitiveMap data={data} />}

            {activeTab === "raw" && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 10 }}>RAW SEARCH RESPONSES</div>
                {rawResponses.map((r, i) => (
                  <details key={i} style={{ marginBottom: 8 }}>
                    <summary style={{ fontSize: 12, color: C.accent, cursor: "pointer", padding: "6px 0" }}>
                      Search {i + 1}: {selectedReport?.prompts?.[i]?.slice(0, 80) || "Custom"}...
                    </summary>
                    <pre style={{ fontSize: 13, color: C.textMuted, whiteSpace: "pre-wrap", lineHeight: 1.6, padding: "8px 12px", background: C.bg, borderRadius: 6, marginTop: 4, maxHeight: 300, overflow: "auto" }}>
                      {r || "(no response)"}
                    </pre>
                  </details>
                ))}
              </div>
            )}

            <div style={{ marginTop: 20, padding: "12px 16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.textDim, lineHeight: 1.6 }}>
              Data sourced via live web search of ClinicalTrials.gov, EU CTR, company press releases, and pipeline databases. Results are AI-synthesized and should be verified against primary registry sources. Generated {new Date().toLocaleDateString()}.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
