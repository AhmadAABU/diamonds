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

const SCENARIO_NAMES = {
  1: "Diamonds → SAR",
  2: "SAR → Diamonds",
  3: "USD → Diamonds",
  4: "Diamonds → USD",
  5: "JOD → Diamonds",
  6: "Diamonds → JOD",
};

function App() {
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

  useEffect(() => {
    localStorage.setItem("scenario", scenario);
    localStorage.setItem("input", input);
    localStorage.setItem("rate", rate);
    localStorage.setItem("shipments", JSON.stringify(shipments));
    localStorage.setItem("theme", theme);
  }, [scenario, input, rate, shipments, theme]);

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

  useEffect(() => {
    const value = parseFloat(input);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    let res = 0;
    switch (scenario) {
      case "1":
        res = (value / rate) * 3.75;
        setResult(`${res.toFixed(2)} ريال`);
        break;
      case "2":
        res = (value / 3.75) * rate;
        setResult(`${Math.floor(res)} ماسة`);
        break;
      case "3":
        res = value * rate;
        setResult(`${Math.floor(res)} ماسة`);
        break;
      case "4":
        res = value / rate;
        setResult(`${res.toFixed(2)} دولار`);
        break;
      case "5":
        res = (value / 0.709) * rate;
        setResult(`${Math.floor(res)} ماسة`);
        break;
      case "6":
        res = (value / rate) * 0.709;
        setResult(`${res.toFixed(2)} دينار`);
        break;
      default:
        setResult("اختر الحالة");
    }
  }, [scenario, input, rate]);

  const handleCustomRate = useCallback((e) => {
    setCustomRate(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      setRate(val);
    }
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
    const dateTime = now.toLocaleString("ar-EG", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const newShipment = {
      id: Date.now(),
      input,
      result,
      rate,
      scenario,
      userId: tempId,
      dateTime,
    };

    setShipments((prev) => [newShipment, ...prev]);
    setTempId("");
    setShowIdModal(false);
  }, [input, result, rate, scenario, tempId]);

  const handleDelete = useCallback((id) => {
    setShipments((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-emerald-400 dark:from-black dark:via-neutral-950 dark:to-black animate-gradient flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-500">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-cyan-400 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-fuchsia-400 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-400 dark:bg-rose-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md rounded-3xl shadow-2xl shadow-indigo-500/20 dark:shadow-black/90 p-8 pt-10 transition-all duration-500 backdrop-blur-2xl bg-white/70 dark:bg-[#1c1c1e]/70 border border-white/50 dark:border-white/5 z-10">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-extrabold mb-8 drop-shadow-sm pb-2">
          <span className="drop-shadow-md">💎</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-800 dark:from-indigo-400 dark:to-purple-400">حاسبة شحن الماس</span>
        </h2>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {[54, 57.5].map((val) => (
            <button
              key={val}
              onClick={() => setRate(val)}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 backdrop-blur-md outline-none
                ${
                  rate === val
                    ? "bg-indigo-600/90 dark:bg-blue-600/90 text-white shadow-lg shadow-indigo-500/30 scale-105 border border-indigo-500/50 dark:border-blue-500/50"
                    : "bg-white/40 dark:bg-[#2c2c2e]/60 text-gray-800 dark:text-gray-200 border border-white/50 dark:border-white/5 hover:bg-white/60 dark:hover:bg-[#3a3a3c]/70 hover:scale-105"
                }`}
            >
              {val}
            </button>
          ))}

          <input
            type="number"
            placeholder="مخصص"
            value={customRate}
            onChange={handleCustomRate}
            className="w-28 p-2.5 rounded-xl border border-white/50 dark:border-white/5 bg-white/40 dark:bg-[#2c2c2e]/60 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 backdrop-blur-md transition-all placeholder-gray-500 dark:placeholder-gray-400 font-semibold text-center"
          />
        </div>

        <label className="block text-gray-800 dark:text-gray-200 font-bold mb-3 text-sm tracking-wide px-1">
          اختر الحالة:
        </label>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {Object.entries(SCENARIO_NAMES).map(([key, name]) => (
            <button
              key={key}
              onClick={() => setScenario(key)}
              className={`p-3 rounded-xl font-bold transition-all duration-300 backdrop-blur-md text-[13px] sm:text-sm outline-none border flex items-center justify-center
                ${
                  scenario === key
                    ? "bg-indigo-600/90 dark:bg-blue-600/90 text-white shadow-lg shadow-indigo-500/30 border-indigo-500/50 dark:border-blue-500/50 ring-2 ring-indigo-400 dark:ring-blue-500/50"
                    : "bg-white/40 dark:bg-[#2c2c2e]/60 text-gray-800 dark:text-gray-200 border-white/50 dark:border-white/5 hover:bg-white/60 dark:hover:bg-[#3a3a3c]/70 hover:scale-[1.02]"
                }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="relative mb-4 group">
          <input
            type="number"
            placeholder="أدخل رقم"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 pl-12 rounded-xl border border-white/50 dark:border-white/5 bg-white/40 dark:bg-[#2c2c2e]/60 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 backdrop-blur-md transition-all text-lg font-bold shadow-sm"
          />
          <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-blue-500 w-6 h-6 transition-transform group-focus-within:scale-110" />
        </div>

        {result && (
          <div className="mt-8 text-center text-xl font-bold p-6 rounded-2xl bg-gradient-to-r from-indigo-500/15 to-purple-500/15 dark:from-blue-600/10 dark:to-blue-800/10 border border-indigo-200/50 dark:border-blue-500/20 backdrop-blur-lg shadow-inner relative overflow-hidden group animate-fade-in-up">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-blue-400 dark:to-indigo-400 text-3xl mx-2 block mt-2 mb-3 drop-shadow-sm">
              {result}
            </span>
            <button
              onClick={copyToClipboard}
              className="mx-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-white/60 dark:bg-[#2c2c2e]/60 hover:bg-white/90 dark:hover:bg-[#3a3a3c]/70 text-indigo-700 dark:text-blue-400 transition-all border border-white/50 dark:border-white/5 hover:scale-105 hover:shadow-md outline-none"
            >
              <Copy className="w-4 h-4" /> نسخ
            </button>
            {copied && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-green-600 dark:text-green-400 text-sm font-bold animate-fade-in bg-white/90 dark:bg-[#1c1c1e]/90 px-4 py-1.5 rounded-full shadow-md border border-green-200 dark:border-green-800/50">
                ✅ تم النسخ
              </div>
            )}
          </div>
        )}

        {result && (
          <button
            onClick={handleShip}
            className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:-translate-y-1 animate-fade-in-up outline-none"
          >
            <CheckCircle className="w-6 h-6" /> تم الشحن
          </button>
        )}
      </div>

      {/* Theme Toggle Button - Fixed Top Left */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 left-6 z-50 bg-white/40 dark:bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/50 dark:border-white/5 text-gray-800 dark:text-gray-200 p-2.5 rounded-full shadow-lg hover:scale-110 hover:bg-white/60 dark:hover:bg-[#2c2c2e]/70 transition-all duration-300 outline-none"
        title="تغيير المظهر"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-400 drop-shadow-md" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600 drop-shadow-md" />
        )}
      </button>

      <button
        onClick={() => setOverlayOpen(!overlayOpen)}
        className="fixed bottom-6 right-6 z-50 bg-white/40 dark:bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/50 dark:border-white/5 text-indigo-800 dark:text-blue-400 p-3 rounded-full shadow-xl hover:scale-110 hover:bg-white/60 dark:hover:bg-[#2c2c2e]/70 transition-all duration-300 outline-none"
        title="عرض الشحنات"
      >
        <div className="text-xl drop-shadow-md">📦</div>
      </button>

      {/* Overlay Backdrop */}
      {overlayOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-md z-30 animate-fade-in"
          onClick={() => setOverlayOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 w-80 sm:w-96 h-full backdrop-blur-2xl bg-white/80 dark:bg-[#1c1c1e]/90 shadow-2xl p-6 border-l border-white/40 dark:border-white/10 transition-transform duration-500 ease-out z-40 overflow-y-auto
        ${overlayOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-[#2c2c2e] pb-4">
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-indigo-400">
            📦 الشحنات
          </h3>
          <button 
            onClick={() => setOverlayOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2c2c2e] text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {shipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400 opacity-70">
            <div className="text-4xl mb-4 text-center">📭</div>
            <p className="font-medium">لا يوجد شحنات محفوظة</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {shipments.map((s) => (
              <li
                key={s.id}
                className="relative flex flex-col gap-2 p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-gray-700/50 shadow-sm text-sm text-gray-800 dark:text-gray-200 hover:shadow-md transition-all group"
              >
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center gap-2"><span className="text-gray-400">📌 إدخال:</span> <span className="font-bold">{s.input}</span></div>
                  <div className="flex items-center gap-2"><span className="text-gray-400">💲 سعر:</span> <span className="font-bold">{s.rate}</span></div>
                  <div className="col-span-2 flex items-center gap-2"><span className="text-gray-400">💎 نتيجة:</span> <span className="font-bold text-indigo-600 dark:text-indigo-400">{s.result}</span></div>
                  <div className="col-span-2 flex items-center gap-2"><span className="text-gray-400">🔄 الحالة:</span> <span className="font-medium bg-gray-200/50 dark:bg-gray-700/50 px-2 py-0.5 rounded-md">{SCENARIO_NAMES[s.scenario]}</span></div>
                  <div className="col-span-2 flex items-center gap-2"><span className="text-gray-400">👤 ID:</span> <span className="font-mono text-xs bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded text-indigo-800 dark:text-indigo-200">{s.userId}</span></div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-2 flex justify-between items-center">
                  <span>🕒 {s.dateTime}</span>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showIdModal && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800 dark:text-gray-100">
                👤 أدخل ID الشخص
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
              placeholder="مثال: 30.9"
              autoFocus
              className="w-full p-4 rounded-xl border border-white/50 dark:border-white/5 bg-white/50 dark:bg-[#2c2c2e]/60 text-gray-800 dark:text-gray-200 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 backdrop-blur-md transition-all font-mono text-center text-lg shadow-inner"
              onKeyDown={(e) => e.key === 'Enter' && confirmShip()}
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowIdModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-200/80 dark:bg-[#2c2c2e]/80 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-[#3a3a3c] transition-all font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={confirmShip}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
              >
                حفظ الشحنة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
