<template>
  <v-container>
    <v-row>
      <v-col>
        <EditComponent
            :question="question"
            :answer="answer"
            @submit-success="onSubmitSuccess"
            @submit-failed="onSubmitFailed"
        />
      </v-col>
    </v-row>

    <v-snackbar v-model="should_show_snackbar" :timeout="timeout">
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="should_show_snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import EditComponent from '@/components/EditComponent';

export default {
  name: 'CreatePage',
  components: {EditComponent},
  data() {
    return {
      question: '',
      answer: '',
      should_show_snackbar: false,
      message: '',
      timeout: 2000,
    };
  },
  methods: {
    onSubmitSuccess(res) {
      this.message = 'Save Successfully!';
      this.should_show_snackbar = true;
    },
    onSubmitFailed(err) {
      this.message = 'Oops!! Save failed !!';
      this.should_show_snackbar = true;
    },
  },
};
</script>
