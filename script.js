const keywordsRaw = [
    {"Cancer ICD-0 topography":  { "include all" : [],  "C00-C14 Lip, oral cavity and pharynx":  { "include all" : [],  "C00 Lip":  [ "include all", "C00.0 External upper lip", "C00.1 External lower lip", "C00.2 External lip, nos", "C00.3 Mucosa of upper lip", "C00.4 Mucosa of lower lip", "C00.5 Mucosa of lip, nos", "C00.6 Commissure of lip", "C00.8 Overlapping lesion of lip", "C00.9 Lip, nos"], "C01 Base of tongue":  [ "include all", "C01.9 Base of tongue, nos"], "C02 Other and unspecified parts of tongue":  [ "include all", "C02.0 Dorsal surface of tongue, nos", "C02.1 Border of tongue", "C02.2 Ventral surface of tongue, nos", "C02.3 Anterior 2/3 of tongue, nos", "C02.4 Lingual tonsil", "C02.8 Overlapping lesion of tongue", "C02.9 Tongue, nos"], "C03 Gum":  [ "include all", "C03.0 Upper gum", "C03.1 Lower gum", "C03.9 Gum, nos"], "C04 Floor of mouth":  [ "include all", "C04.0 Anterior floor of mouth", "C04.1 Lateral floor of mouth", "C04.8 Overlapping lesion of floor of mouth", "C04.9 Floor of mouth, nos"], "C05 Palate":  [ "include all", "C05.0 Hard palate", "C05.1 Soft palate, nos", "C05.2 Uvula", "C05.8 Overlapping lesion of palate", "C05.9 Palate, nos"], "C06 Other and unspecified parts of mouth":  [ "include all", "C06.0 Cheek mucosa", "C06.1 Vestibule of mouth", "C06.2 Retromolar area", "C06.8 Overlapping lesion of other and unspecified parts of mouth", "C06.9 Mouth, nos"], "C07 Parotid gland":  [ "include all", "C07.9 Parotid gland"], "C08 Other and unspecified major salivary glands":  [ "include all", "C08.0 Submandibular gland", "C08.1 Sublingual gland", "C08.8 Overlapping lesion of major salivary glands", "C08.9 Major salivary gland, nos"], "C09 Tonsil":  [ "include all", "C09.0 Tonsillar fossa", "C09.1 Tonsillar pillar", "C09.8 Overlapping lesion of tonsil", "C09.9 Tonsil, nos"], "C10 Oropharynx":  [ "include all", "C10.0 Vallecula", "C10.1 Anterior surface of epiglottis", "C10.2 Lateral wall of oropharynx", "C10.3 Posterior wall of oropharynx", "C10.4 Branchial cleft", "C10.8 Overlapping lesion of oropharynx", "C10.9 Oropharynx, nos"], "C11 Nasopharynx":  [ "include all", "C11.0 Superior wall of nasopharynx", "C11.1 Posterior wall of nasopharynx", "C11.2 Lateral wall of nasopharynx", "C11.3 Anterior wall of nasopharynx", "C11.8 Overlapping lesion of nasopharynx", "C11.9 Nasopharynx, nos"], "C12 Pyriform sinus":  [ "include all", "C12.9 Pyriform sinus"], "C13 Hypopharynx":  [ "include all", "C13.0 Postcricoid region", "C13.1 Hypopharyngeal aspect of aryepiglottic fold", "C13.2 Posterior wall of hypopharynx", "C13.8 Overlapping lesion of hypopharynx", "C13.9 Hypopharynx, nos"], "C14 Other and ill-defined sites in lip, oral cavity and pharynx":  [ "include all", "C14.0 Pharynx, nos", "C14.2 Waldeyer ring", "C14.8 Overlapping lesion of lip, oral cavity and pharynx"]}, "C15-C26 Digestive organs":  { "include all" : [],  "C15 Esophagus":  [ "include all", "C15.0 Cervical esophagus", "C15.1 Thoracic esophagus", "C15.2 Abdominal esophagus", "C15.3 Upper third of esophagus", "C15.4 Middle third of esophagus", "C15.5 Lower third of esophagus", "C15.8 Overlapping lesion of esophagus", "C15.9 Esophagus, nos"], "C16 Stomach":  [ "include all", "C16.0 Cardia, nos", "C16.1 Fundus of stomach", "C16.2 Body of stomach", "C16.3 Gastric antrum", "C16.4 Pylorus", "C16.5 Lesser curvature of stomach, nos", "C16.6 Greater curvature of stomach, nos", "C16.8 Overlapping lesion of stomach", "C16.9 Stomach, nos"], "C17 Small intestine":  [ "include all", "C17.0 Duodenum", "C17.1 Jejunum", "C17.2 Ileum", "C17.3 Meckel diverticulum", "C17.8 Overlapping lesion of small intestine", "C17.9 Small intestine, nos"], "C18 Colon":  [ "include all", "C18.0 Cecum", "C18.1 Appendix", "C18.2 Ascending colon", "C18.3 Hepatic flexure of colon", "C18.4 Transverse colon", "C18.5 Splenic flexure of colon", "C18.6 Descending colon", "C18.7 Sigmoid colon", "C18.8 Overlapping lesion of colon", "C18.9 Colon, nos"], "C19 Rectosigmoid junction":  [ "include all", "C19.9 Rectosigmoid junction"], "C20 Rectum":  [ "include all", "C20.9 Rectum, nos"], "C21 Anus and anal canal":  [ "include all", "C21.0 Anus, nos", "C21.1 Anal canal", "C21.2 Cloacogenic zone", "C21.8 Overlapping lesion of rectum, anus and anal canal"], "C22 Liver and intrahepatic bile ducts":  [ "include all", "C22.0 Liver", "C22.1 Intrahepatic bile duct"], "C23 Gallbladder":  [ "include all", "C23.9 Gallbladder"], "C24 Other and unspecified parts of biliary tract":  [ "include all", "C24.0 Extrahepatic bile duct", "C24.1 Ampulla of vater", "C24.8 Overlapping lesion of biliary tract", "C24.9 Biliary tract, nos"], "C25 Pancreas":  [ "include all", "C25.0 Head of pancreas", "C25.1 Body of pancreas", "C25.2 Tail of pancreas", "C25.3 Pancreatic duct", "C25.4 Islets of langerhans", "C25.7 Other specified parts of pancreas", "C25.8 Overlapping lesion of pancreas", "C25.9 Pancreas, nos"], "C26 Other and ill-defined digestive organs":  [ "include all", "C26.0 Intestinal tract, nos", "C26.8 Overlapping lesion of digestive system", "C26.9 Gastrointestinal tract, nos"]}, "C30-C39 Respiratory system and intrathoracic organs":  { "include all" : [],  "C30 Nasal cavity and middle ear":  [ "include all", "C30.0 Nasal cavity", "C30.1 Middle ear"], "C31 Accessory sinuses":  [ "include all", "C31.0 Maxillary sinus", "C31.1 Ethmoid sinus", "C31.2 Frontal sinus", "C31.3 Sphenoid sinus", "C31.8 Overlapping lesion of accessory sinuses", "C31.9 Accessory sinus, nos"], "C32 Larynx":  [ "include all", "C32.0 Glottis", "C32.1 Supraglottis", "C32.2 Subglottis", "C32.3 Laryngeal cartilage", "C32.8 Overlapping lesion of larynx", "C32.9 Larynx, nos"], "C33 Trachea":  [ "include all", "C33.9 Trachea"], "C34 Bronchus and lung":  [ "include all", "C34.0 Main bronchus", "C34.1 Upper lobe, lung", "C34.2 Middle lobe, lung", "C34.3 Lower lobe, lung", "C34.8 Overlapping lesion of lung", "C34.9 Lung, nos"], "C37 Thymus":  [ "include all", "C37.9 Thymus"], "C38 Heart, mediastinum, and pleura":  [ "include all", "C38.0 Heart", "C38.1 Anterior mediastinum", "C38.2 Posterior mediastinum", "C38.3 Mediastinum, nos", "C38.4 Pleura, nos", "C38.8 Overlapping lesion of heart, mediastinum and pleura"], "C39 Other and ill-defined sites within respiratory system and intrathoracic organs":  [ "include all", "C39.0 Upper respiratory tract, nos", "C39.8 Overlapping lesion of respiratory system and intrathoracic organs", "C39.9 Ill-defined sites within respiratory system"]}, "C40-C41 Bones, joints and articular cartilage":  { "include all" : [],  "C40 Bones, joints and articular cartilage of limbs":  [ "include all", "C40.0 Long bones of upper limb, scapula and associated joints", "C40.1 Short bones of upper limb and associated joints", "C40.2 Long bones of lower limb and associated joints", "C40.3 Short bones of lower limb and associated joints", "C40.8 Overlapping lesion of bones, joints and articular cartilage of limbs", "C40.9 Bone of limb, nos"], "C41 Bones, joints and articular cartilage of other and unspecified sites":  [ "include all", "C41.0 Bones of skull and face and associated joints", "C41.1 Mandible", "C41.2 Vertebral column", "C41.3 Rib, sternum, clavicle and associated joints", "C41.4 Pelvic bones, sacrum, coccyx and associated joints", "C41.8 Overlapping lesion of bones, joints and articular cartilage", "C41.9 Bone, nos"]}, "C42 Hematopoietic and reticuloendothelial systems":  [ "include all", "C42.0 Blood", "C42.1 Bone marrow", "C42.2 Spleen", "C42.3 Reticuloendothelial system, nos", "C42.4 Hematopoietic system, nos"], "C44 Skin":  [ "include all", "C44.0 Skin of lip, nos", "C44.1 Eyelid", "C44.2 External ear", "C44.3 Skin of other and unspecified parts of face", "C44.4 Skin of scalp and neck", "C44.5 Skin of trunk", "C44.6 Skin of upper limb and shoulder", "C44.7 Skin of lower limb and hip", "C44.8 Overlapping lesion of skin", "C44.9 Skin, nos"], "C47 Peripheral nerves and autonomic nervous system":  [ "include all", "C47.0 Peripheral nerves and autonomic nervous system of head, face, and neck", "C47.1 Peripheral nerves and autonomic nervous system of upper limb and shoulder", "C47.2 Peripheral nerves and autonomic nervous system of lower limband hip", "C47.3 Peripheral nerves and autonomic nervous system of thorax", "C47.4 Peripheral nerves and autonomic nervous system of abdomen", "C47.5 Peripheral nerves and autonomic nervous system of pelvis", "C47.6 Peripheral nerves and autonomic nervous system of trunk, nos", "C47.8 Overlapping lesion of peripheral nerves and autonomic nervous system", "C47.9 Autonomic nervous system, nos"], "C48 Retroperitoneum and peritoneum":  [ "include all", "C48.0 Retroperitoneum", "C48.1 Specified parts of peritoneum", "C48.2 Peritoneum, nos", "C48.8 Overlapping lesion of retroperitoneum and peritoneum"], "C49 Connective, subcutaneous and other soft tissues":  [ "include all", "C49.0 Connective, subcutaneous and other soft tissues of head, face, and neck", "C49.1 Connective, subcutaneous and other soft tissues of upper limb and shoulder", "C49.2 Connective, subcutaneous and other soft tissues of lower limb and hip", "C49.3 Connective, subcutaneous and other soft tissues of thorax", "C49.4 Connective, subcutaneous and other soft tissues of abdomen", "C49.5 Connective, subcutaneous and other soft tissues of pelvis", "C49.6 Connective, subcutaneous and other soft tissues of trunk nos", "C49.8 Overlapping lesion of connective, subcutaneous and other soft tissues", "C49.9 Connective, subcutaneous and other soft tissues, nos"], "C50 Breast":  [ "include all", "C50.0 Nipple", "C50.1 Central portion of breast", "C50.2 Upper-inner quadrant of breast", "C50.3 Lower-inner quadrant of breast", "C50.4 Upper-outer quadrant of breast", "C50.5 Lower-outer quadrant of breast", "C50.6 Axillary tail of breast", "C50.8 Overlapping lesion of breast", "C50.9 Breast, nos"], "C51-C58 Female genital organs":  { "include all" : [],  "C51 Vulva":  [ "include all", "C51.0 Labium majus", "C51.1 Labium minus", "C51.2 Clitoris", "C51.8 Overlapping lesion of vulva", "C51.9 Vulva, nos"], "C52 Vagina":  [ "include all", "C52.9 Vagina, nos"], "C53 Cervix uteri":  [ "include all", "C53.0 Endocervix", "C53.1 Exocervix", "C53.8 Overlapping lesion of cervix uteri", "C53.9 Cervix uteri"], "C54 Corpus uteri":  [ "include all", "C54.0 Isthmus uteri", "C54.1 Endometrium", "C54.2 Myometrium", "C54.3 Fundus uteri", "C54.8 Overlapping lesion of corpus uteri", "C54.9 Corpus uteri"], "C55 Uterus, nos":  [ "include all", "C55.9 Uterus, nos"], "C56 Ovary":  [ "include all", "C56.9 Ovary"], "C57 Other and unspecified female genital organs":  [ "include all", "C57.0 Fallopian tube", "C57.1 Broad ligament", "C57.2 Round ligament", "C57.3 Parametrium", "C57.4 Uterine adnexa", "C57.7 Other specified parts of female genital organs", "C57.8 Overlapping lesion of female genital organs", "C57.9 Female genital tract, nos"], "C58 Placenta":  [ "include all", "C58.9 Placenta"]}, "C60-C63 Male genital organs":  { "include all" : [],  "C60 Penis":  [ "include all", "C60.0 Prepuce", "C60.1 Glans penis", "C60.2 Body of penis", "C60.8 Overlapping lesion of penis", "C60.9 Penis, nos"], "C61 Prostate gland":  [ "include all", "C61.9 Prostate gland"], "C62 Testis":  [ "include all", "C62.0 Undescended testis", "C62.1 Descended testis", "C62.9 Testis, nos"], "C63 Other and unspecified male genital organs":  [ "include all", "C63.0 Epididymis", "C63.1 Spermatic cord", "C63.2 Scrotum, nos", "C63.7 Other specified parts of male genital organs", "C63.8 Overlapping lesion of male genital organs", "C63.9 Male genital organs, nos"]}, "C64-C68 Urinary tract":  { "include all" : [],  "C64 Kidney":  [ "include all", "C64.9 Kidney, nos"], "C65 Renal pelvis":  [ "include all", "C65.9 Renal pelvis"], "C66 Ureter":  [ "include all", "C66.9 Ureter"], "C67 Bladder":  [ "include all", "C67.0 Trigone of bladder", "C67.1 Dome of bladder", "C67.2 Lateral wall of bladder", "C67.3 Anterior wall of bladder", "C67.4 Posterior wall of bladder", "C67.5 Bladder neck", "C67.6 Ureteric orifice", "C67.7 Urachus", "C67.8 Overlapping lesion of bladder", "C67.9 Bladder, nos"], "C68 Other and unspecified urinary organs":  [ "include all", "C68.0 Urethra", "C68.1 Paraurethral gland", "C68.8 Overlapping lesion of urinary organs", "C68.9 Urinary system, nos"]}, "C69-C72 Eye, brain and other parts of central nervous system":  { "include all" : [],  "C69 Eye and adnexa":  [ "include all", "C69.0 Conjunctiva", "C69.1 Cornea, nos", "C69.2 Retina", "C69.3 Choroid", "C69.4 Ciliary body", "C69.5 Lacrimal gland", "C69.6 Orbit, nos", "C69.8 Overlapping lesion of eye and adnexa", "C69.9 Eye, nos"], "C70 Meninges":  [ "include all", "C70.0 Cerebral meninges", "C70.1 Spinal meninges", "C70.9 Meninges, nos"], "C71 Brain":  [ "include all", "C71.0 Cerebrum", "C71.1 Frontal lobe", "C71.2 Temporal lobe", "C71.3 Parietal lobe", "C71.4 Occipital lobe", "C71.5 Ventricle, nos", "C71.6 Cerebellum, nos", "C71.7 Brain stem", "C71.8 Overlapping lesion of brain", "C71.9 Brain, nos"], "C72 Spinal cord, cranial nerves, and other parts of central nervous system":  [ "include all", "C72.0 Spinal cord", "C72.1 Cauda equina", "C72.2 Olfactory nerve", "C72.3 Optic nerve", "C72.4 Acoustic nerve", "C72.5 Cranial nerve, nos", "C72.8 Overlapping lesion of brain and central nervous system", "C72.9 Nervous system, nos"]}, "C73-C75 Thyroid and other endocrine glands":  { "include all" : [],  "C73 Thyroid gland":  [ "include all", "C73.9 Thyroid gland"], "C74 Adrenal gland":  [ "include all", "C74.0 Cortex of adrenal gland", "C74.1 Medulla of adrenal gland", "C74.9 Adrenal gland, nos"], "C75 Other endocrine glands and related structures":  [ "include all", "C75.0 Parathyroid gland", "C75.1 Pituitary gland", "C75.2 Craniopharyngeal duct", "C75.3 Pineal gland", "C75.4 Carotid body", "C75.5 Aortic body and other paraganglia", "C75.8 Overlapping lesion of endocrine glands and related structures", "C75.9 Endocrine gland, nos"]}, "C76 Other and ill-defined sites":  [ "include all", "C76.0 Head, face or neck, nos", "C76.1 Thorax, nos", "C76.2 Abdomen, nos", "C76.3 Pelvis, nos", "C76.4 Upper limb, nos", "C76.5 Lower limb, nos", "C76.7 Other ill-defined sites", "C76.8 Overlapping lesion of ill-defined sites"], "C77 Lymph nodes":  [ "include all", "C77.0 Lymph nodes of head, face and neck", "C77.1 Intrathoracic lymph nodes", "C77.2 Intra-abdominal lymph nodes", "C77.3 Lymph nodes of axilla or arm", "C77.4 Lymph nodes of inguinal region or leg", "C77.5 Pelvic lymph nodes", "C77.8 Lymph nodes of multiple regions", "C77.9 Lymph node, nos"], "C80 Unknown primary site":  [ "include all", "C80.9 Unknown primary site"]}
    },
    {"Cancer ICD-O histology":  { "include all" : [],  "800 Neoplasms, NOS":  [ "include all", "8000/0 Neoplasm, benign", "8000/1 Neoplasm, uncertain whether benign or malignant", "8000/3 Neoplasm, malignant", "8000/6 Neoplasm, metastatic", "8000/9 Neoplasm, malignant, uncertain whether primary or metastatic", "8001/0 Tumor cells, benign", "8001/1 Tumor cells, uncertain whether benign or malignant", "8001/3 Tumor cells, malignant", "8002/3 Malignant tumor, small cell type", "8003/3 Malignant tumor, giant cell type", "8004/3 Malignant tumor, spindle cell type", "8005/0 Clear cell tumor, NOS", "8005/3 Malignant tumor, clear cell type"], "801-804 Epithelial neoplasms, NOS":  [ "include all", "8010/0 Epithelial tumor, benign", "8010/2 Carcinoma in situ, NOS", "8010/3 Carcinoma, NOS", "8010/6 Carcinoma, metastatic, NOS", "8010/9 Carcinomatosis", "8011/0 Epithelioma, benign", "8011/3 Epithelioma, malignant", "8012/3 Large cell carcinoma, NOS", "8013/3 Large cell neuroendocrine carcinoma", "8014/3 Large cell carcinoma with rhabdoid phenotype", "8015/3 Glassy cell carcinoma", "8020/3 Carcinoma, undifferentiated, NOS", "8021/3 Carcinoma, anaplastic, NOS", "8022/3 Pleomorphic carcinoma", "8023/3 Nuclear protein in testis (NUT) associated carcinoma", "8030/3 Giant cell and spindle cell carcinoma", "8031/3 Giant cell carcinoma", "8032/3 Spindle cell carcinoma, NOS", "8033/3 Pseudosarcomatous carcinoma", "8034/3 Polygonal cell carcinoma", "8035/3 Carcinoma with osteoclast-like giant cells", "8040/0 Tumorlet, benign", "8040/1 Tumorlet, NOS", "8041/3 Small cell carcinoma, NOS", "8043/3 Small cell carcinoma, fusiform cell", "8044/3 Small cell carcinoma, intermediate cell", "8045/3 Combined small cell carcinoma", "8046/3 Non-small cell carcinoma"], "805-808 Squamous cell neoplasms":  [ "include all", "8050/0 Papilloma, NOS", "8050/2 Papillary carcinoma in situ", "8050/3 Papillary carcinoma, NOS", "8051/0 Verrucous papilloma", "8051/3 Verrucous carcinoma, NOS", "8052/0 Squamous cell papilloma, NOS", "8052/2 Papillary squamous cell carcinoma, non-invasive", "8052/3 Papillary squamous cell carcinoma", "8053/0 Squamous cell papilloma, inverted", "8054/0 Warty dyskeratoma", "8054/3 Warty carcinoma", "8060/0 Squamous papillomatosis", "8070/0 Actinic keratosis", "8070/2 Squamous cell carcinoma in situ, NOS", "8070/3 Squamous cell carcinoma, NOS", "8070/6 Squamous cell carcinoma, metastatic, NOS", "8071/2 Differentiated intraepithelial neoplasia", "8071/3 Squamous cell carcinoma, keratinizing, NOS", "8072/0 Large cell acanthoma", "8072/3 Squamous cell carcinoma, large cell, nonkeratinizing, NOS", "8073/3 Squamous cell carcinoma, small cell, nonkeratinizing", "8074/3 Squamous cell carcinoma, spindle cell", "8075/3 Squamous cell carcinoma, adenoid", "8076/2 Squamous cell carcinoma in situ with questionable stromal invasion", "8076/3 Squamous cell carcinoma, microinvasive", "8077/0 Squamous intraepithelial neoplasia, low grade", "8077/2 Squamous intraepithelial neoplasia, high grade", "8078/3 Squamous cell carcinoma with horn formation", "8080/2 Queyrat erythroplasia", "8081/2 Bowen disease", "8082/3 Lymphoepithelial carcinoma", "8083/3 Basaloid squamous cell carcinoma", "8084/0 Clear cell acanthoma", "8084/3 Squamous cell carcinoma, clear cell type", "8085/3 Squamous cell carcinoma, HPV-positive", "8086/3 Squamous cell carcinoma, HPV-negative"], "809-811 Basal cell neoplasms":  [ "include all", "8090/3 Basal cell carcinoma, NOS", "8091/3 Superficial basal cell carcinoma", "8092/3 Infiltrating basal cell carcinoma, NOS", "8093/3 Basal cell carcinoma, fibroepithelial", "8094/3 Basosquamous carcinoma", "8095/3 Metatypical carcinoma", "8096/0 Intraepidermal epithelioma of Jadassohn", "8097/3 Basal cell carcinoma, nodular", "8098/3 Adenoid basal carcinoma", "8100/0 Trichoepithelioma", "8100/3 Trichoblastic carcinoma", "8101/0 Trichofolliculoma", "8102/0 Trichilemmoma", "8102/3 Trichilemmocarcinoma", "8103/0 Pilar tumor", "8103/1 Proliferating trichilemmal cyst", "8104/0 Pilar sheath acanthoma", "8110/0 Pilomatricoma, NOS", "8110/3 Pilomatrical carcinoma"], "812-813 Transitional cell papillomas and carcinomas":  [ "include all", "8120/0 Urothelial papilloma, NOS", "8120/2 Urothelial carcinoma in situ", "8120/3 Transitional cell carcinoma, NOS", "8121/0 Sinonasal papilloma, exophytic", "8121/1 Sinonasal papilloma, inverted", "8121/3 Schneiderian carcinoma", "8122/3 Urothelial carcinoma, sarcomatoid ", "8123/3 Basaloid carcinoma", "8130/1 Papillary urothelial neoplasm of low malignant potential", "8130/2 Papillary urothelial carcinoma, non-invasive", "8131/3 Urothelial carcinoma, micropapillary"], "814-838 Adenomas and adenocarcinomas":  [ "include all", "8140/0 Adenoma, NOS", "8140/1 Atypical adenoma", "8140/2 Adenocarcinoma in situ, NOS", "8140/3 Adenocarcinoma, NOS", "8140/6 Adenocarcinoma, metastatic, NOS", "8142/3 Linitis plastica", "8143/3 Superficial spreading adenocarcinoma", "8144/0 Adenoma, intestinal type", "8144/3 Adenocarcinoma, intestinal type", "8145/3 Carcinoma, diffuse type", "8146/0 Monomorphic adenoma", "8147/0 Basal cell adenoma", "8147/3 Basal cell adenocarcinoma", "8148/0 Glandular intraepithelial neoplasia, low grade", "8148/2 Glandular intraepithelial neoplasia, high grade", "8149/0 Canalicular adenoma", "8150/0 Pancreatic neuroendocrine microadenoma", "8150/3 Pancreatic neuroendocrine tumor, nonfunctioning", "8151/3 Insulinoma, NOS", "8152/3 Glucagonoma, NOS", "8153/3 Gastrinoma, NOS", "8154/3 Mixed neuroendocrine non-neuroendocrine neoplasm (MiNEN)", "8155/3 Vipoma, NOS", "8156/3 Somatostatinoma, NOS", "8158/3 ACTH-producing tumor", "8160/0 Bile duct adenoma", "8160/3 Cholangiocarcinoma", "8161/0 Bile duct cystadenoma", "8161/3 Bile duct cystadenocarcinoma", "8162/3 Klatskin tumor", "8163/0 Pancreatobiliary neoplasm, non-invasive", "8163/2 Papillary neoplasm, pancreatobiliary type, with high grade intraepithelial neoplasia", "8163/3 Pancreatobiliary type carcinoma", "8170/0 Liver cell adenoma", "8170/3 Hepatocellular carcinoma, NOS", "8171/3 Hepatocellular carcinoma, fibrolamellar", "8172/3 Hepatocellular carcinoma, scirrhous", "8173/3 Hepatocellular carcinoma, spindle cell variant", "8174/3 Hepatocellular carcinoma, clear cell type", "8175/3 Hepatocellular carcinoma, pleomorphic type", "8180/3 Combined hepatocellular carcinoma and cholangiocarcinoma", "8190/0 Trabecular adenoma", "8190/3 Trabecular adenocarcinoma", "8191/0 Embryonal adenoma", "8200/0 Eccrine dermal cylindroma", "8200/3 Adenoid cystic carcinoma", "8201/2 Cribriform carcinoma in situ", "8201/3 Cribriform carcinoma, NOS", "8202/0 Microcystic adenoma", "8204/0 Lactating adenoma", "8210/0 Adenomatous polyp, NOS", "8210/2 Adenocarcinoma in situ in adenomatous polyp", "8210/3 Adenocarcinoma in adenomatous polyp", "8211/0 Tubular adenoma, NOS", "8211/3 Tubular adenocarcinoma", "8212/0 Flat adenoma", "8213/0 Serrated adenoma, NOS", "8213/3 Serrated adenocarcinoma", "8214/3 Parietal cell carcinoma", "8215/3 Adenocarcinoma of anal glands", "8220/0 Adenomatous polyposis coli", "8220/3 Adenocarcinoma in adenomatous polyposis coli", "8221/0 Multiple adenomatous polyps", "8221/3 Adenocarcinoma in multiple adenomatous polyps", "8230/3 Solid carcinoma, NOS", "8231/3 Carcinoma simplex", "8240/3 Neuroendocrine tumor, NOS", "8241/3 Enterochromaffin cell carcinoid", "8242/3 Enterochromaffin-like cell tumor, malignant", "8243/3 Goblet cell carcinoid", "8244/3 Mixed adenoneuroendocrine carcinoma", "8245/1 Tubular carcinoid", "8246/3 Neuroendocrine carcinoma, NOS", "8247/3 Merkel cell carcinoma", "8249/3 Neuroendocrine tumor, grade 2", "8250/0 Atypical adenomatous hyperplasia", "8250/2 Adenocarcinoma in situ of the lung, non-mucinous", "8250/3 Lepidic adenocarcinoma", "8251/0 Alveolar adenoma", "8252/3 Bronchiolo-alveolar carcinoma, non-mucinous", "8253/2 Adenocarcinoma in situ of the lung, mucinous", "8253/3 Adenocarcinoma of the lung, mucinous", "8254/3 Adenocarcinoma of the lung, mixed mucinous and non-mucinous", "8255/3 Adenocarcinoma with mixed subtypes", "8256/3 Minimally invasive adenocarcinoma, non-mucinous", "8257/3 Minimally invasive adenocarcinoma, mucinous", "8260/0 Papillary adenoma, NOS", "8260/1 Aggressive papillary tumor", "8260/3 Papillary adenocarcinoma, NOS", "8261/0 Villous adenoma, NOS", "8261/2 Adenocarcinoma in situ in villous adenoma", "8261/3 Adenocarcinoma in villous adenoma", "8262/3 Villous adenocarcinoma", "8263/0 Tubulovillous adenoma, NOS", "8263/2 Adenocarcinoma in situ in tubulovillous adenoma", "8263/3 Adenocarcinoma in tubulovillous adenoma", "8265/3 Micropapillary carcinoma, NOS", "8270/0 Chromophobe adenoma", "8270/3 Chromophobe carcinoma", "8271/0 Lactotroph adenoma", "8272/0 Pituitary adenoma, NOS", "8272/3 Pituitary carcinoma, NOS", "8273/3 Pituitary blastoma", "ICDO3.2", "Level", "Term", "two", "8290/0 Oxyphilic adenoma", "8290/3 Oxyphilic adenocarcinoma", "ICDO3.2", "Level", "Term", "two", "8310/0 Clear cell adenoma", "8310/3 Clear cell adenocarcinoma, NOS", "8311/3 Hereditary leiomyomatosis and renal cell carcinoma (HRCC)-associated renal cell carcinoma", "8312/3 Renal cell carcinoma, NOS", "8313/0 Clear cell adenofibroma", "8313/1 Clear cell borderline tumor", "8313/3 Clear cell adenocarcinofibroma", "8314/3 Lipid-rich carcinoma", "8315/3 Glycogen-rich carcinoma", "8316/1 Multilocular cystic renal neoplasm of low malignant potential ", "8316/3 Cyst-associated renal cell carcinoma", "8317/3 Renal cell carcinoma, chromophobe type", "8318/3 Renal cell carcinoma, sarcomatoid", "8319/3 Collecting duct carcinoma", "8320/3 Granular cell carcinoma", "8321/0 Chief cell adenoma", "8322/0 Water-clear cell adenoma", "8322/3 Water-clear cell adenocarcinoma", "8323/0 Mixed cell adenoma", "8323/1 Clear cell papillary renal cell carcinoma", "8323/3 Mixed cell adenocarcinoma", "8324/0 Lipoadenoma", "8325/0 Metanephric adenoma", "8330/0 Follicular adenoma, NOS", "8330/3 Follicular carcinoma, NOS", "8331/3 Follicular adenocarcinoma, well differentiated", "8332/3 Follicular adenocarcinoma, trabecular", "8333/0 Microfollicular adenoma, NOS", "8333/3 Fetal adenocarcinoma", "8334/0 Macrofollicular adenoma", "8335/1 Follicular tumor of uncertain malignant potential", "8335/3 Follicular carcinoma, minimally invasive", "8336/1 Hyalinizing trabecular tumor", "8337/3 Poorly differentiated thyroid carcinoma", "8339/3 Follicular carcinoma, encapsulated, angioinvasive", "8340/3 Papillary carcinoma, follicular variant", "8341/3 Papillary microcarcinoma", "8342/3 Papillary carcinoma, oncocytic variant", "8343/3 Papillary carcinoma, encapsulated of thyroid", "8344/3 Papillary carcinoma, columnar cell", "8345/3 Medullary thyroid carcinoma", "8346/3 Mixed medullary-follicular carcinoma", "8347/3 Mixed medullary-papillary carcinoma", "8348/1 Well differentiated tumor of uncertain malignant potential", "8349/1 Non-invasive follicular thyroid neoplasm with papillary-like nuclear features (NIFTP)", "ICDO3.2", "Level", "Term", "two", "8361/0 Juxtaglomerular tumor", "8370/0 Adrenal cortical adenoma, NOS", "8370/3 Adrenal cortical carcinoma", "8371/0 Adrenal cortical adenoma, compact cell", "8372/0 Adrenal cortical adenoma, pigmented", "8373/0 Adrenal cortical adenoma, clear cell", "8374/0 Adrenal cortical adenoma, glomerulosa cell", "8375/0 Adrenal cortical adenoma, mixed cell", "8380/0 Endometrioid adenoma, NOS", "8380/1 Endometrioid adenoma, borderline malignancy", "8380/2 Endometrioid intraepithelial neoplasia", "8380/3 Endometrioid adenocarcinoma, NOS", "8381/0 Endometrioid adenofibroma, NOS", "8381/1 Endometrioid adenofibroma, borderline malignancy", "8381/3 Endometrioid adenofibroma, malignant", "8382/3 Endometrioid adenocarcinoma, secretory variant", "8383/3 Endometrioid adenocarcinoma, ciliated cell variant", "8384/3 Adenocarcinoma, endocervical type"], "839-842 Adnexal and skin appendage neoplasms":  [ "include all", "8390/0 Skin appendage adenoma", "8390/3 Adnexal adenocarcinoma, NOS", "8391/0 Follicular fibroma", "8392/0 Syringofibroadenoma", "8400/0 Sweat gland adenoma", "8400/1 Sweat gland tumor, NOS", "8400/3 Sweat gland adenocarcinoma", "8401/0 Apocrine adenoma", "8401/3 Apocrine adenocarcinoma", "8402/0 Hidradenoma, NOS", "8402/3 Hidradenocarcinoma", "8403/0 Spiradenoma, NOS", "8403/3 Malignant eccrine spiradenoma", "8404/0 Hidrocystoma", "8405/0 Papillary hidradenoma", "8406/0 Syringocystadenoma papilliferum", "8406/3 Syringocystadenocarcinoma papilliferum", "8407/0 Syringoma, NOS", "8407/3 Microcystic adnexal carcinoma", "8408/0 Eccrine papillary adenoma", "8408/3 Digital papillary adenocarcinoma", "8409/0 Poroma, NOS", "8409/2 Porocarcinoma in situ", "8409/3 Porocarcinoma, NOS", "8410/0 Sebaceoma", "8410/3 Sebaceous carcinoma", "8413/3 Eccrine adenocarcinoma", "8420/0 Ceruminous adenoma", "8420/3 Ceruminous adenocarcinoma"], "843 Mucoepidermoid neoplasms":  [ "include all", "8430/3 Mucoepidermoid carcinoma"], "844-849 Cystic, mucinous and serous neoplasms":  [ "include all", "8440/0 Cystadenoma, NOS", "8441/0 Serous cystadenoma, NOS", "8441/2 Serous intraepithelial carcinoma", "8441/3 Serous carcinoma, NOS", "8442/1 Serous borderline tumor, NOS", "8443/0 Clear cell cystadenoma", "8450/0 Papillary cystadenoma, NOS", "8452/1 Solid pseudopapillary tumor of ovary", "8452/3 Solid pseudopapillary neoplasm of the pancreas", "8453/0 Intraductal Papillary mucinous adenoma", "8453/2 Intraductal Papillary mucinous neoplasm with high grade dysplasia", "8453/3 Intraductal Papillary mucinous neoplasm with an associated invasive carcinoma", "8454/0 Cystic tumor of atrio-ventricular node", "8460/2 Serous borderline tumor, micropapillary variant", "8460/3 Low grade serous carcinoma", "8461/0 Serous surface papilloma", "8461/3 High grade serous carcinoma", "8470/0 Mucinous cystadenoma, NOS", "8470/2 Mucinous cystic neoplasm with high grade dysplasia", "8470/3 Mucinous cystadenocarcinoma, NOS", "8472/1 Mucinous cystic tumor of borderline malignancy", "8474/0 Seromucinous cystadenoma", "8474/1 Seromucinous borderline tumor", "8474/3 Seromucinous carcinoma", "8480/0 Mucinous adenoma", "8480/1 Low grade appendiceal mucinous neoplasm", "8480/3 Mucinous adenocarcinoma", "8480/6 Pseudomyxoma peritonei", "8481/3 Mucin-producing adenocarcinoma", "8482/3 Mucinous carcinoma, gastric type", "8490/3 Signet ring cell carcinoma", "8490/6 Metastatic signet ring cell carcinoma"], "850-854 Ductal and lobular neoplasms":  [ "include all", "8500/2 Intraductal carcinoma, noninfiltrating, NOS", "8500/3 Infiltrating duct carcinoma, NOS", "8501/2 Comedocarcinoma, noninfiltrating", "8501/3 Comedocarcinoma, NOS", "8502/3 Secretory carcinoma", "8503/0 Intraductal papilloma", "8503/2 Noninfiltrating intraductal papillary adenocarcinoma", "8503/3 Intraductal papillary adenocarcinoma with invasion", "8504/0 Intracystic papillary adenoma", "8504/2 Encapsulated papillary carcinoma", "8504/3 Encapsulated papillary carcinoma with invasion", "8505/0 Intraductal papillomatosis, NOS", "8506/0 Adenoma of nipple", "8507/2 Intraductal micropapillary carcinoma", "8507/3 Invasive micropapillary carcinoma of breast", "8509/2 Solid papillary carcinoma in situ", "8509/3 Solid papillary carcinoma with invasion", "8510/3 Medullary carcinoma, NOS", "8513/3 Atypical medullary carcinoma", "8514/3 Duct carcinoma, desmoplastic type", "8519/2 Lobular carcinoma in situ, pleomorphic", "8520/2 Lobular carcinoma in situ, NOS", "8520/3 Lobular carcinoma, NOS", "8521/3 Infiltrating ductular carcinoma", "8522/2 Intraductal carcinoma and lobular carcinoma in situ", "8522/3 Infiltrating duct and lobular carcinoma", "8523/3 Infiltrating duct mixed with other types of carcinoma", "8524/3 Infiltrating lobular mixed with other types of carcinoma", "8525/3 Polymorphous adenocarcinoma", "8530/3 Inflammatory carcinoma", "8540/3 Paget disease, mammary", "8541/3 Paget disease and infiltrating duct carcinoma of breast", "8542/3 Paget disease, extramammary", "8543/3 Paget disease and intraductal carcinoma of breast"], "855 Acinar cell neoplasms":  [ "include all", "8550/0 Acinar cell adenoma", "8550/3 Acinar cell carcinoma", "8552/3 Mixed acinar-ductal carcinoma"], "856-857 Complex epithelial neoplasms":  [ "include all", "8560/0 Mixed squamous cell and glandular papilloma", "8560/3 Adenosquamous carcinoma", "8561/0 Adenolymphoma", "8562/3 Epithelial-myoepithelial carcinoma", "8563/0 Lymphadenoma", "8570/3 Adenocarcinoma with squamous metaplasia", "8571/3 Adenocarcinoma with cartilaginous and osseous metaplasia", "8572/3 Adenocarcinoma with spindle cell metaplasia", "8573/3 Adenocarcinoma with apocrine metaplasia", "8574/3 Adenocarcinoma with neuroendocrine differentiation", "8575/3 Metaplastic carcinoma, NOS", "8576/3 Hepatoid adenocarcinoma"], "858 Thymic epithelial neoplasms":  [ "include all", "8580/0 Microscopic thymoma", "8580/1 Micronodular thymoma with lymphoid stroma", "8580/3 Thymoma, NOS", "8581/3 Thymoma, type A", "8582/3 Thymoma, type AB", "8583/3 Thymoma, type B1", "8584/3 Thymoma, type B2", "8585/3 Thymoma, type B3", "8586/3 Thymic carcinoma, NOS", "8587/0 Ectopic hamartomatous thymoma", "8588/3 Spindle epithelial tumor with thymus-like element", "8589/3 Intrathyroid thymic carcinoma"], "859-867 Specialized gonadal neoplasms":  [ "include all", "8590/0 Sex cord-stromal tumor, benign", "8590/1 Sex cord-gonadal stromal tumor, NOS", "8591/1 Sex cord-gonadal stromal tumor, incompletely differentiated", "8592/1 Sex cord-gonadal stromal tumor, mixed forms", "8593/1 Stromal tumor with minor sex cord elements", "8594/1 Mixed germ cell-sex cord-stromal tumor, NOS", "8600/0 Thecoma, NOS", "8600/3 Thecoma, malignant", "8601/0 Thecoma, luteinized", "8602/0 Sclerosing stromal tumor", "8610/0 Luteoma, NOS", "8620/1 Adult granulosa cell tumor of testis", "8620/3 Adult granulosa cell tumor of ovary", "8621/1 Granulosa cell-theca cell tumor", "8622/0 Granulosa cell tumor of the testis, juvenile", "8622/1 Granulosa cell tumor, juvenile", "8623/1 Sex cord tumor with annular tubules", "8631/0 Sertoli-Leydig cell tumor, well differentiated", "8631/1 Sertoli-Leydig cell tumor of intermediate differentiation", "8631/3 Sertoli-Leydig cell tumor, poorly differentiated", "8632/1 Gynandroblastoma", "8633/1 Sertoli-Leydig cell tumor, retiform", "8634/1 Sertoli-Leydig cell tumor, intermediate differentiation, with heterologous elements", "8634/3 Sertoli-Leydig cell tumor, poorly differentiated, with heterologous elements", "8640/1 Sertoli cell tumor, NOS", "8640/3 Sertoli cell carcinoma", "8641/0 Sertoli cell tumor with lipid storage", "8642/1 Large cell calcifying Sertoli cell tumor", "8643/1 Intratubular large cell hyalinizing Sertoli cell neoplasia", "8650/0 Leydig cell tumor of the ovary, NOS", "8650/1 Leydig cell tumor of the testis, NOS", "8650/3 Leydig cell tumor, malignant", "8660/0 Hilus cell tumor", "8670/0 Lipid cell tumor of ovary", "8670/3 Steroid cell tumor, malignant", "8671/0 Adrenal rest tumor"], "868-871 Paragangliomas and glomus tumors":  [ "include all", "8680/3 Paraganglioma, NOS", "8681/3 Sympathetic paraganglioma", "8682/3 Parasympathetic paraganglioma", "8683/0 Gangliocytic paraganglioma", "8690/3 Middle ear paraganglioma", "8691/3 Aortic body tumor", "8692/3 Carotid body paraganglioma", "8693/3 Extra-adrenal paraganglioma, NOS", "8700/3 Pheochromocytoma, NOS", "8710/3 Glomangiosarcoma", "8711/0 Glomus tumor, NOS", "8711/1 Glomangiomatosis", "8711/3 Glomus tumor, malignant", "8712/0 Glomangioma", "8713/0 Glomangiomyoma", "8714/0 Perivascular epithelioid tumor, benign", "8714/3 Perivascular epithelioid tumor, malignant"], "872-879 Nevi and melanomas":  [ "include all", "8720/0 Pigmented nevus, NOS", "8720/2 Melanoma in situ", "8720/3 Malignant melanoma, NOS", "8721/3 Nodular melanoma", "8722/0 Balloon cell nevus", "8722/3 Balloon cell melanoma", "8723/0 Halo nevus", "8723/3 Malignant melanoma, regressing", "8725/0 Neuronevus", "8726/0 Magnocellular nevus", "8727/0 Dysplastic nevus", "8728/0 Meningeal melanocytosis", "8728/1 Meningeal melanocytoma", "8728/3 Meningeal melanomatosis", "8730/0 Nonpigmented nevus", "8730/3 Amelanotic melanoma", "8740/0 Junctional nevus, NOS", "8740/3 Malignant melanoma in junctional nevus", "8741/2 Precancerous melanosis, NOS", "8741/3 Malignant melanoma in precancerous melanosis", "8742/0 Lentiginous melanocytic nevus", "8742/2 Lentigo maligna", "8742/3 Lentigo maligna melanoma", "8743/3 Low cumulative sun damage melanoma", "8744/0 Acral nevus", "8744/3 Acral melanoma", "8745/3 Desmoplastic melanoma", "8746/3 Mucosal lentiginous melanoma", "8750/0 Dermal nevus", "8760/0 Compound nevus", "8761/0 Congenital melanocytic nevus, NOS", "8761/1 Giant pigmented nevus, NOS", "8761/3 Malignant melanoma arising in giant congenital nevus", "8762/1 Proliferative dermal lesion in congenital nevus", "8770/0 Epithelioid and spindle cell nevus", "8770/3 Malignant Spitz tumor", "8771/0 Epithelioid cell nevus", "8771/3 Epithelioid cell melanoma", "8772/0 Spindle cell nevus, NOS", "8772/3 Spindle cell melanoma, NOS", "8773/3 Spindle cell melanoma, type A", "8774/3 Spindle cell melanoma, type B", "8780/0 Blue nevus, NOS", "8780/1 Pigmented epithelioid melanocytoma", "8790/0 Cellular blue nevus"], "880 Soft tissue tumors and sarcomas, NOS":  [ "include all", "8800/0 Soft tissue tumor, benign", "8800/3 Sarcoma, NOS", "8800/9 Sarcomatosis, NOS", "8801/3 Spindle cell sarcoma", "8802/1 Pleomorphic hyalinizing angiectatic tumor", "8802/3 Giant cell sarcoma", "8803/3 Small cell sarcoma", "8804/3 Epithelioid sarcoma", "8805/3 Undifferentiated sarcoma", "8806/3 Desmoplastic small round cell tumor"], "881-883 Fibromatous neoplasms":  [ "include all", "8810/0 Fibroma, NOS", "8810/1 Cellular fibroma", "8810/3 Fibrosarcoma, NOS", "8811/0 Fibromyxoma, NOS", "8811/1 Myxoinflammatory fibroblastic sarcoma", "8811/3 Myxofibrosarcoma", "8812/0 Periosteal fibroma", "8812/3 Periosteal fibrosarcoma", "8813/0 Fibroma of tendon sheath", "8813/1 Palmar/plantar type fibromatosis", "8813/3 Fascial fibrosarcoma", "8814/3 Infantile fibrosarcoma", "8815/0 Solitary fibrous tumor/Hemangiopericytoma, grade 1", "8815/1 Solitary fibrous tumor, NOS", "8815/3 Solitary fibrous tumor, malignant", "8816/0 Calcifying aponeurotic fibroma", "8817/0 Calcifying fibrous tumor", "8818/0 Fibrous dysplasia", "8820/0 Elastofibroma", "8821/1 Aggressive fibromatosis", "8822/1 Abdominal fibromatosis", "8823/0 Sclerotic fibroma", "8823/1 Desmoplastic fibroma", "8824/0 Myofibroma", "8824/1 Myofibromatosis", "8825/0 Myofibroblastoma", "8825/1 Myofibroblastic tumor, NOS", "8825/3 Myofibroblastic sarcoma", "8826/0 Angiomyofibroblastoma", "8827/1 Myofibroblastic tumor, peribronchial", "8828/0 Nodular fasciitis", "8830/0 Benign fibrous histiocytoma, NOS", "8830/1 Atypical fibrous histiocytoma", "8830/3 Malignant fibrous histiocytoma", "8831/0 Histiocytoma, NOS", "8832/0 Dermatofibroma, NOS", "8832/1 Dermatofibrosarcoma protuberans, NOS", "8832/3 Dermatofibrosarcoma protuberans, fibrosarcomatous", "8833/1 Pigmented dermatofibrosarcoma protuberans", "8834/1 Giant cell fibroblastoma", "8835/1 Plexiform fibrohistiocytic tumor", "8836/1 Angiomatoid fibrous histiocytoma"], "884 Myxomatous neoplasms":  [ "include all", "8840/0 Myxoma, NOS", "8840/3 Myxosarcoma", "8841/0 Angiomyxoma, NOS", "8842/0 Ossifying fibromyxoid tumor, NOS", "8842/3 Ossifying fibromyxoid tumor, malignant"], "885-888 Lipomatous neoplasms":  [ "include all", "8850/0 Lipoma, NOS", "8850/1 Atypical lipomatous tumor", "8850/3 Liposarcoma, NOS", "8851/0 Fibrolipoma", "8851/1 Lipofibromatosis", "8851/3 Liposarcoma, well differentiated, NOS", "8852/0 Fibromyxolipoma", "8852/3 Myxoid liposarcoma", "8854/3 Pleomorphic liposarcoma", "8855/3 Mixed liposarcoma", "8856/0 Intramuscular lipoma", "8857/0 Spindle cell lipoma", "8857/3 Fibroblastic liposarcoma", "8858/3 Dedifferentiated liposarcoma", "8860/0 Angiomyolipoma", "8860/1 Angiomyolipoma, epithelioid", "8861/0 Angiolipoma, NOS", "8862/0 Chondroid lipoma", "8870/0 Myelolipoma", "8880/0 Hibernoma", "8881/0 Lipoblastomatosis"], "889-892 Myomatous neoplasms":  [ "include all", "8890/0 Leiomyoma, NOS", "8890/1 Leiomyomatosis, NOS", "8890/3 Leiomyosarcoma, NOS", "8891/0 Epithelioid leiomyoma", "8891/3 Epithelioid leiomyosarcoma", "8892/0 Cellular leiomyoma", "8893/0 Bizarre leiomyoma", "8894/0 Angioleiomyoma", "8894/3 Angiomyosarcoma", "8895/0 Myoma", "8895/3 Myosarcoma", "8896/0 Myxoid leiomyoma", "8896/3 Myxoid leiomyosarcoma", "8897/1 Smooth muscle tumor of uncertain malignant potential", "8898/1 Metastasizing leiomyoma", "8900/0 Rhabdomyoma, NOS", "8900/3 Rhabdomyosarcoma, NOS", "8901/3 Pleomorphic rhabdomyosarcoma, adult type", "8902/3 Mixed type rhabdomyosarcoma", "8903/0 Fetal rhabdomyoma", "8904/0 Adult cellular rhabdomyoma", "8905/0 Genital rhabdomyoma", "8910/3 Embryonal rhabdomyosarcoma, NOS", "8912/3 Spindle cell rhabdomyosarcoma", "8920/3 Alveolar rhabdomyosarcoma", "8921/3 Ectomesenchymoma"], "893-899 Complex mixed and stromal neoplasms":  [ "include all", "8930/0 Endometrial stromal nodule", "8930/3 Endometrial stromal sarcoma, NOS", "8931/3 Endometrial stromal sarcoma, low grade", "8932/0 Adenomyoma, NOS", "8933/3 Adenosarcoma", "8934/3 Carcinofibroma", "8935/0 Stromal tumor, benign", "8935/1 Stromal tumor, NOS", "8935/3 Stromal sarcoma, NOS", "8936/3 Gastrointestinal stromal tumor", "8940/0 Pleomorphic adenoma", "8940/3 Mixed tumor, malignant, NOS", "8941/3 Carcinoma ex pleomorphic adenoma", "8950/3 Mullerian mixed tumor", "8951/3 Mesodermal mixed tumor", "8959/0 Benign cystic nephroma", "8959/1 Cystic partially differentiated nephroblastoma", "8959/3 Malignant cystic nephroma", "8960/1 Mesoblastic nephroma", "8960/3 Nephroblastoma, NOS", "8963/3 Rhabdoid tumor, NOS", "8964/3 Clear cell sarcoma of kidney", "8966/0 Renomedullary interstitial cell tumor", "8967/0 Ossifying renal tumor", "8970/3 Hepatoblastoma, NOS", "8971/3 Pancreatoblastoma", "8972/3 Pulmonary blastoma", "8973/3 Pleuropulmonary blastoma", "8974/1 Sialoblastoma", "8975/1 Calcifying nested stromal-epithelial tumor", "8980/3 Carcinosarcoma, NOS", "8981/3 Carcinosarcoma, embryonal", "8982/0 Myoepithelioma, NOS", "8982/3 Myoepithelial carcinoma", "8983/0 Adenomyoepithelioma, NOS", "8983/3 Adenomyoepithelioma with carcinoma", "8990/0 Mesenchymoma, benign", "8990/1 Mesenchymoma, NOS", "8990/3 Mesenchymoma, malignant", "8991/3 Embryonal sarcoma", "8992/0 Pulmonary hamartoma"], "900-903 Fibroepithelial neoplasms":  [ "include all", "9000/0 Brenner tumor, NOS", "9000/1 Brenner tumor, borderline malignancy", "9000/3 Brenner tumor, malignant", "9010/0 Fibroadenoma, NOS", "9011/0 Intracanalicular fibroadenoma", "9012/0 Pericanalicular fibroadenoma", "9013/0 Adenofibroma, NOS", "9014/0 Serous adenofibroma, NOS", "9014/1 Serous adenofibroma of borderline malignancy", "9014/3 Serous adenocarcinofibroma", "9015/0 Mucinous adenofibroma, NOS", "9015/1 Mucinous adenofibroma of borderline malignancy", "9015/3 Mucinous adenocarcinofibroma", "9016/0 Giant fibroadenoma", "9020/0 Phyllodes tumor, benign", "9020/1 Phyllodes tumor, borderline", "9020/3 Phyllodes tumor, malignant", "9030/0 Juvenile fibroadenoma"], "904 Synovial-like neoplasms":  [ "include all", "9040/0 Synovioma, benign", "9040/3 Synovial sarcoma, NOS", "9041/3 Synovial sarcoma, spindle cell", "9042/3 Synovial sarcoma, epithelioid cell", "9043/3 Synovial sarcoma, biphasic", "9044/3 Clear cell sarcoma, NOS", "9045/3 Biphenotypic sinonasal sarcoma"], "905 Mesothelial neoplasms":  [ "include all", "9050/0 Mesothelioma, benign", "9050/3 Mesothelioma, malignant", "9051/0 Fibrous mesothelioma, benign", "9051/3 Fibrous mesothelioma, malignant", "9052/0 Epithelioid mesothelioma, benign", "9052/1 Well differentiated papillary mesothelioma of the pleura", "9052/3 Epithelioid mesothelioma, malignant", "9053/3 Mesothelioma, biphasic, malignant", "9054/0 Adenomatoid tumor, NOS", "9055/0 Peritoneal inclusion cysts"], "906-909 Germ cell neoplasms":  [ "include all", "9060/3 Dysgerminoma", "9061/3 Seminoma, NOS", "9062/3 Seminoma, anaplastic", "9063/3 Spermatocytic seminoma", "9064/2 Intratubular malignant germ cells", "9064/3 Germinoma", "9065/3 Germ cell tumor, nonseminomatous", "9070/3 Embryonal carcinoma, NOS", "9071/3 Yolk sac tumor, NOS", "9072/3 Polyembryoma", "9073/1 Gonadoblastoma", "9080/0 Teratoma, benign", "9080/1 Teratoma, NOS", "9080/3 Teratoma, malignant, NOS", "9081/3 Teratocarcinoma", "9082/3 Malignant teratoma, undifferentiated", "9083/3 Malignant teratoma, intermediate", "9084/0 Dermoid cyst, NOS", "9084/3 Teratoma with malignant transformation", "9085/3 Mixed germ cell tumor", "9086/3 Germ cell tumor with associated hematological malignancy", "9090/0 Struma ovarii, NOS", "9090/3 Struma ovarii, malignant", "9091/1 Strumal carcinoid"], "910 Trophoblastic neoplasms":  [ "include all", "9100/0 Hydatidiform mole, NOS", "9100/1 Invasive hydatidiform mole", "9100/3 Choriocarcinoma, NOS", "9101/3 Choriocarcinoma combined with other germ cell elements", "9102/3 Malignant teratoma, trophoblastic", "9103/0 Partial hydatidiform mole", "9104/1 Placental site trophoblastic tumor", "9105/3 Trophoblastic tumor, epithelioid"], "911 Mesonephromas":  [ "include all", "9110/0 Adenoma of rete ovarii", "9110/1 Wolffian tumor", "9110/3 Mesonephroma, malignant"], "912-916 Blood vessel tumors":  [ "include all", "9120/0 Hemangioma, NOS", "9120/3 Hemangiosarcoma", "9121/0 Cavernous hemangioma", "9122/0 Venous hemangioma", "9123/0 Racemose hemangioma", "9124/3 Kupffer cell sarcoma", "9125/0 Epithelioid hemangioma", "9126/0 Atypical vascular lesion", "9130/1 Hemangioendothelioma, NOS", "9130/3 Hemangioendothelioma, malignant", "9131/0 Capillary hemangioma", "9132/0 Intramuscular hemangioma", "9133/3 Epithelioid hemangioendothelioma, NOS", "9135/1 Papillary intralymphatic angioendothelioma", "9136/1 Spindle cell hemangioendothelioma", "9137/0 Myointimoma", "9137/3 Intimal sarcoma", "9138/1 Pseudomyogenic (epithelioid sarcoma-like) hemangioendothelioma", "9140/3 Kaposi sarcoma", "9141/0 Angiokeratoma", "9142/0 Verrucous keratotic hemangioma", "ICDO3.2", "Level", "Term", "two", "9160/0 Angiofibroma, NOS", "9161/0 Acquired tufted hemangioma", "9161/1 Hemangioblastoma"], "917 Lymphatic vessel tumors":  [ "include all", "9170/0 Lymphangioma, NOS", "9170/3 Lymphangiosarcoma", "9171/0 Capillary lymphangioma", "9172/0 Cavernous lymphangioma", "9173/0 Cystic lymphangioma", "9174/0 Lymphangiomyoma", "9174/1 Lymphangioleiomyomatosis", "9175/0 Hemolymphangioma"], "918-924 Osseous and chondromatous neoplasms":  [ "include all", "9180/0 Osteoma, NOS", "9180/3 Osteosarcoma, NOS", "9181/3 Chondroblastic osteosarcoma", "9182/3 Fibroblastic osteosarcoma", "9183/3 Telangiectatic osteosarcoma", "9184/3 Osteosarcoma in Paget disease of bone", "9185/3 Small cell osteosarcoma", "9186/3 Central osteosarcoma, NOS", "9187/3 Low grade central osteosarcoma", "9191/0 Osteoid osteoma, NOS", "9192/3 Parosteal osteosarcoma", "9193/3 Periosteal osteosarcoma", "9194/3 High grade surface osteosarcoma", "9195/3 Intracortical osteosarcoma", "9200/0 Osteoblastoma, NOS", "9200/1 Aggressive osteoblastoma", "9210/0 Osteochondroma", "9210/1 Osteochondromatosis, NOS", "9211/0 Osteochondromyxoma", "9212/0 Bizarre parosteal osteochondromatous proliferation", "9213/0 Subungual exostosis", "9220/0 Chondroma, NOS", "9220/1 Chondromatosis, NOS", "9220/3 Chondrosarcoma, NOS", "9221/0 Periosteal chondroma", "9221/3 Periosteal chondrosarcoma", "9222/1 Atypical cartilaginous tumor", "9230/1 Chondroblastoma, NOS", "9230/3 Chondroblastoma, malignant", "9231/3 Myxoid chondrosarcoma", "9240/3 Mesenchymal chondrosarcoma", "9241/0 Chondromyxoid fibroma", "9242/3 Clear cell chondrosarcoma", "9243/3 Dedifferentiated chondrosarcoma"], "925 Giant cell tumors":  [ "include all", "9250/1 Giant cell tumor of bone, NOS", "9250/3 Giant cell tumor of bone, malignant", "9251/1 Giant cell tumor of soft parts, NOS", "9251/3 Malignant giant cell tumor of soft parts", "9252/0 Tenosynovial giant cell tumor, NOS", "9252/1 Tenosynovial giant cell tumor, diffuse", "9252/3 Malignant tenosynovial giant cell tumor"], "926 Miscellaneous bone tumors":  [ "include all", "9260/0 Aneurysmal bone cyst", "9261/3 Adamantinoma of long bones", "9262/0 Ossifying fibroma"], "927-934 Odontogenic tumors":  [ "include all", "9270/0 Odontogenic tumor, benign", "9270/1 Odontogenic tumor, NOS", "9270/3 Odontogenic tumor, malignant", "9271/0 Ameloblastic fibrodentinoma", "9272/0 Cementoma, NOS", "9273/0 Cementoblastoma, benign", "9274/0 Cemento-ossifying fibroma", "9275/0 Gigantiform cementoma", "9280/0 Odontoma, NOS", "9281/0 Compound odontoma", "9282/0 Complex odontoma", "9290/0 Ameloblastic fibro-odontoma", "9290/3 Ameloblastic odontosarcoma", "9300/0 Adenomatoid odontogenic tumor", "9301/0 Calcifying odontogenic cyst", "9302/0 Dentinogenic ghost cell tumor", "9302/3 Ghost cell odontogenic carcinoma", "9310/0 Ameloblastoma, NOS", "9310/3 Ameloblastoma, metastasizing", "9311/0 Odontoameloblastoma", "9312/0 Squamous odontogenic tumor", "9320/0 Odontogenic myxoma", "9321/0 Odontogenic fibroma, NOS", "9322/0 Peripheral odontogenic fibroma", "9330/0 Ameloblastic fibroma", "9330/3 Ameloblastic fibrosarcoma", "9340/0 Calcifying epithelial odontogenic tumor", "9341/3 Clear cell odontogenic carcinoma", "9342/3 Odontogenic carcinosarcoma"], "935-937 Miscellaneous tumors":  [ "include all", "9350/1 Craniopharyngioma", "9351/1 Craniopharyngioma, adamantinomatous", "9352/1 Craniopharyngioma, papillary", "9361/1 Pineocytoma", "9362/3 Pineoblastoma", "9363/0 Melanotic neuroectodermal tumor", "9364/3 Ewing sarcoma", "9365/3 Askin tumor", "9370/0 Benign notochordal tumor", "9370/3 Chordoma, NOS", "9371/3 Chondroid chordoma", "9372/3 Dedifferentiated chordoma", "9373/0 Parachordoma"], "938-948 Gliomas":  [ "include all", "9380/3 Glioma, malignant", "9381/3 Gliomatosis cerebri", "9382/3 Oligoastrocytoma, NOS", "9383/1 Subependymoma", "9384/1 Subependymal giant cell astrocytoma", "9385/3 Diffuse midline glioma, H3 K27M-mutant", "9390/0 Choroid plexus papilloma, NOS", "9390/1 Atypical choroid plexus papilloma", "9390/3 Choroid plexus carcinoma", "9391/1 Sellar ependymoma", "9391/3 Ependymoma, NOS", "9392/3 Ependymoma, anaplastic", "9393/3 Papillary ependymoma", "9394/1 Myxopapillary ependymoma", "9395/3 Papillary tumor of the pineal region", "9396/3 Ependymoma, RELA fusion-positive", "9400/3 Astrocytoma, NOS", "9401/3 Astrocytoma, anaplastic", "9411/3 Gemistocytic astrocytoma, NOS", "9412/1 Desmoplastic infantile astrocytoma", "9413/0 Dysembryoplastic neuroepithelial tumor", "9420/3 Fibrillary astrocytoma", "9421/1 Pilocytic astrocytoma", "9423/3 Polar spongioblastoma", "9424/3 Pleomorphic xanthoastrocytoma", "9425/3 Pilomyxoid astrocytoma", "9431/1 Angiocentric glioma", "9432/1 Pituicytoma", "9440/3 Glioblastoma, NOS", "9441/3 Giant cell glioblastoma", "9442/1 Gliofibroma", "9442/3 Gliosarcoma", "9444/1 Chordoid glioma", "9445/3 Glioblastoma, IDH-mutant", "9450/3 Oligodendroglioma, NOS", "9451/3 Oligodendroglioma, anaplastic, NOS", "ICDO3.2", "Level", "Term", "two", "9470/3 Medulloblastoma, NOS", "9471/3 Desmoplastic nodular medulloblastoma", "9473/3 CNS embryonal tumor, NOS", "9474/3 Large cell medulloblastoma", "9475/3 Medullobloastoma, WNT-activated, NOS", "9476/3 Medulloblastoma, SHH-activated and TP53-mutant", "9477/3 Medulloblastoma, non-WNT/non-SHH", "9478/3 Embryonal tumor with multilayered rosettes with C19MC alteration", "ICDO3.2", "Level", "Term", "two"], "949-952 Neuroepitheliomatous neoplasms":  [ "include all", "9490/0 Ganglioneuroma", "9490/3 Ganglioneuroblastoma", "9491/0 Ganglioneuromatosis", "9492/0 Gangliocytoma, NOS", "9493/0 Dysplastic gangliocytoma of cerebellum (Lhermitte-Duclos)", "9500/3 Neuroblastoma, NOS", "9501/0 Medulloepithelioma, benign", "9501/3 Medulloepithelioma, NOS", "9502/0 Teratoid medulloepithelioma, benign", "9502/3 Teratoid medulloepithelioma, NOS", "9503/3 Neuroepithelioma, NOS", "9504/3 Spongioneuroblastoma", "9505/1 Ganglioglioma, NOS", "9505/3 Ganglioglioma, anaplastic", "9506/1 Central neurocytoma", "9507/0 Pacinian tumor", "9508/3 Atypical teratoid/rhabdoid tumor", "9509/1 Papillary glioneuronal tumor", "9510/0 Retinocytoma", "9510/3 Retinoblastoma, NOS", "9511/3 Retinoblastoma, differentiated", "9512/3 Retinoblastoma, undifferentiated", "9513/3 Retinoblastoma, diffuse", "9514/1 Retinoblastoma, spontaneously regressed", "9520/3 Olfactory neurogenic tumor", "9521/3 Olfactory neurocytoma", "9522/3 Olfactory neuroblastoma", "9523/3 Olfactory neuroepithelioma"], "953 Meningiomas":  [ "include all", "9530/0 Meningioma, NOS", "9530/3 Meningioma, malignant", "9531/0 Meningothelial meningioma", "9532/0 Fibrous meningioma", "9533/0 Psammomatous meningioma", "9534/0 Angiomatous meningioma", "9537/0 Transitional meningioma", "9538/1 Clear cell meningioma", "9538/3 Papillary meningioma", "9539/1 Atypical meningioma", "9539/3 Meningeal sarcomatosis"], "954-957 Nerve sheath tumors":  [ "include all", "9540/0 Neurofibroma, NOS", "9540/3 Malignant peripheral nerve sheath tumor, NOS", "9541/0 Melanotic neurofibroma", "9542/3 Malignant peripheral nerve sheath tumor, epithelioid", "9550/0 Plexiform neurofibroma", "9560/0 Schwannoma, NOS", "9560/1 Melanotic schwannoma", "9561/3 Malignant peripheral nerve sheath tumor with rhabdomyoblastic differentiation", "9562/0 Nerve sheath myxoma", "9563/0 Nerve sheath tumor, NOS", "9570/0 Neuroma, NOS", "9571/0 Perineurioma, NOS", "9571/3 Perineurioma, malignant"], "958 Granular cell tumors and alveolar soft part sarcomas":  [ "include all", "9580/0 Granular cell tumor, NOS", "9580/3 Granular cell tumor, malignant", "9581/3 Alveolar soft part sarcoma", "9582/0 Granular cell tumor of the sellar region"], "959-972 Hodgkin and non-Hodgkin lymphomas":  [ "include all", "9590/3 Malignant lymphoma, NOS", "9591/1 Monoclonal B-cell lymphocytosis, NOS", "9591/3 Malignant lymphoma, non-Hodgkin, NOS", "9596/3 Composite Hodgkin and non-Hodgkin lymphoma", "9597/3 Primary cutaneous follicle centre lymphoma", "ICDO3.2", "Level", "Term", "two", "ICDO3.2", "Level", "Term", "two", "ICDO3.2", "Level", "Term", "two", "ICDO3.2", "Level", "Term", "two", "ICDO3.2", "Level", "Term", "two", "9650/3 Hodgkin lymphoma, NOS", "9651/3 Hodgkin lymphoma, lymphocyte-rich", "9652/3 Hodgkin lymphoma, mixed cellularity, NOS", "9653/3 Hodgkin lymphoma, lymphocyte depletion, NOS", "9654/3 Hodgkin lymphoma, lymphocyte depletion, diffuse fibrosis", "9659/3 Hodgkin lymphoma, nodular lymphocyte predominant", "9663/3 Hodgkin lymphoma, nodular sclerosis, NOS", "9664/3 Hodgkin lymphoma, nodular sclerosis, cellular phase", "9665/3 Hodgkin lymphoma, nodular sclerosis, grade 1", "9667/3 Hodgkin lymphoma, nodular sclerosis, grade 2", "9671/3 Lymphoplasmacytic lymphoma", "9673/1 In situ mantle cell neoplasia", "9673/3 Mantle cell lymphoma", "9678/3 Primary effusion lymphoma", "9679/3 Mediastinal large B-cell lymphoma", "9680/1 EBV positive mucocutaneous ulcer", "9680/3 Diffuse large B-cell lymphoma, NOS", "9684/3 Malignant lymphoma, large B-cell, diffuse, immunoblastic, NOS", "9687/3 Burkitt lymphoma, NOS", "9688/3 T-cell/histiocyte rich large B-cell lymphoma", "9689/3 Splenic marginal zone B-cell lymphoma", "9690/3 Follicular lymphoma, NOS", "9691/3 Follicular lymphoma, grade 2", "9695/1 In situ follicular neoplasia", "9695/3 Follicular lymphoma, grade 1", "9698/3 Follicular lymphoma, grade 3", "9699/3 Marginal zone B-cell lymphoma, NOS", "9700/3 Mycosis fungoides", "9701/3 Sezary syndrome", "9702/1 Indolent T-cell lymphoproliferative disorder of the gastrointestinal tract", "9702/3 Mature T-cell lymphoma, NOS", "9705/3 Angioimmunoblastic T-cell lymphoma", "9708/3 Subcutaneous panniculitis-like T-cell lymphoma", "9709/1 Primary cutaneous CD4-positive small/medium T-cell lymphoproliferative disorder", "9709/3 Cutaneous T-cell lymphoma, NOS", "9712/3 Intravascular large B-cell lymphoma", "9714/3 Anaplastic large cell lymphoma, T-cell and Null-cell type", "9715/3 Anaplastic large cell lymphoma, ALK negative", "9716/3 Hepatosplenic T-cell lymphoma", "9717/3 Intestinal T-cell lymphoma", "9718/1 Primary cutaneous CD30+T-cell lymphoproliferative disorder", "9718/3 Primary cutaneous anaplastic large cell lymphoma", "9719/3 NK/T-cell lymphoma, nasal and nasal type", "9724/3 Systemic EBV positive T-cell lymphoproliferative disease of childhood", "9725/1 Hydroa vacciniforme-like lymphoproliferative disorder", "9726/3 Primary cutaneous gamma-delta T-cell lymphoma", "9727/3 Precursor cell lymphoblastic lymphoma, NOS"], "973 Plasma cell neoplasms":  [ "include all", "9731/3 Plasmacytoma, NOS", "9732/3 Plasma cell myeloma", "9733/3 Plasma cell leukemia", "9734/3 Plasmacytoma, extramedullary", "9735/3 Plasmablastic lymphoma", "9737/3 ALK positive large B-cell lymphoma", "9738/3 HHV8-positive diffuse large B-cell lymphoma"], "974 Mast cell neoplasms":  [ "include all", "9740/1 Mastocytoma, NOS", "9740/3 Mast cell sarcoma", "9741/1 Indolent systemic mastocytosis", "9741/3 Malignant mastocytosis", "9742/3 Mast cell leukemia", "9749/3 Erdheim-Chester disease"], "975 Neoplasms of histiocytes and accessory lymphoid cells":  [ "include all", "9750/3 Malignant histiocytosis", "9751/1 Langerhans cell histiocytosis, NOS", "9751/3 Langerhans cell histiocytosis, disseminated", "9755/3 Histiocytic sarcoma", "9756/3 Langerhans cell sarcoma", "9757/3 Interdigitating dendritic cell sarcoma", "9758/3 Follicular dendritic cell sarcoma", "9759/3 Fibroblastic reticular cell tumor"], "976 Immunoproliferative diseases":  [ "include all", "9760/3 Immunoproliferative disease, NOS", "9761/1 IgM monoclonal gammopathy of undetermined significance", "9761/3 Waldenstrom macroglobulinemia", "9762/3 Heavy chain disease, NOS", "9764/3 Immunoproliferative small intestinal disease", "9765/1 Monoclonal gammopathy of undetermined significance, NOS", "9766/1 Angiocentric immunoproliferative lesion", "9766/3 Lymphomatoid granulomatosis, grade 3", "9767/1 Angioimmunoblastic lymphadenopathy (AIL)", "9768/1 T-gamma lymphoproliferative disease", "9769/1 Immunoglobulin deposition disease"], "980-994 Leukemias":  [ "include all", "9800/3 Leukemia, NOS", "9801/3 Acute leukemia, NOS", "9805/3 Acute biphenotypic leukemia", "9806/3 Mixed phenotype acute leukemia with t(9;22)(q34;q11.2); BCR-ABL1", "9807/3 Mixed phenotype acute leukemia with t(v;11q23); MLL rearranged", "9808/3 Mixed phenotype acute leukemia, B/myeloid, NOS", "9809/3 Mixed phenotype acute leukemia, T/myeloid, NOS", "9811/3 B lymphoblastic leukemia/lymphoma, NOS", "9812/3 B lymphoblastic leukemia/lymphoma with t(9;22)(q34;q11.2); BCR-ABL1", "9813/3 B lymphoblastic leukemia/lymphoma with t(v;11q23); MLL rearranged", "9814/3 B lymphoblastic leukemia/lymphoma with t(12;21)(p13;q22); TEL-AML1(ETV6-RUNX1)", "9815/3 B lymphoblastic leukemia/lymphoma with hyperdiploidy", "9816/3 B lymphoblastic leukemia/lymphoma with hypodiploidy(Hypodiploid ALL)", "9817/3 B lymphoblastic leukemia/lymphoma with t(5;14)(q31;q32); IL3-IGH", "9818/3 B lymphoblastic leukemia/lymphoma with t(1;19)(q23;p13.3); E2A-PBX1(TCF3-PBX1)", "9819/3 B lymphoblastic leukemia/lymphoma, BCR-ABL1-like", "9820/3 Lymphoid leukemia, NOS", "9823/1 Monoclonal B-cell lymphocytosis, CLL type", "9823/3 B-cell chronic lymphocytic leukemia/small lymphocytic lymphoma", "9827/3 Adult T-cell leukemia/lymphoma (HTLV-1 positive)", "9831/3 T-cell large granular lymphocytic leukemia", "9832/3 Prolymphocytic leukemia, NOS", "9833/3 Prolymphocytic leukemia, B-cell type", "9834/3 Prolymphocytic leukemia, T-cell type", "9835/3 Precursor cell lymphoblastic leukemia, NOS", "9837/3 Precursor T-cell lymphoblastic leukemia", "9840/3 Acute erythroid leukemia", "ICDO3.2", "Level", "Term", "two", "9860/3 Myeloid leukemia, NOS", "9861/3 Acute myeloid leukemia, NOS", "9863/3 Chronic myeloid leukemia, NOS", "9865/3 Acute myeloid leukemia with t(6;9)(p23;q34); DEK-NUP214", "9866/3 Acute promyelocytic leukemia, t(15;17)(q22;q11-12)", "9867/3 Acute myelomonocytic leukemia, NOS", "9869/3 Acute myeloid leukemia with inv(3)(q21;q26.2) or t(3;3)(q21;q26.2); RPN1-EVI1", "9870/3 Acute basophilic leukemia", "9871/3 Acute myeloid leukemia with abnormal marrow eosinophils", "9872/3 Acute myeloid leukemia, minimal differentiation", "9873/3 Acute myeloid leukemia without maturation", "9874/3 Acute myeloid leukemia with maturation", "9875/3 Chronic myelogenous leukemia, BCR/ABL positive", "9876/3 Atypical chronic myeloid leukemia, BCR/ABL negative", "9877/3 Acute myeloid leukemia with mutated NPM1", "9878/3 Acute myeloid leukemia with biallelic mutation of CEBPA", "9879/3 Acute myeloid leukemia with mutated RUNX1", "ICDO3.2", "Level", "Term", "two", "9891/3 Acute monocytic leukemia", "9895/3 Acute myeloid leukemia with myelodysplasia-related changes", "9896/3 Acute myeloid leukemia, t(8;21)(q22;q22)", "9897/3 Acute myeloid leukemia, 11q23 abnormalities", "9898/1 Transient abnormal myelopoiesis", "9898/3 Myeloid leukemia associated with Down syndrome", "ICDO3.2", "Level", "Term", "two", "9910/3 Acute megakaryoblastic leukemia", "9911/3 Acute myeloid leukemia (megakaryoblastic) with t(1;22)(p13;q13); RBM15-MKL1", "9912/3 Acute myleoid leukemia with BCR-ABL1", "9920/3 Therapy-related myeloid neoplasm", "9930/3 Myeloid sarcoma", "9931/3 Acute panmyelosis with myelofibrosis", "9940/3 Hairy cell leukemia, NOS", "9945/3 Chronic myelomonocytic leukemia, NOS", "9946/3 Juvenile myelomonocytic leukemia, NOS", "9948/3 Aggressive NK-cell leukemia"], "995-996 Myeloproliferative neoplasms":  [ "include all", "9950/3 Polycythemia vera", "9960/3 Myeloproliferative neoplasm, NOS", "9961/3 Primary myelofibrosis", "9962/3 Essential thrombocythemia", "9963/3 Chronic neutrophilic leukemia", "9964/3 Chronic eosinophilic leukemia", "9965/3 Myeloid or lymphoid neoplasm with PDGFRA rearrangement", "9966/3 Myeloid neoplasm with PDGFRB rearrangement", "9967/3 Myeloid or lymphoid neoplasm with FGFR1 abnormalities", "9968/3 Myeloid or lymphoid neoplasm with PCM1-JAK2"], "997 Other hematological neoplasms":  [ "include all", "9970/1 Lymphoproliferative disorder, NOS", "9971/1 Post transplant lymphoproliferative disorder, NOS", "9975/3 Myeloproliferative neoplasm, unclassifiable"], "998-999 Myelodysplastic syndromes":  [ "include all", "9980/3 Myelodysplastic syndrome with single lineage dysplasia", "9982/3 Myelodysplastic syndrome with ring sideroblasts and single lineage dysplasia", "9983/3 Myelodysplastic syndrome with excess blasts", "9985/3 Myelodysplastic syndrome with multilineage dysplasia", "9986/3 Myelodysplastic syndrome with isolated del (5q)", "9987/3 Therapy-related myelodysplastic syndrome, NOS", "9989/3 Myelodysplastic syndrome, NOS", "9993/3 Myelodysplastic syndrome with ring sideroblasts and multilineage dysplasia"]}
    },
  {
    "CRUK cancer terms":
        ["include all", "All", "Acute lymphoblastic leukaemia (ALL)", "Acute lymphoblastic leukaemia (ALL) in children", "Acute myeloid leukaemia (AML)", "Adrenal gland tumours", "Ampullary cancer", "Anal cancer", "Basal cell skin cancer", "Bile duct cancer", "Bladder cancer", "Blood cancers", "Bone cancer", "Bowel cancer", "Brain tumours", "Brain tumours in children", "Breast cancer", "Breast cancer in men", "Cancer of unknown primary (CUP)", "Cancer spread to bone", "Cancer spread to brain", "Cancer spread to liver", "Cancer spread to lung", "Carcinoid", "Cervical cancer", "Children's cancers", "Cholangiocarcinoma", "Chronic lymphocytic leukaemia (CLL)", "Chronic myeloid leukaemia (CML)", "Chronic myelomonocytic leukaemia (CMML)", "Colorectal cancer", "Ear cancer", "Endometrial cancer", "Essential Thrombocythaemia (ET)", "Eye cancer", "Follicular dendritic cell sarcoma", "Ginclude allbladder cancer", "Gastric cancer", "Gastro oesophageal junction cancers", "Germ cell tumours", "Gestational trophoblastic disease (GTD)", "Hairy cell leukaemia", "Head and neck cancer", "Hodgkin lymphoma", "Invasive mole and choriocarcinomas", "Juvenile myelomonocytic leukaemia (JMML)", "Kaposi's sarcoma", "Kidney cancer", "Large bowel and rectal neuroendocrine tumours", "Laryngeal cancer", "Leukaemia", "Liver cancer", "Lung cancer", "Lung neuroendocrine tumours (NETs)", "Lymphoma", "Malignant schwannoma", "Mediastinal germ cell tumours", "Melanoma skin cancer", "Men's cancer", "Merkel cell skin cancer", "Mesothelioma", "Mouth and oropharyngeal cancer", "Myelodysplastic syndromes (MDS)", "Myelofibrosis", "Myeloma", "Myeloproliferative neoplasms", "Nasal and paranasal sinus cancer", "Nasopharyngeal cancer", "Neuroblastoma", "Neuroendocrine tumours", "Neuroendocrine tumours of the pancreas", "Non-Hodgkin lymphoma", "Non-Hodgkin lymphoma in children", "Oesophageal cancer", "Other conditions", "Ovarian cancer", "Pancreatic cancer", "Penile cancer", "Persistent trophoblastic disease and choriocarcinoma", "Phaeochromocytoma", "Placental site trophoblastic tumour and epithelioid trophoblastic tumour", "Polycythaemia vera (PV)", "Prostate cancer", "Pseudomyxoma peritonei", "Rare cancer", "Rectal cancer", "Retinoblastoma", "Salivary gland cancer", "Secondary cancer", "Signet cell cancer", "Skin cancer (including basal cell and squamous cell skin cancers)", "Sminclude all bowel cancer", "Sminclude all bowel neuroendocrine tumours (NETs)", "Soft tissue sarcoma", "Spinal cord tumours", "Squamous cell skin cancer", "Stomach cancer", "Stomach neuroendocrine tumours (NETs)", "Testicular cancer", "Thymus gland tumours", "Thyroid cancer", "Tongue cancer", "Tonsil cancer", "Tumours of the adrenal gland", "Unknown primary cancer", "Upper urinary tract urothelial cancer", "Uterine cancer", "Vaginal cancer", "Vulval cancer", "Wilms tumour", "Womb cancer", "Women's cancers (gynaecological cancer)"
    ]

  },
  {
    "In Vitro Study": {
        "include all":[],
        "Model": [
            "include all",
            "Organ on a Chip",
            "3D organoid (including on a chip)",
            "Organ slice"
        ],

        "Cell Source": [
          "include all",
          "Immortalised cell-line",
          "Patient derived",
          "Animal"
        ],
        "Treatment": [
           "include all",
           "Cell and cell-derived treatment",
           "Gene knock-down",
           "Medication",
           "Radiation"
        ]}
  },
  {
    "Animal Model": {
      "include all" : [],
      "Animal": [
        "include all",
        "Chicken",
        "Dog",
        "Fruit fly",
        "Mouse",
        "Rabbit",
        "Rat"
      ],
       "Animal description": [
        "include all",
        "Genetically engineered",
        "Immuno-compromised",
        "Patient-Derived xenograft",
        "Syngeneic"
      ],
      "Biobank Samples": [
        "include all",
        "Bloods",
        "Cells",
        "DNA/RNA",
        "Other Fluids",
        "Tissues"
      ],
      "Biopsy & Lab Results": [
        "include all",
        "Biomarkers",
        "Flow Cytometry",
        "Immunohistochemistry"
      ],
      "Imaging Data": [
        "include all",
        "Bioluminescence Imaging",
        "Fluorescence Imaging",
        "Magnetic Resonance Imaging",
        "Medical photography",
        "Microscopy",
        "Nuclear medicine imaging",
        "Radiographic imaging",
        "Ultrasonography"
      ],
      "Longitudinal Follow up": [
        "include all",
        "Behavioural data",
        "Clinical observations",
        "Response outcomes",
        "Side effects",
        "Survival data"
      ],
      "Multi-omic Data": [
        "include all",
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
        "include all",
        "Medication",
        "Cell and cell-derived treatments",
        "Micro-biome alterations",
        "Organ resection and other ablations",
        "Radiotherapies"
      ]
    }
  },
  {
    "Patient study": {
      "include all":[],
      "Background": [
        "include all",
        "Child and Young Person",
        "Seniors",
        "Demographic",
        "Family history",
        "Lifestyle",
        "Quality of life (eg Education and/or employment)"
      ],
      "Biobank Samples": [
        "include all",
        "Bloods",
        "Cells",
        "DNA/RNA",
        "Other Fluids",
        "Organoids",
        "Primary cell lines",
        "Tissues"
      ],
      "Biopsy Reports and Lab Results": [
        "include all",
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
        "include all",
        "Bioluminescence Imaging",
        "Fluorescence Imaging",
        "Magnetic Resonance Imaging",
        "Medical photography",
        "Microscopy",
        "Nuclear medicine imaging",
        "Radiographic imaging",
        "Ultrasonography"
      ],
      "Longitudinal Follow up": [
        "include all",
        "Patient-Reported Outcomes",
        "Response outcomes",
        "Side effects",
        "Survival data"
      ],
      "Multi-omic Data": [
        "include all",
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
        "include all",
        "Medication",
        "Organ resection and other ablations",
        "Radiotherapies"
      ]
    }
  }
];
const ROOT = keywordsRaw.reduce((acc, obj) => Object.assign(acc, obj), {});
const filterPanel = document.getElementById('filterPanel');
const breadcrumbEl = document.getElementById('breadcrumb');
const choicesContainer = document.getElementById('choices-container');
let choicesEl = document.getElementById('choices');

