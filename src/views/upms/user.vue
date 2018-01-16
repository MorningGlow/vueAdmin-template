<template>
  <div>
    <el-row>
      <div style="margin-left: 5px">
        <el-button size="mini" v-if="isAdd"  type="danger" @click="handleAdd()">增加</el-button>
      </div>
    </el-row>

    <el-row>
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
        <el-table-column label="密码" width="65">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.password |formatPsd }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.roleNames }}</span>
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
            <el-button size="mini" v-if="isEdit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" v-if="isDelete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <!--<el-button size="mini" type="danger" @click="handleAdd(scope.$index, scope.row)">增加</el-button>-->
            <el-button size="mini" type="danger" @click="handleGrant(scope.$index, scope.row)">授权</el-button>
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
      <edit :item="item" :dialogEditFormVisible="dialogEditFormVisible" v-if="dialogEditFormVisible" v-on:listenToChildEvent="handleClose"></edit>
      <add v-bind:dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" v-on:listenToChildEvent="handleClose"></add>
      <grant :item="item" v-bind:dialogGrantFormVisible="dialogGrantFormVisible" v-if="dialogGrantFormVisible" v-on:listenToChildNodeEvent="handleCloseGrant"></grant>
    </el-row>

  </div>
</template>
<script>
import request from '@/utils/request'
import userEdit from './userEdit'
import userAdd from './userAdd'
import grant from './grantRole'
import store from '../../store'
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 7,
      total: 10,
      tableData: [],
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      dialogGrantFormVisible: false,
      item: {},
      resources: store.getters.resources,
      isAdd: false,
      isDelete: false,
      isEdit: false
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
      this.dialogEditFormVisible = true
      console.log(index, row)
      this.item = row
      console.log('dialogEditFormVisible:' + this.dialogEditFormVisible)
    },
    handleDelete(index, row) {
      var _this = this
      request({
        url: 'http://10.30.90.45:9991/api/auth/userController/delete',
        method: 'delete',
        params: {
          id: row.id
        }
      }).then(function(response) {
        _this.$message({
          message: '删除成功: ' + response,
          type: 'success'
        })
        // _this.handleList(_this.currentPage, _this.pageSize)
        _this.handleCurrentChange(1)
      }).catch(function(error) {
        console.log(error)
        _this.$message({
          message: '警告:' + error,
          type: 'warning'
        })
      })
    },
    handleAdd(index, row) {
      console.log(index, row)
      this.dialogFormVisible = true
    },
    handleGrant(index, row) {
      this.dialogGrantFormVisible = true
      this.item = row
      console.log('dialogGrantFormVisible:' + this.dialogGrantFormVisible)
    },
    handleClose() {
      this.dialogFormVisible = false
      this.dialogEditFormVisible = false
      this.handleCurrentChange(1)
      console.log('close dialogFormVisible:' + this.dialogFormVisible)
    },
    handleCloseGrant(nodes) {
      var _this = this
      _this.dialogGrantFormVisible = false
      // _this.handleList(_this.currentPage, _this.pageSize)
      _this.handleCurrentChange(1)
      console.log('从子组件获得 qwq nodes: ' + nodes)
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
  components: {
    'edit': userEdit,
    'add': userAdd,
    'grant': grant
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
      // store.getters.resources.forEach(resource => {
      //   console.log('判断是33' + resource)
      // }).forEach(resource => {

      // })
      console.log('判断是33' + store.getters.resources)
      console.log('判断是33' + store.getters.resources.length)
      store.getters.resources.forEach(resource => {
        console.log('44' + resource)
        console.log('roles' + resource)
        if (resource === 'userController/add') {
          _this.isAdd = true
        }
        if (resource === 'userController/edit') {
          _this.isEdit = true
        }
        if (resource === 'userController/delete') {
          _this.isDelete = true
        }
      })
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

