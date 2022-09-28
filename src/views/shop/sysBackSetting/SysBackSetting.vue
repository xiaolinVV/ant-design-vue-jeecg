<template>
  <form-build-page :config='config'></form-build-page>
</template>

<script>
import FormBuildPage from '@comp/designForm/FormBuildPage'
export default {
  name: 'SysBackSetting',
  components:{
    FormBuildPage
  },
  data() {
    return {
      config: {
        code: "background_setting",
        url: {
          loadFormData: "/sysBackSetting/sysBackSetting/queryFirstData"
        }
      }
    }
  }
}
</script>

<style scoped>

</style>