const backBtn = document.getElementById('backBtn');
const clearBtn = document.getElementById('clearBtn');
const chipsEl = document.getElementById('selectedChips');

let path = [];
const selected = new Map();
let isAnimating = false; // Moved to global scope

function getFullPath(keyword) {
    const fullPathArray = [...path, keyword];
    return fullPathArray.join(' > ');
}

function getNodeFromPath(root, pth) {
    return pth.reduce((node, key) => (node && typeof node === 'object') ? node[key] : undefined, root);
}

function isLeaf(node) {
    return Array.isArray(node);
}

function renderChips() {
    chipsEl.innerHTML = '';
    for (const [keyword, fullPath] of selected.entries()) {
        const span = document.createElement('span');
        span.className = 'chip';
        span.innerHTML = `${fullPath} <button>×</button>`;
        span.querySelector('button').addEventListener('click', () => {
            selected.delete(keyword);
            renderChips();
            render(); // Rerender to reflect the change
        });
        chipsEl.appendChild(span);
    }
}

function renderBreadcrumb() {
    breadcrumbEl.innerHTML = '';
    const home = document.createElement('span');
    home.textContent = 'Home';
    home.className = path.length ? 'crumb' : 'crumb current';
    if (path.length) home.addEventListener('click', () => {
        path = [];
        render();
    });
    breadcrumbEl.appendChild(home);
    path.forEach((key, idx) => {
        const sep = document.createElement('span');
        sep.textContent = '›';
        sep.style.margin = '0 4px';
        breadcrumbEl.appendChild(sep);
        const crumb = document.createElement('span');
        crumb.textContent = key;
        const isCurrent = idx === path.length - 1;
        crumb.className = isCurrent ? 'crumb current' : 'crumb';
        if (!isCurrent) {
            crumb.addEventListener('click', () => {
                path = path.slice(0, idx + 1);
                render();
            });
        }
        breadcrumbEl.appendChild(crumb);
    });
}

