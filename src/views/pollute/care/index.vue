<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <el-row :gutter="10">
        <el-col :span="4.5">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px" class="filter-item" placeholder="名称"
                    v-model="listQuery.name">
          </el-input>
        </el-col>
        <el-col :span="8.5">
          <div>
            <!--<span class="demonstration">带快捷选项</span>-->
            <el-date-picker
              v-model="value4"
              type="datetimerange"
              :picker-options="pickerOptions2"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="left">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" v-if="careManager_btn_add" style="margin-left: 10px" @click="handleCreate"
                     type="primary" icon="edit">添加
          </el-button>
          <el-button class="filter-item" v-if="careManager_btn_add" style="margin-left: 10px" @click="handleTest"
                     type="primary" icon="edit">测试
          </el-button>
        </el-col>
      </el-row>


    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="ID" min-width="290">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createdatetime}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.modifydatetime}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="维护类型ID">
        <template slot-scope="scope">
          <span>{{scope.row.caretypeId}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="careManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="careManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[5,10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="维护类型ID" prop="caretypeId">
          <el-input v-model="form.caretypeId" style="display: none" placeholder="请输入维护类型ID"></el-input>
          <el-autocomplete
            v-model="state4"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from '../../../api/pollute/care/index'
  import {
    pageCareType
  } from '../../../api/pollute/caretype/index'
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'care',
    data() {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        value4: '',
        restaurants: [],
        list2: null,
        state4: '',
        timeout: null,
        form: {
          name: undefined,
          createdatetime: undefined,
          modifydatetime: undefined,
          remark: undefined,
          caretypeId: undefined
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], createdatetime: [
            {
              required: true,
              message: '请输入创建时间',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], modifydatetime: [
            {
              required: true,
              message: '请输入修改时间',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], remark: [
            {
              required: true,
              message: '请输入描述',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ], caretypeId: [
            {
              required: true,
              message: '请输入维护类型ID',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 36,
              message: '长度在 1 到 36 个字符',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 5,
          name: undefined,
          createdatetimeStart: undefined,
          createdatetimeEnd: undefined
        },
        queryParam: {
          page: 1,
          limit: 50
        },
        dialogFormVisible: false,
        dialogStatus: '',
        careManager_btn_edit: false,
        careManager_btn_del: false,
        careManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    watch: {
      // 如果 `value4` 发生改变，这个函数就会运行
      value4: function(newValue, oldvalue) {
        this.listQuery.createdatetimeStart = newValue.toString().split(',')[0]
        this.listQuery.createdatetimeEnd = newValue.toString().split(',')[1]
        // alert(newValue.toString().split(',')[0])
      }
    },
    created() {
      this.getList()
      this.careManager_btn_edit = true
      this.careManager_btn_del = true
      this.careManager_btn_add = true
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      getList() {
        this.listLoading = true
        page(this.listQuery)
          .then(response => {
            this.list = response.data.rows
            this.total = response.data.total
            this.listLoading = false
          })
      },
      handleFilter() {
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleTest() {
        alert(this.value4)
      },
      handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.form = response.data
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
          })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
            this.total = this.total - 1
          })
        })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(() => {
                this.dialogFormVisible = false
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              })
          } else {
            return false
          }
        })
      },
      cancel(formName) {
        this.dialogFormVisible = false
        const set = this.$refs
        set[formName].resetFields()
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.password = undefined
            putObj(this.form.id, this.form).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 3000 * Math.random())
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect(item) {
        console.log(item['id'])
        this.form.caretypeId = item['id']
      },
      loadAll() {
        var _this = this
        pageCareType(this.queryParam)
          .then(response => {
            _this.restaurants = response.data.rows
            console.log('_this.restaurants' + _this.restaurants)
            for (var i = 0; i < _this.restaurants.length; i++) {
              _this.restaurants[i].value = _this.restaurants[i].name
            }
          })
        // return [
        //   { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' },
        //   { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号' },
        //   { 'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113' },
        //   { 'value': '泷千家(天山西路店)', 'address': '天山西路438号' },
        //   { 'value': '胖仙女纸杯蛋糕（上海凌空店）', 'address': '上海市长宁区金钟路968号1幢18号楼一层商铺18-101' },
        //   { 'value': '贡茶', 'address': '上海市长宁区金钟路633号' },
        //   { 'value': '豪大大香鸡排超级奶爸', 'address': '上海市嘉定区曹安公路曹安路1685号' },
        //   { 'value': '茶芝兰（奶茶，手抓饼）', 'address': '上海市普陀区同普路1435号' },
        //   { 'value': '十二泷町', 'address': '上海市北翟路1444弄81号B幢-107' },
        //   { 'value': '星移浓缩咖啡', 'address': '上海市嘉定区新郁路817号' },
        //   { 'value': '阿姨奶茶/豪大大', 'address': '嘉定区曹安路1611号' },
        //   { 'value': '新麦甜四季甜品炸鸡', 'address': '嘉定区曹安公路2383弄55号' },
        //   { 'value': 'Monica摩托主题咖啡店', 'address': '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F' },
        //   { 'value': '浮生若茶（凌空soho店）', 'address': '上海长宁区金钟路968号9号楼地下一层' },
        //   { 'value': 'NONO JUICE  鲜榨果汁', 'address': '上海市长宁区天山西路119号' },
        //   { 'value': 'CoCo都可(北新泾店）', 'address': '上海市长宁区仙霞西路' },
        //   { 'value': '快乐柠檬（神州智慧店）', 'address': '上海市长宁区天山西路567号1层R117号店铺' },
        //   { 'value': 'Merci Paul cafe', 'address': '上海市普陀区光复西路丹巴路28弄6号楼819' },
        //   { 'value': '猫山王（西郊百联店）', 'address': '上海市长宁区仙霞西路88号第一层G05-F01-1-306' },
        //   { 'value': '枪会山', 'address': '上海市普陀区棕榈路' }
        // ]
      },
      resetTemp() {
        this.form = {
          username: undefined,
          name: undefined,
          sex: '男',
          password: undefined,
          description: undefined
        }
      }
    },
    mounted() {
      this.loadAll()
      // this.restaurants.forEach((value, index, array) => {
      //   this.restaurants[index]['value'] = value['name']
      // })
    }
  }
</script>
<style type="text/css">
  .el-table td, .el-table th {
    padding: 4px 0;
  }
</style>
