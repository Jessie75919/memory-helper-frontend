<template>
  <v-dialog v-model="should_show" width="500">
    <EditComponent
        :answer="question.answers[0].content"
        :question="question.content"
        :question_id="question.id"
        @submit-success="$emit('submit-success', $event)"
        @submit-failed="$emit('submit-failed', $event)"
    />
  </v-dialog>
</template>

<script>
import EditComponent from '@/components/EditComponent';
export default {
  name: 'UpdatingModal',
  components: {EditComponent},
  props: {
    question: {
      type: Object
    }
  },
  data() {
    return {
      should_show: false,
    };
  },
  methods: {
    open() {
      this.should_show = true;
    },
    close() {
      this.should_show = false;
    },
  },

};
</script>