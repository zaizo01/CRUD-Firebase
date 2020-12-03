import { createStore } from 'vuex'
import router from '../router'

export default createStore({
  state: {
    tareas: [],
    tarea: {
      id: '',
      nombre: '',
      categoria: [],
      estado: '',
      numero: 0,
      activo: true
    }
  },
  mutations: {
    cargar(state, payload){
      state.tareas = payload;
    },
    set(state, payload){
      state.tareas.push(payload);
      localStorage.setItem('tareas', JSON.stringify(state.tareas));
    },
    delete(state, payload){
      state.tareas = state.tareas.filter(item => item.id !== payload);
      localStorage.setItem('tareas', JSON.stringify(state.tareas));
    },
    tarea(state, payload){
      if (!state.tareas.find(item => item.id === payload)) {
        router.push('/');
        return;
      }
      state.tarea = state.tareas.find(item => item.id === payload);
    },
    update(state, payload){
      state.tareas = state.tareas.map(item => item.id === payload.id ? payload : item);
      router.push('/');
      localStorage.setItem('tareas', JSON.stringify(state.tareas));
    }
  },
  actions: {

    // GET tareas
    async cargarLocalStorage({commit}){
      try {
        const response = await fetch('https://udemy-api-70594.firebaseio.com/tareas.json');
        const dataDB = await response.json();
        const arrayTareas = [];
        for(let id in dataDB){
            arrayTareas.push(dataDB[id]);
        }
        commit('cargar', arrayTareas);

      } catch (error) {
        console.log(error);
      }
    },

    // POST tareas
    async setTareas({commit}, tarea){
      try {
        const response = await fetch(`https://udemy-api-70594.firebaseio.com/tareas/${tarea.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tarea)
        })

        const dataDB = await response.json();
        commit('set', dataDB);

      } catch (error) {
        console.log(error);
      }
    },

    // DELETE tareas
    async deleteTareas({commit}, id){
      try {
        await fetch(`https://udemy-api-70594.firebaseio.com/tareas/${id}.json`,{
          method: 'DELETE'
        })
        commit('delete', id);

      } catch (error) {
        console.log(error);
      }
    },
    setTarea({commit}, id){
      commit('tarea', id);
    },
    async updateTarea({commit}, tarea){
      const response = await fetch(`https://udemy-api-70594.firebaseio.com/tareas/${tarea.id}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarea)
      })
      const dataDB = await response.json();
      commit('update', dataDB);
    },

  },
  modules: {
  }
})
