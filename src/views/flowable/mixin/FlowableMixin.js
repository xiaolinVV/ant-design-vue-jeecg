import Vue from "vue";
import {USER_INFO} from "@/store/mutation-types";

/**
 *
 */

export const FlowableMixin = {
  data(){
    return {
      loginUser:{}
    }
  },
  created() {
    this.loginUser = Vue.ls.get(USER_INFO);
  },
  methods:{
    // 当前数据是否可提交
    isCanApply(row){
      // 没有流程实例的即可提交
      return !Boolean(row.processInstanceId);
    },
    // 当前数据是否可撤回
    isCanRecall(row){
      // 进行中的流程&&当前节点不是开始节点&&状态不是通过
      return Boolean(row.processInstanceId)&&row.taskNameId!=='start'&&row.actStatus!=='审批通过';
    },
    // 重新提交按钮
    isCanReApply(row){
      return row.taskNameId=='start'&&this.isTodoUsers(row);
    },
    // 通过按钮
    isCanPass(row){
      return row.taskNameId!=='start'&& this.isTodoUsers(row);
    },
    // 驳回退回按钮
    isCanBacke(row){
      // 不是start节点&&在可操作人员列表
      return row.taskNameId!=='start'&&this.isTodoUsers(row);
    },
    // 查看审批历史按钮
    isCanHistoric(row){
      // 有实例id就能查看
      return Boolean(row.processInstanceId);
    },
    // 当前登录人是否在处理人列表
    isTodoUsers(row){
      const todoUsers = row.todoUsers;
      if (todoUsers&&todoUsers.length){
        const parse = JSON.parse(todoUsers)||[];
        return parse.includes(this.loginUser.username);
      }else {
        return false;
      }
    },
    // 当前登录人是否是处理过的人列表
    isDoneUsers(row){
      const doneUsers = row.doneUsers;
      if (doneUsers&&doneUsers.length){
        const parse = JSON.parse(doneUsers)||[];
        return parse.includes(this.loginUser.username);
      }else {
        return false;
      }
    },
    // 判断表单是否可编辑、删除：
    // 1、草稿状态可编辑、删除
    // 2、被驳回且申请人是当前登录用户并且当前节点为申请人节点时，可编辑、删除
    isEditOrDelete(row){
      const proposer = row.proposer // 申请人
      const bpmStatus = row.bpmStatus
      const taskNameId = row.taskNameId // 当前节点id
      if (bpmStatus === '0') { //草稿状态：可编辑、可删除
        return true;
      }
      return bpmStatus === '3' && proposer === this.loginUser.username && taskNameId === "start";
    }
  }

}