// 初始化地图，中心设置为王店镇
var map = new AMap.Map('map', {
  center: [120.71437, 30.628128],
  zoom: 13,
  resizeEnable: true
});

// 模拟加载进度条的函数（例如通过API加载地图或其他资源）
function simulateLoading() {
  var progress = 0;
  var interval = setInterval(function() {
    progress += 5;  // 增加进度
    document.getElementById('progressBar').style.width = progress + '%'; // 更新进度条宽度

    // 如果进度条达到100%，则停止模拟并显示地图
    if (progress >= 100) {
      clearInterval(interval);  // 停止模拟加载
      document.getElementById('loadingPage').style.display = 'none';  // 隐藏加载页面
      loadHandDrawnMap();  // 加载手绘地图
    }
  }, 50);  // 每50ms增加进度
}

// 加载手绘地图
function loadHandDrawnMap() {
  var handDrawnLayer = new AMap.ImageLayer({
    url: 'https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E6%98%93%E5%88%B6%E5%9C%B0%E5%9B%BE%E8%BE%93%E5%87%BA_202505271636.png', // 你的手绘地图URL
    bounds: new AMap.Bounds([120.60028006839601, 30.57955982262249], [120.77344532618542, 30.70266154808083]), // 地图的边界坐标
    zooms: [2, 18],
    zIndex: 100
  });

  map.add(handDrawnLayer);  // 在地图上添加手绘地图图层
}

// 模拟加载过程，开始进度条和地图加载
simulateLoading();



// 创建行政区划查询实例，参数设置：
// subdistrict: 0 表示不查询下级区域，只获取当前区域的边界；
// extensions: 'all' 请求详细信息，包括边界数据
/*
AMap.plugin("AMap.DistrictSearch", function () {
  var district = new AMap.DistrictSearch({
    extensions: "all", //返回行政区边界坐标等具体信息
    level: "district", //设置查询行政区级别为区
  });
  district.search("秀洲区", function (status, result) {
    var bounds = result.districtList[0].boundaries; //获取朝阳区的边界信息
    if (bounds) {
      for (var i = 0; i < bounds.length; i++) {
        //生成行政区划 polygon
        var polygon = new AMap.Polygon({
          map: map, //显示该覆盖物的地图对象
          strokeWeight: 1, //轮廓线宽度
          path: bounds[i], //多边形轮廓线的节点坐标数组
          fillOpacity: 0.7, //多边形填充透明度
          fillColor: "#CCF3FF", //多边形填充颜色
          strokeColor: "#CC66CC", //线条颜色
        });
      }
    }
  });
});
*/

// 全局变量保存当前弹窗对应的目的地信息（经纬度和名称）
var currentDestination = null;

