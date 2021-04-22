<template>
  <div>     
      <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon
    :closable="false">
    </el-alert>
    <el-steps :active="+activeIndex" finish-status="success" align-center>
    <el-step title="基本信息"></el-step>
    <el-step title="商品参数"></el-step>
    <el-step title="商品属性"></el-step>
    <el-step title="商品图片"></el-step>
    <el-step title="商品内容"></el-step>
    <el-step title="完成"></el-step>
    </el-steps>
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
    <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave"
    @tab-click="tabClicked">
    <el-tab-pane label="基本信息" name="0">
        <el-form-item prop="goods_name" label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item prop="goods_price" label="商品价格">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="goods_weight" label="商品重量">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="goods_number" label="商品数量">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="goods_cat" label="商品分类">
         <el-cascader
        v-model="addForm.goods_cat"
        :options="catelist"
        expandTrigger='hover'
        :props="cateProps"
        @change="handleChange">
        </el-cascader>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
         <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
             <!-- 复选框 -->
            <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
        <el-upload
        class="upload-demo"
        :action="uploadURL"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        list-type="picture"
        :headers="headerObj"
        :on-success="handleSuccess">
        <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type="primary" @click="add">添加商品</el-button>
    </el-tab-pane>
    </el-tabs>
    </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash';
export default {
    data(){
        return {
            activeIndex:0,
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_cat:[],
                pics:[],
                goods_introduce:"",
                attrs:[]
            },
            addFormRules:{
                goods_name:[
                    {requird:true,message:"请输入商品名称",trigger:'blur'}
                ],
                goods_price:[
                    {requird:true,message:"请输入商品价格",trigger:'blur'}
                ],
                goods_weight:[
                    {requird:true,message:"请输入商品重量",trigger:'blur'}
                ],
                goods_number:[
                    {requird:true,message:"请输入商品数量",trigger:'blur'}
                ],
            },
            catelist:[],
            cateProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            // 动态参数列表
            manyTableData:[],
            //静态属性列表
            onlyTableData:[],
            //上传图片的URL地址
            uploadURL:'http://www.ysqorz.top:8888/api/private/v1/upload',
            // 图片上传组件的headers请求头对象
            headerObj:{
            Authorization:window.sessionStorage.getItem('token')
            },
            previewPath:'',
            // 图片预览显示
            previewVisible:false
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const {data:res}=await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error("获取数据失败")
            }
            this.catelist=res.data
        },
        handleChange(){
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat=[]
            }
        },
        beforeTabLeave(activeName,oldActiveName){
            if(oldActiveName==='0'&&this.addForm.goods_cat.length!==3){
                this.$message.error("请先选择商品分类!");
                return false;
            }
        },
        async tabClicked(){
            if(this.activeIndex==='1'){
                const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{sel:'many'}
                })
                if(res.meta.status!==200){
                    return this.$message.error("获取动态参数列表失败")
                }
                res.data.forEach(item=>{
                    item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(' ')
                })
                console.log(res.data)
                this.manyTableData=res.data
            }else if(this.activeIndex==='2'){
                const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{sel:'only'}
                })
                if(res.meta.status!==200){
                    return this.$message.error("获取静态属性列表失败")
                }
                console.log(res.data)
                this.onlyTableData=res.data
            }
        },
        //图片预览效果
        handlePreview(file){
            console.log(file)
            this.previewPath=file.response.data.url
            this.previewVisible=true;
        },
        //移除图片的操作
        handleRemove(file){
            console.log(file)
            const filePath=file.response.data.tmp_path;
            const i =this.addForm.pics.findIndex(x=>{
                x.pic===filePath
            })
            this.addForm.pics.splice(i,1)
        },
        //监听图片上传成功的事件
        handleSuccess(response){
            console.log(response)
            const picInfo={pic:response.data.tmp_path}
            this.addForm.pics.push(picInfo)
            console.log(this.addForm)
        },
        add(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    return this.$message.error("请填写必要的表单项")
                }
                const form=_.cloneDeep(this.addForm)
                form.goods_cat=form.goods_cat.join(',')
                //处理动态参数
                this.manyTableData.forEach(item=>{
                    const newInfo={
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                // 处理静态属性
                this.onlyTableData.forEach(item=>{
                    const newInfo={attr_id:item.attr_id,
                    attr_value:item.attr_vals}
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs=this.addForm.attrs
                console.log(form)
                const {data:res}=await this.$http.post('goods',form)
                if(res.meta.status!==201){
                    return this.$message.error("添加商品失败")
                }
                this.$message.success('添加商品成功！')
                this.$router.push('/goods')
            })
        }
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length===3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>

<style>
    .el-steps{
        margin: 15px 0;
        font-size:13px ;
    }
    .el-checkbox{
        margin:0 10px 0 0 !important; 
    }
    .previewImg{
        width:100%;
    }
    .el-button{
        margin-top: 15px
    }
</style>