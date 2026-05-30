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

## TODO

- Make general edits
- Make edits to a specific component in the tree
- Entity registry and voice control
- Rerender lines on CEL error (rerender loop)
- Form data for files
- e2e tests
- Loading/error states
- Disabled state

> I'd say loading/error + disabled + dropdown are the three that would actually close the gap. Everything else falls out from those plus visibility.

Example sniuppets:

- Multi-step flows / tabs / navigation - CLAUDE said that

Here's what I'd consider the complete set:
Layout: Card, Tabs, Accordion, Modal, Drawer, Divider, Grid, Stack, Spacer
Typography: Heading, Text, Badge, Label
Data Input: Input, Textarea, NumberInput, Select, MultiSelect, Checkbox, Radio, Switch, DatePicker, DateRangePicker, TimePicker, FileUpload, ColorPicker
Buttons & Actions: Button, IconButton, ButtonGroup, DropdownMenu
Data Display: Table, List, DataGrid (virtual scrolling for large datasets), Avatar, Icon, Tooltip, ProgressBar, Stat (label + big number + trend arrow), Tag, Image
Charts: BarChart, LineChart, PieChart, AreaChart, FunnelChart (critical for CRM pipelines)
Feedback: Alert, Toast, Skeleton (loading), Spinner, EmptyState
Navigation: Breadcrumb, Pagination, Stepper (wizard flows)
Overlay: Modal, Drawer, Popover, ConfirmDialog
That's roughly 45 components. For a CRM specifically I'd prioritize these as your launch set (gets you to 90%): Card, Tabs, Modal, Heading, Text, Badge, Input, Select, DatePicker, Checkbox, Button, DropdownMenu, Table, Stat, Icon, Tag, Alert, Skeleton, EmptyState, Pagination, ConfirmDialog, BarChart, LineChart, PieChart, FunnelChart.
That's 25 components. The rest you add when users ask for them.
\*/
