<template>
  <div class="menu-editor-backdrop" @click.self="$emit('close')">
    <div class="menu-editor-panel" @click.stop>
      <button
        class="menu-editor-close"
        type="button"
        aria-label="Chiudi"
        @click="$emit('close')"
      >
        ✕
      </button>

      <h3>Modifica menù</h3>
      <div class="menu-editor-layout">
        <div class="menu-editor-main">
          <div class="row">
            <div>
              <label>Seleziona voce</label>
              <select v-model="selected" @change="load">
                <option v-for="n in recipes.names" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="new-entry">
              <label>&nbsp;</label>
              <button class="btn ok" type="button" @click="openNewEntryForm">Nuova voce</button>
            </div>
          </div>

          <div class="row" style="margin-top:8px;">
            <div>
              <label>Nome voce</label>
              <input v-model="name" type="text" placeholder="Es. BlackBurger" />
            </div>
            <div>
              <label>Categoria</label>
              <select v-model="category" required>
                <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>

          <div class="row" style="margin-top:8px;">
            <div>
              <label>Azioni</label>
              <div class="row">
                <button class="btn ok" type="button" @click="save">Salva Modifiche</button>
                <button class="btn" type="button" @click="remove">Elimina voce</button>
              </div>
            </div>
            <div class="spacer"></div>
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
                <input v-model.number="newQty" type="number" step="0.01" min="0" />
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
      </div>
    </div>
  </div>

  <div v-if="showNewForm" class="modal-backdrop">
    <form class="modal" @submit.prevent="saveNewEntry">
      <h4>Nuova voce</h4>
      <div class="row">
        <div>
          <label>Nome voce</label>
          <input v-model="newEntryName" type="text" placeholder="Es. BlackBurger" />
        </div>
        <div>
          <label>Categoria</label>
          <select v-model="newEntryCategory" required>
            <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div class="card" style="margin-top:16px;">
        <div class="title" style="margin:0 0 8px;">Ingredienti</div>
        <div>
          <div
            class="row"
            v-for="(it, idx) in newEntryItems"
            :key="idx"
            style="margin-bottom:6px;"
          >
            <input v-model="it.name" type="text" placeholder="Ingrediente" />
            <input v-model.number="it.qty" type="number" step="0.01" min="0" />
            <input v-model="it.unit" type="text" placeholder="Unità (pz, fet., porz.)" />
            <button class="btn" type="button" @click="newEntryItems.splice(idx, 1)">✕</button>
          </div>

          <div class="row" style="margin-top:8px;">
            <input
              v-model="newEntryIngName"
              type="text"
              placeholder="Ingrediente (es. Hamburger 200g)"
            />
            <input v-model.number="newEntryIngQty" type="number" step="0.01" min="0" />
            <input v-model="newEntryIngUnit" type="text" placeholder="Unità (pz, fet., porz.)" />
            <button class="btn" type="button" @click="addNewEntryIng">Aggiungi ingrediente</button>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn ok" type="submit">Salva</button>
        <button class="btn" type="button" @click="closeNewEntryForm">Annulla</button>
      </div>
    </form>
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

const showNewForm = ref(false)
const newEntryName = ref('')
const newEntryCategory = ref(cats[0] || 'Appetizer')
const newEntryItems = ref([])
const newEntryIngName = ref('')
const newEntryIngQty = ref(1)
const newEntryIngUnit = ref('')

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

function openNewEntryForm() {
  newEntryName.value = ''
  newEntryCategory.value = cats[0] || 'Appetizer'
  newEntryItems.value = []
  newEntryIngName.value = ''
  newEntryIngQty.value = 1
  newEntryIngUnit.value = ''
  showNewForm.value = true
}

function closeNewEntryForm() {
  showNewForm.value = false
}

function addNewEntryIng() {
  if (!newEntryIngName.value.trim()) return
  newEntryItems.value.push({
    name: newEntryIngName.value.trim(),
    qty: Number(newEntryIngQty.value || 0),
    unit: newEntryIngUnit.value.trim()
  })
  newEntryIngName.value = ''
  newEntryIngQty.value = 1
  newEntryIngUnit.value = ''
}

async function saveNewEntry() {
  const n = (newEntryName.value || '').trim()
  if (!n) return alert('Nome obbligatorio')
  const payload = {
    category: newEntryCategory.value,
    items: newEntryItems.value.filter((x) => x.name)
  }
  recipes.upsertRecipe(n, payload)
  if (recipes.unsub) await recipes.persistCloud()
  selected.value = n
  showNewForm.value = false
  load()
  alert('Voce aggiunta!')
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
.new-entry button {
  width: 100%;
  height: 61%;
}
.menu-editor-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 900;
}
.menu-editor-panel {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px 24px;
  width: min(960px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
.menu-editor-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.menu-editor-main {
  flex: 1;
}
@media (min-width: 1024px) {
  .menu-editor-layout {
    flex-direction: row;
    align-items: flex-start;
  }
  .menu-editor-main {
    flex: 3;
  }
}
.menu-editor-close {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.05);
  font-size: 20px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.menu-editor-close:hover {
  background: rgba(0, 0, 0, 0.1);
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: min(640px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
.modal h4 {
  margin-top: 0;
}
.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
