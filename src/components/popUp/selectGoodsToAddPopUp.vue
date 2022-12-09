<template>
  <a-modal
    :confirm-loading="confirmLoading"
    :visible="visible"
    :width="1500"
    @cancel="handleCancel"
    @ok="handleOk"
    title="选择商品"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="商品名称">
              <!-- <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input> -->
              <a-input placeholder="请输入商品名称" v-model="searchName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <!-- <a-form-item style="display: flex;" label="商品分类">
              <a-select
                v-model="queryParam.goodStoreTypeIdOne"
                placeholder="请选择"
                @change="chooseMedicine"
                style="width:100px;margin-right: 10px;"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>

              <a-select
                v-model="queryParam.goodStoreTypeIdTwo"
                placeholder="请选择"
                style="width:100px;margin-right: 10px;"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item> -->

            <a-form-item style="display: flex;" label="商品分类">
              <a-select
                v-model="queryParam.goodTypeIdOne"
                placeholder="请选择"
                @change="chooseMedicine"
                style="width:90px;margin-right: 10px;"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
              <a-select
                v-model="queryParam.goodTypeIdTwo"
                placeholder="请选择"
                @change="chooseMedicine1"
                style="width:90px;margin-right: 10px;"
                ><!--v-model="id"-->
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
                <!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
              </a-select>
              <a-select
                v-model="queryParam.goodTypeIdThree"
                placeholder="请选择"
                style="width:90px;margin-right: 10px;"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType2" :value="item.id">{{ item.name }}</a-select-option>
                <!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="24" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button
                type="primary"
                @click="
                  search(searchName, {
                    current: 1,
                    pageSize: 10,
                    total: selectPagination.total
                  })
                "
                icon="search"
                >查询</a-button
              >
              <!-- <a-button type="primary" @click="searchQuery" icon="search">查询</a-button> -->
              <a-button type="primary" icon="reload" style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- <div class="title2">
      <div style="display: flex;align-items: center">
        商品名称：
        <a-input style="width: 150px" v-model="searchName" />
      </div>
      <div style="display: flex;align-items: center" v-if="apiName == 'selectStoreGoods'">
        商品分类：
        <a-select
          v-model="queryParam.goodStoreTypeIdOne"
          placeholder="请选择"
          @change="chooseMedicine"
          style="width:100px;margin-right: 10px;"
        >
          <a-select-option value="">请选择</a-select-option>
          <a-select-option v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>

        <a-select v-model="queryParam.goodStoreTypeIdTwo" placeholder="请选择" style="width:100px;margin-right: 10px;">
          <a-select-option value="">请选择</a-select-option>
          <a-select-option v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <a-button
        @click="
          search(searchName, {
            current: 1,
            pageSize: 10,
            total: selectPagination.total
          })
        "
        type="primary"
      >
        查询
      </a-button>
    </div> -->
    <a-table
      v-if="selectStoreColumns"
      :columns="selectStoreColumns"
      :dataSource="selectStoreData"
      :loading="tableLoading"
      :pagination="selectPagination"
      :rowSelection="rowSelection"
      :scroll="{ y: 300, x: (selectStoreColumns.length + 1) * columnsWidth }"
      @change="handleSelectTableChange"
      bordered
      style="margin-top: 10px;"
    >
      <template slot="mainPicture" slot-scope="text">
        <img :src="text" alt="" preview="1" style="width: 40px;height: 40px;" />
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import { httpAction, postAction, getAction, putAction } from '@/api/manage'