// 景点数据
// 更新：地点数据增加 markerIcon 属性，每个地点使用不同的图标图片
// ---------------------------
var locations = [
  {
    name: "梅里聚宝·慢活建林", 
    lnglat: [120.68869523045508, 30.598497606732904],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9D%A6%E5%85%8Bicon.png",  // 请替换为你实际上传的图片地址
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E7%B1%B3%E7%A7%911.jpg",
      "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E7%B1%B3%E7%A7%912.jpg",
            "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E7%B1%B3%E7%A7%913.jpg"],
    description:"“游聚宝湾里，品原乡滋味”。建林村依托聚宝湾、米科军旅园等特色景区，重点强调农文旅结合，打造特色鲜明的梅文化、军事文化、研学文化，发挥农家乐、民宿、农产品、当地特产交易街等业态，因地制宜推动乡村旅游、休闲农业、农村电商等乡村产业向广度深度发展。"
  },
  {
    name: "田园牧风·丰产红联", 
    lnglat: [120.72085798916904, 30.66213410784623],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%A5%B6%E7%89%9B.png",  // 不同图标地址
    images: [
      "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%89%9B%E8%8A%B1%E8%8A%B1%E5%B0%8F%E9%95%870",
      "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%89%9B%E8%8A%B1%E8%8A%B1%E5%B0%8F%E9%95%871",
      "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%89%9B%E8%8A%B1%E8%8A%B1%E5%B0%8F%E9%95%872",
      "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%89%9B%E8%8A%B1%E8%8A%B1%E5%B0%8F%E9%95%873"
    ],
    description: "“游奶牛牧场，享田园牧歌”。红联村依托东兴奶牛场，打造网红“牛花花小镇”。在这里，你不仅可以与奶牛进行亲密互动，更能在“牛欢欢乐园”“牛花花露营地”“牛香香餐厅”等丰富配套中享受惬意时光。"
  },
  {
    name: "物流枢纽·临空马桥", 
    lnglat: [120.74044511487661, 30.687078105462028],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%89%A9%E6%B5%81icon.png",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%89%A9%E6%B5%81icon.png"],
    description:"“赏花鸟之乐，观产业强村”。花鸟港村强调农业产业链向农旅结合方向的眼神，以规模一产为个性要素对小芽儿蔬菜基地研学功能板块进行提升，凸显花鸟港村农业引领的特质。"
  },
  {
    name: "研学诗旅·耕读镇中", 
    lnglat: [120.723018230251, 30.61715359346125],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%A0%94%E5%AD%A6icon%E3%80%81.png",  // 请替换为你实际的图标地址
    images:["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E9%95%87%E4%B8%AD1.jpg",
   "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E9%95%87%E4%B8%AD2.jpg",],
    description:"“镇中村通过优化游客中心、星空营地、博学鸿词研学馆、竹垞雅集、古藤书屋、共享食堂等接电，以农耕研学、共富运营位个性要素探索无人机智慧农业生产模式、青青乐地学生农耕课程实践以及竹垞雅集领悟耕读传家文化等活动，开展“鸳湖少年乡野四季行”系列主题研学，把传统民俗文化与自然科学知识有机结合，打造农耕研学目的地。"
  },

  {
    name: "风雅梅里·归隐南梅", 
    lnglat: [120.71799915161204, 30.591805465028973],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E6%A2%85%E8%8A%B1icon.png",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E6%A2%85%E5%9B%AD1",
            "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E6%A2%85%E5%9B%AD2.jpg"],
    description:"南梅村通过打造十里绿廊、横港记忆、口袋游园、青创果园、南梅乐园、丛林拓展、闲云望湖等节点，以隐居氛围、横港记忆为个性要素建设艺术文化体验基地，打造南梅归隐特质，构建“梅好未来生活圈”。"
  },
  {
    name: "智慧共治·幸福宝华", 
    lnglat: [120.71863803850139, 30.645950096243753],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E8%A5%BF%E7%93%9Cicon.png",// 请替换为你实际的图标地址
  images:[],
    description:"“尝瓜果缤纷，观农业社区”。宝华村建有王店首个社区化管理农民集聚区，重点解决农民集聚区与社会化管理的矛盾问题，探索农村安置小区智慧治理新模式，凸显宝华村治理为民的特质，构建五治融合的乡村治理体系，确保未来乡村共富和谐发展。"
  },
    {
    name: "世外萄园·共富庄安", 
    lnglat: [120.74063803850139, 30.650950096243753],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BB%BF%E8%91%A1%E8%90%84.png",// 请替换为你实际的图标地址
  images:[],
    description:"“享萄园采摘，品田园之乐”。庄安村有着3000多亩的葡萄种植面积，是有名的葡萄共富村。庄安以葡萄产业为个性要素建设葡萄综合服务中心，对葡萄相关IP进行提升，打造庄安葡萄品牌，发展本地物流、冷链冷藏，形成产、供、销一体的运作模式，眼神产业链条，吸引大学生会想创业，培养农播客，发展共富直播间。"
  },
    {
    name: "创客新乡·汇聚凤珍", 
    lnglat: [120.75063803850139, 30.619950096243753],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%B0%8F%E5%AE%B6%E7%94%B5icon.png",// 请替换为你实际的图标地址
  images:[],
    description:""
  },
    {
    name: "诗书耕读·求学庆丰", 
    lnglat: [120.68063803850139, 30.620050096243753],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%8A%B6%E5%85%83icon.png",// 请替换为你实际的图标地址
  images:[],
    description:""
  },
    {
    name: "品重梅溪·趣游王店", 
    lnglat: [120.71463803850139, 30.635950096243753],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BB%BF%E8%89%B2%E4%B9%A1%E6%9D%91icon.png",// 请替换为你实际的图标地址
  images:[],
    description:""
  },
];


