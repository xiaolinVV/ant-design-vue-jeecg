<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="礼包编号">
              <a-input placeholder="请输入" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="礼包名称">
              <a-input placeholder="请输入" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="参与方式">
              <!--下拉框-->
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="0">停用</a-select-option>
                <a-select-option value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="礼包发行时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.startTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange2"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="创建时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="更新时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.updateTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="addTemplate(1)" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('采购礼包')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :scroll="{x:3500}"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="startTime" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square">{{record.startTime}}~{{record.endTime}}</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.status==0">停用</span>
            <span v-if="record.status==1">启用</span>
          </div>
        </template>
        <template slot="mainPicture" slot-scope="text, record, index">
          <img  class="clickShowImage " :preview="'mainPicture' + index" :src="handleImage(text)" alt="">
        </template>
        <template slot="viewScope" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a v-if="record.viewScope==0"@click="showStore(record)">指定门店</a>
            <span v-if="record.viewScope==1" >全平台</span>
          </div>
        </template>
        <template slot="modeDistribution" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.modeDistribution==0">按代理比例</span>
            <span v-if="record.modeDistribution==1">按礼包比例</span>
          </div>
        </template>
        <template slot="allocationModel" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.allocationModel==0">按加盟商比例</span>
            <span v-if="record.allocationModel==1">按礼包比例</span>
          </div>
        </template>
        <template slot="proviceAward" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.modeDistribution==0">省代比例</span>
            <span v-if="record.modeDistribution==1">{{record.proviceAward}}</span>
          </div>
        </template>
        <template slot="cityAward" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.modeDistribution==0">市代比例</span>
            <span v-if="record.modeDistribution==1">{{record.cityAward}}</span>
          </div>
        </template>
        <template slot="towmAward" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.modeDistribution==0">县代比例</span>
            <span v-if="record.modeDistribution==1">{{record.towmAward}}</span>
          </div>
        </template>
        <template slot="isAllianceAward" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.isAllianceAward==0">不奖励</span>
            <span v-if="record.isAllianceAward==1">加盟商比例</span>
          </div>
        </template>
          <template slot="action" slot-scope="text,record" >
          <div style="display: flex;justify-content: space-around;align-items: center;width: 100%">
            <a @click="addTemplate(2,record)">编辑</a>
            <a-divider type="vertical"/>
            <a v-if="record.status==1" @click="showStopStatus(record)">停用</a>
            <a v-else @click="showStartStatus(record)">启用</a>
            <a-divider type="vertical"/>
            <a @click="showDelete(record)">删除</a>
          </div>
        </template>


      </a-table>
    </div>
    <!-- table区域-end -->
    <marketing-gift-bag-batch-list-stop-or-start-modal  ref="modalForm3" @ok="stuatusChangeOk">

    </marketing-gift-bag-batch-list-stop-or-start-modal>
    <!-- 表单区域 -->
    <marketingGiftBagBatch-modal ref="modalForm" @ok="modalFormOk"></marketingGiftBagBatch-modal>

    <marketing-gift-bag-batch-list-show-store-modal ref="modalForm2">

    </marketing-gift-bag-batch-list-show-store-modal>

  </a-card>
</template>

