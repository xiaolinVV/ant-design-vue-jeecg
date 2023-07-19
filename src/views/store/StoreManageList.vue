<!--店铺管理认证列表-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺账号">
              <a-input placeholder="请输入" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人">
              <a-input placeholder="请输入" v-model="queryParam.bossName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人手机">
              <a-input placeholder="请输入" v-model="queryParam.bossPhone"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="门店名称">
                <a-input placeholder="请输入" v-model="queryParam.storeName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="分店名称">
                <a-input placeholder="请输入" v-model="queryParam.subStoreName"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="8">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所在城市">
                <selectAddress
                  ref="selectAddress"
                  @cityAllDataLoad="cityAllDataLoad"
                  style="margin: 0 10px; width: 100%"
                >
                </selectAddress>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="8">
              <a-form-item label="主体类型">
                <j-dict-select-tag
                  v-model="queryParam.straight"
                  placeholder="请选择主体分类"
                  dictCode="store_straight"
                />
              </a-form-item>
            </a-col>
            <!--:triggerChange="true"-->
            <a-col :md="8" :sm="8">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="主营分类">
                <j-dict-select-tag
                  v-model="queryParam.mainType"
                  placeholder="请选择主营分类"
                  dictCode="store_main_type"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="推广人类型">
                <a-select v-model="queryParam.promoterType" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">店铺</a-select-option>
                  <a-select-option :value="1">会员</a-select-option>
                  <a-select-option :value="2">平台</a-select-option>
                  <a-select-option :value="3">加盟商</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="推广人">
                <a-input placeholder="请输入" v-model="queryParam.promoterName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="认证状态">
                <j-dict-select-tag
                  v-model="queryParam.attestationStatus"
                  placeholder="请选择认证状态"
                  dictCode="store_attestation_status"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="店铺编号">
                <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <a-button type="primary" icon="download" @click="handleExportXls('店铺-店铺管理-店铺列表')">导出</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
         <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
         style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
         <a style="margin-left: 24px" @click="onClearSelected">清空</a>
       </div>-->
      <!--bordered-->

      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: 5000 }"
        rowKey="id"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="logoAddr" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'logoAddr' + index" :src="getAvatarView(record.logoAddr)" alt="" />
        </template>
        <template slot="avatarslot1" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            :preview="'avatarslot1' + index"
            :src="getAvatarView1(record.storePicture)"
            alt=""
            style="width: 32px; height: 32px; display: block"
          />
        </template>
        <template slot="avatarslot2" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            :preview="'avatarslot2' + index"
            :src="getAvatarView2(record.accordingStore)"
            alt=""
            style="width: 32px; height: 32px; display: block"
          />
        </template>
        <template slot="avatarslot3" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            :preview="'avatarslot3' + index"
            :src="getAvatarView3(record.licenseForEnterprise)"
            alt=""
            style="width: 32px; height: 32px; display: block"
            v-if="record.licenseForEnterprise != null"
          />
          <span v-if="record.licenseForEnterprise == null">~</span>
        </template>
        <template slot="avatarslot4" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            :preview="'avatarslot4' + index"
            :src="getAvatarView4(record.idPictureZ)"
            alt=""
            style="width: 32px; height: 32px; display: block"
          />
        </template>
        <template slot="avatarslot5" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            :preview="'avatarslot5' + index"
            :src="getAvatarView5(record.idPictureF)"
            alt=""
            style="width: 32px; height: 32px; display: block"
          />
        </template>
        <template slot="avatarslot6" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            :preview="'avatarslot6' + index"
            :src="getAvatarView6(record.idHand)"
            alt=""
            style="width: 32px; height: 32px; display: block"
          />
        </template>
        <template slot="avatarslot7" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            :preview="'avatarslot7' + index"
            :src="getAvatarView7(record.agentAuthorization)"
            alt=""
            style="width: 32px; height: 32px; display: block"
            v-if="record.agentAuthorization != null"
          />
          <span v-if="record.agentAuthorization == null">~</span>
        </template>
        <template slot="ssAddress" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            :preview="'ssAddress' + index"
            :src="ssAddressView(record.ssAddress)"
            alt=""
            style="width: 32px; height: 32px; display: block"
          />
        </template>
        <template slot="goodAudit" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-switch
              checkedChildren="免审核"
              unCheckedChildren="需审核"
              v-model="record.goodAudit"
              @change="switchChange(record)"
            />
          </div>
        </template>
        <template slot="isChain" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-switch
              checkedChildren="是"
              unCheckedChildren="否"
              v-model="record.isChain"
              @change="isChainChange(record)"
            />
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>
        <template slot="isRecommend" slot-scope="text">
          <div class="anty-img-wrap">
            <span shape="square" v-if="text == 0">否</span>
            <span shape="square" v-if="text == 1">是</span>
          </div>
        </template>

        <template slot="labelCount" slot-scope="text, record">
          <a @click="showExhibitionSpecialLabel(record)">{{ text }}</a>
        </template>

        <template slot="storeType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-select v-model="record.storeType" @change="storeTypeChange(record, index)">
              <a-select-option value="0">联盟店</a-select-option>
              <a-select-option value="1">独立店</a-select-option>
            </a-select>
          </div>
        </template>
        <template slot="promoterType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.promoterType == 0">店铺</span>
            <span shape="square" v-if="record.promoterType == 1">会员</span>
            <span shape="square" v-if="record.promoterType == 2">平台</span>
            <span shape="square" v-if="record.promoterType == 3">加盟商</span>
          </div>
        </template>
        <div slot="action" slot-scope="text, record">
          <a @click="showFloor(record, '楼层')" v-if="floorState == 1">楼层</a>

          <a-divider type="vertical" />
          <a v-if="record.isRecommend == 0" @click="changeCommand(record)">设为推荐</a>
          <a v-else @click="changeCommand(record)">取消推荐</a>
          <a-divider type="vertical" />
          <a @click="updataStatusAndCloseEplain(record)" v-if="record.status == 1">停用</a>
          <a @click="updateStatus(record)" v-if="record.status == 0">启动</a>
          <a-divider type="vertical" />
          <a @click="showModal(record)">审核</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="showPromoter(record, '修改推广人')"> 修改推广人 </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="showFranchisee(record, '修改归属加盟商')"> 修改归属加盟商 </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleEdit(record, '基础信息')"> 编辑基础信息 </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleEdit({ ...record, title: '证件信息' }, '证件信息')"> 编辑证件信息 </a>
              </a-menu-item>
              <a-menu-item v-if="floorState == 1">
                <a @click="showSpecialLabel(record, '特色标签')">特色标签</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleEdit(record, '排序')">排序</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="storeManageReceivingCodeClick(record)">收款码</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="storeCashierSettingModalClick(record)">收银设置</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="storeCashierRoutingListClick(record, '0')">收银分账设置</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="storeOrderSettingModalClick(record)">订单设置</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="storeCashierRoutingListClick(record, '1')">订单分账设置</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="storeFunctionSetModalClick(record)">功能设置</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <store-manage-audit-modal ref="modalForm1" @ok="modalFormOk"></store-manage-audit-modal>
    <!--    编辑弹窗-->
    <store-manage-modal ref="modalForm" @ok="modalFormOk" @refresh="searchQuery"></store-manage-modal>

    <store-manage-receiving-code ref="storeManageReceivingCodeModal"></store-manage-receiving-code>

    <!--收银设置-->
    <store-cashier-setting-modal ref="storeCashierSettingModal"></store-cashier-setting-modal>

    <!--订单设置-->
    <store-order-setting-modal ref="storeOrderSettingModal"></store-order-setting-modal>

    <!--分账设置-->
    <store-cashier-routing-list ref="storeCashierRoutingList"></store-cashier-routing-list>

    <!--功能设置-->
    <store-function-set-modal ref="storeFunctionSetModal"></store-function-set-modal>
  </a-card>
