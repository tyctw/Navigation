import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import './index.css';

const siteUrl = import.meta.env.BASE_URL;

function Section({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-black text-indigo-700">{number}</span>
        <h2 className="text-xl font-black tracking-tight text-slate-800">{title}</h2>
      </div>
      <div className="space-y-3 pl-0 text-sm leading-7 text-slate-600 sm:pl-10">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href={siteUrl} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700">
            <ArrowLeft size={17} /> 返回首頁
          </a>
          <span className="text-right text-xs font-bold tracking-wide text-slate-400">全國會考落點分析導航中心</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-slate-800 to-indigo-950 px-6 py-9 text-white shadow-xl shadow-indigo-950/15 sm:px-10 sm:py-12">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10"><ShieldCheck size={27} /></div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">Privacy Policy</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">隱私權政策</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">我們重視您的個人資料與使用隱私。本政策說明本網站蒐集、使用及保護資料的方式。</p>
          <p className="mt-5 text-xs font-medium text-slate-300">最後更新日期：2026 年 8 月 8 日</p>
        </div>

        <div className="space-y-5">
          <Section number="1" title="適用範圍與管理者">
            <p>本政策適用於「全國會考落點分析導航中心」（下稱「本網站」）提供的頁面與服務。本網站為民間資訊彙整平台，非教育主管機關、招生委員會或各校官方網站。</p>
            <p>個人資料保護相關聯絡窗口：<a className="font-bold text-indigo-700 underline underline-offset-2" href="mailto:tyctw.analyze@gmail.com">tyctw.analyze@gmail.com</a>。</p>
          </Section>

          <Section number="2" title="我們處理的資料、目的與保存方式">
            <ul className="list-disc space-y-2 pl-5 marker:text-indigo-400">
              <li><strong className="text-slate-700">收藏資料：</strong>您將資源加入「我的收藏」時，資源識別碼僅儲存在您使用裝置的瀏覽器 Local Storage，用於顯示與管理收藏清單；本網站伺服器不會讀取或備份此清單。您可在瀏覽器網站資料設定中清除。</li>
              <li><strong className="text-slate-700">使用狀態：</strong>活動效果的已顯示狀態會暫存於瀏覽器 Session Storage，於工作階段結束或您清除網站資料後失效。</li>
              <li><strong className="text-slate-700">資源點擊統計：</strong>您開啟本站所列資源時，網站會將該資源的總點擊次數加一，用於排序與瞭解資源使用情況。此統計不建立一般使用者帳號，亦不將姓名、聯絡方式或收藏清單與點擊次數連結。</li>
              <li><strong className="text-slate-700">管理登入紀錄：</strong>僅於使用管理登入功能時，系統會記錄登入成功或失敗狀態及瀏覽器 User-Agent，以協助維護管理功能安全；不提供管理登入即無法使用後台功能。</li>
            </ul>
          </Section>

          <Section number="3" title="資料利用、對象與地區">
            <p>資料僅在提供網站內容、維持服務安全、處理管理功能及製作不識別個人的資源使用統計所必要範圍內使用，不會出售、出租或用於行銷。</p>
            <p>本站資料庫服務由 Supabase 提供，網站部署於 GitHub Pages。為提供服務與資安維運，相關服務商可能依其服務架構處理連線所必需的技術資料（例如 IP 位址、裝置或瀏覽器資訊）；其處理可能涉及境外伺服器。請一併參閱各服務商的隱私權說明。</p>
            <p>管理登入紀錄會保存至維運或資安目的不再存在為止；資源點擊統計為彙總資料，得持續保存作為網站營運參考。若法律另有保存義務，依該義務辦理。</p>
          </Section>

          <Section number="4" title="Cookie 與瀏覽器儲存">
            <p>本站核心功能不以 Cookie 建立一般使用者帳號或追蹤個人。本站使用的 Local Storage 與 Session Storage 如第 2 節所述；您可在瀏覽器設定中刪除或封鎖網站資料，但收藏或部分使用狀態可能無法保留。</p>
          </Section>

          <Section number="5" title="外部連結與第三方服務">
            <p>本站提供教育資訊與工具的外部連結。您點選後會離開本站，該網站的資料處理、Cookie 與隱私政策由該網站負責；我們無法控制其內容或處理方式。請在提供任何資料前閱讀其政策。</p>
          </Section>

          <Section number="6" title="資料安全">
            <p>我們採取合理的技術與管理措施，限制管理資料的存取範圍，並使用服務商提供的存取控管機制。不過，網際網路傳輸與儲存無法保證絕對安全；請勿透過本站或一般電子郵件傳送身分證號、帳號密碼、成績單等敏感個人資料。</p>
          </Section>

          <Section number="7" title="您的權利與行使方式">
            <p>就本網站所保有且可識別您的個人資料，您可依法請求查詢或閱覽、製給複製本、補充或更正、停止蒐集／處理／利用，以及刪除。請來信至上述信箱，說明您的需求與可供核對的資訊；為保護您的資料，我們可能要求合理的身分驗證。</p>
            <p>本網站主要功能無須提供個人資料。若您選擇不提供管理登入所需資訊，僅會無法使用後台管理功能，不影響一般瀏覽與外部資源查詢。</p>
          </Section>

          <Section number="8" title="未成年人與政策更新">
            <p>本網站服務國中教育資訊使用者，並不主動要求學生提供個人資料。未成年人如需透過電子郵件與我們聯繫，建議先與家長、法定代理人或師長討論，且勿提供不必要的敏感資料。</p>
            <p>我們可能因服務或法令變動更新本政策；更新後會在本頁公布並調整「最後更新日期」。重大變更時，會以適當方式提醒使用者。</p>
          </Section>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>如有隱私權疑問，歡迎與我們聯繫。</span>
          <a href="mailto:tyctw.analyze@gmail.com" className="inline-flex items-center gap-2 font-bold text-indigo-700 hover:text-indigo-900"><Mail size={16} /> 聯絡我們</a>
        </div>
        <p className="mt-6 text-center text-xs leading-6 text-slate-400">本政策依中華民國個人資料保護法的告知原則撰寫，並以實際網站功能為準。<a className="ml-1 inline-flex items-center gap-1 text-indigo-600 hover:underline" href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0050021" target="_blank" rel="noreferrer">查閱個人資料保護法 <ExternalLink size={12} /></a></p>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><PrivacyPage /></StrictMode>);
