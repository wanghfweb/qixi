var container = $("#content");
var visualWidth = container.width();
var visualHeight=container.height();
var swipe = Swipe(container);
// 页面滚动到指定的位置
function scrollTo(time, proportionX) {
    var distX = container.width() * proportionX;
    swipe.scrollTo(distX, time);
}
//配置参数
var confi = {
    keepZoomRatio: false,
    layer: {
        "width": "100%",
        "height": "100%",
        "top": 0,
        "left": 0
    },
    audio: {
        enable: true,
        playURl: "res/happy.wav",
        cycleURL: "res/circulation.wav"
    },
    setTime: {
        walkToThird: 6000,
        walkToMiddle: 6500,
        walkTobridge: 1500,
        bridgeWalk: 1500,
        waitRotate: 1000,
        waitFlower: 800
    },
    snowflakeURl: ["images/snowflake/snowflake1.png",
        "images/snowflake/snowflake2.png",
        "images/snowflake/snowflake3.png",
        "images/snowflake/snowflake4.png",
        "images/snowflake/snowflake5.png",
        "images/snowflake/snowflake6.png"]
};
// 动画结束事件
var animationEnd = (function() {
    var explorer = navigator.userAgent;
    if (~explorer.indexOf('WebKit')) {
        return 'webkitAnimationEnd';
    }
    return 'animationend';
})();
// 获取数据
var getValue = function(className) {
    var $elem = $('' + className + '')
    // 走路的路线坐标
    return {
        height: $elem.height(),
        top: $elem.position().top
    };
};
//背景音乐///
//////////
// 音乐配置
var audioConfig = {
    enable: confi.audio.enable, // 是否开启音乐
    playURl: confi.audio.playURl, // 正常播放地址
    cycleURL: confi.audio.cycleURL // 正常循环播放地址
};

/////////
//背景音乐 //
/////////
function Hmlt5Audio(url, isloop) {
    var audio = new Audio(url);
    audio.autoPlay = true;
    audio.loop = isloop || false;
    audio.play();
    return {
        end: function(callback) {
            audio.addEventListener('ended', function() {
                callback();
            }, false);
        }
    };
}

//第二个页面
//小鸟
var bird = {
    elem: $(".bird"),
    fly: function() {
        this.elem.addClass("birdFly");
        this.elem.transition({
                right: visualWidth
            },
            15000, "linear")
    }
};

function doorAction(left,right,time){
    var $door=$('.door');
    var doorLeft=$('.door-left');
    var doorRight=$('.door-right');
    var defer= $.Deferred();
    var count=2;
//            等开门/关门完成
    var complete=function(){
        if(count==1){
            defer.resolve();
            return;
        }
        count--;
    };
//            第三方插件让门动
    doorLeft.transition({
        'left':left
    },time,complete);
    doorRight.transition({
        'left':right
    },time,complete);
    return defer;
}
//        开门
function openDoor(){
    return doorAction('-50%','100%',2000);
}
//        关门
function closeDoor(){
    return doorAction('0%','50%',2000);
}
//        灯动画
var lamp={
    elem:$('.b_background'),
    bright:function(){
        this.elem.addClass('lamp-bright')
    },
    dark:function(){
        this.elem.removeClass('lamp-bright')
    }
};


var instanceX;

/**
 * 小孩走路
 * @param {[type]} container [description]
 */
