test("Vango",function(){
   ok(true,"no error"); 
});
test("constructor",function(){
    var vango=new Vango(document.body, 100 ,100);
    ok(document.getElementsByTagName("canvas"),"there is a canvas!");
    equal(vango.attr("width"), 100);
    equal(vango.attr("height"), 100);
});

module("Vango",{
    setup:function(){
        this.vango=new Vango(document.body, 100 ,100);      
    }
});
test(":attr",function(){
    equal(this.vango.attr("width"), 100);
    this.vango.attr("width", 200);
    equal(this.vango.attr("width"), 200);
    this.vango.attr({
        width:300,
        height:300
    });
    equal(this.vango.attr("width"), 300);
    equal(this.vango.attr("height"), 300);
});
test(":css",function(){
    equal(this.vango.css("display"),"");
    equal(this.vango.css("height"),"");
    this.vango.css("height",1000+"px");
    equal(this.vango.css("height"),1000+"px");
    this.vango.css({
        "width":"200px",
        "background-color":"black"
    });
    equal(this.vango.css("background-color"),"black");
});
test(":getContext :toDataURL",function(){
    ok(this.vango.getContext("2d").fillStyle);
    ok(this.vango.toDataURL().length > 0);
});

test(":style",function(){
    var tempctx=document.createElement("canvas").getContext("2d"),
        value;
    for(var style in tempctx){
        value=tempctx[style];
        if(Object.prototype.hasOwnProperty.call(tempctx,style) && typeof value != "function"  && typeof value != "object"){
            equal(this.vango.style(style), tempctx[style], style+":"+tempctx[style]);
        }
    }
    this.vango.style("fillStyle","#999");
    equal(this.vango.style("fillStyle"),"#999999");
    this.vango.style({
        "fillStyle":"#666",
        "strokeStyle":"#777"
    });
    deepEqual({
        "fillStyle":"#666666",
        "strokeStyle":"#777777"
    },{
        "fillStyle":this.vango.style("fillStyle"),
        "strokeStyle":this.vango.style("strokeStyle")
    });
});
