function render_jobs_time(jobTimeChart, jobs, ndx_jobs, START_KEY, FINISH_KEY) {

  submitTimeDimension = ndx_jobs.dimension(function (d) {
    return d[START_KEY];
  });

  startJobGroup = submitTimeDimension.group().reduce(
      function (p, v) {
        return v;
      },
      function (p, v) {
        return {};
      },
      /* initialize p */
      function () {
        return [];
      }
  );

  jobs.sort(function(a, b) {
    return a[FINISH_KEY] - b[FINISH_KEY] ;
  });

  maxDate = jobs[jobs.length - 1].FINISH_TIME;

  jobs.sort(function(a, b) {
    return a[START_KEY] - b[START_KEY];
  });

  minDate = jobs[0][START_KEY];

  jobs_id = [];
  for (i in jobs) {
    jobs_id.push(jobs[i].JOBID)
  }

  range = jobs_id.map(function(d,i){return 1+i});
  y = d3.scale.ordinal().domain(jobs_id).range(range);

  var yScale = d3.scale.linear().domain([-1, jobs_id.length]).range([0,500]);
   yScale_1 = d3.scale.ordinal().domain(range).range(jobs_id)

  jobTimeChart
    .width("1000")
    .height("500")
    .dimension(submitTimeDimension)
    .group(startJobGroup)
    .renderLabel(false)
    .keyAccessor(function (p) {
    return (p.value[START_KEY] - minDate)/1000;
  })
  .valueAccessor(function (p) {
    v = y(p.value.JOBID);
    return v;
  })
  .x(d3.scale.linear().domain([0, (maxDate - minDate)/1000]))
  .y(yScale)
  .widthValueAccessor(function(p) {
    return parseInt(p.value[FINISH_KEY])/1000 - parseInt(p.value[START_KEY]/1000)
    })
  .heightValueAccessor(function(p){
    return 1;
  })
  .renderTitle(true)
  .title(function(d){
    return [
    START_KEY + " : " + d.value[START_KEY],
    FINISH_KEY + " : " + d.value[FINISH_KEY]
    ].join("\n")
  })
  .xAxisLabel("time (s)")
  .yAxisLabel("job id")
  .yAxisPadding(1)

  jobTimeChart.yAxis().tickFormat(function(d){console.log(d);return yScale_1(d)}).tickValues(range);
  jobTimeChart.xAxis().ticks(5)
  jobTimeChart.margins().left = 150;

}
