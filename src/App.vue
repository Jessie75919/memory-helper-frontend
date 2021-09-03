<template>
  <v-app>
    <v-app-bar dark color="secondary" flat app>
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
    </v-app-bar>

    <v-main app>
      <router-view/>
    </v-main>

    <v-bottom-navigation dark app>
      <div class="d-flex justify-space-around align-self-center" style="width: 100%">
        <v-btn href="/review">
          <span>Review</span>
          <v-icon>mdi-book-open</v-icon>
        </v-btn>
        <v-btn href="/create">
          <span>Create</span>
          <v-icon>mdi-pencil-box</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon large>mdi-format-list-bulleted-square</v-icon>
        </v-btn>
      </div>
    </v-bottom-navigation>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    
  }),
};
</script>
