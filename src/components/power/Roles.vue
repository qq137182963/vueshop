<template>
  <div>
      <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card  class="box-card">
       <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
       <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row v-for="(item1,i1) in scope.row.children" :key="i1" :class="['bb',i1===0?'bt':'','vercenter']">
                    <!-- 渲染一级权限 -->
                    <el-col :span="5">
                        <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染二三级权限 -->
                    <el-col :span="19">
                        <el-row v-for="(item2,i2) in item1.children" :key="i2" :class="[i2===0?'':'bt','vercenter']">
                            <el-col :span="5">
                                <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-tag type="warning" closable v-for="(item3,i3) in item2.children" 
                                :key="i3" @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editRoleDialogVisible=true">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-share" @click="showSetRightDialog(scope.row)">分配权限</el-button>
        </template>
        </el-table-column>   
    </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="角色信息"
      :visible.sync="addRoleDialogVisible"
      width="50%"
       @close="addRoleFormClose">
        <el-form :model="addRoleForm" ref="addRoleFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
         <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
         <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
     </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="角色信息"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editDialogClosed">
        <el-form :model="editRoleForm" ref="editRoleFormRef" label-width="70px">
        <el-form-item label="id" prop="roleId">
         <el-input v-model="editRoleForm.roleId"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
         <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
         <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
     </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="权限信息"
      :visible.sync="setRightDialogVisible"
      width="50%">
        <el-tree :props="treeProps" show-checkbox :data="rightslist" ref="treeRef"
        node-key="id" default-expand-all
        :default-checked-keys="defKeys">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            rolelist:[],
            addRoleForm:{},
            addRoleDialogVisible:false,
            editRoleDialogVisible:false,
            editRoleForm:{},
            setRightDialogVisible:false,
            treeProps:{
                label:'authName',
                children:'children'
            },
            rightslist:[],
            defKeys:[],
            roleId:'',
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status!==200){
            return this.$message.error(res.meta.msg)
        }
        this.rolelist=res.data;
        },
        async removeRightById(role,rightId){
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(error=>error)
        if(confirmResult!=='confirm'){
            return this.$message.info('取消了删除！')
        }
        const {data:res}= await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200){
            return this.$message.error(res.meta.msg);
        }
        role.children=res.data;
        },
        async addRole(){
        const {data:res}=await this.$http.post('roles',this.addRoleForm)
        if(res.meta.status!==201){
          return this.$message.error(res.meta.msg);
        }
        this.getRolesList()
        this.$message.success(res.meta.msg);
        this.addRoleDialogVisible=false;
        },
        addRoleFormClose(){
            this.$refs.addRoleFormRef.resetFields()
            this.addRoleDialogVisible=false;
        },
        // 编辑角色
        async editRole(){
          const {data:res}=await this.$http.put(`roles/${this.editRoleForm.id}`,{
          roleId:this.editRoleForm.roleId,
          roleName:this.editRoleForm.roleName,
          roleDesc:this.editRoleForm.roleDesc
        })
        console.log(res);
        if(res.meta.status!==200){
          return this.$message.error(res.meta.msg);
        }
        this.editRoleDialogVisible=false;
        this.getRolesList()
        this.$message.success(res.meta.msg);
        },
        editDialogClosed(){
             this.$refs.editRoleFormRef.resetFields()
             this.editRoleDialogVisible = false
        },
        // 删除角色
        async removeRoleById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(error=>error)
        if(confirmResult!=='confirm'){
            return this.$message.info('取消了删除！')
        }
        const {data:res}= await this.$http.delete(`roles/${id}`)
        if(res.meta.status!==200){
            return this.$message.error(res.meta.msg);
        }
        this.getRolesList()
        },
        async showSetRightDialog(role){
            this.roleId=role.id
            const {data:res}=await this.$http.get('rights/tree');
            if(res.meta.status!==200){
                return this.$message.error(res.meta.msg)
            }
            this.rightslist=res.data;
            this.defKeys=[]
            this.getLeafKeys(role,this.defKeys);
            this.setRightDialogVisible=true
        },
        getLeafKeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>
            this.getLeafKeys(item,arr))
        },
        async allotRights(){
            const keys=[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr=keys.join(',')
            const {data:res}=await this.$http.post(
                `roles/${this.roleId}/rights`,{rids:idStr}
            )
            if(res.meta.status!==200){
                return this.$message.error("分配权限失败") 
            }
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.setRightDialogVisible=false
        },
    }
}
</script>

<style lang="less" scope>
    .el-tag{
        margin-top:15px;
    }
    .bt{
        border-top: 1px solid #eee;
    }
    .bb{
        border-bottom: 1px solid #eee;
    }
    .vercenter{
        display: flex;
        align-items: center;
    }
</style>