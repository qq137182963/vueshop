<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片搜索区域 -->
    <el-card  class="box-card">
      <el-row :gutter="20">
     <el-col :span="12"> <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable
     @clear="getUserList">
     <el-button slot="append" icon="el-icon-search"  @click="getUserList"></el-button></el-input></el-col>
     <el-col :span="2"> <el-button type="primary" @click="addUserDialog=true" style="margin-top:0">添加用户</el-button></el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
    <el-table-column type="index"></el-table-column>
    <el-table-column prop="username" label="姓名"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column prop="role_name" label="角色"></el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180px">
      <template slot-scope="scope">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
      <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
          <el-button type="warning" icon="el-icon-share" size="mini"
          @click="setRole(scope.row)"></el-button>
      </el-tooltip>
       </template>
    </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
  title="用户信息"
  :visible.sync="addUserDialog" @close="addDialogClosed" width="50%">
<el-form :model="addForm" :rules="addUserRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addUserDialog = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="user">
         <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
         <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
         <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
     </span>
    </el-dialog>
     <!-- 分配角色对话框 -->
    <el-dialog
      title="角色信息"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed">
       <div>
           <p>当前的用户 : {{userInfo.username}}</p>
           <p>当前的角色 : {{userInfo.role_name}}</p>
           <p>分配的新角色 :
              <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
               v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
              </el-option>
               </el-select>
           </p>
       </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
      var checkEmail=(rule, value, cb) => {
        const regEmail= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error("请输入合法的邮箱"))
      }
      var checkMobile=(rule,value,cb)=>{
        const regMobile=/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)){
          return cb()
        }
        cb(new Error("请输入合法的手机号"))
      }
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      userlist:[
        // {
        //         "id": 25,
        //         "username": "tige117",
        //         "mobile": "18616358651",
        //         "type": 1,
        //         "email": "tige112@163.com",
        //         "create_time": "2017-11-09T20:36:26.000Z",
        //         "mg_state": true, // 当前用户的状态
        //         "role_name": "炒鸡管理员"
        //     }
            ],
      total:0,
      addUserDialog:false,
      addForm:{
        usename:'',
        password:'',
        email:'',
        mobile:''
      },
      addUserRules:{
        username:[
           {required: true, message: '请输入用户名', trigger: 'blur'},
           { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
           {required: true, message: '请输入密码', trigger: 'blur'},
           { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
        ],
        email:[
           {required: true, message: '请输入邮箱', trigger: 'blur'},
           {validator:checkEmail,trigger:"blur"}
        ],
        mobile:[
           {required: true, message: '请输入手机', trigger: 'blur'},
           {validator:checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible:false,
      editForm:{},
      editFormRules:{
         email:[
           {required: true, message: '请输入邮箱', trigger: 'blur'},
           {validator:checkEmail,trigger:"blur"}
        ],
         mobile:[
           {required: true, message: '请输入手机', trigger: 'blur'},
           {validator:checkMobile, trigger: 'blur' }
        ]
      },
      // 显示角色分配对话框
      setRoleDialogVisible:false,
      //需要被分配的角色用户信息
      userInfo:{},
      //所有角色的数据列表
      rolesList:[],
      selectedRoleId:''
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
    const { data:res }= await this.$http.get('users',{
      params:this.queryInfo
      })
      if(res.meta.status!==200){
        return this.$message.error("获取用户列表失败");
      }
      this.userlist=res.data.users;
      this.total=res.data.total;
      console.log(res);
    },
    handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize;
        this.getUserList()
    },
    handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getUserList()
    },
    async userStateChange(userinfo){
      const  {data:res}=await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if(res.meta.status!==200){
        userinfo.mg_state=!userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.post('users',this.addForm)
        if(res.meta.status!==201){
          return this.$message.error(res.meta.msg);
        }
        this.getUserList()
        this.$message.success(res.meta.msg);
        this.addUserDialog=false;
      })
    },
    async showEditDialog(id){
      const {data:res}=await this.$http.get('users/'+id);
      if(res.meta.status!==200){
        return this.$message.error(res.meta.msg);
      }
      this.editForm=res.data;
      this.editDialogVisible=true;
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.put('users/'+this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        if(res.meta.status!==200){
          return this.$message.error(res.meta.msg);
        }
        this.editDialogVisible=false;
        this.getUserList()
        this.$message.success(res.meta.msg);
      })
    },
    async removeUserById(id){
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
    const {data:res}=await this.$http.delete('users/'+id);
    this.getUserList()
    return this.$message.success(res.meta.msg);
  },
  //展示分配角色对话框
  async setRole(userInfo){
    this.userInfo=userInfo
    const {data:res}=await this.$http.get('roles')
    if(res.meta.status!==200){
      return this.$message.error('获取角色列表失败')
    }
    this.rolesList=res.data;
    this.setRoleDialogVisible=true
  },
  //点击按钮分配角色
  async saveRoleInfo(){
    if(!this.selectedRoleId){
      return this.$message.error("请选择要分配的角色！")
    }
    const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,
    {
      rid:this.selectedRoleId
    })
    if(res.meta.status!==200){
      return this.$message.error("分配角色失败！")
    }
    this.getUserList()
    this.setRoleDialogVisible=false;
    return this.$message.success("分配角色成功！")
  },
  setRoleDialogClosed(){
    this.selectedRoleId=''
    this.userinfo={}
  }
  }
}
</script>

<style lang="less" scope>

</style>
