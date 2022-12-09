<template>
  <a-card v-if="pageInfo">
    <div class="pass-status" v-if="pageInfo.attestationStatus == 1">
      <div class="pass-title">
        审核通过
      </div>
      <div class="pass-cnt">
        恭喜您，提交的信息已审核通过！
      </div>
    </div>

    <div class="pass-status" v-if="pageInfo.attestationStatus == 3">
      <div class="pass-title">
        审核不通过
      </div>
      <div class="pass-cnt">
        原因：{{ pageInfo.remark }}
      </div>
      <a-button type="primary" style="position: absolute;bottom: 10px;right: 0;" @click="navTo">
        修改
      </a-button>
    </div>

    <div class="pass-status" v-if="pageInfo.attestationStatus == 0">
      <div class="pass-title">
        待审核
      </div>
      <div class="pass-cnt">
        您提交的信息，平台正在审核中，请耐心等待...
      </div>
    </div>


    <div>
      <a-card class="wrap" :bordered="false" title="基本信息">
        <detail-list :col="4">
          <detail-list-item v-for='item in information' :term="item.term">
            {{item.content}}
          </detail-list-item>
        </detail-list>
      </a-card>

      <a-card class="wrap" :bordered="false" title="经营信息">
        <detail-list :col="4">
          <detail-list-item v-for='(item,index) in managementInformation' :term="item.term"
          >
            <img :src="item.content" alt="" v-if="index == 2 || index == 3|| index == 4">
            <span v-else :style="{color:index==7?'red':'black'}">
            {{item.content}}
          </span>
          </detail-list-item>
        </detail-list>
      </a-card>

      <a-card class="wrap" :bordered="false"
              v-if="mainInformation[0].content && mainInformation[1].content && showMainType" title="主体信息">
        <detail-list :col="4">
          <detail-list-item v-for='(item,index) in mainInformation' :term="item.term">
            <img :src="item.content" alt="" v-if="index == 1">
            <span v-else>
            {{item.content}}
          </span>
          </detail-list-item>
        </detail-list>
      </a-card>
      <a-card class="wrap" :bordered="false" title="办理人证件">
        <detail-list :col="4">
          <detail-list-item v-for='(item,index) in certificateOfHandler' :term="item.term" v-if="item.content">
            <img :src="item.content" alt="" v-if="index == 3 || index == 4 || index == 5 || index == 6">
            <span v-else>
            {{item.content}}
          </span>
          </detail-list-item>
        </detail-list>
      </a-card>
      <!--      <div class="bottom-btn" v-if="showBtn">-->
      <!--        <a-button :loading="loading" type="primary" @click="submit">提交</a-button>-->
      <!--        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>-->
      <!--      </div>-->
    </div>
  </a-card>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { postAction, putAction, getAction } from '@/api/manage'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import DetailList from '@/components/tools/DetailList'
  import STable from '@/components/table/'

  const DetailListItem = DetailList.Item
  export default {
    name: 'ToAudit',
    mixins: [JeecgListMixin],
    props: [
      'Alldata'
    ],
    components: {
      DetailList,
      STable,
      DetailListItem
    },
    data() {
      return {
        loading: false,
        storeStraight: [],
        //是否显示按钮
        showBtn: true,
        columns: [{
          title: '主体类型',
          align: 'center',
          dataIndex: 'straight_dictText'
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
          },
          {
            term: '店内照',
            content: ''
          }, {
            term: '所在城市',
            content: ''
          }, {
            term: '门店地址',
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
        pageInfo: '',//本頁面接口数据
        showMainType: false,//是否显示主题类型
        url: {
          list: '/storeManage/storeManage/list',
          delete: '/storeManage/storeManage/delete',
          deleteBatch: '/storeManage/storeManage/deleteBatch',
          exportXlsUrl: 'storeManage/storeManage/exportXls',
          importExcelUrl: 'storeManage/storeManage/importExcel',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          addss: 'storeManage/storeManage/edit',
          dictCode: '/sys/dict/loadDictItem/{dictCode}',
          //审核页面请求接口(请求需要带id   get请求)
          queryById: '/storeManage/storeManage/queryById'
        },
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
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
          }
        })
        //初始化字典 - 主营分类
        initDictOptions('store_main_type').then((res) => {
          if (res.success) {
            this.mainType = res.result
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
        let that = this,
          obj = {}
        for (let item of this.Alldata) {
          obj = Object.assign(obj, item)
        }
        putAction(that.url.addss, obj).then((res) => {
          if (res.code == 200) {
            // localStorage.removeItem('StoreManageStep1')
            // localStorage.removeItem('StoreManageStep2')
            that.$message.success(res.message)
            that.$emit('nextStep')
          } else {
            that.$message.success('修改失败')
          }
        })
      },
      //页面加载
      loadingPage() {
        if (this.$route.query.AllData.id) {
          let id = this.$route.query.AllData.id
          getAction(this.url.queryById, { id }).then(res => {
            let data = res.result
            console.log(data)
            this.pageInfo = data
            this.information[0].content = data.bossName
            this.information[1].content = data.bossPhone
            this.managementInformation[0].content = data.storeName
            this.managementInformation[1].content = data.subStoreName

            this.managementInformation[2].content = data.logoAddr ? this.imgerver + '/' + data.logoAddr : ''
            this.managementInformation[3].content = data.storePicture ? this.imgerver + '/' + data.storePicture : ''

            this.managementInformation[4].content = data.accordingStore ? this.imgerver + '/' + data.accordingStore : ''


            this.managementInformation[5].content = data.areaAddress
            //门店地址
            this.managementInformation[6].content = data.storeAddress
            if (data.straight == 1) {
              //如果是企业
              this.showMainType = false
            } else {
              this.showMainType = true
            }
            if (this.storeStraight && data.straight) {
              for (let item of this.storeStraight) {//字典值替换
                if (item.value == data.straight) {
                  data.straight = item.text
                  break
                }
              }
            }
            this.managementInformation[7].content = data.straight
            if (this.mainType && data.mainType) {
              for (let item of this.mainType) {//字典值替换
                if (item.value == data.mainType) {
                  data.mainType = item.text
                  break
                }
              }
            }
            this.managementInformation[8].content = data.mainType
            this.managementInformation[9].content = data.takeOutPhone
            this.mainInformation[0].content = data.socialCreditCode
            this.mainInformation[1].content = data.licenseForEnterprise
            if (data.agentType === 0) {
              //如果是代办人类型
              this.certificateOfHandler[6].content = data.agentAuthorization ? this.imgerver + '/' + data.agentAuthorization : ''
            }
            if (this.agentType && data.agentType) {
              for (let item of this.agentType) {//字典值替换
                if (item.value == data.agentType) {
                  data.agentType = item.text
                  break
                }
              }
            }
            this.certificateOfHandler[0].content = data.agentType
            this.certificateOfHandler[1].content = data.agentName
            this.certificateOfHandler[2].content = data.idCode
            //图片
            this.certificateOfHandler[3].content = data.idPictureZ ? this.imgerver + '/' + data.idPictureZ : ''
            this.certificateOfHandler[4].content = data.idPictureF ? this.imgerver + '/' + data.idPictureF : ''
            this.certificateOfHandler[5].content = data.idHand ? this.imgerver + '/' + data.idHand : ''


          })
        } else {
          this.$message.warn('找不到id!')
        }
      },
      navTo() {
        this.$router.push({ path: '/store/modules/storeManageFrom' })
      },
      prevStep() {
        this.$emit('prevStep')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pass-status {
    color: black;
    border-bottom: 1px solid #CCCCCC;
    margin-bottom: 20px;
    position: relative;
    .pass-cnt {
      margin-top: 20px;
      font-size: 16px;
      margin-bottom: 40px;
    }
    .pass-title {
      font-weight: 700;
      font-size: 20px;
    }
  }

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
    background: #F2F2F2;

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
      text-align: center
    }

    .ant-card-grid:nth-child(even) {
      width: 35%;
      text-align: center
    }
  }
</style>