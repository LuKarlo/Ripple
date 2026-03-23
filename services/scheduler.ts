import { eventStructure, rangeTimeType } from "@/constants/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// ─── Validazione ──────────────────────────────────────────────────

export type TimeValidationError = {
  field: "start.hour" | "start.minutes" | "end.hour" | "end.minutes";
  message: string;
};

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: TimeValidationError[] };

export function validateRange(range: rangeTimeType): ValidationResult {
  const errors: TimeValidationError[] = [];

  const startHour = parseInt(range.start.hour, 10);
  const startMin = parseInt(range.start.minutes, 10);
  const endHour = parseInt(range.end.hour, 10);
  const endMin = parseInt(range.end.minutes, 10);

  if (isNaN(startHour) || range.start.hour.trim() === "") {
    errors.push({
      field: "start.hour",
      message: "L'ora di inizio non è valida",
    });
  } else if (startHour < 0 || startHour > 23) {
    errors.push({
      field: "start.hour",
      message: "L'ora di inizio deve essere tra 0 e 23",
    });
  }

  if (isNaN(startMin) || range.start.minutes.trim() === "") {
    errors.push({
      field: "start.minutes",
      message: "I minuti di inizio non sono validi",
    });
  } else if (startMin < 0 || startMin > 59) {
    errors.push({
      field: "start.minutes",
      message: "I minuti di inizio devono essere tra 0 e 59",
    });
  }

  if (isNaN(endHour) || range.end.hour.trim() === "") {
    errors.push({ field: "end.hour", message: "L'ora di fine non è valida" });
  } else if (endHour < 0 || endHour > 23) {
    errors.push({
      field: "end.hour",
      message: "L'ora di fine deve essere tra 0 e 23",
    });
  }

  if (isNaN(endMin) || range.end.minutes.trim() === "") {
    errors.push({
      field: "end.minutes",
      message: "I minuti di fine non sono validi",
    });
  } else if (endMin < 0 || endMin > 59) {
    errors.push({
      field: "end.minutes",
      message: "I minuti di fine devono essere tra 0 e 59",
    });
  }

  if (errors.length > 0) return { valid: false, errors };

  if (startHour === endHour && startMin === endMin) {
    errors.push({
      field: "end.hour",
      message: "L'orario di inizio e fine non possono essere uguali",
    });
    return { valid: false, errors };
  }

  return { valid: true };
}

// ─── Utility ─────────────────────────────────────────────────────

function toMinutes(hour: string, minutes: string): number {
  return parseInt(hour, 10) * 60 + parseInt(minutes, 10);
}

export function isCrossmidnight(range: rangeTimeType): boolean {
  const startTotal = toMinutes(range.start.hour, range.start.minutes);
  const endTotal = toMinutes(range.end.hour, range.end.minutes);
  return endTotal < startTotal;
}

// ─── Randomizzazione ──────────────────────────────────────────────

function randomMinuteInRange(range: rangeTimeType): number {
  const startTotal = toMinutes(range.start.hour, range.start.minutes);
  const endTotal = toMinutes(range.end.hour, range.end.minutes);

  if (!isCrossmidnight(range)) {
    const delta = endTotal - startTotal;
    return startTotal + Math.floor(Math.random() * delta);
  } else {
    const minutesUntilMidnight = 1440 - startTotal;
    const minutesAfterMidnight = endTotal;
    const delta = minutesUntilMidnight + minutesAfterMidnight;
    const random = Math.floor(Math.random() * delta);

    if (random < minutesUntilMidnight) {
      return startTotal + random;
    } else {
      return random - minutesUntilMidnight;
    }
  }
}

export type ScheduledEvent = {
  event: eventStructure;
  hour: number;
  minutes: number;
  crossesMidnight: boolean;
};

export type ScheduledEventRecord = {
  eventTitle: string;
  hour: string;
  minutes: string;
  crossesMidnight: boolean;
  scheduledAt: number;
};

