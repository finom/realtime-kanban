import { createAIComponentDefs } from "../createAIComponentDefs";

// Layout & Container
import { CardDef } from "./components/Card/def";
import { FlexRowDef } from "./components/FlexRow/def";
import { FlexColDef } from "./components/FlexCol/def";
import { DividerDef } from "./components/Divider/def";

// Typography & Display
import { HeadingDef } from "./components/Heading/def";
import { TextDef } from "./components/Text/def";
import { BadgeDef } from "./components/Badge/def";
import { IconDef } from "./components/Icon/def";
import { TagDef } from "./components/Tag/def";
import { StatDef } from "./components/Stat/def";

// Tabs
import { TabsDef } from "./components/Tabs/def";
import { TabListDef } from "./components/TabList/def";
import { TabTriggerDef } from "./components/TabTrigger/def";
import { TabContentDef } from "./components/TabContent/def";

// Feedback
import { AlertDef } from "./components/Alert/def";
import { SkeletonDef } from "./components/Skeleton/def";
import { EmptyStateDef } from "./components/EmptyState/def";

// Form
import { InputDef } from "./components/Input/def";
import { TextareaDef } from "./components/Textarea/def";
import { NumberInputDef } from "./components/NumberInput/def";
import { SelectDef } from "./components/Select/def";
import { DatePickerDef } from "./components/DatePicker/def";
import { CheckboxDef } from "./components/Checkbox/def";
import { ButtonDef } from "./components/Button/def";
import { FieldDef } from "./components/Field/def";
import { FieldLabelDef } from "./components/FieldLabel/def";
import { FieldDescriptionDef } from "./components/FieldDescription/def";

// Overlay
import { ModalDef } from "./components/Modal/def";
import { ConfirmDialogDef } from "./components/ConfirmDialog/def";
import { DropdownMenuDef } from "./components/DropdownMenu/def";
import { DropdownMenuItemDef } from "./components/DropdownMenuItem/def";

// Table
import { TableDef } from "./components/Table/def";
import { TableHeaderDef } from "./components/TableHeader/def";
import { TableBodyDef } from "./components/TableBody/def";
import { TableFooterDef } from "./components/TableFooter/def";
import { TableRowDef } from "./components/TableRow/def";
import { TableHeadDef } from "./components/TableHead/def";
import { TableCellDef } from "./components/TableCell/def";

// Navigation
import { PaginationDef } from "./components/Pagination/def";

// Charts
import { BarChartDef } from "./components/BarChart/def";
import { LineChartDef } from "./components/LineChart/def";
import { PieChartDef } from "./components/PieChart/def";
import { FunnelChartDef } from "./components/FunnelChart/def";

export const componentDefs = createAIComponentDefs({
  // Layout & Container
  Card: CardDef,
  FlexRow: FlexRowDef,
  FlexCol: FlexColDef,
  Divider: DividerDef,
  // Typography & Display
  Heading: HeadingDef,
  Text: TextDef,
  Badge: BadgeDef,
  Icon: IconDef,
  Tag: TagDef,
  Stat: StatDef,
  // Tabs
  Tabs: TabsDef,
  TabList: TabListDef,
  TabTrigger: TabTriggerDef,
  TabContent: TabContentDef,
  // Feedback
  Alert: AlertDef,
  Skeleton: SkeletonDef,
  EmptyState: EmptyStateDef,
  // Form
  Input: InputDef,
  Textarea: TextareaDef,
  NumberInput: NumberInputDef,
  Select: SelectDef,
  DatePicker: DatePickerDef,
  Checkbox: CheckboxDef,
  Button: ButtonDef,
  Field: FieldDef,
  FieldLabel: FieldLabelDef,
  FieldDescription: FieldDescriptionDef,
  // Overlay
  Modal: ModalDef,
  ConfirmDialog: ConfirmDialogDef,
  DropdownMenu: DropdownMenuDef,
  DropdownMenuItem: DropdownMenuItemDef,
  // Table
  Table: TableDef,
  TableHeader: TableHeaderDef,
  TableBody: TableBodyDef,
  TableFooter: TableFooterDef,
  TableRow: TableRowDef,
  TableHead: TableHeadDef,
  TableCell: TableCellDef,
  // Navigation
  Pagination: PaginationDef,
  // Charts
  BarChart: BarChartDef,
  LineChart: LineChartDef,
  PieChart: PieChartDef,
  FunnelChart: FunnelChartDef,
});
