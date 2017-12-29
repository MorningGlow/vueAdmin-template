<template>
  <div>
    <el-table :data="tableData" ref="multipleTable"
              tooltip-effect="dark"
              highlight-current-row
              @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="ID" width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.password |formatPsd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="185">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 5px">{{ scope.row.createdatetime |formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改日期" width="185">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 5px">{{ scope.row.modifydatetime |formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" type="danger" @click="handleAdd(scope.$index, scope.row)">增加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[7, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- Form -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="ruleForm2.age"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
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
      currentPage: 1,
      pageSize: 7,
      total: 10,
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      ruleForm2: {
        pass: '',
        checkPass: '',
        age: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        age: [
          { validator: checkAge, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.handleList(val, this.pageSize)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.handleList(val, this.pageSize)
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleAdd(index, row) {
      console.log(index, row)
    },
    handleList(currentPage, pageSize) {
      var _this = this
      console.log('currentPage:' + currentPage + 'pageSize:' + pageSize)
      if (currentPage === 0) {
        currentPage = 1
      }
      if (pageSize === 0) {
        pageSize = 10
      }
      request({
        url: 'http://10.30.90.45:9991/api/auth/userController/list',
        method: 'get',
        params: {
          page: currentPage,
          limit: pageSize
        }
      }).then(function(response) {
        console.log(response)
        _this.tableData = response.data
        _this.total = response.count
        console.log('tableData:' + _this.tableData)
      }).catch(function(error) {
        console.log(error)
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  filters: {
    formatDate: function(datetime) {
      var fmt = 'yyyy-MM-dd hh:mm:ss'
      if (datetime === '' || datetime === undefined) {
        return ''
      }
      if (parseInt(datetime) === datetime) {
        if (datetime.length === 10) {
          datetime = parseInt(datetime) * 1000
        } else if (datetime.length === 13) {
          datetime = parseInt(datetime)
        }
      }
      datetime = new Date(datetime)
      var o = {
        'M+': datetime.getMonth() + 1, // 月份
        'd+': datetime.getDate(), // 日
        'h+': datetime.getHours(), // 小时
        'm+': datetime.getMinutes(), // 分
        's+': datetime.getSeconds(), // 秒
        'q+': Math.floor((datetime.getMonth() + 3) / 3), // 季度
        'S': datetime.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },
    formatPsd: function(value) {
      return '******'
    }
  },
  beforeCreate: function() {
    // 组件实例化之前
    console.log('1===beforeCreate===')
  },
  created: function() { // 组件实例化了
    console.log('2===created===')
  },
  beforeMount: function() { // 组件写入dom结构之前
    console.log('3===beforeMount===')
  },
  mounted: function() {
    this.$nextTick(function() {
      // 代码保证 this.$el 在 document 中
      console.log('7===mounted===')
      var _this = this
      _this.handleList(_this.currentPage, _this.pageSize)
    })
  },
  beforeUpdate: function() { // 组件更新前
    console.log('5===beforeUpdate===')
  },
  updated: function() { // 组件更新比如修改了文案
    console.log('6===updated===')
  },
  beforeDestroy: function() { // 组件销毁之前
    console.log('7===beforeDestroy===')
  },
  destroyed: function() { // 组件已经销毁
    console.log('8===destroyed===')
  }
}
</script>

