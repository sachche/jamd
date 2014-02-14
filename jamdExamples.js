function writeResult(result) {
  var container = document.getElementById("results");
  var resultNode = document.createElement("div");
  resultNode.innerHTML = result;
  container.appendChild(resultNode);
}

var aMulti = jamd.defmulti(
  function(value, args) {
    return args.a === value
  },
  function(args) {
    writeResult("DEFAULT: "+ JSON.stringify(args));
  });

aMulti.def(1, function(args) { return "One"; });
aMulti.def(2, function(args) { return "Two"; }).def("FIVE", function(args) { return args.b; });

writeResult(aMulti({ a: 1 }));
writeResult(aMulti({ a: 2, b: "Three Sir!", c: "four" }));
writeResult(aMulti({ a: "FIVE", b: "Three Sir!", c: "4" }));
aMulti({ b: "Three Sir!", c: "four" });


function MyClass() {
  this.check = function(vals, arg1, arg2, arg3) {
    return typeof(arg1) === vals[0] &&
      typeof(arg2) === vals[1] &&
      typeof(arg3) === vals[2];
  };

  this.multi = jamd.defmulti(
    function(v, a1, a2, a3) {
      return this.check(v, a1, a2, a3)
    },
    function(a1, a2, a3) { writeResult("MyClass.multi cannot find function for types [" + typeof(a1) + ", " + typeof(a2) + ", " + typeof(a3) + "]") });
  
  this.print = function(a) { writeResult("MyClass.print: " + a); };
  
  this.multi.def(["string", "number", "object"], function(str, num, obj) {
    this.print("The string length is: " + str.length + "; The number is: " + num.toExponential() + "; The object is: " + JSON.stringify(obj));
  });
}

var mc = new MyClass();
mc.multi.def(["string", "string", "string"], function(s1, s2, s3) { this.print("You've passed in a bunch of strings: " + s1 + s2 + s3); });

mc.multi("else");
mc.multi("something", 2, {a: 1});
mc.multi("Here", "Are", "Strings");


var priMulti = jamd.primitiveMulti(function(arg) { return arg.type; }, function(arg) { writeResult("Invalid argument: " + JSON.stringify(arg)); });
priMulti.def("boring", function(arg) { return "ZZZZZZZZZZZ"; });
priMulti.def("exciting", function(arg) { return arg.fun; });

writeResult(priMulti({type: "boring"}));
writeResult(priMulti({type: "exciting", fun: "So much room for activities!"}));
priMulti({some: "different", other: "stuff", object: "here"});


var defaultMulti = jamd.defmulti().def(1, function() { writeResult("Multi default 1"); });
try {
  defaultMulti(1);
  defaultMulti(2);
}
catch(ex) {
  writeResult(ex);
}

var defaultPrimitive = jamd.primitiveMulti().def(1, function() { writeResult("PrimitiveMulti default 1"); });
try{
  defaultPrimitive(1);
  defaultPrimitive(2);
}
catch(ex) {
  writeResult(ex);
}