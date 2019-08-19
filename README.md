## easy-htable表格插件简介 
  表格组件
  vue表格组件 , 分为三部分:

  1. 工具栏 (tool)
  2. 表格主体 (htable)
  3. 分页 (hpagination)

### API:
  (instance 是当前表格实例)

  1. instance.setTableList(tbody)
     作用: 向当前表格中设置新的数据
     参数: tbody => Array, 新的表格数据
  2. instance.getCheckedList()
     作用: 获取当前选中的表格数据 
     返回值: [
         {data:Array // 选中列表的数据
          ele: HTMLElement // 选中列表的元素节点}
     ]
  3. instance.loading()
     作用: 请求数据时,页面显示加载中的状态
     使用时机: 在请求数据前使用.
###  使用之>>>更换数据:

     调用API: instance.setTableList(tbody) //  即可更换数据 


###  使用之>>>初始化: 

+   template中: 
      ...
      <!-- 组件中包含的内容为 工具条(tool),可自定义 ,原理是使用插槽 插入 -->
      <!-- @getInstance="getInstance"  获取当前表格的实例 ,getInstance为 methods中的方法-->
      <base-table v-bind="table" @getInstance="getInstance"> 
        <div class="add tool-btn">
            <span class="insert-icon tool-icon"></span>
            <span>新增</span>
        </div>
        <div class="delete tool-btn">
            <span class="delete-icon tool-icon"></span>
            <span>多选删除</span>
        </div>
       </base-table>
      ...

+   script 中: 
    import BaseTable from "ASSETS_CMP/utils/BaseTable.vue"; //导入table组件
    ...
+   data (){
#     tableInstance:{},//当前表格的实例
#     table: {
#        htable: { //表格配置
          thead: [],
          tbody: [],
          width: 1050,
+         oper: [  //操作的回调
            {
              label: "修改",
              icon_class: "update-icon",
              callback: function(e,ele,data) {
                console.log("修改",ele,data);
                
                e.stopPropagation();
              }
            },
            {
              label: "删除",
              icon_class: "delete-icon",
              callback: function(e) {
                console.log("删除");
                e.stopPropagation();
              }
            }
          ],
          row: 10.3,
         sort: function(type, name) {
            console.log("当前排序的类型:", type, "当前排序的字段:", name);
          }
        },
#      hpagination: { //分页配置
        back: function(currentPage) { //currentPage 为当前页
          console.log("back", currentPage);
        },
        next: function(currentPage) {//currentPage 为当前页
          console.log("next", currentPage);
        },
        item: function(ele, currentPage) {//ele为当前操作的列元素,currentPage 为当前页
          console.log("item", ele, currentPage);
        },
+        clickList:function(ele,data){ //点击列表的回调
         
        },
        pageTotal: 5, //页面总数
        currentPage: 1//当前页面
      }
    }
   methods:{ 
#    getInstance(instance){ //获取当前实例 ,再将其 注入到 组件中的 tableInstance 中存储
     this.tableInstance = instance
   }
  },
 #   created(){ //在其 created 钩子下初始化表格数据
         this.table.htable.tbody = [
      [
        "1",
        "液压",
        "液压机",
        "K-v",
        "dd-c5",
        "2019-12-11",
        this.table.htable.oper
      ],
      [
        "1",
        "液压",
        "液压机",
        "K-v",
        "dd-c5",
        "2019-12-11",
        this.table.htable.oper
      ],
      [
        "1",
        "液压",
        "液压机",
        "K-v",
        "dd-c5",
        "2019-12-11",
        this.table.htable.oper
      ],
      [
        "1",
        "液压",
        "液压机",
        "K-v",
        "dd-c5",
        "2019-12-11",
        this.table.htable.oper
      ],
      [
        "1",
        "液压",
        "液压机",
        "K-v",
        "dd-c5",
        "2019-12-11",
        this.table.htable.oper
      ],
      [
        "1",
        "液压",
        "液压机",
        "K-v",
        "dd-c5",
        "2019-12-11",
        this.table.htable.oper
      ],
      [
        "1",
        "液压",
        "液压机",
        "K-v",
        "dd-c5",
        "2019-12-11",
        this.table.htable.oper
      ],
      [
        "1",
        "液压",
        "液压机",
        "K-v",
        "dd-c5",
        "2019-12-11",
        this.table.htable.oper
      ],
      [
        "1",
        "液压",
        "液压机",
        "K-v",
        "dd-c5",
        "2019-12-11",
        this.table.htable.oper
      ],
      [
        "1",
        "液压",
        "液压机",
        "K-v",
        "dd-c5",
        "2019-12-11",
        this.table.htable.oper
      ]
    ];
    this.table.htable.thead = [
      {
        label: "ID",
        name: "id",
        width: 150,
        sort: true,
        fixedColumn: "left"
      },
      {
        label: "设备类型",
        name: "deviceType",
        width: 200,
        sort: true
      },
      {
        label: "设备名称",
        name: "deviceName",
        width: 150
      },
      {
        label: "品牌",
        name: "brand",
        width: 150
      },
      {
        label: "型号",
        name: "type",
        width: 150
      },
      {
        label: "出厂日期",
        name: "dataProduct",
        width: 200
      },
      {
        label: "操作",
        name: "oper",
        width: 150,
        //sortable: false,
        fixedColumn: "right"
      }
    ];
    }
    ...



   


​    
