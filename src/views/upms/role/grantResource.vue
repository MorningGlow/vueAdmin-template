<template>
  <div>
    <el-dialog title="授权" :visible="dialogGrantFormVisible">
        <ul id="treeDemo" class="ztree"></ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendNode()">取 消</el-button>
        <el-button type="primary" @click="submitForm('item')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import request from '@/utils/request'
import $ from 'jquery'
import ztree from 'ztree'
import request from '@/utils/request'
import Qs from 'qs'
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
          chkboxType: { 'Y': 's', 'N': 's' }
        },
        data: {
          simpleData: {
            enable: true,
            idkey: 'id',
            pIdKey: 'pid',
            rootPid: null
          }
        },
        edit: {
          enable: false
        }},
      zNodes: [
      ],
      zNodesByRole: [],
      resourceIds: '',
      id: ''
    }
  },
  props: ['item', 'dialogGrantFormVisible'],
  methods: {
    handleEdit(index, row) {
      this.dialogFormVisible = true
      console.log(index, row)
    },
    submitForm(formName) {
      // var _this = this /grant
      var treeObj = $.fn.zTree.getZTreeObj('treeDemo')
      var nodes = treeObj.getCheckedNodes(true)
      console.log('选中的 nodes: ' + nodes)
      console.log('listenToChildNodeEvent: ' + '传值至父组件')
      var _this = this
      if (nodes.length > 0) {
        _this.resourceIds = ''
        for (var i = 0; i < nodes.length; i++) {
          _this.resourceIds = _this.resourceIds + nodes[i].id + ','
        }
        request({
          url: 'http://10.30.90.45:9991/api/auth/roleController/grant',
          method: 'post',
          data: Qs.stringify({
            resourceIds: _this.resourceIds,
            id: _this.item.id
          })
        }).then(function(response) {
          _this.$message({
            message: '成功: ' + response,
            type: 'success'
          })
          _this.$emit('listenToChildNodeEvent', nodes)
        }).catch(function(error) {
          _this.$message({
            message: '警告:' + error,
            type: 'warning'
          })
        })
      } else {
        console.log('直接跑出')
      }
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
      var _this = this

      request({
        url: 'http://10.30.90.45:9991/api/auth/roleController/getOne',
        method: 'get',
        params: {
          id: _this.item.id
        }
      }).then(function(response) {
        _this.$message({
          message: '获取成功: ' + response,
          type: 'success'
        })
        console.log('response.data: ' + response.data)
        _this.zNodesByRole = response.data
      }).catch(function(error) {
        _this.$message({
          message: '警告:' + error,
          type: 'warning'
        })
        console.log(error)
      })
      request({
        url: 'http://10.30.90.45:9991/api/auth/resource/',
        method: 'get'
      }).then(function(response) {
        _this.zNodes = response.data.rows
        for (var i = 0; i < _this.zNodesByRole.length; i++) {
          for (var j = 0; j < _this.zNodes.length; j++) {
            if (_this.zNodesByRole[i].id === _this.zNodes[j].id) {
              _this.zNodes[j].checked = true
            }
          }
        }
        $.fn.zTree.init($('#treeDemo'), _this.setting, _this.zNodes)
      }).catch(function(error) {
        console.log(error)
      })
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

