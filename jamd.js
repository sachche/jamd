var jamd = {
  defmulti: function (defaultDispatcher, defaultFunc) {
    defaultDispatcher = typeof(defaultDispatcher) === "function" ? defaultDispatcher : function(value, arg) {
      return value === arg; };
    defaultFunc = typeof(defaultFunc) === "function" ? defaultFunc : function() { throw "No method found for arguments" };

    var funcs = [];

    function addFunc(value, func) {
      var funcDef = {
        func: func,
        dispatcher: function() {
          Array.prototype.splice.call(arguments, 0, 0, value);
          return defaultDispatcher.apply(this, arguments);
        }
      };

      funcs.push(funcDef);
    }

    var invoker = function() {
      for(var i in funcs) {
        var funcDef = funcs[i];
        if(funcDef.dispatcher.apply(this, arguments)) {
          return funcDef.func.apply(this, arguments);
        }
      }

      return defaultFunc.apply(this, arguments);
    };

    invoker.def = function(value, func) {
      addFunc(value, func);
      return invoker;
    };

    return invoker;
  },
  primitiveMulti: function(extracter, defaultFunc) {
    extracter = typeof(extracter) === "function" ? extracter : function(arg) {
      return arg;
    }
    defaultFunc = typeof(defaultFunc) === "function" ? defaultFunc : function() { throw "No method found for arguments" };
    
    var funcs = {};
    
    var invoker = function() {
      var key = extracter.apply(this, arguments);
      var func = funcs[key];
      if(func !== undefined) {
        return func.apply(this, arguments);
      }

      return defaultFunc.apply(this, arguments);
    }

    invoker.def = function(value, func) {
      funcs[value] = func;
      return invoker;
    }

    return invoker;
  }
}