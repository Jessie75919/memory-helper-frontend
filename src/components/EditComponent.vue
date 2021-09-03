<template>
  <v-card class="mx-auto" max-width="400">
    <v-img class="white--text align-end" height="100px"
           src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
    >
      <v-card-title>
        {{ _question || 'Question' }}
      </v-card-title>
    </v-img>

    <v-card-text>
      <form class="mt-3">
        <v-text-field
            outlined
            v-model="_question"
            :error-messages="questionErrors"
            :counter="255"
            label="Question"
            required
            @input="$v.question.$touch()"
            @blur="$v.question.$touch()"
        ></v-text-field>
        <v-textarea
            outlined
            v-model="_answer"
            :error-messages="answerErrors"
            label="Answer"
            required
            @input="$v._answer.$touch()"
            @blur="$v._answer.$touch()"
        ></v-textarea>
        <v-btn block x-large color="primary" @click="submit">Save</v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditComponent',
  props: ['question', 'answer'],
  data() {
    return {
      _question: this.question,
      _answer: this.answer,
    };
  },

  methods: {
    resetInputs() {
      this.$v.$reset();
      this._answer = '';
      this._question = '';
    },
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        'answers': [{'content': this._answer}],
        'content': this._question,
      };

      axios.post('/api/questions', payload).then(res => {
        this.$emit('submit-success', res)
        this.message = 'Save Successfully!';
      }).catch(err => {
        this.$emit('submit-failed', res)
      })
    },
  },

  computed: {
    questionErrors() {
      const errors = [];
      if (!this.$v._question.$dirty) return errors;
      !this.$v._question.maxLength && errors.push('Question must be at most 255 characters long');
      !this.$v._question.required && errors.push('Question is required.');
      return errors;
    },
    answerErrors() {
      const errors = [];
      if (!this.$v._answer.$dirty) return errors;
      !this.$v._answer.required && errors.push('Answer is required');
      return errors;
    },
  },
};
</script>