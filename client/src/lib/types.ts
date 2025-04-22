// Form Data Types
export interface HealthGoalsFormData {
  healthGoals: string[];
  otherGoals: string;
}

export interface LifestyleFormData {
  wakeTime: string;
  sleepTime: string;
  sleepQuality: number;
  stressLevel: number;
  menstrualPhase: string;
  dietPreference: string;
  foodAllergies: string;
}

// API Response Types
export interface SupplementRoutineItem {
  timeOfDay: string;
  supplement: string;
  instructions: string;
  reasoning: string;
  time: string;
}

export interface FoodSuggestion {
  breakfast: string[];
  lunch: string[];
  snacks: string[];
  dinner?: string[]; // Optional to maintain backward compatibility
}

export interface RecommendationResponse {
  supplementRoutine: SupplementRoutineItem[];
  foodSuggestions: FoodSuggestion;
}

// Calendar Options
export interface CalendarOptions {
  reminder15Min: boolean;
  reminderNotification: boolean;
}
