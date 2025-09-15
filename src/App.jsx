import { useState, useEffect } from "react";
import {
  Calculator,
  Copy,
  CheckCircle,
  Trash2,
  X,
  Sun,
  Moon,
} from "lucide-react";

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const scenarioNames = {
    1: "Diamonds → SAR",
    2: "SAR → Diamonds",
    3: "USD → Diamonds",
    4: "Diamonds → USD",
    5: "JOD → Diamonds",
    6: "Diamonds → JOD",
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, input, rate]);

  const handleCalculate = () => {
    let value = parseFloat(input);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    let res = 0;
    switch (scenario) {
      case "1":
        res = (value / rate) * 3.75;
        setResult(`${res.toFixed(2)} ريال سعودي`);
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
        setResult(`${res.toFixed(2)} دينار أردني`);
        break;
      default:
        setResult("اختر الحالة");
    }
  };

  const handleCustomRate = (e) => {
    setCustomRate(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      setRate(val);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    }
  };

  const handleShip = () => {
    if (!input || !result) return;
    setShowIdModal(true);
  };

  const confirmShip = () => {
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

    setShipments([newShipment, ...shipments]);
    setTempId("");
    setShowIdModal(false);
  };

  const handleDelete = (id) => {
    const updated = shipments.filter((s) => s.id !== id);
    setShipments(updated);
    localStorage.setItem("shipments", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 transition relative">
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:scale-110 transition"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          💎 حاسبة شحن الماس
        </h2>

        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {[54, 57.5].map((val) => (
            <button
              key={val}
              onClick={() => setRate(val)}
              className={`px-4 py-2 rounded-lg font-medium border transition 
                ${
                  rate === val
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
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
            className="w-28 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          اختر الحالة:
        </label>
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 mb-4 focus:ring-2 focus:ring-indigo-400"
        >
          {Object.entries(scenarioNames).map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>

        <div className="relative mb-4">
          <input
            type="number"
            placeholder="أدخل رقم"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
          />
          <Calculator className="absolute left-3 top-3 text-gray-400" />
        </div>

        {result && (
          <div className="mt-6 text-center text-lg font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900 p-3 rounded-lg shadow-inner">
            النتيجة: {result}
            <button
              onClick={copyToClipboard}
              className="ml-2 inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <Copy className="w-4 h-4" /> نسخ
            </button>
            {copied && (
              <div className="mt-2 text-green-600 dark:text-green-400 text-sm font-medium">
                ✅ تم النسخ!
              </div>
            )}
          </div>
        )}

        {result && (
          <button
            onClick={handleShip}
            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition"
          >
            <CheckCircle className="w-5 h-5" /> تم الشحن
          </button>
        )}
      </div>

      <button
        onClick={() => setOverlayOpen(!overlayOpen)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
        title="عرض الشحنات"
      >
        📦
      </button>

      <div
        className={`fixed top-1/2 right-0 transform -translate-y-1/2 w-72 h-[80vh] bg-white dark:bg-gray-900 shadow-2xl p-4 rounded-l-2xl border-l-4 border-indigo-600 transition-transform duration-500 z-40 overflow-y-auto
        ${overlayOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <h3 className="text-lg font-bold mb-4 text-indigo-600">📦 الشحنات</h3>
        {shipments.length === 0 ? (
          <p className="text-gray-500">لا يوجد شحنات محفوظة</p>
        ) : (
          <ul className="space-y-3">
            {shipments.map((s) => (
              <li
                key={s.id}
                className="flex justify-between items-start gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
              >
                <div>
                  <div>📌 إدخال: {s.input}</div>
                  <div>💎 نتيجة: {s.result}</div>
                  <div>💲 سعر: {s.rate}</div>
                  <div>🔄 الحالة: {scenarioNames[s.scenario]}</div>
                  <div>👤 ID: {s.userId}</div>
                  <div>🕒 {s.dateTime}</div>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-600 hover:text-red-800"
                  title="حذف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => setOverlayOpen(false)}
          className="mt-4 w-full px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          إغلاق
        </button>
      </div>
      {showIdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                أدخل ID الشخص
              </h3>
              <button
                onClick={() => setShowIdModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={tempId}
              onChange={(e) => setTempId(e.target.value)}
              placeholder="مثال: 30.9"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 mb-4 focus:ring-2 focus:ring-indigo-400"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowIdModal(false)}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                إلغاء
              </button>
              <button
                onClick={confirmShip}
                className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
