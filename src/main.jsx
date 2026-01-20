import { createRoot } from 'react-dom/client'

const links =
    <div>
        <p>The most up to date pages are as follows</p>
        <p>
            <a href="./src/alt_studies.html"> alt_studies.html- For finding studies and displaying a brief synopsis. </a>
        </p>
        <p>
            <a href="./src/meta.html"> meta.html- For displaying the metadata of the selected dataset. </a>
        </p>
        <p>
            <a href="./src/upload.html"> upload.html - for uploading data about an established dataset. </a>
        </p>
        <p>
            <a href="./src/upload.html?mode=newProject"> upload.html - for uploading data about a new project. </a>
        </p>

        <p> Older versions are also included </p>
        <p>
            <a href="./src/top_bar.html"> Example with the filters given as a horizontal navbar. </a>
        </p>
        <p>
            <a href="./src/vert_bar.html"> Example with the filters given as a vertical navbar. </a>
        </p>
        <p>
            <a href="./src/just_vert_bar.html"> Example with just the filters given as a vertical navbar. </a>
        </p>
        <p>
            <a href="./metadata.html"> Example page of how the metadata might be displayed. </a>
        </p>

        <p>
            <a href="./structural_metadata.html"> Example page of how the structural metadata might be displayed. </a>
        </p>
    </div>;

createRoot(document.getElementById("root")).render(links);