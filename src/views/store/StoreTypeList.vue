<template>
  <a-card :bordered="false">
    <!--<div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>-->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--      @click="searchQuery"-->
      <a-button type="primary" icon="plus" @click="addData">添加</a-button>
      <!--      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
      <!--      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
      <!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
      <!--        <a-menu slot="overlay">-->
      <!--          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
      <!--        </a-menu>-->
      <!--        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
      <!--      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;width: 100%">
      <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
      selectedRowKeys.length }}</a>项
      <a style="margin-left: 24px" @click="onClearSelected">清空</a>
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="onlyKey"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :expandedRowKeys="expandedRowKeys"
        @change="handleTableChange"
        @expand="handleExpand"
        v-bind="tableProps">
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0">停用</span>
            <span shape="square" v-if="record.status==1">启用</span>
          </div>
        </template>

        <template slot="closeExplain" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            {{record.closeExplain?record.closeExplain:'-'}}
          </div>
        </template>

        <template slot="updateBy" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            {{record.updateBy?record.updateBy:'-'}}
          </div>
        </template>

        <template slot="updateTime" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            {{record.updateTime?record.updateTime:'-'}}
          </div>
        </template>


        <template slot="action" slot-scope="text,record">
          <div style="display: flex;justify-content: space-around;align-items: center;width: 100%">
            <a @click="editData(record,'child')" v-if="record.level <= 1 ">添加子分类</a>
            <a-divider type="vertical"/>
            <a @click="editData(record)">编辑</a>
            <a-divider type="vertical"/>
            <a v-if="record.status==1" @click="showStopStatus(record)">停用</a>
            <a v-else @click="showStartStatus(record)">启用</a>
            <a-divider type="vertical"/>
            <a @click="showDelete(record)">删除</a>
          </div>
        </template>
        <template slot="logoAddr" slot-scope="text,record,index">
          <img class="clickShowImage" :preview="'logoAddr' + index"
               v-for="(item,index) in handlePreviewImage(record.logoAddr)" :key="index" :src="item" alt="">
        </template>
      </a-table>
    </div>
    <MemberMyTeamListModal ref="modalForm"></MemberMyTeamListModal>
    <MemberMyTeamListModalAdd ref="modalForm2" @ok="loadData"></MemberMyTeamListModalAdd>
    <StoreTypeListStopOrStartModal ref="modalForm3" @ok="stuatusChangeOk">

    </StoreTypeListStopOrStartModal>
  </a-card>
</template>

