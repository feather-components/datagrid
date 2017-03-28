# datagrid基于jquery.ligerui/ligergrid的插件

## 说明
将table常用功能进行整合，并且自动生成Table元素

## 安装
    bower install feather-components/datagrid2 
    feather2 install feather-components/datagrid2
    
## 引入
普通引入

```html
    <link rel="stylesheet" href="../index.css">
    <link rel="stylesheet" href="../bower_components/pager/index.css" media="screen" title="no title" charset="utf-8">
<script src="http://libs.baidu.com/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="../bower_components/class/index.js"></script>
<script type="text/javascript" src="../bower_components/pager/index.js"></script>
<script src="../ligergrid.js"></script>
```

feather2引入
```html
    require.ansyc("datagrid2");
```


## 使用
```html
<div class="main">
    <div id="maingrid" >
    </div>
</div>

 $("#maingrid").datagrid2({
       /*
       * columns列参数
       * source 数据
       * children 详细列表
       * height 高度
       * enabledSort 是否排序
       * */
        columns: [
            { display: 'gouxuan', name: 'checkbox', align: 'left' ,render:function(row){
                return  '<input type ="checkbox" rowid ="' + row.id + '">';
            }},
            { display: '顾客', name: 'CustomerID', align: 'left' },
            { display: '公司名', name: 'CompanyName',align:'left' ,frozen:false},
            { display: '联系人', name: 'ContactName' },
            { display: '地址', name: 'Address' },
            { display: '邮编', name: 'PostalCode' },
            { display: '城市', name: 'City' },
            { display: '操作', name: 'do' ,render:function(){  return  "<input type='text'/>"}}
        ],

        source: {
            ajaxUrl:"./a.json" ,
            type:"post",
            requestData: {
                a:"qeqwe",
                id:"555",
                name:"55kai",
                iPager:4,
                iPerPage:"12"
            },
            dataRowsField:"List",   <!--数据字段名-->
            dataTotalField:"Total", <!--数据总数名-->
            perPager:"iPerPage",     <!--每页个数字段，可以直接写number类型的如：10-->
            currentPageField:"iPager", <!--当前页字段-->
            sortColField:"colNames",  <!--排序请求字段-->
            sortNameField:"sortNames" <!--排序是否为正排序还是反排序字段-->
        },

//        height:500,
        children:{
            showDetail:function(row, detailPanel,callback){
                f_showOrder(row, detailPanel,callback);
            },
//            height:"500",
            closeDetail:function () {

            }
        },
//        enabledSort:false

    }).on("datagrid2:aftershowdata",function (event,data) {
        console.log(event,data,12345)
    }).on("datagrid2:beforeshowdata",function (event,data) {
        console.log(event,data,23456)
    }).on("datagrid2:showDetail",function(){
        console.log(112113123123123131);
    }).on("datagrid2:closeDetail",function(){
        console.log(92829393893);
    }).on("datagrid2:selectrow",function(){
        console.log(arguments,"selectrow");
    }).on("datagrid2:changesort",function(){
        console.log(arguments,"changesort");
    }).on("datagrid2:xhrsuccess",function(){
        console.log(arguments,"xhrsuccess");
    });

```

## 选项

| 选项 | 默认值 | 必填 | 说明 |
|----------|----------|----------|----------|
| columns | / | Y | 详情参数请见ligerui的api的columns参数|
| source | / | N | 数据来源|
| height | /| N | 高度|
| tree | /| N | 参数（columnId第几列点击，使用方法参考example文件|
| treeExtend | /| N | 默认是否展开 |
| data | /| N |静态数据，存在的话，source将不起作用（type:Array） |


## 事件

| 事件 | 说明 |
|----------|----------|
| datagrid2:aftershowdata | 渲染之后事件 |
|datagrid2:beforeshowdata| 渲染之前 |
 datagrid:showDetail | 展示明细事件s)|
 datagrid2:closeDetail |关闭明细事件 |
 datagrid2:selectrow |选择行事件 |
 datagrid2:selectrow |改变排序事件 |
 datagrid2:selectrow |数据请求成功事件 |
 datagrid2:changepage |切换页码事件 |

## 与datagrid区别

可以展开明细，增加排序请求功能，树形结构表格




