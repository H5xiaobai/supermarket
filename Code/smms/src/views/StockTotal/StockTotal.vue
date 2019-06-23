<template>
    <div class="Stock-Total">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 class="title">进货统计</h3>
            </div>
            <div class="item">
                 <el-button type="danger" size='small' @click='getData'>重新加载</el-button>
                 <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
                <div id="stocktotal" style="height:400px"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
//引入api
import {getEcharts} from '@/api/goods'
    export default {
        data(){
           return{
               //x轴数据
               xAxisData:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
               //核心数据
               seriesData:[820, 932, 901, 934, 1290, 1330, 1320]
           }
        },
        methods:{
            //重新加载报表
            getData(){
                  //引入报表请求函数
                  getEcharts()
                   .then(res=>{
                        //就收后台数据
                         let {xData,mainData}=res;
                        // console.log(xData,mainData);
                          //渲染页面
                        this.xAxisData=xData
                        this.seriesData=mainData
                        //获取到后端数据，重新 setOption 即可重新渲染。
                          let option = {
                        //x轴数据
                            xAxis: {
                                type: 'category',
                                data: this.xAxisData
                            },
                            yAxis: {
                                type: 'value'
                            },
                            //核心数据
                            series: [{
                                data: this.seriesData,
                                type: 'bar'
                            }]
                        };
                        //调用生成报表函数
                        this.drawCharts(option)
                       
                        
                   })
                   .catch(err=>{
                       console.log(err);
                       
                   })
            },
            
            //报表生成函数
              drawCharts(option){
                  // 基于准备好的dom，初始化echarts实例
                var stocktotal = this.echarts.init(document.getElementById('stocktotal'));

               
                 // 使用刚指定的配置项和数据显示图表。
                 stocktotal.setOption(option);
             }
           
        },
        //初始渲染报表
            mounted(){
                // 指定图表的配置项和数据
                let option = {
                   //x轴数据
                    xAxis: {
                        type: 'category',
                        data: this.xAxisData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    //核心数据
                    series: [{
                        data: this.seriesData,
                        type: 'line'
                    }]
                 }
                //调用生成报表函数
                this.drawCharts(option)
            }

    }
</script>

<style lang="less">
 .Stock-Total{
         .el-card{
             .el-card__header{
                 background-color: #f1f1f1;
                 .clearfix{
                     .title{
                         font-size:20px;
                     }
                 }
             }
             .el-card__body{
                   .el-table{
                       margin-bottom: 30px;
                   }
             }
         }
    }
</style>