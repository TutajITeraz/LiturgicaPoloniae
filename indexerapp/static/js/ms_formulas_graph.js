ms_formulas_graph_init = function() {
    $('#traditionFilter').select2();
    $('#sacramentarySelect').select2();

    let originalData = [];

    $('#identifyTraditionsBtn').on('click', function() {
        showStats(originalData);
        renderFilteredChart();
    });

    function setTableHeight() {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        let tableHeight;
        if (windowWidth > 640) {
            tableHeight = windowHeight - 400;
        } else {
            tableHeight = windowHeight - 370;
        }
        $('#chart').css('height', tableHeight + 'px');
    }
    setTableHeight();
    $(window).resize(setTableHeight);

    let left_id = -1;
    let right_id = -1;

    $('.manuscript_filter_left').select2({
        ajax: {
            url: pageRoot + '/manuscripts-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            }
        }
    });

    $('.manuscript_filter_right').select2({
        ajax: {
            url: pageRoot + '/manuscripts-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            }
        }
    });

    $('.manuscript_filter_left').on('select2:select', function(e) {
        left_id = e.params.data.id;
        fetchDataAndDrawChart(left_id, right_id);
    });

    $('.manuscript_filter_right').on('select2:select', function(e) {
        right_id = e.params.data.id;
        fetchDataAndDrawChart(left_id, right_id);
    });

    $('#traditionFilter').on('change', function() {
        renderFilteredChart();
    });

    $('#colorizeTraditions').on('change', function() {
        renderFilteredChart();
    });

    function renderFilteredChart() {
        showSpinner("Updating graph...");
        const selected = $('#traditionFilter').val();
        let filteredData = originalData;

        if (selected && selected.length > 0) {
            filteredData = originalData.filter(item => {
                const traditions = item.formula_traditions || [];
                return selected.every(t => traditions.includes(t));
            });
        }
        createChart(filteredData);
    }

    function showSpinner(text) {
        $('#chart').html(`<div class="text-center py-10 text-gray-600 font-semibold">${text}...</div>`);
    }

    function fetchDataAndDrawChart(left_id, right_id) {
        if (left_id === -1 || right_id === -1) return;

        showSpinner("Data loading");

        fetch(pageRoot + "/compare_formulas_json/?left=" + left_id + "&right=" + right_id)
            .then(response => response.json())
            .then(data => {
                originalData = data;
                showSpinner("Generating graph");
                renderFilteredChart();
            });
    }

    function getWidth() {
        return Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollHeight,
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

    function showStats(data) {
        const container = document.getElementById('ms_stats');
        container.innerHTML = '';

        const msGroups = {};
        const allFormulaIds = new Map();
        const allFormulaTraditions = new Map();
        const allTraditions = new Set();

        for (const item of data) {
            const table = item.Table;
            if (!msGroups[table]) msGroups[table] = [];
            msGroups[table].push(item);

            if (!allFormulaIds.has(item.formula_id)) {
                allFormulaIds.set(item.formula_id, new Set());
            }
            allFormulaIds.get(item.formula_id).add(table);

            if (!allFormulaTraditions.has(item.formula_id)) {
                allFormulaTraditions.set(item.formula_id, new Set());
            }
            item.formula_traditions.forEach(trad => {
                allFormulaTraditions.get(item.formula_id).add(trad);
                allTraditions.add(trad);
            });
        }

        const msStats = [];

        for (const [ms, entries] of Object.entries(msGroups)) {
            let total = entries.length;
            let gregOnly = 0,
                gelasOnly = 0,
                both = 0,
                greg = 0,
                gelas = 0,
                unattributed = 0;

            for (const e of entries) {
                const t = new Set(e.formula_traditions);
                if (t.has('Gregorianum')) greg++;
                if (t.has('Gelasianum')) gelas++;

                if (t.has('Gregorianum') && t.has('Gelasianum')) {
                    both++;
                } else if (t.has('Gregorianum')) gregOnly++;
                else if (t.has('Gelasianum')) gelasOnly++;

                if (t.size === 0) unattributed++;
            }

            msStats.push({
                ms,
                total,
                gregOnly,
                gelasOnly,
                both,
                unattributed
            });
        }

        let inBothMS = 0;
        let traditionCount = {};
        let totalShared = 0;
        let sharedGregOnly = 0,
            sharedGelasOnly = 0,
            sharedBoth = 0,
            sharedUnattributed = 0;

        for (const trad of allTraditions) traditionCount[trad] = 0;

        for (const [id, sets] of allFormulaIds.entries()) {
            if (sets.size > 1) {
                inBothMS++;
                const traditions = allFormulaTraditions.get(id);
                totalShared++;

                if (traditions.has('Gregorianum') && traditions.has('Gelasianum')) {
                    sharedBoth++;
                } else if (traditions.has('Gregorianum')) sharedGregOnly++;
                else if (traditions.has('Gelasianum')) sharedGelasOnly++;

                if (traditions.size === 0) {
                    sharedUnattributed++;
                }
            }
        }

        let html = `<div class="space-y-6">`;

        for (const stat of msStats) {
            html += `
                <div class="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${stat.ms}</h3>
                    <ul class="text-sm text-gray-700 space-y-1">
                        <li><span class="font-medium">Total orations:</span> ${stat.total}</li>
                        <li><span class="font-medium">Gregorianum:</span> ${stat.gregOnly}</li>
                        <li><span class="font-medium">Gelasianum:</span> ${stat.gelasOnly}</li>
                        <li><span class="font-medium">Both traditions:</span> ${stat.both}</li>
                        <li><span class="font-medium">Unattributed:</span> ${stat.unattributed}</li>
                    </ul>
                </div>`;
        }

        html += `
            <div class="border border-gray-300 rounded-lg p-4 bg-yellow-50 shadow-inner">
                <h3 class="text-lg font-semibold text-yellow-900 mb-2">Global Stats</h3>
                <ul class="text-sm text-yellow-800 space-y-1">
                    <li><span class="font-medium">Number of connections between manuscripts:</span> ${totalShared}</li>
                    <li><span class="font-medium">Gregorianum:</span> ${sharedGregOnly}</li>
                    <li><span class="font-medium">Gelasianum:</span> ${sharedGelasOnly}</li>
                    <li><span class="font-medium">Both traditions:</span> ${sharedBoth}</li>
                    <li><span class="font-medium">Unattributed:</span> ${sharedUnattributed}</li>
                </ul>
            </div>
        </div>`;

        container.innerHTML = html;
    }

    function createChart(data) {
        let chartHeight = $('#chart').height();
        const margin = {
                top: 20,
                right: 30,
                bottom: 40,
                left: 300 // Increased margin for longer labels
            },
            width = getWidth() - margin.left - margin.right - 50 - 340,
            height = chartHeight - margin.top - margin.bottom;

        $("#chart").empty();

        const svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g") // Append a group for zoom/pan transformations
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scalePoint().range([0, height]).padding(0.1);

        const editionIndexes = [...new Set(data.map(d => d.formula_id))];
        y.domain(data.map(d => d.Table));
        x.domain(d3.extent(data, d => d.sequence_in_ms));

        const colorizeTraditions = $('#colorizeTraditions').is(':checked');

        const traditionColors = {
            "Gregorianum": "#0000e7",
            "Gelasianum": "#980000",
            "Both": "#00983a",
            "Unattributed": "#777777"
        };

        const color = d3.scaleOrdinal(d3.schemeCategory10).domain(editionIndexes);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        let selectedLine = null;
        let selectedCircles = null;

        // Function to handle highlighting
        function highlightConnection(formula_id) {
            // Remove previous highlighting
            g.selectAll(".selected-line").classed("selected-line", false);
            g.selectAll(".selected-circle").classed("selected-circle", false);

            // Select and highlight the line
            selectedLine = g.selectAll('path.connection-line')
                .filter(d => d.formula_id === formula_id)
                .classed("selected-line", true)
                .raise();

            // Select and highlight the circles
            selectedCircles = g.selectAll('circle')
                .filter(d => d.formula_id === formula_id)
                .classed("selected-circle", true)
                .raise();
        }

        function handleClickOnCircle(d) {
            highlightConnection(d.formula_id);
        }

        function handleClickOnLine(d) {
            highlightConnection(d.formula_id);
        }

        // Group data by formula_id and Table for drawing connections
        const groupedData = d3.group(data, d => d.formula_id, d => d.Table);

        editionIndexes.forEach(formula_id => {
            const values = data.filter(d => d.formula_id === formula_id);

            let traditionClass = "";
            let connectionColor = color(formula_id); // Default d3.schemeCategory10 color
            let circleColor = color(formula_id); // Default d3.schemeCategory10 color

            if (colorizeTraditions) {
                const traditions = values[0].formula_traditions;

                if (traditions.includes("Gregorianum") && traditions.includes("Gelasianum")) {
                    traditionClass = "Both";
                    connectionColor = traditionColors["Both"];
                    circleColor = traditionColors["Both"];
                } else if (traditions.includes("Gregorianum")) {
                    traditionClass = "Gregorianum";
                    connectionColor = traditionColors["Gregorianum"];
                    circleColor = traditionColors["Gregorianum"];
                } else if (traditions.includes("Gelasianum")) {
                    traditionClass = "Gelasianum";
                    connectionColor = traditionColors["Gelasianum"];
                    circleColor = traditionColors["Gelasianum"];
                } else {
                    traditionClass = "Unattributed";
                    connectionColor = traditionColors["Unattributed"];
                    circleColor = traditionColors["Unattributed"];
                }
            }

            // Draw connection lines
            g.selectAll(`.connection-line-${formula_id}`) // Use formula_id as part of the class
                .data(data.filter(d => d.formula_id === formula_id)) // Filter data to only include the current formula
                .enter()
                .append("path")
                .attr("class", `connection-line connection-line-${formula_id}`) // Add unique class for each formula_id
                .attr("fill", "none")
                .attr("stroke", connectionColor) // Set connection color
                .attr("stroke-width", 3) // Set line thickness to 3
                .attr("d", function(d) {
                    const leftMs = d.Table;

                    if (!groupedData.has(formula_id)) return null;

                    const msKeys = Array.from(groupedData.get(formula_id).keys());
                    if (msKeys.length < 2) return null;

                    const rightMs = msKeys.find(key => key !== leftMs);
                    if (!rightMs) return null;

                    const leftEntries = groupedData.get(formula_id).get(leftMs);
                    const rightEntries = groupedData.get(formula_id).get(rightMs);

                    if (!leftEntries || !rightEntries) return null;
                    //Determine number of occurences of formulas in both manuscripts
                    const leftCount = leftEntries.length;
                    const rightCount = rightEntries.length;

                    let connections = [];

                    for (let i = 0; i < Math.max(leftCount, rightCount); i++) {
                        let source = leftEntries[Math.min(i, leftCount - 1)]; //Loop the last entry to the source
                        let target = rightEntries[Math.min(i, rightCount - 1)]; //Loop the last entry to the target

                        connections.push({
                            source: source,
                            target: target
                        });
                    }

                    let pathString = "";
                    connections.forEach(connection => {
                        if (connection.source.Table !== connection.target.Table) {
                            pathString += `M${x(connection.source.sequence_in_ms)} ${y(connection.source.Table)} L${x(connection.target.sequence_in_ms)} ${y(connection.target.Table)}`;
                        }
                    });
                    return pathString;
                })
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Formula: ${values[0].formula}<br>
                                  Tradition: ${values[0].formula_traditions.join(', ')}<br>
                                  Sequence: ${values[0].sequence_in_ms} -> ${values[values.length - 1].sequence_in_ms}`)
                        .style("left", `${event.pageX + 5}px`)
                        .style("top", `${event.pageY - 28}px`);
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("click", function(event, d) {
                    handleClickOnLine.call(this, d);
                    event.stopPropagation();
                });

            g.selectAll("dot")
                .data(values)
                .enter().append("circle")
                .attr("r", 7)
                .attr("cx", d => x(d.sequence_in_ms))
                .attr("cy", d => y(d.Table))
                .attr("fill", circleColor)
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Formula: ${d.formula_id}<br>
                        Tradition: ${values[0].formula_traditions.join(', ')}<br>
                        Sequence: ${d.sequence_in_ms}<br>${d.rite_name}<br>${d.formula}`)
                        .style("left", `${event.pageX + 5}px`)
                        .style("top", `${event.pageY - 28}px`);
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("click", function(event, d) {
                    handleClickOnCircle.call(this, d);
                    event.stopPropagation();
                });
        }); // End editionIndexes.forEach

        g.append("g").attr("class", "y axis")
            .attr("transform", `translate(-5,0)`) //This line added
            .call(d3.axisLeft(y)
                .tickFormat(d => {
                    const maxLength = 90; // Increased maximum length
                    let text = d;
                    if (text.length > maxLength) {
                        text = text.substring(0, maxLength) + "...";
                    }
                    return text;
                }))
            .selectAll("text")
            .call(wrap, margin.left - 10);


        g.append("g").attr("class", "x axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.on("click", function(event) {
            if (!d3.select(event.target).classed("dot") && !d3.select(event.target).classed("connection-line")) {
                // Deselect if click outside of the dots or connection lines
                g.selectAll(".selected-line").classed("selected-line", false);
                g.selectAll(".selected-circle").classed("selected-circle", false);
            }
        });

        function handleZoom(e) {
            // Rescale the x-axis based on zoom level
            const new_x = e.transform.rescaleX(x);

            // Update the x-axis, but keep the y-axis untouched
            g.select(".x.axis").call(d3.axisBottom(new_x));

            // Update only the x position of circles, no scaling for size or y-axis
            g.selectAll('circle')
                .attr('cx', d => new_x(d.sequence_in_ms)); // Update x position only

            // Update the paths (lines) with the new x-scale, ensure proper data binding
            g.selectAll('path.connection-line') // Select paths associated with data lines
                .attr('d', function(d) {
                    const leftMs = d.Table;

                    if (!groupedData.has(d.formula_id)) return null;

                    const msKeys = Array.from(groupedData.get(d.formula_id).keys());
                    if (msKeys.length < 2) return null;

                    const rightMs = msKeys.find(key => key !== leftMs);
                    if (!rightMs) return null;

                    const leftEntries = groupedData.get(d.formula_id).get(leftMs);
                    const rightEntries = groupedData.get(d.formula_id).get(rightMs);

                    if (!leftEntries || !rightEntries) return null;
                    const leftCount = leftEntries.length;
                    const rightCount = rightEntries.length;

                    let connections = [];

                    for (let i = 0; i < Math.max(leftCount, rightCount); i++) {
                        let source = leftEntries[Math.min(i, leftCount - 1)];
                        let target = rightEntries[Math.min(i, rightCount - 1)];

                        connections.push({
                            source: source,
                            target: target
                        });
                    }
                    let pathString = "";
                    connections.forEach(connection => {
                        if (connection.source.Table !== connection.target.Table) {
                            pathString += `M${new_x(connection.source.sequence_in_ms)} ${y(connection.source.Table)} L${new_x(connection.target.sequence_in_ms)} ${y(connection.target.Table)}`;
                        }
                    });
                    return pathString;
                });
        }

        let zoom = d3.zoom()
            .on('zoom', handleZoom);

        svg.call(zoom);
    }
}

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", -3).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", -3).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}