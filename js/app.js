/*
   1. 鼠标移入显示,移出隐藏
                目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
   2. 鼠标移动切换二级导航菜单的切换显示和隐藏
   3. 输入搜索关键字, 列表显示匹配的结果
   4. 点击显示或者隐藏更多的分享图标
   5. 鼠标移入移出切换地址的显示隐藏
   6. 点击切换地址tab
  
   7. 鼠标移入移出切换显示迷你购物车
   8. 点击切换产品选项 (商品详情等显示出来)
  
   9. 点击向右/左, 移动当前展示商品的小图片
   10. 当鼠标悬停在某个小图上,在上方显示对应的中图
   11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
 */

$(function () {
  
  showhide()
  hoverSubMenu()  
  search()
  share()
  address()
  clickTabs()
  hoverMinicart()
  clickProductTabs()
  moveMiniImg()
  hoverMiniImg()
  showBigImg()
 
 
  /* 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域*/
  function showBigImg () {
    //获取中图区域及其宽高
    var $maskTop = $('#maskTop')
    var maskTopWidth = $maskTop.width()
    var maskTopHeight = $maskTop.height()
    //获取小黄块及其宽高
    var $mask = $('#mask') 
    var maskWidth = $mask.width()
    var maskHeight = $mask.height()
    //获取大图
    var $largeImg = $('#largeImg') 
    //获取中图
    var $mediumImg = $('#mediumImg')
    //显示大图的区域
    var $largeImgContainer = $('#largeImgContainer') 
    //显示加载的图片
    var $loading = $('#loading') 
    
    //对中图的位置绑定移入移出监听
    $maskTop.hover(function () {
      //显示小黄块
      $mask.show()
      
      //动态加载对应大图
      var src = $mediumImg.attr('src').replace('-m.','-l.')
      $largeImg.attr('src',src)
      //绑定大图加载完成的监听
      $largeImg.on('load', function () {
        
        //获取大图的尺寸
        var largeImgWidth = $largeImg.width()
        var largeImgHeight = $largeImg.height()
        
        //设置显示大图区域的大小
        $largeImgContainer.css({
          width: largeImgWidth/2,
          height: largeImgHeight/2
        })
        //显示该区域
        $largeImgContainer.show()
        //显示大图
        $largeImg.show()
        //隐藏加载的图片
        $loading.hide()
        
        //绑定鼠标移动监听事件
        $maskTop.mousemove(function (event) {
          //1. 移动小黄块
          
          //计算小黄块实现移动的位置
          var left = event.offsetX - maskWidth/2
          var top = event.offsetY - maskHeight/2
          //限制小黄块在图片区域内移动
          if(left <0) {
            left = 0
          } else if(left > maskTopHeight-maskHeight) {
            left = maskTopHeight-maskHeight
          }
          if(top <0) {
            top = 0
          } else if(top > maskTopHeight-maskHeight) {
            top = maskTopHeight-maskHeight
          }
          //实现小黄块随鼠标而移动
          $mask.css({
            left: left,
            top: top
          })
          
          //2. 移动大图
          left = -left * (largeImgWidth / maskTopWidth)
          top = -top * (largeImgHeight / maskTopHeight)
          $largeImg.css({
            left: left,
            top: top
          })
          
        })
        
      })
      
    }, function () {
      //隐藏小黄块
      $mask.hide()
      //隐藏大图及其区域
      $largeImg.hide()
      $largeImgContainer.hide()
    })
    
  }
 
  /* 10. 当鼠标悬停在某个小图上,在上方显示对应的中图*/
  function hoverMiniImg () {
    $('#icon_list>li').hover(function () {
      $img = $(this).children()
      $img.addClass('hoveredThumb')
      //显示对应的中图
      var src = $img.attr('src').replace('.jpg','-m.jpg')
      $('#mediumImg').attr('src',src)
    }, function () {
      $(this).children().removeClass('hoveredThumb')
    })
  }
 
  // 9. 点击向右/左, 移动当前展示商品的小图片
  function moveMiniImg () {
    
    var $as = $('#preview>h1>a')
    var $backward = $as.first()
    var $forward = $as.last()
    var $Ul = $('#icon_list')
    var imgCount = $Ul.children('li').length 
    var SHOW_COUNT = 5
    var moveCount = 0
    var liWidth = $Ul.children(':first').width()
  
    //初始化按钮
    if(imgCount > SHOW_COUNT) {
      $forward.attr('class','forward')
    }
    
    //点击向右
    $forward.click(function () {
      //判断当前可否向右移动
      if(imgCount-SHOW_COUNT === moveCount){
        return 
      }
      //更新移动次数
      moveCount++
      //更新向左的按钮
      $backward.attr('class','backward')
      //更新向右的按钮
      if(imgCount-SHOW_COUNT === moveCount){
         $forward.attr('class','forward_disabled')
      }
      //移动ul
      $Ul.css({
        left: -moveCount * liWidth
      })
    })
   
    //点击向左
    $backward.click(function () {
      //判断当前可否向左移动
      if(moveCount === 0){
        return 
      }
      //更新移动次数
      moveCount--
      //更新向右的按钮
      $forward.attr('class','forward')
      //更新向左的按钮
      if(moveCount === 0){
         $backward.attr('class','backward_disabled')
      }
      //移动ul
      $Ul.css({
        left: -moveCount * liWidth
      })
    })
  
  }
 
  /* 8. 点击切换产品选项 (商品详情等显示出来)*/
  function clickProductTabs () {
    var $lis = $('#product_detail>ul>li')
    var $contents = $('#product_detail>div:gt(0)')
    $lis.click(function () {
      $lis.removeClass('current')
      this.className = "current"
      //隐藏所有contents
      $contents.hide()
      //显示当前对应的contents
      var index = $(this).index()
      $contents.eq(index).show()
    })
  }
 
  /* 7. 鼠标移入移出切换显示迷你购物车*/
 function hoverMinicart () {
   $('#minicart').hover(function () {
     this.className = "minicart"
     $(this).children(':last').show()
   }, function () {
     this.className = ""
     $(this).children(':last').hide()
   })
 }
  
  /* 6. 点击切换地址tab*/
  function clickTabs () {
    var $tabs =  $('#store_tabs')
    $('#store_tabs>li').click(function () {
      $tabs.children('li').attr('class','')
      $(this).attr('class','hover')
    })
  }
  
  /* 5. 鼠标移入移出切换地址的显示隐藏*/
  function address () {
    var $select = $('#store_select')
    $select
    .hover(function () {  //移入显示
      $(this).children(':gt(0)').show()
    }, function () {  //移入隐藏
      $(this).children(':gt(0)').hide()
    })
    $('#store_close').click( function () {  //点击x图标隐藏
      $select.children(':gt(0)').hide()
    })
  }
 
  /*  4. 点击显示或者隐藏更多的分享图标*/
  function share () {
    var $shareMore = $('#shareMore')
    var $perent = $shareMore.parent() 
    var $sib = $shareMore.prevAll('a:lt(2)')
    var $b = $shareMore.children('b')
    var isOpen = false  //标识是否位打开状态
    
    $shareMore.click(function () {
      if(isOpen) {
        $perent.css('width',155)
        $sib.hide()
        $b.removeClass('backword')
      } else {
        $perent.css('width',200)
        $sib.show()
        $b.addClass('backword')
      }
      isOpen = !isOpen
    })
  }
  
  /*  3. 输入搜索关键字, 列表显示匹配的结果*/
  function search () {
    $('#txtSearch')
    .on('focus keyup', function () { 
      //输入框有文本才显示列表
      var txt = this.value.trim()
      if(txt){
        $('#search_helper').show()
      }
    })
    .blur(function () {  //失去焦点隐藏列表
       $('#search_helper').hide()
    })
  }
  
  /*  2. 鼠标移动切换二级导航菜单的切换显示和隐藏*/
  function hoverSubMenu () {
    $('#category_items>div').hover(function () {  //移入显示
      $(this).children(':last').show()
    }, function () {  //移出隐藏
      $(this).children(':last').hide()
    })
  }
  
  /*
  1. 鼠标移入显示,移出隐藏
           目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
  */
  function showhide () {
    
    $('[name=show_hide]').hover(function () {  //移入显示
      var id = this.id + '_items'
      $('#'+id).show()
    }, function () {  //移出隐藏
      var id = this.id + '_items'
      $('#'+id).hide()
    }) 
  }
  
})
