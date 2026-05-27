import {
  Heart, Star, Zap, Target, Trophy, Flame, Leaf, Moon, Sun, Coffee,
  Dumbbell, BookOpen, Music, Pencil, Code, Globe, Smile, Shield, Clock,
  Droplets, Apple, Bike, Tag, Briefcase, Brain, Users, Palette,
  CheckSquare, LayoutDashboard, BarChart3, Settings, TrendingUp,
  CheckCircle, Download, Trash2, Bell, Plus, ArrowLeft, Edit,
  X, ChevronLeft, ChevronRight, Info, AlertCircle,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Heart, Star, Zap, Target, Trophy, Flame, Leaf, Moon, Sun, Coffee,
  Dumbbell, BookOpen, Music, Pencil, Code, Globe, Smile, Shield, Clock,
  Droplets, Apple, Bike, Tag, Briefcase, Brain, Users, Palette,
  CheckSquare, LayoutDashboard, BarChart3, Settings, TrendingUp,
  CheckCircle, Download, Trash2, Bell, Plus, ArrowLeft, Edit,
  X, ChevronLeft, ChevronRight, Info, AlertCircle,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Star;
}
