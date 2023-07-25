<template>
  <div style="display:flex;justify-content:flex-start;flex-direction:column;align-items:center;position: absolute;right: 50px;top: 50px;z-index: 10">
    <div style="height:200px;width:200px;margin-bottom:10px;position:relative">
      <img preview="1" :src="qrCodeShow" style="width:100%;height:100%"/>
      <img preview="1" v-if="avatarShow" :src="avatarShow" style="position:absolute;width:50px;height:50px;top:75px;left:75px" />
    </div>
    <div style="margin-bottom: 10px;" v-if="qrCodeNumber">
      {{qrCodeNumber}}
    </div>
    <a-button type="primary" icon="download"  :loading="exportLoading"  @click="downLoad" v-if="buttonText">
      {{buttonText}}
    </a-button>
  </div>
</template>

<script>
  import {download} from '../../assets/js/downLoadImage.js'
  export default {
    name: 'qrCode',
    props:{
      qrCodeShow:{
        type:String,
        default:''
      },
      avatarShow:{
        type:String,
        default:''
      },
      qrCodeNumber:{
        type:String,
        default:'',
      },
      buttonText:{
        type:String,
        default:'下载小程序二维码',
      }
    },
    methods:{
      downLoad(){
        download(1,this.qrCodeShow,'小程序二维码')
      }
    }
  }
</script>

<style scoped>

</style>