// 全局存储 marker（如果需要后续操作）
var markers = [];

// 遍历景点数据，在地图上添加标记
// ---------------------------
// 在地图上添加地点 marker，并绑定点击事件显示轮播弹窗
// ---------------------------
locations.forEach(function(loc) {
  var markerContent = '<div class="custom-content-marker marker-theme-1">' +
                        '<div class="marker-icon" style="background-image: url(' + (loc.markerIcon || "https://s21.ax1x.com/2025/03/13/pEUDRdx.png") + ');"></div>' +
                        '<div class="marker-label">' + loc.name + '</div>' +
                      '</div>';
  var marker = new AMap.Marker({
    position: loc.lnglat,
    map: map,
    content: markerContent,
    offset: new AMap.Pixel(-20, -20)
  });

  // 点击 marker 时，调用 openModal 函数，传入地点名称、图片数组及描述信息
  marker.on('click', function() {
    openModal(loc.name, loc.images, loc.description, loc.lnglat);
  });
});



// 打开模态框
function openModal(title, images, desc, dest) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalImg").src = image || ""; // 若无图片则为空
  document.getElementById("modalDesc").innerText = desc || "";
  document.getElementById("modalOverlay").style.display = "flex";
}


// ---------------------------
// 全局变量：当前轮播页索引
// ---------------------------
var currentSlide = 0;

// ---------------------------
// 打开弹窗函数：接收标题、图片数组和描述
// ---------------------------
// 修改 openModal 函数，增加 dest 参数保存当前目的地
function openModal(title, images, desc, dest) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalDesc").innerText = desc || "";
  
  // 保存当前目的地信息到全局变量（包括经纬度和名称）
  currentDestination = { lnglat: dest, name: title };
  
  // 获取轮播容器，清空之前的内容
  var carousel = document.getElementById("carousel");
  carousel.innerHTML = "";
  
  // 如果存在图片数组，则为每个图片生成一个轮播项
  if (images && images.length > 0) {
    images.forEach(function(imgUrl) {
      var item = document.createElement("div");
      item.className = "carousel-item";
      var img = document.createElement("img");
      img.src = imgUrl;
      item.appendChild(img);
      carousel.appendChild(item);
    });
    // 重置当前轮播页为第 0 页
    currentSlide = 0;
    updateCarousel();
  } else {
    // 没有图片时显示占位内容
    carousel.innerHTML = "<div class='carousel-item'><img src='' alt='无图片'></div>";
  }
  
  document.getElementById("modalOverlay").style.display = "flex";
}

// ---------------------------
// 更新轮播显示，根据 currentSlide 更新轮播容器的偏移量
// ---------------------------
function updateCarousel() {
  var carousel = document.getElementById("carousel");
  // 将轮播容器平移，显示当前轮播页（百分比宽度）
  carousel.style.transform = "translateX(-" + (currentSlide * 100) + "%)";
}

// ---------------------------
// 绑定左右切换按钮事件
// ---------------------------
document.getElementById("prevBtn").addEventListener("click", function(e) {
  e.stopPropagation();
  if (currentSlide > 0) {
    currentSlide--;
    updateCarousel();
  }
});
document.getElementById("nextBtn").addEventListener("click", function(e) {
  e.stopPropagation();
  var carousel = document.getElementById("carousel");
  var totalSlides = carousel.children.length;
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateCarousel();
  }
});

// 新增：导航按钮点击后调用的函数
function startNavigation() {
  // 判断是否有目的地信息
  if (!currentDestination) return;
  var dest = currentDestination.lnglat;
  var name = currentDestination.name;
  
  // 构造高德地图导航链接（格式：经度,纬度,名称）
  // 这里 mode=car 表示驾车导航，可根据需求调整为步行等模式
  var url = "https://uri.amap.com/navigation?to=" 
            + dest[0] + "," + dest[1] + "," + encodeURIComponent(name)
            + "&mode=car&policy=1&src=web&coordinate=gaode&callnative=0";
  
  // 打开新窗口或跳转至该链接
  window.open(url, "_blank");
}

// 关闭模态框
function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}


