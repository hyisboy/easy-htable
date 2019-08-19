/*
 * @description: 
 * @Author: huangyong
 * @Date: 2019-07-07 14:26:41
 */
/**
 * 表格
 */
(function () {
    let htable = {};
    let hpagination = {};
    (function () {
        let col_height = 41; //列的高度
        let _ele = {}; //表格容器容器 
        let _table_instance; //初始化表格元素
        let _fixed_state = true; //是否产生固定列
        let _checkbox_list; //多选框集合
        let _eleSelectorName = "";
        let theadWidth; //生成每列宽度数组
        let _config = {
            thead: {},
            tbody: {},
            width: 400,
            sort: function () {},
            clickList: function(){}, //点击列表
            row: 4, //显示总行数,不包含表头
        };
        //初始化数据
        htable.init = function (eleSelectorName, config) {
            console.log('init')
            _eleSelectorName = eleSelectorName
            _config = config;
            _props_length = 0; //记录不固定的列数
            console.log(_config);
            _ele = document.querySelector(eleSelectorName); //初始化元素对象
            if (!_ele) {
                console.log('元素未找到');
                return;
            }
            theadWidth = (function (data) {
                let widths = []
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        widths.push(data[key].width);
                    }
                }
                return widths
            })(config.thead)

            //搭建外层结构
            let htable_wrap_html = `<div class="table-wrap">
            <div class="htable">
                 <div class="htable-head"></div>
                 <div class="htable-load show"><div class="htable-load-cont">正在加载中.....</div></div>
                 <div class="htable-body"></div>
            </div>
            </div>`;
            _ele.innerHTML = htable_wrap_html;

            //创建表头
            let thead_html = '<ul>';
            for (const key in config.thead) {
                if (config.thead.hasOwnProperty(key)) {
                    //排序
                    let sort = (config.thead[key].sort) ? `<div class="sort" data-name="${config.thead[key].name}"><span title="升序" class="asc asc-icon"></span><span title="降序" class="desc desc-icon"></span></div>` : ''
                    let fixedName = '';
                    const element = config.thead[key];
                    _props_length++;
                    //左边 id 列,单独创建
                    if (element.fixedColumn == 'left') {
                        thead_html += ` <li class="htable-fixed-left-column recom-options"> <div class="htable-select select-all"><input type="checkbox"/><span class="checkbox-icon checkbox-btn"></span></div>
                    <div class="htable-id"><span>${element.label}</span>${sort}</div></li>`;
                        continue;
                    } //右边 操作 列
                    else if (element.fixedColumn == 'right') {
                        fixedName = 'htable-fixed-right-column';
                    }
                    //创建 每一列
                    thead_html += ` <li class="${fixedName}" style="width:${config.thead[key].width}px"><span>${element.label}</span>${sort}</li>`;
                }
            }
            thead_html += '</ul>';

            _ele.querySelector('.htable-head').innerHTML = thead_html;

            //设置表格总宽度
            let table_count_width = (function (widths) {
                let count = 0;
                widths.forEach(num => count += num)
                return count
            })(theadWidth);

            let wrap = _ele.querySelector('.table-wrap');
            let load = _ele.querySelector('.htable-load');
            let loadCont = _ele.querySelector('.htable-load-cont');
            let bd = _ele.querySelector('.htable-body');
            wrap.style.width = _config.width + 'px';
            load.style.width = table_count_width + 'px';
            console.log(_config.tbody.length, _config.row)
            let loadHeight = (_config.row + 0.2) * (col_height) + 'px';
            load.style.height = loadHeight
            loadCont.style.width = _config.width + 'px';
            loadCont.style.height = loadHeight
            loadCont.style.lineHeight = loadHeight
            bd.style.height = loadHeight;



            //设置表格总高度
            // console.log(((_config.row + 1) * col_height) + 'px')
            wrap.style.height = ((_config.row + 2) * col_height) + 'px';

            //设置tbody 与 thead的 宽度
            let ta = _ele.querySelectorAll('.htable-head,.htable-body');

            ta = Array.prototype.slice.call(ta); //将nodeList转化成数组
            ta.forEach(ele => {
                ele.style.width = table_count_width + 'px';
            });
            //是否产生滚动条
            if (table_count_width <= _config.width) {
                _fixed_state = false;
                _table_instance = _ele.querySelector('.htable');
                _table_instance.style.overflowX = 'auto'; //清除滚动条

                //清除阴影
                _table_instance.querySelector('.htable-fixed-left-column').classList.remove('htable-fixed-left-column');
                _table_instance.querySelector('.htable-fixed-right-column').classList.remove('htable-fixed-right-column');
                ta.forEach(ele => {
                    ele.style.paddingLeft = 0;
                });
            }
           // console.log('current tbody is', _config.tbody)
            initTbody(_config.tbody, _config.oper, _config.thead); //初始化表格数据
            initEvent(_config.oper, true, _config.sort,_config.tbody); //初始化事件
        }
        /* 加载数据 */
        htable.loading = function () {
            //console.log('load')
            let body = _ele.querySelector('.htable-body')
            let load = _ele.querySelector('.htable-load')
            _ele.querySelector('.htable-load-cont').innerText = '正在加载...'
            load.classList.add('show')
            body.classList.remove('show')
           // console.log('loading')
        }
        //初始化表格数据

        function initTbody(tbody_data, oper, thead_data) {
            let oper_html = '';

            // console.log('列宽度:',theadWidth)
            //解析操作
            if (oper) {
                for (const key in oper) {
                    if (oper.hasOwnProperty(key)) {
                        const element = oper[key];
                        oper_html += `<span title =${element.label} class = "${element.icon_class}"></span>`;
                    }
                }
            }
            let tbody_html = '';
            tbody_data.forEach((ul_list, ul_index) => {
                let ul_html = '<ul>';
                let first_fixed = false;
                let first = false;
                ul_list.forEach((li_list, index) => {
                    let fixed_classname = '';
                    //点击删除弹出提示
                    let pop = `<div class="popup"><div class="pop-cont"><span class="pop-hint">是否删除？</span><div class="pop-ft"><span class="pop-btn confirm">确认</span><span class="pop-btn cancel">取消</span></div></div></div>`
                    if (_fixed_state && index == 0) { //添加固定列
                        first_fixed = true;
                    } else if (index == 0) {
                        first = true;
                    } else if (_fixed_state && index == (ul_list.length - 1)) {
                        fixed_classname = 'operation htable-fixed-right-column ';
                    }
                    if (index == (ul_list.length - 1)) { //选择器
                        ul_html += `<li class="operation ${fixed_classname}" data-index="${ul_index}">${oper_html}${pop}</li>`;
                    } else {
                        if (first_fixed) {
                            console.log(li_list)
                            ul_html += `<li class="htable-fixed-left-column recom-options" style="width:${theadWidth[index]}px"> <div class="htable-select select-item"><input type="checkbox"><span class="checkbox-icon checkbox-btn"></span></div>
                        <div class="htable-id"><span>${li_list}</span></div></li>`;
                            first_fixed = false;
                        } else if (first) {
                            ul_html += `<li class=" recom-options" style="width:${theadWidth[index]}px"> <div class="htable-select select-item"><input type="checkbox"><span class="checkbox-icon checkbox-btn"></span></div>
                            <div class="htable-id"><span>${li_list}</span></div></li>`;
                            first = false;
                        } else {
                            let out = false;
                            if(li_list.length >= 8){
                                li_list.split().forEach( fe => {
                                    if(escape(fe).indexOf('%u') >= 0) out = true
                                })
                            }
                            let title ;
                            if(out){
                                fixed_classname+=" over"
                                title = `title="${li_list}"`
                            }
                            ul_html += `<li class="${fixed_classname}" ${title} style="width:${theadWidth[index]}px"><span ">${li_list}</span></li>`;
                        }
                    }
                });
                ul_html += '</ul>';
                tbody_html += ul_html;
            });
            let body = _ele.querySelector('.htable-body')
            body.innerHTML = tbody_html;
            if(tbody_data.length > 0){
                _ele.querySelector('.htable-load').classList.remove('show')
                body.classList.add('show')
                return 
            }
            _ele.querySelector('.htable-load-cont').innerText = '暂无数据'  
        }
        //初始化事件
        function initEvent(oper, init, sort, tbody) {
            if (init) {
                //如果是初始化状态,则给表头加事件
                let ascList = Array.prototype.slice.call(_ele.querySelectorAll('.asc')) //升序
                let descList = Array.prototype.slice.call(_ele.querySelectorAll('.desc')) //降序
                ascList.forEach(ele => {
                    ele.onclick = function (e) {
                        let target = (e || window.event).target || (e || window.event).srcElement
                        sort('ASC', target.parentNode.getAttribute('data-name'))
                    }
                })
                descList.forEach(ele => {
                    ele.onclick = function (e) {
                        let target = (e || window.event).target || (e || window.event).srcElement
                        sort('DESC', target.parentNode.getAttribute('data-name'))
                    }
                })
                //sort(type,name)
            }
            // console.log(oper);
            // 添加oper点击事件

            let delCallback ;//删除回调的方法
            oper.forEach(oper_item => {
                let oper_event = _ele.querySelectorAll('.' + oper_item.icon_class);
                oper_event = Array.prototype.slice.call(oper_event);
                if(oper_item.icon_class == 'delete-icon') delCallback = oper_item.callback //将删除的回调另传

                let popups = [] //存储所有的删除弹窗面板
                oper_event.forEach((eve_item,index,arr) => {
                    let popup = eve_item.parentNode.lastChild //获取删除弹窗面板
                    popups.push(popup)
                    
                    if(index >= arr.length-2){
                        let bottom = '-40px'
                        if(index == arr.length-1){
                            bottom = '0'
                        }
                        popup.style.top = 'initial'
                        popup.style.bottom = bottom
                    }
                    

                    eve_item.onclick = function (event) {
                        console.log('当前距离',popup.parentNode.parentNode.offsetBottom)
                        let index = +this.parentNode.getAttribute('data-index')
                        if (oper_item.icon_class == 'delete-icon') {
                            popup.classList.add('show')
                            
                            //移出 除当前面板的其他兄弟级面板的显示效果
                            popups.forEach( pop => {
                                if(pop != popup){
                                    pop.classList.remove('show')
                                }
                            })
                            event.stopPropagation()
                            return 
                        }
                        oper_item.callback(event, this.parentNode.parentNode, _config.tbody[index]);
                    };
                });
            });
             //删除面板
             let pop =  _ele.querySelectorAll('.popup')
             pop = Array.prototype.slice.call(pop) 
             pop.forEach( p => {
                 p.onclick = function(e){
                    e.stopPropagation() 
                 }
                 let ft = p.firstChild.firstChild.nextElementSibling
                 //确认
                 ft.firstChild.onclick = function (e){
                     let index = p.parentNode.getAttribute('data-index')
                     delCallback(e,p.parentNode.parentNode,_config.tbody[index])
                     p.classList.remove('show')
                 }
                 //取消
                 ft.lastChild.onclick = function (){
                     p.classList.remove('show')
                 }
             })

            //checkbox事件
            function checkIcon(state, ele) {
                let sibling = ele.nextElementSibling.classList;
                if (state) {
                    sibling.remove('checkbox-icon');
                    sibling.add('checkbox-icon-active');
                } else {
                    sibling.remove('checkbox-icon-active');
                    sibling.add('checkbox-icon');
                }
            }
            //1. 全选事件
            let select_list = _ele.querySelectorAll('.select-item input');
            let select_all = _ele.querySelector('.select-all input');

            select_list = Array.prototype.slice.call(select_list);
            _checkbox_list = select_list;

            select_all.onchange = function () {
                let state = this.checked;
                checkIcon(state, this);
                select_list.forEach(ele => {
                    ele.checked = state;
                    checkIcon(state, ele);
                });
            }
            //2. 子选项改变 全选事件
            select_list.forEach(ele => {
                ele.onclick = function (e) {
                    e.stopPropagation();
                }
                ele.onchange = function (e) {
                    check(ele);
                    checkIcon(ele.checked, ele);
                    e.stopPropagation();
                }

            });
            //给ul添加点击事件,点击选中
            let ul_all = _ele.querySelectorAll('.htable-body>ul');
            ul_all = Array.prototype.slice.call(ul_all);
            ul_all.forEach((ele,index) => {
                ele.onclick = (e) => {
                   // console.log(_config)
                    //当设置点击列表的回调之后,会增加点击选中列表的效果
                    if( _config.clickList){
                        _config.clickList(ele,tbody[index]) //点击列表的方法
                        ul_all.forEach((ul_item) => {
                            if(ul_item == ele){
                                ul_item.classList.add('ul-active')
                            }else{
                                ul_item.classList.remove('ul-active')
                            }
                        })
                    }else{
                        let child = ele.children[0].children[0].children[0];
                        child.checked = !child.checked;
                        check(child);
                        checkIcon(child.checked, child);
                    }
                    e.stopPropagation();
                }
            });
            //用于checkbox
            function check(ele) {
                // 1.全选情况
                if (select_all.checked) {
                    select_all.checked = ele.checked;
                    checkIcon(select_all.checked, select_all);
                    return;
                }
                // 2. 未选中
                let slall = false;
                try {
                    select_list.forEach((item, index, list) => {
                        slall = item.checked;
                        if (!slall) throw new Error('终止循环');
                        if (list.length - 1 == index) {
                            select_all.checked = true;
                            checkIcon(select_all.checked, select_all);
                        }
                    })
                } catch (e) {

                }
            }
        }
        /* 
          隐藏多选框
        */
        htable.hiddenCheckbox = function () {
            let select_list = _ele.querySelectorAll('.htable-select');
            select_list = Array.prototype.slice.call(select_list);
            console.log('列表', select_list);
            select_list.forEach(ele => {
                ele.style.display = 'none';
            });
        }
        //获取选中列表
        htable.getCheckedList = function () {
            let data = [];
            _ele = document.querySelector(_eleSelectorName);
            _checkbox_list = _ele.querySelectorAll('.select-item input');
            _checkbox_list = Array.prototype.slice.call(_checkbox_list);
            _checkbox_list.forEach(item => {
                // console.log(item)
                if (!item.checked) return false;
                let ul = item.parentNode.parentNode.parentNode;
                console.log(ul)
                if (ul.nodeName == 'UL') {
                    let index = +ul.lastChild.getAttribute('data-index')
                    let obj = {
                        data: _config.tbody[index],
                        ele: ul
                    }
                    data.push(obj);
                }
            });

            return data;
        }
        /**
         * @description: 更换数据,可调用该方法,动态更换数据
         * @param {tbody} 数据
         */
        htable.setTableList = function (tbody) {
            _config.tbody = tbody
            initTbody(tbody, _config.oper); //初始化表格数据
            initEvent(_config.oper, false,_config.sort,tbody); //初始化事件
        }
    })();
    /* 初始化分页 */

    /**上一页,下一页,每一页的回调函数
     * paginConfig: {back: callback,next: callback,item: callback,pageTotal:5,currentPage: 1}
     * containerSelector: 容器的选择器名
     */
    hpagination.initPagination = function (containerSelector, paginConfig) {
        let proviousPage = 1;
        let currentPage = 1;
        let pagin_ele = document.querySelector(containerSelector); //分页容器
        //创建分页
        let pagination_html = `<div class="pagination"><ul><li class="page-back page-item-node"><span class="page-icon jiantou-left-icon"></span></li>
           <li class="page-list"><ul class="page-list-node">`;
        //循环页面
        for (let i = 1; i <= paginConfig.pageTotal; i++) {
            let active = '';
            if (i == paginConfig.currentPage) {
                active = 'active';
            }
            pagination_html += `<li data-index="${i}" class="page-item-node item ${active}">${i}</li>`
        }
        pagination_html += `</ul></li><li class="page-next page-item-node "><span class="page-icon jiantou-right-icon"></span></li><li class="page-detail">总计: ${paginConfig.pageTotal} 页</li></ul></div>`;
        pagin_ele.innerHTML = pagination_html;

        //添加事件
        (function (paginConfig) {

            //back ,next ,item >>>获取元素
            let backEle = pagin_ele.querySelector('.page-back');
            let itemEles = pagin_ele.querySelectorAll('.page-item-node.item');
            itemEles = Array.prototype.slice.call(itemEles); //转化成数组
            let nextEle = pagin_ele.querySelector('.page-next');

            /* 上一页 */
            backEle.addEventListener('click', function () {
                proviousPage = currentPage;
                currentPage = currentPage > 1 ? currentPage - 1 : 1;
                paginConfig.back(currentPage);
                setActive(currentPage, proviousPage);
            });

            /* 下一页 */
            nextEle.addEventListener('click', function () {
                proviousPage = currentPage;
                currentPage = currentPage < paginConfig.pageTotal ? currentPage + 1 : paginConfig.pageTotal;
                paginConfig.next(currentPage);
                setActive(currentPage, proviousPage);
            });

            /* 页面列表 */
            itemEles.forEach((ele, index) => {
                ele.addEventListener('click', function () {
                    proviousPage = currentPage;
                    currentPage = index + 1;
                    paginConfig.item(ele, index + 1);
                    setActive(currentPage, proviousPage);
                });
            });
            function setActive(currentPage, proviousPage) {
                itemEles[proviousPage - 1].classList.remove('active');
                itemEles[currentPage - 1].classList.add('active');
            }
        })(paginConfig);
    }
    module.exports.htable = htable
    module.exports.hpagination = hpagination
    
})();