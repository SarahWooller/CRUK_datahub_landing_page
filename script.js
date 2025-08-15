    const keywordsRaw = [
  // Modified Primary site structure to include a nested category
   {
    "Cancer Site - ICD-O": {
        "Lip, oral cavity and pharynx": {
        "C00 LIP": ["C00.0 External upper lip", "C00.1 External lower lip", "C00.2 External lip, NOS", "C00.3 Mucosa of upper lip", "C00.4 Mucosa of lower lip", "C00.5 Mucosa of lip, NOS", "C00.6 Commissure of lip", "C00.8 Overlapping lesion of lip", "C00.9 Lip, NOS"],
         "C01 BASE OF TONGUE": ["C01.9 Base of tongue, NOS"],
         "C02 OTHER AND UNSPECIFIED PARTS OF TONGUE": ["C02.0 Dorsal surface of tongue, NOS", "C02.1 Border of tongue", "C02.2 Ventral surface of tongue, NOS", "C02.3 Anterior 2/3 of tongue, NOS", "C02.4 Lingual tonsil", "C02.8 Overlapping lesion of tongue", "C02.9 Tongue, NOS"],
         "C03 GUM": ["C03.0 Upper Gum", "C03.1 Lower gum", "C03.9 Gum, NOS"],
         "C04 FLOOR OF MOUTH": ["C04.0 Anterior floor of mouth", "C04.1 Lateral floor of mouth", "C04.8 Overlapping lesion of floor of mouth", "C04.9 Floor of mouth, NOS"], "C05 PALATE": ["C05.0 Hard palate", "C05.1 Soft palate, NOS", "C05.2 Uvula", "C05.8 Overlapping lesion of palate", "C05.9 Palate, NOS"], "C06 OTHER AND UNSPECIFIED PARTS OF MOUTH": ["C06.0 Cheeck mucosa", "C06.1 Vestibule of mouth", "C06.2 Retromolar area", "C06.8 Overlapping lesion of other and unspecified parts of mouth", "C06.9 Mouth, NOS"], "C07 PAROTID GLANID": ["C07.9 Parotid gland"], "C08 OTHER AND UNSPECIFIED MAJOR SALIVARY GLANDS": ["C08.0 Submandibular gland", "C08.1 Sublingual gland", "C08.8 Overlapping lesion of major salivary glands", "C08.9 Major salivary gland, NOS"], "C09 TONSIL": ["C09.0 Tonsillar fossa", "C09.1 Tonsillar pillar", "C09.8 Overlapping lesion of tonsil", "C09.9 Tonsil, NOS"], "C10 OROPHARYNX": ["C10.0 Vallecula", "C10.1 Anterior surface of epiglottis", "C10.2 Lateral wall of oropharynx", "C10.3 Posterior wall of oropharynx", "C10.4 Branchial cleft", "C10.8 Overlapping lesions of oropharynx", "C10.9 Oropharynx, NOS"], "C11 NASOPHARYNX": ["C11.0 Superior wall of nasopharynx", "C11.1 Posterior wall of nasopharynx", "C11.2 Lateral wall of nasopharynx", "C11.3 Anterior wall of nasopharynx", "C11.8 Overlapping lesion of nasopharynx", "C11.9 Nasopharynx, NOS"], "C12 PYRIFORM SINUS": ["C12.9 Pyriform sinus"], "C13 HYPOPHARYNX": ["C13.0 Postcricoid region", "C13.1 Hypopharyngeal aspect of aryepiglottic fold", "C13.2 Posterior wall of hypopharynx", "C13.8 Overlapping lesion of hypopharynx", "C13.9 Hypopharynx, NOS"], "C14 OTHER AND ILL-DEFINED SITES IN LIP, ORAL CAVITY AND PHARYNX": ["C14.0 Pharynx, NOS", "C14.2 Waldeyer ring", "C14.8 Overlapping lesion of lip, oral cavity and pharynx"]
         },
         "Digestive organs" :{
         "C15 ESOPHAGUS": ["C15.0 Cervical esophagus", "C15.1 Thoracic esophagus", "C15.2 Abdominal esophagus", "C15.3 Upper third of esophagus", "C15.4 Middle third of esophagus", "C15.5 Lower third of esophagus", "C15.8 Overlapping lesion of esophagus", "C15.9 Esophagus, NOS"], "C16 STOMACH": ["C16.0 Cardia, NOS", "C16.1 Fundus of stomach", "C16.2 Body of stomach", "C16.3 Gastric antrum", "C16.4 Pylorus", "C16.5 Lesser curvature of stomach, NOS", "C16.6 Greater curvature of stomach, NOS", "C16.8 Overlapping lesion of stomach", "C16.9 Stomach, NOS"], "C17 SMALL INTESTINE": ["C17.0 Duodenum", "C17.1 Jejunum", "C17.2 Ileum", "C17.3 Meckel diverticulum", "C17.8 Overlapping lesion of small intestine", "C17.9 Small intestine, NOS"], "C18 COLON": ["C18.0 Cecum", "C18.1 Appendix", "C18.2 Ascending colon", "C18.3 Hepatic flexure of colon", "C18.4 Transverse colon", "C18.5 Splenic flexure of colon", "C18.6 Descending colon", "C18.7 Sigmoid colon", "C18.8 Overlapping lesion of colon", "C18.9 Colon, NOS"], "C19 RECTOSIGMOID JUNCTION": ["C19.9 Rectosigmoid junction"], "C20 RECTUM": ["C20.9 Rectum, NOS"], "C21 ANUS AND ANAL CANAL": ["C21.0 Anus, NOS", "C21.1 Anal canal", "C21.2 Cloacogenic zone", "C21.8 Overlapping lesion of rectum, anus and anal canal"], "C22 LIVER AND INTRAHEPATIC BILE DUCTS": ["C22.0 Liver", "C22.1 intrahepatic bile duct"], "C23 GALLBLADDER": ["C23.9 Gallbladder"], "C24 OTHER AND UNSPECIFIED PARTS OF BILIARY TRACT": ["C24.0 Extrahepatic bile duct", "C24.1 Ampulla of Vater", "C24.8 Overlapping lesion of billiary tract", "C24.9 Billiary tract, NOS"], "C25 PANCREAS": ["C25.0 Head of pancreas", "C25.1 Body of pancreas", "C25.2 Tail of pancreas", "C25.3 Pancreatic duct", "C25.4 Islets of Langerhans", "C25.7 Other specified parts of pancreas", "C25.8 Overlapping lesion of pancreas", "C25.9 Pancreas, NOS"], "C26 OTHER AND ILL-DEFINED DIGESTIVE ORGANS": ["C26.0 Intestinal tract, NOS", "C26.8 Overlapping lesion of digestive system", "C26.9 Gastrointestinal tract, NOS"]
         },
         "Respiratory and intrathoracic organs": {
             "C30 NASAL CAVITY AND MIDDLE EAR": ["C30.0 Nasal cavity", "C30.1 Middle ear"], "C31 ACCESSORY SINUSES": ["C31.0 Maxillary sinus", "C31.1 Ethmoid sinus", "C31.2 Frontal sinus", "C31.3 Sphenoid sinus", "C31.8 Overlapping lesion of accessory sinuses", "C31.9 Accessory sinus, NOS"], "C32 LARYNX": ["C32.0 Glottis", "C32.1 Supraglottis", "C32.2 Subglottis", "C32.3 Laryngeal cartilage", "C32.8 Overlapping lesion of larynx", "C32.9 Larynx, NOS"], "C33 TRACHEA": ["C33.9 Trachea"], "C34 BRONCHUS AND LUNG": ["C34.0 Main bronchus", "C34.1 Upper lobe, lung", "C34.2 Middle lobe, lung", "C34.3 Lower lobe, lung", "C34.8 Overlapping lesion of lung", "C34.9 Lung, NOS"], "C37 THYMUS": ["C37.9 Thymus"], "C38 HEART, MEDIASTINUM, AND PLEURA": ["C38.0 Heart", "C38.1 Anterior mediastinum", "C38.2 Posterior mediastinum", "C38.3 Mediastinum, NOS", "C38.4 Pleura, NOS", "C38.8 Overlapping lesion of heart, mediastinum and pleura"], "C39 OTHER AND ILL-DEFINED SITES WITHIN RESPIRATORY SYSTEM AMD INTRATHORACIC ORGANS": ["C39.0 Upper respiratory tract, NOS", "C39.8 Overlapping lesion of respiratory system and intrathoracic organs", "C39.9 Ill-defined sites within respiratory system"]
             },
         "Bones and articular cartilage": {
            "C40 BONES, JOINTS AND ARTICULAR CARTILAGE OF LIMBS": ["C40.0 Long bones of upper limb, scapula and associated joints", "C40.1 Short bones of upper limb and associated joints", "C40.2 Long bones of lower limb and associated joints", "C40.3 Short bones of lower limb and associated joints", "C40.8 Overlapping lesion of bones, joints and articular cartilage of limbs", "C40.9 Bone of limb, NOS"], "C41 BONES, JOINTS AND ARTICULAR CARTILAGE OF OTHER AND UNSPECIFIED SITES": ["C41.0 Bones of skull and face and associated joints", "C41.1 Mandible", "C41.2 Vertebral column", "C41.3 Rib, sternum, clavicle and associated joints", "C41.4 Pelvic bones, sacrum, coccyx and associated joints", "C41.8 Overlapping lesion of bones, joints and articular cartilage", "C41.9 Bone, NOS"]
         },
         "Blood, bone marrow and immune": {
          "C42 HEMATOPOIETIC AND RETICULOENDOTHELIAL SYSTEMS": ["C42.0 Blood", "C42.1 Bone marrow", "C42.2 Spleen", "C42.3 Reticuloendothelial system, NOS", "C42.4 Hematopoietic system, NOS"
          ],
          "C43 MALIGNANT MELANOMA OF SKIN NCCS":[
            "C43.0 Malignant melanoma of lip",
            "C43.1 Malignant melanoma of eyelid, including canthus",
            "C43.2 Malignant melanoma of ear and external auricular canal",
            "C43.3 Malignant melanoma of other and unspecified parts of face",
            "C43.4 Malignant melanoma of scalp and neck",
            "C43.5 Malignant melanoma of trunk",
            "C43.6 Malignant melanoma of upper limb, including shoulder",
            "C43.7 Malignant melanoma of lower limb, including hip",
            "C43.8 Overlapping malignant melanoma of skin",
            "C43.9 Malignant melanoma of skin, unspecified"
         ],
         "C44 OTHER MALIGNANT NEOPLASMS OF SKIN NCCS": ["C44.0 Skin of lip, NOS", "C44.1 Eyelid", "C44.2 External ear", "C44.3 Skin of other and unspecified parts of face", "C44.4 Skin of scalp and neck", "C44.5 Skin of trunk", "C44.6 Skin of upper limb and shoulder", "C44.7 Skin of lower limb and hip", "C44.8 Overlapping lesion of skin", "C44.9 Skin, NOS"]
         },
         "Mesothelial and soft tissue":{
         "C45 MESOTHELIOMA NCCS":
            ["C45.0 Mesothelioma of pleura",
            "C45.1 Mesothelioma of peritoneum",
            "C45.2 Mesothelioma of pericardium",
            "C45.7 Mesothelioma of other sites",
            "C45.9 Mesothelioma, unspecified"],
          "C46 KAPOSI SARCOMA NCCS": [
        "C46.0 Kaposi sarcoma of skin",
        "C46.1 Kaposi sarcoma of soft tissue",
        "C46.2 Kaposi sarcoma of palate",
        "C46.3 Kaposi sarcoma of lymph nodes",
        "C46.7 Kaposi sarcoma of other sites",
        "C46.8 Kaposi sarcoma of multiple organs",
        "C46.9 Kaposi sarcoma, unspecified"],

         "C47 PERIPHERAL NERVES AND AUTONOMIC NERVOUS SYSTEM": ["C47.0 Peripheral nerves and autonomic nervous system of head, face, and neck", "C47.1 Peripheral nerves and autonomic nervous system of upper limb and shoulder", "C47.2 Peripheral nerves and autonomic nervous system of lower limb and hip", "C47.3 Peripheral nerves and autonomic nervous system of thorax", "C47.4 Peripheral nerves and autonomic nervous system of abdomen", "C47.5 Peripheral nerves and autonomic nervous system of pelvis", "C47.6 Peripheral nerves and autonomic nervous system of trunk, NOS", "C47.8 Overlapping lesion of peripheral nerves and autonomic nervous system", "C47.9 Autonomic nervous system, NOS"], "C48 RETROPERITONEUM AND PERITONEUM": ["C48.0 Retroperitoneum", "C48.1 Specified parts of peritoneum", "C48.2 Peritoneum, NOS", "C48.8 Overlapping lesion of retroperitoneum and peritoneum"], "C49 CONNECTIVE, SUBCUTANEOUS AND OTHER SOFT TISSUES": ["C49.0 Connective, Subcutaneous and other soft tissues of head, face, and neck", "C49.1 Connective, Subcutaneous and other soft tissues of upper limb and shoulder", "C49.2 Connective, Subcutaneous and other soft tissues of lower limb and hip", "C49.3 Connective, Subcutaneous and other soft tissues of thorax", "C49.4 Connective, Subcutaneous and other soft tissues of abdomen", "C49.5 Connective, Subcutaneous and other soft tissues of pelvis", "C49.6 Connective, Subcutaneous and other soft tissues of trunk, NOS", "C49.8 Overlapping lesion of connective, subcutaneous and other soft tissues", "C49.9 Connective, Subcutaneous and other soft tissues, NOS"]
         },
         "Breast": {
             "C50 BREAST": [
                "C50.0 Nipple",
                "C50.1 Central portion of breast",
                "C50.2 Upper-inner quadrant of breast",
                "C50.3 Lower-inner quadrant of breast",
                "C50.4 Upper-outer quadrant of breast",
                "C50.5 Lower-outer quadrant of breast",
                "C50.6 Axillary tail of breast",
                "C50.8 Overlapping lesion of breast",
                "C50.9 Breast, NOS"]
             },
         "Female genitals": {
            "C51 VULVA": ["C51.0 Labium majus", "C51.1 Labium minus", "C51.2 Clitorus", "C51.8 Overlapping lesion of vulva", "C51.9 Vulva, NOS"], "C52 VAGINA": ["C52.9 Vagina, NOS"], "C53 CERVIX UTERI": ["C53.0 Endocervix", "C53.1 Exocervix", "C53.8 Overlapping lesion of cervix uteri", "C53.9 Cervix uteri"], "C54 CORPUS UTERI": ["C54.0 Isthmus uteri", "C54.1 Endometrium", "C54.2 Myometrium", "C54.3 Fundus uteri", "C54.8 Overlapping lesion of corpus uteri", "C54.9 Corpus uteri"], "C55 UTERUS, NOS": ["C55.9 Uterus, NOS"], "C56 OVARY": ["C56.9 Ovary"], "C57 OTHER AN UNSPECIFIED FEMALE GENITAL ORGANS": ["C57.0 Fallopian tube", "C57.1 Broad ligament", "C57.2 Round ligament", "C57.3 Parametrium", "C57.4 Uterine adnexa", "C57.7 Other specified parts of female genital organs", "C57.8 Overlapping lesion of female genital organs", "C57.9 Female genital tract, NOS"], "C58 PLACENTA": ["C58.9 Placenta"]
            },
        "Male genitals":{
            "C60 PENIS": ["C60.0 Prepuce", "C60.1 Glans penis", "C60.2 Body of penis", "C60.8 Overlapping lesion of penis", "C60.9 Penis, NOS"], "C61 PROSTATE GLAND": ["C61.9 Prostate gland"], "C62 TESTIS": ["C62.0 Undescended testis", "C62.1 Descended testis", "C62.9 Testis, NOS"], "C63 OTHER AND UNSPECIFIED MALE GENITAL ORGANS": ["C63.0 Epididymis", "C63.1 Spermatic cord", "C63.2 Scrotum, NOS", "C63.7 Other specified parts of male genital organs", "C63.8 Overlapping lesion of male genital organs", "C63.9 Male genital organs, NOS"]
            },
         "Urinary tract": {
            "C64 KIDNEY": ["C64.9 Kidney, NOS"], "C65 RENAL PELVIS": ["C65.9 Renal pelvis"], "C66 URETER": ["C66.9 Ureter"], "C67 BLADDER": ["C67.0 Trigone of bladder", "C67.1 Dome of bladder", "C67.2 Lateral wall of bladder", "C67.3 Anterior wall of bladder", "C67.4 Posterior wall of bladder", "C67.5 Bladder neck", "C67.6 Ureteric orifice", "C67.7 Urachus", "C67.8 Overlapping lesion of bladder", "C67.9 Bladder, NOS"], "C68 OTHER AND UNSPECIFIED URINARY ORGANS": ["C68.0 Urethra", "C68.1 Paraurethral gland", "C68.8 Overlapping lesion of urinary organs", "C68.9 Urinary system, NOS"]
            },
         "Eye, brain and other parts of central nervous system": {
             "C69 EYE AND ADNEXA":
             ["C69.0 Conjunctiva", "C69.1 Cornea, NOS", "C69.2 Retina", "C69.3 Choroid", "C69.4 Ciliary body", "C69.5 Lacrimal gland", "C69.6 Orbit, NOS", "C69.8 Overlapping lesion of eye and adnexa", "C69.9 Eye, NOS"], "C70 MENINGES": ["C70.0 Cerebral meninges", "C70.1 Spinal meninges", "C70.9 Meninges, NOS"], "C71 BRAIN": ["C71.0 Cerebrum", "C71.1 Frontal lobe", "C71.2 Temporal lobe", "C71.3 Parietal lobe", "C71.4 Occipital lobe", "C71.5 Ventricle, NOS", "C71.6 Cerebellum, NOS", "C71.7 Brain stem", "C71.8 Overlapping lesion of brain", "C71.9 Brain, NOS"], "C72 SPINAL CORD, CRANIAL NERVES, AND OTHER PARTS OF CENTRAL NERVOUS SYSTEM": ["C72.0 Spinal cord", "C72.1 Cauda equina", "C72.2 Olfactory nerve", "C72.3 Optic nerve", "C72.4 Acoustic nerve", "C72.5 Cranial nerve, NOS", "C72.8 Overlapping lesion of brain and central nervous system", "C72.9 Nervous system, NOS"]
             },
         "Thyroid and other endocrine glands": {
            "C73 THYROID GLAND": ["C73.9 Thyroid gland"], "C74 ADRENAL GLAND": ["C74.0 Cortex of adrenal gland", "C74.1 Medulla of adrenal gland", "C74.9 Adrenal gland, NOS"], "C75 OTHER ENDOCRINE GLANDS AND RELATED STRUCTURES": ["C75.0 Parathyroid gland", "C75.1 Pituitary gland", "C75.2 Craniopharyngeal duct", "C75.3 Pineal gland", "C75.4 Carotid body", "C75.5 Aortic body and other paraganglia", "C75.8 Overlapping lesion of endocrine glands and related structures", "C75.9 Endocrine gland, NOS"]
         },

         "Ill-defined, secondary, and unspecified sites":{
             "C76 OTHER AND ILL-DEFINED SITES": ["C76.0 Head, face or neck, NOS", "C76.1 Thorax, NOS", "C76.2 Abdomen, NOS", "C76.3 Pelvis, NOS", "C76.4 Upper limb, NOS", "C76.5 Lower limb, NOS", "C76.7 Other ill-defined sites", "C76.8 Overlapping lesion of ill-defined sites"],
             "C77 LYMPH NODES": ["C77.0 Lymph nodes of head, face and neck", "C77.1 Intrathoracic lymph nodes", "C77.2 Intra-abdominal lymph nodes", "C77.3 Lymph nodes of axilla or arm", "C77.4 Lymph nodes of inguinal region or leg", "C77.5 Pelvic lymph nodes", "C77.8 Lymph nodes of multiple regions", "C77.9 Lymph node, NOS"],
             "C80 UNKNOWN PRIMARY SITE": ["C80.9 Unknown primary site"]
         },
         "Lymphoid, haematopoietic and related tissue": {
         'C81 Hodgkin lymphoma NCCS ': ['C81.0 Nodular lymphocyte predominant Hodgkin lymphoma',
      'C81.1 Nodular sclerosis (classical) Hodgkin lymphoma',
      'C81.2 Mixed cellularity (classical) Hodgkin lymphoma',
      'C81.3 Lymphocyte depleted (classical) Hodgkin lymphoma',
      'C81.4 Lymphocyte-rich (classical) Hodgkin lymphoma',
      'C81.7 Other (classical) Hodgkin lymphoma',
      'C81.9 Hodgkin lymphoma, unspecified'],
     'C82 Follicular lymphoma NCCS ': ['C82.0 Follicular lymphoma grade I',
      'C82.1 Follicular lymphoma grade II',
      'C82.2 Follicular lymphoma grade III, unspecified',
      'C82.3 Follicular lymphoma grade IIIa',
      'C82.4 Follicular lymphoma grade IIIb',
      'C82.5 Diffuse follicle centre lymphoma',
      'C82.6 Cutaneous follicle centre lymphoma',
      'C82.7 Other types of follicular lymphoma',
      'C82.9 Follicular lymphoma, unspecified'],
     'C83 Non-follicular lymphoma NCCS ': ['C83.0 Small cell B-cell lymphoma',
      'C83.1 Mantle cell lymphoma',
      'C83.3 Diffuse large B-cell lymphoma',
      'C83.5 Lymphoblastic (diffuse) lymphoma',
      'C83.7 Burkitt lymphoma',
      'C83.8 Other non-follicular lymphoma',
      'C83.9 Non-follicular (diffuse) lymphoma, unspecified'],
     'C84 Mature T/NK-cell lymphomas NCCS ': ['C84.0 Mycosis fungoides',
      'C84.1 Sézary disease',
      'C84.4 Peripheral T-cell lymphoma, not elsewhere classified',
      'C84.5 Other mature T/NK-cell lymphomas',
      'C84.6 Anaplastic large cell lymphoma, ALK-positive',
      'C84.7 Anaplastic large cell lymphoma, ALK-negative',
      'C84.8 Cutaneous T-cell lymphoma, unspecified',
      'C84.9 Mature T/NK-cell lymphoma, unspecified'],
     'C85 Other and unspecified types of non-Hodgkin lymphoma NCCS ': ['C85.1 B-cell lymphoma, unspecified',
      'C85.2 Mediastinal (thymic) large B-cell lymphoma',
      'C85.7 Other specified types of non-Hodgkin lymphoma',
      'C85.9 Non-Hodgkin lymphoma, unspecified'],
     'C86 Other specified types of T/NK-cell lymphoma NCCS ': ['C86.0 Extranodal NK/T-cell lymphoma, nasal type',
      'C86.1 Hepatosplenic T-cell lymphoma',
      'C86.2 Enteropathy-type (intestinal) T-cell lymphoma',
      'C86.3 Subcutaneous panniculitis-like T-cell lymphoma',
      'C86.4 Blastic NK-cell lymphoma',
      'C86.5 Angioimmunoblastic T-cell lymphoma',
      'C86.6 Primary cutaneous CD30-positive T-cell proliferations'],
     'C88 Malignant immunoproliferative diseases NCCS ': ['C88.0 Waldenström macroglobulinaemia',
      'C88.2 Other heavy chain disease',
      'C88.3 Immunoproliferative small intestinal disease',
      'C88.4 Extranodal marginal zone B-cell lymphoma of mucosa-associated lymphoid tissue [MALT-lyphoma]',
      'C88.7 Other malignant immunoproliferative diseases',
      'C88.9 Malignant immunoproliferative disease, unspecified'],
     'C90 Multiple myeloma and malignant plasma cell neoplasms NCCS ': ['C90.0 Multiple myeloma NCCS ',
      'C90.1 Plasma cell leukaemia',
      'C90.2 Extramedullary plasmacytoma',
      'C90.3 Solitary plasmacytoma'],
     'C91 Lymphoid leukaemia NCCS ': ['C91.0 Acute lymphoblastic leukaemia [ALL]',
      'C91.1 Chronic lymphocytic leukaemia of B-cell type',
      'C91.3 Prolymphocytic leukaemia of B-cell type',
      'C91.4 Hairy-cell leukaemia',
      'C91.5 Adult T-cell lymphoma/leukaemia [HTLV-1-associated]',
      'C91.6 Prolymphocytic leukaemia of T-cell type',
      'C91.7 Other lymphoid leukaemia',
      'C91.8 Mature B-cell leukaemia Burkitt-type',
      'C91.9 Lymphoid leukaemia, unspecified'],
     'C92 Myeloid leukaemia NCCS ': ['C92.0 Acute myeloblastic leukaemia [AML]',
      'C92.1 Chronic myeloid leukaemia [CML], BCR/ABL-positive',
      'C92.2 Atypical chronic myeloid leukaemia, BCR/ABL- negative',
      'C92.3 Myeloid sarcoma',
      'C92.4 Acute promyelocytic leukaemia [PML]',
      'C92.5 Acute myelomonocytic leukaemia',
      'C92.6 Acute myeloid leukaemia with 11q23-abnormality',
      'C92.7 Other myeloid leukaemia',
      'C92.8 Acute myeloid leukaemia with multilineage dysplasia',
      'C92.9 Myeloid leukaemia, unspecified'],
     'C93 Monocytic leukaemia NCCS ': ['C93.0 Acute monoblastic/monocytic leukaemia',
      'C93.1 Chronic myelomonocytic leukaemia',
      'C93.3 Juvenile myelomonocytic leukaemia',
      'C93.7 Other monocytic leukaemia',
      'C93.9 Monocytic leukaemia, unspecified'],
     'C94 Other leukaemias of specified cell type NCCS ': ['C94.0 Acute erythroid leukaemia',
      'C94.2 Acute megakaryoblastic leukaemia',
      'C94.3 Mast cell leukaemia',
      'C94.4 Acute panmyelosis with myelofibrosis',
      'C94.6 Myelodysplastic and myeloproliferative disease, not elsewhere classified',
      'C94.7 Other specified leukaemias',
      'C95 Leukaemia of unspecified cell type NCCS ',
      'C95.0 Acute leukaemia of unspecified cell type',
      'C95.1 Chronic leukaemia of unspecified cell type',
      'C95.7 Other leukaemia of unspecified cell type',
      'C95.9 Leukaemia, unspecified'],
     'C96 Other and unspecified malignant neoplasms of lymphoid, haematopoietic and related tissue NCCS ': ['C96.0 Multifocal and multisystemic (disseminated) Langerhans-cell histiocytosis [Letterer-Siwe disease]',
      'C96.2 Malignant mast cell tumour',
      'C96.4 Sarcoma of dendritic cells (accessory cells)',
      'C96.5 Multifocal and unisystemic Langerhans-cell histiocytosis',
      'C96.6 Unifocal Langerhans-cell histiocytosis',
      'C96.7 Other specified malignant neoplasms of lymphoid, haematopoietic and related tissue',
      'C96.8 Histiocytic sarcoma',
      'C96.9 Malignant neoplasm of lymphoid, haematopoietic and related tissue, unspecified']
      },
      "Malignant neoplasms of independent (primary) multiple sites" : [
      'C97 Malignant neoplasms of independent (primary) multiple sites'
      ]

    }
  },
  {
    "In Vitro Study": {

        "Model": [
            "Organ on a Chip",
            "3D organoid (including on a chip)",
            "Organ slice"
        ],
        "Cell Source": [
          "Immortalised cell-line",
          "Patient derived",
          "Animal"
        ],
        "Treatment": [
           "Cell and cell-derived treatment",
           "Gene knock-down",
           "Medication",
           "Radiation"
        ]}
  },
  {
    "Animal Model": {
      "Animal": [
        "Chicken",
        "Dog",
        "Fruit fly",
        "Mouse",
        "Rabbit",
        "Rat"
      ],
       "Animal description": [
        "Genetically engineered",
        "Immuno-compromised",
        "Patient-Derived xenograft",
        "Syngeneic"
      ],
      "Biobank Samples": [
        "Bloods",
        "Cells",
        "DNA/RNA",
        "Other Fluids",
        "Tissues"
      ],
      "Biopsy & Lab Results": [
        "Biomarkers",
        "Flow Cytometry",
        "Immunohistochemistry"
      ],
      "Imaging Data": [
        "Bioluminescence Imaging",
        "Fluorescence Imaging",
        "Magnetic Resonance Imaging",
        "Medical photography",
        "Microscopy",
        "Nuclear medicine imaging procedure",
        "Radiographic imaging procedure",
        "Ultrasonography",
      ],
      "Longitudinal Follow up": [
        "Behavioural data",
        "Clinical observations",
        "Response outcomes",
        "Side effects",
        "Survival data"
      ],
      "Multi-omic Data": [
        "Circulating tumour cells",
        "Circulating tumour DNA",
        "Copy Number Variations",
        "Epigenetic Data",
        "Exosomes/Genomes",
        "Fusion Genes",
        "Germline Mutations",
        "Metabolomics",
        "Protein expression profiles",
        "RNA Sequence Expression Profile",
        "Single-cell",
        "Somatic Mutations",
        "Spatial Biology Data"
      ],
      "Treatments": [
        "Medication",
        "Cell and cell-derived treatments",
        "Micro-biome alterations",
        "Organ resection and other ablations",
        "Radiotherapies"
      ],
    }
  },
  {
    "Patient study": {
      "Background": [
        "Child and Young Person",
        "Seniors",
        "Demographic",
        "Family history",
        "Lifestyle",
        "Quality of life (eg Education and/or employment)"
      ],
      "Biobank Samples": [
        "Bloods",
        "Cells",
        "DNA/RNA",
        "Other Fluids",
        "Organoids",
        "Primary cell lines",
        "Tissues"
      ],
      "Biopsy Reports and Lab Results": [
        "Biomarkers",
        "Complete blood count",
        "H&E-stained tissue microarrays",
        "Immunohistochemistry",
        "Kidney function tests",
        "Liver function tests",
        "Other bodily fluid analyses",
        "Tumour details",
        "Urine tests"
      ],
      "Imaging Data": [
        "Bioluminescence Imaging",
        "Fluorescence Imaging",
        "Magnetic Resonance Imaging",
        "Medical photography",
        "Microscopy",
        "Nuclear medicine imaging procedure",
        "Radiographic imaging procedure",
        "Ultrasonography",
      ],
      "Longitudinal Follow up": [
        "Patient-Reported Outcomes",
        "Response outcomes",
        "Side effects",
        "Survival data"
      ],
      "Multi-omic Data": [
        "Circulating tumour cells",
        "Circulating tumour DNA",
        "Copy Number Variations",
        "Epigenetic Data",
        "Exosomes/Genomes",
        "Fusion Genes",
        "Germline Mutations",
        "Metabolomics",
        "Protein expression profiles",
        "RNA Sequence Expression Profile",
        "Single-cell",
        "Somatic Mutations",
        "Spatial Biology Data"
      ],
      "Treatments": [
        "Medication",
        "Organ resection and other ablations",
        "Radiotherapies"
      ]
    }
  },
  {
    "Population Study": {
      "Data Sources": [
        "Administrative data (e.g., insurance claims)",
        "Biobanks (population cohorts)",
        "Cancer registries",
        "Electronic Health Records (EHR)",
        "Environmental monitoring data",
        "National health surveys"
      ],
      "Interventions/Policies": [
        "Health education campaigns",
        "Policy changes",
        "Prevention programs",
        "Screening programs"
      ],
      "Outcomes Measured": [
        "Education/Employment",
        "Incidence",
        "Morbidity/Mortality",
        "Social well-being"
      ],
      "Population Demographics": [
        "Age",
        "Ethnicity",
        "Geographic location",
        "Sex",
        "Socioeconomic Status"
      ],
      "Risk Factors": [
        "Environmental",
        "Genetic",
        "Infections",
        "Lifestyle",
        "Medical history",
        "Occupational"
      ],
      "Study Design": [
        "Case-control study",
        "Cohort study",
        "Cross-sectional study",
        "Ecological study",
        "Intervention study"
      ]
    }
  }
];
    const ROOT = keywordsRaw.reduce((acc, obj) => Object.assign(acc, obj), {});
    const filterButton = document.getElementById('filterButton');
    const overlay = document.getElementById('overlay');
    const panel = document.getElementById('filterPanel');
    const breadcrumbEl = document.getElementById('breadcrumb');
    const choicesEl = document.getElementById('choices');
    const closeBtn = document.getElementById('closeBtn');
    const backBtn = document.getElementById('backBtn');
    const clearBtn = document.getElementById('clearBtn');
    const doneBtn = document.getElementById('doneBtn');
    const chipsEl = document.getElementById('selectedChips');
    let path = [];
    const selected = new Set();
    function getNodeFromPath(root, pth){return pth.reduce((node, key) => (node && typeof node === 'object') ? node[key] : undefined, root);}
    function isLeaf(node){return Array.isArray(node);}
    function openPanel(){panel.classList.add('open');overlay.classList.add('open');render();}
    function closePanel(){panel.classList.remove('open');overlay.classList.remove('open');}
    function updateFilterButtonCount(){filterButton.textContent = `STUDY FILTERS (${selected.size})`;}
    function renderChips(){chipsEl.innerHTML = '';[...selected].forEach(value => {const span=document.createElement('span');span.className='chip';span.innerHTML = `${value} <button>×</button>`;span.querySelector('button').addEventListener('click', () => {selected.delete(value);updateFilterButtonCount();render();renderChips();});chipsEl.appendChild(span);});}
    function renderBreadcrumb(){breadcrumbEl.innerHTML='';const home=document.createElement('span');home.textContent='Home';home.className=path.length?'crumb':'crumb current';if(path.length)home.addEventListener('click',()=>{path=[];render();});breadcrumbEl.appendChild(home);path.forEach((key,idx)=>{const sep=document.createElement('span');sep.textContent='›';sep.style.margin='0 4px';breadcrumbEl.appendChild(sep);const crumb=document.createElement('span');crumb.textContent=key;const isCurrent=idx===path.length-1;crumb.className=isCurrent?'crumb current':'crumb';if(!isCurrent){crumb.addEventListener('click',()=>{path=path.slice(0,idx+1);render();});}breadcrumbEl.appendChild(crumb);});}
    function renderChoices(){
      choicesEl.innerHTML = '';
      const node = getNodeFromPath(ROOT, path) ?? ROOT;

      if (node && typeof node === 'object' && !Array.isArray(node)) {
        Object.keys(node).forEach(key => {
          const value = node[key];

          // Skip numeric keys from arrays appearing as objects
          if (Array.isArray(node) && !isNaN(key)) return;

          const li = document.createElement('li');
          li.className = 'list-item';

          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.checked = selected.has(key);
          cb.addEventListener('change', () => {
            if (cb.checked) selected.add(key);
            else selected.delete(key);
            updateFilterButtonCount();
            renderChips();
          });

          const label = document.createElement('span');
          label.textContent = key;
          label.addEventListener('click', () => {
            if (typeof value === 'object') {
              path.push(key);
              render();
            } else {
              cb.checked = !cb.checked;
              cb.dispatchEvent(new Event('change'));
            }
          });

          li.appendChild(cb);
          li.appendChild(label);
          choicesEl.appendChild(li);
        });
      }

      if (isLeaf(node)) {
        node.forEach(item => {
          if (typeof item === 'object') return; // skip nested objects in array
          const li = document.createElement('li');
          li.className = 'list-item';

          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.checked = selected.has(item);
          cb.addEventListener('change', () => {
            if (cb.checked) selected.add(item);
            else selected.delete(item);
            updateFilterButtonCount();
            renderChips();
          });

          const label = document.createElement('span');
          label.textContent = item;
          li.appendChild(cb);
          li.appendChild(label);
          choicesEl.appendChild(li);
        });
      }
    }

