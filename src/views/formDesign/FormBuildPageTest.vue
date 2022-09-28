<template>
  <form-build-page :code='code'></form-build-page>
</template>

<script>
import FormBuildPage from '@comp/designForm/FormBuildPage'
export default {
  name: 'FormBuildPageTest',
  components: { FormBuildPage },
  data() {
    return {
      code: "background_setting"
    }
  }
}
</script>

<style scoped>

</style>