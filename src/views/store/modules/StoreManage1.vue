<!--分步表单-基本信息-->
<template>

  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <div style="font-weight: bold;margin-bottom: 20px;">
        <span>联系人信息</span>
      </div>
      <a-form-item
        style="display: flex;margin-bottom: 0px;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*联系人">
        <!--v-decorator="['bossName', {}]"-->
        <a-input placeholder="请输入联系人姓名" v-model="AllData.bossName" disabled style="width:400px;"/>
        <lable style="font-size:12px;">请填店铺经营者姓名</lable>
      </a-form-item>

      <a-form-item
        style="display: flex;margin-bottom: 0px;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*联系人手机">
        <a-input placeholder="请输入联系人手机" v-model="AllData.bossPhone" disabled style="width:400px;"/>
        <lable style="font-size:12px;">非常重要，将用于接收日常经营提醒及相关操作验证</lable>
      </a-form-item>
      <span style="font-weight: bold;">经营信息</span>
      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*门店名称">
        <a-input placeholder="请输入门店名称" v-model="AllData.storeName" style="width:400px;"/>
        <lable style="font-size:12px;">请与门面照上的名称保持一致</lable>
      </a-form-item>
      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="分店名称">
        <a-input placeholder="请输入分店名称" v-model="AllData.subStoreName" style="width:400px;"/>
        <lable style="font-size:12px;">地理位置信息+店字结尾，如岭兜二里店</lable>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="logo">
        <a-upload
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="uploadAction"
          :data="{'isup':1}"
          :headers="headers"
          :beforeUpload="logoBeforeUpload"
          @change="handleChange"
        >
          <img preview="1"  v-if="AllData.logoAddrShowUrl" :src="AllData.logoAddrShowUrl" alt="上传Logo"
               style="height:104px;max-width:300px"/>
          <div v-else>
            <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <lable style="font-size:12px;">上传与店铺气质吻合的logo，能提高用户进店的概率，支持jpg、jpeg、png格式，大小不超过500k</lable>
      </a-form-item>
      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*门脸照">
        <a-upload
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="uploadAction"
          :data="{'isup':1}"
          :headers="headers"
          :beforeUpload="pictureBeforeUpload"
          @change="handleChange1"

        >
          <img preview="1" v-if="AllData.storePictureShowUrl" :src="AllData.storePictureShowUrl" alt="上传门面照"
               style="height:104px;max-width:300px"/>
          <div v-else>
            <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <lable style="font-size:12px;">需拍全，包含完整的牌匾、门框（建议正对门店2米处拍摄）</lable>
      </a-form-item>
      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*店内照">
        <a-upload
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="uploadAction"
          :data="{'isup':1}"
          :headers="headers"
          :beforeUpload="pictureBeforeUpload"
          @change="handleChange2"
        >
          <img preview="1" v-if="AllData.accordingStore" :src="AllData.accordingStoreShowUrl" alt="上传店内照"
               style="height:104px;max-width:300px"/>
          <div v-else>
            <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <lable style="font-size:12px;">需真实反映店内区域</lable>
      </a-form-item>


      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*所在城市">
        <a-cascader :options="cityAllData" @change="cityAllDataChange" :loadData="cityAllDataLoad" changeOnSelect
                    v-if="canShowDefaultCity" :defaultValue='defaultCity' placeholder="请选择区域"/>
        <lable style="font-size:12px;">需填写完整的省/市/区信息</lable>
      </a-form-item>


