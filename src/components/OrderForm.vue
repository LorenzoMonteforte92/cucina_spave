<template>
  <div>
    <div class="title">Nuovo ordine</div>
    <label>Tavolo</label>
    <input v-model="table" type="text" placeholder="Es. Nome Sala" />

    <div style="margin-top:12px;">
      <label>Aggiungi prodotti</label>
      <div class="row">
        <div class="dropdown">
          <input
            v-model="search"
            @input="onSearch"
            type="text"
            placeholder="Cerca nel menù…"
            autocomplete="off"
          />
          <div v-show="suggest.length" class="menu">
            <button
              v-for="name in suggest"
              :key="name"
              type="button"
              @click="pick(name)"
            >
              {{ name }}
            </button>
          </div>
        </div>
        <input v-model.number="qty" type="number" min="1" style="flex:0 0 90px;" />
        <button class="btn" style="flex:0 0 auto;" @click="addItem">Aggiungi</button>
      </div>
      <div class="muted" style="font-size:12px;margin-top:4px;">
        Menù modificabile in “Modifica menù”.
      </div>

      <div v-show="draft.length" style="margin-top:8px;">
        <div class="muted" style="font-size:13px;margin-bottom:4px;">Riepilogo ordine</div>
        <div class="chips">
          <span v-for="d in draft" :key="d.name" class="chip">
            <strong>{{ d.qty }}×</strong> {{ d.name }}
            <button class="btn" style="padding:2px 6px" @click="removeItem(d.name)">✕</button>
          </span>
        </div>
      </div>
    </div>

    <div style="margin-top:12px;">
      <label>Note (opzionale)</label>
      <textarea v-model="note" rows="2" placeholder="Es. senza salsa, allergeni, tempi…"></textarea>
    </div>

    <div class="row" style="margin-top:12px;justify-content:flex-end;">
      <button class="btn ok" @click="submit">Invia in cucina</button>
      <button class="btn" @click="cancel">Annulla</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrders } from '../stores/orders'
import { useRecipes } from '../stores/recipes'

const orders = useOrders()
const recipes = useRecipes()

const table = ref('')
const search = ref('')
const qty = ref(1)
const draft = ref([])
const note = ref('')

const names = computed(() => Object.keys(recipes.recipes).sort())
const suggest = ref([])

function onSearch() {
  const q = search.value.trim().toLowerCase()
  suggest.value = q ? names.value.filter((n) => n.toLowerCase().includes(q)).slice(0, 60) : []
}
function pick(name) {
  search.value = name
  suggest.value = []
}
function addItem() {
  const name = (search.value || '').trim()
  const q = Math.max(1, Number(qty.value || 1))
  if (!name) return
  const i = draft.value.findIndex((d) => d.name === name)
  if (i >= 0) draft.value[i].qty += q
  else draft.value.push({ name, qty: q })
  search.value = ''
  qty.value = 1
}
function removeItem(name) {
  draft.value = draft.value.filter((d) => d.name !== name)
}
async function submit() {
  const t = (table.value || '').trim()
  if (!t || !draft.value.length) return
  const order = {
    table: t,
    items: draft.value.slice(),
    note: (note.value || '').trim(),
    createdAt: new Date().toISOString()
  }
  await orders.add(order)
  draft.value = []
  table.value = ''
  note.value = ''
  search.value = ''
  qty.value = 1
}
function cancel() {
  draft.value = []
  table.value = ''
  note.value = ''
  search.value = ''
  qty.value = 1
}
</script>

<style scoped>
.dropdown {
  position: relative;
}
.menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  max-height: 260px;
  overflow: auto;
  z-index: 5;
}
.menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border: 0;
  background: #fff;
  cursor: pointer;
}
.menu button:hover {
  background: #f5f5f5;
}
.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  background: #f1f1f1;
  padding: 6px 8px;
  border-radius: 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
