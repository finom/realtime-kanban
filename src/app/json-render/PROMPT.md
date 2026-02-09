Build a Project Management Dashboard with the following sections:

**1. Top Stats Row:** Show 4 stat cards across the top — Total Users, Total Tasks, Tasks In Progress, and Tasks Done. Each should show the actual count fetched from the server.

**2. Charts Section (side by side):**

- A **bar chart** showing task count by status (TODO, IN_PROGRESS, IN_REVIEW, DONE).
- A **pie chart** showing task distribution per user (each slice = a user, value = how many tasks they own).

**3. Tabbed Section with two tabs — "Tasks Board" and "Team Management":**

**Tasks Board tab:**

- A filterable tasks table with columns: Title, Description, Status (shown as a colored badge), Assigned User (show their name, not ID), and Actions.
- Include a search input above the table that filters tasks by title.
- Each row should have a dropdown menu with Edit and Delete options.
- Delete should show a confirmation dialog before actually deleting.
- There should be an "Add Task" button that opens a modal with a form: title input, description input, a status select dropdown, and a user select dropdown (populated from the users list). Submitting the form should create the task via RPC and refresh the table.
- After any mutation (create, delete, status change), the stats and charts should also update.

**Team Management tab:**

- A table of all users with columns: Full Name, Email, Task Count (computed from tasks data), and Actions.
- An "Add User" button that opens a modal with name and email fields.
- Each user row should have Edit and Delete actions in a dropdown. Deleting a user should show a confirm dialog and warn that their tasks will also be removed.

Make sure everything is reactive — adding/removing tasks or users should immediately reflect in the stats and charts without a full page reload.
