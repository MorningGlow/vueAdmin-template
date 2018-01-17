<template>
  <div>
    <!-- Form -->
    <el-dialog title="编辑资源" :visible="dialogEditFormVisible">
      <el-row :gutter="5">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"><div >
          <el-form :model="item" status-icon :rules="rules" ref="item" label-width="100px" class="demo-ruleForm">
            <el-form-item label="id" prop="id">
              <el-input :disabled="false" v-model="item.id"></el-input>
            </el-form-item>
            <el-form-item label="资源" prop="name">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item label="父资源" prop="pid">
              <el-input v-model="item.pid"></el-input>
            </el-form-item>
            <el-form-item label="资源类型">
              <el-select v-model="item.typeId" placeholder="资源类型">
                <el-option label="资源" value="1"></el-option>
                <el-option label="菜单" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属系统">
              <el-select v-model="item.sysId" placeholder="所属系统">
                <el-option label="upms" value="1"></el-option>
                <el-option label="排程" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="url" prop="url">
              <el-input :disabled="false" v-model="item.url"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="remark">
              <el-input v-model="item.remark"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="margin-right: 10px;text-align: right">
            <el-button @click="sendClose()">取 消</el-button>
            <el-button type="primary" @click="submitForm('item')">确 定</el-button>
          </div>
        </div>
        </el-col>

        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"><div >
          <div style="margin-left: 5px">
            <el-button type="min" @click="load()">加载资源</el-button>
            <el-button type="min" @click="confirm()">确 认</el-button>
          </div>
          <div>
            <ul id="treeDemo" class="ztree"></ul>
          </div>
        </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
// import request from '@/utils/request'
import request from '@/utils/request'
import Qs from 'qs'
import $ from 'jquery'
import ztree from 'ztree'
import 'ztree/css/metroStyle/metroStyle.css'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogTableVisible: false,
      dialogVisible: false,
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ]
      },
      setting: {
        view: {
          selectedMulti: false
        },
        check: {
          enable: true,
          chkboxType: { 'Y': '', 'N': 's' }
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid'
          }
        },
        edit: {
          enable: false
        }},
      zNodes: [
      ]
    }
  },
  props: ['item', 'dialogEditFormVisible'],
  methods: {
    handleEdit(index, row) {
      // this.dialogEditFormVisible = true
      console.log(index, row)
    },
    submitForm(formName) {
      var _this = this
      console.log('item.name: ' + this.item.name)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(formName)
          alert('submit!')
          request({
            url: 'http://10.30.90.45:9991/api/auth/resource/',
            method: 'put',
            data: Qs.stringify({
              id: _this.item.id,
              name: _this.item.name,
              pname: _this.item.pname,
              remark: _this.item.remark,
              typeId: _this.item.typeId,
              sysId: _this.item.sysId,
              pid: _this.item.pid,
              url: _this.item.url
            })
          }).then(function(response) {
            console.log(response + '下面执行向父组件提交变化')
            _this.$emit('listenToChildEvent')
          }).catch(function(error) {
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    sendClose: function() {
      this.$emit('listenToChildEvent')
      console.log('listenToChildEvent:' + 'close')
    },
    confirm: function() {
      var treeObj = $.fn.zTree.getZTreeObj('treeDemo')
      var nodes = treeObj.getCheckedNodes(true)
      if (nodes.length === 1) {
        this.item.pid = nodes[0].id
      } else {
        this.$message({
          message: '只能有一个父级!,请重新确认!',
          type: 'warning'
        })
      }
    },
    load: function() {
      var _this = this
      request({
        url: 'http://10.30.90.45:9991/api/auth/resource/',
        method: 'get'
      }).then(function(response) {
        _this.zNodes = response.data.rows
        $.fn.zTree.init($('#treeDemo'), _this.setting, _this.zNodes)
      }).catch(function(error) {
        console.log(error)
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // 代码保证 this.$el 在 document 中
      console.log('7===mounted===')
      console.log('dialogEditFormVisible: ' + this.dialogEditFormVisible)
      console.log(ztree)
    })
  }
}
</script>

