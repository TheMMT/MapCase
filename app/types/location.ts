import { Location } from '@/store/useStore'

export interface ExtendedLocation extends Location {
  isSelected?: boolean;
  distance?: number;
} 