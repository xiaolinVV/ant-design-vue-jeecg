<template>
  <a-row :gutter="10">
    <a-col :span="4">
      <a-card :bordered="false" style="min-height: 800px">
        <a-row>
          <a-col style="margin-bottom: 10px">
            <a-input-search placeholder="请输入" @search="onSearch" enterButton />
          </a-col>
          <a-col style="margin-bottom: 10px" :key="item.id" v-for="item in storeList">
            <a v-if="indexId == item.id" style="font-weight: bold; color: #1890ff">{{ item.storeName }}</a>
            <a v-else style="font-weight: bold; color: #000000" @click="goodCuisineListClick(item)">{{
              item.storeName
            }}</a>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card :bordered="false" style="min-width: 1400px; min-height: 800px">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="6" :sm="8">
                <a-form-item label="创建年">
                  <a-input placeholder="请输入创建年" v-model="queryParam.year"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <a-form-item label="创建月">
                  <a-input placeholder="请输入创建月" v-model="queryParam.month"></a-input>
                </a-form-item>
              </a-col>
              <template v-if="toggleSearchStatus">
                <a-col :md="6" :sm="8">
                  <a-form-item label="创建日">
                    <a-input placeholder="请输入创建日" v-model="queryParam.day"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item label="删除状态（0，正常，1已删除）">
                    <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-model="queryParam.delFlag"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item label="编号">
                    <a-input placeholder="请输入编号" v-model="queryParam.serialNumber"></a-input>
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
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <!--   <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('菜品列表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>-->
        </div>

        <!-- table区域-begin -->
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
            <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
            >项
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
            :loading="loading"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @change="handleTableChange"
          >
            <template slot="mainPicture" slot-scope="text, record, index">
              <img style="width: 40px; height: 40px" :src="getMainPicture(text)" @click="viewPicyure(index)" />
            </template>

            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>

              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                      <a>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
      </a-card>
    </a-col>
    <a-modal :visible="pictureVisible" :footer="null" @cancel="pictureCancel">
      <img
        v-if="dataSource[pictureIndex]"
        alt="example"
        style="width: 100%"
        :src="getMainPicture(dataSource[pictureIndex].mainPicture)"
      />
    </a-modal>
  </a-row>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
export default {
  name: 'GoodCuisineListList',
  mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      description: '菜品列表管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '编码',
          align: 'center',
          dataIndex: 'serialNumber',
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' },
        },
        {
          title: '名称',
          align: 'center',
          dataIndex: 'goodName',
        },
        {
          title: '分类',
          align: 'center',
          dataIndex: 'typeName',
        },
        {
          title: '价格',
          align: 'center',
          dataIndex: 'shopInfo',
          customRender(text) {
            let price = JSON.parse(text)[0].salesPrice
            return '￥' + price
          },
        },
        {
          title: '归属店铺',
          align: 'center',
          dataIndex: 'storeName',
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort',
        },
        {
          title: '上下架',
          align: 'center',
          dataIndex: 'frameStatus',
          customRender(text) {
            if ((text = 0)) {
              return '下架'
            }
            if ((text = 1)) {
              return '上架'
            }
          },
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/good/goodCuisineList/list',
        delete: '/good/goodCuisineList/delete',
        deleteBatch: '/good/goodCuisineList/deleteBatch',
        exportXlsUrl: 'good/goodCuisineList/exportXls',
        importExcelUrl: 'good/goodCuisineList/importExcel',
        getStore: 'store/storeFunctionSet/getStores',
      },
      storeList: [],
      indexId: '',
      storeManage: {},
      pictureVisible: false,
      pictureIndex: 0,
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  async created() {
    await this.getStore()
  },
  methods: {
    viewPicyure(index) {
      this.pictureIndex = index
      this.pictureVisible = true
    },
    pictureCancel() {
      this.pictureVisible = false
    },
    getMainPicture(text) {
      let picture = JSON.parse(text)
      if (picture.length == 0) {
        return ''
      } else {
        return this.getImgUrl(picture[0])
      }
    },
    getImgUrl(url) {
      return window._CONFIG['imgDomainURL'] + '/' + url
    },
    getStore() {
      getAction(this.url.getStore, { type: '1' }).then((res) => {
        if (res.success) {
          console.log(res)
          this.storeList = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    onSearch(record) {
      console.log(record)
    },

    goodCuisineListClick(record) {
      this.indexId = record.id
      this.storeManage = record
      this.url.list = '/good/goodCuisineList/list' + '?storeManageId=' + record.id
      this.modalFormOk()
    },
    handleAdd() {
      //路由跳转
      if (!this.indexId) {
        this.$message.warning('请先选择店铺')
        return
      }
      localStorage.removeItem('GoodCuisineListAdd')
      this.$router.push({ path: '/good/modules/GoodCuisineListAdd', query: { storeManage: this.storeManage } })
    },
    handleEdit(record) {
      localStorage.removeItem('GoodCuisineListAdd')
      this.$router.push({ path: '/good/modules/GoodCuisineListAdd', query: { goodCuisineList: record } })
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
