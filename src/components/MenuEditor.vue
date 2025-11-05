<template>
  <div>
    <h3>Modifica menù</h3>
    <div class="row">
      <div>
        <label>Seleziona voce</label>
        <select v-model="selected" @change="load">
          <option v-for="n in recipes.names" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <div>
        <label>Nuova voce (per aggiungere)</label>
        <input v-model="name" type="text" placeholder="Es. BlackBurger" />
      </div>
    </div>

    <div class="row" style="margin-top:8px;">
      <div>
        <label>Categoria</label>
        <select v-model="category" required>
          <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div>
        <label>Azioni</label>
        <div class="row">
          <button class="btn ok" type="button" @click="save">Salva / Aggiungi</button>
          <button class="btn" type="button" @click="remove">Elimina voce</button>
          <button class="btn" type="button" @click="$emit('close')">Chiudi</button>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:10px;">
      <div class="title" style="margin:0 0 8px;">Ingredienti / materie prime</div>
      <div>
        <div
          class="row"
          v-for="(it, idx) in items"
          :key="idx"
          style="margin-bottom:6px;"
        >
          <input v-model="it.name" type="text" placeholder="Ingrediente" />
          <input v-model.number="it.qty" type="number" step="0.01" min="0" />
          <input v-model="it.unit" type="text" placeholder="Unità (pz, fet., porz.)" />
          <button class="btn" type="button" @click="items.splice(idx, 1)">✕</button>
        </div>

        <div class="row" style="margin-top:8px;">
          <input
            v-model="newName"
            type="text"
            placeholder="Ingrediente (es. Hamburger 200g)"
          />
          <input
            v-model.number="newQty"
            type="number"
            step="0.01"
            min="0"
          />
          <input
            v-model="newUnit"
            type="text"
            placeholder="Unità (pz, fet., porz.)"
          />
          <button class="btn" type="button" @click="addIng">Aggiungi ingrediente</button>
        </div>
      </div>
    </div>

    <div style="margin-top:16px;">
      <h4 style="margin:0 0 8px;">Voci del menù per categoria</h4>
      <div class="k">
        <div class="card">
          <div class="title" style="margin:0 0 8px;">Appetizer</div>
          <div>
            <button
              v-for="n in recipes.byCategory.Appetizer"
              :key="n"
              class="btn"
              type="button"
              style="margin:4px 6px 0 0;"
              @click="edit(n)"
            >
              ✏️ {{ n }}
            </button>
          </div>
        </div>

        <div class="card">
          <div class="title" style="margin:0 0 8px;">Burgers</div>
          <div>
            <button
              v-for="n in recipes.byCategory.Burgers"
              :key="n"
              class="btn"
              type="button"
              style="margin:4px 6px 0 0;"
              @click="edit(n)"
            >
              ✏️ {{ n }}
            </button>
          </div>
        </div>

        <div class="card">
          <div class="title" style="margin:0 0 8px;">Dolci</div>
          <div>
            <button
              v-for="n in recipes.byCategory.Dolci"
              :key="n"
              class="btn"
              type="button"
              style="margin:4px 6px 0 0;"
              @click="edit(n)"
            >
              ✏️ {{ n }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRecipes, CATEGORIES } from '../stores/recipes'

const recipes = useRecipes()
const selected = ref(recipes.names[0] || '')
const name = ref(selected.value || '')
const category = ref('Appetizer')
const items = ref([])

const newName = ref('')
const newQty = ref(1)
const newUnit = ref('')
const cats = CATEGORIES

function load() {
  const r = recipes.recipes[selected.value] || { category: 'Appetizer', items: [] }
  name.value = selected.value
  category.value = r.category || 'Appetizer'
  items.value = (r.items || []).map((it) => ({ ...it }))
}

function edit(n) {
  selected.value = n
  load()
}

function addIng() {
  if (!newName.value.trim()) return
  items.value.push({
    name: newName.value.trim(),
    qty: Number(newQty.value || 0),
    unit: newUnit.value.trim()
  })
  newName.value = ''
  newQty.value = 1
  newUnit.value = ''
}

async function save() {
  const old = selected.value
  const n = (name.value || '').trim()
  if (!n) return alert('Nome obbligatorio')
  const payload = { category: category.value, items: items.value.filter((x) => x.name) }
  if (old !== n) delete recipes.recipes[old]
  recipes.upsertRecipe(n, payload)
  if (recipes.unsub) await recipes.persistCloud()
  selected.value = n
  alert('Salvato!')
}

async function remove() {
  const n = selected.value
  if (!n) return
  if (!confirm('Eliminare "' + n + '"?')) return
  recipes.deleteRecipe(n)
  if (recipes.unsub) await recipes.persistCloud()
  const first = recipes.names[0] || ''
  selected.value = first
  load()
}

onMounted(() => load())
watch(
  () => recipes.recipes,
  () => {
    if (!recipes.recipes[selected.value]) {
      selected.value = recipes.names[0] || ''
      load()
    }
  }
)
</script>

<style scoped>
.k {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 900px) {
  .k {
    grid-template-columns: repeat(3, 1fr);
  }
}
.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}
.title {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 10px;
}
.row {
  display: flex;
  gap: 8px;
}
.row > * {
  flex: 1;
}
</style>
