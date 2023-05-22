<template>
  <a-spin :spinning="confirmLoading">
    <div class="order-details">
      <div class="title">
        确认收货信息及交易详情
      </div>
      <!--订单编号-->
      <a-card class="wrap">
        <detail-list :col="4">
          <detail-list-item v-for='item in card1Cnt' :term="item.term">
            {{item.content}}
          </detail-list-item>
        </detail-list>

      </a-card>
      <!--用户信息-->
      <a-card class="wrap">
        <detail-list :col="4">
          <detail-list-item v-for='item in card2Cnt' :term="item.term">
            {{item.content}}
          </detail-list-item>
        </detail-list>
      </a-card>
      <!--公司物流信息-->
      <a-card class="wrap">

        <!--供应商信息-->
        <!--<div style="display: flex;justify-content:space-between;">-->
          <!--<a-menu-->
            <!--mode="horizontal"-->
            <!--v-model="menuCurrent"-->
            <!--:style="{ lineHeight: '50px',-->
         <!--fontSize:'18px'}"-->

          <!--&gt;-->
            <!--<a-menu-item style="width: 150px;text-align: center;"-->
                         <!--v-for="(itemOp,indexOp) in orderProviderListDTOs" :key="indexOp"-->
                         <!--v-if="orderProviderListDTOs[indexOp].goodsInfo && orderProviderListDTOs[indexOp].goodsInfo.length > 0"-->
            <!--&gt;{{ itemOp.sysUserName }}-->
            <!--</a-menu-item>-->
          <!--</a-menu>-->
          <!--<div class="order-number">-->
            <!--<div class="title2">-->
              <!--订单编号-->
            <!--</div>-->
            <!--<div>-->
              <!--{{ orderProviderListDTOs[menuCurrent[0]].orderNo }}-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->

        <!--选择物流服务-->
        <div>
          <div class="logisticsService ">
            <div class="title">选择物流服务</div>
            <a-button type="primary" @click="addParcel">添加一个包裹</a-button>
          </div>
          <a-card :bordered="true" class="head-decoration-parcel selectService"
                  v-for=" (itemParcel,indexParcel) in orderProviderListDTOs[menuCurrent[0]].listParcel">
            <div style="display:flex;justify-content: space-between">
              <div style="font-size: 16px;color: black">
                {{itemParcel.name}}
              </div>
              <div style="color: #2eabff;cursor: pointer" v-if="indexParcel != 0" @click="showConfirm(indexParcel)">
                删除包裹
              </div>
            </div>
            <div>
              <span>包裹商品:</span>
              <a-tag v-for="(storeItem,storeIndex) in itemParcel.orderProviderGoodRecordInfo"
                     style="margin: 15px 0 0 15px;">
                {{ storeItem.name }}
                <span style="margin-left: 20px;padding: 10px;" @click="deleteTag(storeItem)">
                X
              </span>
              </a-tag>
              <!--            <Span class="head-decorationGoods" v-for="storeItem in itemParcel.orderProviderGoodRecordInfo">{{ storeItem.name }}</Span>-->
            </div>
            <div>
              <span>物流公司:</span>
              <j-dict-select-tag class="head-decorationGoods" v-model="itemParcel.logisticsCompany" placeholder="请选择"
                                 dictCode="logistics_company"/>
            </div>
            <div>
              <span>快递单号:</span>
              <a-input class="head-decorationGoods" placeholder="请输入正确的快递单号"
                       v-model="itemParcel.trackingNumber"></a-input>
            </div>
          </a-card>
          <!--发货商品-->
          <div class="fahuoGoods" style="border: 1px solid #e6e6e6;margin-top: 20px;padding: 20px">
            <div class="fahuoGoods1"
                 style="height: 40px;border: 1px solid #0099ff;background-color: #b3e1ff;line-height: 40px;border-radius: 4px">
            <span style="margin-left: 20px">
              请选择要发货的商品
            </span>
            </div>
            <!--            :loading="loading"-->
            <a-table
              style="margin-top: 20px"
              ref="table"
              size="middle"
              :rowKey="record => record.id"
              bordered
              :columns="goodsShippedColumns"
              :dataSource="orderProviderListDTOs[menuCurrent[0]].goodsInfo"
              :pagination="false"
              @change="handleTableChange">
              <template slot="mainPicture" slot-scope="text, record, index">
                <div class="anty-img-wrap">
                  <a-avatar shape="square" v-if="record.mainPicture != undefined &&  record.mainPicture == ''"
                            icon="user"/>
                  <img :src="getAvatarView(record.mainPicture)" alt="" style="width:50px;height: 50px" v-else>
                </div>
              </template>
              <template slot="parcel" slot-scope="text, record, index">
                <div class="anty-img-wrap">
                  <a-select style="width:100px"
                            v-model="orderProviderListDTOs[menuCurrent[0]].OrderProviderGoodRecordId[index]"
                            placeholder="请选择">
                    <a-select-option :value="0" @click="ChooseParcel(record,'请选择')">请选择</a-select-option>
                    <a-select-option
                      v-for="(selectItem,selectIndex) in orderProviderListDTOs[menuCurrent[0]].listParcel"
                      :value="selectIndex + 1" @click="ChooseParcel(record,selectItem)">
                      {{selectItem.name}}
                    </a-select-option>
                    <!--                  <a-select-option :value="record.id" @click="ChooseParcel(record)">包裹1</a-select-option>-->
                    <!--                  <a-select-option :value="2"  @click="ChooseParcel(record)">包裹2</a-select-option>-->
                  </a-select>
                </div>
              </template>
            </a-table>
          </div>
        </div>
      </a-card>
      <!--确认发货、退货信息-->
      <a-card class="wrap">
        <div class="title">确认发货/退货信息</div>
        <a-card :bordered="true" class="head-decoration-parcel">
          <div>
            <span>我的发货信息:</span>
            <span class="head-decorationGoods">{{ orderProviderListDTOs[menuCurrent[0]].providerAddressFa }}</span>
            <!--闫小小 ，18750202107 ，0592-5924551，福建省厦门市思明区软件园二期望海路10号之二xx单元-->
            <span style="color: #2eabff;margin-left: 40px"
                  @click="showModalAddressInformationFaTui(orderProviderListDTOs[menuCurrent[0]].listParcel[0].id,orderProviderListDTOs[menuCurrent[0]].providerAddressFa,'1')">修改</span>
          </div>
          <div>
            <span>我的退货信息:</span>
            <span class="head-decorationGoods">{{ orderProviderListDTOs[menuCurrent[0]].providerAddressTui }}</span>
            <!--闫小小 ，18750202107 ，0592-5924551，福建省厦门市思明区软件园二期望海路10号之二xx单元-->
            <span style="color: #2eabff;margin-left: 40px"
                  @click="showModalAddressInformationFaTui(orderProviderListDTOs[menuCurrent[0]].listParcel[0].id,orderProviderListDTOs[menuCurrent[0]].providerAddressTui,'2')">修改</span>
          </div>
        </a-card>
        <div style="margin-top:20px;margin-bottom: 40px"> 友情提示：没有发货地址和退货地址，不允许发货！请正确填写退货地址。若因地址填写不准确导致的货物无法退回等风险需要您承担。
        </div>
        <div style="display: flex;justify-content:center;margin: 0 auto;width: 40%;">
          <a-button @click="cancel()">
            取消
          </a-button>
          <a-button style="margin-left: 8px" type="primary" @click="deliverGoodsSubmit()">
            发货
          </a-button>
        </div>
      </a-card>
      <!-- 表单区域 -->
      <!--<orderList-modal ref="modalForm" @ok="modalFormOk"></orderList-modal>-->

      <!--修改供应商发货退货地址弹出-->
      <a-modal title="修改买家收货地址" :width="700" v-model="AddressFaTui" @ok="hideModalAddressFaTuiInformation()" okText="确认"
               cancelText="取消">
        <div>
          <div class="Address">
            当前订单的收货信息：{{ Addressft }}
          </div>
          <input style="display: none" v-model="AddressftIndex"/>
          <div style="margin-top: 60px;margin-bottom: 60px">
            <a-radio-group @change="onChange" v-model="providerAddressId">
              <a-radio :style="radioStyle" v-for="item of listProviderAddressDTO" :value="item.id">
                {{ item.contactName }}&nbsp;{{ item.contactPhone }}&nbsp&nbsp;{{ item.contactTelephone }}&nbsp;{{
                item.detailedAddress }}
              </a-radio>
            </a-radio-group>

          </div>
        </div>
      </a-modal>

    </div>
  </a-spin>

