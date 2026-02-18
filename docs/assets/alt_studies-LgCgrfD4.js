import{j as e,R as O}from"./client-BbprRhkc.js";import{r as d,R as M,H as P}from"./Header-DRJxx1r3.js";import{I as _}from"./Introduction-GUZDBGb2.js";import{F as L}from"./HorFilterApp-B3nJDHeq.js";import{F as E,I as $}from"./InstructionsWidget-BIEjdcs6.js";import{u as W,F as H}from"./useFeedback-4iEZpAB0.js";import"./filter-setup-C5BWkF68.js";import"./filterLogic-k0I9ANuY.js";const U=[{url:"../assets/animal.webp",label:"Model Organism Study"},{url:"../assets/background.webp",label:"Background Information"},{url:"../assets/biobank.webp",label:"Samples Available"},{url:"../assets/invitro.webp",label:"In Vitro Study"},{url:"../assets/lab_results.webp",label:"Lab Results"},{url:"../assets/longitudinal.webp",label:"Longitudinal Study"},{url:"../assets/medical_imaging.webp",label:"Medical Imaging"},{url:"../assets/omics.webp",label:"Omics"},{url:"../assets/population.webp",label:"Patient Study"},{url:"../assets/treatments.webp",label:"Treatments"}],G=()=>{const o=["Genomic Profiling of Triple-Negative Breast Cancer","AI-Driven Drug Discovery for Pancreatic Cancer","Immunotherapy Response in Lung Cancer Patients","Early Detection Biomarkers for Ovarian Cancer","Personalized Radiation Therapy for Brain Tumors","Epigenetic Modifications in Colon Cancer Progression","Targeting Metabolism in Glioblastoma Multiforme","Circulating Tumor DNA for Disease Monitoring","Novel Therapies for Pediatric Leukemias","Understanding Metastasis in Prostate Cancer"],i=["Cancer Research Institute","Global Oncology Center","Biomedical Research Hub","University Cancer Center","National Health Institute"],n=["Access restricted at present","Closed to access","Open in response to specific calls","Open only through collaboration","Open to applicants"],u=["D","E","B","C","A"],a=[];for(let p=1;p<=50;p++){const x=Math.floor(Math.random()*u.length),w=n[x],b=u[x],v=o[Math.floor(Math.random()*o.length)],r=i[Math.floor(Math.random()*i.length)],y=new Date(2023,Math.floor(Math.random()*12),Math.floor(Math.random()*28)+1),c=new Date(Date.now()-Math.floor(Math.random()*10*365*24*60*60*1e3)),j=Math.floor(Math.random()*39991)+10,S=[...U].sort(()=>.5-Math.random()).slice(0,Math.floor(Math.random()*5));a.push({id:p,position:`${b}`,accessPhrase:`${w}`,studyTitle:`${v} (Study ${p})`,leadResearcherInstitute:`Dr. ${String.fromCharCode(65+Math.floor(Math.random()*26))}. ${r}`,populationSize:j,dateAdded:y.toISOString().split("T")[0],dateStarted:y.toISOString().split("T")[0],earliestData:c.toISOString().split("T")[0],studyIcons:S,synopsis:`This dataset explores ${v} with a cohort of ${j} subjects. The primary focus includes analyzing longitudinal markers and response variations to established protocols. Data collection began in ${c.getFullYear()}.`})}return a},Y=G(),q=({filled:o,onClick:i})=>e.jsxs("svg",{onClick:i,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:"28",height:"28",style:{cursor:"pointer",fill:o?"#dc3545":"none",stroke:o?"#dc3545":"#555",strokeWidth:2},children:[e.jsx("title",{children:o?"Remove from Favourites":"Add to Favourites"}),e.jsx("path",{d:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"})]}),V=({filled:o,onClick:i})=>e.jsxs("svg",{onClick:i,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:"28",height:"28",style:{cursor:"pointer",fill:o?"#007bff":"none",stroke:o?"#007bff":"#555",strokeWidth:2},children:[e.jsx("title",{children:o?"Remove from Cart":"Add to Cart"}),e.jsx("circle",{cx:"9",cy:"21",r:"1"}),e.jsx("circle",{cx:"20",cy:"21",r:"1"}),e.jsx("path",{d:"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"})]}),J=()=>{const[o,i]=d.useState(""),[n,u]=d.useState(!1),[a,p]=d.useState({column:"dateAdded",direction:"desc"}),[x,w]=d.useState(Y),[b,v]=d.useState(!0),[r,y]=d.useState([]),[c,j]=d.useState([]),[D,S]=d.useState(!1),T=t=>{c.includes(t)?j(c.filter(s=>s!==t)):j([...c,t])},N=t=>{const s=r.find(l=>l.id===t.id);y(s?r.filter(l=>l.id!==t.id):[...r,t])},A=d.useMemo(()=>{let t=[...x];if(o){const s=o.toLowerCase();t=t.filter(l=>l.studyTitle.toLowerCase().includes(s)||n&&l.leadResearcherInstitute.toLowerCase().includes(s))}return t.sort((s,l)=>{if(a.column==="favourite"){const C=c.includes(s.id),B=c.includes(l.id);return C===B?0:a.direction==="desc"?C?1:-1:C?-1:1}const h=s[a.column],k=l[a.column];return h<k?a.direction==="asc"?-1:1:h>k?a.direction==="asc"?1:-1:0}),t},[x,o,n,a,c]),F=t=>{i(t.target.value)},m=t=>{p(s=>({column:t,direction:s.column===t&&s.direction==="asc"?"desc":"asc"}))},z=()=>{const t="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(r,null,2)),s=document.createElement("a");s.setAttribute("href",t),s.setAttribute("download","studies_metadata.json"),document.body.appendChild(s),s.click(),s.remove()},f=t=>a.column===t?a.direction==="asc"?" ▲":" ▼":"",R={fontSize:"1.3rem"};return e.jsxs("div",{style:R,children:[e.jsx("style",{children:`
                /* Container for the image and the tooltip */
                .icon-container {
                    position: relative;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1;
                }

                .icon-container:hover {
                    z-index: 9999;
                }

                /* Tooltip Box - White Text on Blue Background */
                .custom-tooltip {
                    visibility: hidden;
                    background-color: #0056b3; /* Darker Blue */
                    color: #ffffff;            /* White Text */
                    text-align: center;
                    padding: 6px 12px;
                    border-radius: 6px;
                    position: absolute;
                    z-index: 10000;
                    bottom: 110%;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.9rem;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.2s;
                    pointer-events: none;
                    box-shadow: 0px 4px 8px rgba(0,0,0,0.3);
                }

                /* Arrow pointing down - matches Blue background */
                .custom-tooltip::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: #0056b3 transparent transparent transparent;
                }

                .custom-tooltip.large {
                    white-space: normal;      /* Overrides nowrap to allow wrapping */
                    width: 300px;             /* Sets a fixed width for the box */
                    line-height: 1.4;         /* Improves readability for multi-line text */
                    text-align: left;         /* Better for longer descriptive text */
                    padding: 10px 15px;       /* Increased padding for the larger content */
                    font-size: 1.1rem;        /* Slightly larger font for clarity */
                }
                .icon-container:hover .custom-tooltip {
                    visibility: visible;
                    opacity: 1;
                }

                .studies-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .studies-table th {
                    white-space: nowrap;
                    padding: 12px;
                    text-align: left;
                    background-color: #e9ecef;
                    cursor: pointer;
                    border-bottom: 2px solid #ccc;
                    position: sticky;
                    top: 0;
                    z-index: 500;
                }

                .studies-table td {
                    padding: 10px 12px;
                }

                .study-title-row {
                    background-color: #fff;
                    border-top: 2px solid #888;
                    position: relative;
                }

                .study-data-row {
                    background-color: #fcfcfc;
                }

                .synopsis-row td {
                    background-color: #f8f9fa;
                    color: #555;
                    font-style: italic;
                    padding: 10px 20px;
                    border-bottom: 1px solid #ddd;
                    font-size: 1.1rem;
                }

                .controls-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    align-items: center;
                    margin-bottom: 20px;
                    background: #f1f1f1;
                    padding: 15px;
                    border-radius: 8px;
                    position: relative;
                }

                .cart-container {
                    position: relative;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    font-size: 1.5rem;
                }
                .cart-badge {
                    background-color: #d9534f;
                    color: white;
                    border-radius: 50%;
                    padding: 2px 8px;
                    font-size: 0.9rem;
                    position: absolute;
                    top: -5px;
                    right: -10px;
                    font-weight: bold;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 20000;
                }
                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 500px;
                    max-width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .action-btn-group {
                    display: flex;
                    gap: 15px;
                    margin-right: 20px;
                }

                /* Study Title Link Styling */
                .study-title-link {
                    font-size: 1.4rem;
                    font-weight: bold;
                    margin-right: 20px;
                    color: #0056b3;
                    text-decoration: none;
                }
                .study-title-link:hover {
                    text-decoration: underline;
                }

                /* Explicit "Clickable" Expand/Collapse Button */
                .expand-collapse-btn {
                    background: none;
                    border: none;
                    color: #0056b3;
                    font-size: 1.1rem;
                    font-weight: bold;
                    text-decoration: underline;
                    cursor: pointer;
                    padding: 10px 20px;
                    transition: color 0.2s;
                }
                .expand-collapse-btn:hover {
                    color: #003060;
                    background-color: #eef;
                    border-radius: 4px;
                }
            `}),e.jsxs("section",{className:"studies-section",children:[e.jsx("h2",{class:"p-4 text-3xl sm:text-4xl font-bold text-[var(--cruk-blue)] sm:pr-8 sm:w-1/4 flex items-center border-b sm:border-b-0 sm:border-r border-gray-200",children:"Studies"}),e.jsxs("div",{className:"controls-container",children:[e.jsx("div",{children:e.jsx("input",{type:"search",placeholder:"Search studies...",value:o,onChange:F,style:{padding:"10px",fontSize:"1.1rem",width:"300px"}})}),e.jsxs("div",{className:"icon-container",style:{display:"flex",alignItems:"center"},children:[e.jsx("input",{type:"checkbox",id:"deep_search",checked:n,onChange:t=>u(t.target.checked),style:{transform:"scale(1.5)",marginRight:"10px",marginLeft:"20px",cursor:"pointer"}}),e.jsx("label",{htmlFor:"deep_search",style:{cursor:"pointer"},children:"Deep Search"}),e.jsx("span",{className:"custom-tooltip large",children:"Deep Search scans for close matches in the abstract, keywords, description, title, concepts from data enrichment, and Data Custodian for each study."})]}),e.jsxs("div",{children:[e.jsx("label",{style:{marginRight:"10px"},children:"Sort by:"}),e.jsxs("select",{onChange:t=>m(t.target.value),value:a.column,style:{padding:"8px",fontSize:"1rem"},children:[e.jsx("option",{value:"favourite",children:"Favourites"}),e.jsx("option",{value:"dateAdded",children:"Updated Date"}),e.jsx("option",{value:"studyTitle",children:"Study Title"}),e.jsx("option",{value:"leadResearcherInstitute",children:"Lead Researcher"}),e.jsx("option",{value:"populationSize",children:"Population Size"}),e.jsx("option",{value:"position",children:"Accessibility"}),e.jsx("option",{value:"earliestData",children:"Earliest Data"}),e.jsx("option",{value:"dateStarted",children:"Start Date"})]})]}),e.jsx("div",{children:e.jsx("button",{className:"expand-collapse-btn",onClick:()=>v(!b),children:b?"Collapse Synopses":"Expand Synopses"})})]}),D&&e.jsx("div",{className:"modal-overlay",onClick:()=>S(!1),children:e.jsxs("div",{className:"modal-content",onClick:t=>t.stopPropagation(),children:[e.jsxs("h3",{children:["Your Cart (",r.length,")"]}),r.length===0?e.jsx("p",{children:"Your cart is empty."}):e.jsx("ul",{style:{marginBottom:"20px"},children:r.map(t=>e.jsx("li",{style:{marginBottom:"8px"},children:t.studyTitle},t.id))}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"10px"},children:[e.jsx("button",{onClick:()=>S(!1),style:{padding:"8px 16px"},children:"Close"}),r.length>0&&e.jsx("button",{onClick:z,style:{padding:"8px 16px",background:"#007bff",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Download Metadata"})]})]})}),e.jsx("div",{className:"studies-table-container",children:e.jsxs("table",{className:"studies-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsxs("th",{onClick:()=>m("leadResearcherInstitute"),children:["Lead Researcher ",e.jsx("span",{className:"sort-indicator",children:f("leadResearcherInstitute")})]}),e.jsxs("th",{onClick:()=>m("populationSize"),children:["Pop. Size ",e.jsx("span",{className:"sort-indicator",children:f("populationSize")})]}),e.jsxs("th",{onClick:()=>m("position"),children:["Accessibility ",e.jsx("span",{className:"sort-indicator",children:f("accessPhrase")})]}),e.jsxs("th",{onClick:()=>m("earliestData"),children:["Earliest Data ",e.jsx("span",{className:"sort-indicator",children:f("earliestData")})]}),e.jsxs("th",{onClick:()=>m("dateStarted"),children:["Start Date ",e.jsx("span",{className:"sort-indicator",children:f("dateStarted")})]}),e.jsxs("th",{onClick:()=>m("dateAdded"),children:["Updated ",e.jsx("span",{className:"sort-indicator",children:f("dateAdded")})]})]})}),e.jsx("tbody",{children:A.map(t=>{const s=c.includes(t.id),l=r.some(h=>h.id===t.id);return e.jsxs(M.Fragment,{children:[e.jsx("tr",{className:"study-title-row",children:e.jsx("td",{colSpan:"6",style:{padding:"15px"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",flexWrap:"wrap"},children:[e.jsxs("div",{className:"action-btn-group",children:[e.jsx(q,{filled:s,onClick:()=>T(t.id)}),e.jsx(V,{filled:l,onClick:()=>N(t)})]}),e.jsx("a",{href:"../src/meta.html",className:"study-title-link",children:t.studyTitle}),e.jsx("div",{style:{display:"flex",gap:"10px"},children:t.studyIcons.map((h,k)=>e.jsxs("div",{className:"icon-container",children:[e.jsx("img",{src:h.url,alt:h.label,style:{height:"1.5em",width:"auto",cursor:"help",display:"block"}}),e.jsx("span",{className:"custom-tooltip",children:h.label})]},k))})]})})}),e.jsxs("tr",{className:"study-data-row",children:[e.jsx("td",{children:t.leadResearcherInstitute}),e.jsx("td",{children:t.populationSize.toLocaleString()}),e.jsx("td",{children:t.accessPhrase}),e.jsx("td",{children:t.earliestData}),e.jsx("td",{children:t.dateStarted}),e.jsx("td",{children:t.dateAdded})]}),b&&e.jsx("tr",{className:"synopsis-row",children:e.jsxs("td",{colSpan:"6",children:[e.jsx("strong",{children:"Synopsis: "})," ",t.synopsis]})})]},t.id)})})]})})]})]})},I={default:{sectionTitle:"Feedback on the Search/Browse Page",questions:[{id:"ease of use",label:"Is this section 1. Poor, 2. Fair, 3. Good, 4. Very Good, 5. Excellent",type:"number",min:1,max:5},{id:"data_filters",label:"Do the data filters cover the information that you need? Would you make any changes?",type:"textarea"},{id:"access_filters",label:"Do the access filters include the information you need? Are they clear?",type:"textarea"},{id:"cancer_filters",label:"How are you most likely to look for data on different cancers? Would you use the ICDO, CRUK or TCGA terms.",type:"textarea"},{id:"info",label:"How would you change the information on datasets provided on this page?",type:"textarea"}]}},K=()=>{const{allFeedback:o,isFeedbackOpen:i,setIsFeedbackOpen:n,fallbackData:u,setFallbackData:a,handleSaveDraft:p,handleFinalSubmit:x}=W(I);return e.jsxs(e.Fragment,{children:[e.jsx(H,{data:u,onDismiss:()=>a(null),onCopy:w=>{navigator.clipboard.writeText(w),a(null)}}),e.jsx(E,{isOpen:i,onClose:()=>n(!1),activeSection:"alt_studies_view",allFeedback:o,onSaveDraft:p,onFinalSubmit:x,questionData:I}),e.jsx("button",{onClick:()=>n(!0),className:"fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 z-50 font-bold",children:"Feedback"})]})};function g(o,i){const n=document.getElementById(o);n?O.createRoot(n).render(e.jsx(M.StrictMode,{children:i})):console.error(`Target element '${o}' not found in the DOM.`)}g("header",e.jsx(P,{}));g("introduction",e.jsx(_,{}));g("filter_navbar",e.jsx(L,{}));g("studies",e.jsx(J,{}));g("feedback_widget",e.jsx(K,{}));g("instructions_widget",e.jsx($,{fileUrl:"/instructions/studies_help.md"}));
