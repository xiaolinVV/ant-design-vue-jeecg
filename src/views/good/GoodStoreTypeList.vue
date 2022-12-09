<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('商品分类')">导出</a-button>
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
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :expandedRowKeys="expandedRowKeys"
        @change="handleTableChange"
        @expand="handleExpand"
        v-bind="tableProps">
        <template slot="imgSlot" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'mainPicture' + text" :src="getImgView(text)" alt=""/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无此文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="uploadFile(text)">
            下载
          </a-button>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0">停用</span>
            <span shape="square" v-if="record.status==1">启用</span>
          </div>
        </template>

        <template slot="level" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.level==1">一级分类</span>
            <span shape="square" v-if="record.level==2">二级分类</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a v-if="record.level!=2">
          <a @click="handleAdd1(record)">添加子分类</a>

          <a-divider type="vertical"/>
            </a>
          <a @click="handleEdit(record,'编辑')">编辑</a>

          <a-divider type="vertical"/>
          <a-popconfirm v-if="record.status==1" title="停用分类后，该分类子分类及关联商品都将被停用?"
                        @confirm="() => handleStatus(record.id)">
              <a>停用</a>
          </a-popconfirm>
          <a-popconfirm v-if="record.status==0" title="启用分类后，该分类的子分类及关联商品都将被启用，都可以访问?"
                        @confirm="() => handleStatus(record.id)">
            <a>启用</a>
          </a-popconfirm>
            <a-divider type="vertical"/>
           <a v-if="record.level ==2" @click="copyAddress(record.id,record.name)">复制地址</a>
          <!-- <a @click="handleStatus(record.id)" v-if="record.status==0">启用</a>-->
           <a-divider v-if="record.level ==2" type="vertical"/>
          <a @click="handleDelete(record.id)">删除</a>
        </span>

      </a-table>
    </div>


    <goodStoreType-modal ref="modalForm" @ok="modalFormOk"></goodStoreType-modal>
  </a-card>
</template>

