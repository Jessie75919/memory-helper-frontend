<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mx-auto" max-width="400">
          <v-img class="white--text align-end" height="100px"
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>
              {{ question || 'Question' }}
            </v-card-title>
          </v-img>

          <v-card-text>
            <form class="mt-3">
              <v-text-field
                  outlined
                  v-model="question"
                  :error-messages="questionErrors"
                  :counter="255"
                  label="Question"
                  required
                  @input="$v.question.$touch()"
                  @blur="$v.question.$touch()"
              ></v-text-field>
              <v-textarea
                  outlined
                  v-model="answer"
                  :error-messages="answerErrors"
                  label="Answer"
                  required
                  @input="$v.answer.$touch()"
                  @blur="$v.answer.$touch()"
              ></v-textarea>
              <v-btn block x-large color="primary" @click="submit">Save</v-btn>
            </form>
          </v-card-text>
        </v-card>
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
import {validationMixin} from 'vuelidate';
import {maxLength, required} from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  name: 'CreatePage',
  mixins: [validationMixin],
  validations: {
    question: {required, maxLength: maxLength(255)},
    answer: {required},
  },
  data() {
    return {
      question: '',
      answer: '',
      should_show_snackbar: false,
      message: '',
      timeout: 2000,
    };
  },
  computed: {
    questionErrors() {
      const errors = [];
      if (!this.$v.question.$dirty) return errors;
      !this.$v.question.maxLength && errors.push('Question must be at most 255 characters long');
      !this.$v.question.required && errors.push('Question is required.');
      return errors;
    },
    answerErrors() {
      const errors = [];
      if (!this.$v.answer.$dirty) return errors;
      !this.$v.answer.required && errors.push('Answer is required');
      return errors;
    },
  },
  methods: {
    resetInputs() {
      this.$v.$reset();
      this.answer = '';
      this.question = '';
    },
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        'answers': [{'content': this.answer}],
        'content': this.question,
      };

      axios.post('/api/questions', payload).then(res => {
        this.message = 'Save Successfully!';
        this.resetInputs();
      }).catch(err => {
        this.message = 'Oops!! Save failed !!';
      }).finally(() => {
        this.should_show_snackbar = true;
      });
    },
  },
};
</script>

<style scoped>

</style>