// Renamed and refactored to populate a given element, not the global choicesEl
function populateChoices(element, node) {
    element.innerHTML = '';
    if (node && typeof node === 'object' && !Array.isArray(node)) {
        Object.keys(node).forEach(key => {
            const value = node[key];
            if (Array.isArray(node) && !isNaN(key)) return;
            const li = document.createElement('li');
            li.className = 'list-item';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = selected.has(key);
            cb.addEventListener('change', () => {
                if (cb.checked) {
                    selected.set(key, getFullPath(key));
                } else {
                    selected.delete(key);
                }
                renderChips();
            });
            const label = document.createElement('span');
            label.textContent = key;
            const isBranch = typeof value === 'object';
            if (isBranch) {
                const expandSpan = document.createElement('span');
                expandSpan.textContent = " (expand)";
                expandSpan.className = "expand-text";
                label.appendChild(expandSpan);
            }
            label.addEventListener('click', () => {
                if (isBranch) {
                    transitionToNewChoices(key);
                } else {
                    cb.checked = !cb.checked;
                    cb.dispatchEvent(new Event('change'));
                }
            });
            li.appendChild(cb);
            li.appendChild(label);
            element.appendChild(li);
        });
    }

    if (isLeaf(node)) {
        node.forEach(item => {
            if (typeof item === 'object') return;
            const li = document.createElement('li');
            li.className = 'list-item';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = selected.has(item);
            cb.addEventListener('change', () => {
                if (cb.checked) {
                    selected.set(item, getFullPath(item));
                } else {
                    selected.delete(item);
                }
                renderChips();
            });
            const label = document.createElement('span');
            label.textContent = item;
            li.appendChild(cb);
            li.appendChild(label);
            element.appendChild(li);
        });
    }
}

