import { useEffect, useState } from "react";
import {
  alertType,
  eventStructure,
  rangeTimeType,
  EventResponse,
} from "@/constants/type";
import { AlertData } from "./components/alert";
import AlertComponent from "./components/alert";
import TimeShow from "./components/timeShow";
import { FaPlus } from "react-icons/fa6";
import { TbSettings2 } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AiOutlineDelete } from "react-icons/ai";
import { FaLongArrowAltRight } from "react-icons/fa";
import * as Notifications from "expo-notifications";
import { scheduleAllEvents, setupNotifications } from "@/services/scheduler";
import "@/app/styles/theme.css";
import "@/app/styles/index.css";
import ProgressBar from "./components/progressBar";
import "@/app/styles/progress.css";

type ThemeName = "claude" | "light" | "dark" | "monochrome" | "mint" | "ocean";

const THEME_LABELS: Record<ThemeName, string> = {
  claude: "Claude (default)",
  light: "Chiaro",
  dark: "Scuro",
  monochrome: "Monocromatico",
  mint: "Mint",
  ocean: "Ocean",
};

export default function Main() {
  const [alertData, setAlertData] = useState<AlertData>({
    message: "",
    type: alertType.time,
  });

  const [theme, setTheme] = useState<ThemeName>("claude");

  const handleThemeChange = async (value: ThemeName) => {
    setTheme(value);
    await AsyncStorage.setItem("theme", value);
  };

  const fillInitialTheme = async () => {
    const stored = await AsyncStorage.getItem("theme");
    if (stored) setTheme(stored as ThemeName);
  };

  const setMessageBanner = async (message: string | null = null) => {
    if (message === null) {
      if (Math.random() * 100 < 5) {
        const mockMessage = [
          "Pensa giocare a LoL da più di 3 anni e fare comunque schifo",
          "Si ricorda che dopo l'università si diventa disoccupati",
          "Quasta si chiama veraviggia, che mi piglia e scompiglia?, ha il sapore do sole, a o colore do mare, quando mi calo mi sento tutto priato perchè mi laccia senza ciato :(",
          "Palermo capitale è dirato di meno di Napoli merda",
          "Lo sapevi che un giorno un Romani disse 'V'. Lo so è scioccante",
          "Pantheon essere tipo w > q > e > asta la vista",
          "La gente ha ancora il dubbio ma è molto probabile che quando si parla con un terrone il cervello c'è l'hanno nel ginocchio",
        ];

        setAlertData({
          type: alertType.mock,
          message:
            mockMessage[Math.round(Math.random() * (mockMessage.length - 1))],
        });
      } else {
        const rangeData = await AsyncStorage.getItem("rangeTime");
        const range = rangeData ? JSON.parse(rangeData) : null;
        setAlertData({
          type: alertType.time,
          message: range
            ? `Gli eventi saranno selezionati tra le ${range.start.hour}:${range.start.minutes} e ${range.end.hour}:${range.end.minutes}`
            : "Imposta il range orario nelle impostazioni",
        });
      }
    }
  };

  const [events, setEvents] = useState<Array<eventStructure>>([]);
  const [eventCreation, setEventCreation] = useState<boolean>(false);
  const [formData, setFormData] = useState<eventStructure>({
    title: "",
    notes: "",
  });

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEventsList = [...events, formData];
    setEvents(newEventsList);
    setEventCreation(false);
    setFormData({ title: "", notes: "" });

    try {
      const storedData = await AsyncStorage.getItem("events");
      const currentStorageEvents = storedData ? JSON.parse(storedData) : [];
      const updatedStorage = [...currentStorageEvents, formData];
      await AsyncStorage.setItem("events", JSON.stringify(updatedStorage));
    } catch (error) {
      console.error("Errore durante il salvataggio su AsyncStorage:", error);
    }
  };

  const deleteEvent = async (index: number) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
    try {
      await AsyncStorage.setItem("events", JSON.stringify(updatedEvents));
    } catch (error) {
      console.error("Errore durante la rimozione:", error);
    }
  };

  const fillInitialEvents = async () => {
    const storedData = await AsyncStorage.getItem("events");
    const currentStorageEvents = storedData ? JSON.parse(storedData) : [];
    setEvents(currentStorageEvents);
  };

  const [settingSidebar, setSettingSidebar] = useState<boolean>(false);

  const [rangeTime, setRangeTime] = useState<rangeTimeType>({
    start: { hour: "00", minutes: "00" },
    end: { hour: "23", minutes: "59" },
  });

  const handleRangeBlur = (
    field: "start" | "end",
    unit: "hour" | "minutes",
  ) => {
    const value = rangeTime[field][unit];

    if (value === "" || value === "0") {
      setRangeTime((prev) => ({
        ...prev,
        [field]: { ...prev[field], [unit]: "00" },
      }));
      return;
    }

    if (value.length === 1) {
      const padded = value.padStart(2, "0");
      setRangeTime((prev) => ({
        ...prev,
        [field]: { ...prev[field], [unit]: padded },
      }));
      AsyncStorage.setItem(
        "rangeTime",
        JSON.stringify({
          ...rangeTime,
          [field]: { ...rangeTime[field], [unit]: padded },
        }),
      );
    }
  };

  const handleRangeChange = (
    field: "start" | "end",
    unit: "hour" | "minutes",
    value: string,
  ) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 2) return;

    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      if (unit === "hour" && num > 23) return;
      if (unit === "minutes" && num > 59) return;
    }

    setRangeTime((prev) => ({
      ...prev,
      [field]: { ...prev[field], [unit]: value },
    }));

    const updated = {
      ...rangeTime,
      [field]: { ...rangeTime[field], [unit]: value },
    };
    AsyncStorage.setItem("rangeTime", JSON.stringify(updated));
  };

  const fillInitialRange = async () => {
    const storedData = await AsyncStorage.getItem("rangeTime");
    const currentRangeTime = storedData ? JSON.parse(storedData) : rangeTime;
    setRangeTime(currentRangeTime);
  };

  const MAX_SCORE = 50;
  const [score, setScore] = useState(0);
  const [toRedeem, setToRedeem] = useState(0);
  const [rewardLabel, setRewardLabel] = useState("kebab");

  const fillInitialProgress = async () => {
    const stored = await AsyncStorage.getItem("progress");
    if (stored) {
      const p = JSON.parse(stored);
      setScore(p.score ?? 0);
      setToRedeem(p.toRedeem ?? 0);
    }
    const label = await AsyncStorage.getItem("rewardLabel");
    if (label) setRewardLabel(label);
  };

  const handleRedeem = async () => {
    setToRedeem(0);
    await AsyncStorage.setItem(
      "progress",
      JSON.stringify({ score, toRedeem: 0 }),
    );
  };

  useEffect(() => {
    setupNotifications();
    setMessageBanner();
    fillInitialEvents();
    fillInitialRange();
    fillInitialTheme();
    fillInitialProgress();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const actionId = response.actionIdentifier;
        const data = response.notification.request.content.data;

        const DISMISS_IDENTIFIERS = [
          Notifications.DEFAULT_ACTION_IDENTIFIER,
          "com.apple.UNNotificationDismissActionIdentifier",
          "android.intent.action.DISMISS_NOTIFICATION",
        ];

        if (DISMISS_IDENTIFIERS.includes(actionId)) return;

        const newScore =
          actionId === "YES"
            ? Math.min(score + 1, MAX_SCORE)
            : Math.max(score - 1, 0);

        const completions =
          actionId === "YES" && score === MAX_SCORE - 1
            ? toRedeem + 1
            : toRedeem;
        const finalScore =
          actionId === "YES" && score === MAX_SCORE - 1 ? 0 : newScore;

        setScore(finalScore);
        setToRedeem(completions);
        await AsyncStorage.setItem(
          "progress",
          JSON.stringify({ score: finalScore, toRedeem: completions }),
        );

        const newResponse: EventResponse = {
          eventTitle: data.eventTitle as string,
          response: actionId === "YES" ? 1 : 0,
          timestamp: Date.now(),
        };

        try {
          const stored = await AsyncStorage.getItem("eventResponses");
          const current: EventResponse[] = stored ? JSON.parse(stored) : [];
          const updated = [...current, newResponse];
          await AsyncStorage.setItem("eventResponses", JSON.stringify(updated));
        } catch (error) {
          console.error("Errore salvataggio risposta:", error);
        }
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <div className={`app theme-${theme}`}>
      <div className="wrapper-content">
        <div className="time-wrapper">
          <TimeShow />
        </div>
        <ProgressBar
          score={score}
          toRedeem={toRedeem}
          rewardLabel={rewardLabel}
          maxScore={MAX_SCORE}
          onRedeem={handleRedeem}
        />

        <div className="header-wrapper">
          <div className="text-wrapper">
            <h4>Ripple</h4>
            <h1>I tuoi eventi</h1>
          </div>
          <div className="button-wrapper">
            <div className="cta" onClick={() => setSettingSidebar(true)}>
              <TbSettings2 />
            </div>
            <div className="cta" onClick={() => setEventCreation(true)}>
              <FaPlus />
            </div>
          </div>
        </div>

        <AlertComponent data={alertData} />

        <div className="events-wrapper">
          {events.map((e, index) => (
            <div key={index} id={`event-${index}`} className="event">
              <div className="delete-event" onClick={() => deleteEvent(index)}>
                <AiOutlineDelete />
              </div>
              <div className="event-info">
                <div className="title">{e.title}</div>
                <div className="notes">{e.notes}</div>
              </div>
            </div>
          ))}
          <div
            className="event create-event-cta"
            onClick={() => setEventCreation(true)}
          >
            <span>
              <FaPlus /> Aggiungi un altro evento
            </span>
          </div>
        </div>

        {/* form creazione evento */}
        <div
          className={
            !eventCreation
              ? "close creation-form-wrapper"
              : "creation-form-wrapper"
          }
          onClick={() => setEventCreation(false)}
        >
          <form
            onSubmit={createEvent}
            method="post"
            className="event-create-form"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="header">
              <div className="cta" onClick={() => setEventCreation(false)}>
                <IoClose />
              </div>
              <h1>Nuovo evento</h1>
            </div>
            <div className="field">
              <div className="label">Titolo</div>
              <input
                type="text"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                value={formData.title}
                required
              />
            </div>
            <div className="field sec">
              <div className="label">Descrizione</div>
              <textarea
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                value={formData.notes}
              />
            </div>
            <div className="field">
              <input type="submit" value="Crea evento" />
            </div>
          </form>
        </div>

        {/* sidebar impostazioni */}
        <div
          className={
            settingSidebar ? "setting-sidebar open" : "setting-sidebar close"
          }
        >
          <div
            className="time-wrapper"
            style={{
              position: "absolute",
              top: "3rem",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <TimeShow />
          </div>

          <div className="header">
            <div className="cta" onClick={() => setSettingSidebar(false)}>
              <IoClose />
            </div>
            <h1>Impostazioni</h1>
          </div>

          <div className="setting">
            <h1>Range orario</h1>
            <div className="card-setting">
              <div className="range">
                <div className="title">Inizio</div>
                <div className="number-range">
                  <div className="hour">
                    <input
                      type="text"
                      value={rangeTime.start.hour}
                      onChange={(e) =>
                        handleRangeChange("start", "hour", e.target.value)
                      }
                      onBlur={() => handleRangeBlur("start", "hour")}
                      placeholder="00"
                      maxLength={2}
                    />
                  </div>
                  :
                  <div className="min">
                    <input
                      type="text"
                      value={rangeTime.start.minutes}
                      onChange={(e) =>
                        handleRangeChange("start", "minutes", e.target.value)
                      }
                      onBlur={() => handleRangeBlur("start", "minutes")}
                      placeholder="00"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              <FaLongArrowAltRight />

              <div className="range">
                <div className="title">Fine</div>
                <div className="number-range">
                  <div className="hour">
                    <input
                      type="text"
                      value={rangeTime.end.hour}
                      onChange={(e) =>
                        handleRangeChange("end", "hour", e.target.value)
                      }
                      onBlur={() => handleRangeBlur("end", "hour")}
                      placeholder="00"
                      maxLength={2}
                    />
                  </div>
                  :
                  <div className="min">
                    <input
                      type="text"
                      value={rangeTime.end.minutes}
                      onChange={(e) =>
                        handleRangeChange("end", "minutes", e.target.value)
                      }
                      onBlur={() => handleRangeBlur("end", "minutes")}
                      placeholder="00"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="setting">
            <h1>Premio</h1>
            <div className="card-setting custom-message">
              <input
                type="text"
                value={rewardLabel}
                onChange={async (e) => {
                  setRewardLabel(e.target.value);
                  await AsyncStorage.setItem("rewardLabel", e.target.value);
                }}
                placeholder="es. kebab"
              />
            </div>
          </div>

          {/* selector tema */}
          <div className="setting" style={{zIndex: 10000}}>
            <h1>Tema</h1>
            <div className="card-setting theme-selector">
              {(Object.keys(THEME_LABELS) as ThemeName[]).map((t) => (
                <div
                  key={t}
                  className={`theme-option ${theme === t ? "active" : ""}`}
                  onClick={() => handleThemeChange(t)}
                >
                  <div className={`theme-preview theme-${t}`} />
                  <span>{THEME_LABELS[t]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
