<template>
  <div>
    <!-- Form -->
    <el-dialog title="添加角色" :visible="dialogFormVisible">
      <el-form :model="item" status-icon :rules="rules" ref="item" label-width="100px" class="demo-ruleForm">
        <!--<el-form-item label="id" prop="id">-->
          <!--<el-input :disabled="false" v-model="item.id"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="角色" prop="name">
          <el-input v-model="item.name"></el-input>
        </el-form-item>
        <el-form-item label="父角色" prop="pname">
          <el-input v-model="item.pname"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="item.alias"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendClose()">取 消</el-button>
        <el-button type="primary" @click="submitForm('item')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import request from '@/utils/request'
import request from '@/utils/request'
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
        pname: '',
        alias: ''
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
        ]
      }
    }
  },
  props: ['dialogFormVisible'],
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
          alert('submit!')
          request({
            url: 'http://10.30.90.45:9991/api/auth/roleController/add',
            method: 'post',
            data: Qs.stringify({
              id: _this.item.id,
              name: _this.item.name,
              alias: _this.item.alias
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
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // 代码保证 this.$el 在 document 中
      console.log('7===mounted===')
      console.log('dialogFormVisible: ' + this.dialogFormVisible)
    })
  }
}
</script>

