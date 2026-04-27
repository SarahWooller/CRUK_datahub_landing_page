import{j as e,R as g}from"./client-CCGxTeo_.js";import{r as n,R as x,H as w}from"./Header-VW579A5s.js";import{_ as v}from"./dataset_00-CoTxVFCZ.js";import{_ as y}from"./dataset_01-CZkqQf1R.js";import{_ as S}from"./dataset_02-CLqjbXTt.js";import{_ as N}from"./dataset_03-OzcuLiMW.js";import{_ as k}from"./dataset_04-DfvcTgce.js";import{_ as G}from"./dataset_05-eCuVsJxt.js";import{_ as R}from"./dataset_06-865BiGUA.js";import{_ as C}from"./dataset_07-dN9-PAt-.js";import{_ as D}from"./dataset_08-CqMkOWT3.js";import{_ as E}from"./dataset_09-Wkj5HBH1.js";import{_ as I}from"./dataset_10-DXVvMw_u.js";import{_ as z}from"./dataset_11-B_I3ISoJ.js";import{_ as A}from"./dataset_12-B5qmBxIf.js";import{_ as L}from"./dataset_13-U-bEx8FV.js";import{_ as H}from"./dataset_14-C0xBrY52.js";import{_ as T}from"./dataset_15-BJrvzL6e.js";import{_ as B}from"./dataset_16-Bv-VdnY-.js";import{_ as M}from"./dataset_17-Cc_W0iHc.js";import{_ as O}from"./dataset_18-C2skL9-z.js";import{_ as U}from"./dataset_19-rwY3jzbj.js";import{F}from"./FeedbackWidget-Cffp1AMK.js";import{I as W}from"./InstructionsWidget-pVtKa3kP.js";import"./FeedbackModal-BD6k6-fV.js";import"./useFeedback-BUQqNesv.js";const K=()=>e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-16",children:[e.jsx("h1",{className:"text-4xl sm:text-5xl font-extrabold text-[var(--cruk-blue)] mb-6 tracking-tight",children:"Unleashing the power of big data"}),e.jsx("h1",{className:"text-xl sm:text-xl font-extrabold text-[var(--cruk-blue)] mb-6 tracking-tight",children:"Browse our Research Projects "}),e.jsxs("div",{className:"space-y-6 text-gray-700 text-lg sm:text-xl leading-relaxed",children:[e.jsx("p",{className:"font-medium text-gray-900",children:"Welcome to the CRUK Data Hub, your gateway to data produced by research funded through Cancer Research UK."}),e.jsx("p",{children:"Here you can search our current research grants, lead investigators, and project scopes."})]})]}),P=()=>{const[a,_]=n.useState(""),[o,h]=n.useState({column:"projectGrantStartDate",direction:"desc"}),[p,b]=n.useState([]),[u,f]=n.useState(!0);n.useEffect(()=>{let t=[];try{const s=Object.assign({"../utils/new_dummies/dataset_00.json":v,"../utils/new_dummies/dataset_01.json":y,"../utils/new_dummies/dataset_02.json":S,"../utils/new_dummies/dataset_03.json":N,"../utils/new_dummies/dataset_04.json":k,"../utils/new_dummies/dataset_05.json":G,"../utils/new_dummies/dataset_06.json":R,"../utils/new_dummies/dataset_07.json":C,"../utils/new_dummies/dataset_08.json":D,"../utils/new_dummies/dataset_09.json":E,"../utils/new_dummies/dataset_10.json":I,"../utils/new_dummies/dataset_11.json":z,"../utils/new_dummies/dataset_12.json":A,"../utils/new_dummies/dataset_13.json":L,"../utils/new_dummies/dataset_14.json":H,"../utils/new_dummies/dataset_15.json":T,"../utils/new_dummies/dataset_16.json":B,"../utils/new_dummies/dataset_17.json":M,"../utils/new_dummies/dataset_18.json":O,"../utils/new_dummies/dataset_19.json":U});for(const r in s){const l=s[r],i=l.default||l;i.projectGrants&&Array.isArray(i.projectGrants)&&(t=[...t,...i.projectGrants])}}catch(s){console.error("Error loading dummies folder:",s)}b(t)},[]);const j=n.useMemo(()=>{let t=[...p];if(a){const s=a.toLowerCase();t=t.filter(r=>r.projectGrantName&&r.projectGrantName.toLowerCase().includes(s)||r.leadResearcher&&r.leadResearcher.toLowerCase().includes(s)||r.leadResearchInstitute&&r.leadResearchInstitute.toLowerCase().includes(s)||r.projectGrantScope&&r.projectGrantScope.toLowerCase().includes(s))}return t.sort((s,r)=>{const l=s[o.column]||"",i=r[o.column]||"";return l<i?o.direction==="asc"?-1:1:l>i?o.direction==="asc"?1:-1:0}),t},[p,a,o]),d=t=>{h(s=>({column:t,direction:s.column===t&&s.direction==="asc"?"desc":"asc"}))},c=t=>o.column===t?o.direction==="asc"?" ▲":" ▼":"";return e.jsxs("div",{style:{fontSize:"1.3rem",padding:"20px",backgroundColor:"#f9fafb",minHeight:"100vh"},children:[e.jsx("style",{children:`
                .dashboard-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    border: 1px solid #e5e7eb;
                    overflow: hidden;
                }
                .dashboard-header {
                    padding: 30px;
                    border-bottom: 1px solid #e5e7eb;
                    background-color: #ffffff;
                }
                .dashboard-title {
                    font-size: 2rem;
                    color: #0056b3;
                    margin: 0 0 10px 0;
                    font-weight: bold;
                }
                .dashboard-subtitle {
                    color: #6b7280;
                    font-size: 1.1rem;
                    margin: 0 0 20px 0;
                }
                .controls-wrapper {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                .search-input {
                    padding: 12px 16px;
                    font-size: 1.1rem;
                    width: 400px;
                    max-width: 100%;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    transition: border-color 0.2s;
                }
                .search-input:focus {
                    outline: none;
                    border-color: #0056b3;
                    box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
                }
                .toggle-btn {
                    background-color: #f3f4f6;
                    border: 1px solid #d1d5db;
                    color: #374151;
                    font-size: 1.1rem;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 10px 20px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .toggle-btn:hover {
                    background-color: #e5e7eb;
                    color: #0056b3;
                }
                .table-container {
                    overflow-x: auto;
                    padding: 0;
                }
                .studies-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .studies-table th {
                    white-space: nowrap;
                    padding: 16px 20px;
                    text-align: left;
                    background-color: #f8f9fa;
                    color: #ffffff;
                    font-weight: 600;
                    cursor: pointer;
                    border-bottom: 2px solid #e5e7eb;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    transition: background-color 0.2s;
                }
                .studies-table th:hover {
                    background-color: #f3f4f6;
                }
                .studies-table td {
                    padding: 14px 20px;
                    color: #374151;
                }
                .study-title-row {
                    background-color: #fff;
                }
                .study-title-text {
                    font-size: 1.3rem;
                    font-weight: bold;
                }
                .study-title-link {
                    color: #0056b3;
                    text-decoration: none;
                    transition: color 0.2s ease-in-out;
                }
                .study-title-link:hover {
                    color: #003060;
                    text-decoration: underline;
                }
                .study-data-row {
                    background-color: #fff;
                    border-bottom: 1px solid #f3f4f6;
                }
                .synopsis-row td {
                    background-color: #fafafa;
                    color: #4b5563;
                    padding: 14px 20px 24px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    line-height: 1.6;
                }
                .scope-label {
                    font-weight: 600;
                    color: #0056b3;
                    margin-right: 8px;
                }
            `}),e.jsxs("div",{className:"dashboard-container",children:[e.jsx("div",{className:"dashboard-header",children:e.jsxs("div",{className:"controls-wrapper",children:[e.jsx("input",{type:"search",placeholder:"Search projects, researchers, or institutes...",className:"search-input",value:a,onChange:t=>_(t.target.value)}),e.jsx("button",{className:"toggle-btn",onClick:()=>f(!u),children:u?"Collapse All Scopes":"Expand All Scopes"})]})}),e.jsx("div",{className:"table-container",children:e.jsxs("table",{className:"studies-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsxs("th",{onClick:()=>d("leadResearcher"),children:["Lead Researcher ",e.jsx("span",{className:"sort-indicator",children:c("leadResearcher")})]}),e.jsxs("th",{onClick:()=>d("leadResearchInstitute"),children:["Institute ",e.jsx("span",{className:"sort-indicator",children:c("leadResearchInstitute")})]}),e.jsxs("th",{onClick:()=>d("projectGrantStartDate"),children:["Start Date ",e.jsx("span",{className:"sort-indicator",children:c("projectGrantStartDate")})]}),e.jsxs("th",{onClick:()=>d("projectGrantEndDate"),children:["End Date ",e.jsx("span",{className:"sort-indicator",children:c("projectGrantEndDate")})]}),e.jsxs("th",{onClick:()=>d("grantNumber"),children:["Grant Number ",e.jsx("span",{className:"sort-indicator",children:c("grantNumber")})]})]})}),e.jsxs("tbody",{children:[j.map((t,s)=>e.jsxs(x.Fragment,{children:[e.jsx("tr",{className:"study-title-row",children:e.jsx("td",{colSpan:"5",style:{paddingTop:"24px",paddingBottom:"8px"},children:e.jsx("span",{className:"study-title-text",children:e.jsx("a",{href:`project_meta.html?id=${t.pid}`,className:"study-title-link",children:t.projectGrantName})})})}),e.jsxs("tr",{className:"study-data-row",children:[e.jsx("td",{children:t.leadResearcher}),e.jsx("td",{children:t.leadResearchInstitute}),e.jsx("td",{children:t.projectGrantStartDate}),e.jsx("td",{children:t.projectGrantEndDate}),e.jsx("td",{children:t.grantNumber})]}),u&&e.jsx("tr",{className:"synopsis-row",children:e.jsx("td",{colSpan:"5",children:t.projectGrantScope})})]},t.pid||s)),p.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"40px",color:"#6b7280"},children:"No data found. Ensure your JSON files are in the correct directory."})})]})]})})]})]})};function m(a,_){const o=document.getElementById(a);o?g.createRoot(o).render(e.jsx(x.StrictMode,{children:_})):console.error(`Target element '${a}' not found in the DOM.`)}m("header",e.jsx(w,{}));m("introduction",e.jsx(K,{}));m("projectsSection",e.jsx(P,{}));m("feedback_widget",e.jsx(F,{}));m("instructions_widget",e.jsx(W,{fileUrl:"/studies_help.md"}));
