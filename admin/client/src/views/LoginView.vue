<template>
  <login-component></login-component>
</template>

<script>
  import LoginComponent from '../components/LoginComponent'

  export default {
    name: 'LoginView',

    components: {
      'login-component' : LoginComponent,
    },
  }
</script>
