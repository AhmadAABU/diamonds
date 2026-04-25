import { useState, useEffect, useCallback } from "react";
import {
  Calculator,
  Copy,
  CheckCircle,
  Trash2,
  X,
  Sun,
  Moon,
} from "lucide-react";

const TRANSLATIONS = {
  ar: {
    title: "حاسبة شحن الماس",
    enterNumber: "أدخل رقم",
    custom: "مخصص",
    copy: "نسخ",
    copied: "✅ تم النسخ",
    shipped: "تم الشحن",
    shipments: "📦 الشحنات",
    noShipments: "لا يوجد شحنات محفوظة",
    enterId: "أدخل ID الشخص",
    idPlaceholder: "مثال: 30.9",
    cancel: "إلغاء",
    saveShipment: "حفظ الشحنة",
    input: "📌 إدخال:",
    price: "💲 سعر:",
    result: "💎 نتيجة:",
    status: "🔄 الحالة:",
    id: "👤 ID:",
    units: {
      SAR: "ريال",
      diamonds: "ماسة",
      USD: "دولار",
      JOD: "دينار",
    },
  },
  en: {
    title: "Diamond Calculator", 
    enterNumber: "Enter number",
    custom: "Custom",
    copy: "Copy",
    copied: "✅ Copied!",
    shipped: "Shipped",
    shipments: "📦 Shipments",
    noShipments: "No saved shipments",
    enterId: "Enter Person ID",
    idPlaceholder: "e.g. 30.9",
    cancel: "Cancel",
    saveShipment: "Save Shipment",
    input: "📌 Input:",
    price: "💲 Rate:",
    result: "💎 Result:",
    status: "🔄 Scenario:",
    id: "👤 ID:",
    units: {
      SAR: "SAR",
      diamonds: "Diamonds",
      USD: "USD",
      JOD: "JOD",
    },
  },
};

const SCENARIO_NAMES = {
  ar: {
    1: "ماسة -> ريال",
    2: "ريال -> ماسة",
    3: "دولار -> ماسة",
    4: "ماسة -> دولار",
    5: "دينار -> ماسة",
    6: "ماسة -> دينار",
  },
  en: {
    1: "Diamonds -> SAR",
    2: "SAR -> Diamonds",
    3: "USD -> Diamonds",
    4: "Diamonds -> USD",
    5: "JOD -> Diamonds",
    6: "Diamonds -> JOD",
  },
};

const PAIRS = {
  ar: [
    { from: "ماسة", to: "ريال",  scenarioA: "1", scenarioB: "2" },
    { from: "دولار", to: "ماسة", scenarioA: "3", scenarioB: "4" },
    { from: "دينار", to: "ماسة", scenarioA: "5", scenarioB: "6" },
  ],
  en: [
    { from: "Diamonds", to: "SAR",      scenarioA: "1", scenarioB: "2" },
    { from: "USD",      to: "Diamonds", scenarioA: "3", scenarioB: "4" },
    { from: "JOD",      to: "Diamonds", scenarioA: "5", scenarioB: "6" },
  ],
};

