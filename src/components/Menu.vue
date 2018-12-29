<template>
  <div>
    <v-navigation-drawer
      dark
      :mini-variant='miniVariant'
      :clipped='clipped'
      v-model='drawer'
      enable-resize-watcher
      app
      fixed
      width='250'
    >
     <v-img :aspect-ratio="16/9" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
        <v-layout pa-2 column fill-height class="lightbox white--text">
          <v-spacer></v-spacer>
          <v-flex shrink>
              <v-avatar>
                <img
                  :src="'https://cdn.vuetifyjs.com/images/cards/girl.jpg'"
                  alt="John"
                >
              </v-avatar>
            <div class="subheading">Jonathan Lee</div>
            <div class="body-1">heyfromjonathan@gmail.com</div>
          </v-flex>
        </v-layout>
      </v-img>
      <span @mouseleave="method">
        <v-list dense>
          <span v-for='(item, i) in rutasuser' :key='i'>
            <v-list-group v-if='item.children.length > 0'>
              <v-list-tile slot='activator' @mouseover='hovermenu'>
                <v-list-tile-action class='lista'>
                  <v-btn icon>
                    <v-icon color='grey darken-3' class='lista'>{{ item.icon }}</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title style='font-size: 14px;'>{{ item.nombre }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list style='padding: 0px;'>
                <span v-for='(Subitem, i) in item.children' :key='i'>

                  <v-list-group v-if="Subitem.children.length > 0">
                    <v-list-tile slot='activator' @mouseover='hovermenu'>
                      <v-list-tile-action style='min-width:25px'></v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title style='font-size: 14px;'>
                          <v-icon class='pr-1'>{{ Subitem.icon }}</v-icon>
                          {{ Subitem.nombre }}
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile
                      @mouseover='hovermenu'
                      v-for='(subItem,index) in Subitem.children'
                      :to='subItem.url'
                      :key='index'
                    >
                      <v-list-tile-action style='min-width:42px'></v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title style='font-size: 14px;'>
                          <v-icon class='pr-2'>{{ subItem.icon }}</v-icon>
                          {{ subItem.nombre}}
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list-group>

                  <v-list-tile v-else @mouseover='hovermenu' :to='Subitem.url'>
                    <v-list-tile-action style='min-width:25px'></v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title style='font-size: 14px;'>
                        <v-icon class='pr-2' @mouseover='hovermenu'>{{ Subitem.icon }}</v-icon>
                        {{ Subitem.nombre }}
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </span>
              </v-list>
            </v-list-group>

            <v-list-tile v-else @mouseover='hovermenu' :to='item.url'>
              <v-list-tile-action class='lista'>
                <v-btn icon>
                  <v-icon color='grey darken-3' class='lista'>{{ item.icon }}</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title :to='item.url' style='font-size: 14px;'>{{ item.nombre }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </span>
        </v-list>
      </span>
    </v-navigation-drawer>

    <v-toolbar app :clipped-left='clipped' height='54' color='primary' dark  extended>
      <v-toolbar-side-icon @click.stop='drawer = !drawer'></v-toolbar-side-icon>

      <v-toolbar-title  v-text='title'></v-toolbar-title>

      <v-toolbar-title slot="extension" v-text='title'></v-toolbar-title>
      <v-spacer></v-spacer>
        <v-autocomplete
      :items="items"
      v-model="select"
      cache-items
      class="mx-3"
      flat
      hide-no-data
      hide-details
      label="What state are you from?"
      solo-inverted
    ></v-autocomplete>

      <v-menu offset-y transition='slide-x-transition' bottom>
        <v-btn
              slot="activator"
              dark
              icon
            >
              <v-icon>more_vert</v-icon>
            </v-btn>

        <v-card>
          <v-divider></v-divider>
          <v-list>
            <v-list-tile @click="method">
              <v-list-tile-action>
                <v-icon>power_settings_new</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>Cerrar sesión</v-list-tile-title>
            </v-list-tile>
          </v-list>

          <!--<v-card-actions>
            <v-spacer></v-spacer>

            <v-btn flat @click='menu = false'>Cancel</v-btn>
            <v-btn color='primary' flat @click='menu = false'>Save</v-btn>
          </v-card-actions>-->
        </v-card>
      </v-menu>
      <!-- <v-btn
          icon
          @click.native.stop='rightDrawer = !rightDrawer'
        >
          <v-badge left color='red'>
            <span slot='badge'>!</span>
            <v-icon>notification_important</v-icon>
          </v-badge>
      </v-btn>-->
    </v-toolbar>

  </div>
</template>
<style scoped>
.v-list__tile__action {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  min-width: 40px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.v-progress-linear {
  background: transparent;
  margin: 0px;
  overflow: hidden;
  position: relative;
  width: 100%;
}
</style>
<script>
export default {
  name: 'Menu',
  data () {
    return {
      authorized: false,
      miniVariant: false,
      menufull: false,
      right: true,
      rightDrawer: false,
      clipped: true,
      drawer: true,
      fixed: true,
      msg: 'FirstRoute',
      rutasuser: [],
      snackbar: false,
      timenotification: 6000,
      notificationtext: '',
      notificationcolor: ' ',
      title: 'VueDeezer',
      fav: true,
      menumessage: false,
      message: false,
      items: [],
      select: []
    }
  },
  computed: {

  },
  mounted: function () {
    // this.sessionmount()
  },
  methods: {
    method: function () {

    }
  }
}
</script>
