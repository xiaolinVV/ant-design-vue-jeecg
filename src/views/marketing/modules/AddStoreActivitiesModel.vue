<template>
  <a-card class="AddStoreActivitiesModel" ref="AddStoreActivitiesModel">
    <a-spin :spinning="confirmLoading">
      <div class="title">
        {{part == 2 ? '编辑' : '新增'}}进店活动
      </div>
      <div class="wrap">
        <a-form :form="form">
          <a-form-item label="活动名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              style="width: 250px"
              v-decorator="['title',verificationRules.title]"
              placeholder="请输入活动名称"/>
          </a-form-item>

          <a-form-item label="选择店铺" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="showStoreManageId">
            <!--            @change="handleChangesStore"-->
            <a-select
              show-search
              style="width: 300px"
              placeholder="请输入对应手机号并选择店铺"
              @focus="filterOptionStore"
              @search="filterOptionStore"
              :filter-option="false"
              :not-found-content="fetchingStore ? undefined : null"
              v-decorator="['storeManageId', verificationRules.storeManageId]"
            >
              <a-spin v-if="fetchingStore" slot="notFoundContent" size="small"/>
              <a-select-option value="" disabled  v-else>请输入对应手机号并选择店铺</a-select-option>
              <!--              @click="chooseSysUserId(item.sysUserId)"-->
              <a-select-option v-for="item in dianpulist" :value="item.id">{{item.NAME}}({{item.boss_phone}})</a-select-option>
            </a-select>
          </a-form-item>

          <!--<a-form-item label="选择店铺" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="showStoreManageId">-->
            <!--<template>-->
              <!--<a-select style="width: 100%"-->
                        <!--placeholder="Tags Mode"-->
                        <!--@focus="filterOptionStore"-->
                        <!--@search="filterOptionStore"-->
                        <!--:filter-option="false"-->
                        <!--:not-found-content="fetchingStore ? undefined : null"-->
                        <!--v-decorator="['storeManageId', verificationRules.storeManageId]"-->
              <!--&gt;-->
                <!--<a-spin v-if="fetchingStore" slot="notFoundContent" size="small"/>-->
                <!--<a-select-option value="" v-else>请选择</a-select-option>-->
                <!--<a-select-option v-for="item in dianpulist" :value="item.id">{{ item.NAME }}</a-select-option>-->
              <!--</a-select>-->
            <!--</template>-->
          <!--</a-form-item>-->


          <a-form-item label="参与方式" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-radio-group v-decorator="['takeWay',verificationRules.takeWay]">
              <a-radio value="0">
                首次扫码进店
              </a-radio>
              <a-radio value="1">
                首次进店
              </a-radio>
              <!--                <a-radio value="2">-->
              <!--                  进店-->
              <!--                </a-radio>-->
            </a-radio-group>
          </a-form-item>

          <a-form-item label="活动奖励" :label-col="labelCol" :wrapper-col="wrapperCol">
            送福利金
            <a-input-number :min="0" :precision="2"
                            v-decorator="['sendWelfarePayments',verificationRules.sendWelfarePayments]"
                            style="width: 250px">

            </a-input-number>
            <a-alert message="重要提示：赠送福利金优先扣除账户福利金，福利金不足再扣除账户余额，若活动未停止，账户余额不足则奖励不再发放，余额充值后只对后续再参与的人员发放奖励。" type="info"/>
          </a-form-item>

          <a-form-item label="有效期" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-radio-group v-decorator="['validity',verificationRules.validity]" @change="validityOnChange">
              <a-radio value="0">
                长期有效
              </a-radio>
              <a-radio value="1">
                短期有效
              </a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="开始时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss'
                           v-decorator="[ 'startTime', verificationRules.startTime]"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="结束时间"
            v-if="showEndTime"
          >
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', verificationRules.endTime]"/>
          </a-form-item>
        </a-form>
      </div>
      <div class="button-end">

      </div>
      <div class="button-operation">
        <a-button @click="cancel">
          取消
        </a-button>
        <a-button type="primary" @click="sure">
          确认
        </a-button>
      </div>
    </a-spin>

  </a-card>
</template>