</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { filterObj } from '@/utils/util'
  import DetailList from '@/components/tools/DetailList'
  import STable from '@/components/table/'
  import { postAction, getAction } from '@/api/manage'

  const DetailListItem = DetailList.Item
  //字典
  import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'

  let count = 1
  export default {
    name: 'OrderListList',
    mixins: [JeecgListMixin],
    inject: ['rush'],
    components: {
      DetailList,
      DetailListItem,
      STable
    },
    data() {
      return {
        description: '订单列表管理页面',
        //菜单页码
        Addressft:'',
        menuCurrent: [0],
        orderType: '',
        AddressFaTui: false,
        AddressftIndex: '',
        confirmLoading: true,
        //发货商品
        orderProviderGoodRecords: [],
        listProviderAddressDTO: [],
        providerAddressId: '',
        radioStyle: {
          providerAddressId: '',
          display: 'block',
          height: '30px',
          lineHeight: '30px',
          white: '100%'
        },
        //物流服务
        orderProviderListDTOs: [
          //第一个供应商
          {
            //供应商姓名
            sysUserName: '第一个供货商',
            //订单编号
            orderNo: 'asd15406545564sa5451',
            //包裹集合
            listParcel: [
              //第一个包裹
              {
                id: '', //包裹id
                name: `第一个包裹`,//包裹名称
                //包裹商品信息
                orderProviderGoodRecordInfo: [
                  // {
                  //   id: '123',
                  //   name: '第一个名字的包裹1的商品名称',//商品名称
                  // }
                ],
                logisticsCompany: '',  //物流公司
                trackingNumber: ''   //快递单号
              }

            ],
            OrderProviderGoodRecordId: [],
            //商品信息
            goodsInfo: []
          }
        ],
        reusePage: '',
        record: {},
        //订单编号表头
        card1Cnt: [
          {
            term: '订单编号',
            content: ''
          }, {
            term: '创建时间',
            content: ''
          }, {
            term: '付款时间',
            content: ''
          }
        ],
        //买家信息
        card2Cnt: [
          // {
          //   term: '买家账号',
          //   content: ''
          // }, {
          //   term: '昵称',
          //   content: ''
          // }, {
          //   term: '普通会员',
          //   content: ''
          // },
          {
            term: '收货人',
            content: ''
          },
          {
            term: '联系电话',
            content: ''
          },
          {
            term: '收货地址',
            content: ''
          },
          {
            term: '门牌号',
            content: ''
          },
          {
            term: '留言信息',
            content: ''
          }
        ],
        //发货商品表头
        goodsShippedColumns: [
          {
            title: '商品主图',
            align: 'center',
            dataIndex: 'mainPicture',
            scopedSlots: { customRender: 'mainPicture' }
          },
          {
            title: '商品名称',
            align: 'center',
            dataIndex: 'goodName'
          },

          {
            title: '商品规格',
            align: 'center',
            dataIndex: 'specification',
            scopedSlots: { customRender: 'specification' }
          },

          {
            title: '数量',
            align: 'center',
            dataIndex: 'amount',
            scopedSlots: { customRender: 'amount' }
          },
          {
            title: '选择包裹',
            align: 'center',
            dataIndex: 'parcel',
            scopedSlots: { customRender: 'parcel' }
          }
        ],
        url: {
          list: '/orderList/orderList/list',
          delete: '/orderList/orderList/delete',
          deleteBatch: '/orderList/orderList/deleteBatch',
          exportXlsUrl: 'orderList/orderList/exportXls',
          importExcelUrl: 'orderList/orderList/importExcel',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          ordereDlivery: 'orderList/orderList/ordereDlivery',
          ProviderAddressDTOList: '/providerAddress/providerAddress/ProviderAddressDTOList',
          updateProviderAddressId: '/orderProviderList/orderProviderList/updateProviderAddressId'
        }
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    },
    mounted() {
      this.init(() => {
//**********************************数据渲染开始********************************************//
        let data = JSON.parse(localStorage.getItem('deliverGoods'))
        this.record = this.$route.query.record
        if (this.orderType && this.orderType) {
          for (let item of this.orderType) {//字典值替换
            if (item.value == data.orderType) {
              data.orderType = item.text
              break
            }
          }
        }
        if (this.oderCloseType && data.closeType) {
          for (let item of this.oderCloseType) {//字典值替换
            if (item.value == data.closeType) {
              data.closeType = item.text
              break
            }
          }
        }
        if (data.closeExplain && this.oderCloseExplain) {
          for (let item of this.oderCloseExplain) {//字典值替换
            if (item.value == data.closeExplain) {
              data.closeExplain = item.text
              break
            }
          }
        }
        if (data.memberList) {
          if (data.memberList.memberType && this.memberTypeDict) {
            for (let item of this.memberTypeDict) {//字典值替换
              if (item.value == data.memberList.memberType) {
                data.memberList.memberType = item.text
                break
              }
            }
          }
        }
        let memberList = data.memberList
        //商品信息


        // let orderProviderListDTOs = data.orderProviderListDTOs
        let orderProviderListDTOs = [data]

        let sz = []
        for (let itemOPL of orderProviderListDTOs) {

          let gongyingshang = {
            //供应商姓名
            sysUserName: itemOPL.sysUserName,//'第一个名字'
            //订单编号
            orderNo: itemOPL.orderNo,//'asd15406545564sa5451'
            //包裹集合
            listParcel: [
              //第一个包裹
              {
                id: itemOPL.id, //包裹id
                name: `第${count}个包裹`,//包裹名称
                //包裹商品信息
                orderProviderGoodRecordInfo: [
                  // {
                  //   id: '123',
                  //   name: '第一个名字的包裹1的商品名称',//商品名称
                  // },
                  // {
                  //   id: '123',
                  //   name: '第一个名字的包裹1的商品名称',//商品名称
                  // }
                ],
                logisticsCompany: '',  //物流公司
                trackingNumber: ''   //快递单号
              }

            ],
            //商品信息
            goodsInfo: [{
              key: '1',
              mainPicture: '',//主图
              goodName: '',//名称
              specification: '',//规格
              amount: '',//数量
              parcel: ''//选择包裹
            }],
            OrderProviderGoodRecordId: [],
            //退货信息
            providerAddressFa: '',
            //发货信息
            providerAddressTui: ''
          }
          //  gongyingshang.goodsInfo = itemOPL.orderProviderGoodRecords
          gongyingshang.goodsInfo = itemOPL.orderProviderGoodRecordDTOList

          let providerAddressFa = ''
          if (itemOPL.providerAddressDTOFa) {
            // 张小娴 ， 18750202107  ， 福建省厦门市思明区望海路10号之二
            //发货信息
            let providerAddressDTOFa = itemOPL.providerAddressDTOFa
            providerAddressFa = providerAddressDTOFa.contactName + ',' + providerAddressDTOFa.contactPhone + ',' +
              providerAddressDTOFa.contactPhone + ',' + providerAddressDTOFa.detailedAddress
          } else {
            providerAddressFa = '无'
          }
          //退货信息
          let providerAddressTui = ''
          if (itemOPL.providerAddressDTOTui) {
            // 张小娴 ， 18750202107  ， 福建省厦门市思明区望海路10号之二
            //发货信息
            let providerAddressDTOTui = itemOPL.providerAddressDTOTui
            providerAddressTui = providerAddressDTOTui.contactName + ',' + providerAddressDTOTui.contactPhone + ',' +
              providerAddressDTOTui.contactPhone + ',' + providerAddressDTOTui.detailedAddress
          } else {
            providerAddressTui = '无'
          }
          gongyingshang.providerAddressFa = providerAddressFa
          gongyingshang.providerAddressTui = providerAddressTui
          sz.push(gongyingshang)

        }


        this.orderProviderListDTOs = sz
        // console.log("orderProviderListDTOs---", orderProviderListDTOs);
        /*********************************包裹添加未处理**************************************************/
        this.reusePage = this.$route.query.reusePage
        this.card1Cnt = [
          {
            term: '订单编号',
            content: data.orderNo
          },
          {
            term: '创建时间',
            content: data.createTime
          }, {
            term: '付款时间',
            content: data.orderList.payTime
          }
        ]
        this.card2Cnt = [
          // {
          //   term: '买家账号',
          //   content:memberList ?  memberList.phone : ''
          // }, {
          //   term: '昵称',
          //   content: memberList ? memberList.nickName : ''
          // }, {
          //   term: '会员类型',
          //   content: memberList ? memberList.memberType : ''
          // },
          {
            term: '收货人',
            content: data.orderList.consignee
          },
          {
            term: '联系电话',
            content: data.orderList.contactNumber
          },
          {
            term: '收货地址',
            content: data.orderList.shippingAddress
          },
          {
            term: '门牌号',
            content: data.orderList.houseNumber
          }
        ]
        for (let index = 0; index < this.orderProviderListDTOs.length; index++) {
          if (this.orderProviderListDTOs[index].goodsInfo.length > 0) {
            this.menuCurrent = [index]
            break
          }
        }
        this.confirmLoading = false
      })//字典加载
    },
    methods: {
      getAvatarView(mainPicture) {
        if (mainPicture) {
          return this.url.imgerver + '/' + Object.values(JSON.parse(mainPicture))[0]
        } else {
          return ''
        }
      },
      //字典
      init(callback) {
        this.initIndex(callback)
      },
      initIndex(callback) {
        //oderCloseType关闭类型字典
        initDictOptions('oder_close_type').then((res) => {
          if (res.success) {
            this.oderCloseType = res.result
            console.log('this.oderCloseType关闭类型字典', this.oderCloseType)
          }
        }),
          // oder_close_explain订单关闭原因字典
          initDictOptions('oder_close_explain').then((res) => {
            if (res.success) {
              this.oderCloseExplain = res.result

              console.log('this.oderCloseExplain订单关闭原因字典', this.oderCloseExplain)
            }
          })
        //oder_distribution 订单配送方式字典
        initDictOptions('oder_distribution').then((res) => {
          if (res.success) {
            this.oderDistribution = res.result
            this.distribution = res.result
            console.log('this.oderDistribution订单关闭原因字典', this.oderDistribution)
          }
        })
        //member_type 会员类型字典
        initDictOptions('member_type').then((res) => {
          if (res.success) {
            this.memberTypeDict = res.result
            console.log('this.memberTypeDict会员类型类型字典', this.memberTypeDict)
            this.$nextTick(() => {
              callback()
            })
          }
        })
        //order_type 订单类型字典
        initDictOptions('order_type').then((res) => {
          if (res.success) {
            this.orderType = res.result
            console.log('this.orderType订单类型字典', this.orderType)
            this.$nextTick(() => {
              callback()
            })
          }
        })

      },
      //取消按钮
      showModalCancelInformation(orderListId) {
        console.log(orderListId)
        this.$refs.modalForm.showModalCancelInformation(orderListId)
        this.$refs.modalForm.title = '取消按钮'
        this.$refs.modalForm.disableSubmit = false
      },

      //获取选择包裹的Id
      ChooseParcel(record, item) {
        let listParcel = this.orderProviderListDTOs[this.menuCurrent[0]].listParcel
        let info = {
          name: record.goodName,
          id: record.id
        }
        //添加标签之前 首先判断所有是否有这个标签  存在标签则删除标签
        for (let index = 0; index < listParcel.length; index++) {
          for (let index2 = 0; index2 < listParcel[index].orderProviderGoodRecordInfo.length; index2++) {
            if (info.id == listParcel[index].orderProviderGoodRecordInfo[index2].id) {
              listParcel[index].orderProviderGoodRecordInfo.splice(index2, 1)
              break
            }
          }
        }
        if (item != '请选择') {
          item.orderProviderGoodRecordInfo.push(info)
        }
      },
      //添加一个包裹
      addParcel() {
        count++
        let packages = {
          id: '', //包裹id
          name: `第${count}个包裹`,//包裹名称
          //包裹商品信息
          orderProviderGoodRecordInfo: [
            // {
            //   id: '123',
            //   name: '第一个名字的包裹1的商品名称',//商品名称
            // },
            // {
            //   id: '123',
            //   name: '第一个名字的包裹1的商品名称',//商品名称
            // }
          ],
          logisticsCompany: '',  //物流公司
          trackingNumber: ''   //快递单号
        }
        this.orderProviderListDTOs[this.menuCurrent[0]].listParcel.push(packages)
      },
      //删除包裹提示框
      showConfirm(index) {
        let that = this
        this.$confirm({
          title: '删除包裹后加入到包裹的商品需要重新设定包裹',
          content: '您确定要删除吗？',
          onOk() {
            that.deletePackage(index)
            console.log('OK')
          },
          onCancel() {
            console.log('Cancel')
          },
          class: 'test'
        })
      },
      //删除包裹事件
      deletePackage(index) {
        count--
        this.orderProviderListDTOs[this.menuCurrent[0]].listParcel.splice(index, 1)
      },
      //删除标签事件
      deleteTag(item) {
        let id = item.id
        this.orderProviderListDTOs[this.menuCurrent[0]].goodsInfo.forEach((item, index) => {
          if (id == this.orderProviderListDTOs[this.menuCurrent[0]].goodsInfo[index].id) {
            this.ChooseParcel(item, '请选择')
            this.$set(this.orderProviderListDTOs[this.menuCurrent[0]].OrderProviderGoodRecordId, index, 0)
            return
          }
        })
      },
      //发货提交
      deliverGoodsSubmit() {
        let that = this
        let hasPackage = 0
        for (let data of this.orderProviderListDTOs) {
          for (let dataListParcel of data.listParcel) {
            if (dataListParcel.orderProviderGoodRecordInfo.length > 0) {
              if (!dataListParcel.logisticsCompany) {
                that.$message.error('请选择物流公司')
                return false
              } else if (!dataListParcel.trackingNumber) {
                that.$message.error('请输入快递单号')
                return false
              }
              hasPackage++
            }
            // else{
            //   that.$message.error("请选择包裹!");
            //   return false;
            // }
          }
        }
        // return false;
        setTimeout(() => {
          if (hasPackage <= 0) {
            that.$message.error('请选择包裹!')
            return false
          }
          that.$confirm({
            title: '发货信息提交后，将无法修改，请确认填写的信息的正确性',
            content: '您确定要提交吗？',
            onOk() {
              postAction(that.url.ordereDlivery, { listMap: that.orderProviderListDTOs }).then((res) => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.$router.push({ path: '/order/OrderSupplierListListToSendTheGoods' })


                } else {
                  this.$message.error(res.message)
                }
              })
            },
            onCancel() {
            }
          })
        }, 200)


      },

      //供应商发退货地址修改地址
      showModalAddressInformationFaTui(orderProviderListId, Addressft, index) {//index :1 发货， 2退货
        var that = this
        that.Addressft = Addressft//当前发退货信息
        that.AddressftIndex = index
        that.providerAddressId = ''
        that.AddressFaTui = true
        that.orderProviderListId = orderProviderListId
        console.log(orderProviderListId)
        getAction(this.url.ProviderAddressDTOList, { orderProviderListId: that.orderProviderListId }).then((res) => {
          if (res.success) {
            that.listProviderAddressDTO = res.result
            console.log(that.listProviderAddressDTO)
          } else {
            that.$message.success('操作失败')
          }
        })
        //this.goodListId=goodListId;
      },
      hideModalAddressFaTuiInformation() {
        var that = this
        console.log(that.orderProviderListId)
        getAction(that.url.updateProviderAddressId, {
          id: that.orderProviderListId,
          providerAddressId: that.providerAddressId,
          AddressftIndex: that.AddressftIndex
        }).then((res) => {
          if (res.code == 200) {
            that.$message.success(res.message)
            that.$emit('ok')//发送父级主键刷新
            that.rush()
          } else {
            that.$message.success('修改失败')
          }
        })

        this.AddressFaTui = false
      },
      //修改地址获取修改数据
      onChange(e) {
        this.providerAddressId = e.target.value
        console.log('radio checked', e.target.value)
      },

      //取消按钮
      cancel() {
        this.$router.push({ path: '/order/OrderSupplierListListToSendTheGoods' })//reusePage=4

      }
    }
  }