<!--      <a-form-item-->
<!--        style="display: flex;position: relative;align-items: center"-->
<!--        :labelCol="labelCol"-->
<!--        :wrapperCol="wrapperCol"-->
<!--        label="经度">-->
<!--        <a-input placeholder="请输入经度" v-model="AllData.longitude" style="width:500px;"/>-->
<!--      </a-form-item>-->
<!--      <a-form-item-->
<!--        style="display: flex;position: relative;align-items: center"-->
<!--        :labelCol="labelCol"-->
<!--        :wrapperCol="wrapperCol"-->
<!--        label="纬度">-->
<!--        <a-input placeholder="请输入纬度" v-model="AllData.latitude" style="width:500px;"/>-->
<!--      </a-form-item>-->
<!--      style="display: flex;position: relative;align-items: center"-->
      <a-form-item
        style="display: flex;position: relative;align-items: center;margin-bottom: 50px;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*门店详细地址"
      >
        <a-input placeholder="请输入门店详细地址" v-model="AllData.storeAddress" style="width:500px;"/>
        <div style="font-size:12px;position: absolute;">需填写完整的省/市/区信息</div>
        <!--<a-button type="primary" style="position: absolute;right: -80px;top: -6px" @click="addressPosition">
               定位
        </a-button>-->
      </a-form-item>


      <!-- <div class="map-ct" v-show="showMap">
         <div class="address-list" v-show="showMapList">
                <div class="item">
                   <div class="name">
                      名字
                   </div>
                   <div class="address">
                     地址
                   </div>
                </div>

         </div>
         <div id="container"></div>
       </div>
 -->
      <!--<div id="container">
      </div>-->
        <!--<a-form-item label="主体类型">
          <a-select placeholder="请选择" v-model="AllData.straight">
          <a-select-option value="">请选择</a-select-option>
          <a-select-option v-for="(item,index) in straight" :value="item.value" :key="index">{{item.text}}
          </a-select-option>
        </a-select>
      </a-form-item>-->
      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*主体类型">
        <j-dict-select-tag v-model="AllData.straight" placeholder="请选择主体分类"
                           dictCode="store_straight"/>
      </a-form-item>
      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*主营分类">
        <j-dict-select-tag v-model="AllData.mainType" placeholder="请选择主营分类"
                           dictCode="store_main_type"/>
      </a-form-item>
      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*客服电话">
        <a-input placeholder="请输入客服电话" v-model="AllData.takeOutPhone" style="width:400px;"/>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from 'moment'
  import { TMap } from '@/api/tMap'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { disabledAuthFilter } from '@/utils/authFilter'
  import Vue from 'vue'
  import { getAction } from '@/api/manage'
  import { duplicateCheck } from '@/api/api'
  import AUpload from 'ant-design-vue/es/upload/Upload'

  export default {
    components: { AUpload },
    name: 'StoreManage1',
    data() {
      return {
        areaId: '',
//        from: this.$from.createForm(this),

        city: '',
        options: [{}],
        title: '操作',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        //编辑回显的默认地址
        defaultCity: '',
        //可以显示回显默认地址
        canShowDefaultCity: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        uploadLoading: false,
        headers: {},
        validatorRules: {},
        //地址转换拼接地址
        areaAddressList: [],
        //所有数据
        AllData: {
          //步骤1
          step: '1',
          id: '',
          bossName: '',
          bossPhone: '',
          storeName: '',
          subStoreName: '',
          storeAddress: '',
          straight: '',
          mainType: '',
          takeOutPhone: '',
          //保存图片地址
          logoAddr: '',
          storePicture: '',
          accordingStore: '',
          //返现图片地址
          logoAddrShowUrl: '',
          storePictureShowUrl: '',
          accordingStoreShowUrl: '',
          //地址ID
          sysAreaId: '',
          //拼接地址
          areaAddress: '',
          latitude: '',//纬度
          longitude: ''//经度
        },
        //所在城市联想
        cityAllData: [
          // {
          //   value: 'zhejiang',
          //   label: 'Zhejiang',
          //   isLeaf: false,
          // },
          // {
          //   value: 'jiangsu',
          //   label: 'Jiangsu',
          //   isLeaf: false,
          // },
        ],
        /* longitude: '',//经度
         latitude: '',//纬度*/
        url: {
          // add: "/storeManage/storeManage/add",
          // edit: "/storeManage/storeManage/edit",
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          findByParentId: '/sysArea/sysArea/findByParentId',
          getList: '/sysArea/sysArea/getList',
          addressUrl: '/storeManage/storeManage/getUrl',
          identification: '/storeManage/storeManage/identification',
          //获取经纬度
          getLngAndLat: '/storeManage/storeManage/getLngAndLat',
        },
        //是否显示地图
        showMap: false,
        //是否显示地图列表
        showMapList: false
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers = { 'X-Access-Token': token }
      let StoreManageStep1 = localStorage.getItem('StoreManageStep1')
      if(StoreManageStep1){
        let data = JSON.parse(StoreManageStep1)
        let result = {
          //步骤1
          step: '1',
          id: data.id || '',
          bossName: data.bossName || '',
          bossPhone: data.bossPhone || '',
          storeName: data.storeName || '',
          subStoreName: data.subStoreName || '',
          storeAddress: data.storeAddress || '',
          straight: data.straight || '',
          mainType: data.mainType || '',
          takeOutPhone: data.takeOutPhone || '',
          //保存图片地址
          logoAddr: data.logoAddr || '',
          storePicture: data.storePicture || '',
          accordingStore: data.accordingStore || '',
          //返现图片地址
          logoAddrShowUrl: data.logoAddr?this.url.imgerver + '/' + data.logoAddr : '',
          storePictureShowUrl: data.storePicture?this.url.imgerver + '/' + data.storePicture : '',
          accordingStoreShowUrl: data.accordingStore?this.url.imgerver + '/' + data.accordingStore : '',
          //地址ID
          sysAreaId: data.sysAreaId || '',
          //拼接地址
          areaAddress: data.areaAddress || '',
          latitude: data.latitude || '',//纬度
          longitude: data.longitude || ''//经度
        }
        if(data.areaAddress){
          this.areaAddressList = data.areaAddress.split(',')
        }else{
          this.areaAddressList = []
        }
        this.getList(() => {
          if (data.sysAreaId && data.areaAddress) {
            this.cityEchoDisplay(data)
          } else {
            this.canShowDefaultCity = true
          }
        })
        this.AllData = result;
        return;
      }
      getAction(this.url.identification).then(res => {
        let data = res.result
        if(data.areaAddress){
          this.areaAddressList = data.areaAddress.split(',')
        }else{
          this.areaAddressList = []
        }

        this.getList(() => {
          if (data.sysAreaId && data.areaAddress && data.sysAreaId.indexOf(',')!= -1 && data.areaAddress.indexOf(',')!= -1) {
            this.cityEchoDisplay(data)
          } else {
            this.canShowDefaultCity = true
            this.$message.warn('所在地址数据有误,请重新选择!')
          }
        })
        let result = {
          //步骤1
          step: '1',
          id: data.id || '',
          bossName: data.bossName || '',
          bossPhone: data.bossPhone || '',
          storeName: data.storeName || '',
          subStoreName: data.subStoreName || '',
          storeAddress: data.storeAddress || '',
          straight: data.straight || '',
          mainType: data.mainType || '',
          takeOutPhone: data.takeOutPhone || '',
          //保存图片地址
          logoAddr: data.logoAddr || '',
          storePicture: data.storePicture || '',
          accordingStore: data.accordingStore || '',
          //返现图片地址
          logoAddrShowUrl: data.logoAddr?this.url.imgerver + '/' + data.logoAddr : '',
          storePictureShowUrl: data.storePicture?this.url.imgerver + '/' + data.storePicture : '',
          accordingStoreShowUrl: data.accordingStore?this.url.imgerver + '/' + data.accordingStore : '',
          //地址ID
          sysAreaId: data.sysAreaId || '',
          //拼接地址
          areaAddress: data.areaAddress || '',
          latitude: data.latitude || '',//纬度
          longitude: data.longitude || ''//经度
        }
//         this.AllData.bossName = data.bossName;
//         this.AllData.bossPhone = data.bossPhone;
//         this.AllData.storeName = data.storeName;
//         this.AllData.longitude = data.longitude;
//         this.AllData.latitude = data.latitude;
//         this.AllData.areaAddress = data.areaAddress;
//         this.AllData.storeAddress = data.storeAddress;
//         this.AllData.subStoreName = data.subStoreName;
//         this.AllData.id = data.id;
//        data.logoAddrShowUrl = this.url.imgerver + '/' + data.logoAddr
//        data.storePictureShowUrl = this.url.imgerver + '/' + data.storePicture
//        data.accordingStoreShowUrl = this.url.imgerver + '/' + data.accordingStore
        this.AllData = result

      })
    },
    mounted() {
      //初始化地图
      // this.mapInit()
    },
    computed: {
      uploadAction: function() {
        return this.url.fileUpload
      }

    },

    methods: {
      //获取地址一级options
      getList(callback = '') {
        getAction(this.url.getList).then((res) => {
          if (res.success) {
            let sz3 = []
            for (let item of res.result) {
              sz3.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            //所在城市
            this.cityAllData = sz3
            this.$nextTick(() => {
              if (callback) {
                callback()
              }
            })
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      //赋值经纬度
      getLngAndLat() {
        return new Promise((resolve, reject) => {
            let info = {
              address: this.AllData.storeAddress,
              pageNo: 1,
              pageSize: 20
            }
            getAction(this.url.getLngAndLat, info).then(res => {
              if (!res.result || res.result.length <= 0) {
                resolve()
                return
              }
              let data = res.result[0].location
              if (res.success) {
                this.AllData.longitude = data.lng
                this.AllData.latitude = data.lat
                this.$nextTick(() => {
                  resolve()
                })
              } else {
                resolve()
              }
            })
        })
      },
      initIndex() {
        initDictOptions('straight').then((res) => {
          if (res.success) {
            this.straight = res.result
          }
        })
      },
      nextStep() {
        if (!this.formCheck()) {
          return
        }
        this.getLngAndLat().then(res=>{
          this.AllData.areaAddress = this.areaAddressList.join(',')
          this.$emit('nextStep', this.AllData)
          localStorage.setItem('StoreManageStep1', JSON.stringify(this.AllData))
        })
      },
      //LOGO上传
      handleChange(info) {
        if (info.file.status === 'uploading') {
          this.uploadLoading = true
          return
        }
        if (info.file.status === 'done') {
          let response = info.file.response
          this.uploadLoading = false
          this.AllData.logoAddr = response.message
          this.AllData.logoAddrShowUrl = this.url.imgerver + '/' + response.message
          if (response.success) {
            this.model.logoAddr = response.message
          } else {
            this.$message.warning(response.message)
          }
        }
      },
      //商店门脸照
      handleChange1(info) {
        if (info.file.status === 'uploading') {
          this.uploadLoading = true
          return
        }
        if (info.file.status === 'done') {
          var response = info.file.response
          this.uploadLoading = false
          this.AllData.storePicture = response.message
          this.AllData.storePictureShowUrl = this.url.imgerver + '/' + response.message
          if (response.success) {
          } else {
            this.$message.warning(response1.message)
          }
        }
      },
      //店内照
      handleChange2(info) {
        if (info.file.status === 'uploading') {
          this.uploadLoading = true
          return
        }
        if (info.file.status === 'done') {
          let response = info.file.response
          this.uploadLoading = false
          this.AllData.accordingStore = response.message
          this.AllData.accordingStoreShowUrl = this.url.imgerver + '/' + response.message
          if (response.success) {
          } else {
            this.$message.warning(response1.message)
          }
        }
      },
      //地图初始化
      mapInit() {
        let obj = {
          boundary: 'region(福建省,0)',
          page_size: '20',
          page_index: '10',
          key: 'TAGBZ-ZRRLU-3XLVT-2K7EZ-QGWOJ-6TFQN',
          keyWord: '厦门市思明区望海路10号',
          orderby: '_distance'
        }
        //定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
        var map = new qq.maps.Map(document.getElementById('container'), {
          center: new qq.maps.LatLng(39.916527, 116.397128),      // 地图的中心地理坐标。
          zoom: 8                                                 // 地图的中心地理坐标。
        })
        qq.maps.event.addListener(
          map,
          'click',
          function(event) {
            alert('您点击的位置为:[' + event.latLng.getLng() +
              ',' + event.latLng.getLat() + ']')
          }
        )
      },
      //定位事件
      addressPosition() {
        if (!this.showMapList) {
          this.showMapList = !this.showMapList
        }
        let info = {
          boundary: `region(${this.areaAddressList[0]},1)`,
          page_size: '20',
          page_index: '10',
          key: 'TAGBZ-ZRRLU-3XLVT-2K7EZ-QGWOJ-6TFQN',
          keyWord: `${this.areaAddressList[1]}${this.areaAddressList.length > 2 ? this.areaAddressList[2] : ''}`,
          orderby: '_distance'
        }
        getAction(this.url.addressUrl, info).then(res => {
          console.log(res)
          this.$message.success(res.message)
        })

      },
      //校验
      formCheck() {
        let data = this.AllData,
          nameReg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/, //联系人校验
          phoneReg = /^1[0-9]{10}$/ //手机号校验
        if (!nameReg.test(data.bossName)) {
          this.$message.warn('联系人格式不正确！')
          return false
        }
        if (!phoneReg.test(data.bossPhone)) {
          this.$message.warn('手机号格式不正确！')
          return false
        }
        if (!data.storeName) {
          this.$message.warn('门店名称不得为空！')
          return false
        }
        if (!data.storePicture) {
          this.$message.warn('你还未上传门脸照！')
          return false
        }
        if (!data.accordingStore) {
          this.$message.warn('您还未上传店内照！')
          return false
        }
        if (!data.straight) {
          this.$message.warn('您还未设置主体类型！')
          return false
        }
        if (!data.mainType) {
          this.$message.warn('您还未设置主营分类！')
          return false
        }
        if (!data.takeOutPhone) {
          this.$message.warn('客服电话形式不正确！')
          return false
        }
        return true
      },
      //图片校验
      pictureBeforeUpload(file) {
        const isPic = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isPic) {
          this.$message.error('图片格式仅支持JPG,PNG格式!')
        }
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) {
          this.$message.error('图片大小必须在5M以内!')
        }
        return isPic && isLt2M
      },
      //logo校验
      logoBeforeUpload(file) {
        const isPic = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isPic) {
          this.$message.error('图片格式仅支持JPG,PNG格式!')
        }
        const isLt2M = file.size / 1024 / 1024 < 0.5
        if (!isLt2M) {
          this.$message.error('图片大小必须在500k以内!')
        }
        return isPic && isLt2M
      },
      //所在城市地址选择完成事件
      cityAllDataChange(value, selectedOptions) {
        let sz = []
        for (let item of selectedOptions) {
          sz.push(item.label)
        }
        this.AllData.sysAreaId = value.join(',')
        this.AllData.areaAddress = sz.join(',')
        this.areaAddressList = sz
      },
      //所在城市点击一级，二级，三级分类动态展示数据
      cityAllDataLoad(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        getAction(this.url.findByParentId, { id: targetOption.value }).then((res) => {
          targetOption.loading = false
          if (res.success && res.result.length > 0) {
            let sz = []
            for (let item of res.result) {
              sz.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            targetOption.children = sz
          }
          this.cityAllData = [...this.cityAllData]
        })
      },
      //所在城市回显
      cityEchoDisplay(info) {
        let sz = info.sysAreaId.split(',')
        let cityAllData = this.cityAllData
        this.defaultCity = info.sysAreaId.split(',').map(item => {
          return item * 1
        })
        //第一个id请求其对应的子地址
        getAction(this.url.findByParentId, { id: sz[0] }).then(res => {
          if (res.success && res.result.length > 0) {
            let sz2 = [] //子地址
            for (let item of res.result) {
              sz2.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            console.log(cityAllData,this.areaAddressList,this.defaultCity )
            for (let item of cityAllData) {
              //找到对应的label添加children
              if (this.areaAddressList[0] == item.label) {
                item.children = sz2
                getAction(this.url.findByParentId, { id: sz[1] }).then(res2 => {
                  if (res2.success && res2.result.length > 0) {
                    let sz3 = []
                    for (let item of res2.result) {
                      sz3.push({
                        label: item.name,
                        value: item.id,
                        isLeaf: false
                      })
                    }
                    for (let item2 of sz2) {
                      if (this.areaAddressList[1] == item2.label) {
                        item2.children = sz3
                        this.$nextTick(() => {
                          this.canShowDefaultCity = true
                        })
                        break
                      }
                    }
                  } else {
                    this.canShowDefaultCity = true
                    console.log('没有第三级地址')
                  }
                })
                break
              }
            }
          }else{
            this.canShowDefaultCity = true
            console.log('第二个为空值')
          }
        })
      }

    }
  }

</script>

<style lang="less">
  #container {
    width: 516px;
    height: 500px;
  }

  .map-ct {
    min-width: 150%;
    margin: 0 auto;
    display: flex;
    justify-content: center;

    .address-list {
      width: 200px;
      height: 500px;
      overflow-y: scroll;
      border: 1px solid gray;

      .item {
        width: 100%;
        height: 57px;
        font-size: 12px;
        line-height: 21px;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        border-bottom: 1px solid gray;
        padding-left: 26px;
      }

      .item:hover {
        background: rgb(240, 240, 240);
        cursor: pointer;
      }
    }
  }
</style>
