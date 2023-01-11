<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam
              .goodName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="商品编号">
              <a-input placeholder="请输入" v-model="queryParam.goodNo"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="商品折扣">
              <a-input-group compact>
                <a-input-number
                  :min="0"
                  :max="queryParam.maxDiscount"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  style=" width: 100px; text-align: center" placeholder="请输入" v-model="queryParam.minDiscount"/>
                <a-input
                  style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                  placeholder="~"
                  disabled
                />
                <a-input-number
                  :min="0"
                  :max="100"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  style="width: 100px; text-align: center; border-left: 0" placeholder="请输入"
                  v-model="queryParam.maxDiscount"/>
              </a-input-group>

            </a-form-item>

          </a-col>


          <a-col :md="6" :sm="8">
            <a-form-item
              style="display: flex;"
              label="商品分类">
              <a-select v-model="queryParam.goodTypeIdOne" placeholder="请选择" @change="chooseMedicine"
                        style="width:90px;margin-right: 10px;">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
              <a-select v-model="queryParam.goodTypeIdTwo" placeholder="请选择" @change="chooseMedicine1"
                        style="width:90px;margin-right: 10px;"><!--v-model="id"-->
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
                <!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
              </a-select>
              <a-select v-model="queryParam.goodTypeIdThree" placeholder="请选择" style="width:90px;margin-right: 10px;">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType2" :value="item.id">{{ item.name }}</a-select-option>
                <!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">

            <a-col :md="6" :sm="8">
              <a-form-item label="供应商">
                <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="上下架">
                <a-select v-model="queryParam.frameStatus" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">下架</a-select-option>
                  <a-select-option :value="1">上架</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
             <a-col :md="6" :sm="8">
              <a-form-item label="客户端显示">
                <a-select v-model="queryParam.pointsDisplay" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">全部</a-select-option>
                  <a-select-option :value="1">仅小程序</a-select-option>
                  <a-select-option :value="2">仅app</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="商品属性">
                <a-select v-model="queryParam.goodForm" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">普通商品</a-select-option>
                  <a-select-option value="1">特价商品</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="审核状态">
                <a-select v-model="queryParam.auditStatus" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">草稿</a-select-option>
                  <a-select-option :value="1">待审核</a-select-option>
                  <a-select-option :value="2">审核通过</a-select-option>
                  <a-select-option :value="3">审核不通过</a-select-option>
                </a-select>

              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">停用</a-select-option>
                  <a-select-option :value="1">启用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">

              <a-form-item label="活动">
                <j-dict-select-tag v-model="queryParam.activitiesType" placeholder="请选择" dictCode="activities_type"/>
              </a-form-item>
            </a-col>
            <!--时间选择框-->
            <a-col :md="6" :sm="8">
              <a-form-item label="创建时间">
                <a-range-picker
                  style="width: 210px"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>

          </template>
          <a-col :md="24" :sm="8">
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
    <!-- <div style="margin-bottom: 20px;margin-top: 20px">
       <span >第几页:</span>
       <a-input-number v-model="page" style="margin-left: 20px;margin-right: 20px"/>

       <span >商品个数:</span>
       <a-input-number v-model="count" style="margin-left: 20px;margin-right: 20px"/>

       <a-button style="margin-left: 20px" @click="AddGoodListjd()" type="primary" icon="plus" :loading="clcikFrequency>=1">新增接口数据</a-button>
       <a-button style="margin-left: 20px" @click="addAllGoodListjd()" type="primary" icon="plus">新增所有商品数据</a-button>
       <a-button style="margin-left: 20px" @click="getGoodListUpdate()" type="primary" icon="plus">部分商品数据校验更新</a-button>
       <a-button style="margin-left: 20px" @click="allGoodListUpdate()" type="primary" icon="plus">所有商品数据校验更新</a-button>

     </div>-->


    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
      <!--<a-button @click="BatchShelves('1')" type="primary" icon="plus">批量上架</a-button>-->
      <!--<a-button @click="BatchShelves('0')" type="primary" icon="plus">批量下架</a-button>-->
      <a-button @click="putaway('1')" type="primary" icon="plus">批量上架</a-button>
      <a-button @click="putaway('0')" type="primary" icon="plus">批量下架</a-button>
      <a-button @click="BatchStatus('1')" type="primary" icon="plus">批量启用</a-button>
      <a-button @click="showModalStopStatus1()" type="primary" icon="plus">批量停用</a-button>
      <a-button type="primary" icon="plus" @click='showClientModal'>客户端显示</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('商品列表')">导出</a-button>
       <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
         <a-button type="primary" icon="import">导入</a-button>
       </a-upload>-->
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
      </a-dropdown>
    </div>

    <!-- table区域-begin -->

    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
      <a-table
        ref="table"
        size="middle"
        bordered
        :scroll="{x:true}"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="mainPicture" slot-scope="text, record, index">
          <img class="clickShowImage" v-if="record.mainPicture != undefined " :preview="'mainPicture' + index"
               :src="getAvatarView(JSON.parse(record.mainPicture)[0])" alt=""/>
          <a-avatar shape="square" v-if="record.mainPicture == undefined || record.mainPicture ==''  "
                    :src="getAvatarView(record.mainPicture)" icon="user"/>
        </template>
        <template slot="frameStatus" slot-scope="text, record, index">
          <div class="anty-img-wrap">

            <span shape="square" v-if="record.frameStatus==0">下架</span>
            <span shape="square" v-if="record.frameStatus==1">上架</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0">停用</span>
            <span shape="square" v-if="record.status==1">启用</span>
          </div>
        </template>
        <template slot="goodForm" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.goodForm==0">普通商品</span>
            <span shape="square" v-if="record.goodForm==1">特价商品</span>
          </div>
        </template>

        <template slot="pointsDisplay" slot-scope="text">
           <div class="anty-img-wrap">
            <span v-if="text == 1">
              仅小程序
            </span>
            <span v-else-if="text == 2">
              仅app
            </span>
            <span v-else>
              全部
            </span>
          </div>
        </template>
        <template slot="auditStatus" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.auditStatus==0">草稿</span>
            <span shape="square" v-if="record.auditStatus==1">待审核</span>
            <span shape="square" v-if="record.auditStatus==2">审核通过</span>
            <span shape="square" v-if="record.auditStatus==3">审核不通过</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
           <a @click='changeSort(record)'>排序</a>
          <a-divider type="vertical" />
          <a @click="showModal(record.id)">改价格</a>
          <a-divider type="vertical"/>
           <a @click="showModalRepertory(record.id)">改库存</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a v-if="record.status==1" @click="showModalStopStatus(record.id,'0')">停用</a>
          <a v-if="record.status==0" @click="updateStatus(record.id,'1')">启用</a>
          <a-divider type="vertical"/>
           <a v-if="record.frameStatus==0" @click="updateFrameStatus(record.id,'1')">上架</a>
           <a v-if="record.frameStatus==1" @click="showModalFrameStatus(record.id,'0')">下架</a>
          <a-divider type="vertical"/>
           <a @click="copyAddress(record.id)">复制地址</a>
          <a-divider type="vertical"/>
           <a @click="showModalDelete(record.id)">删除</a>
          <!-- <a-divider type="vertical" />
           <a @click="handleEdit(record)">预览</a>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <goodList-modal ref="modalForm" @ok="modalFormOk"></goodList-modal>
    <good-list-price-modal ref="modalForm1" @ok="modalFormOk"></good-list-price-modal>
    <clientModal ref='clientModal' @ok="clientModalOk"></clientModal>
    <!--复制内容-->
    <input id="duplicateContent" style="display: none"></input>


    <!--批量下架提示框弹出-->
    <a-modal :title="title" v-model="allVisibleFrameStatus" @ok="allHideModalFrameStatus()" @cancel="handleCancel()"
             okText="确认" cancelText="取消">
      <!--<input style="display: none"  :value="goodListId2"  placeholder="id"/>-->
      <!--<h3>下架商品后，该商品用户将无法搜索、浏览、购买</h3>-->
      <!--<p>您确定要下架吗？</p>-->
      <div v-html="explain"></div>
      <a-textarea
        :placeholder="hint"
        v-model="allFrameExplain"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </a-modal>


  </a-card>
