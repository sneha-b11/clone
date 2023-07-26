import Vue from 'vue'
import Vuex from 'vuex'
import {auth,db} from '@/firebase/firebaseInit.js';
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userProfile: {},
    options:[]
  },
  mutations: {
    setUserProfile(state,val){
      state.userProfile = val
    },
  },
  actions: {
    edit_data({commit},val){
      console.log(commit)
      console.log(val)
      for(let i =0; i < this.state.options.length;i++){
        if(this.state.options[i].value == val.value){
          this.state.options[i] = val
        }
      }
      console.log(this.state.options)
    },
    
    async login({dispatch}, form) {
      const {user} = await auth.signInWithEmailAndPassword(form.email,form.password)
      dispatch('fetchUserProfile', user)
    },
    async signUp({dispatch}, form) {
      const {user} = await auth.createUserWithEmailAndPassword(form.email,form.password)
      await db.collection('users').doc(user.uid).set({
        name:form.name,
        dob: form.dob
      })
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({commit}, user) {
      const userProfile = await db.collection('users').doc(user.uid).get()
      commit('setUserProfile', userProfile.data())
      // if(router.currentRoute.path!= '/'){
        router.push('/')
      // }
    },
    async logout({commit}){
      await auth.signOut()
      commit('setUserProfile',{})
      if(router.currentRoute.path!= '/login'){  
        router.push('/login')
      }
    },

  },
  modules: {
  }
})
