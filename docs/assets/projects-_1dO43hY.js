import{j as e,R as w}from"./client-BbprRhkc.js";import{r as n,R as b,H as y}from"./Header-Jtw2o2cf.js";import{F as S}from"./FeedbackWidget-C4_S6f4q.js";import{I as N}from"./InstructionsWidget-9BuauYPN.js";import"./FeedbackModal-DPiWdFhc.js";import"./useFeedback-CVbG0dOl.js";const k=()=>e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-16",children:[e.jsx("h1",{className:"text-4xl sm:text-5xl font-extrabold text-[var(--cruk-blue)] mb-6 tracking-tight",children:"Unleashing the power of big data"}),e.jsx("h1",{className:"text-xl sm:text-xl font-extrabold text-[var(--cruk-blue)] mb-6 tracking-tight",children:"Browse our Research Projects "}),e.jsxs("div",{className:"space-y-6 text-gray-700 text-lg sm:text-xl leading-relaxed",children:[e.jsx("p",{className:"font-medium text-gray-900",children:"Welcome to the CRUK Data Hub, your gateway to data produced by research funded through Cancer Research UK."}),e.jsx("p",{children:"Here you can search our current research grants, lead investigators, and project scopes."})]})]}),R=()=>{const[a,l]=n.useState(""),[s,x]=n.useState({column:"projectGrantStartDate",direction:"desc"}),[p,f]=n.useState([]),[h,j]=n.useState(!0);n.useEffect(()=>{(async()=>{localStorage.getItem("token");try{const r=await fetch("http://127.0.0.1:8000/projects/",{method:"GET",headers:{"Content-Type":"application/json"}});if(!r.ok)throw new Error("Failed to fetch database records");const o=await r.json();f(o)}catch(r){console.error("Error loading from database:",r)}})()},[]);const g=n.useMemo(()=>{let t=[...p];if(a){const r=a.toLowerCase();t=t.filter(o=>o.projectGrantName&&o.projectGrantName.toLowerCase().includes(r)||o.leadResearcher&&o.leadResearcher.toLowerCase().includes(r)||o.leadResearchInstitute&&o.leadResearchInstitute.toLowerCase().includes(r)||o.projectGrantScope&&o.projectGrantScope.toLowerCase().includes(r))}return t.sort((r,o)=>{const u=r[s.column]||"",m=o[s.column]||"";return u<m?s.direction==="asc"?-1:1:u>m?s.direction==="asc"?1:-1:0}),t},[p,a,s]),c=t=>{x(r=>({column:t,direction:r.column===t&&r.direction==="asc"?"desc":"asc"}))},d=t=>s.column===t?s.direction==="asc"?" ▲":" ▼":"";return e.jsxs("div",{style:{fontSize:"1.3rem",padding:"20px",backgroundColor:"#f9fafb",minHeight:"100vh"},children:[e.jsx("style",{children:`
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
            `}),e.jsxs("div",{className:"dashboard-container",children:[e.jsx("div",{className:"dashboard-header",children:e.jsxs("div",{className:"controls-wrapper",children:[e.jsx("input",{type:"search",placeholder:"Search projects, researchers, or institutes...",className:"search-input",value:a,onChange:t=>l(t.target.value)}),e.jsx("button",{className:"toggle-btn",onClick:()=>j(!h),children:h?"Collapse All Scopes":"Expand All Scopes"})]})}),e.jsx("div",{className:"table-container",children:e.jsxs("table",{className:"studies-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsxs("th",{onClick:()=>c("leadResearcher"),children:["Lead Researcher ",e.jsx("span",{className:"sort-indicator",children:d("leadResearcher")})]}),e.jsxs("th",{onClick:()=>c("leadResearchInstitute"),children:["Institute ",e.jsx("span",{className:"sort-indicator",children:d("leadResearchInstitute")})]}),e.jsxs("th",{onClick:()=>c("projectGrantStartDate"),children:["Start Date ",e.jsx("span",{className:"sort-indicator",children:d("projectGrantStartDate")})]}),e.jsxs("th",{onClick:()=>c("projectGrantEndDate"),children:["End Date ",e.jsx("span",{className:"sort-indicator",children:d("projectGrantEndDate")})]}),e.jsxs("th",{onClick:()=>c("grantNumbers"),children:["Grant Number ",e.jsx("span",{className:"sort-indicator",children:d("grantNumbers")})]})]})}),e.jsxs("tbody",{children:[g.map((t,r)=>e.jsxs(b.Fragment,{children:[e.jsx("tr",{className:"study-title-row",children:e.jsx("td",{colSpan:"5",style:{paddingTop:"24px",paddingBottom:"8px"},children:e.jsx("span",{className:"study-title-text",children:e.jsx("a",{href:`project_meta.html?id=${t.pid}`,className:"study-title-link",children:t.projectGrantName})})})}),e.jsxs("tr",{className:"study-data-row",children:[e.jsx("td",{children:t.leadResearcher}),e.jsx("td",{children:t.leadResearchInstitute}),e.jsx("td",{children:t.projectGrantStartDate}),e.jsx("td",{children:t.projectGrantEndDate}),e.jsx("td",{children:t.grantNumbers})]}),h&&e.jsx("tr",{className:"synopsis-row",children:e.jsx("td",{colSpan:"5",children:t.projectGrantScope})})]},t.pid||r)),p.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"5",style:{textAlign:"center",padding:"40px",color:"#6b7280"},children:"No data found. Ensure your JSON files are in the correct directory."})})]})]})})]})]})};function i(a,l){const s=document.getElementById(a);s?w.createRoot(s).render(e.jsx(b.StrictMode,{children:l})):console.error(`Target element '${a}' not found in the DOM.`)}i("header",e.jsx(y,{}));i("introduction",e.jsx(k,{}));i("projectsSection",e.jsx(R,{}));i("feedback_widget",e.jsx(S,{}));i("instructions_widget",e.jsx(N,{fileUrl:"/studies_help.md"}));