function App() {
  const [lang, setLang] = useState(
    () => localStorage.getItem("lang") || "ar"
  );
  const [scenario, setScenario] = useState(
    () => localStorage.getItem("scenario") || "1"
  );
  const [input, setInput] = useState(() => localStorage.getItem("input") || "");
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(
    () => parseFloat(localStorage.getItem("rate")) || 54
  );
  const [customRate, setCustomRate] = useState("");
  const [copied, setCopied] = useState(false);
  const [shipments, setShipments] = useState(
    () => JSON.parse(localStorage.getItem("shipments")) || []
  );
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [tempId, setTempId] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const t = TRANSLATIONS[lang];
  const isRTL = lang === "ar";

  useEffect(() => {
    localStorage.setItem("lang", lang);
    localStorage.setItem("scenario", scenario);
    localStorage.setItem("input", input);
    localStorage.setItem("rate", rate);
    localStorage.setItem("shipments", JSON.stringify(shipments));
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [lang, scenario, input, rate, shipments, theme, isRTL]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  useEffect(() => {
    const value = parseFloat(input);
    if (isNaN(value)) { setResult(null); return; }

    const u = t.units;
    let res = 0;
    switch (scenario) {
      case "1": res = (value / rate) * 3.75; setResult(`${res.toFixed(2)} ${u.SAR}`); break;
      case "2": res = (value / 3.75) * rate; setResult(`${Math.floor(res)} ${u.diamonds}`); break;
      case "3": res = value * rate;           setResult(`${Math.floor(res)} ${u.diamonds}`); break;
      case "4": res = value / rate;           setResult(`${res.toFixed(2)} ${u.USD}`); break;
      case "5": res = (value / 0.709) * rate; setResult(`${Math.floor(res)} ${u.diamonds}`); break;
      case "6": res = (value / rate) * 0.709; setResult(`${res.toFixed(2)} ${u.JOD}`); break;
      default: setResult(null);
    }
  }, [scenario, input, rate, t]);

  const handleCustomRate = useCallback((e) => {
    setCustomRate(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) setRate(val);
  }, []);

  const copyToClipboard = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    }
  }, [result]);

  const handleShip = useCallback(() => {
    if (!input || !result) return;
    setShowIdModal(true);
  }, [input, result]);

  const confirmShip = useCallback(() => {
    if (!tempId) return;
    const now = new Date();
    const dateTime = now.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
    setShipments((prev) => [
      { id: Date.now(), input, result, rate, scenario, userId: tempId, dateTime, lang },
      ...prev,
    ]);
    setTempId("");
    setShowIdModal(false);
  }, [input, result, rate, scenario, tempId, lang]);

  const handleDelete = useCallback((id) => {
    setShipments((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const pairs = PAIRS[lang];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-emerald-400 dark:bg-none dark:bg-[#0a0a0f] flex items-center justify-center px-4 py-20 sm:p-4 relative overflow-x-hidden font-sans transition-colors duration-500"
    >
      <div className="absolute top-0 -left-10 sm:-left-4 w-64 h-64 sm:w-72 sm:h-72 bg-cyan-400 dark:bg-indigo-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl sm:blur-3xl opacity-70"></div>
      <div className="absolute top-0 -right-10 sm:-right-4 w-64 h-64 sm:w-72 sm:h-72 bg-fuchsia-400 dark:bg-violet-600/25 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl sm:blur-3xl opacity-70"></div>
      <div className="absolute -bottom-8 left-10 sm:left-20 w-64 h-64 sm:w-72 sm:h-72 bg-amber-400 dark:bg-blue-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl sm:blur-3xl opacity-70"></div>

      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl shadow-indigo-500/20 dark:shadow-black/90 p-6 pt-8 sm:p-8 sm:pt-10 transition-all duration-500 backdrop-blur-2xl bg-white/70 dark:bg-[#12121a]/90 border border-white/50 dark:border-white/10 z-10 mx-auto">

        <h2 className="flex items-center justify-center gap-2 sm:gap-3 text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 drop-shadow-sm pb-1 sm:pb-2">
          <span className="drop-shadow-md text-xl sm:text-3xl">💎</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-800 dark:from-indigo-400 dark:to-purple-400">{t.title}</span>
        </h2>

        <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8 flex-wrap">
          {[54, 57.5].map((val) => (
            <button
              key={val}
              onClick={() => setRate(val)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all duration-300 backdrop-blur-md outline-none text-sm sm:text-base
                ${rate === val
                  ? "bg-indigo-600/90 dark:bg-indigo-500/90 text-white shadow-lg shadow-indigo-500/30 scale-105 border border-indigo-500/50"
                  : "bg-white/40 dark:bg-[#1e1e2e]/80 text-gray-800 dark:text-gray-200 border border-white/50 dark:border-white/10 hover:bg-white/60 dark:hover:bg-[#2a2a3e]/80 hover:scale-105"
                }`}
            >
              {val}
            </button>
          ))}
          <input
            type="number"
            placeholder={t.custom}
            value={customRate}
            onChange={handleCustomRate}
            className="w-24 sm:w-28 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-white/50 dark:border-white/10 bg-white/40 dark:bg-[#1e1e2e]/80 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 backdrop-blur-md transition-all placeholder-gray-500 font-semibold text-center text-sm sm:text-base"
          />
        </div>

        <label className="block text-gray-800 dark:text-gray-200 font-bold mb-3 text-sm tracking-wide px-1">
          {t.chooseCase}
        </label>
        <div className="flex flex-col gap-2 mb-5 sm:mb-6">
          {pairs.map((pair) => {
            const isA = scenario === pair.scenarioA;
            const isB = scenario === pair.scenarioB;
            const isActive = isA || isB;
            const currentFrom = isB ? pair.to : pair.from;
            const currentTo = isB ? pair.from : pair.to;

            return (
              <div
                key={pair.scenarioA}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-bold cursor-pointer
                  ${isActive
                    ? "bg-indigo-100 dark:bg-indigo-500/15 border-indigo-500 dark:border-indigo-400/50 text-indigo-800 dark:text-indigo-300 shadow-sm"
                    : "bg-white/40 dark:bg-[#1e1e2e]/80 border-white/50 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-[#2a2a3e]/80"
                  }`}
                onClick={() => setScenario(isActive ? scenario : pair.scenarioA)}
              >
                <span>{currentFrom} {"->"} {currentTo}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScenario(isB ? pair.scenarioA : pair.scenarioB);
                  }}
                  className={`ms-2 p-1.5 rounded-lg transition-all hover:scale-110 outline-none ${
                    isActive
                      ? "bg-indigo-200/80 dark:bg-indigo-400/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-300/80 dark:hover:bg-indigo-400/30"
                      : "bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10"
                  }`}
                  title="عكس الاتجاه"
                >
                  ⇄
                </button>
              </div>
            );
          })}
        </div>

        <div className="relative mb-4 sm:mb-6 group">
          <input
            type="number"
            placeholder={t.enterNumber}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3.5 ps-10 sm:p-4 sm:ps-12 rounded-lg sm:rounded-xl border border-white/50 dark:border-white/10 bg-white/40 dark:bg-[#1e1e2e]/80 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 backdrop-blur-md transition-all text-base sm:text-lg font-bold shadow-sm placeholder-gray-400 dark:placeholder-gray-600"
          />
          <Calculator className="absolute start-3.5 sm:start-4 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-indigo-400 w-5 h-5 sm:w-6 sm:h-6 transition-transform group-focus-within:scale-110" />
        </div>

        {result && (
          <div className="mt-4 text-center p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-500/15 to-purple-500/15 dark:from-indigo-500/10 dark:to-purple-600/10 border border-indigo-200/50 dark:border-indigo-400/20 backdrop-blur-lg shadow-inner relative overflow-hidden animate-fade-in-up">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300 text-2xl sm:text-3xl mx-2 block mb-2 drop-shadow-sm font-extrabold">
              {result}
            </span>
            <button
              onClick={copyToClipboard}
              className="mx-auto flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-indigo-700 dark:text-indigo-300 transition-all border border-white/50 dark:border-white/10 hover:scale-105 outline-none"
            >
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t.copy}
            </button>
            {copied && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-green-600 dark:text-green-400 text-xs sm:text-sm font-bold animate-fade-in bg-white/90 dark:bg-[#12121a]/90 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-md border border-green-200 dark:border-green-800/50 whitespace-nowrap">
                {t.copied}
              </div>
            )}
          </div>
        )}

        {result && (
          <button
            onClick={handleShip}
            className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-emerald-600/90 dark:to-teal-600/90 text-white font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:-translate-y-1 animate-fade-in-up outline-none"
          >
            <CheckCircle className="w-6 h-6" /> {t.shipped}
          </button>
        )}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 bg-white/40 dark:bg-[#1e1e2e]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 text-gray-800 dark:text-gray-200 p-2 sm:p-2.5 rounded-full shadow-lg hover:scale-110 hover:bg-white/60 dark:hover:bg-[#2a2a3e]/80 transition-all duration-300 outline-none"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </button>

      {/* Lang toggle */}
      <button
        onClick={toggleLang}
        className="fixed top-4 left-14 sm:top-6 sm:left-20 z-50 bg-white/40 dark:bg-[#1e1e2e]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-full shadow-lg hover:scale-110 hover:bg-white/60 dark:hover:bg-[#2a2a3e]/80 transition-all duration-300 outline-none text-xs font-bold"
      >
        {lang === "ar" ? "EN" : "AR"}
      </button>

      {/* Shipments button */}
      <button
        onClick={() => setOverlayOpen(!overlayOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-white/40 dark:bg-[#1e1e2e]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 text-indigo-800 dark:text-indigo-300 p-2.5 sm:p-3 rounded-full shadow-xl hover:scale-110 hover:bg-white/60 dark:hover:bg-[#2a2a3e]/80 transition-all duration-300 outline-none"
      >
        <div className="text-lg sm:text-xl">📦</div>
      </button>

      {overlayOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/70 backdrop-blur-md z-30 animate-fade-in"
          onClick={() => setOverlayOpen(false)}
        />
      )}

      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`fixed top-0 right-0 w-[85vw] max-w-[320px] sm:max-w-none sm:w-80 md:w-96 h-full backdrop-blur-2xl bg-white/85 dark:bg-[#0e0e16]/97 shadow-2xl p-5 sm:p-6 border-l border-white/40 dark:border-white/10 transition-transform duration-500 ease-out z-40 overflow-y-auto
        ${overlayOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {t.shipments}
          </h3>
          <button
            onClick={() => setOverlayOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {shipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-500 opacity-70">
            <div className="text-4xl mb-4">📭</div>
            <p className="font-medium">{t.noShipments}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {shipments.map((s) => {
              const st = TRANSLATIONS[s.lang || "ar"];
              const sn = SCENARIO_NAMES[s.lang || "ar"];
              return (
                <li
                  key={s.id}
                  className="relative flex flex-col gap-2 p-5 rounded-2xl bg-white/60 dark:bg-[#1e1e2e]/80 border border-white/50 dark:border-white/10 shadow-sm text-sm text-gray-800 dark:text-gray-200 hover:shadow-md transition-all"
                >
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div className="flex items-center gap-2"><span className="text-gray-400 dark:text-gray-500">{st.input}</span> <span className="font-bold">{s.input}</span></div>
                    <div className="flex items-center gap-2"><span className="text-gray-400 dark:text-gray-500">{st.price}</span> <span className="font-bold">{s.rate}</span></div>
                    <div className="col-span-2 flex items-center gap-2"><span className="text-gray-400 dark:text-gray-500">{st.result}</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{s.result}</span></div>
                    <div className="col-span-2 flex items-center gap-2"><span className="text-gray-400 dark:text-gray-500">{st.status}</span> <span className="font-medium bg-gray-200/50 dark:bg-white/5 px-2 py-0.5 rounded-md">{sn[s.scenario]}</span></div>
                    <div className="col-span-2 flex items-center gap-2"><span className="text-gray-400 dark:text-gray-500">{st.id}</span> <span className="font-mono text-xs bg-indigo-100 dark:bg-indigo-500/15 px-2 py-1 rounded text-indigo-800 dark:text-indigo-300">{s.userId}</span></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-white/10 pt-2 flex justify-between items-center">
                    <span>🕒 {s.dateTime}</span>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {showIdModal && (
        <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4 sm:p-6">
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="bg-white/95 dark:bg-[#12121a]/98 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[2rem] sm:rounded-3xl p-6 sm:p-8 w-full max-w-[90%] sm:max-w-sm shadow-2xl animate-fade-in-up"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800 dark:text-gray-100">
                👤 {t.enterId}
              </h3>
              <button
                onClick={() => setShowIdModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <input
              type="text"
              value={tempId}
              onChange={(e) => setTempId(e.target.value)}
              placeholder={t.idPlaceholder}
              autoFocus
              className="w-full p-4 rounded-xl border border-white/50 dark:border-white/10 bg-white/50 dark:bg-[#1e1e2e]/80 text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 backdrop-blur-md transition-all font-mono text-center text-lg shadow-inner placeholder-gray-400 dark:placeholder-gray-600"
              onKeyDown={(e) => e.key === "Enter" && confirmShip()}
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowIdModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-200/80 dark:bg-white/5 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-white/10 transition-all font-bold border border-transparent dark:border-white/10"
              >
                {t.cancel}
              </button>
              <button
                onClick={confirmShip}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
              >
                {t.saveShipment}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;