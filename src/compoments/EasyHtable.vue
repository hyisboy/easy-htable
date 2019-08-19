<!--
 * @description: 
 * @Author: huangyong
 * @Date: 2019-08-18 23:17:31
 -->
<template>
  <div>
    <div class="table-tool" :style="getToolWidth">
      <slot></slot>
    </div>
    <div class="table-auto"></div>
    <div class="pagin"></div>
  </div>
</template>
<script>
import "../css/htable.min.css";
import { htable, hpagination } from "../js/easy-htable.js";

export default {
  name: "base-table",
  props: {
    htable: {
      type: Object,
      default: function() {
        return {
          thead: Object,
          tbody: Object,
          width: Number,
          oper: Object,
          row: Number,
          sort: Function,
          clickList:Function
        };
      }
    },
    
    hpagination: {
        type: Object,
        default: function () {
         return {
              back:Function,
              next:Function,
              item:Function,
              pageTotal:Number,
              currentPage:Number
         }
        }
    }
  },
  computed:{
    getToolWidth(){
      return `width:${this.htable.width+2}px`
    }
  },
  watch:{
    htable(val){
       htable.init(".table-auto", {
        thead: this.htable.thead,
        tbody: this.htable.tbody,
        width: this.htable.width,
        oper: this.htable.oper,
        row: this.htable.row,
        sort: this.htable.sort,
        clickList:this.htable.clickList,
      });
    },

    'htable.tbody': {
      handler(val){
        htable.setTableList(val)
      },
      deep: true
    },
    hpagination (val){
      hpagination.initPagination(".pagin", {
        back: currentPage => {
          this.hpagination.back(currentPage)
        },
        next:  currentPage =>  {
          this.hpagination.next(currentPage)
        },
        item: (ele, currentPage) => {
          this.hpagination.item(ele,currentPage)
        },
        pageTotal: this.hpagination.pageTotal,
        currentPage: this.hpagination.currentPage
      });
    },
    'hpagination.pageTotal':{
      handler(val){
        hpagination.initPagination(".pagin", {
        back: currentPage => {
          this.hpagination.back(currentPage)
        },
        next:  currentPage =>  {
          this.hpagination.next(currentPage)
        },
        item: (ele, currentPage) => {
          this.hpagination.item(ele,currentPage)
        },
        pageTotal: this.hpagination.pageTotal,
        currentPage: this.hpagination.currentPage
      });
      },deep: true
    }
    },
    
 
  mounted() {

    this.$nextTick(function() {
      
      htable.init(".table-auto", {
        thead: this.htable.thead,
        tbody: this.htable.tbody,
        width: this.htable.width,
        oper: this.htable.oper,
        row: this.htable.row,
        sort: this.htable.sort,
        clickList:this.htable.clickList,
      });
      hpagination.initPagination(".pagin", {
        back: currentPage => {
          this.hpagination.back(currentPage)
        },
        next:  currentPage =>  {
          this.hpagination.next(currentPage)
        },
        item: (ele, currentPage) => {
          this.hpagination.item(ele,currentPage)
        },
        pageTotal: this.hpagination.pageTotal,
        currentPage: this.hpagination.currentPage
      });
    });
    this.$emit('getInstance',htable)
  }
};
</script>
