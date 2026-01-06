import { createRoot } from 'react-dom/client'

const links =
    <div>
        <p>
            <a href="./src/alt_studies.html"> alt_studies.html It provides a brief synopsis for each study </a>
        </p>
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
            <a href="./src/meta.html"> meta.html uploads mammogram.json and displays the metadata. </a>
        </p>
        <p>
            <a href="./structural_metadata.html"> Example page of how the structural metadata might be displayed. </a>
        </p>
        <p>
            <a href="./src/upload.html"> upload.html. Uses schema.json to provide the basis for uploads </a>
        </p>
    </div>;

createRoot(document.getElementById("root")).render(links);