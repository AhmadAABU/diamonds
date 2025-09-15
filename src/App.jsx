import { useState } from "react";
import { Calculator, Diamond, DollarSign } from "lucide-react";

function App() {
  const [scenario, setScenario] = useState("1");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(54);

  const handleCalculate = () => {
    let value = parseFloat(input);
    if (isNaN(value)) {
      setResult("⚠️ ادخل رقم صحيح");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 transition">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          💎 حاسبة شحن الماس
        </h2>

        {/* اختيار معدل التحويل */}
        <div className="flex justify-center gap-3 mb-6">
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
        </div>

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

        {/* إدخال الرقم */}
        <div className="relative mb-4">
          <input
            type="number"
            placeholder="ادخل الرقم هنا"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
          />
          <Calculator className="absolute left-3 top-3 text-gray-400" />
        </div>

        {/* زر الحساب */}
        <button
          onClick={handleCalculate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition flex items-center justify-center gap-2"
        >
          <DollarSign className="w-5 h-5" />
          احسب
        </button>

        {/* النتيجة */}
        {result && (
          <div className="mt-6 text-center text-lg font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900 p-3 rounded-lg shadow-inner">
            النتيجة: {result}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