// 模拟的商家数据（可以通过后端接口或 API 动态获取）
var playItems = [
  {
    name: "牛花花小镇", 
    lnglat: [120.75085798916904, 30.67613410784623],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%A5%B6%E7%89%9B.png",  // 不同图标地址
    images: [
      "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%89%9B%E8%8A%B1%E8%8A%B1%E5%B0%8F%E9%95%870",
      "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%89%9B%E8%8A%B1%E8%8A%B1%E5%B0%8F%E9%95%871",
      "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%89%9B%E8%8A%B1%E8%8A%B1%E5%B0%8F%E9%95%872",
      "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%89%9B%E8%8A%B1%E8%8A%B1%E5%B0%8F%E9%95%873"
    ],
    description: "牛花花小镇位于秀洲区王店镇红联村。这里有全市唯一的奶牛场——东兴奶牛场，游客可以在此近距离与奶牛互动，品尝东兴奶吧的网红奶制品。牛欢欢乐园拥有大型无动力游乐设施，是遛娃的好去处。牛花花露营地有免费休息的帐篷，可以在此尽情放松躺平。附近还有牛多多停车场、小地方牛花花酒店等配套设施，满足您的一站式休闲旅游体验。"
  },
    {
    name: "米科军旅园", 
    lnglat: [120.70369523045508, 30.608497606732904],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9D%A6%E5%85%8Bicon.png",  // 请替换为你实际上传的图片地址
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E7%B1%B3%E7%A7%911.jpg",
      "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E7%B1%B3%E7%A7%912.jpg",
            "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E7%B1%B3%E7%A7%913.jpg"],
    description:"米科军旅园占地面积500多亩，建筑面积2.6万平方米，拥有各类退役卫国武器展品1500余件，涵盖海、陆、空、火箭四大军种。米科军旅园由全民国防教育主题园和军旅体验园两大区块组成，是以普及全民国防教育为园宗旨；以修复和展陈大型卫国武器、讲述红色故事为特色主题，弘扬伟大建党精神的国防教育基地、爱国主义教育基地。"
  },
  
  
  {
    name: "曝书亭", 
    lnglat: [120.7244511487661, 30.617078105462028],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E4%BA%AD%E5%AD%90icon.png",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E6%9B%9D%E4%B9%A6%E4%BA%AD1"],
    description:"曝书亭，一座浸润着书香与历史气息的江南园林，静卧于秀洲区王店镇广平路的南端。原名为“竹垞”，是清初著名文人朱彝尊的故居，始建于清康熙三十五年（1696年）。“竹垞”之名，取自朱彝尊的号。曝书亭原是竹垞内的一座建筑物，因朱彝尊著作《曝书亭集》称名于世，后人遂以曝书亭作为园林名。"
  },
   {
    name: "南梅里营地", 
    lnglat: [120.72063803850139, 30.590950096243753],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E8%90%A5%E5%9C%B0icon.png",// 请替换为你实际的图标地址
  images:["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E5%8D%97%E6%A2%85%E9%87%8C%E8%90%A5%E5%9C%B01.jpg",
         "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E5%8D%97%E6%A2%85%E9%87%8C%E8%90%A5%E5%9C%B02.jpg",
         "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E5%8D%97%E6%A2%85%E9%87%8C%E8%90%A5%E5%9C%B03.jpg"],
    description:"南梅里营地位于王店镇南梅村，总占地面积约30亩。在这里，可以感受当下最流行的轻奢露营，两手空空来即可，露营所需物资营地都已贴心为你准备好。还有趣味卡丁车、小龙虾垂钓、油桶小火车、无动力乐园、萌宠乐园等等项目可以体验，让你嗨到忘记“无聊”两个字怎么写！"
  },
    {
    name: "王家兜古梅园", 
    lnglat: [120.71799915161204, 30.586805465028973],
    markerIcon: "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E6%A2%85%E8%8A%B1icon.png",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E6%A2%85%E5%9B%AD1",
            "https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E5%9B%BE%E7%89%87%E7%B4%A0%E6%9D%90/%E6%A2%85%E5%9B%AD2.jpg"],
    description:"王店与梅花的渊源由来已久。天福二年（公元937年），时任嘉兴镇遏使的王逵因喜爱梅花，遂在梅溪河两岸种满梅树，河的南面开辟百亩梅园，这个梅园就是现在的南梅村王家兜。"// 请替换为你实际的图标地址
  },
  
  
];






