import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, BookOpenCheck, Compass, ExternalLink, HeartHandshake, Mail, Scale } from 'lucide-react';
import './index.css';

const siteUrl = import.meta.env.BASE_URL;

function Section({ icon: Icon, title, children }: { icon: typeof Compass; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Icon size={21} /></span>
        <h2 className="text-xl font-black tracking-tight text-slate-800">{title}</h2>
      </div>
      <div className="space-y-3 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href={siteUrl} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"><ArrowLeft size={17} /> 返回首頁</a>
          <span className="text-right text-xs font-bold tracking-wide text-slate-400">全國會考落點分析導航中心</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-indigo-700 to-blue-800 px-6 py-9 text-white shadow-xl shadow-indigo-900/15 sm:px-10 sm:py-12">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10"><Compass size={27} /></div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">About the Platform</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">關於我們</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-50">為協助學生、家長與教育工作者更有效率地查找會考升學資訊，我們整理不同就學區的公開資源，提供一個清楚、方便的導航入口。</p>
        </div>

        <div className="space-y-5">
          <Section icon={Compass} title="我們是什麼">
            <p>全國會考落點分析導航中心是一個民間資訊整理網站，彙整高中職免試入學、志願選填、成績與序位參考、落點分析及各就學區相關工具的連結與說明，協助使用者快速找到所需資訊。</p>
            <p>本站不是教育主管機關、招生委員會、學校或任何錄取結果的決定單位；也不代表任何外部連結網站的立場或內容。</p>
          </Section>

          <Section icon={BookOpenCheck} title="我們提供的內容">
            <ul className="list-disc space-y-2 pl-5 marker:text-indigo-400">
              <li>依就學區、主題與使用情境整理的升學資訊與外部資源連結。</li>
              <li>重要日程、網站公告及常見問答等參考內容。</li>
              <li>協助理解部分就學區計分方式的試算工具；試算結果僅供自行評估，不構成招生、錄取或選填建議。</li>
              <li>瀏覽器端的收藏功能，讓使用者保存常用資源。</li>
            </ul>
          </Section>

          <Section icon={HeartHandshake} title="內容原則與更新">
            <p>我們盡力以公開、可查證的來源整理資訊，並在發現失效連結、明顯錯誤或招生規則更新時調整內容。不過，招生簡章、期程、錄取規則及各校資訊可能隨時變動，本站無法保證所有內容即時、完整或完全無誤。</p>
            <p>做出志願選填、報名或其他重要決定前，請務必以各免試入學委員會、教育主管機關、學校及正式招生簡章的最新公告為準。</p>
          </Section>

          <Section icon={Scale} title="使用提醒與免責說明">
            <p>「落點」或試算結果會受到當年度報名人數、志願選填、超額比序、招生名額與規則等多項因素影響，僅能作為資訊參考，不能保證錄取結果。本站不對使用者依本站或外部連結內容所作決定、外部網站服務中斷或其內容負責。</p>
            <p>外部連結由各該網站營運者管理；進入外部網站後，其使用條款與隱私權政策將適用。使用本站時，也請閱讀<a href={`${siteUrl}privacy.html`} className="font-bold text-indigo-700 underline underline-offset-2">隱私權政策</a>。</p>
          </Section>

          <Section icon={Mail} title="回報與聯絡">
            <p>若您發現資訊錯誤、連結失效，或希望提供具可信來源的教育資源，歡迎來信告知。我們會依可取得的資料進行檢視與處理。</p>
            <a href="mailto:tyctw.analyze@gmail.com" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-white transition hover:bg-indigo-700"><Mail size={16} /> tyctw.analyze@gmail.com</a>
          </Section>
        </div>

        <p className="mt-7 text-center text-xs leading-6 text-slate-400">如需確認招生規則與時程，請優先查閱官方公告。<a className="ml-1 inline-flex items-center gap-1 text-indigo-600 hover:underline" href="https://cap.rcpet.edu.tw/" target="_blank" rel="noreferrer">國中教育會考網站 <ExternalLink size={12} /></a></p>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><AboutPage /></StrictMode>);
