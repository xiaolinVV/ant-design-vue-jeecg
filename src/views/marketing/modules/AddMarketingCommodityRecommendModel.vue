<template>
  <a-card :bordered="false" class="AddMarketingCommodityRecommendModel" :loading="cardLoading">
    <div class="title">
      添加商品
    </div>
    <div class="line-wrap" v-for="(item,index) in limitLsit" :key="index">
      <div class="label">
        <span class="dataCheckedStar" v-if="item.isMust">
          *
        </span>
        {{item.label}}：
      </div>
      <div class="value">
        {{item.value}}
      </div>
    </div>
    <a-alert message="  重要提示：先批量设置过后再单独调整价格，避免单独设置的价格被批量操作覆盖。选择商品时请合理设置价格，避免造成不必要的亏损" type="info"/>

    <div class="table-page-search-wrapper">
      <a-form layout="inline" style="margin-top: 20px" @submit="handleSubmit">
        <a-row :gutter="24">
          <a-col :md="6" :sm="6">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam
              .goodName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <a-form-item
              style="width: 100%"
              label="专区分类">
              <a-cascader :options="prefectureType"
                          :loadData="prefectureTypeDataLoad"
                          changeOnSelect
                          style="width: 100%"
                          @change="changeData"
                          placeholder="请选择专区分类"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">

          </a-col>
          <a-col :md="6" :sm="6">

          </a-col>
          <a-col :md="24" :sm="8" style="margin-top: 10px">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="search">查询</a-button>
              <a-button type="primary" @click="selectStore" icon="select" style="margin-left: 8px">选择商品</a-button>
            </span>
          </a-col>
          <a-col :md="24" :sm="24" style="margin-top: 10px">
            <!--          <a-input-number id="inputNumber" :min="1" :max="10" v-model="value" @change="onChange" />-->
            <!--          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
            <a-table
              :columns="columns"
              :dataSource="dataSource"
              :loading="tableLoading"
              class="components-table-demo-nested"
              rowKey="id"
            >
              <!--              <a-icon type="smile-o" />-->

              <template slot="sort" slot-scope="text, record, index">
                <a-input-number :min="0" v-model="record.sort" @change="mainLineChange($event,record)">

                </a-input-number>
              </template>
              <template slot="operation" slot-scope="text, record, index">
                <a-popconfirm
                  v-if="dataSource.length"
                  title="确定删除吗？"
                  @confirm="() => onDelete(record.id)">
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </template>
              <template slot="picture" slot-scope="text, record, index">
                <img preview="1" :src="text" alt=""
                     style="width: 50px;height: 50px;display: inline-block;vertical-align: middle">
              </template>
              <template slot="marketingPrefectureTypeId" slot-scope="text,record,index">
                <div v-if="prefectureType.length <= 0">
                  无分类
                </div>
                <div v-else>
                  <a-cascader :options="prefectureType"
                              :loadData="prefectureTypeDataLoad"
                              changeOnSelect
                              v-model="record.marketingPrefectureTypeId"
                              style="width: 100%"
                              placeholder="请选择专区"/>
                </div>
              </template>
            </a-table>
          </a-col>
        </a-row>
        <a-button type="primary" html-type="submit" style="margin: 30px auto;display: block;">
          提交
        </a-button>
      </a-form>
    </div>

    <AddMarketingCommoditySelectStoreRecommendModel ref="AddMarketingCommoditySelectStoreRecommendModel"
                                                    :selectedRowKeysFrom="modelOkInfo.ids"
                                                    :marketingPrefectureId="marketingPrefectureId"
                                                    :marketingPrefectureRecommendId="marketingPrefectureRecommendId"
                                                    @handleOK="modelOk">
    </AddMarketingCommoditySelectStoreRecommendModel>
  </a-card>
</template>

