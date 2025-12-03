import { createRoot } from 'react-dom/client'

const links =
    <div>
        <p>
            <a href="./top_bar.html"> Example with the filters given as a horizontal navbar. </a>
        </p>
        <p>
            <a href="./vert_bar.html"> Example with the filters given as a vertical navbar. </a>
        </p>
        <p>
            <a href="./just_vert_bar.html"> Example with just the filters given as a vertical navbar. </a>
        </p>
        <p>
            <a href="./metadata.html"> Example page of how the metadata might be displayed. </a>
        </p>
        <p>
            <a href="./structural_metadata.html"> Example page of how the structural metadata might be displayed. </a>
            <a href="./upload.html"> Early mock up so I can explore how to change the guidance and schemas. </a>
        </p>
    </div>;

createRoot(document.getElementById("root")).render(links);