import{j as e}from"./client-CyNNhpF1.js";import{r as c,R as C}from"./index-DykHMaX-.js";const I=[{url:"../assets/animal.png",label:"Dataset Available"},{url:"../assets/background.png",label:"Clinical Trial"},{url:"../assets/biobank.png",label:"Peer Reviewed"},{url:"../assets/invitro.png",label:"High Impact"},{url:"../assets/lab_results.png",label:"Collaborative"},{url:"../assets/longitudinal.png",label:"Longitudinal"},{url:"../assets/medical_imaging.png",label:"Longitudinal"}],v=()=>{const n=["Genomic Profiling of Triple-Negative Breast Cancer","AI-Driven Drug Discovery for Pancreatic Cancer","Immunotherapy Response in Lung Cancer Patients","Early Detection Biomarkers for Ovarian Cancer","Personalized Radiation Therapy for Brain Tumors","Epigenetic Modifications in Colon Cancer Progression","Targeting Metabolism in Glioblastoma Multiforme","Circulating Tumor DNA for Disease Monitoring","Novel Therapies for Pediatric Leukemias","Understanding Metastasis in Prostate Cancer"],h=["Cancer Research Institute","Global Oncology Center","Biomedical Research Hub","University Cancer Center","National Health Institute"],l=["Access restricted at present","Closed to access","Open in response to specific calls","Open only through collaboration","Open to applicants"],p=["D","E","B","C","A"],g=[];for(let d=1;d<=50;d++){const a=Math.floor(Math.random()*p.length),x=l[a],u=p[a],b=n[Math.floor(Math.random()*n.length)],f=h[Math.floor(Math.random()*h.length)],m=new Date(2023,Math.floor(Math.random()*12),Math.floor(Math.random()*28)+1),i=[...I].sort(()=>.5-Math.random()).slice(0,Math.floor(Math.random()*5));g.push({id:d,position:`${u}`,accessPhrase:`${x}`,studyTitle:`${b} (Study ${d})`,leadResearcherInstitute:`Dr. ${String.fromCharCode(65+Math.floor(Math.random()*26))}. ${f}`,dateAdded:m.toISOString().split("T")[0],dateStarted:m.toISOString().split("T")[0],studyIcons:i})}return g},T=v(),A=()=>{const[n,h]=c.useState(""),[l,p]=c.useState(!1),[g,d]=c.useState(!0),[a,x]=c.useState({column:"dateAdded",direction:"desc"}),[u,b]=c.useState(T),f=c.useMemo(()=>{let t=[...u];if(n){const s=n.toLowerCase();t=t.filter(r=>r.studyTitle.toLowerCase().includes(s)||l&&r.leadResearcherInstitute.toLowerCase().includes(s))}return t.sort((s,r)=>{const j=s[a.column],S=r[a.column];return j<S?a.direction==="asc"?-1:1:j>S?a.direction==="asc"?1:-1:0}),t},[u,n,l,a]),m=t=>{h(t.target.value)},o=t=>{x(s=>({column:t,direction:s.column===t&&s.direction==="asc"?"desc":"asc"}))},i=t=>a.column===t?a.direction==="asc"?" ▲":" ▼":"",y={fontSize:"1.2rem"};return e.jsxs("div",{style:y,children:[e.jsx("style",{children:`
                /* Container for the image and the tooltip */
                .icon-container {
                    position: relative;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                }

                /* The actual tooltip box (hidden by default) */
                .custom-tooltip {
                    visibility: hidden;
                    background-color: #333;
                    color: #fff;
                    text-align: center;
                    padding: 5px 10px;
                    border-radius: 6px;
                    position: absolute;
                    z-index: 10;

                    /* Position specific: places it above the icon */
                    bottom: 110%;
                    left: 50%;
                    transform: translateX(-50%);

                    /* Visuals */
                    font-size: 0.8rem;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.2s;
                    pointer-events: none; /* Prevents tooltip from blocking mouse */
                }

                /* Little arrow pointing down from the tooltip */
                .custom-tooltip::after {
                    content: "";
                    position: absolute;
                    top: 100%; /* At the bottom of the tooltip */
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: #333 transparent transparent transparent;
                }

                /* Show the tooltip when hovering the container */
                .icon-container:hover .custom-tooltip {
                    visibility: visible;
                    opacity: 1;
                }
            `}),e.jsxs("section",{className:"studies-section",children:[e.jsxs("div",{className:"search-section",children:[e.jsx("input",{type:"search",id:"search-bar",placeholder:"Search selected studies...",value:n,onChange:m}),e.jsx("p",{}),e.jsx("input",{type:"checkbox",id:"deep_search",checked:l,onChange:t=>p(t.target.checked)}),e.jsxs("label",{htmlFor:"deep_search",children:[" Deep Search ",e.jsx("i",{children:" - may be slow"})]}),e.jsx("br",{})]}),e.jsx("div",{className:"studies-table-container",children:e.jsxs("table",{className:"studies-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsxs("th",{"data-sort":"accessPhrase",onClick:()=>o("position"),children:["Accessibility ",e.jsx("span",{className:"sort-indicator",children:i("accessPhrase")})]}),e.jsxs("th",{"data-sort":"studyTitle",onClick:()=>o("studyTitle"),children:["Study Title ",e.jsx("span",{className:"sort-indicator",children:i("studyTitle")})]}),e.jsx("th",{children:"Indicators"}),e.jsxs("th",{"data-sort":"leadResearcherInstitute",onClick:()=>o("leadResearcherInstitute"),children:["Lead Researcher/Institute ",e.jsx("span",{className:"sort-indicator",children:i("leadResearcherInstitute")})]}),e.jsxs("th",{"data-sort":"dateAdded",onClick:()=>o("dateAdded"),children:["Updated ",e.jsx("span",{className:"sort-indicator",children:i("dateAdded")})]}),e.jsxs("th",{"data-sort":"dateStarted",onClick:()=>o("dateStarted"),children:["CRUK funding start-date ",e.jsx("span",{className:"sort-indicator",children:i("dateStarted")})]})]})}),e.jsx("tbody",{id:"studies-table-body",children:f.map(t=>e.jsxs(C.Fragment,{children:[e.jsxs("tr",{className:"study-data-row",style:{borderBottom:"none"},children:[e.jsx("td",{children:t.accessPhrase}),e.jsx("td",{children:t.studyTitle}),e.jsx("td",{}),e.jsx("td",{children:t.leadResearcherInstitute}),e.jsx("td",{children:t.dateStarted}),e.jsx("td",{children:t.dateAdded})]}),e.jsx("tr",{className:"study-icon-row",children:e.jsx("td",{colSpan:"6",style:{borderTop:"none",padding:0},children:e.jsx("div",{style:{display:"flex",flexDirection:"row",gap:"12px",paddingLeft:"1rem",paddingBottom:"1rem",alignItems:"center"},children:t.studyIcons.length>0?t.studyIcons.map((s,r)=>e.jsxs("div",{className:"icon-container",children:[e.jsx("img",{src:s.url,alt:s.label,style:{height:"1.5em",width:"auto",cursor:"help",display:"block"}}),e.jsx("span",{className:"custom-tooltip",children:s.label})]},r)):e.jsx("span",{style:{height:"1.5em",display:"block"},children:" "})})})})]},t.id))})]})})]})]})};export{A as S};
