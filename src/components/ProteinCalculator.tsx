"use client";

import { useState } from "react";
import {
  ACTIVITIES,
  ACTIVITY_DICT_KEY,
  DEFICIT_DICT_KEY,
  DEFICIT_SIZES,
  GOALS,
  GOAL_DICT_KEY,
  TRAINING_EXPERIENCES,
  TRAINING_DICT_KEY,
  calculateBMR,
  calculateBMRKatchMcArdle,
  calculateLeanBodyMass,
  calculateMuscleProtein,
  calculateProteinRange,
  calculateTDEE,
  calculateWeightLossProtein,
  getProteinPerKgRange,
  inToCm,
  lbToKg,
  splitProteinPerMeal,
  type Activity,
  type DeficitSize,
  type Gender,
  type Goal,
  type TrainingExperience,
} from "@/lib/protein";
import {
  CheckIcon,
  ClockIcon,
  FlameIcon,
  MuscleIcon,
  ScaleIcon,
  TrendDownIcon,
  TrophyIcon,
  UtensilsIcon,
} from "@/components/icons";
import type { Dictionary } from "@/i18n/get-dictionary";

type WeightUnit = "kg" | "lb";
type HeightUnit = "cm" | "in";
type Tab = "dailyProtein" | "muscleBuilding" | "weightLoss" | "perMeal";

type Result = {
  low: number;
  high: number;
  perKgLow: number;
  perKgHigh: number;
  tdee: number | null;
};

type MuscleResult = { low: number; high: number; recommended: number };

type WeightLossResult = {
  low: number;
  high: number;
  recommended: number;
  atGoal: number | null;
};

type PerMealResult = { perMeal: number; dailyTotal: number };

type CalculatorDict = Dictionary["calculator"];

const TABS: Tab[] = ["dailyProtein", "muscleBuilding", "weightLoss", "perMeal"];

const TAB_DICT_KEY: Record<Tab, string> = {
  dailyProtein: "tabDailyProtein",
  muscleBuilding: "tabMuscleBuilding",
  weightLoss: "tabWeightLoss",
  perMeal: "tabPerMeal",
};

const TAB_ICON: Record<Tab, (props: { className?: string }) => React.ReactElement> = {
  dailyProtein: ClockIcon,
  muscleBuilding: MuscleIcon,
  weightLoss: TrendDownIcon,
  perMeal: UtensilsIcon,
};

const GOAL_ICON: Record<Goal, (props: { className?: string }) => React.ReactElement> = {
  lose: FlameIcon,
  maintain: ScaleIcon,
  gain: MuscleIcon,
  performance: TrophyIcon,
};

const PER_MEAL_MEAL_OPTIONS = [3, 4, 5, 6];
const FIXED_MEALS = 4;

const INPUT_CLASS =
  "w-full rounded-lg border border-stone-300 px-4 py-2.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-red focus:border-transparent";
const INPUT_CLASS_NARROW =
  "min-w-0 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-red focus:border-transparent";
const LABEL_CLASS = "block text-sm font-medium text-stone-700 mb-2";

function toggleClass(active: boolean) {
  return `rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
    active
      ? "bg-red text-white border-red"
      : "bg-white text-stone-600 border-stone-300 hover:bg-cream-dark"
  }`;
}

function pillClass(active: boolean) {
  return `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
    active
      ? "border-red bg-red text-white"
      : "border-stone-300 text-stone-600 hover:bg-cream-dark"
  }`;
}

function fill(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (str, [key, value]) => str.replace(`{${key}}`, String(value)),
    template
  );
}

