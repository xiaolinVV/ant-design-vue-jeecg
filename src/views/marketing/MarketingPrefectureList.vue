<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <!--            v-model="queryParam.year"-->
            <a-form-item label="专区id">
              <a-input placeholder="请输入专区id" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="专区名称">
              <a-input v-model="queryParam.prefectureName" placeholder="请输入专区名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="专区标签">
              <a-input v-model="queryParam.prefectureLabel" placeholder="请输入专区标签"></a-input>
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
            <a-form-item label="客户端显示">
              <a-select v-model="queryParam.pointsDisplay" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">全部</a-select-option>
                <a-select-option :value="1">仅小程序</a-select-option>
                <a-select-option :value="2">仅app</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--        <template v-if="toggleSearchStatus">-->
          <!--        <a-col :md="6" :sm="8">-->
          <!--            <a-form-item label="创建日">-->
          <!--              <a-input placeholder="请输入创建日" v-model="queryParam.day"></a-input>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <!--          <a-col :md="6" :sm="8">-->
          <!--            <a-form-item label="删除状态（0，正常，1已删除）">-->
          <!--              <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-model="queryParam.delFlag"></a-input>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <!--          <a-col :md="6" :sm="8">-->
          <!--            <a-form-item label="专区名称">-->
          <!--              <a-input placeholder="请输入专区名称" v-model="queryParam.prefectureName"></a-input>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <!--          </template>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--                        <a @click="handleToggleSearch" style="margin-left: 8px">-->
              <!--                          {{ toggleSearchStatus ? '收起' : '展开' }}-->
              <!--                          <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--                        </a>-->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('平台专区')">导出</a-button>
      <a-button type="primary" icon="profile" @click="routerTo">创建专区</a-button>
      <a-button type="primary" icon="plus" @click="showClientModal">客户端显示</a-button>

      <!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
      <!--        <a-button type="primary" icon="import">导入</a-button>-->
      <!--      </a-upload>-->
      <!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
      <!--        <a-menu slot="overlay">-->
      <!--          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
      <!--        </a-menu>-->
      <!--        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
      <!--      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
      <!--      (columns.length + 1) * columnsWidth-->
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: 2500 }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="logoAddr" slot-scope="text, record, index">
          <img
            v-if="record.logoAddr != undefined"
            class="clickShowImage "
            :preview="'logoAddr' + index"
            :src="getAvatarView(JSON.parse(record.logoAddr)[0])"
            alt=""
          />
        </template>
        <template slot="isViewType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isViewType == 0">无分类</span>
            <span shape="square" v-if="record.isViewType == 1">自定义分类</span>
          </div>
        </template>

        <template slot="isAllType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isAllType == 0">-</span>
            <span shape="square" v-else-if="record.isAllType == 1">支持</span>
            <span shape="square" v-else>不支持</span>
          </div>
        </template>
        <template slot="astrictGood" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.astrictGood == 0">不限制</span>
            <span shape="square" v-if="record.astrictGood == 1"
              >成本价低于销售价 {{ record.astrictPriceProportion }} %</span
            >
          </div>
        </template>
        <template slot="prefecturePriceProportion" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square">{{ record.prefecturePriceProportion }}%</span>
          </div>
        </template>

        <template slot="isDiscount" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isDiscount == 0">不支持</span>
            <span shape="square" v-if="record.isDiscount == 1">支持</span>
          </div>
        </template>
        <!--福利金抵扣-->
        <template slot="isWelfare" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isWelfare == 0">不支持福利金抵扣</span>
            <span shape="square" v-if="record.isWelfare == 1">福利金全额抵扣</span>
            <span shape="square" v-if="record.isWelfare == 2"
              >福利金限额抵扣，最高可抵扣(按专区价){{ record.bigWelfareProportion }}%</span
            >
            <span shape="square" v-if="record.isWelfare == 3"
              >福利金限额抵扣，最高可抵扣(按利润){{ record.bigWelfareProportion }}%</span
            >
          </div>
        </template>
        <!--赠送福利金-->
        <template slot="isGiveWelfare" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isGiveWelfare == 0">不支持</span>
            <span shape="square" v-if="record.isGiveWelfare == 1">最高可送{{ record.bigGiveWelfareProportion }} %</span>
          </div>
        </template>
        <template slot="isVipLower" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isVipLower == 0">不支持</span>
            <span shape="square" v-if="record.isVipLower == 1">支持</span>
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

        <template slot="validTime" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.validTime == 0">长期有效</span>
            <span shape="square" v-if="record.validTime == 1">短期有效</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>
        <template slot="endTime" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.endTime">{{ record.endTime }}</span>
            <span shape="square" v-else>--</span>
          </div>
        </template>

        <template slot="isViewMarketPrice" slot-scope="text, record">
          <span v-if="text == 1">
            显示
          </span>
          <span v-else>
            不显示
          </span>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="routerTo(record, true)">编辑</a>

          <a-divider type="vertical" />

          <a v-if="record.status == 1" @click="showModalStopStatus(record.id, '0')">停用</a>
          <a v-if="record.status == 0" @click="updateStatus(record.id, '1')">启用</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="copyAddress(record.id)">复制地址</a>
              </a-menu-item>
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
    <marketingPrefecture-modal ref="modalForm" @ok="modalFormOk"></marketingPrefecture-modal>
    <clientModal
      ref="clientModal"
      @ok="clientModalOk"
      url="/marketingPrefecture/marketingPrefecture/settingPointsDisplay"
    ></clientModal>
  </a-card>