var foodItems = [
  {
    name: "东兴鲜奶吧",
    logo:"https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E4%B8%9C%E5%85%B4%E9%B2%9C%E5%A5%B6%E5%90%A7.png",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E4%B8%9C%E5%85%B4%E9%B2%9C%E5%A5%B6%E5%90%A7.png","https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E4%B8%9C%E5%85%B4%E9%B2%9C%E5%A5%B6%E5%90%A7.png"],
    description: "来了东兴奶牛场，怎么能不带点奶制品回去呢？在东兴鲜奶吧，可以买到东兴的各种新鲜好奶喝奶制品，浓稠酸奶、新鲜牛奶、杨枝甘露、牛奶小方……",
    contact: "139xxxxxx",
    latLng: [120.706695, 30.608497] // 经纬度
  },
  {
    name: "阿炳饭店",
    images:["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E9%98%BF%E7%82%B3%E9%A5%AD%E5%BA%97.png"],
    description: "阿炳饭店自1987年开始营业，靠着好吃和实惠，牢牢抓住了王店人的胃，在秀洲众多小饭店里闯出了一片小天地。",
    contact: "138xxxxxx",
    latLng: [120.755857, 30.676134]
  },
    {
    name: "陈记桑拿鸡",
    images:["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E9%99%88%E8%AE%B0%E6%A1%91%E6%8B%BF%E9%B8%A1.jpg"],
    description: "高端的食材往往只需要最朴素的烹饪方式，桑拿的做法保留了鸡的嫌弃。桑拿鸡是这里的招牌，肌肉肉质鲜嫩细化，保留了原汁原味，一口眉毛都鲜掉。",
    contact: "137xxxxxx",
    latLng: [120.735857, 30.670134]
  },
    {
    name: "阿华面馆",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E9%98%BF%E5%8D%8E%E9%9D%A2%E9%A6%86.png"],
    description: "牛蛙选材每只重量不少于八两，先热锅冷油爆炒，放一边小火慢煮，然后把烫过的面条放锅里搅拌入味后，再撒上红辣椒和白芝麻，一碗色香味俱全的牛蛙面就完成了。",
    contact: "137xxxxxx",
    latLng: [120.735857, 30.670134]
  },
    {
    name: "花溪牛肉粉",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E8%8A%B1%E6%BA%AA%E7%89%9B%E8%82%89%E7%B2%89.png"],
    description: "一碗花溪牛肉粉添上开胃的泡酸菜，一碗热气腾腾、色香味俱全的牛肉粉跃然呈现。",
    contact: "137xxxxxx",
    latLng: [120.735857, 30.670134]
  },
  {
    name: "王店鸡蛋糕",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E7%8E%8B%E5%BA%97%E9%B8%A1%E8%9B%8B%E7%B3%95.png"],
    description: "王店的鸡蛋糕讲究面糊的调和。发酵好的面糊搭配软糯甜香的赤豆内馅，一口咬开，热乎乎且略微烫口的豆沙在口中融化，绵蜜而又特别的口味瞬间在味蕾绽放。",
    contact: "137xxxxxx",
    latLng: [120.735857, 30.670134]
  },
  {
    name: "王店鸡蛋汉堡",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E7%8E%8B%E5%BA%97%E9%B8%A1%E8%9B%8B%E6%B1%89%E5%A0%A1.png"],
    description: "王店的鸡蛋汉堡香而不腻，鲜咸适中，打上一颗新鲜的鸡蛋，往中间放上满满当当的鲜肉沫、撒上葱花，倒上面糊，翻面，反复翻转几次，大约十几分钟后，香喷喷、金灿灿的鸡蛋汉堡就新鲜出炉了。",
    contact: "137xxxxxx",
    latLng: [120.735857, 30.670134]
  },
    {
    name: "道上食咖",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E9%81%93%E4%B8%8A%E9%A3%9F%E5%92%96.png"],
    description: "走进位于王店镇的道上食咖，抬头便能看到绿皮火车开过，轰鸣的声音在耳畔回响。一边喝咖啡，一边看绿皮火车驶过，仿佛时光隧道到眼前晃过，氛围感瞬间拉满～",
    contact: "137xxxxxx",
    latLng: [120.735857, 30.670134]
  },
  {
    name: "吁先生咖啡",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E5%90%81%E5%85%88%E7%94%9F%E5%92%96%E5%95%A1.png"],
    description: "别具特色的木质走廊，明亮宽敞的阅览区，休闲惬意的咖啡吧……走进王店镇竹垞智慧书房，时尚又不失典雅的装潢令人眼前一亮。落地窗边，书架上满满当当的图书，成为了市民的拍照打卡点。",
    contact: "136xxxxxx",
    latLng: [120.745857, 30.686134]
  },
    {
    name: "乌桕农场",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E4%B9%8C%E6%A1%95%E5%86%9C%E5%9C%BA.png"],
    description: "乌桕农场，由闲置房屋改造而成，名字“乌桕”倒念即“旧屋”，别具巧思。这里不仅有咖啡，还有大面积野营地，融合开放的空间体现主理人多维融合经营理念。",
    contact: "137xxxxxx",
    latLng: [120.735857, 30.670134]
  },
    {
    name: "鹊茶",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E9%B9%8A%E8%8C%B6%E5%92%96%E5%95%A1.png"],
    description: "鹊茶是一家新中式咖啡店，店内提供各式经典与创新的咖啡饮品、果茶饮品。鹊茶坚持选用优质原材料制作每一杯饮品，确保每一杯饮品都能呈现出最佳口感和风味。",
    contact: "137xxxxxx",
    latLng: [120.735857, 30.670134]
  },
  {
    name: "爱骑咖啡",
    images: ["https://wangdian-wenlv.oss-cn-beijing.aliyuncs.com/%E7%BE%8E%E9%A3%9F%E5%92%96%E5%95%A1/%E7%88%B1%E9%AA%91%E5%92%96%E5%95%A1.png"],
    description: "帅气的机车、醇香的咖啡、古老的房屋、潮流的布置……王店镇建林村的“爱骑咖啡馆”这家“村咖”有意思，是“小资”打卡点也是“摩友”聚居地。",
    contact: "137xxxxxx",
    latLng: [120.735857, 30.670134]
  },
];



