<template>
  <div>
    <a-modal title="停用" v-model="visibleStopStatus" @ok="hideModal()" okText="确认" cancelText="取消">
      <i style="color: #faad14;font-size: 22px;margin-right: 16px;float: left;">
        <svg viewBox="64 64 896 896" data-icon="question-circle" width="1em" height="1em" fill="currentColor"
             aria-hidden="true" class="">
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
          <path
            d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
        </svg>
      </i>
      <h3>停用后，用户进店将无法获得奖励</h3>
      <p>您确定要停用吗？</p>
      <a-textarea
        placeholder="请输入停用说明"
        v-model="closeExplain"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </a-modal>
    <a-modal title="删除" v-model="visibleDelete" @ok="hideModal()" okText="确认" cancelText="取消">
      <i style="color: #faad14;font-size: 22px;margin-right: 16px;float: left;">
        <svg viewBox="64 64 896 896" data-icon="question-circle" width="1em" height="1em" fill="currentColor"
             aria-hidden="true" class="">
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
          <path
            d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
        </svg>
      </i>
      <h3>删除分类将无法恢复</h3>
      <p>您确定要删除吗？</p>
      <a-textarea
        placeholder="请输入删除说明"
        v-model="closeExplain"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </a-modal>
    <a-modal title="关闭该称号资金后，该称号的资金将停止累计" v-model="visibleStopTitleFuund" @ok="hideModal()" okText="确认" cancelText="取消">
      <i style="color: #faad14;font-size: 22px;margin-right: 16px;float: left;">
        <svg viewBox="64 64 896 896" data-icon="question-circle" width="1em" height="1em" fill="currentColor"
             aria-hidden="true" class="">
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
          <path
            d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"></path>
        </svg>
      </i>
      <p>您确定要关闭吗？</p>
      <a-textarea
        placeholder="请输入关闭说明"
        v-model="closeExplain"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </a-modal>
  </div>

</template>

<script>
  import { httpAction, getAction, putAction,deleteAction ,postAction} from '@/api/manage'
  export default {
    name: 'MarketingCommingStoreListStopOrStartModal',
    data(){
      return{
        visibleStopStatus: false,
        visibleDelete:false,
        visibleStopTitleFuund:false,
        model:{},
        closeExplain: '',
        url: {
          add: "/memberDesignation/memberDesignation/add",
          edit:"/marketingCommingStore/marketingCommingStore/edit",
          //删除接口
          delete: "/marketingCommingStore/marketingCommingStore/delete",
        }
      }
    },
    methods:{
      //停用或删除
      hideModal() {
        let that = this
        if(this.visibleStopStatus || this.visibleStopTitleFuund){
          let datas;
          if(this.visibleStopStatus){
            datas = {
              id: this.model.id,
              closeExplain: this.closeExplain,
              status: '0'
            }
          }else if(this.visibleStopTitleFuund){
            datas = {
              id: this.model.id,
              closeExplain: this.closeExplain,
              isOpenMoney: '0'
            }
          }
          //停用
          postAction(that.url.edit, datas).then((res) => {
            if (res.code == 200) {
              that.$message.success(res.message)
              that.$emit('ok')//发送父级主键刷新
            } else {
              that.$message.success('修改失败')
            }
          })
        }
        if(this.visibleDelete){
          postAction(that.url.delete, {id: that.model.id,delExplain:this.closeExplain}).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok')//发送父级主键刷新
            } else {
              that.$message.warning(res.message);
            }
          });
        }
        if(this.visibleStopStatus)  this.visibleStopStatus = false ;
        if(this.visibleDelete)  this.visibleDelete = false ;
        if(this.visibleStopTitleFuund)  this.visibleStopTitleFuund = false ;
      },
      showModalStopStatus(record) {
        this.visibleStopStatus = true
        this.model = Object.assign({}, this.model, record)
      },
      showStartStatus(record){
        this.model = Object.assign({}, this.model, record)
        if (!this.url.edit) {
          this.$message.error('请设置url.edit属性!')
          return
        }
        let that = this
        this.$confirm({
          title: '启用后，符合规则的用户进入店铺将获得奖励',
          content: '您确定要启用吗？',
          onOk: function() {
            postAction(that.url.edit, { id: record.id,status: 1 ,closeExplain: "" }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                // that.loadData()
                // that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      },
      showDelete(record){
        this.visibleDelete = true
        this.model = Object.assign({}, this.model, record)
      },
      showStopTitleFund(record){
        this.visibleStopTitleFuund = true;
        this.model = Object.assign({}, this.model, record)
      },
      showStartTitleFund(record){
        this.model = Object.assign({}, this.model, record)
        if (!this.url.edit) {
          this.$message.error('请设置url.edit属性!')
          return
        }
        let that = this
        this.$confirm({
          title: '开启该称号资金后，该称号的资金将开始累计',
          content: '您确定要开启吗？',
          onOk: function() {
            postAction(that.url.edit, { id: record.id,isOpenMoney: 1 ,closeExplain: "" }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                // that.loadData()
                // that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>