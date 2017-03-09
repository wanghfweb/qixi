/**
 * Created by Administrator on 2017/3/9.
 */
// 路的Y轴
var pathY = function() {
    var data = getValue('.a_background_middle');
    return data.top + data.height / 2;
}();

var $boy = $("#boy");
var boyHeight = $boy.height();

// 修正小男孩的正确位置
$boy.css({
    top: pathY - boyHeight + 25
});
//播放音乐
var audio1 = Hmlt5Audio(audioConfig.playURl);
audio1.end(function() {
    Hmlt5Audio(audioConfig.cycleURL, true);
});
//小男孩
var boy = BoyWalk();
// 太阳公转
$("#sun").addClass('rotation');
// 飘云
$(".cloud:first").addClass('cloud1Anim');
$(".cloud:last").addClass('cloud2Anim');
boy.walkTo(confi.setTime.walkToThird, 0.6).then(function() {
    scrollTo(confi.setTime.walkToMiddle, 1);//页面滚动
}).then(function(){
    return boy.walkTo(confi.setTime.walkToMiddle, 0.5);//到第二个页面中间位置
}).then(function() {
    //暂停走路
    boy.stopWalk()
})
.then(function() {
    // 开门
    return openDoor();
})
.then(function() {
    // 开灯
    lamp.bright();
})
.then(function() {
    // 进商店
    return boy.toShop(confi.setTime.walkToShop);
}).then(function(){
    // 取花
    return boy.takeFlower();
}).then(function() {
    // 飞鸟
    bird.fly();
}).then(function() {
    // 出商店
    return boy.outShop(confi.walkOutShop);
}).then(function(){
    // 关门
    return closeDoor();
}).then(function() {
    // 灯暗
    lamp.dark();
}).then(function(){
        scrollTo(confi.setTime.walkToThird, 2);//页面滚动
    }).then(function(){
      return  boy.walkTo(confi.setTime.walkToThird,0.15);
    }) .then(function () {
        // 第二次走路到桥上left,top
        return boy.walkTo(confi.setTime.walkTobridge, 0.25, girl.getPosition().top / visualHeight);
    })
    .then(function () {
        // 实际走路的比例
        var proportionX = (girl.getPosition().left - boy.getWidth() + girl.getWidth() / 5) / visualWidth;
        // 第三次桥上直走到小女孩面前
        return boy.walkTo(confi.setTime.bridgeWalk, proportionX);
    }).then(function () {
        // 图片还原原地停止状态
        boy.resetOriginal();
    }).then(function () {
        // 增加转身动作
        setTimeout(function () {
            girl.rotate();
            boy.rotate(function () {
                // 开始logo动画
                logo.run();
                snowflake();
            });
        }, confi.setTime.waitRotate);
    });