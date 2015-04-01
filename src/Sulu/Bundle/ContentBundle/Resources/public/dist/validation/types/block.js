define(["type/default","app-config"],function(a,b){"use strict";return function(c,d,e){var f={},g={initializeSub:function(){var a,b,c,d=[];for(this.templates={},a=0,b=this.options.config.length;b>a;a++)c=this.options.config[a],this.templates[c.data]=App.dom.find("#"+c.tpl,this.$el).html(),c.id=c.data,c.name=App.translate(c.title),d.push(c);this.id=this.$el.attr("id"),this.propertyName=App.dom.data(this.$el,"mapperProperty"),this.types=d,this.$addButton=$("#"+this.id+"-add"),this.getMinOccurs()!==this.getMaxOccurs()?this.initSelectComponent(d):App.dom.remove(this.$addButton),this.bindDomEvents(),this.setValue([])},getChildren:function(){return this.$el.children()},getMinOccurs:function(){return this.options.min},getMaxOccurs:function(){return this.options.max},canAdd:function(){var a=this.getChildren().length;return null===this.getMaxOccurs()||a<this.getMaxOccurs()},canRemove:function(){var a=this.getChildren().length;return a>this.getMinOccurs()},initSelectComponent:function(a){App.start([{name:"select@husky",options:{el:this.$addButton,instanceName:this.id,defaultLabel:App.translate("sulu.content.add-type"),fixedLabel:!0,style:"action",icon:"plus-circle",data:a.length>1?a:[],repeatSelect:!0,selectCallback:function(a){this.addChild(a,{},!0)}.bind(this),deselectCallback:function(a){this.addChild(a,{},!0)}.bind(this),noItemsCallback:function(){this.addChild(this.types[0].data,{},!0)}.bind(this)}}])},bindDomEvents:function(){this.$el.on("click",'*[data-mapper-remove="'+this.propertyName+'"]',this.removeBlockHandler.bind(this)),$("#sort-text-blocks-"+this.id).on("click",this.showSortMode.bind(this)),$("#edit-text-blocks-"+this.id).on("click",this.showEditMode.bind(this))},removeBlockHandler:function(a){var b=$(a.target),c=b.closest("."+this.propertyName+"-element");this.canRemove()&&(this.form.removeFields(c),c.remove(),this.checkSortable(),$(e.$el).trigger("form-remove",[this.propertyName]),this.checkFullAndEmpty())},checkSortable:function(){this.getChildren().length<=1?(App.dom.removeClass(this.$el,"sortable"),App.dom.attr(App.dom.children(this.$el),"draggable",!1)):App.dom.hasClass(this.$el,"sortable")||App.dom.addClass(this.$el,"sortable")},validate:function(){return!0},addChild:function(a,b,c,d){var f,g,h,i=App.data.deferred();return("undefined"==typeof d||null===d)&&(d=this.getChildren().length),this.canAdd()?(App.dom.remove(App.dom.find("> *:nth-child("+(d+1)+")",this.$el)),delete b.type,f=$.extend({},{index:d,translate:App.translate,type:a},b),g=_.template(this.templates[a],f,e.options.delimiter),h=$(g),App.dom.insertAt(d,"> *",this.$el,h),this.types.length>1?App.start([{name:"dropdown@husky",options:{el:App.dom.find("#change"+f.index,h),trigger:App.dom.find(".drop-down-trigger",h),setParentDropDown:!0,instanceName:"change"+f.index,alignment:"right",valueName:"title",translateLabels:!0,clickCallback:function(a,b){var c=e.mapper.getData(h);this.addChild(a.data,c,!0,d)}.bind(this),data:this.types}}]):App.dom.remove(App.dom.find(".drop-down-trigger",h)),this.getMinOccurs()===this.getMaxOccurs()&&App.dom.remove(App.dom.find(".options-remove",h)),this.checkSortable(),e.initFields(h).then(function(){e.mapper.setData(b,h).then(function(){i.resolve(),c&&$(e.$el).trigger("form-add",[this.propertyName,b,d])}.bind(this))}.bind(this)),this.checkFullAndEmpty()):i.resolve(),i.promise()},checkFullAndEmpty:function(){this.$addButton.removeClass("empty"),this.$addButton.removeClass("full"),this.$el.removeClass("empty"),this.$el.removeClass("full"),this.canAdd()?this.canRemove()||(this.$addButton.addClass("empty"),this.$el.addClass("empty")):(this.$addButton.addClass("full"),this.$el.addClass("full")),this.getChildren().size()<=1?$("#text-block-header-"+this.id).hide():$("#text-block-header-"+this.id).show()},internalSetValue:function(a){var b,c,d,e,f=App.data.deferred(),g=function(){d--,0>=d&&f.resolve()};if(this.form.removeFields(this.$el),App.dom.children(this.$el).remove(),c=a.length<this.getMinOccurs()?this.getMinOccurs():a.length,d=c,c>0)for(b=0;c>b;b++)e=a[b]||{},this.addChild(e.type||this.options["default"],e).then(function(){g()});else g();return f.promise()},setValue:function(a){"object"!=typeof a||App.dom.isArray(a)||(a=[a]);var b=this.internalSetValue(a);return b.then(function(){App.logger.log("resolved block set value")}),b},getValue:function(){var a=[];return App.dom.children(this.$el).each(function(){a.push(e.mapper.getData($(this)))}),a},iterateBlockFields:function(a,b){a.size()&&$.each(a,function(a,c){var d=$(c),e=d.find("[data-mapper-property]");e.size()&&$.each(e,function(a,c){{var e=$(c),f=e.data("property")||{};f.tags||[]}(b||$.noop)(e,d)})})},showSortMode:function(){var a=this.getChildren(),c=b.getSection("sulu-content");$("#sort-text-blocks-"+this.id).addClass("hidden"),$("#edit-text-blocks-"+this.id).removeClass("hidden"),this.$el.addClass("is-sortmode"),this.iterateBlockFields(a,function(a,b){var d=a.data("property")||{},e=d.tags||[];"textEditor"===a.data("type")&&App.emit("husky.ckeditor."+a.data("aura-instance-name")+".destroy"),e.length&&_.where(e,{name:c.showInSortModeTag}).length&&this.showSortModeField(a,b)}.bind(this))},showSortModeField:function(a,b){var c=a.data("element").getValue(),d=a.attr("id"),e=$('[data-sort-mode-id="'+d+'"]',b);e.size()&&e.html(!!c&&c.replace(/<(?:.|\n)*?>/gm,"")).addClass("show-in-sortmode")},showEditMode:function(){var a=this.getChildren();$("#sort-text-blocks-"+this.id).removeClass("hidden"),$("#edit-text-blocks-"+this.id).addClass("hidden"),this.$el.removeClass("is-sortmode"),this.iterateBlockFields(a,function(a,b){a.removeClass("show-in-sortmode"),"textEditor"===a.data("type")&&App.emit("husky.ckeditor."+a.data("aura-instance-name")+".start")}.bind(this))}};return new a(c,f,d,"block",g,e)}});