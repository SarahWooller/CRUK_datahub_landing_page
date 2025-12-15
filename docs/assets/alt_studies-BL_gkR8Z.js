import{j as e,R as L}from"./client-CyNNhpF1.js";import{r as c,R as I}from"./index-DykHMaX-.js";import{I as P}from"./Introduction-CSrCzxqd.js";import{F as E}from"./HorFilterApp-DJAjFIeU.js";import{H as F}from"./Header-Bl7EO7so.js";const O=[{url:"../assets/animal.png",label:"Dataset Available"},{url:"../assets/background.png",label:"Clinical Trial"},{url:"../assets/biobank.png",label:"Peer Reviewed"},{url:"../assets/invitro.png",label:"High Impact"},{url:"../assets/lab_results.png",label:"Collaborative"},{url:"../assets/longitudinal.png",label:"Longitudinal"},{url:"../assets/medical_imaging.png",label:"Longitudinal"}],$=()=>{const o=["Genomic Profiling of Triple-Negative Breast Cancer","AI-Driven Drug Discovery for Pancreatic Cancer","Immunotherapy Response in Lung Cancer Patients","Early Detection Biomarkers for Ovarian Cancer","Personalized Radiation Therapy for Brain Tumors","Epigenetic Modifications in Colon Cancer Progression","Targeting Metabolism in Glioblastoma Multiforme","Circulating Tumor DNA for Disease Monitoring","Novel Therapies for Pediatric Leukemias","Understanding Metastasis in Prostate Cancer"],r=["Cancer Research Institute","Global Oncology Center","Biomedical Research Hub","University Cancer Center","National Health Institute"],d=["Access restricted at present","Closed to access","Open in response to specific calls","Open only through collaboration","Open to applicants"],m=["D","E","B","C","A"],n=[];for(let x=1;x<=50;x++){const g=Math.floor(Math.random()*m.length),k=d[g],f=m[g],y=o[Math.floor(Math.random()*o.length)],i=r[Math.floor(Math.random()*r.length)],b=new Date(2023,Math.floor(Math.random()*12),Math.floor(Math.random()*28)+1),l=new Date(Date.now()-Math.floor(Math.random()*10*365*24*60*60*1e3)),j=Math.floor(Math.random()*39991)+10,v=[...O].sort(()=>.5-Math.random()).slice(0,Math.floor(Math.random()*5));n.push({id:x,position:`${f}`,accessPhrase:`${k}`,studyTitle:`${y} (Study ${x})`,leadResearcherInstitute:`Dr. ${String.fromCharCode(65+Math.floor(Math.random()*26))}. ${i}`,populationSize:j,dateAdded:b.toISOString().split("T")[0],dateStarted:b.toISOString().split("T")[0],earliestData:l.toISOString().split("T")[0],studyIcons:v,synopsis:`This dataset explores ${y} with a cohort of ${j} subjects. The primary focus includes analyzing longitudinal markers and response variations to established protocols. Data collection began in ${l.getFullYear()}.`})}return n},_=$(),H=({filled:o,onClick:r})=>e.jsxs("svg",{onClick:r,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:"28",height:"28",style:{cursor:"pointer",fill:o?"#dc3545":"none",stroke:o?"#dc3545":"#555",strokeWidth:2},children:[e.jsx("title",{children:o?"Remove from Favourites":"Add to Favourites"}),e.jsx("path",{d:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"})]}),U=({filled:o,onClick:r})=>e.jsxs("svg",{onClick:r,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:"28",height:"28",style:{cursor:"pointer",fill:o?"#007bff":"none",stroke:o?"#007bff":"#555",strokeWidth:2},children:[e.jsx("title",{children:o?"Remove from Cart":"Add to Cart"}),e.jsx("circle",{cx:"9",cy:"21",r:"1"}),e.jsx("circle",{cx:"20",cy:"21",r:"1"}),e.jsx("path",{d:"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"})]}),W=()=>{const[o,r]=c.useState(""),[d,m]=c.useState(!1),[n,x]=c.useState({column:"dateAdded",direction:"desc"}),[g,k]=c.useState(_),[f,y]=c.useState(!0),[i,b]=c.useState([]),[l,j]=c.useState([]),[D,v]=c.useState(!1),M=t=>{l.includes(t)?j(l.filter(s=>s!==t)):j([...l,t])},T=t=>{const s=i.find(a=>a.id===t.id);b(s?i.filter(a=>a.id!==t.id):[...i,t])},N=c.useMemo(()=>{let t=[...g];if(o){const s=o.toLowerCase();t=t.filter(a=>a.studyTitle.toLowerCase().includes(s)||d&&a.leadResearcherInstitute.toLowerCase().includes(s))}return t.sort((s,a)=>{if(n.column==="favourite"){const w=l.includes(s.id),B=l.includes(a.id);return w===B?0:n.direction==="desc"?w?-1:1:w?1:-1}const p=s[n.column],S=a[n.column];return p<S?n.direction==="asc"?-1:1:p>S?n.direction==="asc"?1:-1:0}),t},[g,o,d,n,l]),A=t=>{r(t.target.value)},h=t=>{x(s=>({column:t,direction:s.column===t&&s.direction==="asc"?"desc":"asc"}))},R=()=>{const t="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(i,null,2)),s=document.createElement("a");s.setAttribute("href",t),s.setAttribute("download","studies_metadata.json"),document.body.appendChild(s),s.click(),s.remove()},u=t=>n.column===t?n.direction==="asc"?" ▲":" ▼":"",z={fontSize:"1.3rem"};return e.jsxs("div",{style:z,children:[e.jsx("style",{children:`
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
            `}),e.jsxs("section",{className:"studies-section",children:[e.jsx("h2",{class:"p-4 text-3xl sm:text-4xl font-bold text-[var(--cruk-blue)] sm:pr-8 sm:w-1/4 flex items-center border-b sm:border-b-0 sm:border-r border-gray-200",children:"Studies"}),e.jsxs("div",{className:"controls-container",children:[e.jsx("div",{children:e.jsx("input",{type:"search",placeholder:"Search studies...",value:o,onChange:A,style:{padding:"10px",fontSize:"1.1rem",width:"300px"}})}),e.jsxs("div",{className:"cart-container",onClick:()=>v(!0),children:[e.jsx("span",{title:"View Cart",children:"🛒"}),e.jsx("span",{className:"cart-badge",children:i.length})]}),e.jsxs("div",{children:[e.jsx("input",{type:"checkbox",id:"deep_search",checked:d,onChange:t=>m(t.target.checked),style:{transform:"scale(1.5)",marginRight:"10px",marginLeft:"20px"}}),e.jsx("label",{htmlFor:"deep_search",children:"Deep Search"})]}),e.jsxs("div",{children:[e.jsx("label",{style:{marginRight:"10px"},children:"Sort by:"}),e.jsxs("select",{onChange:t=>h(t.target.value),value:n.column,style:{padding:"8px",fontSize:"1rem"},children:[e.jsx("option",{value:"favourite",children:"Favourites"}),e.jsx("option",{value:"dateAdded",children:"Updated Date"}),e.jsx("option",{value:"studyTitle",children:"Study Title"}),e.jsx("option",{value:"leadResearcherInstitute",children:"Lead Researcher"}),e.jsx("option",{value:"populationSize",children:"Population Size"}),e.jsx("option",{value:"position",children:"Accessibility"}),e.jsx("option",{value:"earliestData",children:"Earliest Data"}),e.jsx("option",{value:"dateStarted",children:"Start Date"})]})]}),e.jsx("div",{children:e.jsx("button",{className:"expand-collapse-btn",onClick:()=>y(!f),children:f?"Collapse Synopses":"Expand Synopses"})})]}),D&&e.jsx("div",{className:"modal-overlay",onClick:()=>v(!1),children:e.jsxs("div",{className:"modal-content",onClick:t=>t.stopPropagation(),children:[e.jsxs("h3",{children:["Your Cart (",i.length,")"]}),i.length===0?e.jsx("p",{children:"Your cart is empty."}):e.jsx("ul",{style:{marginBottom:"20px"},children:i.map(t=>e.jsx("li",{style:{marginBottom:"8px"},children:t.studyTitle},t.id))}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"10px"},children:[e.jsx("button",{onClick:()=>v(!1),style:{padding:"8px 16px"},children:"Close"}),i.length>0&&e.jsx("button",{onClick:R,style:{padding:"8px 16px",background:"#007bff",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Download Metadata"})]})]})}),e.jsx("div",{className:"studies-table-container",children:e.jsxs("table",{className:"studies-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsxs("th",{onClick:()=>h("leadResearcherInstitute"),children:["Lead Researcher ",e.jsx("span",{className:"sort-indicator",children:u("leadResearcherInstitute")})]}),e.jsxs("th",{onClick:()=>h("populationSize"),children:["Pop. Size ",e.jsx("span",{className:"sort-indicator",children:u("populationSize")})]}),e.jsxs("th",{onClick:()=>h("position"),children:["Accessibility ",e.jsx("span",{className:"sort-indicator",children:u("accessPhrase")})]}),e.jsxs("th",{onClick:()=>h("earliestData"),children:["Earliest Data ",e.jsx("span",{className:"sort-indicator",children:u("earliestData")})]}),e.jsxs("th",{onClick:()=>h("dateStarted"),children:["Start Date ",e.jsx("span",{className:"sort-indicator",children:u("dateStarted")})]}),e.jsxs("th",{onClick:()=>h("dateAdded"),children:["Updated ",e.jsx("span",{className:"sort-indicator",children:u("dateAdded")})]})]})}),e.jsx("tbody",{children:N.map(t=>{const s=l.includes(t.id),a=i.some(p=>p.id===t.id);return e.jsxs(I.Fragment,{children:[e.jsx("tr",{className:"study-title-row",children:e.jsx("td",{colSpan:"6",style:{padding:"15px"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",flexWrap:"wrap"},children:[e.jsxs("div",{className:"action-btn-group",children:[e.jsx(H,{filled:s,onClick:()=>M(t.id)}),e.jsx(U,{filled:a,onClick:()=>T(t)})]}),e.jsx("a",{href:"../metadata.html",className:"study-title-link",children:t.studyTitle}),e.jsx("div",{style:{display:"flex",gap:"10px"},children:t.studyIcons.map((p,S)=>e.jsxs("div",{className:"icon-container",children:[e.jsx("img",{src:p.url,alt:p.label,style:{height:"1.5em",width:"auto",cursor:"help",display:"block"}}),e.jsx("span",{className:"custom-tooltip",children:p.label})]},S))})]})})}),e.jsxs("tr",{className:"study-data-row",children:[e.jsx("td",{children:t.leadResearcherInstitute}),e.jsx("td",{children:t.populationSize.toLocaleString()}),e.jsx("td",{children:t.accessPhrase}),e.jsx("td",{children:t.earliestData}),e.jsx("td",{children:t.dateStarted}),e.jsx("td",{children:t.dateAdded})]}),f&&e.jsx("tr",{className:"synopsis-row",children:e.jsxs("td",{colSpan:"6",children:[e.jsx("strong",{children:"Synopsis: "})," ",t.synopsis]})})]},t.id)})})]})})]})]})};function C(o,r){const d=document.getElementById(o);d?L.createRoot(d).render(e.jsx(I.StrictMode,{children:r})):console.error(`Target element '${o}' not found in the DOM. Cannot render component.`)}C("header",e.jsx(F,{}));C("introduction",e.jsx(P,{}));C("filter_navbar",e.jsx(E,{}));C("studies",e.jsx(W,{}));