<script>
  import moment from 'moment'
  import { httpAction, getAction, postAction } from '@/api/manage'

  export default {
    name: 'AddStoreActivitiesModel',
    data() {
      this.lastFetchIdStore = 0
      return {
        //判断是点击添加进入页面还是编辑   编辑 2 添加 1
        confirmLoading: false,
        part: '1',
        form: this.$form.createForm(this),
        fetchingStore: false,
        labelCol: { span: 2 },
        wrapperCol: { span: 17 },
        dianpulist: [],
        verificationRules: {
          title: { rules: [{ required: true, message: '请输入活动名称' }, { max: 50, message: '字数不能超过50个字' }] },
          storeManageId: { rules: [{ required: true, message: '请选择店铺' }] },
          takeWay: { rules: [{ required: true, message: '请选择参与方式' }] },
          sendWelfarePayments: { rules: [{ required: true, message: '请输入赠送福利金数量' }] },
          validity: { rules: [{ required: true, message: '请选择有效期' }] },
          startTime: { rules: [{ required: true, message: '请选择开始时间' }] },
          endTime: { rules: [{ required: true, message: '请选择结束时间' }] }
        },
        allData: {
          title: '',
          storeManageId:'',
          takeWay: '0',
          sendWelfarePayments: '',
          validity: '0',
          startTime: '',
          endTime: ''
        },
        showStoreManageId: true,
        url: {
          //bossPhone 通过手机号码获取店铺信息
          findStoreList: '/storeManage/storeManage/getStoreByBossPhone',
          //获取当前登录人身份
          getRole: '/sys/user/getRole',
          //添加
          add: '/marketingCommingStore/marketingCommingStore/add',
          //编辑
          edit: '/marketingCommingStore/marketingCommingStore/edit',
          ifTheSameCommingStore: '/marketingCommingStore/marketingCommingStore/ifTheSameCommingStore'
        },
        showEndTime: false
      }
    },
    async created() {
      this.confirmLoading = true
      await this.loadData()
      let part = this.$route.query.part ? this.$route.query.part : '1'
      this.part = part
      this.form.setFieldsValue(this.allData)
      this.dianpulist = []
      let MarketingCommingStoreListData = localStorage.getItem('MarketingCommingStoreListData')
      if (part == 2 && MarketingCommingStoreListData) {
        MarketingCommingStoreListData = JSON.parse(MarketingCommingStoreListData)
        MarketingCommingStoreListData.startTime = MarketingCommingStoreListData.startTime ? moment(MarketingCommingStoreListData.startTime) : null
        MarketingCommingStoreListData.endTime = MarketingCommingStoreListData.endTime ? moment(MarketingCommingStoreListData.endTime) : null
        this.dianpulist = [{
          NAME: MarketingCommingStoreListData.storeName,
          id: MarketingCommingStoreListData.storeManageId
        }]
        this.allData = Object.assign({}, this.allData, MarketingCommingStoreListData)
        if (MarketingCommingStoreListData.validity != 1) {
          this.showEndTime = false
        } else {
          this.showEndTime = true
        }
        this.$nextTick(() => {
          this.confirmLoading = false
          this.form.setFieldsValue(this.allData)
        })
      } else {
        setTimeout(() => {
          this.confirmLoading = false
          this.form.setFieldsValue(this.allData)
        }, 200)
      }


      //返现
      // this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
      //提交
      // formData.startTime = formData.startTime?formData.startTime.format('YYYY-MM-DD HH:mm:ss'):null;
    },
    methods: {
      validityOnChange(e) {
        let value = e.target.value
        if (value != 1) {
          this.showEndTime = false
        } else {
          this.showEndTime = true
        }
      },
      async sure() {
        let that = this
        const result = await this.beforeSubmit()
        if (result == 1) {
          that.$confirm({
            title: '温馨提醒',
            content: '当前活动时间内已存在相同类型活动，如您确定要创建当前活动，则满足条件的用户将获得多份奖励。',
            onOk() {
              that.submit()
            },
            onCancel() {
            }
          })
        } else {
          that.submit()
        }
      },
      cancel() {
        this.$router.push('/marketing/MarketingCommingStoreList')
      },
      beforeSubmit() {
        let that = this,
          submitData = that.form.getFieldsValue(['takeWay', 'storeManageId'])
        if (!this.showStoreManageId) {
          submitData.storeManageId = ''
        }
        return new Promise((resolve, reject) => {
          getAction(that.url.ifTheSameCommingStore, submitData).then(res => {
            if (res.success) {
              resolve(res.result)
            } else {
              that.$message.warn(res.message || '网络波动，请稍后再试')
              reject(res.message || 'marketingCommingStore/marketingCommingStore/ifTheSameCommingStore接口')
            }
          })
        })
      },
      submit() {
        let that = this
        that.form.validateFields((err, values) => {
          if (!err) {
            let url,
              MarketingCommingStoreListData = localStorage.getItem('MarketingCommingStoreListData')
            if (that.part == 2 && MarketingCommingStoreListData) {
              url = that.url.edit
              values.id = that.allData.id
            } else {
              url = that.url.add
            }


            // this.allData = Object.assign({}, this.allData, values)
            values.startTime = values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null
            values.endTime = values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null

            if (values.startTime && values.endTime) {
              console.log(Date.parse(values.startTime))
              console.log(Date.parse(values.endTime))
              if (Date.parse(values.startTime) > Date.parse(values.endTime)) {
                that.$message.warn('请选择正确的时间!')
                return
              }
            }

            that.$nextTick(() => {
              postAction(url, values).then(res => {
                if (res.success) {
                  that.$message.success(res.message || '提交成功！')
                  that.$router.push('/marketing/MarketingCommingStoreList')
                } else {
                  that.$message.warn(res.message || '提交失败！')
                }
              })
            })
          }
        })
      },
      filterOptionStore(value) {
        let bossPhone = value
        this.lastFetchIdStore += 1
        const fetchId = this.lastFetchIdStore
        //this.dianpulist = [];
        this.fetchingStore = true
        if (fetchId !== this.lastFetchIdStore) {
          return
        }
        getAction(this.url.findStoreList, { bossPhone: bossPhone }).then((res) => {
          this.fetchingStore = false
          if (res.success === false) return
          if (res) {
            this.dianpulist = res
          }
        })
      },
      loadData() {
        return new Promise((resolve, reject) => {
          getAction(this.url.getRole).then(res => {
            if (res.success) {
              if (res.result != 1) {
                this.showStoreManageId = true
              } else {
                this.showStoreManageId = false
              }
              resolve(res.result)
            } else {
              reject(res.message || '获取登录人类型报错')
              this.$message.error(res.message || '网路状况差 请稍后重试')
            }
          })
        })

      }
      //选择店铺Id
      // chooseSysUserId(sysUserId) {
      //   this.sysUserId = sysUserId
      //   this.form.setFieldsValue({storeManageId:sysUserId});
      // },

    }
  }
