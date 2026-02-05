
import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, Download, Calculator, Settings2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlobalConstants, TestPoint } from './types';
import NumberInput from './components/NumberInput';
import { calculateTestResult } from './utils/calculations';

const DEFAULT_CONSTANTS: GlobalConstants = {
  bulkDensitySand: 1.420,
  weightSandInCone: 1028,
  specificGravityParticles: 2.580,
  maxDryDensity: 2.301,
  compactionThreshold: 95,
};

const createNewTestPoint = (id: string, index: number): TestPoint => ({
  id,
  testNo: `Test ${index + 1}`,
  w1: 0,
  w2: 0,
  w3: 0,
  w4: 0,
  moistureContent: 0,
});

const App: React.FC = () => {
  const [constants, setConstants] = useState<GlobalConstants>(DEFAULT_CONSTANTS);
  const [testPoints, setTestPoints] = useState<TestPoint[]>([createNewTestPoint(Math.random().toString(), 0)]);

  const handleConstantChange = (field: keyof GlobalConstants, value: number) => {
    setConstants(prev => ({ ...prev, [field]: value }));
  };

  const handleTestChange = (id: string, field: keyof TestPoint, value: any) => {
    setTestPoints(prev => prev.map(tp => tp.id === id ? { ...tp, [field]: value } : tp));
  };

  const addTestPoint = () => {
    setTestPoints(prev => [...prev, createNewTestPoint(Math.random().toString(), prev.length)]);
  };

  const removeTestPoint = (id: string) => {
    if (testPoints.length <= 1) return;
    setTestPoints(prev => prev.filter(tp => tp.id !== id));
  };

  const exportToCSV = () => {
    const headers = [
      "Test No", "W1 (Initial)", "W2 (Final)", "W3 (Total Wet)", "W4 (Stone Weight)", 
      "Moisture %", "Dry Density (g/cc)", "Compaction %", "Result"
    ].join(",");
    
    const rows = testPoints.map(tp => {
      const res = calculateTestResult(tp, constants);
      return [
        tp.testNo, tp.w1, tp.w2, tp.w3, tp.w4, tp.moistureContent, 
        res.dryDensity.toFixed(3), res.fieldCompaction.toFixed(2), 
        res.isPassed ? "PASS" : "FAIL"
      ].join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Field_Density_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white p-6 shadow-lg mb-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Field Dry Density Pro</h1>
              <p className="text-slate-400 text-xs uppercase font-medium">Sand Replacement Method (with Stone Correction)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8">
        
        {/* Global Constants Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-slate-600" />
            <h2 className="font-bold text-slate-800">Reference Parameters</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <NumberInput 
              label="Bulk Density Sand (γs)" 
              value={constants.bulkDensitySand} 
              unit="g/cc"
              onChange={(v) => handleConstantChange('bulkDensitySand', v)} 
            />
            <NumberInput 
              label="Sand in Cone (Wc)" 
              value={constants.weightSandInCone} 
              unit="g"
              onChange={(v) => handleConstantChange('weightSandInCone', v)} 
            />
            <NumberInput 
              label="Specific Gravity (Gs)" 
              value={constants.specificGravityParticles} 
              onChange={(v) => handleConstantChange('specificGravityParticles', v)} 
            />
            <NumberInput 
              label="Max Dry Density (MDD)" 
              value={constants.maxDryDensity} 
              unit="g/cc"
              onChange={(v) => handleConstantChange('maxDryDensity', v)} 
            />
            <NumberInput 
              label="Threshold (%)" 
              value={constants.compactionThreshold} 
              step="1"
              onChange={(v) => handleConstantChange('compactionThreshold', v)} 
            />
          </div>
        </section>

        {/* Test Points Grid */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Test Points</h2>
          </div>
          <button 
            onClick={addTestPoint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Test Point
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {testPoints.map((tp, idx) => {
            const result = calculateTestResult(tp, constants);
            return (
              <div key={tp.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full relative overflow-hidden group">
                <div className={`h-1.5 w-full ${result.isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <input 
                    type="text" 
                    value={tp.testNo}
                    onChange={(e) => handleTestChange(tp.id, 'testNo', e.target.value)}
                    className="bg-transparent font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-200 rounded px-1 transition-all"
                  />
                  <button 
                    onClick={() => removeTestPoint(tp.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-5 flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput 
                      label="Initial Sand (w1)" 
                      value={tp.w1} 
                      unit="g"
                      onChange={(v) => handleTestChange(tp.id, 'w1', v)} 
                    />
                    <NumberInput 
                      label="Final Sand (w2)" 
                      value={tp.w2} 
                      unit="g"
                      onChange={(v) => handleTestChange(tp.id, 'w2', v)} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <NumberInput 
                      label="Total Wet Soil (w3)" 
                      value={tp.w3} 
                      unit="g"
                      onChange={(v) => handleTestChange(tp.id, 'w3', v)} 
                    />
                    <NumberInput 
                      label="Wet Stone (w4)" 
                      value={tp.w4} 
                      unit="g"
                      onChange={(v) => handleTestChange(tp.id, 'w4', v)} 
                    />
                  </div>

                  <NumberInput 
                    label="Moisture Content (%)" 
                    value={tp.moistureContent} 
                    unit="%"
                    step="0.1"
                    onChange={(v) => handleTestChange(tp.id, 'moistureContent', v)} 
                  />

                  {/* Results Section */}
                  <div className={`mt-6 p-4 rounded-xl border-2 transition-colors ${result.isPassed ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Field Compaction</span>
                      {result.isPassed ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" /> PASS
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-600 font-bold text-sm">
                          <AlertCircle className="w-4 h-4" /> FAIL
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-4xl font-black mb-1 ${result.isPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {result.fieldCompaction.toFixed(1)}%
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Calculated against {constants.maxDryDensity} g/cc MDD</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200/50 grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-slate-500">Dry Density:</div>
                      <div className="text-right font-bold text-slate-800">{result.dryDensity.toFixed(3)} <span className="text-[10px] font-normal opacity-60">g/cc</span></div>
                      
                      <div className="text-slate-500">Soil Volume:</div>
                      <div className="text-right font-bold text-slate-800">{result.vSoil.toFixed(1)} <span className="text-[10px] font-normal opacity-60">cc</span></div>
                      
                      <div className="text-slate-500">Stone Vol:</div>
                      <div className="text-right font-bold text-slate-800">{result.vStone.toFixed(1)} <span className="text-[10px] font-normal opacity-60">cc</span></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 p-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500 gap-2">
          <div className="flex gap-4">
            <span>Vtotal = (W1-W2-Wc)/γs</span>
            <span>Vsoil = Vtotal - (W4/Gs)</span>
            <span>Wetρ = (W3-W4)/Vsoil</span>
          </div>
          <div>
            &copy; 2024 Field Density Pro Tool
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
