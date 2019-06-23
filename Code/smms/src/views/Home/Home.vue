<template>
    <div class="home">
         <el-container>
            <el-aside width="200px">
               <LeftNav></LeftNav>
            </el-aside>
            <el-container>
                <el-header>
                  <Rightheader ref="rightHeader"></Rightheader>
                </el-header>
                <el-main>
                     <!-- 路由出口 -->
                     <router-view @tofather="fn"></router-view>
                </el-main>
                <el-footer>
                     <Rightfooter></Rightfooter>
                </el-footer>
            </el-container>
          </el-container>
        
    </div>
</template>

<script>
    //引入左侧栏组件
    import LeftNav from "@/components/LeftNav/LeftNav.vue"
    //引入右侧头部组件
    import Rightheader from '@/components/Rightheader/Rightheader.vue'
    //引入右侧尾部模块
     import Rightfooter from '@/components/Rightfooter/Rightfooter.vue'
    export default {
        //注册组件
        components:{
            LeftNav,
            Rightheader,
            Rightfooter
        },
        methods:{
            fn(){
                this.$refs.rightHeader.getuserInfo()
            }
        }
    }
</script>

<style lang="less">
  .home{
      height:100%;
      .el-container{
          height:100%;
         // 左侧导航栏  
         .el-aside {
                background-color: #2d3a4b;
           }
         //右侧容器
         .el-container{
             //上
               .el-header{
                   line-height: 60px;
               }
             //中
              //  .el-main {
                   
              //   }
              //下
               .el-footer {
                    line-height: 60px;
                }
         }
          
      }
  }

</style>