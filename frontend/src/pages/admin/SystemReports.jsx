import { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  PieChart, 
  BarChart, 
  ShieldAlert, 
  Database,
  FileSpreadsheet
} from 'lucide-react';
import Button from '../../components/common/Button';

const REPORTS = [
  {
    id: 1,
    title: 'Organization Skill Readiness Audit Report',
    type: 'CSV Data Export',
    format: 'CSV / Excel',
    size: '1.4 MB',
    date: 'Updated Today',
    description: 'Comprehensive breakdown of skill readiness scores across all 342 employees and 5 departments.'
  },
  {
    id: 2,
    title: 'Security & Access Control Telemetry Audit',
    type: 'Security Log',
    format: 'JSON / Log',
    size: '4.8 MB',
    date: 'Updated 2h ago',
    description: 'Audit logs of user logins, role privilege modifications, and administrative API key rotations.'
  },
  {
    id: 3,
    title: 'AI Model Inference Token Telemetry',
    type: 'AI Usage Report',
    format: 'PDF Report',
    size: '2.1 MB',
    date: 'Updated Yesterday',
    description: 'Detailed metrics of Google Gemini 3.5 Flash API calls, latency telemetry, and token usage counts.'
  },
  {
    id: 4,
    title: 'Department Skill Gap & Course Fulfillment Report',
    type: 'HR Analytics',
    format: 'PDF Report',
    size: '3.2 MB',
    date: 'Updated 3 days ago',
    description: 'Analysis of identified skill gaps and course completion rates by engineering and product teams.'
  }
];

const SystemReports = () => {
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadedMsg, setDownloadedMsg] = useState('');

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

  const handleDownload = (report) => {
    setDownloadingId(report.id);
    
    setTimeout(() => {
      let content = '';
      let filename = '';
      let mimeType = 'text/plain';

      if (report.id === 1) {
        filename = 'SkillBridge_Organization_Skill_Readiness_Audit.csv';
        mimeType = 'text/csv;charset=utf-8;';
        content = `Department,Department Code,Employees,Target Benchmark %,Readiness Score %,Key Skill Gaps,Status\n` +
          `Engineering,ENG,145,90%,88%,Kubernetes; Micro-frontends; GraphQL,Optimal\n` +
          `Product Management,PRD,62,85%,84%,Data Analytics; SQL; Product Strategy,Optimal\n` +
          `UI/UX Design,DSG,40,82%,78%,Design Systems; Figma Variables; Prototyping,Attention Required\n` +
          `DevOps & Infra,OPS,35,90%,92%,Terraform; Cloud Security; CI/CD,Exceeding Benchmark\n` +
          `Data Science & AI,DAT,60,85%,81%,PyTorch; LLM Fine-Tuning; Prompt Engineering,Optimal\n`;
      } else if (report.id === 2) {
        filename = 'SkillBridge_Security_Audit_Telemetry.json';
        mimeType = 'application/json';
        content = JSON.stringify({
          system: 'SkillBridge.AI Telemetry Core',
          generated_at: new Date().toISOString(),
          audit_period: 'Last 30 Days',
          audit_logs: [
            { id: 'log_901', timestamp: '2026-08-18T09:42:11Z', actor: 'admin@company.com', action: 'RBAC_POLICY_UPDATE', target: 'HR_MANAGER_ROLE', status: 'SUCCESS' },
            { id: 'log_902', timestamp: '2026-08-18T09:15:00Z', actor: 'sarah.jenkins@company.com', action: 'TALENT_ASSESSMENT_SYNC', target: 'ENGINEERING_DEPT', status: 'SUCCESS' },
            { id: 'log_903', timestamp: '2026-08-18T08:30:22Z', actor: 'alex.morgan@company.com', action: 'SKILL_GAP_INFERENCE', target: 'SR_FRONTEND_ROLE', status: 'SUCCESS' }
          ],
          security_summary: {
            zero_trust_status: 'Compliant',
            mfa_otp_enforced: true,
            active_sessions: 48
          }
        }, null, 2);
      } else if (report.id === 3) {
        filename = 'SkillBridge_AI_Inference_Telemetry.csv';
        mimeType = 'text/csv;charset=utf-8;';
        content = `Model Name,Endpoint Latency (ms),Token Usage (24h),Success Rate %,Error Count\n` +
          `Google Gemini 3.5 Flash,142ms,284190 tokens,99.8%,0\n` +
          `Skill Telemetry Embeddings,86ms,114200 tokens,100%,0\n` +
          `Resume Parser Extractor,210ms,92400 tokens,99.5%,1\n`;
      } else {
        filename = 'SkillBridge_Department_Skill_Gap_Fulfillment.csv';
        mimeType = 'text/csv;charset=utf-8;';
        content = `Department,Identified Gaps,Assigned Courses,Enrollment Count,Completion Rate %\n` +
          `Engineering,42,8,138,82%\n` +
          `Product,18,4,58,79%\n` +
          `Design,14,3,38,87%\n` +
          `DevOps,9,3,34,94%\n` +
          `Data Science,22,5,56,76%\n`;
      }

      triggerFileDownload(content, filename, mimeType);

      setDownloadingId(null);
      setDownloadedMsg(`✅ Downloaded "${filename}" successfully!`);
      setTimeout(() => setDownloadedMsg(''), 4000);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600 dark:text-teal-400 stroke-[2.2]" />
          System Analytics & Telemetry Reports
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          Download system audit logs, AI telemetry reports, and organization skill gap analytics.
        </p>
      </div>

      {/* Download Success Banner */}
      {downloadedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{downloadedMsg}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REPORTS.map((report) => (
          <div
            key={report.id}
            className="p-6 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-black uppercase">
                  {report.type}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {report.size} • {report.date}
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                {report.title}
              </h2>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {report.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                Format: <strong className="text-slate-700 dark:text-slate-200">{report.format}</strong>
              </span>

              <button
                onClick={() => handleDownload(report)}
                disabled={downloadingId === report.id}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingId === report.id ? 'Generating...' : 'Download'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemReports;
