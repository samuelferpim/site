import React, { useState, useMemo } from 'react';

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9,
};

const translations = {
  'pt-BR': {
    title: 'Cálculo Metabólico de Alta Precisão',
    subtitle: 'Escolha o algoritmo de acordo com os dados que você possui.',
    level: 'Nível',
    descLevel1: "Fórmula de Mifflin-St Jeor. Ideal se você não sabe seu % de gordura.",
    descLevel2: "Fórmula de Katch-McArdle. Usa Massa Magra para maior precisão na TMB.",
    descLevel3: "Equação de Cunningham + GET Fragmentado. O 'Modo Psicopata' para controle absoluto.",
    weight: 'Peso Total (kg)',
    bodyFat: '% Gordura (BF)',
    height: 'Altura (cm)',
    age: 'Idade',
    gender: 'Sexo',
    male: 'Masc',
    female: 'Fem',
    activityLabel: 'Nível de Atividade Física Genérico',
    actSedentary: 'Sedentário (Trabalho de escritório)',
    actLight: 'Leve (Treino 1-3x na semana)',
    actModerate: 'Moderado (Treino 3-5x na semana)',
    actHigh: 'Intenso (Treino 6-7x na semana)',
    neatLabel: 'NEAT Diário (kcal)',
    neatDesc: 'Passos, faxina, trabalho em pé',
    teaLabel: 'Treino (TEA) (kcal)',
    teaDesc: 'Musculação ou Cardio direto',
    bmrLabel: 'Taxa Basal (TMB)',
    leanMassLabel: 'Massa Magra',
    neatReported: 'NEAT Informado',
    teaReported: 'Treino Informado',
    tefLabel: 'Digestão (TEF)',
    tdeeLabel: 'Gasto Total (GET)',
    maintenance: 'Calorias de manutenção',
    kcalDay: 'kcal/dia'
  },
  'en': {
    title: 'High Precision Metabolic Calculation',
    subtitle: 'Choose the algorithm based on the data you have.',
    level: 'Level',
    descLevel1: "Mifflin-St Jeor formula. Ideal if you don't know your body fat %.",
    descLevel2: "Katch-McArdle formula. Uses Lean Mass for greater BMR precision.",
    descLevel3: "Cunningham equation + Fragmented TDEE. The 'Psychopath Mode' for absolute control.",
    weight: 'Total Weight (kg)',
    bodyFat: 'Body Fat (%)',
    height: 'Height (cm)',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    activityLabel: 'Generic Physical Activity Level',
    actSedentary: 'Sedentary (Desk job)',
    actLight: 'Light (Train 1-3x a week)',
    actModerate: 'Moderate (Train 3-5x a week)',
    actHigh: 'High (Train 6-7x a week)',
    neatLabel: 'Daily NEAT (kcal)',
    neatDesc: 'Steps, chores, standing work',
    teaLabel: 'Training (TEA) (kcal)',
    teaDesc: 'Weightlifting or direct Cardio',
    bmrLabel: 'Basal Rate (BMR)',
    leanMassLabel: 'Lean Mass',
    neatReported: 'Reported NEAT',
    teaReported: 'Reported Training',
    tefLabel: 'Digestion (TEF)',
    tdeeLabel: 'Total Expenditure (TDEE)',
    maintenance: 'Maintenance calories',
    kcalDay: 'kcal/day'
  }
};

