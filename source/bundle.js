!function(t){if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else{var i;"undefined"!=typeof window?i=window:"undefined"!=typeof global?i=global:"undefined"!=typeof self&&(i=self),i.ReactWM=t()}}(function(){return function t(i,e,n){function s(h,r){if(!e[h]){if(!i[h]){var a="function"==typeof require&&require;if(!r&&a)return a(h,!0);if(o)return o(h,!0);throw new Error("Cannot find module '"+h+"'")}var d=e[h]={exports:{}};i[h][0].call(d.exports,function(t){var e=i[h][1][t];return s(e?e:t)},d,d.exports,t,i,e,n)}return e[h].exports}for(var o="function"==typeof require&&require,h=0;h<n.length;h++)s(n[h]);return s}({1:[function(t,i){var e=t("lodash");i.exports=t("./views/manager"),e.extend(i.exports,{Manager:t("./models/manager"),Window:t("./models/window")})},{"./models/manager":3,"./models/window":4,"./views/manager":7}],2:[function(t,i){var e=t("lodash"),n=20,s=5,o=function(t){this.manager=t,this.vertical=[],this.horizontal=[],this.manager.on("change",this.generate,this)};e.extend(o.prototype,{snap:function(t,i){for(var e=this[t],n=0,o=e.length;o>n;n++){var h=e[n];if(i>=h-s&&h+s>=i)return h}return i},generate:function(){this.manager.forEach(function(t){this.manager.active!==t&&(this.vertical.push(t.x,t.x+t.width,t.x-n,t.x+t.width+n),this.horizontal.push(t.y,t.y+t.height,t.y-n,t.y+t.height+n))},this),this.vertical=e(this.vertical).sortBy().uniq(!0).value(),this.horizontal=e(this.horizontal).sortBy().uniq(!0).value()}}),i.exports=o},{}],3:[function(t,i){var e=t("lodash"),n=t("signals"),s=t("./window"),o=t("./guides"),h=function(t){n.convert(this),this.windows={},this.order=[],this.guides=new o(this),e.isArray(t)&&t.forEach(function(t){this.add(t)},this)};e.extend(h.prototype,{at:function(t){var i=this.order[t];return this.windows[i]},get:function(t){return this.windows[t]},has:function(t){var i=e.isObject(t)?t.id:t;return this.windows.hasOwnProperty(i)},add:function(t){return t instanceof s||(t=new s(t)),t.manager=this,this.windows[t.id]=t,this.order.push(t.id),t.on("change:open",function(){this.emit("change")},this),t.on("change",function(){this.emit("change:windows")},this),this.emit("add",t),this.emit("change"),t},remove:function(t){var i=e.isObject(t)?t.id:t;if(t=this.get(i),!t)throw new Error("Can not a window that it cannot find: "+i);return delete this.windows[i],this.order.splice(this.order.indexOf(i),1),this.emit("remove",t),this.emit("change"),t},open:function(t,i){if(!i||!i.hasOwnProperty("id"))throw new Error("Must specify props.id");i.content=t;var e=this.has(i.id)?this.get(i.id):this.add(i);return e.open(),e},length:function(){return this.order.length},focus:function(t){var i=e.isObject(t)?t.id:t,n=this.order.indexOf(i);if(0>n)throw new Error("Can not focus on a window it cannot find: "+i);n!=this.length()-1&&(this.order.splice(n,1),this.order.push(i),this.emit("change"))},active:function(){return 0===this.order.length?!1:this.windows[this.order[this.order.length-1]]},filter:function(t,i){return i=i||this,this.order.filter(function(e){return t.call(i,this.windows[e])},this).map(function(t){return this.windows[t]},this)},forEach:function(t,i){return i=i||this,this.order.forEach(function(e){return t.call(i,this.windows[e])},this)},map:function(t,i){return i=i||this,this.order.map(function(e){return t.call(i,this.windows[e])},this)},toJSON:function(){return this.map(function(t){return t.toJSON()})},toString:function(){return JSON.stringify(this)}}),i.exports=h},{"./guides":2,"./window":4}],4:[function(t,i){var e=t("lodash"),n=t("signals"),s=0,o=1,h=2,r=function(t){if(n.convert(this),e.extend(this,e.defaults(t||{},this.defaults)),this.mode=s,null===this.maxWidth&&(this.maxWidth=1/0),null===this.maxHeight&&(this.maxHeight=1/0),void 0===this.id)throw new Error("All windows must have an id")};e.extend(r.prototype,{defaults:{id:void 0,x:0,y:0,width:0,height:0,maxWidth:1/0,minWidth:0,maxHeight:1/0,minHeight:0,title:"",isOpen:!0},setPosition:function(t,i){this.x=t,this.y=i,this.emit("change:position"),this.emit("change")},setSize:function(t,i){this.width=t,this.height=i,this.emit("change:size"),this.emit("change")},startMove:function(t,i){this.mode=o,this._offsetX=t-this.x,this._offsetY=i-this.y,this._realX=this.x,this._realY=this.y},startResize:function(t,i){this.mode=h,this._quad=this.quadrant(t,i),this._startX=this.x,this._startY=this.y,this._startWidth=this.width,this._startHeight=this.height,this._originX=t,this._originY=i,this._realX=this.x,this._realY=this.y},update:function(t,i){return this.mode===o?this._move(t,i):this.mode===h?this._resize(t,i):void 0},endChange:function(){return this.mode===o?this._endMove():this.mode===h?this._endResize():void 0},_move:function(t,i){this._realX=t-this._offsetX,this._realY=i-this._offsetY,this.snap()},_endMove:function(){delete this._offsetX,delete this._offsetY,delete this._realX,delete this._realY,this.mode=s,this.emit("change:position"),this.emit("change")},_resize:function(t,i){var e=t-this._originX,n=i-this._originY,s=this._startWidth+(this._quad.left?-1*e:e),o=this._startHeight+(this._quad.top?-1*n:n);s>this.maxWidth?(e=this.maxWidth-this._startWidth,this._quad.left&&(e*=-1)):s<this.minWidth&&(e=this.minWidth-this._startWidth,this._quad.left&&(e*=-1)),o>this.maxHeight?(n=this.maxHeight-this._startHeight,this._quad.top&&(n*=-1)):o<this.minHeight&&(n=this.minHeight-this._startHeight,this._quad.top&&(n*=-1)),this._quad.left?(this.x=this._startX+e,this.width=this._startWidth-e):this.width=this._startWidth+e,this._quad.top?(this.y=this._startY+n,this.height=this._startHeight-n):this.height=this._startHeight+n},_endResize:function(){delete this._quad,delete this._startX,delete this._startY,delete this._startWidth,delete this._startHeight,delete this._realX,delete this._realY,delete this._originX,delete this._originY,this.mode=s,this.emit("change:position"),this.emit("change:size"),this.emit("change")},snap:function(){this.x=this._realX,this.y=this._realY},quadrant:function(t,i){return{top:i<this.y+this.height/2,left:t<this.x+this.width/2}},open:function(){this.isOpen||(this.isOpen=!0,this.emit("change:open"),this.emit("change"))},close:function(){this.isOpen&&(this.isOpen=!1,this.emit("change:open"),this.emit("change"))},requestFocus:function(){if(!this.manager)throw new Error("Cannot focus a window that is not being managed");this.manager.focus(this)},isFocused:function(){return this.manager?this.manager.active()===this:!1},rename:function(t){this.title=t,this.emit("change:title"),this.emit("change")},toJSON:function(){return{id:this.id,x:this.x,y:this.y,width:this.width,height:this.height,maxWidth:this.maxWidth,minWidth:this.minWidth,maxHeight:this.maxHeight,minHeight:this.minHeight,title:this.title,isOpen:this.isOpen,active:this.active}}}),i.exports=r},{}],5:[function(t,i){var e=(t("lodash"),t("react")),n=(t("react/addons").addons.classSet,e.createClass({displayName:"Guide",render:function(){var t={},i="horizontal"===this.props.orientation?"top":"left";return t[i]=this.props.position,e.DOM.div({style:t,className:"guide guide-"+this.props.orientation})}}));i.exports=n},{}],6:[function(t,i){var e=t("lodash"),n=t("react"),s=t("./guide"),o=n.createClass({displayName:"Guides",render:function(){var t=100,i=100,o=e.chain(this.props.guides).map(function(e,n){return e.map(function(e){return s({key:n+e,orientation:n,start:t,end:i,position:e})})}).flatten(!0).value();return n.DOM.div({className:"guides"},o)}});i.exports=o},{"./guide":5}],7:[function(t,i){var e=(t("lodash"),t("jquery")),n=t("react"),s=t("react/addons").addons.CSSTransitionGroup,o=t("./window"),h=t("./guides"),r=n.createClass({displayName:"Manager",componentWillMount:function(){this.manager=this.props.manager,this.manager.on("change",this.forceUpdate,this)},componentWillUnmount:function(){this.manager.off("change",this.forceUpdate)},componentDidMount:function(){var t=e(this.getDOMNode());t.on("contextmenu",this.ignore),this.setState({offset:t.offset()})},getInitialState:function(){return{offset:{top:0,left:0}}},ignore:function(t){return t.preventDefault(),!1},handleStartMove:function(t){this.props.manager.bringToFront(t)},handleEndMove:function(){},convertPoints:function(t){return{x:t.clientX-this.state.offset.left,y:t.clientY-this.state.offset.top}},render:function(){var t=this.props.manager.filter(function(t){return t.isOpen}).map(function(t){return o({key:t.id,parent:this,window:t})},this);return n.DOM.div({className:"window-manager"},h({guides:this.state.guides}),n.DOM.div({className:"windows"},s({transitionName:"windows"},t)))}});i.exports=r},{"./guides":6,"./window":8}],8:[function(t,i){var e=(t("lodash"),t("jquery")),n=t("react"),s=t("react/addons").addons.classSet,o=0,h=n.createClass({displayName:"Window",ignore:function(t){return t.preventDefault(),!1},componentWillMount:function(){this.window=this.props.window,this.window.on("change",this.forceUpdate,this),e(document).on("mousemove",this.handleMouseMove),e(document).on("mouseup",this.handleMouseUp)},componentWillUnmount:function(){this.window.off("change",this.forceUpdate)},handlePropagation:function(t){t.ctrlKey||t.metaKey||t.altKey||0!==t.button||(this.focus(),t.stopPropagation())},handleMouseDown:function(t){this.focus();var i=this.props.parent.convertPoints(t);0===t.button?this.window.startMove(i.x,i.y):this.window.startResize(i.x,i.y)},handleMouseMove:function(t){if(this.window.mode==o)return!0;var i=this.props.parent.convertPoints(t);this.window.update(i.x,i.y),this.forceUpdate()},handleMouseUp:function(){this.window.endChange()},focus:function(){this.window.requestFocus()},close:function(){this.window.close()},render:function(){var t=s({window:!0,active:this.window.isFocused()}),i={top:this.window.y,left:this.window.x,width:this.window.width,height:this.window.height};return n.DOM.div({className:t,style:i,onMouseDown:this.handleMouseDown},n.DOM.header(null,n.DOM.div({className:"title"},this.window.title),n.DOM.div({className:"close",onMouseDown:this.ignore,onClick:this.close})),n.DOM.div({className:"content",onMouseDown:this.handlePropagation},this.window.content))}});i.exports=h},{}]},{},[1])(1)});