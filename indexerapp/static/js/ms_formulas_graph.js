
ms_formulas_graph_init = function()
{
    /*
    const urlParams = new URLSearchParams(queryString);
    let left = urlParams.get('left');
    let right = urlParams.get('right');
    */
    function setTableHeight() {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        // console.log('height: ', windowWidth);
        if(windowWidth > 640){
            var tableHeight = windowHeight - 400;
        } else {
            var tableHeight = windowHeight - 370;
        }
        
        
        $('#chart').css('height', tableHeight + 'px');
    }
    setTableHeight();

    // Adjust height on window resize
    $(window).resize(function() {
        setTableHeight();
    });


    left_id = -1;
    right_id = -1;

    $('.manuscript_filter_left').select2({
        ajax: {
            url: pageRoot+'/manuscripts-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          }
    });

    $('.manuscript_filter_left').on('select2:select', function (e) {
        var data = e.params.data;
        var id = data.id;
        console.log(id);

        left_id = id;
        fetchDataAndDrawChart(left_id,right_id);

        //content_table_left.columns(0).search(id).draw();

    });

    $('.manuscript_filter_right').select2({
        ajax: {
            url: pageRoot+'/manuscripts-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          }
    });

    $('.manuscript_filter_right').on('select2:select', function (e) {
        var data = e.params.data;
        var id = data.id;
        console.log(id);

        right_id = id;
        fetchDataAndDrawChart(left_id,right_id);

        //content_table_right.columns(0).search(id).draw();

    });





    function fetchDataAndDrawChart(left_id,right_id)
    {
        if(left_id == -1 || right_id == -1)
            return -1;

        fetch(pageRoot+"/compare_formulas_json/?left="+left_id+"&right="+right_id)
            .then(response => response.json())
            .then(data => createChart(data));
    }

    function getWidth() {
        return Math.max(
          document.body.scrollWidth,
          document.documentElement.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.offsetWidth,
          document.documentElement.clientWidth
        );
      }
      
      function getHeight() {
        return Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.documentElement.clientHeight
        );
      }

    

    function createChart(data) 
    {
        let chartHeight = $('#chart').height();
        const margin = { top: 20, right: 30, bottom: 40, left: 150 },
        width = getWidth() - margin.left - margin.right - 50,
        height = chartHeight - margin.top - margin.bottom;

        $("#chart").empty()

        const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scalePoint().range([0, height]).padding(0.1);

        const editionIndexes = [...new Set(data.map(d => d.formula_id))];
        y.domain(data.map(d => d.Table));
        x.domain(d3.extent(data, d => d.sequence_in_ms));

        const color = d3.scaleOrdinal(d3.schemeCategory10).domain(editionIndexes);

        const line = d3.line()
                        .x(d => x(d.sequence_in_ms))
                        .y(d => y(d.Table));

        svg.append("g").attr("class", "x axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g").attr("class", "y axis")
            .call(d3.axisLeft(y));

        const tooltip = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);

        let selectedLine = null;
        let selectedCircles = null;
    
        function handleClickOnLine(values, formula_id) {
            // Jeśli coś jest zaznaczone, odznacz
            if (selectedLine) {
                selectedLine.classed("selected-line", false);
                selectedCircles.classed("selected-circle", false);
            }
        
            // Zaznacz klikniętą linię i przenieś ją na wierzch
            selectedLine = d3.select(this).classed("selected-line", true).raise();
        
            // Zaznacz wszystkie kropki dla tej linii i przenieś je na wierzch
            selectedCircles = svg.selectAll('circle')
                .filter(d => d.formula_id === formula_id)
                .classed("selected-circle", true)
                .raise();  // Podnieś kropki na wierzch
        }
        
        function handleClickOnCircle(d) {
            // Jeśli coś jest zaznaczone, odznacz
            if (selectedLine) {
                selectedLine.classed("selected-line", false);
                selectedCircles.classed("selected-circle", false);
            }
        
            // Zaznacz linię powiązaną z tą kropką i przenieś ją na wierzch
            selectedLine = svg.selectAll('path')
                .filter(function() {
                    const lineData = d3.select(this).datum();
                    return lineData && lineData.some(line => line.formula_id === d.formula_id);
                })
                .classed("selected-line", true)
                .raise();  // Podnieś linię na wierzch
        
            // Zaznacz wszystkie kropki dla tej linii i przenieś je na wierzch
            selectedCircles = svg.selectAll('circle')
                .filter(dotData => dotData.formula_id === d.formula_id)
                .classed("selected-circle", true)
                .raise();  // Podnieś kropki na wierzch
        }
    
        editionIndexes.forEach(formula_id => {
            const values = data.filter(d => d.formula_id === formula_id);
        
            // Dodaj ścieżki (linie) najpierw
            svg.append("path")
                .datum(values)
                .attr("class", "data-line")
                .attr("fill", "none")
                .attr("stroke", color(formula_id))
                .attr("stroke-width", 3)  // Ustaw szerokość linii na 3
                .attr("d", line)
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Formula: ${values[0].formula}<br>
                                  Sequence: ${values[0].sequence_in_ms} ms -> ${values[values.length - 1].sequence_in_ms} ms`)
                        .style("left", `${event.pageX + 5}px`)
                        .style("top", `${event.pageY - 28}px`);
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("click", function() { handleClickOnLine.call(this, values, formula_id); });  // Kliknięcie na linię
        
            // Dodaj kropki (punkty) na końcu, aby były na wierzchu
            svg.selectAll("dot")
                .data(values)
                .enter().append("circle")
                .attr("r", 7)  // Ustaw promień kropki na 7
                .attr("cx", d => x(d.sequence_in_ms))
                .attr("cy", d => y(d.Table))
                .attr("fill", color(formula_id))
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Formula: ${d.formula_id}<br>Sequence: ${d.sequence_in_ms}<br>${d.formula}`)
                        .style("left", `${event.pageX + 5}px`)
                        .style("top", `${event.pageY - 28}px`);
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("click", function(event, d) { handleClickOnCircle.call(this, d); });  // Kliknięcie na kropkę
        });
                        
        // Kliknięcie poza linią/kropką, aby odznaczyć wszystko
        svg.on("click", function(event) {
            if (!d3.select(event.target).classed("data-line") && !d3.select(event.target).classed("circle")) {
                if (selectedLine) {
                    selectedLine.classed("selected-line", false);
                    selectedCircles.classed("selected-circle", false);
                    selectedLine = null;
                    selectedCircles = null;
                }
            }
        });
            

        function handleZoom(e) {
            // Rescale the x-axis based on zoom level
            const new_x = e.transform.rescaleX(x);
        
            // Update the x-axis, but keep the y-axis untouched
            svg.select(".x.axis").call(d3.axisBottom(new_x));
        
            // Update only the x position of circles, no scaling for size or y-axis
            svg.selectAll('circle')
                .attr('cx', d => new_x(d.sequence_in_ms));  // Update x position only
        
            // Update the paths (lines) with the new x-scale, ensure proper data binding
            svg.selectAll('path.data-line')  // Select paths associated with data lines
                .attr('d', d => line
                    .x(d => new_x(d.sequence_in_ms))  // Update the x position using new_x
                    .y(d => y(d.Table))(d));  // Keep the y position the same
        }
        
        
        
        let zoom = d3.zoom()
        .on('zoom', handleZoom);
        
        d3.select('svg')
        .call(zoom);
    }
}
