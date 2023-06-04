module.exports={
    merge:function(js){
        var obj=new Object();
        var keys=js.keys;
        var values=js.values;
        for(var i=0;i<keys.length;i++)
            obj[keys[i]]=values[i];
        return obj;
    }
}