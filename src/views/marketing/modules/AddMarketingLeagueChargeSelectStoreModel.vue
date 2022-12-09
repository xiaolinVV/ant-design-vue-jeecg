<template>
  <a-modal
    title="选择商品"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    class=" AddMarketingChargeSelectStoreModel popUp"
  >
    <a-spin :spinning="confirmLoading">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="7" :sm="8">
              <a-form-item label="商品名称">
                <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="8">
              <a-form-item style="display: flex;justify-content: space-between;width: 100%" label="商品分类">
                <a-select
                  v-model="queryParam.goodTypeIdOne"
                  placeholder="请选择"
                  @change="chooseMedicine"
                  style="width:100px;margin-right: 10px;"
                >
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :key="item.id" v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
                <a-select
                  v-model="queryParam.goodTypeIdTwo"
                  placeholder="请选择"
                  @change="chooseMedicine1"
                  style="width:100px;margin-right: 10px;"
                  ><!--v-model="id"-->
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :key="item.id" v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
                  <!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
                </a-select>
                <a-select
                  v-model="queryParam.goodTypeIdThree"
                  placeholder="请选择"
                  style="width:100px;margin-right: 10px;"
                >
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :key="item.id" v-for="item in listGoodType2" :value="item.id">{{ item.name }}</a-select-option>
                  <!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="8">
              <a-form-item label="供应商">
                <a-input placeholder="请输入" v-model="queryParam.sysUserName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="8" v-if="types == 1">
              <a-form-item label="状态">
                <a-select v-model="queryParam.pattern" placeholder="请选择">
                  <a-select-option value="-1">全部</a-select-option>
                  <a-select-option value="2">未加入</a-select-option>
                  <a-select-option value="3">已加入</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="6">
              <a-form-item label="商品折扣">
                <a-input-group compact>
                  <a-input-number
                    :min="0"
                    :max="queryParam.maxDiscount"
                    :formatter="value => `${value}%`"
                    :parser="value => value.replace('%', '')"
                    style=" width: 100px; text-align: center"
                    placeholder="请输入"
                    v-model="queryParam.discountStart"
                  />
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
                    style="width: 100px; text-align: center; border-left: 0"
                    placeholder="请输入"
                    v-model="queryParam.discountEnd"
                  />
                </a-input-group>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="8">
              <a-button type="primary" icon="search" @click="loadData">查询</a-button>
            </a-col>
            <a-col :md="24">
              <a-table
                :rowSelection="rowSelection"
                :columns="columns"
                :dataSource="dataSource"
                rowKey="id"
                :pagination="pagination"
                @change="tableChange"
                :scroll="{ x: 1500 }"
              >
                <template slot="picture" slot-scope="text, record, index">
                  <img
                    preview="1"
                    :src="text"
                    alt=""
                    style="width: 50px;height: 50px;display: inline-block;vertical-align: middle"
                  />
                </template>

                <template slot="discount" slot-scope="text, record">
                  <div v-if="record.discountStart == record.discountEnd">
                    {{ record.discountStart + '-' + record.discountEnd }}
                  </div>
                  <div v-else>
                    {{ record.discountStart }}
                  </div>
                </template>
                <template slot="marketingLeagueGoodListCount" slot-scope="text">
                  <div v-if="text > 0">
                    已加入
                  </div>
                  <div v-else>
                    未加入
                  </div>
                </template>
              </a-table>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
