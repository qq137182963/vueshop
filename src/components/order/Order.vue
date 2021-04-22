<template>
  <div>
        <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <!-- 搜索框 -->
        <el-row :gutter="20">
        <el-col :span="8">
        <el-input placeholder="请输入内容"
        clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        </el-col>
        </el-row>
        <el-table border stripe :data="orderList">
             <el-table-column type="index"></el-table-column>
            <el-table-column  prop="order_number" label="订单编号"></el-table-column>
            <el-table-column  prop="order_price" label="订单价格" width="95px"></el-table-column>
            <el-table-column  prop="order_pay" label="是否付款" width="95px">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.order_pay===1">已付款</el-tag>
                     <el-tag type="danger" v-else>未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column  prop="is_send" label="是否发货" width="80px">
            </el-table-column>
            <el-table-column  prop="create_time" label="下单时间" width="180px">
                <template slot-scope="scope">
                {{scope.row.create_time | dateFormat}}
                </template>
            </el-table-column>
            <el-table-column  label="操作" width="160px">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                <el-button type="success" icon="el-icon-share" size="mini" @click="showProgressBox"></el-button>
            </el-table-column>
        </el-table>
        <!-- 分页功能 -->
          <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
         :page-sizes="[5, 10, 15, 30]"
         :page-size="queryInfo.pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total"
         background>
        </el-pagination>
        <!-- 添加地址对话框 -->
        <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressClosed">
       <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县：" prop="address1">
         <el-input v-model="addressForm.address1"></el-input>
        </el-form-item>
        <el-form-item label="详细地址："  prop="address2">
        <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible=false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
     </span>
    </el-dialog>
    <!-- 查看物流对话框 -->
     <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
       <h4>正在开发中</h4>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            orderList:[],
            total:0,
            // 修改地址对话框显示
            addressVisible:false,
            addressForm:{
                address1:'',
                address2:''
            },
            addressFormRules:{
                address1:[{
                    required:true,message:'请输入省市',trigger:'blur'
                }],
                address2:[{
                    required:true,message:'请填写详细地址',trigger:'blur'
                }]
            },
            // 显示物流对话框
            progressVisible:false,
            progressInfo:[]
        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        async getOrderList(){
            const {data:res}=await this.$http.get('orders',{
                params:this.queryInfo
            })
            if(res.meta.status!==200){
                return this.$message.error("获取订单列表失败")
            }
            this.orderList=res.data.goods
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getOrderList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage;
            this.getOrderList()
        },
        showBox(){
            this.addressVisible=true;
        },
        addressClosed(){
            this.$refs.addressFormRef.resetFields()
        },
        async showProgressBox(){
            // const {data:res}=await this.$http.get('/kuaidi/804909574412544580')
            // if(res.meta.status!==200){
            //     return this.$message.error('获取物流进度失败！')
            // }
            // this.progressInfo=res.data
            // console.log(this.progressInfo)
            this.progressVisible=true
        },
    }
}
</script>

<style>

</style>