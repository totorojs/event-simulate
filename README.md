# Event-simulate

---

模拟事件各种鼠标、键盘事件触发。

---

## 使用说明

```
var eventSimulate = require('event-simulate');
var div = document.createElement('div);
document.body.appendChild(div);
eventSimulate.simulate(div, 'click');
```

上面表明了创建了一个 div 元素，并在上面触发了一个 click 事件。

该模块仅提供一个方法，以下为 API 详解。


### eventSimulate.simulate(element, eventType, [options])

### element

可以是 jquery 对象和原生的 dom 对象。

### eventType

事件类型。
主要支持以下几几大类和若干小类:

#### UIEvents
* submit
* blur
* change
* focus
* resize
* scroll
* select

#### MouseEvents
* click
* dblclick
* mouseover
* mouseout
* mouseenter
* mouseleave
* mousedown
* mouseup
* mousemove

#### msPointerEvents
* MSPointerOver
* MSPointerOut
* MSPointerDown
* MSPointerUp
* MSPointerMove

#### touchEvents
* touchstart
* touchmove
* touchend
* touchcancel

#### gestureEvents
* gesturestart
* gesturechange
* gestureend

### options 
事件参数对象，其实这个里面设置的内容就是用户获取事件对象中对应的内容。
#### bubbles {Boolean}
表明事件是否冒泡，默认 true
#### cancelable {Boolean}
事件是否可以取消，默认 true
#### view {Window}
与事件关联的抽象视图. 默认 window
#### detail {int}
与事件相关的细节信息.
#### screenX {int}
事件相对于屏幕的 X 坐标
#### screenY {int}
事件相对于屏幕的 Y 坐标
#### clientX {int}
事件相对于视口中的 X 坐标
#### clientY {int}
事件相对于视口中的 Y 坐标
#### ctrlKey {Boolean}
事件触发时，是否按下了 CTRL 键。默认 false.
#### altKey {Boolean}
事件触发时，是否按下了 ALT 键。默认 false.
#### shiftKey {Boolean}
事件触发时，是否按下了 SHIFT 键。默认 false.
#### metaKey {Boolean}
事件触发时，是否按下了 META 键。默认 false.
#### button {int}
表示按下了哪一个鼠标键。默认值 0.
#### relatedTarget {HTMLElement}
表示与事件相关的对象。这个参数只是在模拟 mouseover 或 mouseout 时使用
#### keyCode {int}
被按下或释放的键的键码。这个参数对 keydown 和 keyup 事件有用。默认 0.
#### charCode {int}
通过按键生成的字符的 ASCII 编码。这个参数对 keypress 事件有用，默认值 0.
