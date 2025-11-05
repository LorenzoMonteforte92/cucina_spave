<template>
  <div>
    <header class="hdr">
      <h1>🍺 Cucina Spave</h1>
      <div class="bar">
        <span>Sync:</span>
        <strong :class="orders.syncOn ? 'on':'off'">{{ orders.syncOn ? 'ON':'OFF' }}</strong>
        <button class="btn" @click="openSync">Configura Realtime</button>
        <button class="btn" @click="importMenu">Importa menù</button>
        <button class="btn" @click="showMenuEditor = true">Modifica menù</button>
        <button class="btn" @click="exportData">Esporta</button>
        <button class="btn danger" @click="clearPending">Azzera pendenti</button>
      </div>
    </header>

    <div class="wrap">
      <div class="grid">
        <section class="card">
          <OrderForm />
        </section>

        <section>
          <PendingOrders />
        </section>

        <section class="card" style="grid-column:1/-1;">
          <Totals />
        </section>

        <section class="card" style="grid-column:1/-1;">
          <PrepQueue />
        </section>

        <section class="card" style="grid-column:1/-1;">
          <CompletedList />
        </section>
      </div>
    </div>

    <footer>Vue+Vite PWA — usa “Aggiungi a Home” in Safari per installare.</footer>

    <!-- Dialog Sync -->
    <dialog ref="syncDlg">
      <form method="dialog">
        <h3>Configura Realtime (Firebase)</h3>
        <p class="muted">Incolla la config JSON della Web App Firebase.</p>
        <textarea v-model="firebaseText" rows="10" style="width:100%;"></textarea>
        <div class="row" style="margin-top:8px;justify-content:flex-end;">
          <button class="btn">Chiudi</button>
          <button class="btn ok" type="button" @click="applySync">Attiva</button>
        </div>
      </form>
    </dialog>

    <!-- Dialog Menu Editor -->
    <dialog ref="menuDlg">
      <form method="dialog">
        <MenuEditor @close="showMenuEditor = false" />
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import OrderForm from './components/OrderForm.vue'
import PendingOrders from './components/PendingOrders.vue'
import Totals from './components/Totals.vue'
import PrepQueue from './components/PrepQueue.vue'
import CompletedList from './components/CompletedList.vue'
import MenuEditor from './components/MenuEditor.vue'
import { useOrders } from './stores/orders'
import { useRecipes } from './stores/recipes'
import { initFirebase } from './services/firebase'

const orders = useOrders()
const recipes = useRecipes()

const syncDlg = ref(null)
const menuDlg = ref(null)
const firebaseText = ref(localStorage.getItem('kds_fbconfig') || '')

const showMenuEditor = ref(false)
watch(showMenuEditor, (v)=>{
  if(v) menuDlg.value?.showModal(); else menuDlg.value?.close()
})

function openSync(){ syncDlg.value?.showModal() }

function applySync(){
  try{
    const cfg = JSON.parse(firebaseText.value)
    initFirebase(cfg)
    localStorage.setItem('kds_fbconfig', JSON.stringify(cfg))
    orders.startRealtime()
    recipes.startRealtime()
    syncDlg.value?.close()
  }catch(e){
    alert('Config non valida: '+e)
  }
}

function importMenu(){
  const raw = prompt('Incolla JSON {nome:{category,items[]}} oppure lista nomi (uno per riga):')
  if(!raw) return
  try{
    let obj
    if(raw.trim().startsWith('{')) obj = JSON.parse(raw)
    else {
      obj = {}
      raw.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).forEach(n => obj[n] = { category:'Appetizer', items:[] })
    }
    recipes.recipes = { ...recipes.recipes, ...obj }
    recipes.saveLocal()
    if(orders.syncOn) recipes.persistCloud()
    alert('Menù importato. Totale voci: '+Object.keys(recipes.recipes).length)
  }catch(e){ alert('Formato non valido: '+e) }
}

function exportData(){
  const data = { recipes: recipes.recipes, pending: orders.orders, completed: orders.completed }
  const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cucinaspave-export-'+new Date().toISOString().slice(0,19)+'.json'
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}

function clearPending(){
  if(!confirm('Sicuro di azzerare tutti gli ordini pendenti?')) return
  orders.orders = []
  orders.saveLocal()
}

onMounted(()=>{
  // autoload firebase if a config is present
  try{
    const cfg = JSON.parse(localStorage.getItem('kds_fbconfig') || 'null')
    if(cfg){
      initFirebase(cfg)
      orders.startRealtime()
      recipes.startRealtime()
    }
  }catch{}
})
</script>

<style>
:root{--bg:#f8f8f8;--card:#fff;--muted:#666;--text:#111;--ok:#16a34a;--danger:#dc2626;--border:#e5e5e5;--brand:#f97316}
*{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Ubuntu,Arial,sans-serif;background:var(--bg);color:var(--text)}
.hdr{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between;padding:16px 20px;background:linear-gradient(90deg,var(--brand),#ffb36b);color:#fff}
h1{margin:0;font-size:20px} .btn{border:1px solid var(--border);background:#fff;padding:8px 12px;border-radius:12px;cursor:pointer}
.btn.ok{background:var(--ok);color:#fff;border-color:transparent}.btn.danger{background:var(--danger);color:#fff;border-color:transparent}
.wrap{padding:12px 20px 24px;max-width:1300px;margin:0 auto} .grid{display:grid;grid-template-columns:1fr;gap:16px}
@media(min-width:1200px){.grid{grid-template-columns:1fr 2fr}} .card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:16px;box-shadow:0 1px 0 rgba(0,0,0,.03)}
label{font-size:13px;color:#444;display:block;margin-bottom:6px} input[type=text],input[type=number],textarea,select{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:12px;font-size:14px}
textarea{resize:vertical} .row{display:flex;gap:8px}.row>*{flex:1} .muted{color:#666}.title{font-weight:600;font-size:18px;margin-bottom:10px}
.k{display:grid;grid-template-columns:1fr;gap:12px}@media(min-width:900px){.k{grid-template-columns:repeat(3,1fr)}}
.order{border:1px solid var(--border);border-radius:12px;padding:12px}.order .head{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:#666}
.list{list-style:none;padding:0;margin:8px 0 0}.list li{display:flex;justify-content:space-between;padding:2px 0}
.totals{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-top:10px}
.pill{display:flex;align-items:center;justify-content:space-between;background:#f3f3f3;padding:8px 10px;border-radius:12px}
.queue{display:grid;grid-template-columns:1fr;gap:8px}@media(min-width:900px){.queue{grid-template-columns:1fr 1fr}}
.queue .item{border:1px solid var(--border);border-radius:12px;padding:10px;background:#fff}.badge{font-size:11px;padding:2px 6px;border-radius:999px;background:#eef}
.bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.on{color:#0a7;font-weight:600}.off{color:#fff;font-weight:600;opacity:.9}
footer{text-align:center;color:#666;font-size:12px;padding:18px}
dialog{border:0;border-radius:14px;max-width:880px;width:92%;padding:0} dialog form{padding:16px}
</style>
