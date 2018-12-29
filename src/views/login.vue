<template>
  <v-app id='login' class='primary'>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card color='white' class='elevation-1 pa-3'>
              <v-card-text>
                <div class='layout column align-center'>
                  <img src='/static/m.png' alt='Vue Material Admin' width='120' height='120'>
                  <h1 class='flex my-4 primary--text'>Material Admin Template</h1>
                </div>
                <v-form>
                  <v-text-field
                    append-icon='person'
                    name='login'
                    label='Login'
                    type='text'
                    v-model='model.email'
                  ></v-text-field>
                  <v-text-field
                    append-icon='lock'
                    name='password'
                    label='Password'
                    id='password'
                    type='password'
                    v-model='model.password'
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn icon>
                  <v-icon color='blue'>fab fa-facebook-square fa-lg</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon color='red'>fab fa-google fa-lg</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon color='light-blue'>fab fa-twitter fa-lg</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn block color='primary' @click='login' :loading='loading'>Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    model: {
      email: '',
      password: ''
    }
  }),
  methods: {
    login () {
      // this.loading = true
      this.$store.dispatch('login', 0).then(() => {
        console.log(0)
        this.$router.push('/')
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
