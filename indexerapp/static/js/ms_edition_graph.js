
ms_edition_graph_init = function()
{
    /*
    const urlParams = new URLSearchParams(queryString);
    let left = urlParams.get('left');
    let right = urlParams.get('right');
    */

    $('.manuscript_filter').select2({
        ajax: {
            url: pageRoot+'/manuscripts-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          }
    });

    $('#ms_select').on('select2:select', function (e) {
        mss = $('#ms_select').select2('data').map(item => item.id).join(';');
        console.log(mss);

        fetchDataAndDrawChart(mss);
    });

    $('#ms_select').on('select2:unselect', function (e) {
        mss = $('#ms_select').select2('data').map(item => item.id).join(';');
        console.log(mss);
        fetchDataAndDrawChart(mss);
    });


    function fetchDataAndDrawChart(mss)
    {

        fetch(pageRoot+"/compare_edition_json/?mss="+mss)
            .then(response => response.json())
            .then(data => createChart(data));
    }

    function createChart(data) {
        const margin = { top: 20, right: 30, bottom: 40, left: 40 },
                width = 1900 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

                $("#chart").empty()

                const svg = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

                const x = d3.scaleLinear().range([0, width]);
                const y = d3.scalePoint().range([0, height]).padding(1);

                const editionIndexes = [...new Set(data.map(d => d.edition_index))];
                y.domain(data.map(d => d.Table));
                x.domain(d3.extent(data, d => d.rite_sequence));

                const color = d3.scaleOrdinal(d3.schemeCategory10).domain(editionIndexes);

                const line = d3.line()
                                .x(d => x(d.rite_sequence))
                                .y(d => y(d.Table));

                svg.append("g").attr("class", "x axis")
                    .attr("transform", `translate(0,${height})`)
                    .call(d3.axisBottom(x));

                svg.append("g").attr("class", "y axis")
                    .call(d3.axisLeft(y));

                const tooltip = d3.select("body").append("div")
                                    .attr("class", "tooltip")
                                    .style("opacity", 0);

                editionIndexes.forEach(edition_index => {
                    const values = data.filter(d => d.edition_index === edition_index);
                    svg.append("path")
                        .datum(values)
                        .attr("fill", "none")
                        .attr("stroke", color(edition_index))
                        .attr("stroke-width", 1.5)
                        .attr("d", line)
                        .on("mouseover", function(event, d) {
                            tooltip.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                            tooltip.html(`Edition: ${edition_index}<br>${values[0].rite_name_standarized}`)
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
                        .attr("x", x(midpoint.rite_sequence))
                        .attr("y", y(midpoint.Table)+10)
                        .attr("transform", `rotate(90, ${x(midpoint.rite_sequence)}, ${y(midpoint.Table) + 10})`)
                        .text(edition_index);

                    svg.selectAll("dot")
                        .data(values)
                        .enter().append("circle")
                        .attr("r", 5)
                        .attr("cx", d => x(d.rite_sequence))
                        .attr("cy", d => y(d.Table))
                        .attr("fill", color(edition_index))
                        .on("mouseover", function(event, d) {
                            tooltip.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                            tooltip.html(`Edition: ${d.edition_index}<br>Rite: ${d.rite_sequence}<br>${d.rite_name_standarized}`)
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