</script>
<style lang="less">
  .order-details {
    width: 100%;
    color: black;

    .title {
      font-size: 20px;
      font-weight: 700;
      padding: 0 20px;
      padding-top: 25px;
      margin-bottom: 25px;
    }

    .order-number {
      line-height: 50px;
      color: #1890ff;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title2 {
        margin-right: 20px;
        color: black;
      }
    }
    .selectService {
      .ant-card-body {
        > div {
          margin-top: 15px;
        }
      }
      .ant-tag {
        height: 32px;
        font-size: 14px;
      }
      .ant-tag::before {
        display: inline-block;
        content: "";
        height: 100%;
        vertical-align: middle;
      }
    }

    .wrap {
      margin-top: 25px;
      padding: 20px;
      box-sizing: content-box;

      .head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        color: black;

        .term {
          font-weight: 700;
          margin-right: 15px;
        }
      }
    }

    .head-decoration {
      background: #ececec;
      font-size: 14px;
      height: 150px;

      .ant-card-body {
        height: 100% !important;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        color: black;
      }
    }

    .cnt-title {
      font-size: 20px;
      font-weight: 700;
    }

    .logisticsService {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .head-decoration-parcel {
      background: #ececec;
      font-size: 14px;
      margin-top: 10px;

    }

    .head-decorationGoods {
      width: 200px;
      margin-left: 20px;
      margin-bottom: 10px;
      margin-top: 10px
    }

    .fahuoGoods {
      border: 1px solid #e6e6e6;
      margin-top: 20px;
      padding: 20px
    }

    .fahuoGoods1 {
      height: 35px;
      border: 1px solid #0099ff;
      background-color: #b3e1ff;
      line-height: 35px;
      border-radius: 4px;
    }

  }

  .Address {
    width: 100%;
    height: 30px;
    text-align: center;
    background-color: #ccebff;
    border-radius: 4px;
    border: 1px solid #0099ff;
    line-height: 30px;
  }
</style>