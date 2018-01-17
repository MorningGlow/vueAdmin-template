<template>
  <div>

    <!-- Form -->
    <el-dialog title="添加资源" :visible="dialogFormVisible">
      <el-row :gutter="5">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"><div >
          <el-form :model="item" status-icon :rules="rules" ref="item" label-width="100px" class="demo-ruleForm">
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

        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <div >
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
import $ from 'jquery'
import ztree from 'ztree'
import 'ztree/css/metroStyle/metroStyle.css'
// import grant from '../role/grantResource'
import Qs from 'qs'
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.item.checkPass !== '') {
          this.$refs.item.validateField('rePasd')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.item.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      item: {
        id: '',
        name: '',
        pid: null,
        pname: '',
        remark: '',
        sysId: '',
        typeId: '',
        sysName: '',
        typeName: '',
        url: ''
      },
      dialogTableVisible: false,
      dialogVisible: false,
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        age: [
          { validator: checkAge, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        sysId: [
          { required: true, message: '请输入所属系统名称', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请输入资源类型名称', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
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
            idkey: 'id',
            pIdKey: 'pid',
            rootPid: null
          }
        },
        edit: {
          enable: false
        }},
      zNodes: [
      ]
    }
  },
  props: ['dialogFormVisible'],
  components: {
  },
  methods: {
    handleEdit(index, row) {
      this.dialogFormVisible = true
      console.log(index, row)
    },
    submitForm(formName) {
      var _this = this
      console.log('item.name: ' + this.item.name)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(formName)
          // alert('submit!')
          request({
            url: 'http://10.30.90.45:9991/api/auth/resource/',
            method: 'post',
            data: Qs.stringify({
              id: _this.item.id,
              name: _this.item.name,
              pname: _this.item.pname,
              remark: _this.item.remark,
              typeId: _this.item.typeId,
              sysId: _this.item.sysId,
              url: _this.item.url,
              pid: _this.item.pid
            })
          }).then(function(response) {
            console.log(response)
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
      console.log('dialogFormVisible: ' + this.dialogFormVisible)
      console.log(ztree)
    })
  }
}
</script>

