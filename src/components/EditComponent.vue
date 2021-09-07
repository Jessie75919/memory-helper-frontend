<template>
  <v-card class="mx-auto" max-width="400">
    <v-img class="white--text align-end" height="100px"
           src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
    >
      <v-card-title>
        {{ loc_question || 'Question' }}
      </v-card-title>
    </v-img>

    <v-card-text>
      <form class="mt-3">
        <v-text-field
            outlined
            v-model="loc_question"
            :error-messages="questionErrors"
            :counter="255"
            label="Question"
            required
            @input="$v.loc_question.$touch()"
            @blur="$v.loc_question.$touch()"
        ></v-text-field>
        <v-textarea
            outlined
            v-model="loc_answer"
            :error-messages="answerErrors"
            label="Answer"
            required
            @input="$v.loc_answer.$touch()"
            @blur="$v.loc_answer.$touch()"
            @keydown.meta.enter="submit"
            @keydown.ctrl.enter="submit"
        ></v-textarea>
        <v-btn block x-large color="primary" @click="submit">Save</v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
import {validationMixin} from 'vuelidate';
import {maxLength, required} from 'vuelidate/lib/validators';

export default {
  name: 'EditComponent',
  props: {
    question: {
      type: String,
      default: ''
    },
    answer: {
      type: String,
      default: ''
    },
    question_id: {
      type: Number,
    }
  },
  mixins: [validationMixin],
  validations: {
    loc_question: {required, maxLength: maxLength(255)},
    loc_answer: {required},
  },
  data() {
    return {
      loc_question: this.question,
      loc_answer: this.answer,
    };
  },

  methods: {
    resetInputs() {
      this.$v.$reset();
      this.loc_answer = '';
      this.loc_question = '';
    },
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        'answers': [{'content': this.loc_answer}],
        'content': this.loc_question,
      };

      const method = this.question_id ? 'put' : 'post';
      const detail = this.question_id ? `/${this.question_id}` : '';
      const url = '/api/questions' + detail

      axios[method](url, payload).then(res => {
        this.$emit('submit-success', res)
        this.resetInputs();
      }).catch(err => {
        this.$emit('submit-failed', err)
      })
    },
  },

  computed: {
    questionErrors() {
      const errors = [];
      if (!this.$v.loc_question.$dirty) return errors;
      !this.$v.loc_question.maxLength && errors.push('Question must be at most 255 characters long');
      !this.$v.loc_question.required && errors.push('Question is required.');
      return errors;
    },
    answerErrors() {
      const errors = [];
      if (!this.$v.loc_answer.$dirty) return errors;
      !this.$v.loc_answer.required && errors.push('Answer is required');
      return errors;
    },
  },
};
</script>