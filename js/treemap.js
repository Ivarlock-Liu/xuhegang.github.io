$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

function reSortRoot(root,value_key) {
    for (var key in root) {
        if (key == "key") {
            root.name = root.key;
            delete root.key;
        }
        if (key == "values") {
            root.children = [];
            for (item in root.values) {
                root.children.push(reSortRoot(root.values[item],value_key));
            }
            delete root.values;
        }
        if (key == value_key) {
            root.value = parseFloat(root[value_key]);
            delete root[value_key];
        }
    }
    return root;
}

var color = d3.scale.category10();

var multiplier = 1000000;

var margin = {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
    },
    width = 820,
    height = 700 - margin.top - margin.bottom,
    formatNumber = d3.format("$,"),
    transitioning;

var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

var treemap = d3.layout.treemap()
    .children(function(d, depth) { return depth ? null : d._children; })
    .sort(function(a, b) { return a.value - b.value; })
    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
    .round(false);

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .style("margin-left", -margin.left + "px")
    .style("margin.right", -margin.right + "px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("shape-rendering", "crispEdges");

var grandparent = svg.append("g")
    .attr("class", "grandparent");

grandparent.append("rect")
    .attr("y", -margin.top)
    .attr("width", width)
    .attr("height", margin.top);

grandparent.append("text")
    .attr("x", 6)
    .attr("y", 6 - margin.top)
    .attr("dy", ".75em");

  function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
  }

  
  function accumulate(d) {
    return (d._children = d.children)
        ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
        : d.value;
  }

  
  function layout(d) {
    if (d._children) {
      treemap.nodes({_children: d._children});
      d._children.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        layout(c);
      });
    }
  }

  function display(d) {
    grandparent
        .datum(d.parent)
        .on("click", transition)
      .select("text")
        .text(name(d));

    var g1 = svg.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

    var g = g1.selectAll("g")
        .data(d._children)
      .enter().append("g") 
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

    g.filter(function(d) { return d._children; })
        .classed("children", true)
		   .on("click", transitionOrnot);
	
	function transitionOrnot(d){
		if(!d.parent.value){transition(d);return;}
		if(!d.parent.parent.value){transition(d);return;}
		if(d.parent.parent.parent.value){return;}
	}
	function showDescriptionOrnot(d){
		if(!d.parent.value){return false;}
		if(!d.parent.parent.value){return false;}
		if(!d.parent.parent.parent.value){return true;}
	}

    g.selectAll(".child")
        .data(function(d) { return d._children || [d]; })
      .enter().append("rect")
        .attr("class", "child")
        .call(rect);

    g.append("rect")
        .attr("class", "parent")
        .call(rect)
        .attr("data-toggle","tooltip")
        .attr("data-placement","top")
        .attr("title",function(d){
             return d.name + " (" + formatNumber(Math.round(d.value)) + "M)";
        });


        g.append("foreignObject")
            .call(rect)
            .attr("class", "foreignobj")
            .append("xhtml:div")
            .attr("dy", ".75em")
            .html(function(d) {
                if (d.size) {
                    return d.name + " (" + formatNumber(d.size) + ")";
                }
                if (d.value > 0 && typeof(d.value) !== "undefined") {
					if(!showDescriptionOrnot(d)){
					   
						return "<p id='titleArea'>"+getBlockName(d)+d.name + " (" + formatNumber(Math.round(d.value)) + "M)"+"</p>";
					}else{
						return "<p id='titleArea'>"+getBlockName(d)+d.name + " (" + formatNumber(Math.round(d.value)) + "M)"+"</p>"+
						"<p id='descriptionArea'>Project Description:</p>"+
						"<p id='descriptionText'>"+d["_children"][0]["name"]+"</p>";
					}
                }else{
                    return "";
                }
                return d.name;
            })
            .attr("class", "textdiv");
            
    function transition(d) {
      if (transitioning || !d) return;
      transitioning = true;

      var g2 = display(d),
          t1 = g1.transition().duration(750),
          t2 = g2.transition().duration(750);

     
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      
      svg.style("shape-rendering", null);

      
      svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

      
      g2.selectAll("text").style("fill-opacity", 0);

     
      t1.selectAll("text").call(text).style("fill-opacity", 0);
      t2.selectAll("text").call(text).style("fill-opacity", 1);
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);

      t1.selectAll(".textdiv").style("display", "none"); /* added */
      t1.selectAll(".foreignobj").call(foreign); /* added */
      t2.selectAll(".textdiv").style("display", "block"); /* added */
      t2.selectAll(".foreignobj").call(foreign); /* added */


     
      t1.remove().each("end", function() {
        svg.style("shape-rendering", "crispEdges");
        transitioning = false;
      });
    }

    return g;
  }

  function text(text) {
    text.attr("x", function(d) { return x(d.x) + 6; })
        .attr("y", function(d) { return y(d.y) + 6; });
  }

  function rect(rect) {
    rect.attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
        .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
        .style("fill", function(d) {
            return d.parent ? color(d.name) : null;
        })
        .style("fill-opacity",0.875);
  }

  function name(d) {
   
   return getTitleName(d);
  }
  
  function getTitleName(d){
	  if(!d.parent){ return "All Departments";}
	   if(!d.parent.parent){ return "Department Name:"+ d.name + " (" + formatNumber(Math.round(d.value)) + "M)";}
	   if(!d.parent.parent.parent){ return "Investment Title:"+ d.name + " (" + formatNumber(Math.round(d.value)) + "M)";}
  }
  
  function getBlockName(d){
	  if(!d.parent.parent){return "Department Name: ";}
	   if(!d.parent.parent.parent){return "Investment Title: ";}
	   if(!d.parent.parent.parent.parent){ return "Project Name: ";}
  }

  function foreign(foreign) { 
    foreign.attr("x", function(d) {
            return x(d.x);
        })
        .attr("y", function(d) {
            return y(d.y);
        })
        .attr("width", function(d) {
            return x(d.x + d.dx) - x(d.x);
        })
        .attr("height", function(d) {
            return y(d.y + d.dy) - y(d.y);
        });

}

var mousemove = function(d) {
  console.log("move");
  var xPosition = d3.event.pageX + 5;
  var yPosition = d3.event.pageY + 5;

  d3.select("#tooltip")
    .style("left", xPosition + "px")
    .style("top", yPosition + "px");
  if(d["_children"]!==undefined){
  d3.select("#tooltip #heading")
   
     .text(cal(d));
  }
  d3.select("#tooltip #spend")
    .text(formatNumber(Math.round(d.value)) + "(M)");
  d3.select("#tooltip").classed("hidden", false);
};

function cal(d){
	var children=d.parent["_children"];
	var total=0;
	for(var i=0;i<children.length;i++){
		
		total=total+children[i].value;
		
	}
	return "Percent:"+Math.ceil((d.value/total*100))+"%";
}

var mouseout = function() {
  d3.select("#tooltip").classed("hidden", true);
};

function loadData(root) {
    initialize(root);
    accumulate(root);
    layout(root);
    display(root);
}
$( document ).ready(function() {
	

	d3.csv("data/CleanedProject.csv", function(csv_data){
		
		var nested_data = d3.nest()
			.key(function(d)  { return d.Agency_Name; })
			.key(function(d)  { return d.Investment_Title; })
			.key(function(d)  { return d.Project_Name;})
			.key(function(d)  {return d.Project_Description;})
			.entries(csv_data);

		
		var root = {};

		
		root.key = "Data";
		root.values = nested_data;

		
		root = reSortRoot(root,"Lifecycle_Cost");

		

		loadData(root);
	});

});