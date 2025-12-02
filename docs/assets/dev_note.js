document.addEventListener('DOMContentLoaded', () => {
    // ... (Existing code to populate nameList and rightPanel) ...

    const toggleButton = document.getElementById('toggleDevNotes');
    const devNotes = document.querySelectorAll('.dev-note');

    // Initial state: Notes are visible, button says "Hide"

    toggleButton.addEventListener('click', () => {
        let isHidden = false;

        // Toggle the 'hidden' class on every dev note
        devNotes.forEach(note => {
            note.classList.toggle('hidden');
            // Check if *any* note is now hidden to update the button text
            if (note.classList.contains('hidden')) {
                isHidden = true;
            }
        });

        // Update the button text based on the new state
        if (isHidden) {
            toggleButton.textContent = 'Show Developer Notes';
        } else {
            toggleButton.textContent = 'Hide Developer Notes';
        }
    });
});