<script>
  import MarketingGiftBagBatchModal from './modules/MarketingGiftBagBatchModal'
  import MarketingGiftBagBatchListStopOrStartModal from './modules/MarketingGiftBagBatchListStopOrStartModal'
  import MarketingGiftBagBatchListShowStoreModal from './modules/MarketingGiftBagBatchListShowStoreModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  export default {
    name: "MarketingGiftBagBatchList",
    mixins: [JeecgListMixin],
    components: {
      MarketingGiftBagBatchModal,
      MarketingGiftBagBatchListStopOrStartModal,
      MarketingGiftBagBatchListShowStoreModal
    },
    data () {
      return {
        description: '采购礼包管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '采购礼包编号',
            align: "center",
            dataIndex: 'id'
          },
          {
            title: '采购礼包名称',
            align: "center",
            dataIndex: 'giftName'
          },
          {
            title: '采购礼包图片',
            align: "center",
            dataIndex: 'mainPicture',
            scopedSlots: {customRender: "mainPicture"}
          },
          {
            title: '采购礼包价格',
            align: "center",
            dataIndex: 'price'
          },
          {
            title: '发货次数',
            align: "center",
            dataIndex: 'sendTimes'
          },
          {
            title: '分销佣金',
            align: "center",
            dataIndex: 'distributionCommission'
          },
          {
            title: '推广人奖励',
            align: "center",
            dataIndex: 'promoterReward'
          },
          {
            title: '二级推广奖励',
            align: "center",
            dataIndex: 'promoterRewardTwo'
          },
          {
            title: '渠道店铺奖励',
            align: "center",
            dataIndex: 'channelShopsReward'
          },
          {
            title: '归属店铺奖励',
            align: "center",
            dataIndex: 'ownershipShopsReward'
          },
          {
            title: '代理分配方式',
            align: "center",
            dataIndex: 'modeDistribution',
            scopedSlots: {customRender: "modeDistribution"}
          },
          {
            title: '省代奖励',
            align: "center",
            dataIndex: 'proviceAward',
            scopedSlots: {customRender: "proviceAward"}
          },
          {
            title: '市代奖励',
            align: "center",
            dataIndex: 'cityAward',
            scopedSlots: {customRender: "cityAward"}
          },
          {
            title: '县代奖励',
            align: "center",
            dataIndex: 'towmAward',
            scopedSlots: {customRender: "towmAward"}
          },
          {
            title: '加盟商分配方式',
            align: "center",
            dataIndex: 'allocationModel',
            scopedSlots: {customRender: "allocationModel"}
          },
          {
            title: '加盟商奖励',
            align: "center",
            dataIndex: 'isAllianceAward',
            scopedSlots: {customRender: "isAllianceAward"}
          },
          {
            title: '礼包上架门店',
            align: "center",
            dataIndex: 'viewScope',
            scopedSlots: {customRender: "viewScope"}
          },
          {
            title: '发行量',
            align: "center",
            dataIndex: 'repertory'
          },
          {
            title: '购买人限制',
            align: "center",
            dataIndex: 'buyLimit_dictText'
          },
          {
            title: '最低购买数量',
            align: "center",
            dataIndex: 'smallBuyCount'
          },
          {
            title: '礼包发行时间',
            align: "center",
            dataIndex: 'startTime',
            scopedSlots: {customRender: "startTime"}
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            scopedSlots: {customRender: "status"}
          },
          {
            title: '停用说明',
            align: "center",
            dataIndex: 'closeExplain'
          },
          {
            title: '创建者',
            align: "center",
            dataIndex: 'createBy'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '更新者',
            align: "center",
            dataIndex: 'updateBy'
          },
          {
            title: '更新时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
            width:200,
            fixed:'right'
          }
        ],
        url: {
          list: "/marketingGiftBagBatch/marketingGiftBagBatch/list",
          delete: "/marketingGiftBagBatch/marketingGiftBagBatch/delete",
          deleteBatch: "/marketingGiftBagBatch/marketingGiftBagBatch/deleteBatch",
          exportXlsUrl: "marketingGiftBagBatch/marketingGiftBagBatch/exportXls",
          importExcelUrl: "marketingGiftBagBatch/marketingGiftBagBatch/importExcel",
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      showStore(record = {}){
        this.$refs.modalForm2.PopUp(2,'false',record)
      },
      showStopStatus(record = {}){
        this.$refs.modalForm3.showModalStopStatus(record);
      },
      showStartStatus(record = {}){
        this.$refs.modalForm3.showStartStatus(record);
      },
      showDelete(record = {}){
        // if(record.level == 1 && record.isDel == 1){
        //   this.$error({
        //     title: '该分类底下存在子分类或者商户，无法删除',
        //     content: '您若要删除该分类，请先移除子分类或者商户',
        //   });
        //   return;
        // }
        this.$refs.modalForm3.showDelete(record);
      },
      stuatusChangeOk(){
        this.loadData()
      },
      handleImage(image){
        if(image){
          return this.url.imgErver + '/' + Object.values(JSON.parse(image))
        }else{
          return ''
        }
      },
      getQueryParams(){
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime;
        delete param.updateTime;
        delete param.startTime;
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      onDateChange1: function (value, dateString) {
        this.queryParam.updateTime_begin=dateString[0];
        this.queryParam.updateTime_end=dateString[1];
      },
      onDateChange2: function (value, dateString) {
        this.queryParam.startTime_begin=dateString[0];
        this.queryParam.startTime_end=dateString[1];
      },
      addTemplate(part, item = ''){
        //part 2 编辑  1 添加
        if (part == 2) {
          localStorage.setItem('AddMarketingGiftbagPurchaseData', JSON.stringify(item))
        } else {
          localStorage.removeItem('AddMarketingGiftbagPurchaseData')
        }
        this.$router.push({path: '/marketing/modules/AddMarketingGiftbagPurchaseModel', query: {part}})
      },
    }
  }
</script>
<style scoped lang="less">

</style>