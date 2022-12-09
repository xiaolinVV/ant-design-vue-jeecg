<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="团队名称">
          <a-input
            placeholder="请输入团队名称"
            v-decorator="['groupName', { rules: [{ required: true, message: '请输入团队名称!' }] }]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="团队创始人">
          <a-select
            show-search
            v-decorator="['memberId', { rules: [{ required: true, message: '请选择团队创始人!' }] }]"
            placeholder="请选择团队创始人"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchPhone"
            @change="phoneChange"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in phoneList" :key="d.id">
              {{ d.NAME }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺编号">
          <a-input
            placeholder="请输入店铺编号"
            v-decorator="['storeManageId', { rules: [{ required: false, message: '请输入店铺编号!' }] }]"
            @change="inputChange"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="绑定店铺">
          {{ storeInformation }}
        </a-form-item>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        确认
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import debounce from 'lodash/debounce'
export default {
  name: 'MemberDesignationGroupModal',
  data() {
    this.lastFetchId = 0
    this.fetchPhone = debounce(this.fetchPhone, 800)
    return {
      title: '操作',
      visible: false,
      phoneList: [],
      loading: false,
      value: '',
      fetching: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: '/memberDesignationGroup/memberDesignationGroup/add',
        edit: '/memberDesignationGroup/memberDesignationGroup/edit',
        findCreatedByPhone: 'memberList/memberList/findMemberListByPhone',
        returnMemberNameById: '/memberList/memberList/returnMemberNameById' // 返回会员信息 传入参数:promoter , promoterType 0:店铺 1：会员 2：平台
      },
      promoterTypes: 0,
      // memberInformation: '请输入新会员编号',
      storeInformation: '-',
      inputChangeTimerOut: null
    }
  },
  created() {
    console.log(this.phoneList)
    getAction(this.url.findCreatedByPhone, { phone: '' }).then(res => {
      // this.phoneIsExistence = res
      this.phoneList = res.result
      this.fetching = false
    })
  },
  methods: {
    inputChange(e) {
      console.log(e.target.value)
      let promoter = e.target.value.replace(/\s+/g, '')
      this.loading = true
      if (this.inputChangeTimerOut) {
        clearTimeout(this.inputChangeTimerOut)
        this.inputChangeTimerOut = null
      }
      setTimeout(() => {
        // if (this.title == '修改归属店铺' && this.promoterTypes != 0) {
        this.promoterTypes = 0
        // }
        let params = {
          promoter,
          promoterType: this.promoterTypes
        }
        if (!promoter) {
          this.storeInformation = '-'
          return
        }
        getAction(this.url.returnMemberNameById, params).then(res => {
          if (this.promoterTypes == 1) {
            //会员
            // if (res.result) {
            //   this.memberInformation = res.result.information
            // } else {
            //   this.memberInformation = '查询不到会员信息'
            // }
          } else if (this.promoterTypes == 0) {
            //店铺
            if (res.result) {
              this.storeInformation = res.result.promoter
            } else {
              this.storeInformation = '查询不到店铺信息'
            }
          }
          this.inputChangeTimerOut = setTimeout(() => {
            this.loading = false
            clearTimeout(this.inputChangeTimerOut)
            this.inputChangeTimerOut = null
          }, 500)
          console.log(res)
        })
      }, 0)
    },
    fetchPhone(phone) {
      console.log('fetching phone1', phone)

      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.data = []
      this.fetching = true
      let formData = {
        phone
      }

      getAction(this.url.findCreatedByPhone, formData).then(res => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return
        }
        // this.phoneIsExistence = res
        this.phoneList = res.result
        this.fetching = false
      })

      // fetch('https://randomuser.me/api/?results=5')
      //   .then(response => response.json())
      //   .then(body => {
      //     if (fetchId !== this.lastFetchId) {
      //       // for fetch callback order
      //       return;
      //     }
      //     const data = body.results.map(user => ({
      //       text: `${user.name.first} ${user.name.last}`,
      //       value: user.login.username,
      //     }));
      //     this.data = data;
      //     this.fetching = false;
      //   });
    },
    phoneChange(id) {
      console.log(id)
      // if (id) {
      //   if (this.visiblwelfarePaymentsProInformation) {
      //     this.tarrace.id = id
      //   }
      //   if (this.visiblwelfarePaymentsInformation) {
      //     this.dataAll.id = id
      //   }
      // }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    add() {
      this.edit({})
    },
    edit(record) {
      if (record.id) {
        getAction(this.url.findCreatedByPhone, { phone: record.phone }).then(res => {
          // if (fetchId !== this.lastFetchId) {
          //   // for fetch callback order
          //   return
          // }
          // this.phoneIsExistence = res
          this.phoneList = res.result
          this.fetching = false
        })
      }
      console.log(this.phoneList)
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.inputChange({ target: { value: record.storeManageId || '' } })
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'year', 'month', 'day', 'delFlag', 'groupName', 'memberId', 'storeManageId')
        )
        //时间格式化
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      if (this.storeInformation == '查询不到店铺信息') {
        that.$message.warning('请输入正确的店铺编号')
        return
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = 'post'
          if (!this.model.id) {
            httpurl += this.url.add
          } else {
            httpurl += this.url.edit
          }
          let formData = Object.assign(this.model, values)
          //时间格式化

          console.log(formData)
          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style lang="less" scoped></style>
