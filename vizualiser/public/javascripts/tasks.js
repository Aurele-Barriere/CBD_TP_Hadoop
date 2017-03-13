function render_tasks_distribution(bubbleChart, splits, ndx) {

  var splitDimension = ndx.dimension(function (d) {
    return d.TASKID + "|" + d.SPLIT_HOSTNAME;
  });

  var splitGroups = splitDimension.group().reduce(
      function (p, v) {
        return v;
      },
      function (p, v) {
        return {};
      },
      function () {
        return []
      }

  );

  var hostnames = {};
  var tasks = {};
  for (i in splits) {
    tasks[splits[i].TASKID] = "value";
    hostnames[splits[i].SPLIT_HOSTNAME] = "value";
  }
  tasks = Object.keys(tasks);
  hostnames = Object.keys(hostnames);

  var range = hostnames.map(function(d,i){return i});

  // Simulate discrete y axis
  var yScale1 = d3.scale.ordinal().domain(hostnames).range(range);
  var yScale = d3.scale.linear().domain([-1, hostnames.length - 1]).range([0,500]);
    yScale3 = d3.scale.ordinal().domain(range).range(hostnames);
    xScale = d3.scale.ordinal().domain(tasks).range(tasks.map(function(d,i){return i}));

  bubbleChart
    .width(1000)
    .height(500)
    .dimension(splitDimension)
    .group(splitGroups)
    .renderLabel(false)
    .x(d3.scale.ordinal().domain(tasks))
    .xUnits(dc.units.ordinal)
    .keyAccessor(function (p) {
      return p.value.TASKID;
    })
    .valueAccessor(function (p) {
      v = yScale1(p.value.SPLIT_HOSTNAME);
      return v;
    })
    .y(yScale)
    .widthValueAccessor(function(p) {
      return 1;
    })
    .heightValueAccessor(function(p){
      return 1;
    })
    .renderTitle(true)
    .title(function(d){
      return [
        "taskid : " + d.value.TASKID,
        "split_hostname : " + d.value.SPLIT_HOSTNAME, 
        "split_status : " + d.value.SPLIT_STATUS, 
      ].join("\n")
    })
    .xAxisLabel("Task #")
    .yAxisLabel("Hosts")
    .colorAccessor(function(d) {return {type: d.value.TASK_TYPE, split_status: d.value.SPLIT_STATUS, status: d.value.TASK_STATUS}})
    .colors(function(d){
      if (d.status === "FAILED")
        return "black"
      if (d.split_status === "LOCAL")
        return "red"
      if (d.split_status === "NONLOCAL")
        return "blue"
      if (d.status === "KILLED")
        return "red";
      return "gray" 
    })
    .renderHorizontalGridLines(true)
      .elasticX(true);
//    .renderVerticalGridLines(true);

    bubbleChart.yAxis().tickFormat(function(d){return yScale3(d)}).tickValues(range).ticks(1);
    bubbleChart.xAxis().tickValues(tasks.map(function(d,i){return i})).ticks(10)
     /*
    bubbleChart.renderlet(function(chart){
        chart.selectAll("g.x text")
          .attr('transform', "rotate(-90)");
    });
*/


    bubbleChart.margins().left = 200;

}

