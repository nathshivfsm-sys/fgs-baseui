# Job category and subcategory screen

**Figma:** [listing](https://www.figma.com/design/fKuNuVXQThJ9uPGq8FECm3/SETTINGS?node-id=2139-2394) · [add category](https://www.figma.com/design/fKuNuVXQThJ9uPGq8FECm3/SETTINGS?node-id=2178-1841) · [add subcategory](https://www.figma.com/design/fKuNuVXQThJ9uPGq8FECm3/SETTINGS?node-id=2296-177)
**Owning MFE:** settings
**Route:** `operations/job-type` catalog `category` (default)

## Overview

Settings operators manage job categories and their subcategories from the existing Job Type screen. The category list and subcategory table load from `/jobcategory` and `/jobtypetask`. Add and edit reuse one dialog each, matching the Zone and Trade form dialogs.

## Goals

- Replace placeholder category and subcategory rows with the catalog APIs.
- Add and edit a category from the Figma dialog (name, background color, text color, active).
- Add and edit a subcategory for the selected category (category locked, name, trade, skill, task name, estimated time, priority, active).
- Show load and save failures with the shared catalog error copy and a success alert.

## Non-Goals

- Job Type catalog tab (grouped table stays on placeholder data).
- Category filter popover (the filter button stays unwired).
- DELETE (swagger has no delete).
- A category code field (the add dialog does not include one; list still shows `categoryCode` when the API sends it).
- Changing a subcategory's category after it is created.

## Functional requirements

- **REQ-1** The category pane lists `GET /jobcategory` (page size 1000). Search stays client-side on name and code. Selecting a row loads that category's subcategories.
- **REQ-2** Nav counts for Category are the active and inactive totals from that list. Job Type nav counts stay the existing placeholders.
- **REQ-3** Add and edit category share `CategoryFormDialog`. Create `POST /jobcategory`. Edit `PATCH /jobcategory/{id}` so Active saves (PUT omits `isActive`). Name, background color, and text color are required. Active defaults on. `categoryCode` is sent as null on create and left unchanged on edit.
- **REQ-4** The subcategory table lists `GET /jobtypetask?jobCategoryId=` for the selection. Columns match the listing frame, including Skill. Active and Inactive tabs and the table search stay client-side.
- **REQ-5** Add and edit subcategory share `SubcategoryFormDialog`. Category is read-only and is the selected category. Create `POST /jobtypetask`. Edit `PATCH /jobtypetask/{id}`. Trade, name, estimated time, and priority are required. Skill and task name are optional. Priority is High=1, Medium=2, Low=3.
- **REQ-6** Trade and skill selects use the existing tech-trade and tech-skill-level lookups. Estimated time is hours and the table shows `Hh MMm`.
- **REQ-7** A failed load or save shows `describeCatalogError` copy. A successful save closes the dialog and shows a success alert.

## Edge cases

- No categories: the list is empty and Add Subcategory does not open.
- A selected category that disappears after refresh: select the first remaining category.
- A color must be `#` plus six hex digits. The swatch and the text stay in sync.
- A priority outside 1–3 displays the number. The edit form asks the user to pick High, Medium, or Low before save.
- Lookup names that have not loaded yet leave Trade and Skill blank until the lookup returns.

## Assumptions

- Task Name is editable. The Figma frame shows it disabled with the category name; the listing shows a distinct task name, so the field is an optional text input.
- `usedFor` and job-type create are not part of this screen.
- One page of 1000 records is enough for the side list and the subcategory table.
