import { defineStore } from 'pinia'
import { getDb, listenRecipes, saveAllRecipes } from '../services/firebase'

export const CATEGORIES = ['Appetizer','Burgers','Dolci']

const DEFAULT_RECIPES = {
  'Patatine fritte': { category:'Appetizer', items:[ {name:'Patate fritte (grandi)', qty:1, unit:'porz.'} ] },
  'Nachos': { category:'Appetizer', items:[ {name:'Nachos', qty:1, unit:'porz.'}, {name:'Salsa cheddar', qty:1, unit:'porz.'} ] },
  'Anelli di cipolla': { category:'Appetizer', items:[ {name:'Anelli di cipolla', qty:8, unit:'pz'} ] },
  'Nuggets di pollo': { category:'Appetizer', items:[ {name:'Nuggets', qty:6, unit:'pz'} ] },
  'Hamburger': { category:'Burgers', items:[ {name:'Pane burger', qty:1, unit:'pz'}, {name:'Hamburger 200g', qty:1, unit:'pz'} ] },
  'Cheeseburger': { category:'Burgers', items:[ {name:'Pane burger', qty:1, unit:'pz'}, {name:'Hamburger 200g', qty:1, unit:'pz'}, {name:'Cheddar', qty:1, unit:'fet.'} ] },
  'BlackBurger': { category:'Burgers', items:[ {name:'Pane Nero', qty:1, unit:'pz'}, {name:'Hamburger 200g', qty:1, unit:'pz'}, {name:'Cheddar', qty:1, unit:'fet.'}, {name:'Pancetta', qty:2, unit:'fet.'} ] },
  'Veggie Burger': { category:'Burgers', items:[ {name:'Pane burger', qty:1, unit:'pz'}, {name:'Burger vegetale', qty:1, unit:'pz'} ] },
  'Donuts': { category:'Dolci', items:[ {name:'Donut', qty:1, unit:'pz'} ] }
}

export const useRecipes = defineStore('recipes', {
  state: () => ({
    recipes: JSON.parse(localStorage.getItem('kds_recipes')||'null') || DEFAULT_RECIPES,
    unsub: null
  }),
  getters: {
    names(state){ return Object.keys(state.recipes).sort() },
    categoryOf: (state) => (name) => state.recipes[name]?.category || 'Appetizer',
    itemsOf: (state) => (name) => state.recipes[name]?.items || [],
    byCategory(state){
      const buckets = { Appetizer:[], Burgers:[], Dolci:[] }
      for(const n of Object.keys(state.recipes).sort()){
        const cat = state.recipes[n]?.category || 'Appetizer'
        buckets[cat]?.push(n)
      }
      return buckets
    }
  },
  actions: {
    startRealtime(){
      const db = getDb()
      if(!db) return
      this.unsub && this.unsub()
      this.unsub = listenRecipes((obj)=>{
        if(Object.keys(obj).length){
          this.recipes = obj
          localStorage.setItem('kds_recipes', JSON.stringify(this.recipes))
        }
      })
    },
    stopRealtime(){
      this.unsub && this.unsub()
      this.unsub = null
    },
    saveLocal(){
      localStorage.setItem('kds_recipes', JSON.stringify(this.recipes))
    },
    async persistCloud(){
      if(!getDb()) return
      await saveAllRecipes(this.recipes)
    },
    upsertRecipe(name, payload){
      this.recipes = { ...this.recipes, [name]: payload }
      this.saveLocal()
    },
    deleteRecipe(name){
      const r = { ...this.recipes }
      delete r[name]
      this.recipes = r
      this.saveLocal()
    }
  }
})
