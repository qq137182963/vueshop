<template>
  <div>
      <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-alert
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false">
       </el-alert>
       <el-row class="cat_opt">
            <el-col>
                <span>选择商品分类 : </span>
                <el-cascader
            :options="catelist"
            expand-trigger="hover"
            :props="cateProps"
             v-model="selectedCateKeys"
             @change="handleChange"
             clearable>
            </el-cascader>
            </el-col>
        </el-row>
        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
         <el-tab-pane label="动态参数" name="many">
             <el-button type="primary" :disabled="isBtnDisabled" @click="addParamsDialogVisible=true">添加参数</el-button>
             <el-table :data="manyTabData" border stripe>
                 <el-table-column type="expand">
                     <template slot-scope="scope">
                         <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable
                         @close="handleClose(index,scope.row)">{{item}}</el-tag>
                         <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                     </template>
                 </el-table-column>
                 <el-table-column type="index"></el-table-column>
                 <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                 <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)" >编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                    </template>
                 </el-table-column>
             </el-table>
             </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="isBtnDisabled" @click="addParamsDialogVisible=true">添加属性</el-button>
            <el-table :data="onlyTabData" border stripe>
                 <el-table-column type="expand">
                     <template slot-scope="scope">
                         <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable
                         @close="handleClose(index,scope.row)">{{item}}</el-tag>
                         <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                     </template>
                 </el-table-column>
                 <el-table-column type="index"></el-table-column>
                 <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                 <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                    </template>
                 </el-table-column>
             </el-table>
        </el-tab-pane>
        </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
     <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsDialogClosed">
       <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px">
        <el-form-item label="参数名称：" prop="attr_name">
         <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addParamsDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addParams(addParamsForm.cat_id)">确 定</el-button>
     </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'编辑'+titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      @close="editParamsDialogClosed">
       <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsFormRef" label-width="100px">
        <el-form-item label="参数名称：" prop="attr_name">
         <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editParams(editParamsForm.cat_id)">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            // 分类列表数据
            catelist:[],
            //级联选择器对象
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 级联选择器双向保存到的数组
            selectedCateKeys:[],
            activeName:'many',
            manyTabData:[],
            onlyTabData:[],
            // 添加参数相关数据
            addParamsFormRules:{
                attr_name:[
                    {required:true,message:'请输入参数名称',trigger:'blur'}
                ]
            },
            addParamsForm:{
                attr_name:''
            },
            addParamsDialogVisible:false,
            // 编辑按钮显示
            editParamsDialogVisible:false,
            //编辑数据列表
            editParamsForm:{
                attr_name:[
                    {required:true,message:"请输入参数名称",trigger:'blur'}
                ]
            },
            //编辑列表数据约束
            editParamsFormRules:{},
        }
    },
    created(){
        this.getCateList();
    },
    computed:{
        isBtnDisabled(){
            if(this.selectedCateKeys.length!==3){
                return true
            }
            return false
        },
        cateId(){
            if(this.selectedCateKeys.length!==3){
                return 
            }
            return this.selectedCateKeys[2]
        },
        titleText(){
            if(this.activeName==='many'){
                return '动态参数'
            }
            return '静态属性'
        }
    },
    methods:{
        async getCateList(){
            const {data:res}=await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error("级联列表数据获取失败");
            }
            this.catelist=res.data;
        },
        //级联选择器选中的值改变后会触发这个函数
        async handleChange(){
            if(this.selectedCateKeys.length!==3){
                this.selectedCateKeys=[];
                this.manyTabData=[]
                this.onlyTabData=[]
                return 
            }
            this.getParamsList()
        },
        handleTabClick(){
            this.getParamsList()
        },
        async getParamsList(){
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{sel:this.activeName}
            })
            if(res.meta.status!==200){
                return this.$message.error("获取参数列表失败")
            }
            res.data.forEach(item=>{
                item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
                item.inputVisible=false;
                item.inputValue="";
            })
            console.log(res.data)
            if(this.activeName==='many'){
                this.manyTabData=res.data
            }
            this.onlyTabData=res.data
        },
        // 添加参数提交
         addParams(){
            this.$refs.addParamsFormRef.validate(async vaild=>{
                if(!vaild) return 
                const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{
                attr_name:this.addParamsForm.attr_name,
                attr_sel:this.activeName
            })
            if(res.meta.status!==201){
                return this.$message.error('添加参数失败')
            }
            this.addParamsDialogVisible=false;
            this.getParamsList()
            return this.$message.success('添加参数成功')
            })
        },
        // 关闭添加参数对话框清除数据
        addParamsDialogClosed(){
            this.$refs.addParamsFormRef.resetFields();
            this.addParamsDialogVisible=false;
        },
        // 显示编辑页面
        async showEditDialog(attr_id){
            const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
                attr_sel:this.activeName
            })
            if(res.meta.status!==200){
                return this.$message.error("获取编辑页面失败")
            }
            this.editParamsForm=res.data;
            this.editParamsDialogVisible=true;
        },
        // 编辑参数提交
        editParams(){
            this.$refs.editParamsFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,{
                    attr_name:this.editParamsForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status!==200){
                    return this.$message.error("修改失败")
                }
                this.getParamsList()
                this.editParamsDialogVisible=false;
                return this.$message.success("修改成功")
            })
        },
        editParamsDialogClosed(){
            this.$refs.editParamsFormRef.resetFields()
            this.editParamsDialogVisible=false;
        },
        //删除参数
        async deleteParams(attr_id){
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
             }).catch(error=>error)
             if(confirmResult!=='confirm'){
             return this.$message.info('取消了删除！')
            }
            const {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if(res.meta.status!==200){
                return this.$message.error("删除失败")
            }
            this.getParamsList()
            return this.$message.success("删除成功")
        },
        handleInputConfirm(row){
            if(row.inputValue.trim().length===0){
                this.inputValue=""
                this.inputVisible=false;
                return 
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue=""
            row.inputVisible=false
            this.saveAttrVals(row)
        },
        async saveAttrVals(row){
            const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(" ")
            })
            if(res.meta.status!==200){
                return this.$message.error("操作失败")
            }
            return this.$message.success("操作成功")
        },
        showInput(row){
            row.inputVisible=true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
        });
        },
        handleClose(index,row){
            row.attr_vals.splice(index,1);
            this.saveAttrVals(row)
        }
    }
}
</script>

<style lang="less" scope>
    .cat_opt{
        margin:15px 0;
    }
    .el-tag{
        margin-right:10px;
    }
    .input-new-tag{
        width: 120px;
    }
</style>