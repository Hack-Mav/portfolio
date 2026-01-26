/**
 * Icon Library - Tree-shakable icon imports
 * 
 * This file provides centralized icon management with tree-shaking support.
 * Import only the icons you need to minimize bundle size.
 */

// Hero Icons - Individual imports for tree-shaking
import { 
  HiArrowRight,
  HiDownload,
  HiPhone,
  HiLocationMarker,
  HiPaperAirplane,
  HiCode,
  HiBriefcase,
  HiAcademicCap,
  HiExternalLink,
  HiStar,
  HiEye,
  HiMenu,
  HiX,
  HiSun,
  HiMoon,
  HiArrowSmRight,
} from 'react-icons/hi';

// Font Awesome Icons - Individual imports for tree-shaking
import {
  FaGithub,
  FaSearch,
  FaFilter,
  FaSync,
  FaExclamationTriangle,
} from 'react-icons/fa';

// Re-export for tree-shaking
export {
  HiArrowRight,
  HiDownload,
  HiPhone,
  HiLocationMarker,
  HiPaperAirplane,
  HiCode,
  HiBriefcase,
  HiAcademicCap,
  HiExternalLink,
  HiStar,
  HiEye,
  HiMenu,
  HiX,
  HiSun,
  HiMoon,
  HiArrowSmRight,
  FaGithub,
  FaSearch,
  FaFilter,
  FaSync,
  FaExclamationTriangle,
};

// Icon type definitions for better TypeScript support
export type IconType = React.ComponentType<{ className?: string; size?: string | number }>;

// Icon mapping for dynamic usage (with tree-shaking)
export const iconMap = {
  // Hero Icons
  arrowRight: HiArrowRight,
  download: HiDownload,
  phone: HiPhone,
  location: HiLocationMarker,
  paperAirplane: HiPaperAirplane,
  code: HiCode,
  briefcase: HiBriefcase,
  academicCap: HiAcademicCap,
  externalLink: HiExternalLink,
  star: HiStar,
  eye: HiEye,
  menu: HiMenu,
  x: HiX,
  sun: HiSun,
  moon: HiMoon,
  arrowSmRight: HiArrowSmRight,
  
  // Font Awesome Icons
  github: FaGithub,
  search: FaSearch,
  filter: FaFilter,
  sync: FaSync,
  exclamationTriangle: FaExclamationTriangle,
} as const;

export type IconName = keyof typeof iconMap;
