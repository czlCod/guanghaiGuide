<template>
  <el-dialog :title="title" width="400px" :visible.sync="ifShowModal">
    <el-form ref="form" :model="form"  label-width="80px" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="ifShowModal = false">取 消</el-button>
      <el-button type="primary" @click="submit">提 交</el-button>
    </div>
  </el-dialog>

</template>
<script>
import request from '@/api/index.js'
export default {
  name: 'hotelModal',
  data() {
    return {
      title: '新增建筑',
      ifShowModal: false,
      form: {},
      weatherOptions: ['晴天', '阴天', '下雨天'],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 10, message: '长度最多10个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    add(){
      // 异步
      this.$nextTick(() => {
        this.$refs.form.clearValidate() // 取消上一次留下来的表单校验
      })
      this.form = {}
      this.title = '新增建筑'
    },
    edit(hotelObj) {
      // 异步
      this.$nextTick(() => {
        this.$refs.form.clearValidate() // 取消上一次留下来的表单校验
      })
      this.form = { ...hotelObj }
      this.title = '编辑建筑'
    },
    submit() {
      /* 
        新增编辑：校验表单数据。将表单数据对象作为参数，发送给后端。
        后端插入数据库后，响应给前端。前端就关闭弹窗
      */
      this.$refs.form.validate((valid) => {
        if (valid) {
          let _id = this.form._id
          request.post('/hotel/details', this.form)
          .then(({data: res}) => {
            if(res.code === 200) {
              this.$message.success(_id ? '编辑成功': '新增成功')
            } else {
              this.$message.error(_id ? '编辑失败': '新增失败')
            }
          })
          // 手动触发事件
          this.$emit('getHotelList')
          this.ifShowModal = false
        } else {
          this.$message.warning('请先填写好表单信息再提交！')
          return false;
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select{
  width: 100%;
}
</style>