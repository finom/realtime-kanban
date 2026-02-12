import { createAIComponentDefs } from "../createAIComponentDefs";

// Layout & Container
import { CardDef } from "./components/Card/def";
import { FlexRowDef } from "./components/FlexRow/def";
import { FlexColDef } from "./components/FlexCol/def";
import { DividerDef } from "./components/Divider/def";
import { AccordionDef } from "./components/Accordion/def";
import { AccordionItemDef } from "./components/AccordionItem/def";
import { DrawerDef } from "./components/Drawer/def";
import { GridDef } from "./components/Grid/def";
import { StackDef } from "./components/Stack/def";
import { SpacerDef } from "./components/Spacer/def";

// Typography & Display
import { HeadingDef } from "./components/Heading/def";
import { TextDef } from "./components/Text/def";
import { BadgeDef } from "./components/Badge/def";
import { LabelDef } from "./components/Label/def";
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
import { ToastDef } from "./components/Toast/def";
import { SpinnerDef } from "./components/Spinner/def";

// Form
import { InputDef } from "./components/Input/def";
import { TextareaDef } from "./components/Textarea/def";
import { NumberInputDef } from "./components/NumberInput/def";
import { SelectDef } from "./components/Select/def";
import { MultiSelectDef } from "./components/MultiSelect/def";
import { DatePickerDef } from "./components/DatePicker/def";
import { DateRangePickerDef } from "./components/DateRangePicker/def";
import { TimePickerDef } from "./components/TimePicker/def";
import { CheckboxDef } from "./components/Checkbox/def";
import { RadioDef } from "./components/Radio/def";
import { SwitchDef } from "./components/Switch/def";
import { FileUploadDef } from "./components/FileUpload/def";
import { ColorPickerDef } from "./components/ColorPicker/def";
import { ButtonDef } from "./components/Button/def";
import { IconButtonDef } from "./components/IconButton/def";
import { ButtonGroupDef } from "./components/ButtonGroup/def";
import { FieldDef } from "./components/Field/def";
import { FieldLabelDef } from "./components/FieldLabel/def";
import { FieldDescriptionDef } from "./components/FieldDescription/def";

// Overlay
import { ModalDef } from "./components/Modal/def";
import { ConfirmDialogDef } from "./components/ConfirmDialog/def";
import { DropdownMenuDef } from "./components/DropdownMenu/def";
import { DropdownMenuItemDef } from "./components/DropdownMenuItem/def";
import { PopoverDef } from "./components/Popover/def";

// Data Display
import { ListDef } from "./components/List/def";
import { DataGridDef } from "./components/DataGrid/def";
import { AvatarDef } from "./components/Avatar/def";
import { TooltipDef } from "./components/Tooltip/def";
import { ProgressBarDef } from "./components/ProgressBar/def";
import { ImageDef } from "./components/Image/def";

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
import { BreadcrumbDef } from "./components/Breadcrumb/def";
import { StepperDef } from "./components/Stepper/def";

// Charts
import { BarChartDef } from "./components/BarChart/def";
import { LineChartDef } from "./components/LineChart/def";
import { PieChartDef } from "./components/PieChart/def";
import { AreaChartDef } from "./components/AreaChart/def";
import { FunnelChartDef } from "./components/FunnelChart/def";

export const componentDefs = createAIComponentDefs({
  // Layout & Container
  Card: CardDef,
  FlexRow: FlexRowDef,
  FlexCol: FlexColDef,
  Divider: DividerDef,
  Accordion: AccordionDef,
  AccordionItem: AccordionItemDef,
  Drawer: DrawerDef,
  Grid: GridDef,
  Stack: StackDef,
  Spacer: SpacerDef,
  // Typography & Display
  Heading: HeadingDef,
  Text: TextDef,
  Badge: BadgeDef,
  Label: LabelDef,
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
  Toast: ToastDef,
  Spinner: SpinnerDef,
  // Form
  Input: InputDef,
  Textarea: TextareaDef,
  NumberInput: NumberInputDef,
  Select: SelectDef,
  MultiSelect: MultiSelectDef,
  DatePicker: DatePickerDef,
  DateRangePicker: DateRangePickerDef,
  TimePicker: TimePickerDef,
  Checkbox: CheckboxDef,
  Radio: RadioDef,
  Switch: SwitchDef,
  FileUpload: FileUploadDef,
  ColorPicker: ColorPickerDef,
  Button: ButtonDef,
  IconButton: IconButtonDef,
  ButtonGroup: ButtonGroupDef,
  Field: FieldDef,
  FieldLabel: FieldLabelDef,
  FieldDescription: FieldDescriptionDef,
  // Overlay
  Modal: ModalDef,
  ConfirmDialog: ConfirmDialogDef,
  DropdownMenu: DropdownMenuDef,
  DropdownMenuItem: DropdownMenuItemDef,
  Popover: PopoverDef,
  // Data Display
  List: ListDef,
  DataGrid: DataGridDef,
  Avatar: AvatarDef,
  Tooltip: TooltipDef,
  ProgressBar: ProgressBarDef,
  Image: ImageDef,
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
  Breadcrumb: BreadcrumbDef,
  Stepper: StepperDef,
  // Charts
  BarChart: BarChartDef,
  LineChart: LineChartDef,
  PieChart: PieChartDef,
  AreaChart: AreaChartDef,
  FunnelChart: FunnelChartDef,
});
