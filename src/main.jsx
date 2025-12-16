import { createRoot } from 'react-dom/client'

const links =
    <div>
        <p>
            <a href="./src/alt_studies.html"> This is my preferred version at the moment. It provides a brief synopsis for each study </a>
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
            <a href="./src/meta.html"> Example page of how the metadata might be displayed in future. </a>
        </p>
        <p>
            <a href="./structural_metadata.html"> Example page of how the structural metadata might be displayed. </a>
        </p>
        <p>
            <a href="./src/upload.html"> Early mock up so I can explore how to change the guidance and schemas. </a>
        </p>
    </div>;

createRoot(document.getElementById("root")).render(links);