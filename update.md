I've updated associateIcons to make more robust.

I've improved the flow of SchemaPage by putting all the variable information into semanticSchema.json.
I hope that this will make it a lot clearer what I've done.

In particular, I've introduced two new sections to semanticSchema
- 1 visibleSections - these are the sections which will be visible in the upload page. Nothing else.
- included - this is a list of what should be included in a section (where it is not the same as schema.json)

Note that I have changed the definition of observedNode. If this causes a hassle then it doesn't matter at all for the 
conference. We can come back to it.

I've updated the dummy data to address your concerns about the objects and strings. Let me know if there are any 
remaining issues.

Mapping the icons.
I have added a new definition of Icon to schema.json because it is a new field to be stored. It shouldnt cause too many problems.
For the purposes of the search page you should use utils/icon_url_mapping.json to find the correct icon addresses.

Adding defaults - I want to keep populationSize as required but give it a default size of 0 so that it copes with animal models
That has taken some changes in SchemaPage (search under default)

Using the search filters
If someone searches for "0_1_2_3" then you should include a search for all the parents I think. 

Start and End Date - Fixed the non-existent references in #def in schema