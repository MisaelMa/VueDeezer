<template>
  <v-app >
    <Menu v-if="$store.getters.isLoggedIn"></Menu>

    <v-content>
     <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Menu from './components/Menu'

export default {
  name: 'App',
  components: {
    Menu
  },
  data () {
    return {
      //
    }
  },
  mounted () {

  },
  methods: {
  }
}
</script>
