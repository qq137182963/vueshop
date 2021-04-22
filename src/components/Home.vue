/* eslint-disable vue/valid-v-for */
<template>
  <div class="home">
      <el-container>
      <el-header>
          <div class="img"><img src="../assets/logo.png" alt=""><span>后台管理系统</span></div>
          <el-button type="info" @click="logout">退出</el-button></el-header>
      <el-container>
       <el-aside :width="iscollapse?'64px':'200px'">
            <div class="toggle-button" @click="toggleCollapse">|||</div>
           <el-menu
      background-color="rgb(50,55,68)"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
       :collapse="iscollapse"
       :collapse-transition="false"
       router
       :default-active="activePath">
      <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.id" class="item">
        <template slot="title">
          <i :class="iconslist[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
        @click="saveNavState('/'+subItem.path)">
            <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
        </el-submenu>
        </el-menu>
       </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
    data(){
        return{
            menulist:[],
            iconslist:{
                "125":"iconfont icon-yonghu",
                "103":"iconfont icon-quanxian",
                "101":"iconfont icon-ding_huabanfuben",
                "102":"iconfont icon-shangpin",
                "145":"iconfont icon-icon_huabanfuben"
            },
            iscollapse:false,
            activePath:''
        }
    },
    created(){
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem("activePath")
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login")
        },
        toggleCollapse(){
            this.iscollapse=!this.iscollapse
        },
        async getMenuList(){
            const {data:res}=await this.$http.get("menus");
            if(res.meta.status!==200) return this.$message.error(res.meta.msg);
            this.menulist=res.data
            console.log(res)
        },
        saveNavState(activePath){
            window.sessionStorage.setItem("activePath",activePath)
            this.activePath=activePath
        }
    }
}
</script>

<style lang="less" scope>
.home{
    height: 100%;
}
.el-container{
    height: 100%;
    .el-header{
        padding-left: 0;
        padding-right:10px;
        background-color: rgb(50,55,68);
        align-items: center;
    }
}
.el-aside{
    background-color: rgb(50,55,68);
    transition: .5s;
    .el-menu{
        border-right: none;
    }
}
.el-header{
    display: flex;
    justify-content: space-between;
}
.img{
    display: flex;
    justify-content: space-between;
    img{
    width: 60px;
    height: 100%;
    margin-right: 20px;
    }
    span{
    line-height: 60px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
}
}
.el-button{
    margin-top:10px ;
}
.iconfont{
    margin-right:10px ;
}
.toggle-button{
    background: rgb(73, 81, 100);
    text-align: center;
    color:#fff;
   letter-spacing: 0.2em;
   line-height: 30px;
   cursor: pointer;
}
</style>