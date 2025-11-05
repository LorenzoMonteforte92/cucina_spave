<template>
  <div>
    <div class="row" style="align-items:center;justify-content:space-between;margin:6px 0 10px;">
      <div class="title" style="margin:0;">Ordini pendenti</div>
      <div class="muted">Totale ordini: {{ orders.pendingCount }}</div>
    </div>
    <div class="grid-pending">
      <template v-if="orders.groupedByTable.length">
        <div class="table-card" v-for="[table, arr] in orders.groupedByTable" :key="table">
          <div class="hdr">
            <div>
              <div class="muted" style="font-size:12px;">Tavolo</div>
              <div style="font-weight:600;">{{ table }}</div>
            </div>
            <div class="muted" style="font-size:12px;">{{ arr.length }} ordine/i</div>
          </div>
          <div class="k">
            <div class="order" v-for="o in arr" :key="o.id">
              <div class="head"><span>{{ new Date(o.createdAt).toLocaleTimeString() }}</span></div>
              <ul class="list">
                <li v-for="it in o.items" :key="it.name">
                  <span>{{ it.name }}</span><strong>{{ it.qty }}×</strong>
                </li>
              </ul>
              <div v-if="o.note" class="muted" style="margin-top:6px;font-style:italic;">💬 {{ o.note }}</div>
              <div class="row" style="gap:8px;margin-top:8px;">
                <button class="btn ok" @click="orders.markReady(o.id)">Pronto</button>
                <button class="btn" @click="orders.remove(o.id)">Elimina</button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="card muted">Nessun ordine pendente.</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useOrders } from '../stores/orders'
const orders = useOrders()
</script>

<style scoped>
.grid-pending{display:grid;grid-template-columns:1fr;gap:12px}
@media(min-width:900px){.grid-pending{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1250px){.grid-pending{grid-template-columns:repeat(3,1fr)}}
.table-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:14px}
.table-card .hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.order{border:1px solid var(--border);border-radius:12px;padding:12px}
.order .head{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:#666}
.list{list-style:none;padding:0;margin:8px 0 0}
.list li{display:flex;justify-content:space-between;padding:2px 0}
</style>
