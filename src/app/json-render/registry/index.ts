import { createAIComponentRegistry } from "../createAIComponentRegistry";

// Layout & Container
import { Card } from "./components/Card";
import { FlexRow } from "./components/FlexRow";
import { FlexCol } from "./components/FlexCol";
import { Divider } from "./components/Divider";

// Typography & Display
import { Heading } from "./components/Heading";
import { Text } from "./components/Text";
import { Badge } from "./components/Badge";
import { Icon } from "./components/Icon";
import { Tag } from "./components/Tag";
import { Stat } from "./components/Stat";

// Tabs
import { Tabs } from "./components/Tabs";
import { TabList } from "./components/TabList";
import { TabTrigger } from "./components/TabTrigger";
import { TabContent } from "./components/TabContent";

// Feedback
import { Alert } from "./components/Alert";
import { Skeleton } from "./components/Skeleton";
import { EmptyState } from "./components/EmptyState";

// Form
import { Input } from "./components/Input";
import { NumberInput } from "./components/NumberInput";
import { Select } from "./components/Select";
import { DatePicker } from "./components/DatePicker";
import { Checkbox } from "./components/Checkbox";
import { Button } from "./components/Button";
import { Field } from "./components/Field";
import { FieldLabel } from "./components/FieldLabel";
import { FieldDescription } from "./components/FieldDescription";

// Overlay
import { Modal } from "./components/Modal";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { DropdownMenu } from "./components/DropdownMenu";
import { DropdownMenuItem } from "./components/DropdownMenuItem";

// Table
import { Table } from "./components/Table";
import { TableHeader } from "./components/TableHeader";
import { TableBody } from "./components/TableBody";
import { TableFooter } from "./components/TableFooter";
import { TableRow } from "./components/TableRow";
import { TableHead } from "./components/TableHead";
import { TableCell } from "./components/TableCell";

// Navigation
import { Pagination } from "./components/Pagination";

// Charts
import { BarChart } from "./components/BarChart";
import { LineChart } from "./components/LineChart";
import { PieChart } from "./components/PieChart";
import { FunnelChart } from "./components/FunnelChart";

export const componentsRegistry = createAIComponentRegistry({
  // Layout & Container
  Card,
  FlexRow,
  FlexCol,
  Divider,
  // Typography & Display
  Heading,
  Text,
  Badge,
  Icon,
  Tag,
  Stat,
  // Tabs
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  // Feedback
  Alert,
  Skeleton,
  EmptyState,
  // Form
  Input,
  NumberInput,
  Select,
  DatePicker,
  Checkbox,
  Button,
  Field,
  FieldLabel,
  FieldDescription,
  // Overlay
  Modal,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuItem,
  // Table
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  // Navigation
  Pagination,
  // Charts
  BarChart,
  LineChart,
  PieChart,
  FunnelChart,
});