export function randomizeEvents(
  events: eventStructure[],
  range: rangeTimeType,
): ScheduledEvent[] {
  const startTotal = toMinutes(range.start.hour, range.start.minutes);
  const crossMidnight = isCrossmidnight(range);

  return events.map((event) => {
    const totalMinutes = randomMinuteInRange(range);
    const hour = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const crossesMidnight = crossMidnight && totalMinutes < startTotal;

    return { event, hour, minutes, crossesMidnight };
  });
}

// ─── Setup notifiche ─────────────────────────────────────────────

export async function setupNotifications(): Promise<void> {
  if (Platform.OS !== "web") {
    await Notifications.setNotificationCategoryAsync("EVENT_RESPONSE", [
      {
        identifier: "YES",
        buttonTitle: "Sì ✓",
        options: { isDestructive: false, isAuthenticationRequired: false },
      },
      {
        identifier: "NO",
        buttonTitle: "No ✗",
        options: { isDestructive: true, isAuthenticationRequired: false },
      },
    ]);
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ─── Scheduling ───────────────────────────────────────────────────

export async function scheduleAllEvents(
  events: eventStructure[],
  range: rangeTimeType,
): Promise<void> {
  const validation = validateRange(range);
  if (!validation.valid) {
    console.warn("Range non valido, scheduling annullato:", validation.errors);
    return;
  }

  if (events.length === 0) {
    console.warn("Nessun evento da schedulare");
    return;
  }

  const scheduled = randomizeEvents(events, range);

  // Sceglie quanti eventi schedulare: numero casuale tra 1 e il totale
  const count = Math.floor(Math.random() * scheduled.length) + 1;

  // Mescola e prende i primi `count` elementi
  const shuffled = [...scheduled].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  console.log(`🎲 Selezionati ${count} eventi su ${scheduled.length}`);

  // Costruisce i record, li logga e li salva in AsyncStorage
  const records: ScheduledEventRecord[] = selected.map((item) => {
    const hourStr = String(item.hour).padStart(2, "0");
    const minStr = String(item.minutes).padStart(2, "0");
    const label = item.crossesMidnight ? " (domani)" : "";

    console.log(`📅 "${item.event.title}" → ${hourStr}:${minStr}${label}`);

    return {
      eventTitle: item.event.title,
      hour: hourStr,
      minutes: minStr,
      crossesMidnight: item.crossesMidnight,
      scheduledAt: Date.now(),
    };
  });

  try {
    await AsyncStorage.setItem("scheduledEvents", JSON.stringify(records));
    console.log("✅ Orari salvati in AsyncStorage:", records);
  } catch (error) {
    console.error("Errore salvataggio orari:", error);
  }

  // Su web ci fermiamo qui
  if (Platform.OS === "web") {
    console.log(
      "ℹ️ Web: scheduling notifiche non supportato, orari solo calcolati e salvati",
    );
    return;
  }

  // Su nativo procede con lo scheduling reale
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.warn("Permesso notifiche negato");
    return;
  }

  await cancelAllNotifications();

  for (const item of selected) {
    const trigger = new Date();

    if (item.crossesMidnight) {
      trigger.setDate(trigger.getDate() + 1);
    }

    trigger.setHours(item.hour, item.minutes, 0, 0);

    if (trigger.getTime() <= Date.now() && !item.crossesMidnight) {
      console.log(`⏩ Orario già passato per "${item.event.title}", salto`);
      continue;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: item.event.title,
        body: item.event.notes || "È il momento!",
        categoryIdentifier: "EVENT_RESPONSE",
        data: { eventTitle: item.event.title },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    });
  }
}

// ─── Background task ──────────────────────────────────────────────

export const BACKGROUND_TASK_NAME = "RIPPLE_MIDNIGHT_RANDOMIZE";

export async function runMidnightScheduling(
  events: eventStructure[],
  range: rangeTimeType,
): Promise<void> {
  console.log("Background task avviato: randomizzazione di mezzanotte");
  await scheduleAllEvents(events, range);
}
