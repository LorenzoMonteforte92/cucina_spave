<template>
  <div>
    <details open>
      <summary>Completati (<span>{{ completed.length }}</span>)</summary>
      <div class="k" style="margin-top:10px;">
        <div class="order" v-for="o in completed" :key="o.createdAt">
          <div class="head">
            <span>{{ o.table }}</span>
            <span>{{ new Date(o.createdAt).toLocaleTimeString() }} → {{ o.readyAt ? new Date(o.readyAt).toLocaleTimeString() : '' }}</span>
          </div>
          <ul class="list">
            <li v-for="it in o.items" :key="it.name"><span>{{ it.name }}</span><strong>{{ it.qty }}×</strong></li>
          </ul>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOrders } from '../stores/orders'
const orders = useOrders()
const completed = computed(()=> orders.completed)
</script>

<style scoped>
.order{border:1px solid var(--border);border-radius:12px;padding:12px}
.order .head{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:#666}
.list{list-style:none;padding:0;margin:8px 0 0}
.list li{display:flex;justify-content:space-between;padding:2px 0}
.k{display:grid;grid-template-columns:1fr;gap:12px}@media(min-width:900px){.k{grid-template-columns:repeat(3,1fr)}}
</style>
