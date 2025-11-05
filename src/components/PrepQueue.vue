<template>
  <div>
    <div class="title">Coda di preparazione (ordine di arrivo)</div>
    <div class="queue">
      <div>
        <div class="muted" style="margin-bottom:6px;">Burgers</div>
        <div v-if="orders.queues.qBurgers.length">
          <div class="item" v-for="(e, i) in orders.queues.qBurgers" :key="i">
            <div class="row" style="align-items:center;justify-content:space-between;">
              <strong>{{ e.name }}</strong>
              <span class="badge">{{ e.qty }}×</span>
            </div>
            <div class="muted" style="font-size:12px;">Tavolo: {{ e.table }} • {{ new Date(e.ts).toLocaleTimeString() }}</div>
          </div>
        </div>
        <div v-else class="muted">—</div>
      </div>
      <div>
        <div class="muted" style="margin-bottom:6px;">Fritti / Appetizer</div>
        <div v-if="orders.queues.qFritti.length">
          <div class="item" v-for="(e, i) in orders.queues.qFritti" :key="i">
            <div class="row" style="align-items:center;justify-content:space-between;">
              <strong>{{ e.name }}</strong>
              <span class="badge">{{ e.qty }}×</span>
            </div>
            <div class="muted" style="font-size:12px;">Tavolo: {{ e.table }} • {{ new Date(e.ts).toLocaleTimeString() }}</div>
          </div>
        </div>
        <div v-else class="muted">—</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrders } from '../stores/orders'
const orders = useOrders()
</script>
