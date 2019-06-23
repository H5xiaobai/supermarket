<template>
    <div class="System-Info">
        <!-- 卡片 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
              <h3 class="title">系统信息</h3>
            </div>
             <el-alert
            title="商品总数:5。已经销售的总金额:890.00。库存商品总价:1235.82"
            type="success"
            show-icon>
            </el-alert>
             <el-alert
            title="导入数据"
            type="info"
            show-icon>
            </el-alert>
            <!-- 表格 -->
            <el-row :gutter="30">
                    <el-col :span="12">
                        <!-- 左侧表格 -->
                         <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <h2>销售排行</h2>
                            </div>
                            <div class="item">
                                  <el-table
                                    :data="tableData"
                                    style="width: 100%">
                                        <el-table-column
                                            prop="goodsName"
                                            label="商品名称"
                                            width="350">
                                        </el-table-column>
                                        <el-table-column
                                            prop="sellNum"
                                            label="销量"
                                           >
                                        </el-table-column>
                                    </el-table>
                            </div>
                         </el-card>
                    </el-col>
                    <el-col :span="12">
                        <!-- 右侧表格 -->
                         <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <h2>缺货的商品</h2>
                            </div>
                            <div class="item">
                                  <el-table
                                    :data="tableData01"
                                    style="width: 100%">
                                        <el-table-column
                                            prop="goodsName"
                                            label="商品名称"
                                            width="350">
                                        </el-table-column>
                                        <el-table-column
                                            prop="sellNum"
                                            label="缺货数量"
                                           >
                                        </el-table-column>
                                    </el-table>
                            </div>
                        </el-card>
                    </el-col>
            </el-row>
       </el-card>
       
       
    </div>
</template>

<script>
    export default {
        data(){
            return{
                // 左表格数据
                tableData: [{
                    goodsName: '金龙鱼菜油',
                     sellNum: '100'
                          },
                          {
                            goodsName: '花生菜籽油',
                            sellNum: '120'
                           },
                           {
                            goodsName: '葵花菜籽油',
                            sellNum: '140'
                           },
                           {
                            goodsName: '进口橄榄油',
                            sellNum: '200'
                           }
                    ],
                    //右表格数据
                    tableData01:[
                        {
                        goodsName: '思念汤圆',
                        sellNum: '300'
                        },
                        {
                        goodsName: '思念水饺',
                        sellNum: '700'
                        }
                    ]
                }
                
        }
    }
</script>

<style lang="less">
   .System-Info{
       .box-card{
             .el-card__header{
              background-color: #f1f1f1;
              .clearfix{
                  .title{
                    font-size: 20px;
                }
              }  
             }
             .el-card__body{
                 .el-alert{
                   margin-bottom: 20px;
                 }
             }
            
       }
   }
 

 
</style>