const columnsWidth = 180
let selectStoreColumns = [
  {
    title: '商品图片',
    dataIndex: 'mainPicture',
    scopedSlots: { customRender: 'mainPicture' },
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '商品名称',
    //      className: 'column-money',
    dataIndex: 'goodName',
    width: columnsWidth + 100,
    align: 'center'
  },
  {
    title: '商品分类',
    dataIndex: 'typeName', //goodTypeNames
    width: columnsWidth + 50,
    align: 'center'
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    width: columnsWidth - 50,
    align: 'center'
  },

  {
    title: '销售价',
    dataIndex: 'price',
    width: columnsWidth - 50,
    align: 'center'
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    width: columnsWidth - 50,
    align: 'center'
  },
  {
    title: '会员价',
    dataIndex: 'vipPrice',
    width: columnsWidth - 50,
    align: 'center'
  },
  {
    title: '库存',
    dataIndex: 'repertory',
    width: columnsWidth - 50,
    align: 'center'
  },
  {
    title: '供应商',
    dataIndex: 'name',
    width: columnsWidth + 50,
    align: 'center'
  }
]
let selectStoreColumnsSecond = [
  {
    title: '商品图片',
    dataIndex: 'mainPicture',
    scopedSlots: { customRender: 'mainPicture' },
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '商品名称',
    //      className: 'column-money',
    dataIndex: 'goodName',
    width: columnsWidth + 100,
    align: 'center'
  },
  {
    title: '商品分类',
    dataIndex: 'goodStoreTypeNames',
    width: columnsWidth + 50,
    align: 'center'
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    width: columnsWidth - 50,
    align: 'center'
  },

  {
    title: '销售价',
    dataIndex: 'price',
    width: columnsWidth - 50,
    align: 'center'
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    width: columnsWidth - 50,
    align: 'center'
  },
  {
    title: '会员价',
    dataIndex: 'vipPrice',
    width: columnsWidth - 50,
    align: 'center'
  },
  {
    title: '库存',
    dataIndex: 'repertory',
    width: columnsWidth - 50,
    align: 'center'
  }
]
export default {
  name: 'SelectGoodsToAddPopUp',
  props: {
    //已选择的ids回显
    selectGoodsPopUpIds: {
      type: Array,
      default: []
    },
    //api名字
    apiName: {
      type: String,
      default: 'queryGoodStoreList'
    },
    //素材id
    marketingMaterialListId: {
      type: String,
      default: ''
    },
    //店铺id
    storeManageId: {
      type: String,
      default: ''
    },
    //已选择的数据列表
    selectGoodsPopUpLists: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      columnsWidth,
      listGoodType: [],
      listGoodType1: [],
      listGoodType2: [],
      //搜索名
      searchName: '',
      //选择商品弹窗表头
      selectStoreColumns: '',
      //选择商品保存的id
      selectedRowKeys: [],
      //选择商品表格
      selectStoreData: [],
      //选择商品表格（全部数据）
      noChangeSelectStoreData: [],
      //查询table分页配置
      selectPagination: {
        current: 1,
        pageSize: 10,
        total: 1
      },
      queryParam: {
        goodTypeIdOne: '',
        goodTypeIdTwo: '',
        goodTypeIdThree: ''
      },
      url: {
        //使用商品选择商品弹窗数据
        queryGoodStoreList: '/goodList/goodList/findGoodList',
        //素材选择商品弹窗数据
        getMarketingMarKarKetingGood: '/goodList/goodList/getMarketingMarKarKetingGood',
        //适用店铺商品选择商品弹窗数据
        queryGoodStoreStoreList: '/goodStoreList/goodStoreList/findStoreList',
        //添加礼品卡选手则商品弹窗数据(店铺商品)
        selectStoreGoods: 'marketing/marketingStoreGiftCardList/selectStoreGoods',
        // getgoodTypeListcascade: '/GoodStoreType/goodStoreType/getgoodStorTypeListcascade', 10/9注释
        getgoodTypeListcascade: '/goodType/goodType/getgoodTypeListcascade' //10/9增
        // queryGoodStoreList: '/goodList/goodList/getMarketingMaterialGood'
      },
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      //弹窗表加载
      tableLoading: false
    }
  },
  mounted() {
    this.goodTypeListcascade('0')
  },
  methods: {
    //分类搜索
    goodTypeListcascade(parentId) {
      let that = this
      that.listGoodType1 = []
      that.listGoodType2 = []
      getAction(that.url.getgoodTypeListcascade, { parentId: parentId }).then(res => {
        if (res.success) {
          that.listGoodType = res.result.listGoodType
          //that.$message.success(res.message);
          // console.log('res.message====' + res.result.listGoodType)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    chooseMedicine: function(value) {
      console.log('parentId' + value)
      let that = this
      //console.log("parentId1111111111"+value)
      that.listGoodType1 = ''
      that.listGoodType2 = ''
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType1 = res.result.listGoodType

          console.log(that.listGoodType1)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    chooseMedicine1: function(value) {
      console.log('parentId2222' + value)
      let that = this
      that.listGoodType2 = []
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType2 = res.result.listGoodType

          console.log(that.listGoodType2)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleOk() {
      let ids = this.selectedRowKeys
      if (!Array.isArray(ids) || ids.length <= 0) {
        this.$message.warn('请选择商品!')
        return
      }
      this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
      this.$nextTick(() => {
        let sz = []
        for (let item of ids) {
          for (let item2 of this.noChangeSelectStoreData) {
            if (item == item2.id) {
              item2.key = item2.id
              item2.operation = '删除'
              sz.push(item2)
              break
            }
          }
        }
        this.$emit('handleOk', ids.join(','), sz)
        this.visible = false
        this.searchName = ''
      })
    },
    handleCancel() {
      this.visible = false
      this.searchName = ''
      this.$emit('handleCancel')
    },
    async reset() {
      this.queryParam = {}
      await this.$nextTick()
      this.search('', {
        current: 1,
        pageSize: 10,
        total: this.selectPagination.total
      })
    },
    //查询
    search(goodName = this.searchName, pagination = this.selectPagination) {
      let that = this
      this.tableLoading = true
      //请求选择商品弹窗接口
      let requestOptions = Object.assign({}, { goodName }, pagination, { pageNo: pagination.current })
      if (this.apiName == 'getMarketingMarKarKetingGood') {
        requestOptions = Object.assign({}, requestOptions, { marketingMaterialListId: this.marketingMaterialListId })
      }
      if (this.apiName == 'selectStoreGoods') {
        requestOptions = Object.assign({}, requestOptions, { storeManageId: this.storeManageId, ...this.queryParam })
      }
      return new Promise((resolve, reject) => {
        getAction(that.url[that.apiName], requestOptions).then(res => {
          this.tableLoading = false
          if (res.success) {
            let allRecords = this.apiName == 'queryGoodStoreStoreList' ? res.result : res.result.records
            allRecords.map(item => {
              item.key = item.id
              try {
                if (item.mainPicture) {
                  item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
                }
              } catch (e) {}
              return item
            })
            if (this.noChangeSelectStoreData.length > 0) {
              for (let item of allRecords) {
                let canPush = true
                for (let item2 of this.noChangeSelectStoreData) {
                  if (item2.id === item.id) {
                    canPush = false
                    break
                  }
                }
                if (canPush) {
                  this.noChangeSelectStoreData.push(item)
                }
              }
            } else {
              this.noChangeSelectStoreData = [...allRecords, ...this.selectGoodsPopUpLists]
            }
            this.selectStoreData = allRecords
            this.selectPagination.total = res.result.total
            this.selectPagination.pageSize = res.result.size
            this.$nextTick(() => {
              resolve('success')
            })
          } else {
            reject(`queryGoodStoreList请求失败！原因：${res.message || ''}`)
          }
        })
      })
    },
    handleSelectTableChange(pagination) {
      console.log(pagination)
      this.selectPagination.current = pagination.current
      this.search(this.searchName)
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async open() {
      if (this.apiName == 'getMarketingMarKarKetingGood') {
        selectStoreColumns[2].dataIndex = 'goodTypeNames'
      } else {
        selectStoreColumns[2].dataIndex = 'typeName'
      }
      if (this.apiName == 'selectStoreGoods') {
        this.selectStoreColumns = selectStoreColumnsSecond
        this.goodTypeListcascade('0')
      } else {
        this.selectStoreColumns = selectStoreColumns
      }

      this.visible = true
      const search = await this.search()
      this.onSelectChange(this.selectGoodsPopUpIds)
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        selections: [
          {
            key: 'all-data',
            text: 'Select All Data',
            onSelect: () => {
              this.selectedRowKeys = [...Array(46).keys()] // 0...45
            }
          }
        ],
        onSelection: this.onSelection
      }
    }
    //      uploadAction: function () {
    //        return this.url.fileUpload;
    //      },
  }
}
</script>

<style lang="less" scoped></style>
