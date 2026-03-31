

3. uploadTopBar.jsx
The handleSaveToDatabase function currently wraps everything in a metadata_blob.
We need to check if this should be "flattened." If the real backend expects a 
direct POST of projectGrantName, the code here must be adjusted to send the 
fields as top-level keys rather than nesting them inside a blob.

4. Header.jsx
This file provides the user_id and team_id context. 
We must ensure these IDs are being passed correctly to the UploadTopBar 
so they match the first two requirements of your PHP model.

# queries
7. How are pid and version handled in the php backend. 
Do people decide their own version and pid?
This impacts ProjectGrantSchemaPage.jsx