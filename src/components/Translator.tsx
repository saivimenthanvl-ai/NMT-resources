import React, { useState } from "react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ta", name: "Tamil" },
  { code: "kn", name: "Kannada" },
  { code: "hi", name: "Hindi" },
  { code: "ma", name: "Malayalam" },
  { code: "te", name: "Telugu" },
];

export default function Translator() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ta");
  const [rating, setRating] = useState<number | null>(null);
  const [correction, setCorrection] = useState("");

  const handleTranslate = async () => {
    const resp = await fetch("http://localhost:8000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang }),
    });
    const data = await resp.json();
    setTranslation(data.translation);
  };

  const handleFeedback = async () => {
    await fetch("http://localhost:8000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_lang: sourceLang,
        target_lang: targetLang,
        source_text: text,
        model_translation: translation,
        user_correction: correction,
        rating: rating,
      }),
    });
    alert("✅ Feedback submitted — this improves the model for all languages!");
  };

  return (
    <div>
      <div className="flex gap-4 mb-2">
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <span>→</span>
        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>

      <textarea
        className="border p-2 w-full"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
      />
      <button onClick={handleTranslate} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Translate
      </button>

      {translation && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <strong>Translation:</strong> {translation}

          <div className="mt-3">
            <h3>Rate Translation:</h3>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`px-2 py-1 m-1 rounded ${rating === n ? "bg-green-500 text-white" : "bg-gray-200"}`}
              >
                {n}
              </button>
            ))}
            <textarea
              placeholder="Suggest a better translation..."
              className="border p-2 w-full mt-2"
              rows={2}
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
            />
            <button onClick={handleFeedback} className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded">
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