// 渲染畅玩与美食商家
function renderItems(section, items) {
  const container = document.getElementById(section + 'Items');
  container.innerHTML = ''; // 清空现有内容
  items.forEach(function(item, index) {
    const div = document.createElement('div');
    div.className = 'section-item';
    div.innerHTML = `
      <img src="${item.images[0]}" alt="${item.name}">
      <p>${item.name}</p>
    `;
    div.onclick = function() {
      openMerchantModal(item);
    };
    container.appendChild(div);
  });
}

// 点击“畅游”和“美食”时展开相应内容
document.getElementById('playSection').onclick = function() {
  event.stopPropagation(); // 阻止事件冒泡，防止触发 document 的点击事件
  const playItemsContainer = document.getElementById('playItems');
  playItemsContainer.classList.toggle('open');
  renderItems('play', playItems);
};

document.getElementById('foodSection').onclick = function() {
  const foodItemsContainer = document.getElementById('foodItems');
  foodItemsContainer.classList.toggle('open');
  renderItems('food', foodItems);
};
// 点击页面其他地方时收回展开的菜单
document.addEventListener('click', function(event) {
  if (currentOpenSection === 'play' && !event.target.closest('#playSection')) {
    document.getElementById('playItems').classList.remove('open');
    currentOpenSection = null;
  }
  if (currentOpenSection === 'food' && !event.target.closest('#foodSection')) {
    document.getElementById('foodItems').classList.remove('open');
    currentOpenSection = null;
  }
});

// 新增全局变量：当前商家轮播页索引
var currentMerchantSlide = 0;
// 更新商家轮播显示
function updateMerchantCarousel() {
  var merchantCarousel = document.getElementById("merchantCarousel");
  merchantCarousel.style.transform = "translateX(-" + (currentMerchantSlide * 100) + "%)";
}

