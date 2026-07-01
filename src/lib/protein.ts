export type Gender = "male" | "female";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "athlete";
export type Goal = "maintain" | "lose" | "gain" | "performance";
export type TrainingExperience =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "elite";

export const ACTIVITIES: Activity[] = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "athlete",
];

export const GOALS: Goal[] = ["maintain", "lose", "gain", "performance"];

export const TRAINING_EXPERIENCES: TrainingExperience[] = [
  "beginner",
  "intermediate",
  "advanced",
  "elite",
];

// Maps each activity/goal/training value to its translation key in the "calculator" dictionary slice.
export const ACTIVITY_DICT_KEY: Record<Activity, string> = {
  sedentary: "activitySedentary",
  light: "activityLight",
  moderate: "activityModerate",
  active: "activityActive",
  athlete: "activityAthlete",
};

export const GOAL_DICT_KEY: Record<Goal, string> = {
  maintain: "goalMaintain",
  lose: "goalLose",
  gain: "goalGain",
  performance: "goalPerformance",
};

export const TRAINING_DICT_KEY: Record<TrainingExperience, string> = {
  beginner: "trainingBeginner",
  intermediate: "trainingIntermediate",
  advanced: "trainingAdvanced",
  elite: "trainingElite",
};

// grams of protein per kg adjustment by training experience (added on top of the activity/goal range)
const TRAINING_ADJUSTMENT: Record<TrainingExperience, number> = {
  beginner: -0.1,
  intermediate: 0,
  advanced: 0.1,
  elite: 0.2,
};

const ACTIVITY_MULTIPLIER: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

// grams of protein per kg of bodyweight, by activity level (before goal adjustment)
const BASE_PROTEIN_RANGE: Record<Activity, [number, number]> = {
  sedentary: [0.8, 1.0],
  light: [1.2, 1.4],
  moderate: [1.4, 1.8],
  active: [1.6, 2.0],
  athlete: [1.8, 2.2],
};

export function getProteinPerKgRange(
  activity: Activity,
  goal: Goal,
  trainingExperience: TrainingExperience = "intermediate"
): [number, number] {
  const [base_low, base_high] = BASE_PROTEIN_RANGE[activity];
  let low = base_low;
  let high = base_high;
  if (goal === "lose") {
    low += 0.2;
    high += 0.4;
  } else if (goal === "gain") {
    low += 0.1;
    high += 0.2;
  } else if (goal === "performance") {
    low += 0.3;
    high += 0.3;
  }
  const adjustment = TRAINING_ADJUSTMENT[trainingExperience];
  return [Math.max(0.6, low + adjustment), Math.max(0.8, high + adjustment)];
}

export function calculateProteinRange(
  weightKg: number,
  activity: Activity,
  goal: Goal,
  trainingExperience: TrainingExperience = "intermediate"
): { low: number; high: number } {
  const [low, high] = getProteinPerKgRange(activity, goal, trainingExperience);
  return { low: Math.round(weightKg * low), high: Math.round(weightKg * high) };
}

// Mifflin-St Jeor equation
export function calculateBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activity: Activity): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIER[activity]);
}

export function calculateLeanBodyMass(
  weightKg: number,
  bodyFatPercent: number
): number {
  return weightKg * (1 - bodyFatPercent / 100);
}

// Katch-McArdle equation — more accurate than Mifflin-St Jeor when body fat % is known
export function calculateBMRKatchMcArdle(leanMassKg: number): number {
  return 370 + 21.6 * leanMassKg;
}

export function lbToKg(lb: number): number {
  return lb * 0.453592;
}

export function inToCm(inches: number): number {
  return inches * 2.54;
}

// grams of protein per kg of bodyweight (or lean mass) for the Muscle Building calculator, by training experience
const MUSCLE_PROTEIN_RANGE: Record<TrainingExperience, [number, number]> = {
  beginner: [1.6, 1.8],
  intermediate: [1.8, 2.0],
  advanced: [2.0, 2.2],
  elite: [2.2, 2.5],
};

export function calculateMuscleProtein(
  weightKg: number,
  trainingExperience: TrainingExperience
): { low: number; high: number; recommended: number } {
  const [low, high] = MUSCLE_PROTEIN_RANGE[trainingExperience];
  return {
    low: Math.round(weightKg * low),
    high: Math.round(weightKg * high),
    recommended: Math.round(weightKg * ((low + high) / 2)),
  };
}

export type DeficitSize = "small" | "moderate" | "aggressive";

export const DEFICIT_SIZES: DeficitSize[] = ["small", "moderate", "aggressive"];

export const DEFICIT_DICT_KEY: Record<DeficitSize, string> = {
  small: "deficitSmall",
  moderate: "deficitModerate",
  aggressive: "deficitAggressive",
};

// grams of protein per kg of bodyweight for the Weight Loss calculator, by deficit size
const DEFICIT_PROTEIN_RANGE: Record<DeficitSize, [number, number]> = {
  small: [1.6, 2.0],
  moderate: [1.8, 2.2],
  aggressive: [2.0, 2.4],
};

export function calculateWeightLossProtein(
  currentWeightKg: number,
  goalWeightKg: number | null,
  deficitSize: DeficitSize
): { low: number; high: number; recommended: number; atGoal: number | null } {
  const [low, high] = DEFICIT_PROTEIN_RANGE[deficitSize];
  const mid = (low + high) / 2;
  return {
    low: Math.round(currentWeightKg * low),
    high: Math.round(currentWeightKg * high),
    recommended: Math.round(currentWeightKg * mid),
    atGoal: goalWeightKg ? Math.round(goalWeightKg * mid) : null,
  };
}

export function splitProteinPerMeal(
  dailyTargetG: number,
  meals: number
): { perMeal: number; dailyTotal: number } {
  return { perMeal: Math.round(dailyTargetG / meals), dailyTotal: dailyTargetG };
}
