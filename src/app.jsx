import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase.js'

/* ── Global styles ─────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #FDF8F2; --surface: #FFFFFF; --surface2: #FAF3EC;
      --rose: #C17A8A; --rose-deep: #8B4A5A; --rose-light: #F0D6DC;
      --gold: #C9A96E; --gold-light: #F5ECD9;
      --text: #3D2528; --text-muted: #9A7A80; --border: #EAD8DC;
      --radius: 16px;
      --shadow: 0 4px 24px rgba(139,74,90,.10);
      --shadow-lg: 0 12px 48px rgba(139,74,90,.16);
    }
    html, body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }
    .serif { font-family: 'Cormorant Garamond', serif; }

    /* layout */
    .app { min-height: 100vh; background: var(--bg); }
    .header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 24px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 16px rgba(193,122,138,.08); }
    .header-inner { max-width: 920px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; gap: 12px; }
    .logo { display: flex; align-items: center; gap: 10px; cursor: pointer; flex-shrink: 0; }
    .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, var(--rose), var(--rose-deep)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .logo-text { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--rose-deep); white-space: nowrap; }
    .logo-sub { font-size: 11px; color: var(--text-muted); letter-spacing: .05em; }
    .nav { display: flex; gap: 4px; }
    .nav-btn { padding: 8px 14px; border-radius: 8px; border: none; background: transparent; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-muted); transition: all .2s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
    .nav-btn:hover, .nav-btn.active { background: var(--rose-light); color: var(--rose-deep); }
    .nav-badge { background: var(--rose); color: white; border-radius: 10px; font-size: 11px; padding: 1px 7px; font-weight: 600; }
    .main { max-width: 920px; margin: 0 auto; padding: 32px 24px 100px; }

    /* section titles */
    .sec-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; margin-bottom: 4px; }
    .sec-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 24px; }

    /* buttons */
    .btn { padding: 10px 20px; border-radius: 10px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; transition: all .2s; display: inline-flex; align-items: center; gap: 8px; }
    .btn-primary { background: linear-gradient(135deg, var(--rose), var(--rose-deep)); color: white; box-shadow: 0 4px 16px rgba(193,122,138,.30); }
    .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(193,122,138,.42); }
    .btn-primary:disabled { opacity: .55; cursor: not-allowed; }
    .btn-secondary { background: var(--surface); color: var(--rose-deep); border: 1.5px solid var(--border); }
    .btn-secondary:hover { background: var(--rose-light); border-color: var(--rose-light); }
    .btn-danger { background: #fff0f0; color: #c0392b; border: 1.5px solid #fbd0d0; }
    .btn-danger:hover { background: #fbd0d0; }
    .btn-sm { padding: 6px 14px; font-size: 13px; border-radius: 8px; }
    .btn-xs { padding: 4px 10px; font-size: 12px; border-radius: 7px; }

    /* fab */
    .fab { position: fixed; bottom: 28px; right: 24px; width: 56px; height: 56px; border-radius: 18px; background: linear-gradient(135deg, var(--rose), var(--rose-deep)); color: white; border: none; cursor: pointer; font-size: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(139,74,90,.35); transition: all .2s; z-index: 200; }
    .fab:hover { transform: translateY(-3px) scale(1.05); }

    /* overlay / modal */
    .overlay { position: fixed; inset: 0; background: rgba(61,37,40,.45); backdrop-filter: blur(5px); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .modal { background: var(--surface); border-radius: 24px; width: 100%; max-width: 560px; max-height: 92vh; overflow-y: auto; padding: 32px; box-shadow: var(--shadow-lg); }
    .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; margin-bottom: 24px; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 28px; flex-wrap: wrap; }
    .modal-tabs { display: flex; border: 1.5px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
    .modal-tab { flex: 1; padding: 10px; border: none; background: transparent; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: var(--text-muted); transition: all .2s; }
    .modal-tab.active { background: var(--rose-light); color: var(--rose-deep); font-weight: 600; }

    /* form */
    .form-group { margin-bottom: 18px; }
    .label { display: block; font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 7px; }
    .input { width: 100%; padding: 11px 15px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; background: var(--surface); color: var(--text); outline: none; transition: border .2s; }
    .input:focus { border-color: var(--rose); }
    .input::placeholder { color: var(--text-muted); }
    textarea.input { resize: vertical; min-height: 80px; }
    .row2 { display: flex; gap: 12px; }
    .row2 > * { flex: 1; min-width: 0; }
    .url-row { display: flex; gap: 8px; }
    .url-row .input { flex: 1; }

    /* image preview */
    .img-prev { width: 100%; height: 150px; border-radius: 12px; border: 1.5px dashed var(--border); background: var(--surface2); display: flex; align-items: center; justify-content: center; overflow: hidden; margin-top: 8px; }
    .img-prev img { width: 100%; height: 100%; object-fit: cover; }

    /* card grid */
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 18px; }
    .card { background: var(--surface); border-radius: var(--radius); border: 1.5px solid var(--border); overflow: hidden; cursor: pointer; transition: all .25s; position: relative; }
    .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--rose-light); }
    .card-img { width: 100%; height: 175px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 46px; overflow: hidden; }
    .card-img img { width: 100%; height: 100%; object-fit: cover; }
    .card-body { padding: 14px 16px 16px; }
    .card-cat { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--rose); margin-bottom: 5px; }
    .card-name { font-size: 15px; font-weight: 500; line-height: 1.4; margin-bottom: 8px; }
    .card-price { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--rose-deep); }
    .card-price-range { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
    .card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 10px; }
    .tag { background: var(--gold-light); color: #7a5a2a; border-radius: 6px; font-size: 11px; padding: 2px 8px; font-weight: 500; }
    .badge-pos { position: absolute; top: 10px; }
    .badge { border-radius: 8px; font-size: 11px; padding: 3px 9px; font-weight: 600; color: white; background: var(--rose); }
    .badge-gold { background: var(--gold); }
    .badge-green { background: #4caf50; }
    .card-bought { opacity: .5; }

    /* filters */
    .filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 22px; align-items: center; }
    .search-wrap { flex: 1; min-width: 160px; position: relative; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 15px; color: var(--text-muted); pointer-events: none; }
    .search-input { width: 100%; padding: 10px 14px 10px 38px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; background: var(--surface); color: var(--text); outline: none; transition: border .2s; }
    .search-input:focus { border-color: var(--rose); }
    select.input { cursor: pointer; }

    /* empty */
    .empty { text-align: center; padding: 72px 24px; }
    .empty-icon { font-size: 60px; margin-bottom: 14px; }
    .empty-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; margin-bottom: 8px; }
    .empty-sub { font-size: 14px; color: var(--text-muted); }

    /* detail modal */
    .detail-hero { width: 100%; height: 230px; border-radius: 16px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 64px; overflow: hidden; margin-bottom: 20px; }
    .detail-hero img { width: 100%; height: 100%; object-fit: cover; }
    .detail-price { font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 600; color: var(--rose-deep); }
    .detail-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }

    /* date cards */
    .dates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
    .date-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 20px; transition: all .2s; }
    .date-card:hover { border-color: var(--rose-light); box-shadow: var(--shadow); }
    .date-card.soon { border-color: var(--rose); background: linear-gradient(135deg,#fff8f9,#fff); }
    .date-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; margin: 8px 0 4px; }
    .date-when { font-size: 13px; color: var(--text-muted); margin-bottom: 10px; }
    .countdown { font-size: 13px; font-weight: 600; color: var(--rose); background: var(--rose-light); border-radius: 8px; padding: 4px 12px; display: inline-block; }
    .countdown.past { color: var(--text-muted); background: var(--surface2); }
    .date-hint { font-size: 12px; color: var(--text-muted); margin-top: 8px; line-height: 1.5; }

    /* code box */
    .code-box { display: flex; align-items: center; gap: 10px; background: var(--surface2); border: 1.5px solid var(--border); border-radius: 12px; padding: 12px 16px; }
    .code-text { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; letter-spacing: .15em; color: var(--rose-deep); flex: 1; }
    .copy-btn { font-size: 12px; cursor: pointer; }

    /* info / alert boxes */
    .info-box { background: var(--gold-light); border: 1.5px solid #e8d5a8; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #7a5a2a; margin-bottom: 18px; line-height: 1.5; }
    .banner { background: linear-gradient(135deg,#fff0f4,#ffe8ed); border: 1.5px solid var(--rose-light); border-radius: 12px; padding: 12px 18px; margin-bottom: 14px; display: flex; align-items: center; gap: 12px; font-size: 14px; }

    /* setup / login */
    .setup-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--bg); }
    .setup-card { background: var(--surface); border-radius: 28px; padding: 44px; max-width: 440px; width: 100%; box-shadow: var(--shadow-lg); }
    .setup-heart { font-size: 52px; text-align: center; margin-bottom: 14px; }
    .setup-title { font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 600; text-align: center; margin-bottom: 6px; }
    .setup-sub { font-size: 14px; color: var(--text-muted); text-align: center; margin-bottom: 32px; }
    .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--text-muted); font-size: 13px; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

    /* loading */
    .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.35); border-top-color: white; border-radius: 50%; animation: spin .7s linear infinite; }
    .spinner-dark { border-color: rgba(193,122,138,.25); border-top-color: var(--rose); }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; }

    /* toast */
    .toast { position: fixed; bottom: 96px; right: 24px; background: var(--text); color: white; border-radius: 12px; padding: 12px 20px; font-size: 14px; font-weight: 500; z-index: 500; animation: toastIn .3s ease; box-shadow: var(--shadow-lg); max-width: calc(100vw - 48px); }
    .toast.success { background: #2d7a4a; }
    .toast.error   { background: #c0392b; }
    @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 600px) {
      .nav-btn span { display: none; }
      .main { padding: 20px 16px 100px; }
      .modal { padding: 24px; border-radius: 20px; }
      .row2 { flex-direction: column; }
      .setup-card { padding: 32px 24px; border-radius: 20px; }
    }
  `}</style>
)

/* ── Constants ─────────────────────────────────────────── */
const CATEGORIES = ['Todos','Casa & Decoração','Moda & Acessórios','Tecnologia','Experiências','Beleza','Livros','Alimentação','Viagem','Jóias','Outros']
const PRIORITIES  = ['Normal','Alta','Sonho']
const CAT_EMOJI   = {'Casa & Decoração':'🏠','Moda & Acessórios':'👗','Tecnologia':'💻','Experiências':'🎭','Beleza':'💄','Livros':'📚','Alimentação':'🍽️','Viagem':'✈️','Jóias':'💍','Outros':'🎁'}
const PRICE_BANDS = ['Todos','Até R$100','R$100–300','R$300–1000','Acima de R$1000']

function generateCode() {
  return Math.random().toString(36).substring(2,8).toUpperCase()
}

/* ── Special dates ─────────────────────────────────────── */
function getSpecialDates(year) {
  const nthSunday = (month, n) => {
    let d = new Date(year, month, 1)
    while (d.getDay() !== 0) d.setDate(d.getDate() + 1)
    d.setDate(d.getDate() + (n - 1) * 7)
    return d
  }
  return [
    { id:'val_br',  name:'Dia dos Namorados',  emoji:'💑', date:new Date(year,5,12),             hint:'O dia mais especial do casal! Planeje com antecedência.' },
    { id:'womens',  name:'Dia da Mulher',       emoji:'🌹', date:new Date(year,2,8),              hint:'Celebre a mulher da sua vida com algo especial.' },
    { id:'mothers', name:'Dia das Mães',        emoji:'🤱', date:nthSunday(4,2),                  hint:'Para mamães do relacionamento — não esqueça!' },
    { id:'fathers', name:'Dia dos Pais',        emoji:'👨‍👧', date:nthSunday(7,2),                 hint:'Homenageie o papai da família.' },
    { id:'christmas',name:'Natal',              emoji:'🎄', date:new Date(year,11,25),            hint:'A magia do Natal pede presentes pensados com carinho.' },
    { id:'newyear', name:'Réveillon',           emoji:'🥂', date:new Date(year,11,31),            hint:'Comece o ano novo com uma surpresa especial.' },
    { id:'val_intl',name:"Valentine's Day",     emoji:'💌', date:new Date(year,1,14),             hint:'Ótimo pretexto internacional para um mimo!' },
  ]
}
function daysUntil(date) {
  const now = new Date(); now.setHours(0,0,0,0)
  const d   = new Date(date); d.setHours(0,0,0,0)
  return Math.round((d - now) / 86400000)
}
function fmtDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', { day:'numeric', month:'long' })
}

/* ── Supabase data helpers ─────────────────────────────── */
function toApp(row) {
  return {
    id:          row.id,
    name:        row.name,
    price:       row.price,
    priceMax:    row.price_max,
    category:    row.category,
    tags:        row.tags ?? [],
    imageUrl:    row.image_url,
    link:        row.link,
    description: row.description,
    priority:    row.priority,
    bought:      row.bought,
    notes:       row.notes,
    coupleCode:  row.couple_code,
    createdAt:   row.created_at,
  }
}
function toDb(item, coupleCode) {
  return {
    couple_code: coupleCode,
    name:        item.name,
    price:       item.price    || null,
    price_max:   item.priceMax || null,
    category:    item.category || 'Outros',
    tags:        item.tags     || [],
    image_url:   item.imageUrl || null,
    link:        item.link     || null,
    description: item.description || null,
    priority:    item.priority || 'Normal',
    bought:      item.bought   ?? false,
    notes:       item.notes    || null,
  }
}

/* ── API: extract product from URL ────────────────────── */
async function extractFromUrl(url) {
  const res  = await fetch('/api/extract', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error('Falha na extração')
  return res.json()
}

/* ── Toast ─────────────────────────────────────────────── */
function Toast({ msg, type }) {
  if (!msg) return null
  return <div className={`toast ${type}`}>{msg}</div>
}

/* ══════════════════════════════════════════════════════════
   SETUP SCREEN
══════════════════════════════════════════════════════════ */
function SetupScreen({ onReady }) {
  const [tab,    setTab]    = useState('create') // 'create' | 'join'
  const [p1,     setP1]     = useState('')
  const [p2,     setP2]     = useState('')
  const [code,   setCode]   = useState('')
  const [loading,setLoading]= useState(false)
  const [error,  setError]  = useState('')

  async function handleCreate() {
    if (!p1.trim() || !p2.trim()) return
    setLoading(true); setError('')
    try {
      const newCode = generateCode()
      const { error: err } = await supabase
        .from('couples').insert({ code: newCode, name1: p1.trim(), name2: p2.trim() })
      if (err) throw err
      localStorage.setItem('couple_code', newCode)
      onReady({ code: newCode, name1: p1.trim(), name2: p2.trim() })
    } catch (err) { setError('Erro: ' + (err?.message || JSON.stringify(err))) }
    finally { setLoading(false) }
  }

  async function handleJoin() {
    if (!code.trim()) return
    setLoading(true); setError('')
    try {
      const { data, error: err } = await supabase
        .from('couples').select().eq('code', code.trim().toUpperCase()).single()
      if (err || !data) { setError('Código não encontrado. Verifique e tente novamente.'); return }
      localStorage.setItem('couple_code', data.code)
      onReady(data)
    } catch { setError('Erro de conexão. Tente novamente.') }
    finally { setLoading(false) }
  }

  return (
    <div className="setup-wrap">
      <div className="setup-card">
        <div className="setup-heart">💝</div>
        <h1 className="setup-title serif">Lista do Casal</h1>
        <p className="setup-sub">Organize os presentes que vocês desejam dar e receber.</p>

        <div className="modal-tabs">
          <button className={`modal-tab ${tab==='create'?'active':''}`} onClick={()=>{setTab('create');setError('')}}>✨ Criar nova lista</button>
          <button className={`modal-tab ${tab==='join'?'active':''}`}   onClick={()=>{setTab('join');setError('')}}>🔑 Entrar com código</button>
        </div>

        {tab === 'create' && (
          <>
            <div className="form-group">
              <label className="label">Seu nome</label>
              <input className="input" placeholder="Ex: Ana" value={p1} onChange={e=>setP1(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Nome do seu amor ♥</label>
              <input className="input" placeholder="Ex: João" value={p2} onChange={e=>setP2(e.target.value)} />
            </div>
            {error && <p style={{color:'#c0392b',fontSize:13,marginBottom:12}}>{error}</p>}
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:13}} disabled={loading||!p1.trim()||!p2.trim()} onClick={handleCreate}>
              {loading ? <><span className="spinner"/>Criando…</> : 'Criar nossa lista 💝'}
            </button>
          </>
        )}

        {tab === 'join' && (
          <>
            <div className="form-group">
              <label className="label">Código da lista</label>
              <input className="input" placeholder="Ex: AB12CD" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} style={{letterSpacing:'.12em',fontSize:20,fontFamily:'Cormorant Garamond',textAlign:'center'}} maxLength={6} />
            </div>
            {error && <p style={{color:'#c0392b',fontSize:13,marginBottom:12}}>{error}</p>}
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:13}} disabled={loading||code.length<6} onClick={handleJoin}>
              {loading ? <><span className="spinner"/>Entrando…</> : 'Entrar na lista →'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ADD / EDIT ITEM MODAL
══════════════════════════════════════════════════════════ */
function AddItemModal({ onClose, onSave, editItem }) {
  const [tab,      setTab]      = useState(editItem ? 'manual' : 'url')
  const [urlInput, setUrlInput] = useState(editItem?.link || '')
  const [fetching, setFetching] = useState(false)
  const [fetchErr, setFetchErr] = useState('')
  const [form, setForm] = useState({
    name:        editItem?.name        || '',
    price:       editItem?.price       != null ? String(editItem.price) : '',
    priceMax:    editItem?.priceMax    != null ? String(editItem.priceMax) : '',
    category:    editItem?.category    || 'Outros',
    tags:        editItem?.tags?.join(', ') || '',
    imageUrl:    editItem?.imageUrl    || '',
    description: editItem?.description || '',
    link:        editItem?.link        || '',
    priority:    editItem?.priority    || 'Normal',
    notes:       editItem?.notes       || '',
  })

  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  async function handleFetch() {
    if (!urlInput.trim()) return
    setFetching(true); setFetchErr('')
    try {
      const data = await extractFromUrl(urlInput.trim())
      setForm(f => ({
        ...f,
        name:        data.name        || f.name,
        price:       data.price != null ? String(data.price) : f.price,
        category:    CATEGORIES.slice(1).includes(data.category) ? data.category : f.category,
        imageUrl:    data.imageUrl    || f.imageUrl,
        description: data.description || f.description,
        tags:        data.tags?.join(', ') || f.tags,
        link:        urlInput.trim(),
      }))
      setTab('manual')
    } catch {
      setFetchErr('Não consegui extrair automaticamente. Preencha os dados abaixo manualmente.')
      setTab('manual')
    } finally { setFetching(false) }
  }

  function handleSubmit() {
    if (!form.name.trim()) return
    onSave({
      ...(editItem || {}),
      name:        form.name.trim(),
      price:       form.price    ? parseFloat(form.price)    : null,
      priceMax:    form.priceMax ? parseFloat(form.priceMax) : null,
      category:    form.category,
      tags:        form.tags.split(',').map(t=>t.trim()).filter(Boolean),
      imageUrl:    form.imageUrl.trim() || null,
      description: form.description.trim() || null,
      link:        (form.link || urlInput).trim() || null,
      priority:    form.priority,
      notes:       form.notes.trim() || null,
      bought:      editItem?.bought || false,
    })
  }

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <h2 className="modal-title serif">{editItem?'Editar Item':'Adicionar Presente'}</h2>

        {!editItem && (
          <div className="modal-tabs">
            <button className={`modal-tab ${tab==='url'?'active':''}`}    onClick={()=>setTab('url')}>🔗 Por Link</button>
            <button className={`modal-tab ${tab==='manual'?'active':''}`} onClick={()=>setTab('manual')}>✍️ Manual</button>
          </div>
        )}

        {tab === 'url' && (
          <>
            <div className="info-box">📌 Cole o link do produto. A IA vai tentar extrair nome, preço e imagem automaticamente.</div>
            <div className="form-group">
              <label className="label">Link do produto</label>
              <div className="url-row">
                <input className="input" placeholder="https://..." value={urlInput} onChange={e=>setUrlInput(e.target.value)} />
                <button className="btn btn-primary" onClick={handleFetch} disabled={fetching||!urlInput.trim()}>
                  {fetching ? <><span className="spinner"/>Buscando…</> : 'Buscar'}
                </button>
              </div>
              {fetchErr && <p style={{color:'#c0392b',fontSize:13,marginTop:6}}>{fetchErr}</p>}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" onClick={()=>{set('link',urlInput);setTab('manual')}}>Preencher manualmente →</button>
            </div>
          </>
        )}

        {tab === 'manual' && (
          <>
            <div className="form-group">
              <label className="label">Imagem (URL)</label>
              <input className="input" placeholder="https://exemplo.com/foto.jpg" value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} />
              {form.imageUrl && <div className="img-prev"><img src={form.imageUrl} alt="" onError={e=>{e.target.style.display='none'}} /></div>}
            </div>
            <div className="form-group">
              <label className="label">Nome do item *</label>
              <input className="input" placeholder="Ex: Perfume Chanel Nº5" value={form.name} onChange={e=>set('name',e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Faixa de preço (R$)</label>
              <div className="row2">
                <input className="input" placeholder="Mínimo" type="number" value={form.price}    onChange={e=>set('price',e.target.value)} />
                <input className="input" placeholder="Máximo"  type="number" value={form.priceMax} onChange={e=>set('priceMax',e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <div className="row2">
                <div>
                  <label className="label">Categoria</label>
                  <select className="input" value={form.category} onChange={e=>set('category',e.target.value)}>
                    {CATEGORIES.slice(1).map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Prioridade</label>
                  <select className="input" value={form.priority} onChange={e=>set('priority',e.target.value)}>
                    {PRIORITIES.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="label">Tags (separadas por vírgula)</label>
              <input className="input" placeholder="decoração, sala, aniversário" value={form.tags} onChange={e=>set('tags',e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Descrição / observações</label>
              <textarea className="input" placeholder="Cor preferida, tamanho, observações…" value={form.description} onChange={e=>set('description',e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Link do produto (opcional)</label>
              <input className="input" placeholder="https://..." value={form.link||urlInput} onChange={e=>set('link',e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" disabled={!form.name.trim()} onClick={handleSubmit}>
                {editItem ? 'Salvar alterações' : 'Adicionar à lista ♥'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   DETAIL MODAL
══════════════════════════════════════════════════════════ */
function DetailModal({ item, onClose, onEdit, onDelete, onToggleBought }) {
  const priceStr  = item.price != null ? `R$ ${item.price.toLocaleString('pt-BR',{minimumFractionDigits:2})}` : null
  const priceMax  = item.priceMax != null ? ` – R$ ${item.priceMax.toLocaleString('pt-BR',{minimumFractionDigits:2})}` : ''
  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="detail-hero">
          {item.imageUrl
            ? <img src={item.imageUrl} alt={item.name} onError={e=>{e.target.style.display='none'}} />
            : <span>{CAT_EMOJI[item.category]||'🎁'}</span>}
        </div>
        <p style={{fontSize:11,fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--rose)',marginBottom:6}}>{item.category}</p>
        <h2 className="serif" style={{fontSize:26,fontWeight:600,marginBottom:14,lineHeight:1.3}}>{item.name}</h2>
        {priceStr && <div className="detail-price">{priceStr}<span style={{fontSize:18}}>{priceMax}</span></div>}
        {item.priority !== 'Normal' && (
          <span className="badge" style={{display:'inline-block',marginTop:10,background:item.priority==='Sonho'?'var(--gold)':'var(--rose)'}}>
            {item.priority==='Sonho'?'⭐ Sonho':'🔥 Alta prioridade'}
          </span>
        )}
        {item.description && <p style={{marginTop:14,fontSize:14,color:'var(--text-muted)',lineHeight:1.6}}>{item.description}</p>}
        {item.tags?.length>0 && <div className="card-tags" style={{marginTop:12}}>{item.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>}
        {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{marginTop:16,textDecoration:'none'}}>🔗 Ver produto</a>}
        <div className="detail-actions">
          <button className="btn btn-secondary btn-sm" onClick={()=>{onToggleBought(item.id);onClose()}}>
            {item.bought ? '↩️ Desmarcar' : '✅ Marcar comprado'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={()=>{onEdit(item);onClose()}}>✏️ Editar</button>
          <button className="btn btn-danger btn-sm"    onClick={()=>{onDelete(item.id);onClose()}}>🗑️ Remover</button>
        </div>
        <div style={{textAlign:'right',marginTop:16}}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   DATES VIEW
══════════════════════════════════════════════════════════ */
function DatesView({ coupleCode, customDates, onAdd, onDelete }) {
  const year = new Date().getFullYear()
  const special = getSpecialDates(year)
  const [showAdd, setShowAdd] = useState(false)
  const [newD, setNewD]       = useState({ name:'', date:'', emoji:'🎂' })

  const all = [
    ...special.map(d=>({...d,custom:false})),
    ...customDates.map(d=>({...d,date:new Date(d.date+'T12:00:00'),custom:true})),
  ].sort((a,b)=>{
    const da=daysUntil(a.date), db=daysUntil(b.date)
    return (da<0?da+366:da)-(db<0?db+366:db)
  })

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h2 className="sec-title serif">Datas Especiais</h2>
          <p className="sec-sub">Nunca mais esqueça uma data importante 💝</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}>+ Adicionar</button>
      </div>
      <div className="dates-grid">
        {all.map(d=>{
          const days = daysUntil(d.date)
          const soon = days>=0&&days<=30
          const past = days<0
          return (
            <div key={d.id} className={`date-card ${soon?'soon':''}`}>
              <div style={{fontSize:30}}>{d.emoji}</div>
              <div className="date-name serif">{d.name}</div>
              <div className="date-when">{fmtDate(d.date)}</div>
              <span className={`countdown ${past?'past':''}`}>
                {past ? `Passou há ${Math.abs(days)} dias` : days===0 ? '🎉 É hoje!' : `Faltam ${days} dias`}
              </span>
              {d.hint && <p className="date-hint">{d.hint}</p>}
              {d.custom && <button className="btn btn-danger btn-xs" style={{marginTop:10}} onClick={()=>onDelete(d.id)}>Remover</button>}
            </div>
          )
        })}
      </div>

      {showAdd && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal">
            <h2 className="modal-title serif">Nova data especial</h2>
            <div className="form-group"><label className="label">Emoji</label><input className="input" value={newD.emoji} onChange={e=>setNewD(d=>({...d,emoji:e.target.value}))} style={{width:80}} /></div>
            <div className="form-group"><label className="label">Nome</label><input className="input" placeholder="Ex: Nosso aniversário de namoro" value={newD.name} onChange={e=>setNewD(d=>({...d,name:e.target.value}))} /></div>
            <div className="form-group"><label className="label">Data</label><input className="input" type="date" value={newD.date} onChange={e=>setNewD(d=>({...d,date:e.target.value}))} /></div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={()=>setShowAdd(false)}>Cancelar</button>
              <button className="btn btn-primary" disabled={!newD.name||!newD.date} onClick={()=>{onAdd(newD);setShowAdd(false);setNewD({name:'',date:'',emoji:'🎂'})}}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */
export default function App() {
  const [couple,      setCouple]      = useState(null)
  const [items,       setItems]       = useState([])
  const [customDates, setCustomDates] = useState([])
  const [view,        setView]        = useState('list')
  const [showAdd,     setShowAdd]     = useState(false)
  const [editItem,    setEditItem]    = useState(null)
  const [detailItem,  setDetailItem]  = useState(null)
  const [ready,       setReady]       = useState(false)
  const [toast,       setToast]       = useState(null)
  const [showCode,    setShowCode]    = useState(false)

  // filters
  const [search,      setSearch]      = useState('')
  const [catFilter,   setCatFilter]   = useState('Todos')
  const [priceFilter, setPriceFilter] = useState('Todos')
  const [boughtFilter,setBoughtFilter]= useState('Disponíveis')

  /* ── init ── */
  useEffect(() => {
    const saved = localStorage.getItem('couple_code')
    if (!saved) { setReady(true); return }
    supabase.from('couples').select().eq('code', saved).single()
      .then(({ data }) => {
        if (data) { setCouple(data); loadData(data.code) }
        else       { localStorage.removeItem('couple_code'); setReady(true) }
      })
  }, [])

  async function loadData(code) {
    const [{ data: iData }, { data: dData }] = await Promise.all([
      supabase.from('items').select().eq('couple_code', code).order('created_at'),
      supabase.from('custom_dates').select().eq('couple_code', code).order('date'),
    ])
    setItems((iData ?? []).map(toApp))
    setCustomDates(dData ?? [])
    setReady(true)
  }

  /* ── realtime sync ── */
  useEffect(() => {
    if (!couple) return
    const ch = supabase.channel('list-sync')
      .on('postgres_changes', { event:'*', schema:'public', table:'items',
        filter:`couple_code=eq.${couple.code}` }, () => {
          supabase.from('items').select().eq('couple_code', couple.code).order('created_at')
            .then(({ data }) => setItems((data ?? []).map(toApp)))
      })
      .on('postgres_changes', { event:'*', schema:'public', table:'custom_dates',
        filter:`couple_code=eq.${couple.code}` }, () => {
          supabase.from('custom_dates').select().eq('couple_code', couple.code).order('date')
            .then(({ data }) => setCustomDates(data ?? []))
      })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [couple])

  /* ── helpers ── */
  function showToast(msg, type='success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  function handleReady(coupleData) {
    setCouple(coupleData)
    loadData(coupleData.code)
  }

  function handleLogout() {
    if (!window.confirm('Sair da lista atual?')) return
    localStorage.removeItem('couple_code')
    setCouple(null); setItems([]); setCustomDates([])
  }

  /* ── CRUD: items ── */
  async function handleSaveItem(item) {
    try {
      if (item.id && items.find(i=>i.id===item.id)) {
        // update
        const { error } = await supabase.from('items').update(toDb(item, couple.code)).eq('id', item.id)
        if (error) throw error
        showToast('Item atualizado ✓')
      } else {
        // insert
        const { error } = await supabase.from('items').insert(toDb(item, couple.code))
        if (error) throw error
        showToast('Adicionado à lista ♥')
      }
    } catch { showToast('Erro ao salvar.','error') }
    setShowAdd(false); setEditItem(null)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (!error) showToast('Item removido','error')
  }

  async function handleToggleBought(id) {
    const item = items.find(i=>i.id===id)
    if (!item) return
    const { error } = await supabase.from('items').update({ bought: !item.bought }).eq('id', id)
    if (!error) showToast(item.bought ? 'Desmarcado' : '🎉 Marcado como comprado!')
  }

  /* ── CRUD: custom dates ── */
  async function handleAddDate(d) {
    const { error } = await supabase.from('custom_dates').insert({ couple_code:couple.code, name:d.name, date:d.date, emoji:d.emoji })
    if (!error) showToast('Data adicionada ✓')
  }
  async function handleDeleteDate(id) {
    await supabase.from('custom_dates').delete().eq('id', id)
  }

  /* ── filtered items ── */
  const filtered = items.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.tags?.some(t=>t.toLowerCase().includes(search.toLowerCase()))) return false
    if (catFilter!=='Todos' && item.category!==catFilter) return false
    if (boughtFilter==='Disponíveis' && item.bought)  return false
    if (boughtFilter==='Comprados'   && !item.bought) return false
    if (priceFilter!=='Todos') {
      const p = item.price
      if (priceFilter==='Até R$100'        && (p==null||p>100))   return false
      if (priceFilter==='R$100–300'         && (p==null||p<100||p>300))  return false
      if (priceFilter==='R$300–1000'        && (p==null||p<300||p>1000)) return false
      if (priceFilter==='Acima de R$1000'   && (p==null||p<1000))  return false
    }
    return true
  })

  const upcoming = getSpecialDates(new Date().getFullYear()).filter(d=>{ const n=daysUntil(d.date); return n>=0&&n<=30 })

  /* ── render ── */
  if (!ready) return (
    <><Styles/><div className="loading-screen"><div className="spinner spinner-dark" style={{width:36,height:36}}/></div></>
  )
  if (!couple) return <><Styles/><SetupScreen onReady={handleReady}/></>

  return (
    <>
      <Styles/>
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div className="header-inner">
            <div className="logo" onClick={()=>setShowCode(true)}>
              <div className="logo-icon">💝</div>
              <div>
                <div className="logo-text">{couple.name1} & {couple.name2}</div>
                <div className="logo-sub">toque para ver código</div>
              </div>
            </div>
            <nav className="nav">
              <button className={`nav-btn ${view==='list'?'active':''}`}  onClick={()=>setView('list')}>
                🎁 <span>Lista</span>
                {items.filter(i=>!i.bought).length>0 && <span className="nav-badge">{items.filter(i=>!i.bought).length}</span>}
              </button>
              <button className={`nav-btn ${view==='dates'?'active':''}`} onClick={()=>setView('dates')}>
                📅 <span>Datas</span>
                {upcoming.length>0 && <span className="nav-badge">{upcoming.length}</span>}
              </button>
              <button className="nav-btn" onClick={handleLogout} title="Sair">🚪</button>
            </nav>
          </div>
        </header>

        <main className="main">

          {/* LIST VIEW */}
          {view==='list' && (
            <>
              <h2 className="sec-title serif">Nossa Lista</h2>
              <p className="sec-sub">{items.length===0 ? 'Comece adicionando o primeiro desejo ♥' : `${items.filter(i=>!i.bought).length} disponíveis · ${items.filter(i=>i.bought).length} comprados`}</p>

              {upcoming.map(d=>(
                <div key={d.id} className="banner">
                  <span style={{fontSize:22}}>{d.emoji}</span>
                  <span><strong>{d.name}</strong> {daysUntil(d.date)===0?'é hoje! 🎉':`em ${daysUntil(d.date)} dias`} — {d.hint}</span>
                </div>
              ))}

              <div className="filters">
                <div className="search-wrap">
                  <span className="search-icon">🔍</span>
                  <input className="search-input" placeholder="Buscar por nome ou tag…" value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
                <select className="input" style={{width:'auto'}} value={catFilter}    onChange={e=>setCatFilter(e.target.value)}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
                <select className="input" style={{width:'auto'}} value={priceFilter}  onChange={e=>setPriceFilter(e.target.value)}>
                  {PRICE_BANDS.map(p=><option key={p}>{p}</option>)}
                </select>
                <select className="input" style={{width:'auto'}} value={boughtFilter} onChange={e=>setBoughtFilter(e.target.value)}>
                  {['Todos','Disponíveis','Comprados'].map(b=><option key={b}>{b}</option>)}
                </select>
              </div>

              {filtered.length===0 ? (
                <div className="empty">
                  <div className="empty-icon">{items.length===0?'🎀':'🔍'}</div>
                  <h3 className="empty-title serif">{items.length===0?'Lista vazia por enquanto':'Nenhum item encontrado'}</h3>
                  <p className="empty-sub">{items.length===0?'Clique no + para adicionar o primeiro desejo':'Tente mudar os filtros'}</p>
                </div>
              ) : (
                <div className="grid">
                  {filtered.map(item=>(
                    <div key={item.id} className={`card ${item.bought?'card-bought':''}`} onClick={()=>setDetailItem(item)}>
                      {item.bought && <div className="badge-pos badge badge-green" style={{left:10}}>✅ Comprado</div>}
                      {item.priority!=='Normal' && (
                        <div className="badge-pos" style={{right:10}}>
                          <span className={`badge ${item.priority==='Sonho'?'badge-gold':''}`}>{item.priority==='Sonho'?'⭐':'🔥'}</span>
                        </div>
                      )}
                      <div className="card-img">
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} onError={e=>{e.target.style.display='none'}}/> : <span>{CAT_EMOJI[item.category]||'🎁'}</span>}
                      </div>
                      <div className="card-body">
                        <div className="card-cat">{item.category}</div>
                        <div className="card-name">{item.name}</div>
                        {item.price!=null && <div className="card-price">R$ {item.price.toLocaleString('pt-BR',{minimumFractionDigits:2})}</div>}
                        {item.priceMax!=null && item.price!=null && <div className="card-price-range">até R$ {item.priceMax.toLocaleString('pt-BR',{minimumFractionDigits:2})}</div>}
                        {item.tags?.length>0 && <div className="card-tags">{item.tags.slice(0,3).map(t=><span key={t} className="tag">{t}</span>)}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* DATES VIEW */}
          {view==='dates' && (
            <DatesView coupleCode={couple.code} customDates={customDates} onAdd={handleAddDate} onDelete={handleDeleteDate} />
          )}
        </main>

        {/* FAB */}
        {view==='list' && <button className="fab" onClick={()=>setShowAdd(true)}>＋</button>}

        {/* MODALS */}
        {(showAdd||editItem) && (
          <AddItemModal onClose={()=>{setShowAdd(false);setEditItem(null)}} onSave={handleSaveItem} editItem={editItem}/>
        )}
        {detailItem && (
          <DetailModal item={detailItem} onClose={()=>setDetailItem(null)} onEdit={i=>{setEditItem(i);setDetailItem(null)}} onDelete={id=>{handleDelete(id);setDetailItem(null)}} onToggleBought={handleToggleBought}/>
        )}

        {/* CODE MODAL */}
        {showCode && (
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowCode(false)}>
            <div className="modal" style={{maxWidth:380}}>
              <h2 className="modal-title serif">Código da Lista</h2>
              <p style={{fontSize:14,color:'var(--text-muted)',marginBottom:20,lineHeight:1.6}}>
                Compartilhe este código com sua namorada para que ela acesse a mesma lista. Guarde-o bem!
              </p>
              <div className="code-box">
                <span className="code-text">{couple.code}</span>
                <button className="btn btn-secondary btn-sm copy-btn" onClick={()=>{navigator.clipboard?.writeText(couple.code);showToast('Código copiado! ✓')}}>
                  📋 Copiar
                </button>
              </div>
              <p style={{fontSize:12,color:'var(--text-muted)',marginTop:12}}>
                Ela deve acessar o site → "Entrar com código" → digitar <strong>{couple.code}</strong>
              </p>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={()=>setShowCode(false)}>Fechar</button>
              </div>
            </div>
          </div>
        )}

        {toast && <Toast msg={toast.msg} type={toast.type}/>}
      </div>
    </>
  )
}
