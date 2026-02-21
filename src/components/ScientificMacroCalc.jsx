import React, { useState, useMemo } from 'react';

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9,
};

export default function ScientificMacroCalc({ accentColor = '#3b82f6' }) {
  // Estado para controlar o nível de precisão (1 = Mifflin, 2 = Katch, 3 = Cunningham)
  const [level, setLevel] = useState(1);

  // Inputs Básicos
  const [weight, setWeight] = useState(80);
  const [height, setHeight] = useState(180);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [bodyFat, setBodyFat] = useState(15);
  
  // Inputs de Gasto (Nível 1 e 2)
  const [activity, setActivity] = useState('moderate');
  
  // Inputs Fragmentados (Nível 3)
  const [neat, setNeat] = useState(400); // Ex: Passos diários
  const [tea, setTea] = useState(300);   // Ex: Musculação pesada

  // O "Backend Matemático" executado em tempo real
  const stats = useMemo(() => {
    let bmr = 0;
    let tdee = 0;
    let tef = 0;

    const fatMass = weight * (bodyFat / 100);
    const leanBodyMass = weight - fatMass;

    if (level === 1) {
      // Nível 1: Mifflin-St Jeor (Padrão)
      const base = 10 * weight + 6.25 * height - 5 * age;
      bmr = gender === 'male' ? base + 5 : base - 161;
      tdee = bmr * activityMultipliers[activity];
    } 
    else if (level === 2) {
      // Nível 2: Katch-McArdle (Avançado)
      bmr = 370 + 21.6 * leanBodyMass;
      tdee = bmr * activityMultipliers[activity];
    } 
    else if (level === 3) {
      // Nível 3: Cunningham (Modo Psicopata)
      bmr = 500 + 22 * leanBodyMass;
      // TEF (Efeito Térmico dos Alimentos) assume 10% da energia ingerida para manter o peso
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
      
      {/* Cabeçalho */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold mb-1">Cálculo Metabólico de Alta Precisão</h3>
        <p className="text-sm text-gray-400">Escolha o algoritmo de acordo com os dados que você possui.</p>
      </div>

      {/* Seletor de Níveis (Tabs) */}
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
            Nível {num}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {/* Descrição Dinâmica do Nível */}
        <div className="px-3 py-2 bg-gray-800/50 rounded border-l-4" style={{ borderColor: accentColor }}>
          <p className="text-xs text-gray-300">
            {level === 1 && "Fórmula de Mifflin-St Jeor. Ideal se você não sabe seu % de gordura."}
            {level === 2 && "Fórmula de Katch-McArdle. Usa Massa Magra para maior precisão na TMB."}
            {level === 3 && "Equação de Cunningham + GET Fragmentado. O 'Modo Psicopata' para controle absoluto."}
          </p>
        </div>

        {/* Inputs Universais (Peso e BF) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Peso Total (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          {level >= 2 && (
            <div>
              <label className="block text-xs text-blue-400 mb-1 font-bold">% Gordura (BF)</label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(Number(e.target.value))}
                className="w-full bg-gray-800 border border-blue-500 rounded p-2 text-white outline-none"
              />
            </div>
          )}
        </div>

        {/* Inputs Exclusivos Nível 1 */}
        {level === 1 && (
          <div className="grid grid-cols-3 gap-4 border-t border-gray-800 pt-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Altura (cm)</label>
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Idade</label>
              <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Sexo</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none">
                <option value="male">Masc</option>
                <option value="female">Fem</option>
              </select>
            </div>
          </div>
        )}

        {/* Multiplicador Genérico (Níveis 1 e 2) */}
        {level !== 3 && (
          <div className="border-t border-gray-800 pt-4">
            <label className="block text-xs text-gray-400 mb-1">Nível de Atividade Física Genérico</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none"
            >
              <option value="sedentary">Sedentário (Trabalho de escritório)</option>
              <option value="light">Leve (Treino 1-3x na semana)</option>
              <option value="moderate">Moderado (Treino 3-5x na semana)</option>
              <option value="high">Intenso (Treino 6-7x na semana)</option>
            </select>
          </div>
        )}

        {/* Inputs Fragmentados Nível 3 */}
        {level === 3 && (
          <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
            <div>
              <label className="block text-xs text-purple-400 mb-1 font-bold">NEAT Diário (kcal)</label>
              <span className="text-[10px] text-gray-500 block mb-1">Passos, faxina, trabalho em pé</span>
              <input type="number" value={neat} onChange={(e) => setNeat(Number(e.target.value))} className="w-full bg-gray-800 border border-purple-500 rounded p-2 text-white outline-none" />
            </div>
            <div>
              <label className="block text-xs text-orange-400 mb-1 font-bold">Treino (TEA) (kcal)</label>
              <span className="text-[10px] text-gray-500 block mb-1">Musculação ou Cardio direto</span>
              <input type="number" value={tea} onChange={(e) => setTea(Number(e.target.value))} className="w-full bg-gray-800 border border-orange-500 rounded p-2 text-white outline-none" />
            </div>
          </div>
        )}
      </div>

      {/* Painel de Resultados */}
      <div className="mt-8 bg-gray-950 p-5 rounded-lg border border-gray-800 shadow-inner">
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-800">
          <div>
            <span className="block text-sm text-gray-400">Taxa Basal (TMB)</span>
            {level >= 2 && <span className="text-[10px] text-gray-500">Massa Magra: {stats.lbm}kg</span>}
          </div>
          <span className="text-xl font-bold text-gray-200">{stats.bmr} <span className="text-xs text-gray-500 font-normal">kcal</span></span>
        </div>

        {level === 3 && (
          <div className="mb-3 pb-3 border-b border-gray-800 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-purple-400">NEAT Informado</span>
              <span className="text-xs font-bold text-gray-300">+{neat} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-orange-400">Treino Informado</span>
              <span className="text-xs font-bold text-gray-300">+{tea} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-400">Digestão (TEF)</span>
              <span className="text-xs font-bold text-gray-300">+{stats.tef} kcal</span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-end mt-2">
          <div>
            <span className="block text-sm text-gray-400">Gasto Total (GET)</span>
            <span className="text-[10px] text-gray-500">Calorias de manutenção</span>
          </div>
          <span className="text-3xl font-black tracking-tight" style={{ color: accentColor }}>
            {stats.tdee} <span className="text-sm font-normal text-gray-500">kcal/dia</span>
          </span>
        </div>
      </div>
      
    </div>
  );
}