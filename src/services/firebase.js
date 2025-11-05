import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, addDoc, onSnapshot, orderBy, query,
  doc, updateDoc, deleteDoc, getDocs, writeBatch
} from 'firebase/firestore'

let app = null
let db = null

export function initFirebase(configObj){
  app = initializeApp(configObj)
  db = getFirestore(app)
  localStorage.setItem('kds_fbconfig', JSON.stringify(configObj))
  return db
}

export function getDb(){ return db }

// ORDERS realtime
export function listenOrders(cb){
  const q = query(collection(db,'orders'), orderBy('createdAt','asc'))
  return onSnapshot(q, snap => {
    const arr = []
    snap.forEach(d => arr.push({ id:d.id, ...d.data() }))
    cb(arr)
  })
}

export async function addOrder(order){
  const ref = await addDoc(collection(db,'orders'), order)
  return ref.id
}

export async function patchOrder(id, patch){
  await updateDoc(doc(db,'orders', id), patch)
}

export async function deleteOrder(id){
  await deleteDoc(doc(db,'orders', id))
}

// RECIPES realtime
export function listenRecipes(cb){
  return onSnapshot(collection(db,'recipes'), snap => {
    const obj = {}
    snap.forEach(d => { obj[d.id] = d.data() })
    cb(obj)
  })
}

export async function saveAllRecipes(recipes){
  const col = collection(db,'recipes')
  const batch = writeBatch(db)
  const snap = await getDocs(col)
  snap.forEach(d => batch.delete(d.ref))
  Object.entries(recipes).forEach(([name, rec]) => {
    batch.set(doc(db,'recipes', name), rec)
  })
  await batch.commit()
}