<script>

  import AddMarketingCommoditySelectStoreRecommendModel from './AddMarketingCommoditySelectStoreRecommendModel'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getAction, postAction } from '@/api/manage'

  export default {
    name: 'AddMarketingCommodityRecommendModel',
    data() {
      return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this),
        cardLoading: false,
        tableLoading: false,
        areaOptions: [],
        // saerchMarketingPrefectureTypeId: [],
        astrictPriceProportion: 100,
        disabled: true,
        limitLsit: [{
          label: '专区id',
          value: '',
          isMust: false
        }, {
          label: '专区名称',
          value: '',
          isMust: false
        }, {
          label: '推荐模块',
          value: '',
          isMust: false
        }],
        dataSource: [],
        allDataSource: [],
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '商品图片',
            dataIndex: 'mainPicture',
            align: 'center',
            scopedSlots: { customRender: 'picture' },
            width: 150
          },
          {
            title: '商品名称',
            dataIndex: 'goodName',
            align: 'center',
            width: 300
          },
          {
            title: '专区分类',
            dataIndex: 'typeName',
            align: 'center',
            width: 250
          }, {
            title: '专区价',
            dataIndex: 'prefecturePrice',
            align: 'center'
          }, {
            title: '库存',
            dataIndex: 'repertory',
            align: 'center'
          }, {
            title: '排序',
            dataIndex: 'sort',
            align: 'center',
            scopedSlots: { customRender: 'sort' }
          }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            width: 200,
            scopedSlots: { customRender: 'operation' }
          }
        ],

        selectedRowKeys: [], // Check here to configure the default column
        marketingPrefectureId: '',
        allData: {},
        //选中专区商品
        url: {
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          postGoodListList: 'marketingPrefecture/marketingPrefecture/postGoodListList',
          //获取专区二级分类
          findUnderlingListMap: 'marketingPrefectureType/marketingPrefectureType/findUnderlingListMap',
          queryById: '/marketingPrefecture/marketingPrefecture/queryById',
          //提交接口
          addAllMarketingPrefectureGoodAndSpecification: '/marketingPrefectureRecommendGood/marketingPrefectureRecommendGood/adds',
          //获取对应专区分类
          getMarketingPrefectureType: 'marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureType'
        },
        //查询条件
        queryParam: {
          goodName: '',
          typeName: ''
        },
        marketingPrefectureRecommendId: '',
        listGoodType: [],
        listGoodType1: [],
        listGoodType2: [],
        prefectureType: [],//专区分类
        modelOkInfo: '',
        subMitDataSource: '',
        memberType: []
      }
    },
    // watch: {
    //   saerchMarketingPrefectureTypeId(newVal) {
    //     debugger
    //     if (!newVal) {
    //       this.queryParam.typeName = ''
    //     }
    //   }
    // },
    components: {
      AddMarketingCommoditySelectStoreRecommendModel
    },
    async created() {
      this.marketingPrefectureId = this.$route.query.marketingPrefectureId || ''
      this.limitLsit[0].value = this.$route.query.marketingPrefectureId || ''
      this.limitLsit[2].value = this.$route.query.recommendName || ''
      this.marketingPrefectureRecommendId = this.$route.query.marketingPrefectureRecommendId || ''
      await this.getMarketingPrefectureType()
      this.loadData()
    },
    methods: {

      changeData(value, selectedOptions) {

        let typeName = ''
        if (selectedOptions) {
          for (let i = 0; i < selectedOptions.length; i++) {

            if (i == selectedOptions.length - 1) {
              typeName += selectedOptions[i].label
            } else {
              typeName += selectedOptions[i].label + '-'
            }
          }
        }
        this.queryParam.typeName = typeName
      },


      getMarketingPrefectureType() {
        this.cardLoading = true
        let info = {
          marketingPrefectureId: this.marketingPrefectureId
        }
        return new Promise(resolve => {
          getAction(this.url.getMarketingPrefectureType, info).then(res => {
            if (res.success) {
              let sz = []
              for (let item of res.result) {
                sz.push({
                  label: item.typeName,
                  value: item.id,
                  isLeaf: false
                })
              }
              this.prefectureType = sz
              this.$nextTick(() => {
                resolve()
              })
            } else {
              resolve()
            }
          })
        })

      },
      prefectureTypeDataLoad(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        console.log(targetOption)
        getAction(this.url.findUnderlingListMap, { id: targetOption.value }).then((res) => {
          targetOption.loading = false
          if (res.success && res.result.length > 0) {
            let sz = []
            for (let item of res.result) {
              sz.push({
                label: item.type_name,
                value: item.id
                // isLeaf: false
              })
            }
            targetOption.children = sz
          }
          this.prefectureType = [...this.prefectureType]
        })
      },
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        this.selectedRowKeys = selectedRowKeys
      },
      onDelete(id) {
        let ids
        if (this.modelOkInfo.ids) {
          ids = this.modelOkInfo.ids.split(',')
        }
        const dataSource = [...this.dataSource]
        this.dataSource = dataSource.filter(item => item.id !== id)
        ids = ids.filter(item => item !== id)
        this.modelOkInfo.ids = ids.join(',')
      },
      selectStore() {
        this.$refs.AddMarketingCommoditySelectStoreRecommendModel.open()
      },
      mainLineChange(e, record) {
        this.dataSource = this.dataSource.map(item => {
          if (item.id == record.id) {
            item.sort = e
          }
          return item
        })

      },
      handleSubmit(e) {
        e.preventDefault()
        if (this.dataSource.length <= 0) {
          this.$message.warn('请选择商品！')
          return
        }
        let goodList = []
        for (let item of this.subMitDataSource) {
          goodList.push({
            sort: item.sort,
            id: item.id
          })
        }
        goodList = JSON.stringify(goodList)
        postAction(this.url.addAllMarketingPrefectureGoodAndSpecification, {
          marketingPrefectureRecommendId: this.marketingPrefectureRecommendId,
          goodList
        }).then(res => {
          if (res.success) {
            this.$message.success(res.message || '添加成功！')
            setTimeout(() => {
              this.$router.push({ path: '/marketing/MarketingPrefectureRecommendGoodList' })
            }, 500)
          } else {
            this.$message.warn(res.message || '添加失败！')
          }
          console.log(res)
        })
      },
      loadData() {
        getAction(this.url.queryById, { id: this.marketingPrefectureId }).then(res => {
          if (res.success) {
            this.allData = res.result
            this.limitLsit[1].value = res.result.prefectureName
          }
          this.cardLoading = false
        })
      },
      isEmpty(a) {
        if (a === '' || a === null || a === undefined) {
          return false
        } else {
          return true
        }
      },
      modelOk(info = this.modelOkInfo, search = false) {
        this.modelOkInfo = info
        this.tableLoading = true
        this.subMitDataSource = info.selectedResultList
        this.dataSource = info.selectedResultList
        this.allDataSource = info.selectedResultList
        this.$nextTick(() => {
          this.tableLoading = false
        })
      },
      //查询
      search() {

        console.log(JSON.stringify(this.queryParam))

        this.tableLoading = true
        this.dataSource = this.allDataSource.filter(item => {
          let firstPd = true, secondPd = true
          if ((this.queryParam.goodName && item.goodName.indexOf(this.queryParam.goodName.toLowerCase()) != -1) || !this.queryParam.goodName) {
            firstPd = true
          } else {
            firstPd = false
          }
          if (this.queryParam.typeName) {
            let queryNames = []
            if (this.queryParam.typeName.indexOf('-') != -1) {
              queryNames = this.queryParam.typeName.split('-')
            } else {
              queryNames.push(this.queryParam.typeName)
            }
            let itemNames = []
            if (item.typeName.indexOf('-') != -1) {
              itemNames = item.typeName.split('-')
            } else {
              itemNames.push(item.typeName)
            }
            if (itemNames.length < queryNames.length) {
              secondPd = false
            } else {//比对
              let naems = itemNames.slice(0, queryNames.length)
              secondPd = (naems.toString() == queryNames.toString())
            }
          }
          return firstPd && secondPd
        })
        setTimeout(() => {
          this.tableLoading = false
        }, 500)

      }
    }
  }
</script>

<style lang="less">
  .AddMarketingCommodityRecommendModel {
    .title {
      width: 100%;
      height: 50px;
      color: black;
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      font-size: 18px;
      font-weight: 700;
      align-items: center;
      border-bottom: 1px solid #CCCCCC;
      margin-bottom: 10px;

      span:nth-child(2) {
        padding: 15px;
        cursor: pointer;
      }
    }

    .line-wrap:last-child {
      box-sizing: content-box;
      padding-bottom: 20px;
      border-bottom: 1px solid #CCCCCC;
    }

    .line-wrap {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 14px;
      width: 60vw;
      margin-bottom: 10px;

      .label, .value {
        display: flex;
        align-items: center;
        height: 100%;
      }

      .label {
        width: 15%;
        /*height: 100%;*/
        /*text-align: right;*/
        justify-content: flex-end;
        margin-right: 30px;

      }

      .value {
        width: 40%;
        /*height: 100%;*/
        justify-content: left;

      }
    }
  }
</style>