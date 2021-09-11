<template>
  <div class="d-flex align-center justify-center outer-box">
    <v-container>
    <v-row>
      <v-col>
        <p class="text-h3 text-center white--text font-weight-bold">ChanChan Memory</p>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col>
        <form>
          <v-text-field
              v-model="email"
              :error-messages="emailErrors"
              label="E-mail"
              required
              rounded
              filled
              dark
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
          ></v-text-field>
          <v-text-field
              v-model="password"
              type="password"
              :error-messages="passwordErrors"
              label="Password"
              required
              filled
              dark
              rounded
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
          ></v-text-field>
          <v-btn
              class="mt-4"
              block
              color="pink"
              dark
              x-large
              @click="submit"
          >
            Log In
          </v-btn>
        </form>
      </v-col>
    </v-row>

  </v-container>
  </div>
</template>

<script>
import {validationMixin} from 'vuelidate';
import required from 'vuelidate/lib/validators/required';
import email from 'vuelidate/lib/validators/email';

export default {
  name: 'Login',
  mixins: [validationMixin],

  validations: {
    password: { required },
    email: { required, email },
  },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        username: this.email,
        password: this.password,
      };

      this.$store.dispatch('login', payload)
    },
  },
  computed:{
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required')
      return errors
    },
  }
};
</script>

<style scoped>
.outer-box {
  height: 95vh;
  background: url('../assets/main_background.jpg');
  background-position: center;
  background-size: cover;
}
</style>