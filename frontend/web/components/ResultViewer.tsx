import React from 'react';
import { GeneratedStory, ReviewScore } from '../types';
import { Download, Printer, Star, Quote } from 'lucide-react';

interface ResultViewerProps {
  story: GeneratedStory | null;
  reviews: ReviewScore[];
  t: any;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ story, reviews, t }) => {
  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed transition-colors duration-300">
        <Printer size={48} className="mb-4 opacity-30 text-violet-400" />
        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">{t.results.no_story}</p>
        <p className="text-sm">{t.results.run_hint}</p>
      </div>
    );
  }

  const averageScore = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.score, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Paper Content */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white dark:bg-slate-800 p-8 md:p-14 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[800px] transition-colors duration-300">
            {/* Paper Header */}
            <div className="border-b-2 border-slate-50 dark:border-slate-700 pb-8 mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-6 font-serif tracking-tight">
                    {story.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span>{t.results.generated_by}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </div>

            {/* Abstract */}
            <div className="mb-10 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-200 mb-3 text-center">{t.results.abstract}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-serif italic text-lg">
                    {story.abstract}
                </p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        {t.results.intro}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-7 whitespace-pre-line text-lg">{story.introduction}</p>
                </section>
                
                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        {t.results.method}
                    </h2>
                    <div className="pl-6 border-l-4 border-violet-200 dark:border-violet-900 py-1">
                        <p className="text-slate-600 dark:text-slate-300 leading-7 whitespace-pre-line text-lg">{story.methodology}</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        {t.results.exp}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-7 whitespace-pre-line text-lg">{story.experiments}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        {t.results.contrib}
                    </h2>
                    <ul className="list-disc pl-5 space-y-3 text-slate-600 dark:text-slate-300 text-lg marker:text-violet-500">
                        {story.contributions.map((contribution, idx) => (
                            <li key={idx} className="pl-2">{contribution}</li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
      </div>

      {/* Sidebar - Reviews & Actions */}
      <div className="space-y-6">
        {/* Actions */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm uppercase tracking-wide">{t.results.export}</h3>
            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors text-sm font-medium shadow-lg shadow-slate-200 dark:shadow-none">
                    <Download size={16} /> JSON
                </button>
                 <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium">
                    <Printer size={16} /> PDF
                </button>
            </div>
        </div>

        {/* Reviews */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide">{t.results.anchored_review}</h3>
                <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full text-yellow-700 dark:text-yellow-400 font-bold border border-yellow-200 dark:border-yellow-900/30 shadow-sm">
                    <Star size={14} className="fill-yellow-500 text-yellow-500" />
                    <span className="text-sm">{averageScore}/10</span>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.map((review, idx) => (
                    <div key={idx} className="relative pb-6 border-l-2 border-slate-100 dark:border-slate-700 pl-6 last:pb-0 group">
                         <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 group-hover:border-violet-400 transition-colors"></div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{review.criterion}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                review.score >= 8 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                review.score >= 5 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}>{review.score}/10</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-400 italic relative leading-relaxed">
                            <Quote size={14} className="absolute top-3 left-3 text-slate-300 dark:text-slate-600 -z-0" />
                            <p className="relative z-10 pl-3">{review.reasoning}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 p-6 rounded-3xl border border-blue-100/50 dark:border-blue-900/30 transition-colors duration-300">
            <h4 className="text-blue-900 dark:text-blue-300 font-bold mb-2 text-sm flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
               {t.results.about_anchor}
            </h4>
            <p className="text-blue-800/70 dark:text-blue-300/70 text-xs leading-relaxed font-medium">
                {t.results.about_anchor_desc}
            </p>
        </div>
      </div>
    </div>
  );
};