</template>

<script>
import MarketingPrefectureModal from './modules/MarketingPrefectureModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import clientModal from '@/components/popUp/clientChangeModal'
const columnsWidth = 250

export default {
  name: 'MarketingPrefectureList',
  mixins: [JeecgListMixin],
  components: {
    MarketingPrefectureModal,
    clientModal
  },
  data() {
    return {
      description: '平台专区管理页面',
      goodUrl: '',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          // width: columnsWidth,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '专区id',
          align: 'center',
          dataIndex: 'id'
          // width: columnsWidth,
        },

        {
          title: '专区名称',
          align: 'center',
          dataIndex: 'prefectureName'
          // width: columnsWidth,
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
          // width: columnsWidth,
        },
        {
          title: '专区标签',
          align: 'center',
          dataIndex: 'prefectureLabel'
          // width: columnsWidth,
        },
        {
          title: '专区图标',
          align: 'center',
          dataIndex: 'logoAddr',
          scopedSlots: { customRender: 'logoAddr' }
          // width: columnsWidth,
        },
        // {
        //      title: '分享图',
        //      align:"center",
        //      dataIndex: 'coverPlan'
        //     },
        // {
        //      title: '海报图',
        //      align:"center",
        //      dataIndex: 'posters'
        //     },
        // {
        //   title: '专区介绍',
        //   align: 'center',
        //   dataIndex: 'prefectureExplain'
        //   // width: columnsWidth,
        // },
        {
          title: '专区分类', //0：不显示；1：显示
          align: 'center',
          dataIndex: 'isViewType',
          scopedSlots: { customRender: 'isViewType' }
        },
        {
          title: '全部', //是否支持全部；0：不支持；1：支持
          align: 'center',
          dataIndex: 'isAllType',
          scopedSlots: { customRender: 'isAllType' }
        },
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'isViewMarketPrice',
          scopedSlots: { customRender: 'isViewMarketPrice' }
        },
        {
          title: '专区商品限制',
          align: 'center',
          dataIndex: 'astrictGood',
          scopedSlots: { customRender: 'astrictGood' }
        },
        {
          title: '购买人限制',
          align: 'center',
          dataIndex: 'buyerLimit_dictText'
        },
        // {
        //      title: '成本价低于销售价百分比',
        //      align:"center",
        //      dataIndex: 'astrictPriceProportion'
        //     },
        {
          title: '专区价比例',
          align: 'center',
          dataIndex: 'prefecturePriceProportion',
          scopedSlots: { customRender: 'prefecturePriceProportion' }
          // width: columnsWidth,
        },
        {
          // ；0：不支持；1：支持
          title: '优惠券抵扣',
          align: 'center',
          dataIndex: 'isDiscount',
          scopedSlots: { customRender: 'isDiscount' }
          // width: columnsWidth,
        },
        {
          // ；0：不支持福利金抵扣；1：福利金全额抵扣；2：福利金限额抵扣isWelfare
          title: '福利金抵扣',
          align: 'center',
          dataIndex: 'isWelfare',
          scopedSlots: { customRender: 'isWelfare' }
          // width: columnsWidth,
        },
        {
          title: 'vip会员免福利金',
          align: 'center',
          dataIndex: 'isVipLower',
          scopedSlots: { customRender: 'isVipLower' }
          // width: columnsWidth,
        },
        {
          // ；0：不支持；1：支持isGiveWelfare
          title: '赠送福利金',
          align: 'center',
          dataIndex: 'isGiveWelfare',
          scopedSlots: { customRender: 'isGiveWelfare' }
          // width: columnsWidth,
        },
        // {
        //      title: '赠送福利金，最高可送',
        //      align:"center",
        //      dataIndex: 'bigGiveWelfareProportion'
        //     },
        {
          // ；0：长期有效；1：短期有效validTime
          title: '有效期',
          align: 'center',
          dataIndex: 'validTime',
          scopedSlots: { customRender: 'validTime' }
          // width: columnsWidth,
        },
        {
          title: '客户端显示',
          align: 'center',
          dataIndex: 'pointsDisplay',
          scopedSlots: { customRender: 'pointsDisplay' }
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'startTime'
          // width: columnsWidth,
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endTime',
          scopedSlots: { customRender: 'endTime' }
          // width: columnsWidth,
        },
        {
          // ；0：停用；1：启用；2：草稿
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
          // width: columnsWidth,
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          // width: columnsWidth,
          fixed: 'right',
          width: 200
        }
      ],
      url: {
        list: '/marketingPrefecture/marketingPrefecture/list',
        delete: '/marketingPrefecture/marketingPrefecture/delete',
        deleteBatch: '/marketingPrefecture/marketingPrefecture/deleteBatch',
        exportXlsUrl: 'marketingPrefecture/marketingPrefecture/exportXls',
        importExcelUrl: 'marketingPrefecture/marketingPrefecture/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        updateStatus: '/marketingPrefecture/marketingPrefecture/updateStatus',
        getMarketingPrefectureUrl: '/marketingPrefecture/marketingPrefecture/getMarketingPrefectureUrl'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    clientModalOk() {
      this.loadData()
    },
    //客户端显示
    showClientModal() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      }
      let ids = this.selectedRowKeys.join(',')
      this.$refs.clientModal.open(ids)
    },
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    routerTo(record = '', isEdit = false) {
      console.log(record)
      if (isEdit && record) {
        localStorage.setItem('marketingSpecialArea', JSON.stringify(record))
      } else {
        localStorage.removeItem('marketingSpecialArea')
      }
      this.$router.push({ path: '/marketing/modules/AddMarketingSpecialAreaModal' })
    },

    //停用
    showModalStopStatus(id) {
      this.$refs.modalForm.showModalStopStatus(id)
      this.$refs.modalForm.title = '停用'
      this.$refs.modalForm.disableSubmit = false
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
        title: '启用后，该专区内的广告、专区分类和专区商品符合要求都将被启用',
        content: '您确定要启用吗？',
        onOk: function() {
          getAction(that.url.updateStatus, { ids: id, statusExplain: '', status: status }).then(res => {
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
      getAction(this.url.getMarketingPrefectureUrl, { marketingPrefectureId: id }).then(res => {
        if (res.success) {
          // debugger
          that.goodUrl = res.result.url

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
<style lang="less"></style>