function render(){renderBreadcrumb();renderChoices();updateFilterButtonCount();}
    filterButton.addEventListener('click',()=>{panel.classList.contains('open')?closePanel():openPanel();});
    overlay.addEventListener('click',closePanel);
    closeBtn.addEventListener('click',closePanel);
    backBtn.addEventListener('click',()=>{if(path.length){path.pop();render();}});
    clearBtn.addEventListener('click',()=>{selected.clear();updateFilterButtonCount();renderChips();render();});
    doneBtn.addEventListener('click',closePanel);
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))closePanel();});
    render();renderChips();


document.addEventListener('DOMContentLoaded', () => {
    // Mock Data for 50 Cancer Studies
    const studiesData = [];
    const titles = [
        "Genomic Profiling of Triple-Negative Breast Cancer",
        "AI-Driven Drug Discovery for Pancreatic Cancer",
        "Immunotherapy Response in Lung Cancer Patients",
        "Early Detection Biomarkers for Ovarian Cancer",
        "Personalized Radiation Therapy for Brain Tumors",
        "Epigenetic Modifications in Colon Cancer Progression",
        "Targeting Metabolism in Glioblastoma Multiforme",
        "Circulating Tumor DNA for Disease Monitoring",
        "Novel Therapies for Pediatric Leukemias",
        "Understanding Metastasis in Prostate Cancer",
        "CRISPR-Cas9 Applications in Cancer Gene Editing",
        "Gut Microbiome Influence on Cancer Treatment",
        "Nanoparticle Delivery Systems for Chemotherapy",
        "Patient-Derived Organoids for Drug Screening",
        "Inflammation and Cancer Development",
        "Liquid Biopsies for Early Cancer Recurrence",
        "CAR T-Cell Therapy for Solid Tumors",
        "Exercise Interventions for Cancer Survivors",
        "Nutritional Impact on Cancer Prevention",
        "Psychosocial Support for Cancer Patients",
        "Precision Oncology in Head and Neck Cancer",
        "Radiomics for Predicting Treatment Outcomes",
        "Single-Cell Sequencing in Tumor Heterogeneity",
        "Development of Cancer Vaccines",
        "Role of Telomeres in Cancer Aging",
        "Pharmacogenomics in Cancer Drug Response",
        "Sleep Disturbances in Cancer Patients",
        "Palliative Care Innovations in Oncology",
        "Health Disparities in Cancer Outcomes",
        "Bioinformatics for Cancer Data Integration",
        "Digital Pathology for Cancer Diagnosis",
        "Wearable Devices for Symptom Monitoring",
        "Robotic Surgery Outcomes in Oncology",
        "Gene Therapy for Rare Cancers",
        "Drug Repurposing for Cancer Treatment",
        "Impact of Air Pollution on Cancer Risk",
        "Biomarkers for Chemoresistance in Cancer",
        "Cancer Stem Cell Biology and Therapy",
        "Artificial Pancreas for Diabetes in Cancer",
        "Proton Therapy for Complex Tumors",
        "MicroRNA Profiling in Cancer Detection",
        "Targeting Angiogenesis in Advanced Cancers",
        "Patient Reported Outcomes in Clinical Trials",
        "Ethical Considerations in Cancer Research",
        "Global Cancer Incidence and Mortality Trends",
        "Telemedicine in Oncology Care",
        "Natural Killer Cell Therapies for Leukemia",
        "Impact of Stress on Cancer Progression",
        "AI for Medical Imaging in Oncology",
        "Understanding Cancer Fatigue Mechanisms"
    ];
    const institutes = [
        "Cancer Research Institute", "Global Oncology Center", "Biomedical Research Hub",
        "University Cancer Center", "National Health Institute", "Clinical Trials Unit",
        "Translational Medicine Group", "Genomics Research Lab", "Oncology Innovation Center",
        "Precision Medicine Institute"
    ];

    for (let i = 1; i <= 50; i++) {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomInstitute = institutes[Math.floor(Math.random() * institutes.length)];
        const randomDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        studiesData.push({
            id: i,
            studyTitle: `${randomTitle} (Study ${i})`,
            leadResearcherInstitute: `Dr. ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}. ${randomInstitute}`,
            dateAdded: randomDate.toISOString().split('T')[0] // YYYY-MM-DD
        });
    }

    const studiesTableBody = document.getElementById('studies-table-body');
    const searchBar = document.getElementById('search-bar');
    const tableHeaders = document.querySelectorAll('.studies-table th[data-sort]');

    let currentSortColumn = null;
    let currentSortDirection = 'asc'; // 'asc' or 'desc'

    // Function to render the table
    function renderTable(data) {
        studiesTableBody.innerHTML = ''; // Clear existing rows
        data.forEach(study => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${study.studyTitle}</td>
                <td>${study.leadResearcherInstitute}</td>
                <td>${study.dateAdded}</td>
                <td><button class="explore-btn" data-study-id="${study.id}" data-study-title="${study.studyTitle}">Explore</button></td>
            `;
            studiesTableBody.appendChild(row);
        });

        // Add event listeners to new explore buttons
        document.querySelectorAll('.explore-btn').forEach(button => {
            button.addEventListener('click', handleExploreClick);
        });
    }

    // Function to handle explore button click
    function handleExploreClick(event) {
        const studyId = event.target.dataset.studyId;
        const studyTitle = event.target.dataset.studyTitle;
        const options = `
            Options for Study: "${studyTitle}" (ID: ${studyId})
            1. Watch a video
            2. View slides
            3. Add to library
        `;
        alert(options); // Using alert for mock-up
        // In a real application, you would show a modal or navigate
    }

    // Initial render of the table
    renderTable(studiesData);

    // Search functionality
    searchBar.addEventListener('keyup', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredStudies = studiesData.filter(study =>
            study.studyTitle.toLowerCase().includes(searchTerm) ||
            study.leadResearcherInstitute.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredStudies);
    });

    // Table Sorting functionality
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;

            // Reset sort indicators
            tableHeaders.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });

            if (currentSortColumn === column) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortDirection = 'asc';
            }

            // Add active sort class
            header.classList.add(`sort-${currentSortDirection}`);

            const sortedData = [...studiesData].sort((a, b) => {
                let valA = a[column];
                let valB = b[column];

                if (column === 'dateAdded') {
                    valA = new Date(valA);
                    valB = new Date(valB);
                }

                if (valA < valB) {
                    return currentSortDirection === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return currentSortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            });
            renderTable(sortedData);
        });
    });

    // Nested filter collapse/expand functionality (basic toggle)
    document.querySelectorAll('.filter-category').forEach(category => {
        category.addEventListener('click', (event) => {
            const nestedList = event.target.nextElementSibling;
            if (nestedList && nestedList.classList.contains('nested-filter-list')) {
                nestedList.style.display = nestedList.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

    // Initially hide all nested filter lists except the top level ones
    document.querySelectorAll('.nested-filter-list').forEach(list => {
        // Only hide if it's not a direct child of .filter-list (i.e., deeper nested)
        if (!list.parentElement.classList.contains('filter-list')) {
            list.style.display = 'none';
        }
    });

    // Filter checkbox functionality (for console logging only, no actual filtering implemented yet)
    document.querySelectorAll('.study-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const selectedFilters = Array.from(document.querySelectorAll('.study-filters input[type="checkbox"]:checked'))
                                       .map(cb => cb.value);
            console.log('Selected Filters:', selectedFilters);
            // In a full implementation, you would filter the studiesData array here
            // and then call renderTable(filteredData);
        });
    });
});