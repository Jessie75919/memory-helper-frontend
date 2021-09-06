<template>
  <v-app>
    <v-app-bar dark color="secondary" flat app>
      <v-toolbar-title v-if="isAuthenticated">{{ $route.name }}</v-toolbar-title>
      <v-toolbar-title v-else>Memory Helper</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn depressed color="secondary" @click="logout" v-if="isAuthenticated">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main app>
      <router-view/>
    </v-main>

    <v-bottom-navigation dark app v-if="isAuthenticated">
      <div class="d-flex justify-space-around align-self-center" style="width: 100%">
        <v-btn href="/review">
          <span>Review</span>
          <v-icon>mdi-book-open</v-icon>
        </v-btn>
        <v-btn href="/create">
          <span>Create</span>
          <v-icon>mdi-pencil-box</v-icon>
        </v-btn>
      </div>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  name: 'App',
  data: () => ({}),
  computed: {
    ...mapGetters([
      'isAuthenticated',
    ]),
  },
  methods:{
    ...mapActions(['logout'])
  }
};
</script>