<script>

  import { getAction, deleteAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import GoodStoreTypeModal from './modules/GoodStoreTypeModal'
  import { initDictOptions, filterMultiDictText } from '@/components/dict/JDictSelectUtil'
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: 'GoodStoreTypeList',
    mixins: [JeecgListMixin],
    components: {
      GoodStoreTypeModal,
      JDate
    },
    data() {
      return {
        description: '商品分类管理页面',
        goodTypeLevel: '',
        goodTypeId2: '',
        // 表头
        columns: [
          {
            title: '分类名称',
            align: 'left',
            dataIndex: 'name'
          },
          {
            title: '分类级别',//；1：一级；2：二级；
            align: 'center',
            dataIndex: 'level',
            scopedSlots: { customRender: 'level' }
          },
          {
            title: '分类图片',
            align: 'center',
            dataIndex: 'typePicture',
            scopedSlots: { customRender: 'imgSlot' }
          }, {
            title: '排序',
            align: 'center',
            dataIndex: 'sort'
          },
          {
            title: '状态',//；0：停用；1：启用
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '停用说明',
            align: 'center',
            dataIndex: 'stopRemark'
          },
          {
            title: '创建人',
            align: 'center',
            dataIndex: 'createBy'
          },
          {
            title: '创建日期',
            align: 'center',
            dataIndex: 'createTime'
          },
          {
            title: '更新人',
            align: 'center',
            dataIndex: 'updateBy'
          },
          {
            title: '更新日期',
            align: 'center',
            dataIndex: 'updateTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            // fixed: 'right',
            width: 300,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/GoodStoreType/goodStoreType/rootList',
          childList: '/GoodStoreType/goodStoreType/childList',
          delete: '/GoodStoreType/goodStoreType/delete',
          deleteBatch: '/GoodStoreType/goodStoreType/deleteBatch',
          updateStatus: '/GoodStoreType/goodStoreType/updateStatus',
          exportXlsUrl: '/GoodStoreType/goodStoreType/exportXls',
          importExcelUrl: 'GoodStoreType/goodStoreType/importExcel',
          getStoreTypeUrl: '/GoodStoreType/goodStoreType/getStoreTypeUrl'
        },
        expandedRowKeys: [],
        hasChildrenField: 'hasChild',
        pidField: 'parentId',
        dictOptions: {}
      }
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

      handleEdit: function(record, title = '') {
        this.$refs.modalForm.edit(record)
        this.$refs.modalForm.title = title
        this.$refs.modalForm.disableSubmit = false
      },

      handleStatus: function(id) {
        var that = this
        getAction(that.url.updateStatus, { id: id }).then((res) => {
          if (res.code == 200) {
            that.$message.success(res.message)
            that.loadData()
          } else {

            that.$message.success('修改失败')
          }
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
      getDataByResult(result) {
        return result.map(item => {
          //判断是否标记了带有子节点
          if (item[this.hasChildrenField] == '1') {
            let loadChild = { id: item.id + '_loadChild', name: 'loading...', isLoading: true }
            item.children = [loadChild]
          }
          return item
        })
      },
      handleExpand(expanded, record) {
        // 判断是否是展开状态
        if (expanded) {
          this.expandedRowKeys.push(record.id)
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
          let keyIndex = this.expandedRowKeys.indexOf(record.id)
          if (keyIndex >= 0) {
            this.expandedRowKeys.splice(keyIndex, 1)
          }
        }
      },
      initDictConfig() {
      },
      modalFormOk(formData, arr) {
        if (!formData.id) {
          this.addOk(formData, arr)
        } else {
          if (!arr) {
            this.loadData()
          } else {
            this.editOk(formData, this.dataSource)
            this.dataSource = [...this.dataSource]
          }
        }
      },
      editOk(formData, arr) {
        if (arr && arr.length > 0) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == formData.id) {
              arr[i] = formData
              break
            } else {
              this.editOk(formData, arr[i].children)
            }
          }
        }
      },
      async addOk(formData, arr) {
        if (!formData[this.pidField]) {
          this.loadData()
        } else {
          this.expandedRowKeys = []
          for (let i of arr) {
            await this.expandTreeNode(i)
          }
        }
      },
      expandTreeNode(nodeId) {
        return new Promise((resolve, reject) => {
          this.getFormDataById(nodeId, this.dataSource)
          let row = this.parentFormData
          this.expandedRowKeys.push(nodeId)
          let params = this.getQueryParams()//查询条件
          params[this.pidField] = nodeId
          getAction(this.url.childList, params).then((res) => {
            if (res.success) {
              if (res.result && res.result.length > 0) {
                row.children = this.getDataByResult(res.result)
                this.dataSource = [...this.dataSource]
                resolve()
              } else {
                reject()
              }
            } else {
              reject()
            }
          })
        })
      },
      getFormDataById(id, arr) {
        if (arr && arr.length > 0) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
              this.parentFormData = arr[i]
            } else {
              this.getFormDataById(id, arr[i].children)
            }
          }
        }
      },
      handleAdd1: function(record) {
        this.goodTypeId = record.id
        this.goodTypeLevel = record.level
        this.$refs.modalForm.add(this.goodTypeId, this.goodTypeLevel)
        this.$refs.modalForm.title = '添加子分类'
        this.$refs.modalForm.disableSubmit = false
      },
      handleDelete: function(id) {
        if (!this.url.delete) {
          this.$message.error('请设置url.delete属性!')
          return
        }
        var that = this
        this.$confirm({
          title: '删除分类将无法恢复？',
          content: '您确定要删除吗？',
          onOk: function() {
            deleteAction(that.url.delete, { id: id }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })

      },
      //复制地址
      copyAddress(id, name) {
        let that = this
        that.goodUrl = ''
        let clipBoardContent = ''
        that.getTypeUrlss(id, name)
      },
      //复制地址调用方法
      getTypeUrlss(id, name) {
        let that = this
        that.goodUrl = ''
        getAction(this.url.getStoreTypeUrl, { goodTypeId: id, name: name }).then((res) => {
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

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>