</script>

<style lang="scss">
  .AddStoreActivitiesModel {
    width: 100%;

    .el-dialog {
      -webkit-backface-visibility: hidden;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
      padding-bottom: 25px;
      /*border-bottom: 1px solid gray;*/
      /*margin-top: 30px;*/
    }

    .wrap {
      margin-top: 30px;

      .Discount {
        input {
          width: 75px;
          margin: 0 15px;
        }
      }

      .attention {
        margin-top: 10px;
        /*width: 1080px;*/
        font-size: 13px;
        line-height: 34px;
        padding: 0 20px;
        color: black;
        background: rgb(204, 235, 255);
        border: 1px solid rgb(0, 153, 255);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
      }
    }

    .operation {
      color: rgb(24, 144, 255);
      cursor: pointer;
    }

    .line-special .ant-checkbox-group, .line-special .ant-radio-group {
      width: 300px;
      height: 39px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ant-radio-wrapper {
        display: flex;
        align-items: center;
      }
    }

    .line-special-second {
      .ant-checkbox-group {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        height: 100px;
      }
    }

    .button-operation {
      display: flex;
      justify-content: space-between;
      width: 200px;
      margin: 0 auto;

      button {
        width: 80px;
      }
    }

    .button-end {
      margin-bottom: 40px;
      border-bottom: 1px solid gray;
    }

    .popUp {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      z-index: 999;
      background: rgba(0, 0, 0, 0.3);

      .pop-wrap {
        margin: 0 auto;
        margin-top: 5vh;
        width: 50%;
        background: white;
        font-size: 12px;

        .title {
          width: 100%;
          height: 50px;
          display: flex;
          justify-content: space-between;
          padding: 0 5px 0 20px;
          align-items: center;
          /*border-bottom: 1px solid gray;*/

          span:nth-child(2) {
            padding: 15px;
            cursor: pointer;
          }
        }
      }

      .cnt {
        padding: 20px;
        width: 100%;

        input {
          width: 120px;
        }

        .title2 {
          display: flex;
          justify-content: space-between;
        }
      }
    }

  }
</style>