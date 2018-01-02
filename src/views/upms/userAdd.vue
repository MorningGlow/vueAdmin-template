<template>
  <div>
    <!-- Form -->
    <el-dialog title="添加用户" :visible="dialogFormVisible">
      <el-form :model="item" status-icon :rules="rules" ref="item" label-width="100px" class="demo-ruleForm">
        <el-form-item label="id" prop="id">
          <el-input :disabled="true" v-model="item.id"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="item.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="item.password"></el-input>
        </el-form-item>
        <el-form-item label="密码校验" prop="rePasd">
          <el-input type="password" v-model="item.rePasd"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleNames">
          <el-input v-model="item.roleNames"></el-input>
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
        username: '',
        password: '',
        rePasd: '',
        roleNames: ''
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
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        rePasd: [
          { validator: validatePass2, trigger: 'blur' }
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
          this.$emit('listenToChildEvent')
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

