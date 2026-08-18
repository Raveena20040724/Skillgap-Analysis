import { useState } from 'react';
import { PieChart as PieIcon, Download, FileText, CheckCircle2 } from 'lucide-react';

const INITIAL_REPORTS = [
  {
    id: 'rep_1',
    title: 'Organization Skill Readiness Audit Report',
    type: 'Workforce Audit',
    dateGenerated: 'Today',
    metricsSummary: 'Comprehensive assessment breakdown across 342 employees and 5 departments.'
  },
  {
    id: 'rep_2',
    title: 'Engineering & DevOps Gap Telemetry Index',
    type: 'Department Gap',
    dateGenerated: '2 days ago',
    metricsSummary: 'Analysis of Kubernetes, Cloud Architecture, and React micro-frontend skill deficiencies.'
  },
  {
    id: 'rep_3',
    title: 'AI & Data Science Course Fulfillment Report',
    type: 'Learning Program',
    dateGenerated: '1 week ago',
    metricsSummary: 'Completion metrics for PyTorch, LLM Fine-Tuning, and BigQuery ML modules.'
  }
];

const HrReports = () => {
  const [reports] = useState(INITIAL_REPORTS);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  const triggerFileDownload = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = (title) => {
    const filename = `${title.replace(/\s+/g, '_')}_Report.json`;
    const data = JSON.stringify({
      report_title: title,
      generated_at: new Date().toISOString(),
      generated_by: 'HR Management Portal',
      metrics: [
        { metric: 'Average Skill Gap Readiness', value: '83.4%' },
        { metric: 'Completed Assessments', value: '284 / 342' },
        { metric: 'Top Deficiencies', value: 'Kubernetes, Cloud Architecture, GraphQL' }
      ]
    }, null, 2);

    triggerFileDownload(data, filename, 'application/json');
    showToast(`✅ Downloaded "${filename}" successfully!`);
  };

  const handleExportExcel = (title) => {
    const filename = `${title.replace(/\s+/g, '_')}_Report.csv`;
    const csvContent = `Employee Name,Department,Role,Skill Readiness %,Assessment Status,Assigned Courses\n` +
      `Alex Morgan,Engineering,Senior Frontend,86%,Completed,Advanced React & State Management\n` +
      `Marcus Vance,DevOps,DevOps Architect,92%,Completed,Kubernetes & Terraform Masterclass\n` +
      `David Chen,Engineering,Backend Engineer,88%,Completed,Go Microservices & gRPC\n` +
      `Sophia Patel,Data Science,AI Engineer,81%,Completed,PyTorch & LLM Fine-Tuning\n` +
      `Emily Watson,UI/UX Design,Product Designer,78%,In Progress,Figma Design Systems & Variables\n`;

    triggerFileDownload(csvContent, filename, 'text/csv;charset=utf-8;');
    showToast(`✅ Exported "${filename}" CSV spreadsheet!`);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <PieIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 stroke-[2.2]" />
          HR Analytics & Skill Readiness Reports
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Generate executive telemetry files and CSV spreadsheets for department skill audits.
        </p>
      </div>

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Reports List Cards */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-6 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 uppercase">
                  {report.type}
                </span>
                <span className="text-xs font-bold text-slate-400">Generated: {report.dateGenerated}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{report.title}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-2xl">{report.metricsSummary}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleExportPDF(report.title)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" /> Download Report
              </button>
              <button
                onClick={() => handleExportExcel(report.title)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HrReports;