export default function ScientificMacroCalc({ accentColor = '#3b82f6', lang = 'pt-BR' }) {
  const t = translations[lang] || translations['pt-BR'];

  const [level, setLevel] = useState(1);
  const [weight, setWeight] = useState(80);
  const [height, setHeight] = useState(180);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [bodyFat, setBodyFat] = useState(15);
  const [activity, setActivity] = useState('moderate');
  const [neat, setNeat] = useState(400); 
  const [tea, setTea] = useState(300);   

  const stats = useMemo(() => {
    let bmr = 0;
    let tdee = 0;
    let tef = 0;

    const fatMass = weight * (bodyFat / 100);
    const leanBodyMass = weight - fatMass;

    if (level === 1) {
      const base = 10 * weight + 6.25 * height - 5 * age;
      bmr = gender === 'male' ? base + 5 : base - 161;
      tdee = bmr * activityMultipliers[activity];
    } 
    else if (level === 2) {
      bmr = 370 + 21.6 * leanBodyMass;
      tdee = bmr * activityMultipliers[activity];
    } 
    else if (level === 3) {
      bmr = 500 + 22 * leanBodyMass;
      tef = (bmr + neat + tea) * 0.1;
      tdee = bmr + neat + tea + tef;
    }

    return { 
      bmr: Math.round(bmr), 
      tdee: Math.round(tdee), 
      tef: Math.round(tef),
      lbm: leanBodyMass.toFixed(1)
    };
  }, [level, weight, height, age, gender, bodyFat, activity, neat, tea]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg font-sans my-8 border border-gray-800">
      
      <div className="mb-6 text-center">
        {/* 4. Substituímos os textos fixos por t.chave */}
        <h3 className="text-xl font-bold mb-1">{t.title}</h3>
        <p className="text-sm text-gray-400">{t.subtitle}</p>
      </div>

      <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => setLevel(num)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              level === num 
                ? 'bg-gray-700 text-white shadow-sm' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            style={level === num ? { borderBottom: `2px solid ${accentColor}` } : {}}
          >
            {t.level} {num}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        <div className="px-3 py-2 bg-gray-800/50 rounded border-l-4" style={{ borderColor: accentColor }}>
          <p className="text-xs text-gray-300">
            {level === 1 && t.descLevel1}
            {level === 2 && t.descLevel2}
            {level === 3 && t.descLevel3}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">{t.weight}</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500 transition-colors" />
          </div>
          
          {level >= 2 && (
            <div>
              <label className="block text-xs text-blue-400 mb-1 font-bold">{t.bodyFat}</label>
              <input type="number" value={bodyFat} onChange={(e) => setBodyFat(Number(e.target.value))} className="w-full bg-gray-800 border border-blue-500 rounded p-2 text-white outline-none" />
            </div>
          )}
        </div>

        {level === 1 && (
          <div className="grid grid-cols-3 gap-4 border-t border-gray-800 pt-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">{t.height}</label>
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{t.age}</label>
              <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">{t.gender}</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none">
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
              </select>
            </div>
          </div>
        )}

        {level !== 3 && (
          <div className="border-t border-gray-800 pt-4">
            <label className="block text-xs text-gray-400 mb-1">{t.activityLabel}</label>
            <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none">
              <option value="sedentary">{t.actSedentary}</option>
              <option value="light">{t.actLight}</option>
              <option value="moderate">{t.actModerate}</option>
              <option value="high">{t.actHigh}</option>
            </select>
          </div>
        )}

        {level === 3 && (
          <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
            <div>
              <label className="block text-xs text-purple-400 mb-1 font-bold">{t.neatLabel}</label>
              <span className="text-[10px] text-gray-500 block mb-1">{t.neatDesc}</span>
              <input type="number" value={neat} onChange={(e) => setNeat(Number(e.target.value))} className="w-full bg-gray-800 border border-purple-500 rounded p-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-xs text-orange-400 mb-1 font-bold">{t.teaLabel}</label>
              <span className="text-[10px] text-gray-500 block mb-1">{t.teaDesc}</span>
              <input type="number" value={tea} onChange={(e) => setTea(Number(e.target.value))} className="w-full bg-gray-800 border border-orange-500 rounded p-2 text-white outline-none" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-gray-950 p-5 rounded-lg border border-gray-800 shadow-inner">
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-800">
          <div>
            <span className="block text-sm text-gray-400">{t.bmrLabel}</span>
            {level >= 2 && <span className="text-[10px] text-gray-500">{t.leanMassLabel}: {stats.lbm}kg</span>}
          </div>
          <span className="text-xl font-bold text-gray-200">{stats.bmr} <span className="text-xs text-gray-500 font-normal">kcal</span></span>
        </div>

        {level === 3 && (
          <div className="mb-3 pb-3 border-b border-gray-800 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-400">{t.neatReported}</span>
              <span className="text-xs font-bold text-gray-300">+{neat} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-orange-400">{t.teaReported}</span>
              <span className="text-xs font-bold text-gray-300">+{tea} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-400">{t.tefLabel}</span>
              <span className="text-xs font-bold text-gray-300">+{stats.tef} kcal</span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-end mt-2">
          <div>
            <span className="block text-sm text-gray-400">{t.tdeeLabel}</span>
            <span className="text-[10px] text-gray-500">{t.maintenance}</span>
          </div>
          <span className="text-3xl font-black tracking-tight" style={{ color: accentColor }}>
            {stats.tdee} <span className="text-sm font-normal text-gray-500">{t.kcalDay}</span>
          </span>
        </div>
      </div>
      
    </div>
  );
}