//封装小男孩的动作获取起始位置，然后封装开始运动和暂停运动的函数，移动距离的函数，和封装移动到固定位置的函数
//采用了jquery的$.Deferred()进行封装
function BoyWalk() {

    var container = $("#content");
    // 页面可视区域
    var visualWidth = container.width();
    var visualHeight = container.height();

    // 获取数据
    var getValue = function(className) {
        var $elem = $('' + className + '');
        // 走路的路线坐标
        return {
            height: $elem.height(),
            top: $elem.position().top
        };
    };
    // 路的Y轴
    var pathY = function() {
        var data = getValue('.a_background_middle');
        return data.top + data.height / 2;
    }();
    var $boy = $("#boy");
    var boyWidth = $boy.width();
    var boyHeight = $boy.height();
    // 修正小男孩的正确位置
    $boy.css({
        top: pathY - boyHeight + 25
    });

    // 暂停走路
    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }

    // 恢复走路
    function restoreWalk() {
        $boy.removeClass('pauseWalk');
    }

    // css3的动作变化
    function slowWalk() {
        $boy.addClass('slowWalk');
    }

    // 用transition做运动
    function stratRun(options, runTime) {
        var dfdPlay = $.Deferred();
        // 恢复走路
        restoreWalk();
        // 运动的属性
        $boy.transition(
            options,
            runTime,
            'linear',
            function() {
                dfdPlay.resolve(); // 动画完成
            });
        return dfdPlay;
    }

    // 开始走路
    function walkRun(time, dist, disY) {
        time = time || 3000;
        // 脚动作
        slowWalk();
        // 开始走路
        var d1 = stratRun({
            'left': dist + 'px',
            'top': disY ? disY : undefined
        }, time);
        return d1;
    }
    //走进商店
    function walkToShop(runTime){
        var defer=$.Deferred();
        var doorObj=$('.door');
        //门的坐标
        var offsetDoor=doorObj.offset();
        var doorOffsetLeft=offsetDoor.left;
        //小男孩的当前坐标
        var offsetBoy=$boy.offset();
        var boyOffsetLeft=offsetBoy.left;
        //需要移动的坐标
        instanceX=(doorOffsetLeft+doorObj.width()/2)-(boyOffsetLeft+$boy.width()/2);
        //开始走路
        var walkPlay=stratRun({
            transform:'translateX('+instanceX+'px),scale(0.3,0.3)',
            opacity:0.1
        },runTime);
        //走路完毕
        walkPlay.done(function(){
            $boy.css('opacity',0);
            defer.resolve();
        });
        return defer;
    }
    //取花
    function takeFlower() {
        //增加延时等待效果
        var defer = $.Deferred();
        setTimeout(function() {
            //取花
            $boy.addClass('slowFlolerWalk')
            defer.resolve()
        }, 1000);
        return defer
    }
    //走出商店
    function walkOutShop(runTime) {
        var defer = $.Deferred();
        restoreWalk();
        //开始走路
        var walkPlay = stratRun({
            transform: 'translateX(' + instanceX + 'px),scale(1,1)',
            opacity: 1
        }, runTime);
        //走路完毕
        walkPlay.done(function() {
            defer.resolve();
        });
        return defer;
    }
    // 计算移动距离
    function calculateDist(direction, proportion) {
        return (direction == "x" ?
                visualWidth : visualHeight) * proportion;
    }

    return {
        // 开始走路
        walkTo: function(time, proportionX, proportionY) {
            var distX = calculateDist('x', proportionX)
            var distY = calculateDist('y', proportionY)
            return walkRun(time, distX, distY);
        },
        //走进商店
        toShop:function(runTime){
            return walkToShop(runTime);
        },
        //取花
        takeFlower:function(){
            return takeFlower();
        },
        //走出商店
        outShop:function(){
            return walkOutShop.apply(null,arguments);
        },
        // 停止走路
        stopWalk: function() {
            pauseWalk();
        },
        setColor:function(value){
            $boy.css('background-color',value)
        },
        // 获取男孩的宽度
        getWidth: function() {
            return $boy.width();
        },
        // 复位初始状态
        resetOriginal: function() {
            this.stopWalk();
            // 恢复图片
            $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
        },
        setFlolerWalk:function(){
            $boy.addClass('slowFlolerWalk');
        },
        // 转身动作
        rotate:function(callback) {
            restoreWalk();
            $boy.addClass('boy-rotate');
            // 监听转身完毕
            if (callback) {
                $boy.on(animationEnd, function() {
                    callback();
                    $(this).off();
                })
            }
        }

    }
}

/////////////////////////////////////////////////////////////////////
/////////第三个页面////////
        //////////

////////////////////////////////////////////////////////
// 桥的Y轴
var bridgeY = function() {
    var data = getValue('.c_background_middle');
    return data.top;
}();

//小女孩 //
var girl = {
    elem: $('.girl'),
    getHeight: function() {
        return this.elem.height();
    },
    // 转身动作
    rotate: function() {
        this.elem.addClass('girl-rotate');
    },
    setPosition: function() {
        this.elem.css({
            left: visualWidth / 2,
            top: bridgeY - this.getHeight()
        });
    },
    getPosition: function() {
        return this.elem.position();
    },
    getWidth: function() {
        return this.elem.width()
    },
    setOffset: function() {
        this.elem.css({
            left: visualWidth / 2,
            top: bridgeY - this.getHeight()
        });
    }
};

// 修正小女孩位置
girl.setOffset();

//logo动画 //
var logo = {
    elem: $('.logo'),
    run: function() {
        this.elem.addClass('logolightSpeedIn')
            .on(animationEnd, function() {
                $(this).addClass('logoshake').off();
            });
    }
};


///////
//飘雪花 //
///////
function snowflake() {
    // 雪花容器
    var $flakeContainer = $('#snowflake');

    // 随机六张图
    function getImagesName() {
        return confi.snowflakeURl[[Math.floor(Math.random() * 6)]];
    }
    // 创建一个雪花元素
    function createSnowBox() {
        var url = getImagesName();
        return $('<div class="snowbox" />').css({
            'width': 41,
            'height': 41,
            'position': 'absolute',
            'backgroundSize': 'cover',
            'zIndex': 100000,
            'top': '-41px',
            'backgroundImage': 'url(' + url + ')'
        }).addClass('snowRoll');
    }
    // 开始飘花
    setInterval(function() {
        // 运动的轨迹
        var startPositionLeft = Math.random() * visualWidth - 100,
            startOpacity    = 1,
            endPositionTop  = visualHeight - 40,
            endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
            duration        = visualHeight * 10 + Math.random() * 5000;

        // 随机透明度，不小于0.5
        var randomStart = Math.random();
        randomStart = randomStart < 0.5 ? startOpacity : randomStart;

        // 创建一个雪花
        var $flake = createSnowBox();

        // 设计起点位置
        $flake.css({
            left: startPositionLeft,
            opacity : randomStart
        });

        // 加入到容器
        $flakeContainer.append($flake);

        // 开始执行动画
        $flake.transition({
            top: endPositionTop,
            left: endPositionLeft,
            opacity: 0.7
        }, duration, 'ease-out', function() {
            $(this).remove() //结束后删除
        });

    }, 200);
}

