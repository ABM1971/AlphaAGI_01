import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2, Search, Book, PenTool, Gavel, FileCheck, Square, Timer } from 'lucide-react';
import { PipelineStatus, PipelineStep, PipelineLog } from '../types';

interface PipelineVisualizerProps {
  status: PipelineStatus;
  currentStep: PipelineStep;
  logs: PipelineLog[];
  t: any;
  onStop: () => void;
  elapsedTime: string;
}

const getStepIcon = (id: PipelineStep) => {
    switch(id) {
        case PipelineStep.INIT: return Book;
        case PipelineStep.KG_SEARCH: return Search;
        case PipelineStep.RETRIEVAL: return DatabaseIcon;
        case PipelineStep.GENERATION: return PenTool;
        case PipelineStep.REVIEW: return Gavel;
        case PipelineStep.REFINEMENT: return FileCheck;
        default: return Circle;
    }
}

// Helper component for Icon
function DatabaseIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5"/></svg>
    )
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ status, currentStep, logs, t, onStop, elapsedTime }) => {
  const steps = [
    PipelineStep.INIT,
    PipelineStep.KG_SEARCH,
    PipelineStep.RETRIEVAL,
    PipelineStep.GENERATION,
    PipelineStep.REVIEW,
    PipelineStep.REFINEMENT
  ];

  // Auto-scroll logs
  const logsEndRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getStepStatus = (stepId: PipelineStep) => {
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(stepId);

    if (status === PipelineStatus.COMPLETE) return 'completed';
    if (status === PipelineStatus.ERROR && stepIndex === currentIndex) return 'error'; // Highlight current if error
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between">
        <div>
           <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.pipeline.title}</h3>
           <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.pipeline.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-4">
            {/* Timer Display */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                <Timer size={14} className={status === PipelineStatus.RUNNING ? "text-violet-500 animate-pulse" : "text-slate-400"} />
                {elapsedTime}
            </div>

            {status === PipelineStatus.RUNNING && (
            <button 
                onClick={onStop}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-colors border border-red-200 dark:border-red-800"
            >
                <Square size={14} fill="currentColor" />
                {t.pipeline.terminate}
            </button>
            )}
        </div>
      </div>

      <div className="p-8">
        {/* Progress Bar Visual */}
        <div className="relative flex justify-between mb-16 px-4">
           {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-700 -z-10 -translate-y-1/2 rounded-full mx-4 transition-colors duration-300"></div>
          <div 
            className={`absolute top-1/2 left-0 h-1.5 -z-10 -translate-y-1/2 rounded-full mx-4 transition-all duration-700 ease-out ${status === PipelineStatus.ERROR ? 'bg-red-400' : 'bg-violet-500'}`}
            style={{ width: `${(steps.indexOf(currentStep) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((stepId) => {
            const stepStatus = getStepStatus(stepId);
            const Icon = getStepIcon(stepId);
            return (
              <div key={stepId} className="flex flex-col items-center gap-3 relative">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-[3px] bg-white dark:bg-slate-800 transition-all duration-500 z-10
                  ${stepStatus === 'completed' ? 'border-violet-500 text-violet-500 scale-100' : ''}
                  ${stepStatus === 'active' ? 'border-violet-600 text-violet-600 shadow-[0_0_0_6px_rgba(124,58,237,0.15)] scale-110' : ''}
                  ${stepStatus === 'pending' ? 'border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600' : ''}
                  ${stepStatus === 'error' ? 'border-red-500 text-red-500 scale-100' : ''}
                `}>
                  {stepStatus === 'completed' ? (
                    <CheckCircle2 size={22} strokeWidth={3} />
                  ) : stepStatus === 'active' ? (
                    <Loader2 size={22} className="animate-spin" strokeWidth={2.5} />
                  ) : stepStatus === 'error' ? (
                     <Square size={18} fill="currentColor" strokeWidth={2.5} /> 
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                {/* Changed w-24 to w-32 to accommodate wider text like 'Agent Review' */}
                <span className={`
                  text-[11px] font-bold text-center absolute -bottom-8 w-32 transition-colors duration-300 uppercase tracking-wide
                  ${stepStatus === 'pending' ? 'text-slate-300 dark:text-slate-600' : 'text-slate-600 dark:text-slate-300'}
                  ${stepStatus === 'active' ? 'text-violet-600 dark:text-violet-400' : ''}
                  ${stepStatus === 'error' ? 'text-red-500' : ''}
                `}>
                  {t.steps[stepId]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Logs Terminal */}
        <div className="bg-[#0f172a] rounded-2xl p-5 font-mono text-xs md:text-sm h-72 overflow-y-auto shadow-inner border border-slate-800 custom-scrollbar">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic text-center mt-24 flex flex-col items-center gap-2">
                <Loader2 size={24} className="opacity-20 animate-spin-slow" />
                {t.pipeline.waiting}
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-4 text-slate-300 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-slate-600 shrink-0 select-none text-[10px] pt-1 font-bold opacity-60">[{log.timestamp}]</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className={`font-bold text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                            log.step === PipelineStep.REVIEW ? 'bg-purple-900/50 text-purple-300' : 
                            log.step === PipelineStep.ERROR ? 'bg-red-900/50 text-red-300' :
                            'bg-blue-900/50 text-blue-300'
                        }`}>{t.steps[log.step] || log.step}</span>
                        <span className="font-medium text-slate-200">{log.message}</span>
                    </div>
                    {log.details && (
                      <div className="mt-1.5 pl-3 ml-1 text-slate-500 border-l border-slate-700 text-xs leading-relaxed">
                        {log.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};