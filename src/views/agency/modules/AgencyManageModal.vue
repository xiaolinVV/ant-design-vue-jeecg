<template>
  <div>
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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户账号">
            <span>{{ username }}</span>
            <!--<a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />
     -->
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
            <span>{{ phone }}</span>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户名字">
            <span>{{ realname }}</span>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色">
            <div v-if="roleCode">
              <span v-if="roleCode == 'Provincial_agents'">省代</span>
              <span v-if="roleCode == 'Municipal_agent'">市代</span>
              <span v-if="roleCode == 'County_agent'">县代</span>
            </div>
            <div v-else>请添加代理区域</div>
          </a-form-item>
          <!--v-decorator="['sysAreaId',{ rules: [{ required: true, message: '请选择' }] }]"-->
          <!--    <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="代理区域">
          <a-select style="width:200px"  v-model="sysAreaId"    placeholder="请选择">&lt;!&ndash;v-model="sysAreaId"&ndash;&gt;
            <a-select-option value="" >请选择</a-select-option>
            <a-select-option v-for="item in areaList"  :value="item.id" > {{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>-->
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="代理公司名称">
            <a-input
              style="width: 100px;margin-right: 10px"
              v-decorator="['name', { rules: [{ required: true, message: '请输入' }] }]"
            />
          </a-form-item>
          <a-form-item v-if="areaShows" :labelCol="labelCol" :wrapperCol="wrapperCol" style="display: flex;">
            <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              <span>
                代理区域 省
              </span>
            </span>
            <a-select
              mode="multiple"
              style="width: 100%"
              placeholder="请选择"
              v-if="provincialShows"
              v-model="province"
              @change="chooseMedicine"
            >
              <!--:disabled="item.isSelected == 1"-->
              <a-select-option
                :disabled="item.isSelected == 1"
                v-for="(item, provinceIndex) in listProvince"
                :key="provinceIndex.toString()"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item v-if="cityShows" :labelCol="labelCol" :wrapperCol="wrapperCol" style="display: flex;">
            <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              <span>
                代理区域 市
              </span>
            </span>
            <a-select
              mode="multiple"
              style="width: 100%"
              placeholder="请选择"
              v-if="cityShows"
              v-model="city"
              @change="chooseMedicine1"
            >
              <a-select-option
                :disabled="item.isSelected == 1"
                placeholder="请选择"
                v-for="(item, cityIndex) in listCity"
                :key="cityIndex.toString()"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="countyShows" :labelCol="labelCol" :wrapperCol="wrapperCol" style="display: flex;">
            <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              <span>
                代理区域 县
              </span>
            </span>
            <a-select mode="multiple" style="width: 100%" placeholder="请选择" v-if="countyShows" v-model="county">
              <a-select-option
                :disabled="item.isSelected == 1"
                placeholder="请选择"
                v-for="(item, countyIndex) in listCounty"
                :key="countyIndex.toString()"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单佣金比例">
            <a-input-number
              style="width: 100px;margin-right: 10px"
              v-decorator="['orderCommissionRate', { rules: [{ required: true, message: '请输入' }] }]"
            /><span>%</span>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="礼包佣金比例">
            <a-input-number
              style="width: 100px;margin-right: 10px"
              v-decorator="['giftCommissionRate', { rules: [{ required: true, message: '请输入' }] }]"
            /><span>%</span>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开店佣金比例">
            <a-input-number
              style="width: 100px;margin-right: 10px"
              v-decorator="['storeCommissionRate', { rules: [{ required: true, message: '请输入' }] }]"
            /><span>%</span>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="福利金销售奖励">
            <a-input-number
              style="width: 100px;margin-right: 10px"
              v-decorator="['welfareCommissionRate', { rules: [{ required: true, message: '请输入' }] }]"
            /><span>%</span>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="推荐供应商销售奖励">
            <a-input-number
              style="width: 100px;margin-right: 10px"
              v-decorator="['supplierSalesCommissionRate', { rules: [{ required: true, message: '请输入' }] }]"
            /><span>%</span>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="兑换券销售奖励">
            <a-input-number
              style="width: 100px;margin-right: 10px"
              v-decorator="['cashCouponSalesIncentives', { rules: [{ required: true, message: '请输入' }] }]"
            /><span>%</span>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="推广人佣金比例">
            <a-input-number
              style="width: 100px;margin-right: 10px"
              v-decorator="['promoterCommissionRate', { rules: [{ required: true, message: '请输入' }] }]"
            /><span>%</span>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
            <a-range-picker
              style="width: 100%"
              v-model="startEndTime"
              format="YYYY-MM-DD"
              :placeholder="['开始时间', '结束时间']"
              @change="onDateChangeStart"
              @ok="onDateOk"
            />
          </a-form-item>
          <!--  <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结束时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', {}]" />
        </a-form-item>-->
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <!-- <a-input placeholder="请输入备注" v-decorator="['remark', {}]" />-->
            <a-textarea placeholder="请输入备注" v-decorator="['remark', {}]" :autosize="{ minRows: 5, maxRows: 6 }" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <!--停用弹出-->
    <a-modal title="停用" v-model="visibleStopStatus" @ok="hideModalStopStatus()" okText="确认" cancelText="取消">
      <i style="color: #faad14;font-size: 22px;margin-right: 16px;float: left;">
        <svg
          viewBox="64 64 896 896"
          data-icon="question-circle"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
          class=""
        >
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          ></path>
          <path
            d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"
          ></path>
        </svg>
      </i>
      <input style="display: none" :value="agencyManageId" placeholder="id" />
      <h3>停用用户后，用户将无法提现</h3>
      <p>您确定要停用吗？</p>
      <a-textarea placeholder="停用原因" v-model="closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
  </div>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import SplitPanel from '../../jeecg/SplitPanel'
import { filterObj } from '@/utils/util'
export default {
  name: 'AgencyManageModal',
  components: { SplitPanel },
  moment,
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      phone: '',
      username: '',
      realname: '',
      startTime: '',
      endTime: '',
      leve: '',
      roleCode: '',
      sysAreaId: '',
      startEndTime: [],
      areaList: [],
      dateFormat: 'YYYY-MM-DD', //时间选择用
      visibleStopStatus: false,
      closeExplain: '',
      agencyManageId: '',
      /**代理地区选择开始*/
      listProvince: [],
      listCity: [],
      listCounty: [],
      isAgencyProvincial: 0, //省过滤标识
      isAgencyCity: 0, //市过滤标识
      isAgencyCounty: 0, //县过滤标识
      areaShows: false, //手否显示地区选择框
      provincialShows: false,
      cityShows: false,
      countyShows: false,
      province: [],
      city: [],
      county: [],
      leve: '',
      countyMapList: {},
      cityMapList: {},
      provincialMapList: {},
      /***end*/

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
        add: '/agencyManage/agencyManage/add',
        edit: '/agencyManage/agencyManage/edit',
        getAreaList: '/sysArea/sysArea/getAreaList',
        updateStatus: '/agencyManage/agencyManage/updateStatus',
        /**代理区域选择*/
        getAgencyAreaList: '/sysArea/sysArea/getAgencyAreaList',
        /**代理区域回选*/
        getparentIdList: '/sysArea/sysArea/getparentIdList'
      }
    }
  },
  created() {
    //  this.getAreaListfun();
  },
  methods: {
    moment,
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      console.log('record', record)
      if (record) {
        let data = record
        //this.sysAreaId = record.sysAreaId
        this.phone = data.phone
        this.username = data.username
        this.realname = data.realname
        if (data.startTime) {
          console.log('data.startTime', data.startTime)
          console.log('data.endTime', data.endTime)
          //this.startEndTime.push(data.startTime);
          this.startEndTime = [moment(data.startTime, this.dateFormat), moment(data.endTime, this.dateFormat)]
        }
        if (data.endTime) {
          // this.startEndTime = [data.startTime,data.endTime] ;
          console.log('this.startEndTime', this.startEndTime)
        }
        this.leve = record.leve
        this.roleCode = record.roleCode
        this.agencyManageId = record.id
        this.onChangeRole(this.roleCode)
        //数据回选
        this.getparentIdList(record.id)
        // this.getAreaListfun(record.sysAreaId);
      }

      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'sysAreaId',
            'sysUserId',
            'orderCommissionRate',
            'giftCommissionRate',
            'storeCommissionRate',
            'remark',
            'status',
            'closeExplain',
            'balance',
            'accountFrozen',
            'unusableFrozen',
            'storeCommissionRate',
            'welfareCommissionRate',
            'supplierSalesCommissionRate',
            'cashCouponSalesIncentives',
            'promoterCommissionRate',
            'name'
          )
        )
        //时间格式化
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      //代理数据清空
      this.areaShows = false
      this.provincialShows = false
      this.cityShows = false
      this.countyShows = false
      this.listCity = []
      this.listCounty = []
      this.city = []
      this.county = []
      this.listProvince = []
      this.province = []
      this.isAgencyProvincial = 0 //省过滤标识
      this.isAgencyCity = 0 //市过滤标识
      this.isAgencyCounty = 0 //县过滤标识
      this.leve = ''
      this.countyMapList = {}
      this.cityMapList = {}
      this.provincialMapList = {}
      this.startEndTime = []
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          if (this.sysAreaId) {
            return '请选择代理区域!'
          }
          if (this.startTime) {
            values.startTime = this.startTime
            console.log('values.startTime  ---', values.startTime)
          }
          if (this.endTime) {
            values.endTime = this.endTime
            console.log(' values.endTime  ---', values.endTime)
          }
          if (this.sysAreaId) {
            values.sysAreaId = this.sysAreaId
          }

          let formData = Object.assign(this.model, values)
          //时间格式化
          console.log(values.startTime)
          console.log(values.endTime)
          if (this.startTime) {
            formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD') : null
          }
          if (this.endTime) {
            formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD') : null
          }
          //省市区数据封装
          if (this.isAgencyProvincial == 1) {
            formData.sysAreaId = this.province.length > 0 ? this.province.join(',') : ''
          }
          if (this.isAgencyCity == 1) {
            formData.sysAreaId = this.city.length > 0 ? this.city.join(',') : ''
          }
          if (this.isAgencyCounty == 1) {
            formData.sysAreaId = this.county.length > 0 ? this.county.join(',') : ''
          }
          console.log(formData)
          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    /**时间区间选择器*/
    getCurrentStyle(current, today) {
      const style = {}
      if (current.date() === 1) {
        style.border = '1px solid #1890ff'
        style.borderRadius = '50%'
      }
      return style
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.startTime
      return filterObj(param)
    },
    onDateChangeStart: function(value, dateString) {
      this.startTime = value[0]
      this.endTime = value[1]
    },
    onDateOk(value) {
      console.log(value)
    },

    /* getAreaListfun(sysAreaId){
         let that = this;
         that.sysAreaId = ''
        getAction(that.url.getAreaList,{leve: that.leve}).then((res) => {
          if (res.success) {
            that.areaList= res.result
            that.$nextTick(()=>{
              that.sysAreaId = sysAreaId * 1;
              console.log(that.sysAreaId,that.areaList)

            })
          } else {
            that.$message.warning(res.message);
          }
        })
  },*/

    //停用弹窗
    showModalStopStatus(id) {
      this.agencyManageId = id
      this.visibleStopStatus = true
      this.closeExplain = ''
    },
    //停用
    hideModalStopStatus() {
      this.visibleStopStatus = false
      console.log('this.closeExplain=', this.closeExplain)
      var that = this
      getAction(that.url.updateStatus, { ids: this.agencyManageId, closeExplain: this.closeExplain, status: '0' }).then(
        res => {
          if (res.code == 200) {
            that.$message.success(res.message)
            that.$emit('ok') //发送父级主键刷新
          } else {
            that.$message.success('修改失败')
          }
        }
      )
    },
    /***********************代理区域选择*********************/
    //添加代理开始
    onChangeRole(roleCode) {
      //省代
      this.isAgencyProvincial = 0 //过滤省代
      //市代
      this.isAgencyCity = 0 //过滤市代
      //县代
      this.isAgencyCounty = 0 //过滤县代

      if (roleCode == 'Provincial_agents') {
        this.areaShows = true
        this.provincialShows = true
        this.cityShows = false
        this.countyShows = false
        //省代
        this.isAgencyProvincial = 1 //过滤省代
        this.provinceData(0, this.isAgencyProvincial)
      } else {
        this.provinceData(0, this.isAgencyProvincial)
        if (roleCode == 'Municipal_agent') {
          this.areaShows = true
          this.provincialShows = true
          this.cityShows = true
          this.countyShows = false
          //市代
          this.isAgencyCity = 1 //过滤市代
        } else if (roleCode == 'County_agent') {
          this.areaShows = true
          this.provincialShows = true
          this.cityShows = true
          this.countyShows = true
          //县代
          this.isAgencyCounty = 1 //过滤县代
        } else {
          this.areaShows = false
          this.provincialShows = false
          this.cityShows = false
          this.countyShows = false
        }
      }
    },
    //查询城市
    chooseMedicine: function(id) {
      let ids = id.length > 0 ? id.join(',') : ''
      this.listCity = []
      this.listCounty = []
      this.city = []
      this.county = []
      console.log(this.province)
      getAction(this.url.getAgencyAreaList, {
        parentIds: ids,
        isAgency: this.isAgencyCity,
        agencyManageId: this.agencyManageId
      }).then(res => {
        if (res.success) {
          //市集合
          this.listCity = res.result
          console.log(this.listCity)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //查询县
    chooseMedicine1: function(id) {
      this.listCounty = []
      this.county = []
      let ids = id.length > 0 ? id.join(',') : ''
      getAction(this.url.getAgencyAreaList, {
        parentIds: ids,
        isAgency: this.isAgencyCounty,
        agencyManageId: this.agencyManageId
      }).then(res => {
        if (res.success) {
          //市集合
          this.listCounty = res.result

          console.log(this.listCounty)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //获取省信息列表
    provinceData(parentId, isAgency) {
      this.listCity = []
      this.listCounty = []
      this.city = []
      this.county = []

      let that = this
      getAction(that.url.getAgencyAreaList, {
        parentIds: parentId,
        isAgency: isAgency,
        agencyManageId: this.agencyManageId
      }).then(res => {
        if (res.success) {
          that.listProvince = res.result

          console.log('that.listProvince ******', that.listProvince)
        } else {
          that.$message.warning(res.message)
        }
      })
    },

    onChangeProvince(province) {
      console.log(province)
    },

    /***end*/
    /**代理区域数据回选*/
    getparentIdList(id) {
      let that = this
      getAction(that.url.getparentIdList, { agencyManageId: id }).then(res => {
        if (res.success) {
          that.objectMap = res.result
          console.log('that.objectMap', that.objectMap)

          that.leve = that.objectMap.leve
          that.countyMapList = that.objectMap.countyMapList
          that.cityMapList = that.objectMap.cityMapList
          that.provincialMapList = that.objectMap.provincialMapList
          //省
          if (that.provincialMapList.sysAreaId) {
            that.provincialMapList.sysAreaId = that.provincialMapList.sysAreaId.split(',')
            for (let item of that.provincialMapList.sysAreaId) {
              item = item * 1
              that.province.push(item)
            }
          }
          //市
          if (that.cityMapList.sysAreaId) {
            that.cityMapList.sysAreaId = that.cityMapList.sysAreaId.split(',')
            for (let item of that.cityMapList.sysAreaId) {
              item = item * 1
              that.city.push(item)
            }
          }
          //县
          if (that.countyMapList.sysAreaId) {
            that.countyMapList.sysAreaId = that.countyMapList.sysAreaId.split(',')
            for (let item of that.countyMapList.sysAreaId) {
              item = item * 1
              that.county.push(item)
            }
          }
          if (that.leve) {
            if (that.leve == 2) {
              this.chooseMedicineHX(that.province)
              this.chooseMedicineHX1(that.city)
            }
            if (that.leve == 1) {
              this.chooseMedicineHX(that.province)
            }
          }
        } else {
          // that.$message.warning(res.message);
        }
      })
    },

    //查询城市回选用
    chooseMedicineHX: function(id) {
      let ids = id.length > 0 ? id.join(',') : ''
      console.log(this.province)
      getAction(this.url.getAgencyAreaList, {
        parentIds: ids,
        isAgency: this.isAgencyCity,
        agencyManageId: this.agencyManageId
      }).then(res => {
        if (res.success) {
          //市集合
          this.listCity = res.result
          console.log(this.listCity)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //查询县回选用
    chooseMedicineHX1: function(id) {
      let ids = id.length > 0 ? id.join(',') : ''
      getAction(this.url.getAgencyAreaList, {
        parentIds: ids,
        isAgency: this.isAgencyCounty,
        agencyManageId: this.agencyManageId
      }).then(res => {
        if (res.success) {
          //市集合
          this.listCounty = res.result

          console.log(this.listCounty)
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
