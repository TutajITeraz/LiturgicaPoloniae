
ms_formulas_graph_init = function()
{
    /*
    const urlParams = new URLSearchParams(queryString);
    let left = urlParams.get('left');
    let right = urlParams.get('right');
    */

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

    function createChart(data) {
        const margin = { top: 20, right: 30, bottom: 40, left: 40 },
                width = 4000 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

                $("#chart").empty()

                const svg = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

                const x = d3.scaleLinear().range([0, width]);
                const y = d3.scalePoint().range([0, height]).padding(1);

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

                editionIndexes.forEach(formula_id => {
                    const values = data.filter(d => d.formula_id === formula_id);
                    svg.append("path")
                        .datum(values)
                        .attr("fill", "none")
                        .attr("stroke", color(formula_id))
                        .attr("stroke-width", 1.5)
                        .attr("d", line)
                        .on("mouseover", function(event, d) {
                            tooltip.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                            tooltip.html(`Formula: ${formula_id}<br>${values[0].formula}`)
                                    .style("left", `${event.pageX + 5}px`)
                                    .style("top", `${event.pageY - 28}px`);
                        })
                        .on("mouseout", function() {
                            tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                        });

                    const midpointIndex = Math.floor(values.length / 2);
                    const midpoint = values[midpointIndex];


                    svg.append("text")
                        .attr("class", "line-label")
                        .attr("x", x(midpoint.sequence_in_ms))
                        .attr("y", y(midpoint.Table)+10)
                        .attr("transform", `rotate(90, ${x(midpoint.sequence_in_ms)}, ${y(midpoint.Table) + 10})`)
                        .text(formula_id);

                    svg.selectAll("dot")
                        .data(values)
                        .enter().append("circle")
                        .attr("r", 5)
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
                        });
                });
                }
}
