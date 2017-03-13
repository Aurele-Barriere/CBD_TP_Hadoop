  function render_time_chart(taskChart, tasks, ndx) {
    timeDimension = ndx.dimension(function(d) {
      return Math.floor((d.FINISH_TIME - d.START_TIME)/500)*500;
    });

    timeGroup = timeDimension.group();
    times = timeGroup.all().sort( function(a,b) {
      return a.key - b.key;
    });
    max = times[times.length - 1 ].key;
    min = times[0].key;

    taskChart.height(500)
      .group(timeGroup)
      .dimension(timeDimension)
      .x(d3.scale.linear().domain([min,max]))

      taskChart.xAxis().ticks(5);
  }


  function render_row_chart(taskChart, tasks, ndx) {

    hostDimension = ndx.dimension(function(d) {
      return d.HOSTNAME;
    });

    hostGroup = hostDimension.group();

    taskChart.width(300)
             .height(1000)
             .group(hostGroup)
             .dimension(hostDimension)
  }


  function render_pie_task(taskChart, tasks, ndx, field){
    taskDimension = ndx.dimension(function(d) {
      return d[field];
    });

    taskGroup = taskDimension.group();

   taskChart
      .width(180)
      .height(180)
      .radius(80)
      .dimension(taskDimension)
      .group(taskGroup)
      .label(function (d) {
        return d.key + "(" + d.value + ")"  ;
      })
      .renderLabel(true);

  }

      function render_gantt_by_start_time(bubbleChart, tasks, ndx) {

        var startDimension = ndx.dimension(function (d) {
          return d.TASK_ATTEMPT_ID;
        });

        var startTaskGroup = startDimension.group().reduce(
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

        tasks.sort(function(a, b) {
          return a.FINISH_TIME - b.FINISH_TIME;
        });
        var maxDate = tasks[tasks.length - 1].FINISH_TIME;

        tasks.sort(function(a, b) {
          return a.START_TIME - b.START_TIME;
        });
        var minDate = tasks[0].START_TIME;

        var hostnames = {};
        for (i in tasks) {
          hostnames[tasks[i].TASK_ATTEMPT_ID] = "value";
        }
        hostnames = Object.keys(hostnames);

        var range = hostnames.map(function(d,i){return i});

        // Simulate discrete y axis
        var yScale1 = d3.scale.ordinal().domain(hostnames).range(range);
        var yScale = d3.scale.linear().domain([0, hostnames.length - 1]).range([0,500]);

        bubbleChart
          .width(1000)
          .height(500)
          .dimension(startDimension)
          .group(startTaskGroup)
          .renderLabel(false)
          .keyAccessor(function (p) {
            return (parseInt(p.value.START_TIME) - minDate)/1000;
          })
          .valueAccessor(function (p) {
            v = yScale1(p.value.TASK_ATTEMPT_ID);
            return v;
          })
          .x(d3.scale.linear().domain([0, (maxDate-minDate)/1000]))
          .y(yScale)
          .widthValueAccessor(function(p) {
            return parseInt(p.value.FINISH_TIME)/1000 - parseInt(p.value.START_TIME)/1000
          })
          .heightValueAccessor(function(p){
            return 1;
          })
          .renderTitle(true)
          .title(function(d){
            return [
              "attemptid : " + d.value.TASK_ATTEMPT_ID,
              "hostname : " + d.value.HOSTNAME,
              "start : " + d.value.START_TIME,
              "finish : " + d.value.FINISH_TIME,
              "status : " + d.value.TASK_STATUS,
            ].join("\n")
          })
          .elasticX(true)
          .xAxisLabel("time (s)")
          .yAxisLabel("task attempt id")
          .colorAccessor(function(d) {return {type: d.value.TASK_TYPE, locality: d.value.LOCALITY, status: d.value.TASK_STATUS}})
          .colors(function(d){
            if (d.status === "KILLED")
              return "red";
            if (d.status === "FAILED")
              return "black"
            if (d.type === "MAP")
              return "orange";
            return "green"
          })
          .yAxisPadding(2);

          bubbleChart.margins().left = 200;
   }

  function render_gantt_by_host(bubbleChart, tasks, ndx) {

    var startDimension = ndx.dimension(function (d) {
      return d.TASK_ATTEMPT_ID;
    });

    var startTaskGroup = startDimension.group().reduce(
        function (p, v) {
          return v;
        },
        function (p, v) {
          return {};
        },
        function () {
          return [];
        }
    );

    tasks.sort(function(a, b) {
      return a.FINISH_TIME - b.FINISH_TIME;
    });
    var maxDate = tasks[tasks.length - 1].FINISH_TIME;

    tasks.sort(function(a, b) {
      return a.START_TIME - b.START_TIME;
    });
    var minDate = tasks[0].START_TIME;

    var hostnames = {};
    for (i in tasks) {
      //remove rack identifier, keep only hostname
      hostnames[tasks[i].HOSTNAME.replace(/\/.*\//, "").replace(/\\/g, "")] = "value";
    }

    hostnames = Object.keys(hostnames);
    hostnames.sort();

    range = hostnames.map(function(d,i){return i});

    // Simulate discrete y axis
    var yScale1 = d3.scale.ordinal().domain(hostnames).range(range);
    var yScale = d3.scale.linear().domain([0, hostnames.length - 1]).range([0,500]);
    var yScale_1 = d3.scale.ordinal().domain(range).range(hostnames);

    bubbleChart
      .width(1000)
      .height(500)
      .dimension(startDimension)
      .group(startTaskGroup)
      .renderLabel(false)
      .keyAccessor(function (p) {
      return (parseInt(p.value.START_TIME) - minDate)/1000
    })
    .valueAccessor(function (p) {
      var offset = 0;
      if (p.value.TASK_TYPE == "MAP") {
        offset = 0.2
      }
      v = yScale1(p.value.HOSTNAME) + offset;
      return v;
    })
    .y(yScale)
    .x(d3.scale.linear().domain([0, (maxDate - minDate)/1000]))
    .widthValueAccessor(function(p) {
      return parseInt(p.value.FINISH_TIME)/1000 - parseInt(p.value.START_TIME)/1000
      })
    .heightValueAccessor(function(p){
      return 0.5;
    })
    .renderTitle(true)
    .title(function(d){
      return [
        "attemptid : " + d.value.TASK_ATTEMPT_ID,
        "hostname : " + d.value.HOSTNAME,
        "start : " + d.value.START_TIME,
        "finish : " + d.value.FINISH_TIME
      ].join("\n")
    })
    .xAxisLabel("time (s)")
    .yAxisLabel("hosts")
    .elasticX(true)
    .colorAccessor(function(d) {return {type: d.value.TASK_TYPE, locality: d.value.LOCALITY, status: d.value.TASK_STATUS}})
    .colors(function(d){
      if (d.status === "KILLED")
        return "red";
      if (d.status === "FAILED")
        return "black"
      if (d.type === "MAP")
        return "orange";
      return "green"
    })

    bubbleChart.margins().left = 200;
    bubbleChart.yAxis().tickFormat(function(d){return yScale_1(d)}).tickValues(range);
  }
