const {Deezer} = require('../../plugins/DeezerApi');

var DeezerApi = new Deezer('amir');
const state = {
  isLoggedIn:  localStorage.getItem('Auth') || 'false',
  userid: localStorage.getItem('userId') || '',
  apiQueries: {
      api_version: '1.0',
      api_token: localStorage.getItem('api_token') || 'null',
      input: '3'
  }
}


const getters = {
  isLoggedIn (state: { isLoggedIn: any; }) {
    return JSON.parse(state.isLoggedIn)
  },
  apiQueries (state: { apiQueries: any; }) {
    return state.apiQueries
  },
  userids (state: { userid: any; }) {
    return state.userid
  },
}
const actions = {
  login ({ commit, dispatch }: any, data: any) {
      

    return new Promise((resolve, reject) => {
      DeezerApi.login('developers@colegioinglesplaya.com','ciclo2018',function(data: any){
        if(data){
          commit('login')
          resolve(true)
        }else{
          reject(data);
        }
      })
    })

  },
  getMyPlaylists ({ commit }: any,data: any) {
    return new Promise((resolve, reject) => {
      DeezerApi.getMyPlaylists(data,function(data: any){
          resolve(data)
        
      })
    })
  },
  search ({ commit }: any) {
    return new Promise((resolve, reject) => {
      DeezerApi.search('rammstein','functidon',function(data: any){

        console.log(data)
          resolve(data)
      })
    })
  },
  Track ({ commit }: any,data:any) {
    return new Promise((resolve, reject) => {
      DeezerApi.getTrack(data,'functidon',function(data: any){

        console.log(data)
          resolve(data)
      })
    })
  }
}
const mutations = {
  login (state: { isLoggedIn : string; }) {
    state.isLoggedIn = JSON.parse('true');
    localStorage.setItem('Auth','true')
  },
}
export default {
  state,
  actions,
  mutations,
  getters
}