// New function to handle the forward transition
// New function to handle the forward transition
function transitionToNewChoices(newKey) {
  if (isAnimating) return;
  isAnimating = true;

  const oldChoicesEl = choicesEl;
  oldChoicesEl.classList.add('slide-out');

  // Create the new list element and apply the initial state
  const newChoicesEl = document.createElement('ul');
  newChoicesEl.id = 'choices';
  newChoicesEl.className = 'list slide-in';

  // Populate the new element before it's visible
  path.push(newKey);
  renderBreadcrumb();
  choicesContainer.style.setProperty('--indentation-level', path.length);
  populateChoices(newChoicesEl, getNodeFromPath(ROOT, path));

  choicesContainer.appendChild(newChoicesEl);

  // This is the key part:
  setTimeout(() => {
    newChoicesEl.classList.remove('slide-in'); // This single change triggers the transition
  }, 10);

  // Listen for the old element to finish its transition
  oldChoicesEl.addEventListener('transitionend', () => {
    oldChoicesEl.remove();
    isAnimating = false;
  }, { once: true });

  choicesEl = newChoicesEl;
}

// Function to handle the back transition
function transitionBack() {
    if (isAnimating) return;
    isAnimating = true;
    const oldChoicesEl = choicesEl;
    const tempPath = [...path];
    tempPath.pop();
    choicesContainer.style.setProperty('--indentation-level', tempPath.length);
    const newChoicesEl = document.createElement('ul');
    newChoicesEl.id = 'choices';
    newChoicesEl.className = 'list slide-in-back';
    populateChoices(newChoicesEl, getNodeFromPath(ROOT, tempPath));
    choicesContainer.appendChild(newChoicesEl);
    void newChoicesEl.offsetWidth; // Force reflow
    newChoicesEl.classList.remove('slide-in-back'); // This triggers the animation
    oldChoicesEl.classList.add('slide-out-back');
    oldChoicesEl.addEventListener('transitionend', () => {
        oldChoicesEl.remove();
        isAnimating = false;
        path.pop();
        renderBreadcrumb();
    }, {
        once: true
    });
    choicesEl = newChoicesEl;
}

// Initial render function
function render() {
    renderBreadcrumb();
    const node = getNodeFromPath(ROOT, path) ?? ROOT;
    choicesContainer.style.setProperty('--indentation-level', path.length);
    populateChoices(choicesEl, node);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    render();
    renderChips();
});

backBtn.addEventListener('click', () => {
    if (path.length > 0) {
        transitionBack();
    }
});

clearBtn.addEventListener('click', () => {
    selected.clear();
    renderChips();
    render();
});


clearBtn.addEventListener('click',()=>{selected.clear();renderChips();render();});
window.addEventListener('keydown',e=>{if(e.key==='Escape'){}
});

    // START OF NEW CODE
document.addEventListener('DOMContentLoaded', () => {
    render();renderChips();
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
        });
    });
});

