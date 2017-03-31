/**
 * Created by EX-pengzhiliang001 on 2017-03-22.
 */
;(function (factory) {
    if (typeof define == 'function' && define.amd) {
        //seajs or requirejs environment
        define(['jquery', 'class', 'pager','./ligergrid.js'], factory);
    } else if (typeof module === 'object' && typeof module.exports == 'object') {
        module.exports = factory(
            require('jquery'),
            require('class'),
            require('pager'),
            require('./ligergrid.js')
        );
    } else {
        factory(window.jQuery, window.jQuery.klass);
    }
})(function ($, Class) {

    var EVENTS=[],
        OPT_LIGER_FILTER_ARGS=['columns','height','children','tree','enabledSort'],
        LIGER_OPT_NAMES=[];

    /*过滤参数
    * @param {object} needFilter需要过滤的对象
    * */
    function _handleFilterOptions(needFilter){
        var obj={};

        for (var i in needFilter){
            if(OPT_LIGER_FILTER_ARGS.indexOf(i)>-1){
                obj[i] = needFilter[i];
            }
        }

        return obj;
    }

    /*检查某个从参数是否为true
    * @param {checkObj} 被检查的对象
    * @param {field} 被检查的字段
    * @param {colField} 递归字段
    * */
    function _checkObjFieldIsTrue (checkObj,field,colField){
        var fixed=false;

        for (var  i in checkObj){
            if(i==colField&&colField.length>0){
                fixed=_checkObjFieldIsTrue(checkObj[i],"frozen","columns");
            }else{
                if(i==field && checkObj[i]==true){
                    fixed= true;
                }
            }
        }
        return fixed;
    }

    /*
    * 处理columns,查看是否有排序
    * */

    function _checkColumnsIsSort(obj){

    }


    return Class.$factory('datagrid2', {

        initialize:function (option) {
            this.ele=$(option.dom);
            this.grid="";
            this.default={
                ligerOpt:{},
                pagerConfig:{
                    total: "",
                    current: "",
                    showFirstBtn: option.showFirstBtn!=undefined?option.showFirstBtn:true
                }
            };
            if(option.source!=undefined){
                var sourceObj={
                    reqData:option.source.requestData||{},
                    url:option.source.ajaxUrl||"",
                    type:option.source.type||"",
                    totalField:option.source.dataTotalField||"",
                    perPager:option.source.perPager||"",
                    currentPagerField:option.source.currentPageField||"",
                    dataRowsField:option.source.dataRowsField||"",
                };

                this.default = $.extend({}, this.default,sourceObj);
            }else{
                this.default = $.extend({}, this.default,{staticData:option.data});
            }


            this.default.ligerOpt=_handleFilterOptions(option);

            this.handleOptColumns();

            this.opt = $.extend({}, this.default,option);

            this.createDataGrid();
        },

        /*处理liger参数*/
        handleOptColumns:function(){
            var _self=this;
            var ligerObj={
                rowHeight:36,
                usePager:false,
                headerRowHeight:42,
                width: '100%',
                frozenDetail:false,
                // height: 500,
                onAfterShowData:function(event,data){

                    /*增加排序的箭头*/
                    _self.default.ligerOpt.columns.forEach(function(v,k){
                        var sort=v.isSort;

                        if(v.isSort){
                            _self.ele.find(".l-grid-header-inner td").each(function(index,dom){
                                if(v.columnname==$(dom).attr("columnname")&&$(dom).find(".l-grid-hd-cell-sort").length==0){
                                    $(dom).find(".l-grid-hd-cell-inner").append('<span class="l-grid-hd-cell-sort l-grid-hd-cell-sort-asc">&nbsp;&nbsp;</span>');
                                }
                            });
                        }
                    });

                    /*固定列时设置高度相等*/
                    setTimeout(function () {
                        $(".l-grid-body1").each(function(k,dom){
                            var $dom=$(dom);
                            var h=$dom.parents(".l-grid").first().find(".l-grid-body2").height();
                            $dom.css({
                                height:h+"px"
                            })
                        });
                    },0);


                    _self.trigger("aftershowdata",event,data);
                },
                onBeforeShowData:function(event,data){
                    _self.trigger("beforeshowdata",event,data);
                },
                onSelectRow:function(rowdata, rowid, rowobj){
                    _self.trigger("selectrow",rowdata, rowid, rowobj);
                },
                onChangeSort:function(colName,sortName){

                    /*删除排序的箭头*/
                    _self.ele.find(".l-grid-hd-cell").each(function(index,dom){
                        if($(dom).attr("columnname")==colName){
                            $(dom).find(".l-grid-hd-cell-inner").remove('.l-grid-hd-cell-sort');
                        }
                    });

                    _self.opt.reqData[ _self.opt.source.sortColField]=colName;
                    _self.opt.reqData[ _self.opt.source.sortNameField]=sortName;
                    _self.trigger("changesort",colName, sortName);
                    _self.getTableData();
                }
                // columnWidth: 100
            };


            if( _self.default.ligerOpt.children!=undefined){
                ligerObj.detail={
                    onShowDetail:function(row, detailPanel,callback) {
                        _self.default.ligerOpt.children.showDetail(row, detailPanel,callback);
                        _self.trigger("showDetail",row, detailPanel,callback);
                    },
                    onCollapse:function(data){
                        _self.default.ligerOpt.children.closeDetail(event,data);
                        _self.trigger("closeDetail",event,data);
                    },
                    height:_self.default.ligerOpt.children.height
                };
            }

            if(_self.default.ligerOpt.tree!=undefined){
                ligerObj.tree= this.default.ligerOpt.tree;
                ligerObj.tree.usePager=false;
            }


            this.default.ligerOpt= $.extend(true,{}, this.default.ligerOpt,ligerObj);



        },

        /*处理参数source*/
        handleOptSource:function (){

        },


        /*检查是否有固定列*/
        checkColumnsFixed:function (){
            var fixed=false;
            for ( var i in this.default.ligerOpt.columns) {
                fixed=_checkObjFieldIsTrue(this.default.ligerOpt.columns[i], "frozen", "columns");
                if(fixed)break;
            }


            if(fixed){
                this.ele.find(".l-grid2").css({marginLeft:"3px"});
            }
        },


        /*创建table*/
        createDataGrid:function (){
            var _self=this;

            _self.grid=_self.ele.ligerGrid(_self.opt.ligerOpt);
            this.checkColumnsFixed();

            _self.getTableData();
        },

        /*ajax请求 */
        getTableData:function(){
            var  _self= this ;
            if(_self.opt.staticData!=undefined){
                var rows={Rows:_self.opt.staticData};
                if(rows.Rows instanceof Object){
                    var rowsArgs=[];
                    for(var i in rows.Rows){
                        rowsArgs.push(rows.Rows[i]);
                    }
                    rows.Rows=rowsArgs;
                }
                _self.grid.set({data:rows});
            }else{

                $.ajax({
                    url:_self.opt.url,
                    type:_self.opt.type,
                    data:_self.opt.reqData,
                    dataType:"json",
                    success:function(data){

                        _self.trigger('xhrsuccess',data);

                        var dataRow=_self.opt.dataRowsField!=undefined?_self.opt.dataRowsField:"";
                        var rows =dataRow!=""?{
                            Rows:eval("data."+_self.opt.dataRowsField)
                        }:{Row:{}};

                        if(_self.default.ligerOpt.tree!=undefined){
                            rows.Rows[0].isextend = _self.opt.treeExtend;
                        }

                        /*判断是否为对象*/
                        if(rows.Rows instanceof Object){
                            var rowsArgs=[];
                            for(var i in rows.Rows){
                                rowsArgs.push(rows.Rows[i]);
                            }
                            rows.Rows=rowsArgs;
                        }

                        _self.grid.set({data:rows});
                        // _self.grid.loadData();

                        var per="";
                        if(parseInt(_self.opt.perPager)>0){
                            per=_self.opt.perPager;
                        }else{
                            per=_self.opt.reqData[_self.opt.perPager];
                        }

                        _self.opt.pagerConfig.total=Math.ceil(eval("data."+_self.opt.totalField) / per);
                        _self.opt.pagerConfig.current=_self.opt.reqData[_self.opt.currentPagerField];

                        if(_self.opt.pagerUse!==false){
                            _self.createTablePager();
                        }

                    },
                    error:function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error(XMLHttpRequest, textStatus, errorThrown,"xhr_error");
                    }
                });

            }

        },


        /*创建pager*/
        createTablePager:function(){
            var _self=this;
            var isPager=_self.opt.isPager!=undefined?_self.opt.isPager:true;
            if(isPager ){
                if(_self.ele.children(".pager").length==0){
                    _self.ele.append("<div class='pager'></div>");
                }

                _self.ele.find(".pager")
                    .pager(_self.opt.pagerConfig)
                    .off("pager:switch")
                    .on("pager:switch", function (event, index) {
                        _self.trigger('changepage', event,index);
                        _self.opt.reqData[_self.opt.currentPagerField]=index;
                        _self.getTableData();
                    })
            }

        },


        /*销毁grid*/
        destroy:function () {},

    })

});
