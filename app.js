const projectName = 'bar-chart';
localStorage.setItem('example_project', 'D3: Bar Chart');

var yMargin = 40,
    width = 800,
    height = 400,
    barWidth = width/(( 2015 - 1947 + 1 ) * 4 - 1), 
    svgContainerWidthMargin = 100, 
    svgContainerHeightMargin = 60; 

var tooltip = d3.select('.visHolder')
  .append('div')
  .attr("id", "tooltip")
  .style("opacity", 0);

var overlay = d3.select('.visHolder')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

var svgContainer =  d3.select('.visHolder')
    .append('svg')
    .attr('width', width + svgContainerWidthMargin)
    .attr('height', height + svgContainerHeightMargin);

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json').then(function(data) { 
  svgContainer.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -180)
    .attr('y', 90)
    .text('Gross Domestic Product')
    .attr('font-size', '15px'); 
  
  svgContainer.append('text')
    .attr('x', width / 2 + 120)
    .attr('y', height + 50)
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
    .attr('class', 'info');

  var years = data.data.map(function(item) {
    var quarter;
    var temp = item[0].substring(5, 7);
    
    if(temp === '01') {
      quarter = 'Q1';
    }
    else if (temp === '04') {
      quarter = 'Q2';
    }
    else if(temp === '07') {
      quarter = 'Q3';
    }
    else if(temp ==='10') {
      quarter = 'Q4';
    }

    return item[0].substring(0, 4) + ' ' + quarter
  });
  
  var yearsDate = data.data.map(function(item) {
    return new Date(item[0]);
  });

  //change date string into date format for min/max computation. 
  var xMax = new Date(d3.max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);
  var xScale = d3.scaleTime()
    .domain([d3.min(yearsDate), xMax])
    .range([0, width]);
  
  var xAxis = d3.axisBottom()
    .scale(xScale);
  
  var xAxisGroup = svgContainer
    .append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(60, 405)');
  
  var GDP = data.data.map(function(item) {
    return item[1]
  });
  
  var scaledGDP = [];
  
  var gdpMin = d3.min(GDP);
  var gdpMax = d3.max(GDP);
  
  var linearScale = d3.scaleLinear()
    .domain([0, gdpMax])
    .range([0, height]);
  
  scaledGDP = GDP.map(function(item) {
    return linearScale(item);
  });
  
  var yAxisScale = d3.scaleLinear()
    .domain([0, gdpMax])
    .range([height, 0]);
  
  var yAxis = d3.axisLeft(yAxisScale)
    
  var yAxisGroup = svgContainer.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(60, 5)');
    
  d3.select('svg').selectAll('rect')
    .data(scaledGDP)
    .enter()
    .append('rect')
    .attr('data-date', function(d, i) {
      return data.data[i][0]
    })
    .attr('data-gdp', function(d, i) {
      return data.data[i][1]
    })
    .attr('class', 'bar')
    .attr('x', function(d, i) {
      return xScale(yearsDate[i]);
    })
    .attr('y', function(d, i) {
      return height - d;
    })
    .attr('width', barWidth)
    .attr('height', function(d) {
      return d;
    })
    .style('fill', 'orange')
    .attr('transform', 'translate(60, 5)')
    .on('mouseover', function(d, i) {
      overlay.transition()
        .duration(0)
        .style('height', d + 'px')
        .style('width', barWidth + 'px')
        .style('opacity', 1)
        .style('left', (i * barWidth) + 0 + 'px')
        .style('top', height - d + 5 + 'px')
        .style('transform', 'translateX(61px)');
      tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
      tooltip.html(years[i] + '<br>' + '$' + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
        .attr('data-date', data.data[i][0])
        .style('left', (i * barWidth) + 30 + 'px')
        .style('top', height - 100 + 'px')
        .style('transform', 'translateX(61px)');
    })
    .on('mouseout', function(d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
      overlay.transition()
        .duration(200)
        .style('opacity', 0);
    });
})
.catch(function(error) {
  alert(error); 
});