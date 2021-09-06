<template>
  <v-container>
    <v-row>
      <v-col>
        <v-tabs v-model="selected_tab" @change="onTabChange">
          <v-tab v-for="tab in tabs" :key="tab.val">{{ tab.label }}</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-alert v-if="show_error" border="top" color="red lighten-2" dark>
      {{ error_message }}
    </v-alert>

    <!-- Question Lists =============================================== -->
    <v-row v-for="(question, i) in questions" :key="'q_' + question.id" v-if="questions">
      <v-col>
        <v-card class="mx-auto">
          <v-toolbar color="cyan darken-1" dark dense flat>
            <v-toolbar-title class="text-body-3">
              {{ question.content }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <p class="text-caption mt-4">
              <span class="font-weight-bold">{{ question.count_of_seen }}</span> times
            </p>
            <v-btn icon class="ml-auto" @click="openActionsPanel(question)">
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text v-if="question.show_answer === true && question.answers.length > 0">
            <span class="text--primary content_pre">{{ question.answers[0].content }}</span>
          </v-card-text>
          <v-card-actions v-if="question.answers.length > 0">
            <v-btn text block color="indigo" class="text-center"
                   v-if="question.show_answer === false"
                   @click="question.show_answer = true">
              Show Answer
            </v-btn>
            <v-btn block outlined color="teal"
                   v-else
                   @click="question.show_answer = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete / Edit panel ========================================== -->
    <v-bottom-sheet v-model="show_sheet">
      <v-sheet class="text-center" height="200px" v-if="selected_question">
        <div style="width: 90%" class="mx-auto">
          <div class="text-h6 text--primary text-truncate pa-2">
            {{ selected_question.content }}
          </div>
          <div class="text-truncate pa-2" v-if="selected_question">
            {{ selected_question.answers[0].content }}
          </div>
          <v-btn class="mt-3" rounded block dark color="red lighten-1" @click="attemptToRemove">
            Delete
          </v-btn>
          <v-btn class="mt-5" rounded block dark color="blue lighten-1" @click="toEdit">
            Edit
          </v-btn>
        </div>
      </v-sheet>
    </v-bottom-sheet>

    <!-- Confirming Panel ========================================= -->
    <v-snackbar v-model="should_show_remove_snackbar">
      {{ snackbar_message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="should_show_remove_snackbar = false">
          Cancel
        </v-btn>
        <v-btn color="blue" text v-bind="attrs" @click="remove">
          Sure
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Updating Question Panel ======================================= -->
    <UpdatingModal
        v-if="selected_question"
        ref="updating_modal"
        :question="selected_question"
        @submit-success="onSubmitSuccess"
        @submit-failed="onSubmitFailed"
    />

    <v-btn v-if="questions"
        color="deep-orange" dark fixed bottom right fab
           style="bottom: 13vh"
           :href="studyUrl"
    >
      <v-icon>mdi-book-open-page-variant</v-icon>
    </v-btn>

  </v-container>
</template>

<script>
import axios from 'axios';
import UpdatingModal from '@/components/modals/UpdatingModal';

export default {
  name: 'ReviewPage',
  data() {
    return {
      questions: null,
      show_error: false,
      error_message: '',
      tabs: [
        {val: 'today', label: 'Today'},
        {val: 'week', label: 'This Week'},
        {val: 'month', label: 'This Month'},
      ],
      selected_tab: 0,
      show_sheet: false,
      should_show_remove_snackbar: false,
      selected_question: null,
      snackbar_message: '',
    };
  },

  components: {UpdatingModal},

  methods: {
    updateLocalData(question) {
      const _q = this.questions.find(q => q.id === question.id);
      _q.content = question.content;
      _q.answers[0] = question.answers[0];
    },
    onSubmitSuccess(res) {
      this.updateLocalData(res.data);
      this.$refs.updating_modal.close();
      this.closeActionsPanel();
    },
    onSubmitFailed(err) {
      this.show_error = true;
      this.error_message = err;
    },
    closeActionsPanel() {
      this.selected_question = null;
      this.show_sheet = false;
    },
    closeConfirmingPanel() {
      this.should_show_remove_snackbar = false;
    },
    openActionsPanel(question) {
      this.show_sheet = true;
      this.selected_question = question;
    },
    remove() {
      const q = this.selected_question;
      if (!q) {
        return false;
      }
      axios.delete(`/api/questions/${ q.id }`).then(_ => {
        const idx = this.questions.findIndex(item => item.id === q.id);
        if (idx === -1) {
          return;
        }

        this.questions.splice(idx, 1);
        this.closeActionsPanel();
        this.closeConfirmingPanel();
      }).catch(err => {
        this.show_error = true;
        this.error_message = err;
      });
    },
    toEdit() {
      this.$refs.updating_modal.open();
    },
    attemptToRemove() {
      if (!this.selected_question) {
        return false;
      }

      this.should_show_remove_snackbar = true;
      this.snackbar_message = `Are you sure to remove "${ this.selected_question.content }"?`;
    },
    loadPage() {
      this.resetError()
      this.questions = [];
      axios.get(`/api/questions?q=${ this.mode }`).then(res => {
        this.questions = res.data.map(item => ({
          show_answer: false,
          ...item,
        }));
      }).catch(err => {
        this.show_error = true;
        this.error_message = err;
      });
    },
    resetError() {
      this.show_error = false;
      this.error_message = ""
    },
    onTabChange(e) {
      this.selected_tab = e;
      this.loadPage();
    },
  },
  computed: {
    mode() {
      return this.tabs[this.selected_tab].val;
    },
    studyUrl() {
      return `/study/${ this.mode }`;
    },
  },
  watch: {
    show_sheet(newVal) {
      if (newVal === false) {
        this.closeActionsPanel();
      }
    },
  },
  created() {
    this.loadPage();
  },
};
</script>

<style scoped>
.content_pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
}
</style>