</template>

<script>
  import GoodListModal from './modules/GoodListModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import GoodListPriceModal from './modules/GoodListPriceModal'
  import { getAction, postAction } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'
  import { filterObj } from '@/utils/util'
  import clientModal from '@/components/popUp/clientChangeModal'
  export default {
    name: 'GoodListList',
    //inject:['Rush2'],
    mixins: [JeecgListMixin],
    components: {
      GoodListModal,
      GoodListPriceModal,
      JDate,
      clientModal
    },
    data() {
      return {
        title: '',//弹出标题
        explain: '',//说明
        hint: '',//提示
        frameStatus: '',//1:上架,0下架
        allFrameExplain: '',//批量上下架原因
        allVisibleFrameStatus: false,//批量上下架提示框
        clcikFrequency: 0,//点击次数
        description: '商品列表管理页面',
        goodListId2: '',
        statusExplain: '',
        frameExplain: '',
        createTime: [],
        visibleStopStatus: false,
        visibleFrameStatus: false,
        parentId: '',
        listGoodType: [],
        listGoodType1: [],
        listGoodType2: [],
        goodUrl: '',
        queryParam: {
          goodTypeIdOne: '',
          goodTypeIdTwo: '',
          goodTypeIdThree: '',
          createTime: []
        },
        //供应链接口用
        page: '',
        count: '',
//        goodTypeId:"",
//        goodTypeId1:"",
//        goodTypeId2:"",
        wrapperCol: {},
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            fixed: 'left',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '商品图片',//相对地址（以json的形式存储多张）
            align: 'center',
            dataIndex: 'mainPicture',
            scopedSlots: { customRender: 'mainPicture' }
          },

          {
            title: '商品编号',
            align: 'center',
            dataIndex: 'goodNo'
          },
          {
            title: '商品名称',
            align: 'center',
            dataIndex: 'goodName'
          },
          {
            title: '商品分类',
            align: 'center',
            dataIndex: 'goodTypeNames'
          },
          {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
         },
          {
            title: '市场价',
            align: 'center',
            dataIndex: 'marketPrice'
          },
          {
            title: '销售价',
            align: 'center',
            dataIndex: 'price',
             sorter: (a, b) => a.price - b.price
          },
          {
            title: '成本价',
            align: 'center',
            dataIndex: 'costPrice',
            sorter: (a, b) => a.costPrice - b.costPrice
          },
          {
            title: '供货价',
            align: 'center',
            dataIndex: 'supplyPrice'
          },
          {
            title: '会员价',//，按照利润比例，根据数据字段设置的比例自动填入
            align: 'center',
            dataIndex: 'vipPrice'
          },
          {
            title: '库存',
            align: 'center',
            dataIndex: 'repertory'
          },
          {
            title: '商品折扣',
            align: 'center',
            dataIndex: 'discount'
          },

          {
            title: '供应商',
            align: 'center',
            dataIndex: 'realname'
          },
          {
            title: '上下架',//；0：下架；1：上架
            align: 'center',
            dataIndex: 'frameStatus',
            scopedSlots: { customRender: 'frameStatus' }
          },
          {
            title: '上下架说明',
            align: 'center',
            dataIndex: 'frameExplain'
          },{
            title: '客户端显示',
            align: 'center',
            dataIndex: 'pointsDisplay',
            scopedSlots: { customRender: 'pointsDisplay' }
          },

          {
            title: '商品属性',
            align: 'center',
            dataIndex: 'goodForm',
            scopedSlots: { customRender: 'goodForm' }
          },
          {
            title: '状态',//：0：停用；1：启用
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '停用说明',//状态说明，
            align: 'center',
            dataIndex: 'statusExplain'
          },
          {
            title: '审核',//状态：0:草稿；1：待审核；2：审核通过；3：审核不通过auditStatus
            align: 'center',
            dataIndex: 'auditStatus',
            scopedSlots: { customRender: 'auditStatus' }
          },
          {
            title: '审核说明',
            align: 'center',
            dataIndex: 'auditExplain'
          },
          {
            title: '活动',//;对应数据字典字段的活动类型数据，为空代表没有参与活动
            align: 'center',
            dataIndex: 'activitiesType_dictText',
            sorter: true
          },
          {
            title: '创建者',
            align: 'center',
            dataIndex: 'createBy'
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: 450,
            scopedSlots: { customRender: 'action' }
          }
        ],


        url: {
          list: '/goodList/goodList/list',
          delete: '/goodList/goodList/delete',
          deleteBatch: '/goodList/goodList/deleteBatch',
          exportXlsUrl: '/goodList/goodList/exportXls',
          importExcelUrl: '/goodList/goodList/importExcel',
          updateStatus: '/goodList/goodList/updateStatus',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          updateFrameStatus: '/goodList/goodList/updateFrameStatus',
          getgoodTypeListcascade: '/goodType/goodType/getgoodTypeListcascade',
          getGoodUrl: '/goodList/goodList/getGoodUrl',
          //供应链接口
          getGoodListListJD: '/open/goodList/getGoodListListJD',
          getAllGoodListListJD: '/open/goodList/getAllGoodListListJD',
          getAllGoodListUpdateJD: '/open/goodList/getAllGoodListUpdateJD',
          getGoodListUpdateJD: '/open/goodList/getGoodListUpdateJD'


        }
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }

    },
    mounted() {
      this.goodTypeListcascade('0')
      console.log('zhixingle')
      // console.log("this.dataSource",this.dataSource)
      if (this.$route.query.isrush) {
        console.log('zhixingle')
        // location.reload()

        // this.Rush2()
      }
    },

    methods: {

      putaway(frameStatus) {

        //校验
        if (!this.url.updateFrameStatus) {
          this.$message.error('请设置url.updateFrameStatus属性!')
          return
        }
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        }

        this.frameStatus = frameStatus
        if (frameStatus == 0) {//下架
          this.title = '下架'
          this.explain = '<h3>下架商品后，该商品用户将无法搜索、浏览、购买</h3>\n' + '<p>您确定要下架吗？</p>'
          this.hint = '下架说明'
        } else {//上架
          this.title = '上架'
          this.explain = '<h3>上架商品后，该商品用户将可以搜索、浏览、购买</h3>\n' + '<p>您确定要上架吗？</p>'
          this.hint = '上架说明'
        }

        this.allVisibleFrameStatus = true
      },

      allHideModalFrameStatus() {

        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }

        var that = this
        getAction(that.url.updateFrameStatus, {
          ids: ids,
          frameStatus: this.frameStatus,
          frameExplain: this.allFrameExplain
        }).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.loadData()
            that.onClearSelected()
          } else {
            that.$message.warning(res.message)
          }
        })

        this.allVisibleFrameStatus = false
      },

      handleCancel(e) {
        this.allVisibleFrameStatus = false
      },

      handleEdit(record) {
        //路由跳转
        localStorage.setItem('GoodListListInfo', JSON.stringify(record))
        this.$router.push({ path: '/good/modules/GoodListadd2', query: { reusePage: 1 } })

      },
      handleAdd() {
        //路由跳转
        localStorage.removeItem('GoodListListInfo')
        this.$router.push({ path: '/good/modules/GoodListadd', query: { reusePage: 1 } })
      },
      getAvatarView: function(mainPicture) {
        return this.url.imgerver + '/' + mainPicture
      },

      BatchShelves: function(FrameStatus) {
        if (!this.url.updateFrameStatus) {
          this.$message.error('请设置url.updateFrameStatus属性!')
          return
        }
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        } else {
          var ids = ''
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ','
          }
          var that = this


          this.$confirm({
            title: '确认修改',
            content: '是否修改选中数据?',
            onOk: function() {
              getAction(that.url.updateFrameStatus, {
                ids: ids,
                frameStatus: FrameStatus,
                frameExplain: ''
              }).then((res) => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadData()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
            }
          })
        }
      },


      //批量启用
      BatchStatus: function(status) {
        if (!this.url.updateStatus) {
          this.$message.error('请设置url.updateStatus属性!')
          return
        }
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        } else {
          var ids = ''
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ','
          }
          var that = this
          this.$confirm({
            title: '批量启用商品后，这些商品用户将可以搜索、浏览、购买，供应商可以上下架',
            content: '您确定要批量启用吗？',
            onOk: function() {
              getAction(that.url.updateStatus, { ids: ids, status: status, statusExplain: '' }).then((res) => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadData()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
            }
          })
        }
      },
      //启用
      updateStatus: function(id, status) {
        //this.stopRemark="";
        if (!this.url.updateStatus) {
          this.$message.error('请设置url.updateFrameStatus属性!')
          return
        }
        var that = this
        this.$confirm({
          title: '启用商品后，该商品用户将可以搜索、浏览、购买，供应商可以上下架',
          content: '您确定要启用吗？',
          onOk: function() {

            getAction(that.url.updateStatus, { ids: id, statusExplain: '', status: status }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      },
      //上架
      updateFrameStatus: function(id, FrameStatus) {
        if (!this.url.updateFrameStatus) {
          this.$message.error('请设置url.updateFrameStatus属性!')
          return
        }
        var that = this
        this.$confirm({
          title: '上架商品后，该商品用户将可以搜索、浏览、购买',
          content: '您确定要上架吗？',
          onOk: function() {
            getAction(that.url.updateFrameStatus, {
              ids: id,
              frameStatus: FrameStatus,
              frameExplain: ''
            }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      },
      clientModalOk(){
        this.loadData()
      },
      //价格
      showModal(id) {
        this.$refs.modalForm1.showModal(id)
        this.$refs.modalForm1.title = '价格'
        this.$refs.modalForm1.disableSubmit = false
      },
      //对比价链接
      showModalComparisonURL(id, skuUrl) {
        this.$refs.modalForm1.showModalComparisonURL(id, skuUrl)
        this.$refs.modalForm1.title = '对比价链接'
        this.$refs.modalForm1.disableSubmit = false
      },
      //排序
      changeSort(record){
        this.$refs.modalForm1.showModalSort(record)
         this.$refs.modalForm1.title = '排序'
        this.$refs.modalForm1.disableSubmit = false
      },
      //库存
      showModalRepertory(id) {
        this.$refs.modalForm1.showModalRepertory(id)
        this.$refs.modalForm1.title = '库存'
        this.$refs.modalForm1.disableSubmit = false
      },
      //停用
      showModalStopStatus(id) {
        this.$refs.modalForm1.showModalStopStatus(id)
        this.$refs.modalForm1.title = '停用'
        this.$refs.modalForm1.disableSubmit = false
      },
      //批量停用
      showModalStopStatus1() {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        } else {
          var ids = ''
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ','
          }
        }
        this.$refs.modalForm1.showModalStopStatus(ids)
        this.$refs.modalForm1.title = '停用'
        this.$refs.modalForm1.disableSubmit = false
      },
      //客户端显示
      showClientModal(){
       if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        }
        let ids = this.selectedRowKeys.join(',')
        this.$refs.clientModal.open(ids)
      },
      //下架
      showModalFrameStatus(id) {
        this.$refs.modalForm1.showModalFrameStatus(id)
        this.$refs.modalForm1.title = '下架'
        this.$refs.modalForm1.disableSubmit = false
      },
      //删除
      showModalDelete(id) {
        this.$refs.modalForm1.showModalDelete(id)
        this.$refs.modalForm1.title = '删除'
        this.$refs.modalForm1.disableSubmit = false
      },
      goodTypeListcascade(parentId) {

        let that = this
        that.listGoodType1 = []
        that.listGoodType2 = []
        getAction(that.url.getgoodTypeListcascade, { parentId: parentId }).then((res) => {

          if (res.success) {
            that.listGoodType = res.result.listGoodType
            //that.$message.success(res.message);
            //  console.log("res.message===="+res.result.listGoodType[0].id)

          } else {
            that.$message.warning(res.message)
          }
        })
      },
      chooseMedicine: function(value) {
        console.log('parentId1111111111' + value)
        let that = this
        //console.log("parentId1111111111"+value)
        that.listGoodType1 = []
        that.listGoodType2 = []
        that.queryParam.goodTypeIdTwo = ''
        that.queryParam.goodTypeIdThree = ''
        getAction(that.url.getgoodTypeListcascade, { parentId: value }).then((res) => {
          if (res.success) {
            that.listGoodType1 = res.result.listGoodType

            console.log(that.listGoodType1)
          } else {
            that.$message.warning(res.message)
          }
        })
        //  that.queryParam.goodTypeIdThree = "";
      },
      chooseMedicine1: function(value) {
        console.log('parentId2222' + value)
        let that = this
        that.listGoodType2 = []
        //  that.queryParam.goodTypeIdThree = "";
        getAction(that.url.getgoodTypeListcascade, { parentId: value }).then((res) => {
          if (res.success) {
            that.listGoodType2 = res.result.listGoodType
            console.log(that.listGoodType2)
          } else {
            that.$message.warning(res.message)
          }
        })

      },
      /**查询栏时间区间查询*/
      getQueryParams() {
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam, this.isorter)
        param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        delete param.createTime // 时间参数不传递后台
        return filterObj(param)
      },
      onDateChange: function(value, dateString) {
        console.log('*****************************************************', dateString[0], dateString[1])
        this.queryParam.createTime_begin = dateString[0]
        this.queryParam.createTime_end = dateString[1]
      },
      onDateOk(value) {
        console.log(value)
      },
      //复制地址
      copyAddress(id) {
        let that = this
        that.goodUrl = ''
        let clipBoardContent = ''
        that.getGoodUrlss(id)
      },
      //复制地址调用方法
      getGoodUrlss(id) {
        let that = this
        that.goodUrl = ''
        getAction(this.url.getGoodUrl, { goodId: id }).then((res) => {
          if (res.success) {
            // debugger
            that.goodUrl = res.result.url
            let parameter = res.result.parameter
            parameter = JSON.parse(parameter)
            that.goodUrl = res.result.url + encodeURIComponent(JSON.stringify(parameter))

            that.$nextTick(() => {
              var textArea = document.createElement('textarea')
              textArea.style.position = 'fixed'
              textArea.style.top = '0'
              textArea.style.left = '0'
              textArea.style.width = '2em'
              textArea.style.height = '2em'
              textArea.style.padding = '0'
              textArea.style.border = 'none'
              textArea.style.outline = 'none'
              textArea.style.boxShadow = 'none'
              textArea.style.background = 'transparent'
              textArea.value = that.goodUrl
              document.body.appendChild(textArea)
              textArea.select()
              try {
                var successful = document.execCommand('copy')
                var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板'
                this.$message.success(msg)
              } catch (err) {
                // alert('该浏览器不支持点击复制到剪贴板');
                this.$message.success('该浏览器不支持点击复制到剪贴板')
              }
              document.body.removeChild(textArea)
            })
          } else {
            this.$message.warning(res.message)
          }
        })
      }
      /*// 新增供应链接口数据
      AddGoodListjd() {

        if(!this.page){
          this.$message.warning("请输入第几页");
          return false
        }
        if(!this.count){
          this.$message.warning("请输入商品个数");
          return false
        }
        var that = this;
        this.$confirm({
          title: "新增商品",
          content: "确定要新增商品吗？",
          onOk: function () {
            //点击次数
            if(that.clcikFrequency>=1){
              return
            }
            that.clcikFrequency ++
            getAction(that.url.getGoodListListJD,{page:that.page,count:that.count}).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.clcikFrequency = 0;
              } else {
                that.$message.warning(res.message);
                that.clcikFrequency = 0;
              }
            });

          },})



      },
      // 新增所有供应链接口数据
      addAllGoodListjd(){
        var that = this;
        this.$confirm({
          title: "新增所有商品",
          content: "确定要新增所有商品吗？",
          onOk: function () {
            getAction(that.url.getAllGoodListListJD).then((res) => {
              if (res.success) {
                that.$message.success(res.message);

              } else {
                that.$message.warning(res.message);
              }
            });

          },})
      },
      getGoodListUpdate(){
        if(!this.page){
          this.$message.warning("请输入第几页");
          return false
        }
        if(!this.count){
          this.$message.warning("请输入商品个数");
          return false
        }
        var that = this;
        this.$confirm({
          title: "商品数据校验",
          content: "确定要校验商品吗？",
          onOk: function () {
            getAction(that.url.getGoodListUpdateJD,{page:that.page,count:that.count}).then((res) => {
              if (res.success) {
                that.$message.success(res.message);

              } else {
                that.$message.warning(res.message);
              }
            });

          },})
      },


      //所有商品 数据校验
      allGoodListUpdate() {
        var that = this;
        this.$confirm({
          title: "商品数据校验",
          content: "确定要校验所有商品吗？",
          onOk: function () {
            getAction(that.url.getGoodListUpdateJD).then((res) => {
              if (res.success) {
                that.$message.success(res.message);

              } else {
                that.$message.warning(res.message);
              }
            });

          },})
      },*/


    }
  }
</script>
<style scoped lang="less">




</style>