<script>

  import { getAction, deleteAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MemberMyTeamListModal from './modules/StoreTypeListModal'
  import MemberMyTeamListModalAdd from './modules/StoreTypeListModalAdd'
  import StoreTypeListStopOrStartModal from './modules/StoreTypeListStopOrStartModal'

  export default {
    name: 'StoreTypeList',
    mixins: [JeecgListMixin],
    inject: ['rush'],
    data() {
      return {
        visible: false,
        description: '商品分类管理页面',
        // 表头
        columns: [
          {

            title: '分类名称',
            align: 'left',
            dataIndex: 'typeName'
          },
          {
            title: '分类级别',
            align: 'center',
            dataIndex: 'typeRank'
          },
          {
            title: '分类图片',
            align: 'center',
            dataIndex: 'logoAddr',
            scopedSlots: { customRender: 'logoAddr' }
          },
          {
            title: '排序',
            align: 'center',
            dataIndex: 'sort'
          },
          {
            title: '福利金抵扣最低值',
            align: 'center',
            dataIndex: 'smallWelfarePaymentsName'
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '停用说明',
            align: 'center',
            dataIndex: 'closeExplain',
            scopedSlots: { customRender: 'closeExplain' }
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
            title: '更新者',
            align: 'center',
            dataIndex: 'updateBy',
            scopedSlots: { customRender: 'updateBy' }
          },
          {
            title: '更新时间',
            align: 'center',
            dataIndex: 'updateTime',
            scopedSlots: { customRender: 'updateTime' }
          }, {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: 250,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: 'storeType/storeType/list',
          childList: 'storeType/storeType/getUnderlingList'
        },
        expandedRowKeys: [],
        hasChildrenField: 'hasChild',
        pidField: 'id',
        dictOptions: {},
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        }
      }
    },
    components: {
      MemberMyTeamListModal,
      MemberMyTeamListModalAdd,
      StoreTypeListStopOrStartModal
    },
    computed: {
      importExcelUrl() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      },
      tableProps() {
        let _this = this
        return {
          // 列表项是否可选择
          rowSelection: {
            selectedRowKeys: _this.selectedRowKeys,
            onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
          }
        }
      }
    },
    methods: {
      showStopStatus(record = {}) {
        this.$refs.modalForm3.showModalStopStatus(record)
      },
      showStartStatus(record = {}) {
        this.$refs.modalForm3.showStartStatus(record)
      },
      showDelete(record = {}) {
        if (record.level == 1 && record.isDel == 1) {
          this.$error({
            title: '该分类底下存在子分类或者商户，无法删除',
            content: '您若要删除该分类，请先移除子分类或者商户'
          })
          return
        }
        this.$refs.modalForm3.showDelete(record)
      },
      stuatusChangeOk() {
        this.loadData()
      },
      handlePreviewImage(image) {
        if (image) {
          let sz = []
          image = Object.values(JSON.parse(image))
          for (let item of image) {
            sz.push(this.configure.imgErver + '/' + item)
          }
          return sz
        }
        return ''
      },
      addData() {
        this.$refs.modalForm2.add()
      },
      editData(record, type = 'parent') {
        this.$refs.modalForm2.edit(record, type)
      },
      // 生成全局唯一id
      generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      },
      loadData(arg) {
        if (arg == 1) {
          this.ipagination.current = 1
        }
        this.loading = true
        this.expandedRowKeys = []
        let params = this.getQueryParams()
        return new Promise((resolve) => {
          getAction(this.url.list, params).then(res => {
            if (res.success) {
              let result = res.result
              if (Number(result.total) > 0) {
                this.ipagination.total = Number(result.total)
                this.dataSource = this.getDataByResult(res.result.records)
                resolve()
              } else {
                this.ipagination.total = 0
                this.dataSource = []
              }
            } else {
              this.$message.warning(res.message)
            }
            this.loading = false
          })
        })
      },
      showTeamCount(item) {
        if (item.id) {
          this.$refs.modalForm.open(item)
        } else {
          this.$message.warn('此数据的id不存在！')
        }
      },
      getDataByResult(result) {
        return result.map(item => {
          //判断是否标记了带有子节点
          item.onlyKey = this.generateUUID()
          if (item[this.hasChildrenField] == '1') {
            let loadChild = {
              id: item.id,
              name: 'loading...',
              isLoading: true,
              onlyKey: this.generateUUID(),
              level: item.level
            }
            item.children = [loadChild]
          }
          return item
        })
      },
      handleExpand(expanded, record) {
        // 判断是否是展开状态
        if (expanded) {
          this.expandedRowKeys.push(record.onlyKey)
          if (record.children.length > 0 && record.children[0].isLoading === true) {
            let params = this.getQueryParams()//查询条件
            params[this.pidField] = record.id
            getAction(this.url.childList, params).then((res) => {
              if (res.success) {
                if (res.result && res.result.length > 0) {
                  record.children = this.getDataByResult(res.result)
                  this.dataSource = [...this.dataSource]
                } else {
                  record.children = ''
                  record.hasChildrenField = '0'
                }
              } else {
                this.$message.warning(res.message)
              }
            })
          }
        } else {
          let keyIndex = this.expandedRowKeys.indexOf(record.onlyKey)
          if (keyIndex >= 0) {
            this.expandedRowKeys.splice(keyIndex, 1)
          }
        }
      },
      initDictConfig() {
      }
    }
  }
</script>
<style scoped lang="scss">
  .imgShow {
    display: flex;
    align-items: center;
    justify-content: space-around;
    img {
      margin-right: 10px;
    }
    img:last-child {
      margin: 0;
    }
  }
</style>