const columnFirst = [
  {
    title: '商品图片',
    dataIndex: 'mainPicture',
    align: 'center',
    scopedSlots: { customRender: 'picture' }
    // width:150
  },
  {
    title: '商品名称',
    dataIndex: 'goodName',
    align: 'center',
    width: 200
  },
  {
    title: '商品分类',
    dataIndex: 'goodTypeName',
    align: 'center'
    // width:250
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    align: 'center'
  },
  {
    title: '销售价',
    dataIndex: 'price',
    align: 'center'
  },
  {
    title: '供货价',
    dataIndex: 'supplyPrice',
    align: 'center'
  },
  {
    title: '折扣',
    align: 'center',
    dataIndex: 'discount',
    scopedSlots: { customRender: 'discount' }
  },
  {
    title: '库存',
    dataIndex: 'repertory',
    align: 'center'
  },
  {
    title: '供应商',
    dataIndex: 'sysUserName',
    align: 'center'
    // width:250
  }
]
const columnSecond = [
  {
    title: '商品图片',
    dataIndex: 'mainPicture',
    align: 'center',
    scopedSlots: { customRender: 'picture' }
    // width:150
  },
  {
    title: '商品名称',
    dataIndex: 'goodName',
    align: 'center',
    width: 200
  },
  {
    title: '商品分类',
    dataIndex: 'goodTypeName',
    align: 'center'
    // width:250
  },
  {
    title: '状态',
    dataIndex: 'marketingLeagueGoodListCount',
    align: 'center',
    scopedSlots: { customRender: 'marketingLeagueGoodListCount' }
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    align: 'center'
  },
  {
    title: '销售价',
    dataIndex: 'price',
    align: 'center'
  },
  {
    title: '供货价',
    dataIndex: 'supplyPrice',
    align: 'center'
  },
  {
    title: '折扣',
    align: 'center',
    dataIndex: 'discount',
    scopedSlots: { customRender: 'discount' }
  },
  {
    title: '库存',
    dataIndex: 'repertory',
    align: 'center'
  },
  {
    title: '供应商',
    dataIndex: 'sysUserName',
    align: 'center'
    // width:250
  }
]
import { getAction, postAction } from '@/api/manage'
export default {
  name: 'AddMarketingChargeSelectStoreModel',
  props: {
    id: {
      type: String,
      default: ''
    },
    selectedRowKeysFrom: {
      type: [String, Array],
      default: ''
    },
    types: {
      type: [String, Number],
      default: 1 //1 免单 2 拼团
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      listGoodType: [],
      listGoodType1: [],
      listGoodType2: [],
      //查询
      queryParam: {
        goodName: '',
        goodTypeIdOne: '',
        goodTypeIdTwo: '',
        goodTypeIdThree: '',
        sysUserName: ''
      },
      goodTypeId: '',
      pagination: {
        total: 200,
        hideOnSinglePage: true
      },
      url: {
        getgoodTypeListcascade: 'goodType/goodType/getgoodTypeListcascade',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        chooseGoodList: 'marketing/marketingLeagueGoodList/chooseGoodList',
      },
      //table
      dataSource: [],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      pageNo: 1,
      subMitDataSource: []
    }
  },
  watch: {
    selectedRowKeysFrom(newVal) {
      console.log('--------------------------------------', newVal)
      if (newVal) {
        if (Array.isArray(newVal)) {
          this.selectedRowKeys = newVal
        } else {
          this.selectedRowKeys = newVal.split(',')
        }
      } else {
        this.selectedRowKeys = []
      }
    },
    queryParam: {
      handler(newVal) {
        if (newVal.goodTypeIdThree) {
          this.goodTypeId = newVal.goodTypeIdThree
        } else if (newVal.goodTypeIdTwo) {
          this.goodTypeId = newVal.goodTypeIdTwo
        } else {
          this.goodTypeId = newVal.goodTypeIdOne
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.goodTypeListcascade('0')
  },
  computed: {
    rowSelection({ types }) {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled: record.marketingLeagueGoodListCount != 0 && types == 1, // Column configuration not to be checked
            name: record.name
          }
        })
      }
    },
    columns({ types }) {
      return types == 1 ? columnSecond : columnFirst
    }
  },
  methods: {
    handleOk() {
      //弹窗确定
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warn('请选择商品')
        return
      }
      console.log(this.subMitDataSource)
      let info = {
        id: this.id,
        ids: this.selectedRowKeys.join(','),
        subMitDataSource:
          this.subMitDataSource.length <= 1
            ? this.subMitDataSource[0].details
            : this.subMitDataSource.reduce((totalList, v) => {
                return [
                  ...(Array.isArray(totalList.details) ? totalList.details : Array.isArray(totalList) ? totalList : []),
                  ...v.details
                ]
              })
      }
      this.$emit('handleOK', info)
      this.handleCancel()
    },
    handleCancel() {
      //弹窗取消
      this.visible = false
      this.queryParam = {
        goodName: '',
        goodTypeIdOne: '',
        goodTypeIdTwo: '',
        goodTypeIdThree: '',
        sysUserName: ''
      }
      this.goodTypeId = ''
    },
    open() {
      this.visible = true
      this.loadData()
      // this.getMarketingPrefectureType()
    },
    async onSelectChange(selectedRowKeys, selectedRows) {
      let subMitDataSource = this.subMitDataSource
      console.log('selectedRowKeys changed: ', selectedRows, selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      await this.$nextTick()
      for (let index = 0; index < subMitDataSource.length; index++) {
        if (subMitDataSource[index].pageNo === this.pageNo) {
          subMitDataSource[index].details = selectedRows
          return
        }
      }
      subMitDataSource.push({
        pageNo: this.pageNo,
        details: selectedRows
      })
    },
    tableChange(pageNo) {
      this.loadData(true, pageNo.current)
    },
    loadData(isLoadMore = false, pageNo = 1) {
      // if (!this.id) {
      //   this.$message.warn('请重新在专区商品中新增分类')
      //   return
      // }
      this.confirmLoading = true
      this.pageNo = pageNo
      let info = {
        id: this.id,
        pageNo,
        goodTypeId: this.goodTypeId
      }
      info = Object.assign({}, this.queryParam, info)
      let url = this.types == 2 ? this.url.marketingGroupGoodList : this.url.chooseGoodList
      getAction(url, info).then(res => {
        if (res.success) {
          for (let item of res.result.records) {
            if (item.mainPicture) {
              item.mainPicture = this.url.imgerver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
            }
          }
          this.dataSource = res.result.records
          this.pagination.total = res.result.pages * 10
        }
        this.confirmLoading = false
      })
    },
    //查询
    chooseMedicine: function(value) {
      console.log('parentId1111111111' + value)
      let that = this
      //console.log("parentId1111111111"+value)
      that.listGoodType1 = []
      that.listGoodType2 = []
      that.queryParam.goodTypeIdTwo = ''
      that.queryParam.goodTypeIdThree = ''
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
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
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType2 = res.result.listGoodType
          console.log(that.listGoodType2)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    goodTypeListcascade(parentId) {
      let that = this
      that.listGoodType1 = []
      that.listGoodType2 = []
      getAction(that.url.getgoodTypeListcascade, { parentId: parentId }).then(res => {
        if (res.success) {
          that.listGoodType = res.result.listGoodType
          //that.$message.success(res.message);
          //  console.log("res.message===="+res.result.listGoodType[0].id)
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
