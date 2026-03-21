import React, { useState, useEffect, useMemo } from 'react';
import { X, Zap, TrendingUp, AlertCircle, Users, Search, Target } from 'lucide-react';
import api from '../../api/axios';

const PredictionModal = ({ isOpen, onClose, sectionID }) => {
    const [roster, setRoster] = useState([]); // Will hold the array from res.data.students
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchRoster = async () => {
                try {
                    const res = await api.get(`/sections/${sectionID}/roster`);
                    // TARGET THE STUDENTS ARRAY SPECIFICALLY
                    setRoster(res.data.students || []);
                } catch (err) {
                    console.error("Roster fetch failed", err);
                    setRoster([]);
                }
            };
            fetchRoster();
        }
    }, [isOpen, sectionID]);

    // Filter roster based on search input
    const filteredRoster = useMemo(() => {
        return roster.filter(s =>
            s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.student_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [roster, searchTerm]);

    const handlePredict = async (studentID) => {
        setLoading(true);
        setSelectedPrediction(null); // Clear previous
        try {
            const res = await api.post(`/sections/${sectionID}/predict/${studentID}`);
            setSelectedPrediction(res.data);
        } catch (err) {
            alert("ML Prediction engine is currently unavailable.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20">

                {/* Header */}
                <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Student Success Prediction</h2>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Predictive Analytics Engine v1.0</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Left Sidebar: Search & Roster */}
                    <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
                        <div className="p-4 border-b bg-white">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-1">
                            {filteredRoster.map(s => (
                                <button
                                    key={s.student_id}
                                    onClick={() => handlePredict(s.student_id)}
                                    className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between group ${selectedPrediction?.student_id === s.student_id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'hover:bg-white text-slate-600 border border-transparent hover:border-slate-200'
                                        }`}
                                >
                                    <div>
                                        <p className="font-black text-sm leading-tight">{s.student_name}</p>
                                        <p className={`text-[9px] font-bold uppercase ${selectedPrediction?.student_id === s.student_id ? 'text-blue-100' : 'text-slate-400'}`}>
                                            {s.student_number}
                                        </p>
                                    </div>
                                    <Zap size={14} className={selectedPrediction?.student_id === s.student_id ? 'text-white' : 'text-slate-300 group-hover:text-amber-500'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Content: ML Display */}
                    <div className="flex-1 overflow-y-auto p-10 bg-white">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4">
                                <div className="relative">
                                    <Zap size={48} className="text-blue-600 animate-bounce" />
                                    <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 animate-pulse" />
                                </div>
                                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Crunching data points...</p>
                            </div>
                        ) : selectedPrediction ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* TOP STATS: Core ML Metrics */}
                                <div className="grid grid-cols-3 gap-4">
                                    <PredictionCard
                                        label="Current Standing"
                                        value={`${selectedPrediction.current_standing}%`}
                                        icon={Target}
                                        color="blue"
                                    />
                                    <PredictionCard
                                        label="ML Risk Level"
                                        value={selectedPrediction.ml_prediction?.risk_level}
                                        icon={AlertCircle}
                                        color={
                                            selectedPrediction.ml_prediction?.risk_level === 'Low' ? 'emerald' :
                                                selectedPrediction.ml_prediction?.risk_level === 'Medium' ? 'amber' : 'rose'
                                        }
                                    />
                                    <PredictionCard
                                        label="Trajectory"
                                        value={selectedPrediction.predicted_trajectory?.trend || "Stable"}
                                        icon={TrendingUp}
                                        color="indigo"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* LEFT COLUMN: Warnings & Intervention */}
                                    <div className="space-y-6">
                                        {/* Early Warning Signs */}
                                        <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-[2rem]">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">
                                                <AlertCircle size={14} /> Early Warning Signs
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedPrediction.early_warnings?.length > 0 ? (
                                                    selectedPrediction.early_warnings.map((warning, i) => (
                                                        <div key={i} className="flex items-start gap-2 text-[11px] font-bold text-rose-700 bg-white/50 p-2 rounded-xl border border-rose-100">
                                                            <span className="mt-1.5 h-1 w-1 rounded-full bg-rose-500 shrink-0" />
                                                            {warning}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-[10px] font-bold text-rose-300 italic">No red flags detected at this time.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Intervention Plan */}
                                        <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl min-h-[120px]">
                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Recommended Intervention</h4>
                                            <div className="space-y-3">
                                                {selectedPrediction.intervention_plan?.immediate_actions?.length > 0 ? (
                                                    selectedPrediction.intervention_plan.immediate_actions.map((action, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-white">
                                                            <Zap size={14} className="text-amber-400 shrink-0" />
                                                            {action}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-slate-500 italic">No immediate actions required.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT COLUMN: Context & Features */}
                                    <div className="space-y-6">
                                        {/* Section Context / Ranking */}
                                        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Class Context</h4>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-3">
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Class Rank</p>
                                                    <p className="text-xl font-black text-slate-800">#{selectedPrediction.section_context?.class_rank.rank} <span className="text-xs text-slate-400">of {selectedPrediction.section_context?.class_rank.out_of}</span></p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Percentile</p>
                                                    <p className="text-xl font-black text-blue-600">{selectedPrediction.section_context?.class_rank.percentile}%</p>
                                                </div>
                                            </div>
                                            <div className="p-4 border border-slate-100 rounded-2xl">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Performance vs. Average</p>
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 flex-1 rounded-full bg-slate-100 overflow-hidden`}>
                                                        <div
                                                            className="h-full bg-blue-500"
                                                            style={{ width: `${(selectedPrediction.section_context?.vs_section_average.student_average / 100) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-600">{selectedPrediction.section_context?.vs_section_average.verdict}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ML Feature Breakdown */}
                                        <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem]">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Feature Influence (ML Inputs)</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {Object.entries(selectedPrediction.ml_prediction?.features_used || {}).map(([key, val]) => (
                                                    <div key={key} className="bg-white p-3 rounded-xl border border-slate-200/50 flex justify-between items-center">
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase">{key.split('_').join(' ')}</span>
                                                        <span className="text-sm font-black text-slate-700">{val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="px-2 py-1 rounded-lg text-[9px] font-black uppercase bg-emerald-100 text-emerald-600">
                                                    Data: {selectedPrediction.data_completeness?.percentage}% Complete
                                                </span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                                    Confidence: <span className="text-slate-600">{selectedPrediction.data_completeness?.confidence_level}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <TrendingUp size={80} strokeWidth={1} />
                                <p className="font-black uppercase tracking-widest text-sm mt-4">Select student to begin analysis</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for clean code
const PredictionCard = ({ label, value, icon: Icon, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    };
    return (
        <div className={`p-6 rounded-[2rem] border ${colors[color]}`}>
            <Icon size={20} className="mb-3" />
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">{label}</p>
            <p className="text-3xl font-black tracking-tight">{value}</p>
        </div>
    );
}

export default PredictionModal;