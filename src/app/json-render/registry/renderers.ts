import { createAIComponentRenderers } from "../createAIComponentRenderers";

// Layout & Container
import { CardRenderer } from "./components/Card/renderer";
import { FlexRowRenderer } from "./components/FlexRow/renderer";
import { FlexColRenderer } from "./components/FlexCol/renderer";
import { DividerRenderer } from "./components/Divider/renderer";
import { AccordionRenderer } from "./components/Accordion/renderer";
import { AccordionItemRenderer } from "./components/AccordionItem/renderer";
import { DrawerRenderer } from "./components/Drawer/renderer";
import { GridRenderer } from "./components/Grid/renderer";
import { StackRenderer } from "./components/Stack/renderer";
import { SpacerRenderer } from "./components/Spacer/renderer";

// Typography & Display
import { HeadingRenderer } from "./components/Heading/renderer";
import { TextRenderer } from "./components/Text/renderer";
import { BadgeRenderer } from "./components/Badge/renderer";
import { LabelRenderer } from "./components/Label/renderer";
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
import { ToastRenderer } from "./components/Toast/renderer";
import { SpinnerRenderer } from "./components/Spinner/renderer";

// Form
import { InputRenderer } from "./components/Input/renderer";
import { TextareaRenderer } from "./components/Textarea/renderer";
import { NumberInputRenderer } from "./components/NumberInput/renderer";
import { SelectRenderer } from "./components/Select/renderer";
import { MultiSelectRenderer } from "./components/MultiSelect/renderer";
import { DatePickerRenderer } from "./components/DatePicker/renderer";
import { DateRangePickerRenderer } from "./components/DateRangePicker/renderer";
import { TimePickerRenderer } from "./components/TimePicker/renderer";
import { CheckboxRenderer } from "./components/Checkbox/renderer";
import { RadioRenderer } from "./components/Radio/renderer";
import { SwitchRenderer } from "./components/Switch/renderer";
import { FileUploadRenderer } from "./components/FileUpload/renderer";
import { ColorPickerRenderer } from "./components/ColorPicker/renderer";
import { ButtonRenderer } from "./components/Button/renderer";
import { IconButtonRenderer } from "./components/IconButton/renderer";
import { ButtonGroupRenderer } from "./components/ButtonGroup/renderer";
import { FieldRenderer } from "./components/Field/renderer";
import { FieldLabelRenderer } from "./components/FieldLabel/renderer";
import { FieldDescriptionRenderer } from "./components/FieldDescription/renderer";

// Overlay
import { ModalRenderer } from "./components/Modal/renderer";
import { ConfirmDialogRenderer } from "./components/ConfirmDialog/renderer";
import { DropdownMenuRenderer } from "./components/DropdownMenu/renderer";
import { DropdownMenuItemRenderer } from "./components/DropdownMenuItem/renderer";
import { PopoverRenderer } from "./components/Popover/renderer";

// Data Display
import { ListRenderer } from "./components/List/renderer";
import { DataGridRenderer } from "./components/DataGrid/renderer";
import { AvatarRenderer } from "./components/Avatar/renderer";
import { TooltipRenderer } from "./components/Tooltip/renderer";
import { ProgressBarRenderer } from "./components/ProgressBar/renderer";
import { ImageRenderer } from "./components/Image/renderer";

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
import { BreadcrumbRenderer } from "./components/Breadcrumb/renderer";
import { StepperRenderer } from "./components/Stepper/renderer";

// Charts
import { BarChartRenderer } from "./components/BarChart/renderer";
import { LineChartRenderer } from "./components/LineChart/renderer";
import { PieChartRenderer } from "./components/PieChart/renderer";
import { AreaChartRenderer } from "./components/AreaChart/renderer";
import { FunnelChartRenderer } from "./components/FunnelChart/renderer";

export const componentRenderers = createAIComponentRenderers({
  // Layout & Container
  Card: CardRenderer,
  FlexRow: FlexRowRenderer,
  FlexCol: FlexColRenderer,
  Divider: DividerRenderer,
  Accordion: AccordionRenderer,
  AccordionItem: AccordionItemRenderer,
  Drawer: DrawerRenderer,
  Grid: GridRenderer,
  Stack: StackRenderer,
  Spacer: SpacerRenderer,
  // Typography & Display
  Heading: HeadingRenderer,
  Text: TextRenderer,
  Badge: BadgeRenderer,
  Label: LabelRenderer,
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
  Toast: ToastRenderer,
  Spinner: SpinnerRenderer,
  // Form
  Input: InputRenderer,
  Textarea: TextareaRenderer,
  NumberInput: NumberInputRenderer,
  Select: SelectRenderer,
  MultiSelect: MultiSelectRenderer,
  DatePicker: DatePickerRenderer,
  DateRangePicker: DateRangePickerRenderer,
  TimePicker: TimePickerRenderer,
  Checkbox: CheckboxRenderer,
  Radio: RadioRenderer,
  Switch: SwitchRenderer,
  FileUpload: FileUploadRenderer,
  ColorPicker: ColorPickerRenderer,
  Button: ButtonRenderer,
  IconButton: IconButtonRenderer,
  ButtonGroup: ButtonGroupRenderer,
  Field: FieldRenderer,
  FieldLabel: FieldLabelRenderer,
  FieldDescription: FieldDescriptionRenderer,
  // Overlay
  Modal: ModalRenderer,
  ConfirmDialog: ConfirmDialogRenderer,
  DropdownMenu: DropdownMenuRenderer,
  DropdownMenuItem: DropdownMenuItemRenderer,
  Popover: PopoverRenderer,
  // Data Display
  List: ListRenderer,
  DataGrid: DataGridRenderer,
  Avatar: AvatarRenderer,
  Tooltip: TooltipRenderer,
  ProgressBar: ProgressBarRenderer,
  Image: ImageRenderer,
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
  Breadcrumb: BreadcrumbRenderer,
  Stepper: StepperRenderer,
  // Charts
  BarChart: BarChartRenderer,
  LineChart: LineChartRenderer,
  PieChart: PieChartRenderer,
  AreaChart: AreaChartRenderer,
  FunnelChart: FunnelChartRenderer,
});