</template>

<script>
import { getAction } from '@/api/manage'
import { putAction } from '@/api/manage'
import { postAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
//字典
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import StoreManageAuditModal from './modules/StoreManageAuditModal'
import StoreManageModal from './modules/StoreManageModal'
import { colAuthFilter } from '@/utils/authFilter'
import selectAddress from '@/components/selectAddress/selectAddress'
import StoreManageReceivingCode from './modules/StoreManageReceivingCode'
import StoreCashierSettingModal from './modules/StoreCashierSettingModal'
import StoreOrderSettingModal from './modules/StoreOrderSettingModal'
import StoreFunctionSetModal from './modules/StoreFunctionSetModal'
import StoreCashierRoutingList from './StoreCashierRoutingList'

export default {
  name: 'StoreManageList',
  mixins: [JeecgListMixin],
  components: {
    StoreManageReceivingCode,
    StoreManageAuditModal,
    StoreManageModal,
    selectAddress,
    StoreCashierSettingModal,
    StoreFunctionSetModal,
    StoreCashierRoutingList,
    StoreOrderSettingModal,
  },
  inject: ['rush'],
  data() {
    return {
      description: '店铺管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          fixed: 'left',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '店铺编号',
          align: 'center',
          dataIndex: 'id',
        },
        {
          title: '店铺账号',
          align: 'center',
          dataIndex: 'userName',
        },
        {
          title: '联系人',
          align: 'center',
          dataIndex: 'bossName',
        },
        {
          title: '联系人手机号',
          align: 'center',
          dataIndex: 'bossPhone',
        },
        {
          title: '门店名称',
          align: 'center',
          dataIndex: 'storeName',
        },
        {
          title: '分店名称',
          align: 'center',
          dataIndex: 'subStoreName',
        },
        {
          title: 'logo',
          align: 'center',
          dataIndex: 'logoAddr',
          scopedSlots: { customRender: 'logoAddr' },
        },
        {
          title: '门面照',
          align: 'center',
          dataIndex: 'storePicture',
          scopedSlots: { customRender: 'avatarslot1' },
        },
        {
          title: '店内照',
          align: 'center',
          dataIndex: 'accordingStore',
          scopedSlots: { customRender: 'avatarslot2' },
        },
        {
          title: '城市',
          align: 'center',
          dataIndex: 'areaAddress',
        },
        {
          title: '门店地址',
          align: 'center',
          dataIndex: 'storeAddress',
        },
        {
          title: '主体类型',
          align: 'center',
          dataIndex: 'straight_dictText',
        },
        {
          title: '主营分类',
          align: 'center',
          dataIndex: 'mainType_dictText',
        },

        {
          title: '客服电话',
          align: 'center',
          dataIndex: 'takeOutPhone',
        },

        {
          title: '统一社会信用代码',
          align: 'center',
          dataIndex: 'socialCreditCode',
        },
        {
          title: '统一社会信用代码证',
          align: 'center',
          dataIndex: 'licenseForEnterprise',
          scopedSlots: { customRender: 'avatarslot3' },
        },
        {
          title: '经办人类型',
          align: 'center',
          dataIndex: 'agentType_dictText',
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'agentName',
        },
        {
          title: '身份证号码',
          align: 'center',
          dataIndex: 'idCode',
        },
        {
          title: '身份证正面照片',
          align: 'center',
          dataIndex: 'idPictureZ',
          scopedSlots: { customRender: 'avatarslot4' },
        },
        {
          title: '身份证反面照片',
          align: 'center',
          dataIndex: 'idPictureF',
          scopedSlots: { customRender: 'avatarslot5' },
        },

        {
          title: '手持身份证照片',
          align: 'center',
          dataIndex: 'idHand',
          scopedSlots: { customRender: 'avatarslot6' },
        },
        {
          title: '授权书图片',
          align: 'center',
          dataIndex: 'agentAuthorization',
          scopedSlots: { customRender: 'avatarslot7' },
        },
        {
          title: '推广人类型',
          align: 'center',
          dataIndex: 'promoterType',
          scopedSlots: { customRender: 'promoterType' },
        },
        {
          title: '推广人',
          align: 'center',
          dataIndex: 'promoterName',
        },
        {
          title: '归属加盟商',
          align: 'center',
          dataIndex: 'allianceName',
        },
        {
          title: '店铺二维码',
          align: 'center',
          dataIndex: 'ssAddress',
          scopedSlots: { customRender: 'ssAddress' },
        },
        {
          title: '商品审核',
          align: 'center',
          dataIndex: 'goodAudit',
          width: 100,
          scopedSlots: { customRender: 'goodAudit' },
        },
        {
          title: '认证状态',
          align: 'center',
          dataIndex: 'attestationStatus_dictText',
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark',
        },
        {
          title: '楼层',
          align: 'center',
          dataIndex: 'floorName',
        },
        {
          title: '特色标签',
          align: 'center',
          dataIndex: 'labelCount',
          scopedSlots: { customRender: 'labelCount' },
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort',
        },
        {
          title: '是否推荐',
          align: 'center',
          dataIndex: 'isRecommend',
          scopedSlots: { customRender: 'isRecommend' },
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '停用原因',
          align: 'center',
          dataIndex: 'closeExplain',
        },
        {
          title: '店铺类型',
          align: 'center',
          dataIndex: 'storeType',
          scopedSlots: { customRender: 'storeType' },
        },
        {
          title: '是否连锁',
          align: 'center',
          dataIndex: 'isChain',
          scopedSlots: { customRender: 'isChain' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 250,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/storeManage/storeManage/list',
        delete: '/storeManage/storeManage/delete',
        deleteBatch: '/storeManage/storeManage/deleteBatch',
        exportXlsUrl: 'storeManage/storeManage/exportXls',
        importExcelUrl: 'storeManage/storeManage/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        addAudit: '/storeManage/storeManage/audit',
        updateStatusById: '/storeManage/storeManage/updateStatusById',
        updateAttestationStatusById: '/storeManage/storeManage/updateAttestationStatusById',
        findByParentId: '/sysArea/sysArea/findByParentId',
        getList: '/sysArea/sysArea/getList',
        edit: 'storeManage/storeManage/edit',
      },
      id: '',
      //地址一级options
      addressFirstList: [],
      //地址二级option
      addressSecondList: [],
      //地址三级option
      addressThirdList: [],
      //默认一级option
      firstDefaultAddress: '',
      //默认二级option
      SecondDefaultAddress: '',
      //刷新地址联动
      showAddress: true,
      //
      disableSubmit: false,
      floorState: 1,
    }
  },
  created() {
    this.initIndex()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },

  methods: {
    changeCommand(record) {
      let modelInfo = {
        title: '点击确定将该店铺设为推荐',
        content: '您确定要这么设定吗',
        isRecommend: 0,
      }

      if (record.isRecommend == 1) {
        modelInfo = {
          title: '点击确定将取消该店铺推荐',
          content: '您确定要这么设定吗',
          isRecommend: 0,
        }
      } else {
        modelInfo = {
          title: '点击确定将该店铺设为推荐',
          content: '您确定要这么设定吗',
          isRecommend: 1,
        }
      }
      this.$confirm({
        title: modelInfo.title,
        content: modelInfo.content,
        onOk: () => {
          putAction(this.url.edit, {
            // ...record,
            id: record.id,
            isRecommend: modelInfo.isRecommend,
          }).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.loadData()
            } else {
              this.$message.warning(res.message)
            }
          })
        },
        onCancel() {},
      })
    },
    cityAllDataLoad(defaultCity) {
      if (defaultCity && defaultCity.length > 0) {
        this.queryParam.sysAreaId = defaultCity.join(',')
      } else {
        try {
          delete this.queryParam.sysAreaId
        } catch (e) {}
      }
    },
    switchChange(item) {
      console.log(item)
      let info = {
        goodAudit: item.goodAudit ? true : false,
        id: item.id,
      }
      putAction(this.url.edit, info)
    },
    //店铺类型选择
    storeTypeChange(item, index) {
      console.log(item, index)
      let info = {
        id: item.id,
        storeType: item.storeType,
      }
      putAction(this.url.edit, info)
    },
    isChainChange(item) {
      let info = {
        isChain: item.isChain ? true : false,
        id: item.id,
      }
      putAction(this.url.edit, info)
    },
    //获取地址一级options
    getList() {
      getAction(this.url.getList).then((res) => {
        if (res.success) {
          this.showAddress = false
          this.addressFirstList = res.result
          this.firstDefaultAddress = res.result[0].name
          this.$nextTick(() => {
            this.showAddress = true
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //点击一级options展示二级
    firstOptions(item) {
      getAction(this.url.findByParentId, { id: item.id }).then((res) => {
        if (res.success) {
          this.showAddress = false
          this.firstDefaultAddress = item.name
          this.addressSecondList = res.result
          this.SecondDefaultAddress = res.result[0].name
          this.$nextTick(() => {
            this.showAddress = true
            this.AllData.areaAddress = `${item.name}`
            this.AllData.sysAreaId = item.id
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //点击二级展示三级
    secondOptions(item) {
      getAction(this.url.findByParentId, { id: item.id }).then((res) => {
        if (res.success) {
          this.addressThirdList = res.result
          this.AllData.areaAddress += `-${item.name}`
          this.AllData.sysAreaId = item.id
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //点击三级
    thirdOptions(item) {
      this.AllData.areaAddress += `-${item.name}`
      this.AllData.sysAreaId = item.id
    },

    initIndex() {
      // 楼层开关，开启楼层后，店铺位置距用户的距离，替换为楼层。0：关闭；1：开启；
      initDictOptions('floor_state').then((res) => {
        if (res.success && res.result.length > 0) {
          let floorState = res.result[0].value
          // this.straight = res.result
          this.floorState = floorState
          if (floorState != 1) {
            delete this.columns[31]
          }
        } else {
          delete this.columns[31]
          this.floorState = 0
        }
      })
    },
    showPromoter(record, title) {
      this.$refs.modalForm.title = title
      this.$refs.modalForm.showPromoterModal(record)
    },
    showFranchisee(record, title) {
      this.$refs.modalForm.title = title
      this.$refs.modalForm.showFranchiseeModal(record)
    },
    showFloor(record, title) {
      this.$refs.modalForm.title = title
      this.$refs.modalForm.showFloor(record)
    },
    showSpecialLabel(record, title) {
      this.$refs.modalForm.title = title
      this.$refs.modalForm.showSpecialLabel(record)
    },
    showExhibitionSpecialLabel(record) {
      this.$refs.modalForm.title = '特色标签'
      this.$refs.modalForm.showExhibitionSpecialLabel(record)
    },
    //启用
    updateStatus(item) {
      let that = this
      if (!this.url.updateStatusById) {
        this.$message.error('请设置url.updateFrameStatus属性!')
        return
      }
      this.$confirm({
        title: '启用店铺后，店铺商品、订单、资金模块都将可以访问',
        content: '您确定要启用吗？',
        onOk: () => {
          console.log(item)
          getAction(that.url.updateStatusById, {
            id: item.id,
            status: item.status == '0' ? '1' : '0',
            closeExplain: '',
          }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //弹窗
    updataStatusAndCloseEplain(item) {
      this.$refs.modalForm.getExplainInfo(item)
      this.$refs.modalForm.title = '停用'
      this.$refs.modalForm.disableSubmit = true
    },
    onChangeDate(date, dateString) {
      console.log(date, dateString)
    },
    getAvatarView: function (logoAddr) {
      return this.url.imgerver + '/' + logoAddr
    },
    getAvatarView1: function (storePicture) {
      return this.url.imgerver + '/' + storePicture
    },
    getAvatarView2: function (accordingStore) {
      return this.url.imgerver + '/' + accordingStore
    },
    getAvatarView3: function (licenseForEnterprise) {
      return this.url.imgerver + '/' + licenseForEnterprise
    },
    getAvatarView4: function (idPictureZ) {
      return this.url.imgerver + '/' + idPictureZ
    },
    getAvatarView5: function (idPictureF) {
      return this.url.imgerver + '/' + idPictureF
    },
    getAvatarView6: function (idHand) {
      return this.url.imgerver + '/' + idHand
    },
    getAvatarView7: function (agentAuthorization) {
      return this.url.imgerver + '/' + agentAuthorization
    },
    ssAddressView: function (ssAddress) {
      return this.url.imgerver + '/' + ssAddress
    },
    modalFormOk(info) {
      let obj = info
      //        obj.id = this.id
      postAction(this.url.updateAttestationStatusById, obj).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$refs.modalForm1.clearAll()
          this.rush()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    showModal(item) {
      this.$refs.modalForm1.showModal(item)
      this.$refs.modalForm1.title = '价格'
      this.$refs.modalForm1.disableSubmit = false
    },
    storeManageReceivingCodeClick(record) {
      this.$refs.storeManageReceivingCodeModal.showModal(record)
    },
    storeCashierSettingModalClick(record) {
      this.$refs.storeCashierSettingModal.showSettting(record)
    },
    storeOrderSettingModalClick(record) {
      this.$refs.storeOrderSettingModal.showSettting(record)
    },
    storeFunctionSetModalClick(record) {
      this.$refs.storeFunctionSetModal.showSettting(record)
    },
    storeCashierRoutingListClick(record, fashionableType) {
      record.fashionableType = fashionableType
      this.$refs.storeCashierRoutingList.show(record)
    },
  },
}
</script>
<style scoped lang="less">
/*@import '~@assets/less/common.less';*/
/* .operation{
     display: flex;
     justify-content: space-around;
     !*字体大小*!
     font-size: 12px;
   }*/
</style>