function WeightUnitInput({
  value,
  onChange,
  unit,
  onUnitChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: WeightUnit;
  onUnitChange: (u: WeightUnit) => void;
  placeholder: string;
}) {
  return (
    <div className="flex gap-2">
      <input
        type="number"
        inputMode="decimal"
        min="1"
        step="0.1"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 ${INPUT_CLASS}`}
      />
      <div className="flex rounded-lg border border-stone-300 overflow-hidden">
        {(["kg", "lb"] as WeightUnit[]).map((u) => (
          <button
            type="button"
            key={u}
            onClick={() => onUnitChange(u)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              unit === u
                ? "bg-red text-white"
                : "bg-white text-stone-600 hover:bg-cream-dark"
            }`}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultShell({
  dict,
  badge,
  title,
  bigValue,
  bigUnit,
  rangeText,
  low,
  high,
  recommended,
  detailRows,
  statGrid,
  notes,
  onRecalculate,
  showMinMax = true,
}: {
  dict: CalculatorDict;
  badge: string;
  title: string;
  bigValue: number;
  bigUnit: string;
  rangeText: string;
  low: number;
  high: number;
  recommended: number;
  detailRows: { label: string; value: string }[];
  statGrid: { label: string; value: string }[];
  notes: { tone: "green" | "amber"; text: string }[];
  onRecalculate: () => void;
  showMinMax?: boolean;
}) {
  return (
    <div className="mt-8 rounded-3xl bg-white shadow-2xl shadow-charcoal/10 border border-stone-100 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-charcoal">{dict.resultsHeading}</h2>
        <span className="rounded-full bg-red-soft/60 text-red text-xs font-semibold px-3 py-1">
          {badge}
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-gradient-to-br from-red to-red-deep text-white p-6 text-center">
        <p className="text-sm text-white/80 font-medium">{title}</p>
        <p className="mt-1">
          <span className="text-4xl font-bold">{bigValue}</span>
          <span className="text-lg font-medium ms-1">{bigUnit}</span>
        </p>
        <p className="text-sm text-white/80 mt-2">{rangeText}</p>
      </div>

      {showMinMax && (
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-stone-500">{dict.minimum}</p>
            <p className="text-lg font-semibold text-charcoal">{low}g</p>
          </div>
          <div>
            <p className="text-xs text-stone-500">{dict.recommended}</p>
            <p className="text-lg font-semibold text-charcoal">{recommended}g</p>
          </div>
          <div>
            <p className="text-xs text-stone-500">{dict.maximum}</p>
            <p className="text-lg font-semibold text-charcoal">{high}g</p>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-2 text-sm">
        {detailRows.map((row) => (
          <div key={row.label} className="flex flex-wrap justify-between gap-x-4">
            <span className="text-stone-600">{row.label}</span>
            <span className="font-semibold text-charcoal">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statGrid.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-white border border-red/15 px-3 py-2"
          >
            <p className="text-xs text-stone-500">{stat.label}</p>
            <p className="text-sm font-semibold text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      {notes.map((note) => (
        <p
          key={note.text}
          className={`mt-4 rounded-xl border p-3 text-sm ${
            note.tone === "green"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {note.text}
        </p>
      ))}

      <button
        type="button"
        onClick={onRecalculate}
        className="mt-5 rounded-full border border-stone-300 bg-white text-stone-600 text-sm font-medium px-5 py-2 hover:bg-cream-dark transition-colors"
      >
        {dict.recalculate}
      </button>
    </div>
  );
}

export default function ProteinCalculator({ dict }: { dict: CalculatorDict }) {
  const [activeTab, setActiveTab] = useState<Tab>("dailyProtein");

  // Daily Protein tab
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [trainingExperience, setTrainingExperience] =
    useState<TrainingExperience>("intermediate");
  const [includeBodyFat, setIncludeBodyFat] = useState(false);
  const [bodyFatPercent, setBodyFatPercent] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  // Muscle Building tab
  const [muscleWeight, setMuscleWeight] = useState("");
  const [muscleWeightUnit, setMuscleWeightUnit] = useState<WeightUnit>("kg");
  const [muscleTraining, setMuscleTraining] =
    useState<TrainingExperience>("beginner");
  const [useLeanMass, setUseLeanMass] = useState(false);
  const [muscleBodyFat, setMuscleBodyFat] = useState("");
  const [muscleResult, setMuscleResult] = useState<MuscleResult | null>(null);

  // Weight Loss tab
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentWeightUnit, setCurrentWeightUnit] = useState<WeightUnit>("kg");
  const [goalWeight, setGoalWeight] = useState("");
  const [deficitSize, setDeficitSize] = useState<DeficitSize>("moderate");
  const [weightLossResult, setWeightLossResult] =
    useState<WeightLossResult | null>(null);

  // Per Meal tab
  const [dailyTarget, setDailyTarget] = useState("");
  const [perMealMeals, setPerMealMeals] = useState(4);
  const [perMealResult, setPerMealResult] = useState<PerMealResult | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const rawWeight = parseFloat(weight);
    if (!rawWeight || rawWeight <= 0) {
      setResult(null);
      return;
    }
    const weightKg = weightUnit === "kg" ? rawWeight : lbToKg(rawWeight);

    const { low, high } = calculateProteinRange(
      weightKg,
      activity,
      goal,
      trainingExperience
    );
    const [perKgLow, perKgHigh] = getProteinPerKgRange(
      activity,
      goal,
      trainingExperience
    );

    const rawAge = parseFloat(age);
    const rawHeight = parseFloat(height);
    const rawBodyFat = parseFloat(bodyFatPercent);
    let tdee: number | null = null;
    if (rawAge > 0 && rawHeight > 0) {
      const heightCm = heightUnit === "cm" ? rawHeight : inToCm(rawHeight);
      const bmr =
        includeBodyFat && rawBodyFat > 0 && rawBodyFat < 60
          ? calculateBMRKatchMcArdle(calculateLeanBodyMass(weightKg, rawBodyFat))
          : calculateBMR(gender, weightKg, heightCm, rawAge);
      tdee = calculateTDEE(bmr, activity);
    }

    setResult({ low, high, perKgLow, perKgHigh, tdee });
    setCopied(false);
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(
      `${result.low}–${result.high} g — ${dict.resultTitle}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCalculateMuscle(e: React.FormEvent) {
    e.preventDefault();
    const rawWeight = parseFloat(muscleWeight);
    if (!rawWeight || rawWeight <= 0) {
      setMuscleResult(null);
      return;
    }
    let weightKg = muscleWeightUnit === "kg" ? rawWeight : lbToKg(rawWeight);
    const rawBodyFat = parseFloat(muscleBodyFat);
    if (useLeanMass && rawBodyFat > 0 && rawBodyFat < 60) {
      weightKg = calculateLeanBodyMass(weightKg, rawBodyFat);
    }
    setMuscleResult(calculateMuscleProtein(weightKg, muscleTraining));
  }

  function handleCalculateWeightLoss(e: React.FormEvent) {
    e.preventDefault();
    const rawCurrent = parseFloat(currentWeight);
    if (!rawCurrent || rawCurrent <= 0) {
      setWeightLossResult(null);
      return;
    }
    const currentKg =
      currentWeightUnit === "kg" ? rawCurrent : lbToKg(rawCurrent);
    const rawGoal = parseFloat(goalWeight);
    const goalKg =
      rawGoal > 0
        ? currentWeightUnit === "kg"
          ? rawGoal
          : lbToKg(rawGoal)
        : null;
    setWeightLossResult(
      calculateWeightLossProtein(currentKg, goalKg, deficitSize)
    );
  }

  function handleCalculatePerMeal(e: React.FormEvent) {
    e.preventDefault();
    const rawTarget = parseFloat(dailyTarget);
    if (!rawTarget || rawTarget <= 0) {
      setPerMealResult(null);
      return;
    }
    setPerMealResult(splitProteinPerMeal(rawTarget, perMealMeals));
  }

  const showPerMealPrimary = activeTab === "perMeal";
  const primaryLabel = showPerMealPrimary ? dict.perMeal : dict.resultTitle;
  const primaryLow =
    result && showPerMealPrimary ? Math.round(result.low / 4) : result?.low;
  const primaryHigh =
    result && showPerMealPrimary ? Math.round(result.high / 4) : result?.high;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          {dict.quickReference.heading}
        </p>
        <ul className="mt-3 space-y-2 text-sm text-blue-900">
          {[
            dict.quickReference.general,
            dict.quickReference.weightLoss,
            dict.quickReference.muscleGain,
            dict.quickReference.performance,
            dict.quickReference.spread,
          ].map((line) => (
            <li key={line} className="flex items-start gap-2">
              <CheckIcon className="size-4 mt-0.5 shrink-0 text-blue-600" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-3xl bg-white shadow-2xl shadow-charcoal/10 border border-stone-100 p-6 sm:p-8">
        <div>
          <h2 className="text-xl font-bold text-charcoal">
            {dict.detailsHeading}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {dict.detailsSubheading}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-cream-dark p-1.5">
          {TABS.map((tab) => {
            const Icon = TAB_ICON[tab];
            return (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white shadow-sm text-charcoal"
                    : "text-stone-500 hover:text-charcoal"
                }`}
              >
                <Icon className="size-4" />
                {dict[TAB_DICT_KEY[tab] as keyof CalculatorDict] as string}
              </button>
            );
          })}
        </div>

        {activeTab === "dailyProtein" && (
          <form onSubmit={handleCalculate} className="mt-6 space-y-5">
            <div>
              <label className={LABEL_CLASS}>{dict.gender}</label>
              <div className="grid grid-cols-2 gap-2">
                {(["male", "female"] as Gender[]).map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGender(g)}
                    className={toggleClass(gender === g)}
                  >
                    {g === "male" ? dict.male : dict.female}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[2fr_3fr] gap-4">
              <div>
                <label className={LABEL_CLASS}>{dict.age}</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={dict.agePlaceholder}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>{dict.height}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    min="1"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={
                      heightUnit === "cm"
                        ? dict.heightPlaceholderCm
                        : dict.heightPlaceholderIn
                    }
                    className={`flex-1 ${INPUT_CLASS_NARROW}`}
                  />
                  <div className="flex rounded-lg border border-stone-300 overflow-hidden shrink-0">
                    {(["cm", "in"] as HeightUnit[]).map((u) => (
                      <button
                        type="button"
                        key={u}
                        onClick={() => setHeightUnit(u)}
                        className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                          heightUnit === u
                            ? "bg-red text-white"
                            : "bg-white text-stone-600 hover:bg-cream-dark"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS}>{dict.weight}</label>
              <WeightUnitInput
                value={weight}
                onChange={setWeight}
                unit={weightUnit}
                onUnitChange={setWeightUnit}
                placeholder={dict.weightPlaceholder}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>{dict.activityLevel}</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as Activity)}
                className={INPUT_CLASS}
              >
                {ACTIVITIES.map((a) => (
                  <option key={a} value={a}>
                    {dict[ACTIVITY_DICT_KEY[a] as keyof CalculatorDict] as string}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL_CLASS}>{dict.goal}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {GOALS.map((g) => {
                  const Icon = GOAL_ICON[g];
                  const active = goal === g;
                  return (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-sm font-medium transition-colors ${
                        active
                          ? "border-red bg-red-soft/40 text-charcoal"
                          : "border-stone-300 text-stone-600 hover:bg-cream-dark"
                      }`}
                    >
                      {active && (
                        <span className="absolute -top-2 -end-2 flex items-center justify-center size-5 rounded-full bg-red text-white">
                          <CheckIcon className="size-3" />
                        </span>
                      )}
                      <Icon
                        className={`size-6 ${
                          active ? "text-red" : "text-stone-400"
                        }`}
                      />
                      {dict[GOAL_DICT_KEY[g] as keyof CalculatorDict] as string}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS}>{dict.trainingExperience}</label>
              <div className="flex flex-wrap gap-2">
                {TRAINING_EXPERIENCES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTrainingExperience(t)}
                    className={pillClass(trainingExperience === t)}
                  >
                    {dict[TRAINING_DICT_KEY[t] as keyof CalculatorDict] as string}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={includeBodyFat}
                  onChange={(e) => setIncludeBodyFat(e.target.checked)}
                  className="size-4 rounded border-stone-300 text-red focus:ring-red"
                />
                {dict.bodyFatLabel}
                <span className="rounded-full bg-cream-dark px-2 py-0.5 text-xs text-stone-500">
                  {dict.bodyFatHint}
                </span>
              </label>
              {includeBodyFat && (
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  max="60"
                  step="0.1"
                  value={bodyFatPercent}
                  onChange={(e) => setBodyFatPercent(e.target.value)}
                  placeholder={dict.bodyFatPlaceholder}
                  className={`${INPUT_CLASS} mt-2`}
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red text-white font-semibold py-3.5 shadow-lg shadow-red/30 hover:bg-red-deep hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {dict.submit}
            </button>
          </form>
        )}

        {activeTab === "muscleBuilding" && (
          <form onSubmit={handleCalculateMuscle} className="mt-6 space-y-5">
            <div>
              <label className={LABEL_CLASS}>
                {dict.weightLabel} <span className="text-red">*</span>
              </label>
              <WeightUnitInput
                value={muscleWeight}
                onChange={setMuscleWeight}
                unit={muscleWeightUnit}
                onUnitChange={setMuscleWeightUnit}
                placeholder={dict.weightPlaceholder}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>{dict.trainingExperience}</label>
              <div className="flex flex-wrap gap-2">
                {TRAINING_EXPERIENCES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setMuscleTraining(t)}
                    className={pillClass(muscleTraining === t)}
                  >
                    {dict[TRAINING_DICT_KEY[t] as keyof CalculatorDict] as string}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={useLeanMass}
                  onChange={(e) => setUseLeanMass(e.target.checked)}
                  className="size-4 rounded border-stone-300 text-red focus:ring-red"
                />
                {dict.muscle.useLeanMass}
                <span className="rounded-full bg-cream-dark px-2 py-0.5 text-xs text-stone-500">
                  {dict.muscle.useLeanMassHint}
                </span>
              </label>
              {useLeanMass && (
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  max="60"
                  step="0.1"
                  value={muscleBodyFat}
                  onChange={(e) => setMuscleBodyFat(e.target.value)}
                  placeholder={dict.muscle.bodyFatPlaceholder}
                  className={`${INPUT_CLASS} mt-2`}
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red text-white font-semibold py-3.5 shadow-lg shadow-red/30 hover:bg-red-deep hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {dict.muscle.submit}
            </button>
          </form>
        )}

        {activeTab === "weightLoss" && (
          <form onSubmit={handleCalculateWeightLoss} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>
                  {dict.weightLoss.currentWeight}{" "}
                  <span className="text-red">*</span>
                </label>
                <WeightUnitInput
                  value={currentWeight}
                  onChange={setCurrentWeight}
                  unit={currentWeightUnit}
                  onUnitChange={setCurrentWeightUnit}
                  placeholder={dict.weightPlaceholder}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>{dict.weightLoss.goalWeight}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    min="1"
                    step="0.1"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    placeholder={dict.weightPlaceholder}
                    className={`flex-1 ${INPUT_CLASS}`}
                  />
                  <span className="flex items-center rounded-lg border border-stone-300 bg-cream-dark px-4 text-sm font-medium text-stone-600">
                    {currentWeightUnit}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-stone-500">
                  {dict.weightLoss.goalWeightHint}
                </p>
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS}>{dict.weightLoss.deficitSize}</label>
              <div className="flex flex-wrap gap-2">
                {DEFICIT_SIZES.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDeficitSize(d)}
                    className={pillClass(deficitSize === d)}
                  >
                    {
                      dict.weightLoss[
                        DEFICIT_DICT_KEY[d] as keyof CalculatorDict["weightLoss"]
                      ]
                    }
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red text-white font-semibold py-3.5 shadow-lg shadow-red/30 hover:bg-red-deep hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {dict.weightLoss.submit}
            </button>
          </form>
        )}

        {activeTab === "perMeal" && (
          <form onSubmit={handleCalculatePerMeal} className="mt-6 space-y-5">
            <div>
              <label className={LABEL_CLASS}>{dict.perMealTab.targetLabel}</label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                required
                value={dailyTarget}
                onChange={(e) => setDailyTarget(e.target.value)}
                className={INPUT_CLASS}
              />
              <p className="mt-1.5 text-xs text-stone-500">
                {dict.perMealTab.targetHint}
              </p>
            </div>

            <div>
              <label className={LABEL_CLASS}>{dict.mealsPerDay}</label>
              <div className="flex flex-wrap gap-2">
                {PER_MEAL_MEAL_OPTIONS.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setPerMealMeals(m)}
                    className={pillClass(perMealMeals === m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red text-white font-semibold py-3.5 shadow-lg shadow-red/30 hover:bg-red-deep hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {dict.perMealTab.submit}
            </button>
          </form>
        )}

        {activeTab === "dailyProtein" && result && (
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-red-soft/60 to-white border border-red/15 p-5 text-center">
            <p className="text-sm text-charcoal/70 font-medium">{primaryLabel}</p>
            <p className="text-4xl font-bold text-charcoal mt-1">
              {primaryLow}–{primaryHigh} g
            </p>
            <p className="text-sm text-stone-600 mt-2">{dict.resultNote}</p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-white border border-red/15 px-3 py-2">
                <p className="text-xs text-stone-500">{dict.perKg}</p>
                <p className="text-sm font-semibold text-charcoal">
                  {result.perKgLow.toFixed(1)}–{result.perKgHigh.toFixed(1)} g/kg
                </p>
              </div>
              <div className="rounded-lg bg-white border border-red/15 px-3 py-2">
                <p className="text-xs text-stone-500">{dict.perMeal}</p>
                <p className="text-sm font-semibold text-charcoal">
                  {Math.round(result.low / 4)}–{Math.round(result.high / 4)} g
                </p>
              </div>
              <div className="rounded-lg bg-white border border-red/15 px-3 py-2">
                <p className="text-xs text-stone-500">{dict.calories}</p>
                <p className="text-sm font-semibold text-charcoal">
                  {result.tdee
                    ? `${result.tdee.toLocaleString()} kcal`
                    : dict.addAgeHeight}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 rounded-full border border-red bg-white text-red text-sm font-medium px-5 py-2 hover:bg-red-soft transition-colors"
            >
              {copied ? dict.copied : dict.copyResult}
            </button>
          </div>
        )}
      </div>

      {activeTab === "muscleBuilding" && muscleResult && (
        <ResultShell
          dict={dict}
          badge={dict.tabMuscleBuilding}
          title={dict.muscle.resultTitle}
          bigValue={muscleResult.recommended}
          bigUnit="g/day"
          rangeText={fill(dict.rangeLabel, {
            low: muscleResult.low,
            high: muscleResult.high,
          })}
          low={muscleResult.low}
          high={muscleResult.high}
          recommended={muscleResult.recommended}
          detailRows={[
            {
              label: dict.trainingExperience,
              value: dict[
                TRAINING_DICT_KEY[muscleTraining] as keyof CalculatorDict
              ] as string,
            },
            {
              label: dict.weightLabel,
              value: `${muscleWeight} ${muscleWeightUnit}`,
            },
          ]}
          statGrid={[
            {
              label: fill(dict.perMealLabel, { n: FIXED_MEALS }),
              value: `${Math.round(muscleResult.recommended / FIXED_MEALS)}g`,
            },
            { label: dict.mealsPerDay, value: String(FIXED_MEALS) },
            {
              label: dict.weightLabel,
              value: `${muscleWeight}${muscleWeightUnit}`,
            },
          ]}
          notes={[{ tone: "green", text: dict.muscle.note }]}
          onRecalculate={() => setMuscleResult(null)}
        />
      )}

      {activeTab === "weightLoss" && weightLossResult && (
        <ResultShell
          dict={dict}
          badge={dict.tabWeightLoss}
          title={dict.weightLoss.resultTitle}
          bigValue={weightLossResult.recommended}
          bigUnit="g/day"
          rangeText={fill(dict.rangeLabel, {
            low: weightLossResult.low,
            high: weightLossResult.high,
          })}
          low={weightLossResult.low}
          high={weightLossResult.high}
          recommended={weightLossResult.recommended}
          detailRows={[
            {
              label: dict.weightLoss.atCurrentWeight,
              value: `${weightLossResult.recommended} g/day`,
            },
            ...(weightLossResult.atGoal !== null
              ? [
                  {
                    label: dict.weightLoss.atGoalWeight,
                    value: `${weightLossResult.atGoal} g/day`,
                  },
                ]
              : []),
            {
              label: dict.weightLoss.deficitSize,
              value:
                dict.weightLoss[
                  DEFICIT_DICT_KEY[
                    deficitSize
                  ] as keyof CalculatorDict["weightLoss"]
                ],
            },
          ]}
          statGrid={[
            {
              label: dict.weightLoss.atCurrentWeight,
              value: `${weightLossResult.recommended}g`,
            },
            ...(weightLossResult.atGoal !== null
              ? [
                  {
                    label: dict.weightLoss.atGoalWeight,
                    value: `${weightLossResult.atGoal}g`,
                  },
                ]
              : []),
            {
              label: fill(dict.perMealLabel, { n: FIXED_MEALS }),
              value: `${Math.round(
                weightLossResult.recommended / FIXED_MEALS
              )}g`,
            },
            { label: dict.mealsPerDay, value: String(FIXED_MEALS) },
          ]}
          notes={[
            {
              tone: "green",
              text:
                weightLossResult.atGoal !== null
                  ? fill(dict.weightLoss.note, {
                      current: weightLossResult.recommended,
                      goal: weightLossResult.atGoal,
                    })
                  : fill(dict.weightLoss.noteNoGoal, {
                      current: weightLossResult.recommended,
                    }),
            },
            { tone: "amber", text: dict.weightLoss.recalcWarning },
          ]}
          onRecalculate={() => setWeightLossResult(null)}
        />
      )}

      {activeTab === "perMeal" && perMealResult && (
        <ResultShell
          dict={dict}
          badge={dict.tabPerMeal}
          title={dict.perMealTab.resultTitle}
          bigValue={perMealResult.perMeal}
          bigUnit="g"
          rangeText={fill(dict.perMealTab.dailyTotal, {
            total: perMealResult.dailyTotal,
          })}
          low={perMealResult.perMeal}
          high={perMealResult.perMeal}
          recommended={perMealResult.perMeal}
          detailRows={[
            {
              label: dict.perMealTab.dailyTotalLabel,
              value: `${perMealResult.dailyTotal} g`,
            },
            { label: dict.mealsPerDay, value: String(perMealMeals) },
          ]}
          statGrid={[
            {
              label: fill(dict.perMealLabel, { n: perMealMeals }),
              value: `${perMealResult.perMeal}g`,
            },
            {
              label: dict.perMealTab.dailyTotalLabel,
              value: `${perMealResult.dailyTotal}g`,
            },
            { label: dict.mealsPerDay, value: String(perMealMeals) },
          ]}
          notes={[
            {
              tone: "green",
              text: fill(dict.perMealTab.note, {
                perMeal: perMealResult.perMeal,
                meals: perMealMeals,
                total: perMealResult.dailyTotal,
              }),
            },
          ]}
          onRecalculate={() => setPerMealResult(null)}
          showMinMax={false}
        />
      )}
    </div>
  );
}
