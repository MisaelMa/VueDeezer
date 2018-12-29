<template>
<v-container>

  <v-data-table
    :headers="headers"
    :items="music"
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td> <v-avatar>
      <img
        :src="props.item.artist.picture_small"
        alt="John"
      >
    </v-avatar></td>
      <td class="text-xs-left">{{ props.item.title }}</td>
      <td class="text-xs-left">{{ props.item.artist.name }}</td>
      <td class="text-xs-left">{{ props.item.album.title }}</td>
      <td class="text-xs-right">{{ props.item.duration }}</td>
      <td class="text-xs-right"><v-btn @click="getTrack( props.item.id)">track</v-btn></td>
    </template>
  </v-data-table>
</v-container>
</template>

<script lang="ts">
export default {
  data: () => ({
    loading: false,
    headers: [
      {
        text: 'picture',
        align: 'left',
        sortable: false,
        value: 'picture'
      },
      { text: 'TRACK', value: 'title' },
      { text: 'ARTIST', value: 'artist' },
      { text: 'ALBUM', value: 'album' },
      { text: 'DURATION', value: 'protein' },
      { text: 'Iron (%)', value: 'iron' }
    ],
    music: []
  }),
  mounted: function () {
    this.getlist()
  },
  methods: {
    getlist: function () {
      // this.loading = true
      /* this.$store.dispatch('getMyPlaylists',this.$store.getters.userids).then(response=>{
          this.model.email = response.data
        }).catch(error=>{
          console.log(error);

        }) */

      this.$store.dispatch('search').then(response => {
        this.music = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    getTrack: function (id) {
      this.$store.dispatch('Track', id).then(response => {
        this.music = response.data
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
