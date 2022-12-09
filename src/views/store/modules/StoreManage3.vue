<!--认证表单-确认信息-->
<template>
  <div>
    <a-card class="wrap" :bordered="true">
      <div class="head">
        基本信息
      </div>
      <detail-list :col="4">
        <detail-list-item v-for='item in information' :term="item.term">
          {{item.content}}
        </detail-list-item>
      </detail-list>
    </a-card>

    <a-card class="wrap" :bordered="true">
      <div class="head">
        经营信息
      </div>
      <detail-list :col="4">
        <detail-list-item v-for='(item,index) in managementInformation' :term="item.term"
        >
          <img preview="1"  :src="item.content" alt="" v-if="index == 2 || index == 3">
          <span v-else :style="{color:index==5?'red':'black'}">
            {{item.content}}
          </span>
        </detail-list-item>
      </detail-list>
    </a-card>
    <a-card class="wrap" :bordered="true" v-if="mainInformation[0].content && mainInformation[1].content">
      <div class="head">
        主体信息
      </div>
      <detail-list :col="4">
        <detail-list-item v-for='(item,index) in mainInformation' :term="item.term">
          <img preview="1"  :src="item.content" alt="" v-if="index == 1">
          <span v-else>
            {{item.content}}
          </span>
        </detail-list-item>
      </detail-list>
    </a-card>
    <a-card class="wrap" :bordered="true">
      <div class="head">
        办理人证件
      </div>
      <detail-list :col="4">
        <detail-list-item v-for='(item,index) in certificateOfHandler' :term="item.term" v-if="item.content">
          <img preview="1" :src="item.content" alt="" v-if="index == 3 || index == 4 || index == 5 || index == 6">
          <span v-else>
            {{item.content}}
          </span>
        </detail-list-item>
      </detail-list>
    </a-card>
    <div class="bottom-btn" v-if="showBtn">
      <a-button :loading="loading" type="primary" @click="submit">提交</a-button>
      <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
    </div>
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { postAction, putAction } from '@/api/manage'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import DetailList from '@/components/tools/DetailList'
  import STable from '@/components/table/'
  import Vue from 'vue'

  const DetailListItem = DetailList.Item
  export default {
    name: 'StoreManage3',
    mixins: [JeecgListMixin],
//    props: [
//      'Alldata'
//    ],
    components: {
      DetailList,
      STable,
      DetailListItem
    },
    data() {
      return {
        Alldata: '',
        loading: false,
        storeStraight: [],
        //是否显示按钮
        showBtn: true,
        columns: [{
          title: '主体类型',
          align: 'center',
          dataIndex: ''
        }],
        //基本信息
        information: [
          {
            term: '联系人姓名',
            content: ''
          }, {
            term: '联系人手机号',
            content: ''
          }
        ],
        //经营信息
        managementInformation: [
          {
            term: '门店名称',
            content: ''
          }, {
            term: '分店名称',
            content: ''
          }, {
            term: 'logo',
            content: ''
          }, {
            term: '门面照',
            content: ''
          }, {
            term: '所在城市',
            content: ''
          }, {
            term: '主体类型',
            content: ''
          }, {
            term: '主营分类',
            content: ''
          }, {
            term: '客服电话',
            content: ''
          }
        ],
        //主体信息
        mainInformation: [
          {
            term: '统一社会信用代码',
            content: ''
          }, {
            term: '统一社会信用代码证',
            content: ''
          }
        ],
        //办理人证件
        certificateOfHandler: [
          {
            term: '办理人类型',
            content: ''
          }, {
            term: '姓名',
            content: ''
          }, {
            term: '身份证号码',
            content: ''
          }, {
            term: '身份证正面',
            content: ''
          }, {
            term: '身份证反面',
            content: ''
          }, {
            term: '手持身份证',
            content: ''
          }, {
            term: '代办人授权书',
            content: ''
          }
        ],
        url: {
          list: '/storeManage/storeManage/list',
          delete: '/storeManage/storeManage/delete',
          deleteBatch: '/storeManage/storeManage/deleteBatch',
          exportXlsUrl: 'storeManage/storeManage/exportXls',
          importExcelUrl: 'storeManage/storeManage/importExcel',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          addss: 'storeManage/storeManage/edit',
          dictCode: '/sys/dict/loadDictItem/{dictCode}'
        }
      }
    },
    created() {
      this.initDictConfig(() => {
        this.loadingPage()
      })
    },
    mounted() {
      if (this.$route.params.btnShow) {
        this.showBtn = false
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      },
      uploadAction: function() {
        return this.url.fileUpload
      }
    },
    methods: {
      //sexDictOptions 自行定义
      initDictConfig(callback) {

        //初始化字典 - 办理人类型
        initDictOptions('store_agent_type').then((res) => {
          if (res.success) {
            this.agentType = res.result
            this.$nextTick(() => {
              if (callback) {
                callback()
              }
            })
          }
        })
        //初始化字典 - 主营分类
        initDictOptions('store_main_type').then((res) => {
          if (res.success) {
            this.mainType = res.result
            this.$nextTick(() => {
              if (callback) {
                callback()
              }
            })
          }
        })
        //初始化字典 - 主体分类
        initDictOptions('store_straight').then((res) => {
          if (res.success) {
            this.storeStraight = res.result
            this.$nextTick(() => {
              if (callback) {
                callback()
              }
            })
          }
        })
      },

      submit() {
        let that = this
        putAction(that.url.addss, that.Alldata).then((res) => {
          if (res.code == 200) {
            that.$message.success(res.message)
            localStorage.setItem("storeID", JSON.parse(localStorage.getItem('StoreManageStep1')).id)
            localStorage.removeItem('StoreManageStep1')
            localStorage.removeItem('StoreManageStep2')
            that.$emit('nextStep')
          } else {
            that.$message.success('修改失败')
          }
        })
      },
      //页面加载
      loadingPage() {
        let step1 = JSON.parse(localStorage.getItem('StoreManageStep1'))
        let step2 = JSON.parse(localStorage.getItem('StoreManageStep2'))
        this.Alldata = Object.assign({}, step1, step2, {
          attestationStatus: '0',
          remark: ''
        })
        this.information[0].content = step1.bossName
        this.information[1].content = step1.bossPhone
        this.managementInformation[0].content = step1.storeName
        this.managementInformation[1].content = step1.subStoreName
        this.managementInformation[2].content = step1.logoAddrShowUrl
        this.managementInformation[3].content = step1.storePictureShowUrl
        this.managementInformation[4].content = step1.areaAddress
        if(step1.straight == 1){
          this.mainInformation[0].content = step2.socialCreditCode
          this.mainInformation[1].content = step2.licenseForEnterprisePic
        }
        if (this.storeStraight && step1.straight) {
          for (let item of this.storeStraight) {//字典值替换
            if (item.value == step1.straight) {
              step1.straight = item.text
              break
            }
          }
        }
        this.managementInformation[5].content = step1.straight
        if (this.mainType && step1.mainType) {
          for (let item of this.mainType) {//字典值替换
            if (item.value == step1.mainType) {
              step1.mainType = item.text
              break
            }
          }
        }
        this.managementInformation[6].content = step1.mainType
        this.managementInformation[7].content = step1.takeOutPhone
        if (step2.agentType == '0') {
          this.certificateOfHandler[6].content = step2.agentAuthorizationPic
        }
        if (this.agentType && step2.agentType) {
          for (let item of this.agentType) {//字典值替换
            if (item.value == step2.agentType) {
              step2.agentType = item.text
              break
            }
          }
        }
        this.certificateOfHandler[0].content = step2.agentType
        this.certificateOfHandler[1].content = step2.agentName
        this.certificateOfHandler[2].content = step2.idCode
        this.certificateOfHandler[3].content = step2.idPictureZPic
        this.certificateOfHandler[4].content = step2.idPictureFPic
        this.certificateOfHandler[5].content = step2.idHandPic


      },
      prevStep() {
        this.$emit('prevStep')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

  .ant-row {
    > div {
      height: 140px;
      display: flex;
      align-items: center;
    }
  }

  .bottom-btn {
    display: flex;
    justify-content: center;
    margin: 20px auto;
    width: 40%;
  }

  .wrap {
    margin-top: 25px;
    padding: 20px;
    box-sizing: content-box;

    img {
      width: 100px;
      height: 100px;
    }


    .head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      color: black;

      .term {
        font-weight: 700;
        margin-right: 15px;
      }
    }
  }

  .biaoti {
    font-family: "Microsoft Himalaya";
    font-size: 26px;
    border-bottom: 1px dashed #CCCCCC;
    color: #255e95;
    border: 1px solid black;
  }

  .btgn {
    font-family: "Microsoft YaHei UI";
    font-size: 16px;
    color: #255e95;
    background-color: #e9faff;
    text-align: center;
  }

  th.column-money,
  td.column-money {
    text-align: right !important;
  }

  th, td {
    height: 50px;
    font-size: 12px;
  }

  td {
    border: #000000 solid 1px;
  }

  .td_right {
    text-align: right;
    width: 100px;
    padding-right: 2px;
    background: #f2f2f2;
  }

  .td_left {
    text-align: left;
    width: 265px;
    padding-left: 5px;
  }

  .manage3-form {
    width: 830px;
    margin: 0 auto;
    font-size: 8px;


    .ant-card-grid {
      height: 60px;
      position: relative;

      img {
        position: absolute;
        height: 80%;
        top: 10%;
        left: 5%;
      }
    }

    .ant-card-grid:nth-child(odd) {
      width: 15%;
      textAlign: 'center'
    }

    .ant-card-grid:nth-child(even) {
      width: 35%;
      textAlign: 'center'
    }
  }
</style>