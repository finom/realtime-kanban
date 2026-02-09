import z from "zod";
import { createAIComponent } from "../../createAIComponent";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Icon = createAIComponent({
  description:
    "An icon component that renders a Lucide icon by name. Available icons include common ones like: Search, Plus, Minus, X, Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, Settings, User, Users, Mail, Phone, Calendar, Clock, Star, Heart, Trash2, Edit, Eye, EyeOff, Download, Upload, Share, Copy, ExternalLink, Filter, SortAsc, SortDesc, MoreHorizontal, MoreVertical, AlertCircle, Info, CheckCircle2, AlertTriangle, Bell, FileText, Folder, Image, Link, Lock, Unlock, Refresh, Save, Send, ShoppingCart, Tag, TrendingUp, TrendingDown, Inbox, Package, CreditCard, DollarSign, BarChart3, PieChart, Activity, Globe, MapPin, Building2, Briefcase, GraduationCap, Zap, Shield, Key, Database, Server, Code, Terminal, GitBranch, Github, Linkedin, Twitter. See https://lucide.dev/icons for the full list.",
  propDefs: z.strictObject({
    name: z.string().meta({
      description:
        "The Lucide icon name in PascalCase, e.g. 'Search', 'ChevronDown', 'User', 'Trash2', 'MoreHorizontal'",
    }),
    size: z.enum(["sm", "md", "lg", "xl"]).default("md").meta({
      description: "Icon size: sm (16px), md (20px), lg (24px), xl (32px)",
    }),
    color: z.string().optional().meta({
      description:
        "Optional Tailwind text color class without the 'text-' prefix, e.g. 'red-500', 'blue-600', 'muted-foreground'",
    }),
  }),
  render: ({ name, size = "md", color }) => {
    const sizeMap: Record<string, string> = {
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    };
    const IconComponent = (
      LucideIcons as unknown as Record<string, LucideIcon>
    )[name];
    if (!IconComponent) {
      return <span className="text-muted-foreground text-xs">[{name}]</span>;
    }
    return (
      <IconComponent
        className={`${sizeMap[size]} ${color ? `text-${color}` : ""}`}
      />
    );
  },
});
