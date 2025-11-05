<template>
  <div>
    <div class="row" style="align-items:center;justify-content:space-between;">
      <div class="title" style="margin:0;">Totale prodotti (pendenti)</div>
      <div class="muted">Voci: {{ orders.totals.length }}</div>
    </div>
    <div class="totals">
      <div class="pill" v-for="[name, qty] in orders.totals" :key="name">
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70%;">{{ name }}</span>
        <strong>{{ qty }}×</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrders } from '../stores/orders'
const orders = useOrders()
</script>
