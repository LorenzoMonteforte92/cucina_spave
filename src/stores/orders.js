import { defineStore } from 'pinia'
import { getDb, listenOrders, addOrder, patchOrder, deleteOrder } from '../services/firebase'
import { useRecipes } from './recipes'

export const useOrders = defineStore('orders', {
  state: () => ({
    orders: JSON.parse(localStorage.getItem('kds_orders')||'[]'),
    completed: JSON.parse(localStorage.getItem('kds_completed')||'[]'),
    unsub: null,
    syncOn: false
  }),
  getters: {
    pendingCount(state){ return state.orders.length },
    groupedByTable(state){
      const map = new Map()
      for(const o of state.orders){
        if(!map.get(o.table)) map.set(o.table, [])
        map.get(o.table).push(o)
      }
      return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]))
    },
    totals(state){
      const m = new Map()
      for(const o of state.orders) for(const it of o.items) m.set(it.name, (m.get(it.name)||0)+Number(it.qty||0))
      return Array.from(m.entries()).sort((a,b)=>a[0].localeCompare(b[0]))
    },
    queues(state){
      const recipes = useRecipes()
      const arr = state.orders.slice().sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt))
      const qBurgers = [], qFritti = []
      for(const o of arr){
        for(const it of o.items){
          const cat = recipes.categoryOf(it.name)
          const entry = { name: it.name, qty: it.qty, table: o.table, ts: o.createdAt }
          if(cat === 'Burgers') qBurgers.push(entry)
          else if(cat === 'Appetizer') qFritti.push(entry)
        }
      }
      return { qBurgers, qFritti }
    }
  },
  actions: {
    saveLocal(){
      localStorage.setItem('kds_orders', JSON.stringify(this.orders))
      localStorage.setItem('kds_completed', JSON.stringify(this.completed))
    },
    startRealtime(){
      if(!getDb()) return
      this.unsub && this.unsub()
      this.unsub = listenOrders((arr)=>{
        this.orders = arr
        this.syncOn = true
        this.saveLocal()
      })
    },
    stopRealtime(){
      this.unsub && this.unsub()
      this.unsub = null
      this.syncOn = false
    },
    async add(order){
      if(getDb()){
        const id = await addOrder(order)
        return id
      } else {
        this.orders.unshift({ ...order, id: crypto.randomUUID?.() || Math.random().toString(36).slice(2) })
        this.saveLocal()
      }
    },
    async markReady(id){
      const idx = this.orders.findIndex(o=>o.id===id)
      if(idx>=0){
        const done = this.orders.splice(idx,1)[0]
        done.readyAt = new Date().toISOString()
        this.completed.unshift(done)
        this.saveLocal()
        if(getDb()) try{ await patchOrder(id, { status:'ready', readyAt: done.readyAt }) }catch(e){}
      }
    },
    async remove(id){
      this.orders = this.orders.filter(o=>o.id!==id)
      this.saveLocal()
      if(getDb()) try{ await deleteOrder(id) }catch(e){}
    }
  }
})