// 修改 openMerchantModal 函数：将商家图片改为多图轮播
function openMerchantModal(item) {
  // 设置商家文本信息
  document.getElementById('merchantName').innerText = item.name;
  document.getElementById('merchantDescription').innerText = item.description;
  document.getElementById('merchantContact').innerText = item.contact;

  // 设置商家导航按钮的点击事件，传入经纬度和名称
  document.getElementById('merchantNavButton').onclick = function() {
    startMerchantNavigation(item.latLng, item.name);
  };

  // 获取商家轮播容器并清空之前内容
  var merchantCarousel = document.getElementById("merchantCarousel");
  merchantCarousel.innerHTML = "";

  // 判断是否存在多张图片，如果没有则使用单张图片封装为数组
  var images = [];
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    images = item.images;
  } else if (item.image) {
    images = [item.image];
  } else {
    images = [""];
  }

  // 动态生成每个轮播项
  images.forEach(function(imgUrl) {
    var itemDiv = document.createElement("div");
    itemDiv.className = "carousel-item";
    var img = document.createElement("img");
    img.src = imgUrl;
    itemDiv.appendChild(img);
    merchantCarousel.appendChild(itemDiv);
  });

  // 重置商家轮播页索引，并更新显示
  currentMerchantSlide = 0;
  updateMerchantCarousel();

  // 显示商家详情弹窗
  document.getElementById('merchantModal').style.display = 'flex';
}

// 商家轮播左右按钮事件绑定
document.getElementById("merchantPrevBtn").addEventListener("click", function(e) {
  e.stopPropagation();
  if (currentMerchantSlide > 0) {
    currentMerchantSlide--;
    updateMerchantCarousel();
  }
});
document.getElementById("merchantNextBtn").addEventListener("click", function(e) {
  e.stopPropagation();
  var merchantCarousel = document.getElementById("merchantCarousel");
  var totalSlides = merchantCarousel.children.length;
  if (currentMerchantSlide < totalSlides - 1) {
    currentMerchantSlide++;
    updateMerchantCarousel();
  }
});


// 关闭商家详情弹窗
function closeMerchantModal() {
  document.getElementById('merchantModal').style.display = 'none';
}
// 启动商家导航
function startMerchantNavigation(latLng, name) {
  const url = "https://uri.amap.com/navigation?to=" 
            + latLng[0] + "," + latLng[1] + "," + encodeURIComponent(name)
            + "&mode=car&policy=1&src=web&coordinate=gaode&callnative=0";
  window.open(url, '_blank');
}


// ---------------------------
// 新增：推荐路线功能（不再绘制动态路线，仅显示路线说明弹窗）
// ---------------------------
var currentRouteType = null; // 保存当前选中的路线类型

// 定义推荐路线详情数据，包含路线文字说明和图片URL（示例数据）
var routeDetails = {
  south: {
    explanation: "这是南线之旅路线，途经A, B, C，适合喜欢自然风光的游客。",
    image: "https://example.com/south_route.jpg" // 替换为实际图片地址
  },
  north: {
    explanation: "这是北线之旅路线，途经D, E, F，适合探索历史文化的游客。",
    image: "https://example.com/north_route.jpg" // 替换为实际图片地址
  }
};

// 切换右侧推荐路线菜单显示与隐藏
function toggleRouteMenu() {
  var routeMenu = document.getElementById("routeMenu");
  routeMenu.style.display = (routeMenu.style.display === "none" || routeMenu.style.display === "") ? "block" : "none";
}

// 切换显示或隐藏推荐路线详情弹窗（用于显示路线说明文字及图片）
function toggleRouteModal(show) {
  var modal = document.getElementById("routeModal");
  modal.style.display = show ? "flex" : "none";
}

// 点击推荐路线子项后执行
function selectRoute(routeType) {
  // 如果当前选中的路线与点击的一致，则隐藏路线说明弹窗
  if (currentRouteType === routeType) {
    toggleRouteModal(false);
    currentRouteType = null;
    return;
  }
  // 更新当前选中的路线类型
  currentRouteType = routeType;
  var details = routeDetails[routeType];
  
  // 设置弹窗中的标题、说明文字及路线图片
  document.getElementById("routeTitle").innerText = (routeType === "south" ? "南线之旅" : "北线之旅");
  document.getElementById("routeExplanation").innerText = details.explanation;
  document.getElementById("routeImage").src = details.image || "";
  
  // 弹出路线说明弹窗
  toggleRouteModal(true);
}