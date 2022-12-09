<template>
  <!--弹窗-->
  <div class="storeManageAuditModal">
    <a-modal
     :width="800" title="审核" v-model="visibleAudi" @ok="hideModal()" okText="确认" cancelText="取消">
      <a-radio-group @change="" v-model="attestationStatus" style="display: flex;align-items: center">
        <div class="labelTitle">
          审核：
        </div>
        <a-radio :style="radioStyle"  :value="1"  >审核通过</a-radio>
        <a-radio :style="radioStyle"  :value="3" >
          审核未通过
        </a-radio>
      </a-radio-group>
      <!--<a-form-item
        v-if="storePermissionUidMap"
        label="商家端菜单">
        <a-checkbox-group @change="onChangePermission" v-model="checkedList">
          <a-row >
            <a-col  v-for="item in storePermissionUidMap" :span="8" >
              <a-checkbox  :value="item.id" :disabled="item.isStatus == 1 ? false:true">{{ item.name }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>-->
      <a-textarea placeholder="请输入" :rows="4" v-if="attestationStatus==3" v-model="remark" style="margin-top: 10px"/>
    </a-modal>
  </div>
</template>
<script>
  import { httpAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  export default {
    name: "StoreManageAuditModal",
    mixins: [JeecgListMixin],
    data() {
      return {
        value: 1,
        radioStyle: {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
        },
        attestationStatus:1,
        storePermissionUidMap:"",
        checkedList:[],
        sysUserId:"",
        remark:'',
        storePermissionUids:[],
        bossPhone:'',
        title: "操作",
        visibleAudi: false,
        StoreManageId: "",
        model: {},
        dataSource1: [],
        Goodlistprice: '',
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        url: {
          list: "/storeManage/storeManage/list",
          add: "/storeManage/storeManage/add",
          edit: "/storeManage/storeManage/edit",
          getStorePermissionUidMap:"/storePermissionUid/storePermissionUid/getStorePermissionUidMap",
          addStorePermissionUid:"/storePermissionUid/storePermissionUid/addStorePermissionUid"
        },
      };
    },
    mounted() {


    },
    methods: {
      showModal(item) {
        console.log(item)
        this.StoreManageId = item.id;
        this.sysUserId = item.sysUserId;
        let sz = []
        getAction(this.url.getStorePermissionUidMap, {sysUserId: this.sysUserId}).then((res) => {
          if (res.success) {
            for(let item of res.result){
              if(item.status == 1){
                sz.push(item.id)
              }
            }
            this.checkedList = sz
            this.storePermissionUidMap = res.result;
          }
        })
        this.visibleAudi = true;
        getAction(this.url.list, {StoreManageId: item.id}).then((res) => {
          if (res.success) {
            this.dataSource = res.result.list;
          }
        })
      },
      onChange() {
        console.log('radio checked', e.target.value);
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.model.delFlag = 0;
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'attestationStatus', 'remark'))
          //时间格式化
          this.form.setFieldsValue({startTime: this.model.startTime ? moment(this.model.startTime) : null})
          this.form.setFieldsValue({endTime: this.model.endTime ? moment(this.model.endTime) : null})
          this.form.setFieldsValue({payTime: this.model.payTime ? moment(this.model.payTime) : null})
        });
      },
      hideModal(){
        let info = {
            id:this.StoreManageId,
          attestationStatus:this.attestationStatus,
          remark:this.remark,
          bossPhone:this.bossPhone,
        }
        this.visibleAudi = false;
        this.addStorePermissionUid();
        this.$emit('ok',info);
      },
      clearAll(){
          this.attestationStatus = ''
          this.remark = ''
          this.visibleAudi = false;
      },
      //商家端菜单
      onChangePermission(checkedValues){
        this.storePermissionUids = checkedValues

          console.log('checked = ', checkedValues);
      },
      addStorePermissionUid(){
         let ids= this.checkedList.join(",")
        getAction(this.url.addStorePermissionUid, {sysUserId: this.sysUserId,ids:ids}).then((res) => {
          if (res.success) {
            this.addStorePermission = res.result;
          }
        })
      },
    }
  }

</script>
<style lang="less" scoped>
  /*.storeManageAuditModal{*/
    .labelTitle{
      margin-right: 10px;
    }
  /*}*/
</style>