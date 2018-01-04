<template>
  <div>
    <el-dialog title="授权" :visible="dialogGrantFormVisible">
        <ul id="treeDemo" class="ztree"></ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendClose()">取 消</el-button>
        <el-button type="primary" @click="submitForm('item')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import request from '@/utils/request'
import $ from 'jquery'
import ztree from 'ztree'
// import request from '@/utils/request'
// import Qs from 'qs'
import 'ztree/css/metroStyle/metroStyle.css'
export default {
  data() {
    return {
      setting: {
        view: {
          selectedMulti: false
        },
        check: {
          enable: true,
          chkboxType: { 'Y': 's', 'N': 'ps' }
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        edit: {
          enable: false
        }},
      zNodes: [
        { id: '1', pId: '', name: '[core] 基本功能 演示', open: true },
        { id: '123345555', pId: '1', name: '用户增加权限' },
        { id: '城标东奔西走要', pId: '1', name: '天地六合' },
        { id: '3', pId: '', name: '神一般的名字' },
        { id: '4', pId: '3', name: '不显示 节点 图标' },
        { id: 108, pId: 4, name: '异步加载 节点数据' },
        { id: 109, pId: 1, name: '用 zTree 方法 异步加载 节点数据' }
      ]
    }
  },
  props: ['dialogGrantFormVisible'],
  methods: {
    handleEdit(index, row) {
      this.dialogFormVisible = true
      console.log(index, row)
    },
    submitForm(formName) {
      // var _this = this
      var treeObj = $.fn.zTree.getZTreeObj('treeDemo')
      var nodes = treeObj.getCheckedNodes(true)
      console.log('选中的 nodes: ' + nodes)
      this.$emit('listenToChildNodeEvent', nodes)
      console.log('listenToChildNodeEvent: ' + '传值至父组件')
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    sendNode: function() {
      this.$emit('listenToChildNodeEvent')
      console.log('listenToChildNodeEvent: ' + '传值至父组件')
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // 代码保证 this.$el 在 document 中
      console.log('7===mounted grant resource===')
      console.log('dialogGrantFormVisible: ' + this.dialogGrantFormVisible)
      console.log('jquery之后: ' + this.dialogGrantFormVisible)
      $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes)
    })
  }
}
var a = ztree
console.log(a)
// $(document).ready(function() {
//   // $.fn.zTree.init($('#treeDemo'), setting, zNodes)
//   console.log('jquery 初使化')
// })
</script>

<style type="text/css">
</style>

