<template>
  <div class="app-container">
    <el-row>
      <div style="margin-bottom: 20px">
        <el-button size="mini" v-if="isAdd" type="primary" @click="handleAdd()">增加</el-button>
      </div>
    </el-row>
    <el-row>
      <el-table :data="tableData" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
                style="width: 100%" ref="multipleTable"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="ID" width="170">
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
        <el-table-column label="url" width="170">
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
            <el-button size="mini" v-if="isEdit" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" v-if="isDelete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <!--<el-button size="mini" type="danger" @click="handleAdd(scope.$index, scope.row)">增加</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
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
    </el-row>

  </div>
</template>
<script>
import request from '@/utils/request'
import Edit from './resourceEdit'
import Add from './resourceAdd'
import store from '../../../store'
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 7,
      total: 10,
      tableData: [],
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      item: {},
      isAdd: false,
      isDelete: false,
      isEdit: false,
      listLoading: true
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
      _this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: 'http://10.30.90.45:9991/api/auth/resource/' + row.id,
          method: 'delete'
        }).then(function(response) {
          _this.$message({
            message: '删除成功,正在重新刷新页面1',
            type: 'success'
          })
          _this.handleCurrentChange(1)
        }).catch(function(error) {
          _this.$message({
            message: '删除失败!: ' + error,
            type: 'warning'
          })
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleAdd(index, row) {
      this.dialogFormVisible = true
    },
    handleClose() {
      this.dialogFormVisible = false
      this.dialogEditFormVisible = false
      var _this = this
      _this.handleList(_this.currentPage, _this.pageSize)
    },
    handleList(currentPage, pageSize) {
      var _this = this
      _this.listLoading = true
      store.getters.resources.forEach(resource => {
        console.log('44' + resource)
        console.log('roles' + resource)
        if (resource === 'resource/add') {
          _this.isAdd = true
        }
        if (resource === 'resource/edit') {
          _this.isEdit = true
        }
        if (resource === 'resource/delete') {
          _this.isDelete = true
        }
      })
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
        _this.tableData = response.data.rows
        _this.total = response.data.total
        _this.listLoading = false
      }).catch(function(error) {
        console.log(error)
        _this.listLoading = false
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

