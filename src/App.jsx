import { useState } from "react";

function App() {
  const [scenario, setScenario] = useState("1");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    let value = parseFloat(input);
    if (isNaN(value)) {
      setResult("⚠️ ادخل رقم صحيح");
      return;
    }

    let res = 0;
    switch (scenario) {
      case "1":
        // Diamonds → SAR
        res = (value / 54) * 3.75;
        setResult(`${res.toFixed(2)} ريال سعودي`);
        break;
      case "2":
        // SAR → Diamonds
        res = (value / 3.75) * 54;
        setResult(`${Math.floor(res)} ماسة`);
        break;
      case "3":
        // USD → Diamonds
        res = value * 54;
        setResult(`${Math.floor(res)} ماسة`);
        break;
      case "4":
        // Diamonds → USD
        res = value / 54;
        setResult(`${res.toFixed(2)} دولار`);
        break;
      case "5":
        // JOD → Diamonds
        res = (value / 0.709) * 54;
        setResult(`${Math.floor(res)} ماسة`);
        break;
      case "6":
        // Diamonds → JOD
        res = (value / 54) * 0.709;
        setResult(`${res.toFixed(2)} دينار أردني`);
        break;
      default:
        setResult("اختر الحالة");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          💎 حاسبة شحن الماس
        </h2>

        {/* اختيار الحالة */}
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          اختر الحالة:
        </label>
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 mb-4 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="1">Diamonds → SAR</option>
          <option value="2">SAR → Diamonds</option>
          <option value="3">USD → Diamonds</option>
          <option value="4">Diamonds → USD</option>
          <option value="5">JOD → Diamonds</option>
          <option value="6">Diamonds → JOD</option>
        </select>
        <input
          type="number"
          placeholder="ادخل الرقم هنا"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 mb-4 focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleCalculate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          احسب
        </button>
        {result && (
          <div className="mt-6 text-center text-lg font-bold text-indigo-700 dark:text-indigo-300">
            النتيجة: {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
