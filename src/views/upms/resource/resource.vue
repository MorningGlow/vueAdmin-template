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
      <el-table-column label="ID" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源名" width="120">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="父级资源" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.pname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="url" width="190">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源类型" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统名称" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.sysName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.remark }}</span>
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
    <edit :item="item" :dialogEditFormVisible="dialogEditFormVisible" v-if="dialogEditFormVisible" v-on:listenToChildEvent="handleClose"></edit>
    <add v-bind:dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" v-on:listenToChildEvent="handleClose"></add>
  </div>
</template>
<script>
import request from '@/utils/request'
// import $ from 'jquery'
// import ztree from 'ztree'
// import Qs from 'qs'
import Edit from './resourceEdit'
import Add from './resourceAdd'
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 7,
      total: 10,
      tableData: [],
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      item: {}
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
      console.log(index, row)
      var _this = this
      request({
        url: 'http://10.30.90.45:9991/api/auth/resource/' + row.id,
        method: 'delete'
      }).then(function(response) {
        console.log(response)
        _this.handleCurrentChange(1)
      }).catch(function(error) {
        console.log(error)
      })
    },
    handleAdd(index, row) {
      console.log(index, row)
      this.dialogFormVisible = true
    },
    handleClose() {
      this.dialogFormVisible = false
      this.dialogEditFormVisible = false
      console.log('close dialogFormVisible:' + this.dialogFormVisible)
      console.log('close dialogEditFormVisible:' + this.dialogEditFormVisible)
      var _this = this
      _this.handleList(_this.currentPage, _this.pageSize)
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
        url: 'http://10.30.90.45:9991/api/auth/resource/',
        method: 'get',
        params: {
          page: currentPage,
          limit: pageSize
        }
      }).then(function(response) {
        console.log(response)
        _this.tableData = response.data.rows
        _this.total = response.data.total
        console.log('tableData:' + _this.tableData.toString())
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
    'edit': Edit,
    'add': Add
  },
  mounted: function() {
    this.$nextTick(function() {
      // 代码保证 this.$el 在 document 中
      console.log('7===mounted===')
      var _this = this
      _this.handleList(_this.currentPage, _this.pageSize)
    })
  }
}
</script>

