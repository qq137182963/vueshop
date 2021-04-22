<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        <tree-table :columns="columns" :data="catelist" show-header show-index index-text="#" show-row-hover border 
        :expand-type="false" :selection-type="false" class="tree-table">
        <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
            <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCateDialog(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
        </tree-table>
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed">
       <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
         <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
         <el-cascader
        :options="parentCateList"
        :props="cascaderProps"
        v-model="selectedKeys"
        @change="parentCateChanged"
        clearable>
        </el-cascader>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
     </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed">
       <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
         <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="父级分类：" >
        <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editCate(editCateForm.cat_id)">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
        queryInfo:{
            type:3,
            pagenum:1,
            pagesize:5
        },
        catelist:[],
        total:0,
        //添加分类对话框按钮
        addCateDialogVisible:false,
        // 添加分类的表单数据对象
        addCateForm:{
            cat_name:'',
            cat_pid:0,
            cat_level:0
        },
        //添加分类表单验证规则对象
        addCateFormRules:{
            cat_name:[
                {required:true,message:'请输入分类名称',trigger:'blur'}
            ]
        },
        //父级分类的列表
        parentCateList:[],
        //级联选择器
        cascaderProps:{
            expandTrigger: 'hover',
            value:'cat_id',
            label:'cat_name',
            children:'children'
        },
        // 选中的父级分类ID的数据:
        selectedKeys:[],
        columns:[
            {
                label:"分类名称",
                prop:"cat_name"
            },
            {
                label:"是否有效",
                type:"template",
                template:"isok"
            },
            {
                label:"排序",
                type:"template",
                template:"order"
            },
            {
                label:"操作",
                type:"template",
                template:"opt"
            }],
            //编辑按钮显示
            editCateDialogVisible:false,
            // 编辑数据列表
            editCateForm:{},
            editCateFormRules:{},
            //需要修改的分类的ID
            editId:''
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const {data:res}=await this.$http.get('categories',{
                params:this.queryInfo
            })
            if(res.meta.status!==200){
                return this.$message.error("获取商品列表失败!")
            }
            this.catelist=res.data.result
            this.total=res.data.total
        },
         handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize;
        this.getCateList()
        },
         handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getCateList()
        },
        showAddCateDialog(){
            this.getParentCateList()
            this.addCateDialogVisible=true;
        },
        // 获取父级分类的数据列表
        async getParentCateList(){
            const {data:res}=await this.$http.get('categories',{
                params:{type:2}
            })
            if(res.meta.status!==200){
                return this.$message.error("获取父级列表数据失败")
            }
            this.parentCateList=res.data;
        },
        parentCateChanged(){
            console.log(this.selectedKeys)
            if(this.selectedKeys.length>0){
                this.addCateForm.cat_pid=this.selectedKeys[
                    this.selectedKeys.length-1
                ]
                this.addCateForm.cat_level=this.selectedKeys.length
                return
            }else{
                this.addCateForm.cat_pid=0
                this.addCateForm.cat_level=0
            }
        },
         addCate(){
            this.$refs.addCateFormRef.validate(async valid=>{
                if(!valid) return 
                const {data:res}=await this.$http.post("categories",this.addCateForm)
             if(res.meta.status!==201){
                 return this.$message.error("添加分类失败")
             }
             this.$message.success("添加分类成功");
             this.getCateList()
             this.addCateDialogVisible=false;
            })
             
        },
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys=[]
            this.addCateForm.cat_pid=0
            this.addCateForm.cat_level=0
        },
         async deleteCate(id){
         const confirmResult= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', 
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
         ).catch(error=>error)
         if(confirmResult!=='confirm'){
           return this.$message.info("已取消删除")
        }
        
         const {data:res}=await this.$http.delete('categories/'+id);
         this.getCateList()
         return this.$message.success("删除成功");
         },
        //  编辑对话框数据清除
        editCateDialogClosed(){
            this.$refs.editCateFormRef.resetFields();
            this.editCateDialogVisible=false;
        },
        // 提交编辑对话框按钮
        async editCate(id){
            const {data:res}=await this.$http.put(`categories/${id}`,{
                cat_name:this.editCateForm.cat_name,
            });
            if(res.meta.status!==200){
                return this.$message.error("提交失败")
            }
            this.getCateList()
            this.editCateDialogVisible=false;
            return this.$message.success("提交成功")
        },
        editCateDialog(editCateForm){
            this.editCateForm=editCateForm;
            this.editCateDialogVisible=true;
        }
    }
}
</script>

<style>
    .tree-table{
        margin-top:15px ;
    }
    .el-cascader{
        width: 100%
    }
</style>