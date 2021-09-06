<template>
  <div v-if="questions">
    <v-progress-linear
        color="blue accent-3"
        height="10"
        v-model="progressVal"
    ></v-progress-linear>

    <v-container class="mt-3">

      <v-row>
        <v-col>
          <v-alert v-if="show_error" border="top" color="red lighten-2" dark>
            {{ error_message }}
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="text-right text--primary">
            {{ current_index }} / {{ questions.length }}
          </div>
        </v-col>
      </v-row>
      <v-row v-if="currentQuestion">
        <v-col>
          <v-card class="mx-auto" max-width="400">
            <v-img
                class="white--text align-end"
                height="100px"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            >
              <v-card-title>{{ currentQuestion.content }}</v-card-title>
              <p class="ml-3 text-caption" >seen <span class="font-weight-bold">{{ currentQuestion.count_of_seen }}</span> times</p>
            </v-img>

            <v-card-actions v-if="! currentQuestion.show_answer">
              <v-btn color="orange" text @click="currentQuestion.show_answer = true">
                Show Answer
              </v-btn>

            </v-card-actions>

            <template v-else>
              <v-card-text class="text--primary"
                           v-for="(answer, index) in currentQuestion['answers']"
                           :key="'answer_' + index">
                <span class="text--primary content_pre">{{ answer.content }}</span>
              </v-card-text>
            </template>
          </v-card>
        </v-col>
      </v-row>

      <!--    Answers button ================================= -->
      <v-row v-if="currentQuestion"
             align="center" justify="space-around" class="my-10">
        <v-btn rounded dark color="green" @click="toAnswer('easy')">
          Easy
        </v-btn>
        <v-btn rounded dark color="blue" @click="toAnswer('blurry')">
          Blurry
        </v-btn>
        <v-btn rounded dark color="pink" @click="toAnswer('hard')">
          Forgot
        </v-btn>
      </v-row>

      <!--    End show ================================= -->
      <v-row v-if="isEnded">
        <v-col>
          <v-card
              class="mx-auto"
              max-width="400"
          >
            <v-img
                class="white--text align-end"
                height="200px"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            >
              <v-card-title class="text-h4">Congratulations!!</v-card-title>
            </v-img>
            <v-card-subtitle class="pb-0 text-h6">
              You've studied {{ this.questions.length }} questions!! God Bless You!
            </v-card-subtitle>
            <v-card-actions>
              <v-btn href="/review" color="orange" text>
                Back to Review
              </v-btn>

              <v-btn href="/create" color="orange" text>
                Create New Word
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Study',
  props: {
    mode: {
      type: String,
      default: 'today',
    },
  },
  data() {
    return {
      questions: null,
      current_index: 0,
      show_error: false,
      error_message: '',
    };
  },
  methods: {
    toNextQuestion() {
      this.current_index++;
    },
    resetError() {
      this.show_error = false;
      this.error_message = '';
    },
    answerQuestionApi(choice) {
      this.resetError();
      axios.put(`/api/answer-question/${ this.currentQuestion.id }`,
          {choice}).catch(err => {
        this.show_error = true;
        this.error_message = 'Oops! Something wrong! Reload Page Please!';
      });
    },
    toAnswer(choice) {
      if (this.isEnded) {
        return;
      }
      this.answerQuestionApi(choice);
      this.toNextQuestion();
    },
  },
  computed: {
    currentQuestion() {
      return this.questions[this.current_index];
    },
    isEnded() {
      return this.questions.length <= this.current_index;
    },
    progressVal() {
      return this.current_index / this.questions.length * 100;
    },
  },
  created() {
    axios.get(`/api/questions?q=${ this.mode }`).then(res => {
      this.questions = res.data.map(item => ({
        show_answer: false,
        ...item,
      }));
    }).catch(err => {
      this.show_error = true;
      this.error_message = 'Oops! Something wrong! Reload Page Please!';
    });
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