<template>
  <el-card class="hotel">
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-form :inline="true" :model="formInline">
          <el-form-item>
            <el-select v-model="filterKey" placeholder="请选择筛选条件"  :size="size">
              <el-option
                v-for="item in fliterOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- :disabled="!filterKey" -->
            <el-input v-model="filterVal" placeholder="请输入筛选内容"  :size="size" :disabled="filterKey === ''"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getHotelList"  :size="size" :disabled="filterVal === ''">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="7">
        <el-button type="primary" @click="reset" :size="size">重置</el-button>
        <el-button type="primary" @click="add" :size="size">新增</el-button>
        <el-button type="danger" @click="multipleDel" :size="size">多选删除</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      height="300px"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            :size="size"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            :size="size"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="display: flex;justify-content: flex-end;margin:20px 0 10px;"
      :current-page.sync="currentPage"
      :page-sizes="pageSizeOptions"
      :page-size="pageSize"
      layout="sizes, prev, pager, next, total"
      :total="hotelListTotal"
      background
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
    >
    </el-pagination>
    <HotelModal ref="spotModal" @getHotelList="getHotelList"></HotelModal>
  </el-card>
</template>
<script>
  import moment from 'moment'
  import request from '../../api/index.js'
  import HotelModal from './component/HotelModal.vue'
  export default {
    // 组件名
    name: 'hotel',
    components: {
      'HotelModal': HotelModal
    },
    data() {
      return {
        size: 'small',
        formInline: {},
        filterKey: '',
        filterVal: '',
        fliterOption: [{
          label: '名称',
          value: 'name'
        }, {
          label: '地址',
          value: 'address'
        }],
        tableData: [],
        loading: true,
        multipleSelection: [],
        currentPage: 1,
        pageSizeOptions: [5, 10, 20, 30],
        pageSize: 5,
        hotelListTotal: 0
      }
    },
    methods: {
      changePageSize(val) {
        this.pageSize = val
        // 每页条数改变，重新调用获取景点方法
        this.getHotelList()
      },
      changeCurrentPage(val){
        this.currentPage = val
        // 页数改变，重新调用获取景点方法
        this.getHotelList()
      },
      getHotelList(){
        let that = this
        this.loading = true
        let params = {
          page: this.currentPage,
          size: this.pageSize
        }
        if(this.filterKey && this.filterVal) {
          params[this.filterKey] =  this.filterVal
        } 
        // 跟后端发起请求，得到所有景点信息，给this.tableData赋值，将loading取消。
        request.get('/hotel/list', {
          params: params
        }).then(function({ data: res }){
          if(res.code === 200) {
            that.tableData = res.data.map(function(item){
              item.created = moment(item.created).format('YYYY/MM/DD')
              return item
            })
            that.hotelListTotal = res.total
          }
          that.loading = false
        })
      },
      reset(){
        this.filterKey = ''
        this.filterValue = ''
        this.getHotelList()
      },
      add(){
        // 父组件直接修改子组件的值
        this.$refs.spotModal.ifShowModal = true
        this.$refs.spotModal.add()
      },
      // 多选
      handleSelectionChange(arr) {
        //  arr  被选中的那几行对象组成的数组
        this.multipleSelection = arr
      },
      // 多选删除的
      multipleDel(){
        let that = this
        /* 做多选删除: 得到被选中的这几条数据的id组成的ids
            将ids作为参数，传给后端。后端就会去数据库将ids里面的id对应的数据 删除。
        */
         // [{id:1,name: '***',address:'***'}, {id:4,name: '***',address:'***'}, {id:7,name: '***',address:'***'}]
        let ids = this.multipleSelection.map(function(item) {
          return item._id
        }).join(',')
        console.log(ids)
        request.delete('/hotel/delete', {
          params: {
            ids: ids
          }
        }).then(function({data: res}){
          if(res.code === 200) {
            that.getHotelList()
          }
        })
        //[1, 4, 7]  => '1,4,7' => ids传给后端
      },
      handleEdit(spotObj){
        this.$refs.spotModal.ifShowModal = true
        this.$refs.spotModal.edit(spotObj)
      },
      handleDelete(spotObj){
        /* 做单选删除: 
            将ids作为参数，传给后端。后端就会去数据库将ids对应的数据删除。
        */
        let that = this
        let ids = spotObj._id
        request.delete('/hotel/delete', {
          params: {
            ids: ids
          }
        }).then(function({data: res}){
          if(res.code === 200) {
            that.getHotelList()
          }
        })
      }
    },
    // 组件实例被创建前（此时this不可用，data、methods、computed都用不了）
    beforeCreate () {
      console.log('beforeCreate',this.size) 
    },
    // 组件实例创建后（如果要用到data、methods、computed...）
    created () {
      // 进入页面，先请求一次景点信息数据
      this.getHotelList()

      //ajax请求，还做一些初始化，实现函数自执行
      // console.log('created',this.size)
    },
    // 可以获取节点，但数据未渲染
    beforeMount(){},
    // 实例挂载到 DOM，可以进行节点操作。
    mounted(){
      // this.$refs.spotModal.add()
    }
  }
</script>
