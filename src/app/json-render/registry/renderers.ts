import { createAIComponentRenderers } from "../createAIComponentRenderers";

// Layout & Container
import { CardRenderer } from "./components/Card/renderer";
import { FlexRowRenderer } from "./components/FlexRow/renderer";
import { FlexColRenderer } from "./components/FlexCol/renderer";
import { DividerRenderer } from "./components/Divider/renderer";

// Typography & Display
import { HeadingRenderer } from "./components/Heading/renderer";
import { TextRenderer } from "./components/Text/renderer";
import { BadgeRenderer } from "./components/Badge/renderer";
import { IconRenderer } from "./components/Icon/renderer";
import { TagRenderer } from "./components/Tag/renderer";
import { StatRenderer } from "./components/Stat/renderer";

// Tabs
import { TabsRenderer } from "./components/Tabs/renderer";
import { TabListRenderer } from "./components/TabList/renderer";
import { TabTriggerRenderer } from "./components/TabTrigger/renderer";
import { TabContentRenderer } from "./components/TabContent/renderer";

// Feedback
import { AlertRenderer } from "./components/Alert/renderer";
import { SkeletonRenderer } from "./components/Skeleton/renderer";
import { EmptyStateRenderer } from "./components/EmptyState/renderer";

// Form
import { InputRenderer } from "./components/Input/renderer";
import { NumberInputRenderer } from "./components/NumberInput/renderer";
import { SelectRenderer } from "./components/Select/renderer";
import { DatePickerRenderer } from "./components/DatePicker/renderer";
import { CheckboxRenderer } from "./components/Checkbox/renderer";
import { ButtonRenderer } from "./components/Button/renderer";
import { FieldRenderer } from "./components/Field/renderer";
import { FieldLabelRenderer } from "./components/FieldLabel/renderer";
import { FieldDescriptionRenderer } from "./components/FieldDescription/renderer";

// Overlay
import { ModalRenderer } from "./components/Modal/renderer";
import { ConfirmDialogRenderer } from "./components/ConfirmDialog/renderer";
import { DropdownMenuRenderer } from "./components/DropdownMenu/renderer";
import { DropdownMenuItemRenderer } from "./components/DropdownMenuItem/renderer";

// Table
import { TableRenderer } from "./components/Table/renderer";
import { TableHeaderRenderer } from "./components/TableHeader/renderer";
import { TableBodyRenderer } from "./components/TableBody/renderer";
import { TableFooterRenderer } from "./components/TableFooter/renderer";
import { TableRowRenderer } from "./components/TableRow/renderer";
import { TableHeadRenderer } from "./components/TableHead/renderer";
import { TableCellRenderer } from "./components/TableCell/renderer";

// Navigation
import { PaginationRenderer } from "./components/Pagination/renderer";

// Charts
import { BarChartRenderer } from "./components/BarChart/renderer";
import { LineChartRenderer } from "./components/LineChart/renderer";
import { PieChartRenderer } from "./components/PieChart/renderer";
import { FunnelChartRenderer } from "./components/FunnelChart/renderer";

export const componentRenderers = createAIComponentRenderers({
  // Layout & Container
  Card: CardRenderer,
  FlexRow: FlexRowRenderer,
  FlexCol: FlexColRenderer,
  Divider: DividerRenderer,
  // Typography & Display
  Heading: HeadingRenderer,
  Text: TextRenderer,
  Badge: BadgeRenderer,
  Icon: IconRenderer,
  Tag: TagRenderer,
  Stat: StatRenderer,
  // Tabs
  Tabs: TabsRenderer,
  TabList: TabListRenderer,
  TabTrigger: TabTriggerRenderer,
  TabContent: TabContentRenderer,
  // Feedback
  Alert: AlertRenderer,
  Skeleton: SkeletonRenderer,
  EmptyState: EmptyStateRenderer,
  // Form
  Input: InputRenderer,
  NumberInput: NumberInputRenderer,
  Select: SelectRenderer,
  DatePicker: DatePickerRenderer,
  Checkbox: CheckboxRenderer,
  Button: ButtonRenderer,
  Field: FieldRenderer,
  FieldLabel: FieldLabelRenderer,
  FieldDescription: FieldDescriptionRenderer,
  // Overlay
  Modal: ModalRenderer,
  ConfirmDialog: ConfirmDialogRenderer,
  DropdownMenu: DropdownMenuRenderer,
  DropdownMenuItem: DropdownMenuItemRenderer,
  // Table
  Table: TableRenderer,
  TableHeader: TableHeaderRenderer,
  TableBody: TableBodyRenderer,
  TableFooter: TableFooterRenderer,
  TableRow: TableRowRenderer,
  TableHead: TableHeadRenderer,
  TableCell: TableCellRenderer,
  // Navigation
  Pagination: PaginationRenderer,
  // Charts
  BarChart: BarChartRenderer,
  LineChart: LineChartRenderer,
  PieChart: PieChartRenderer,
  FunnelChart: FunnelChartRenderer,
});
