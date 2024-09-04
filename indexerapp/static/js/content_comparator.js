

content_comparator_init = function()
{
    console.log('content_comparator_init');

    var content_table_left = $('#content_left').DataTable({
        "ajax": {
            "url": pageRoot+"/api/content/?format=datatables", // Add your URL here
            "dataSrc": function (data) {
                var processedData=[]

                for(var c in data.data)
                {
                    processedData[c] = {}
                    for(var f in data.data[c])
                    {
                        processedData[c][f] = getPrintableValues(f,data.data[c][f]).value;
                    }
                }
                
                return processedData;
            }
        },
        "processing": false,
        "serverSide": true,
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pagingType": "full_numbers",
        "pageLength": 25,
        "columns": [
            { "data": "manuscript", "title": "Manuscript ID", "visible": false },
            { "data": "manuscript_name", "title": "Manuscript" },
            { "data": "where_in_ms_from", "title": "Where in MS (from)" },
            { "data": "where_in_ms_to", "title": "Where in MS (to)" },
            { "data": "rite_name_from_ms", "title": "Rite name from MS" },
            { "data": "subsection", "title": "Subsection" },
            { "data": "function", "title": "Function / Genre" },
            { "data": "subfunction", "title": "Subgenre" },
            { "data": "biblical_reference", "title": "Biblical reference" },
            { "data": "formula_standarized", "title": "Formula (standarized)" },
            { "data": "formula_text", "title": "Formula (text from MS)" },
            { 
                "data": "similarity_levenshtein_percent", 
                "title": "Similarity (levenshtein)",
                "render": function (data, type, row, meta) {
                    return row.similarity_levenshtein_percent + "%";
                },
                "createdCell": function(td, cellData, rowData, row, col) {
                    if(cellData == '-' || !cellData || cellData < 50)
                        $(td).css("color", "red");
                    else if( cellData > 99.9)
                        $(td).css("color", "green");
                    else
                        $(td).css("color", "#a66b00");
                },
            },
            { "data": "similarity_by_user", "title": "Similarity (by user)" },
            { "data": "original_or_added", "title": "Original or Added", "visible": false },
            { "data": "quire", "title": "Quire" },
            { "data": "music_notation", "title": "Music Notation" },


            { "data": "sequence_in_ms", "title": "Sequence in MS" },
            { "data": "proper_texts", "title": "Proper texts", searchable: false },



            { "data": 'subrite_name_from_ms', "title": "Subrite name from MS", searchable: false },
            { "data": 'edition_index', "title": "Edition Index", searchable: false },
            { "data": 'edition_subindex', "title": "Edition Subindex", searchable: false },


            { "data": "authors", "title": "Authors" },
            { "data": "data_contributor", "title": "Data contributor" }
            // Add more columns as needed
        ],
        "createdRow": function(row, data, dataIndex) {
            if (data.original_or_added == "ORIGINAL") {
                $(row).addClass('medieval-row');
            } else if (data.original_or_added == "ADDED")  {
                $(row).addClass('non-medieval-row');
            }
        }
    });


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

        content_table_left.columns(0).search(id).draw();

    });



    //////////////////////////


    var content_table_right = $('#content_right').DataTable({
        "ajax": {
            "url": pageRoot+"/api/content/?format=datatables", // Add your URL here
            "dataSrc": function (data) {
                var processedData=[]

                for(var c in data.data)
                {
                    processedData[c] = {}
                    for(var f in data.data[c])
                    {
                        processedData[c][f] = getPrintableValues(f,data.data[c][f]).value;
                    }
                }
                
                return processedData;
            }
        },
        "processing": false,
        "serverSide": true,
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pagingType": "full_numbers",
        "pageLength": 25,
        "columns": [
            { "data": "manuscript", "title": "Manuscript ID", "visible": false },
            { "data": "manuscript_name", "title": "Manuscript" },
            { "data": "where_in_ms_from", "title": "Where in MS (from)" },
            { "data": "where_in_ms_to", "title": "Where in MS (to)" },
            { "data": "rite_name_from_ms", "title": "Rite name from MS" },
            { "data": "subsection", "title": "Subsection" },
            { "data": "function", "title": "Function / Genre" },
            { "data": "subfunction", "title": "Subgenre" },
            { "data": "biblical_reference", "title": "Biblical reference" },
            { "data": "formula_standarized", "title": "Formula (standarized)" },
            { "data": "formula_text", "title": "Formula (text from MS)" },
            { 
                "data": "similarity_levenshtein_percent", 
                "title": "Similarity (levenshtein)",
                "render": function (data, type, row, meta) {
                    return row.similarity_levenshtein_percent + "%";
                },
                "createdCell": function(td, cellData, rowData, row, col) {
                    if(cellData == '-' || !cellData || cellData < 50)
                        $(td).css("color", "red");
                    else if( cellData > 99.9)
                        $(td).css("color", "green");
                    else
                        $(td).css("color", "#a66b00");
                },
            },
            { "data": "similarity_by_user", "title": "Similarity (by user)" },
            { "data": "original_or_added", "title": "Original or Added", "visible": false },
            { "data": "quire", "title": "Quire" },
            { "data": "music_notation", "title": "Music Notation" },


            { "data": "sequence_in_ms", "title": "Sequence in MS" },
            { "data": "proper_texts", "title": "Proper texts", searchable: false },



            { "data": 'subrite_name_from_ms', "title": "Subrite name from MS", searchable: false },
            { "data": 'edition_index', "title": "Edition Index", searchable: false },
            { "data": 'edition_subindex', "title": "Edition Subindex", searchable: false },


            { "data": "authors", "title": "Authors" },
            { "data": "data_contributor", "title": "Data contributor" }
        ],
        "createdRow": function(row, data, dataIndex) {
            if (data.original_or_added == "ORIGINAL") {
                $(row).addClass('medieval-row');
            } else if (data.original_or_added == "ADDED")  {
                $(row).addClass('non-medieval-row');
            }
        },
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

        content_table_right.columns(0).search(id).draw();

    });

    $('#compareButton').click(function() {
        var leftId = $('.manuscript_filter_left').val();
        var rightId = $('.manuscript_filter_right').val();
        var url = pageRoot+"/compare_graph/?left=" + leftId + "&right=" + rightId;
        window.open(url, '_blank');
    });


    $('#compareEditionButton').click(function() {
        var leftId = $('.manuscript_filter_left').val();
        var rightId = $('.manuscript_filter_right').val();
        var url = pageRoot+"/compare_edition_graph/?left=" + leftId + "&right=" + rightId;
        window.open(url, '_blank');
    });





    //////////////////////////


    //RESIZER:
    const leftColumn = document.getElementById("leftColumn");
    const rightColumn = document.getElementById("rightColumn");

    leftColumn.style.width = `49%`;
    rightColumn.style.width = `49%`;


    const resizer = document.getElementById("resizer");
    let isResizing = false;

    // Event listener for mouse down on the resizer
    resizer.addEventListener("mousedown", function (e) {
        isResizing = true;
        res_mouse_x = e.clientX;
        leftWidth = leftColumn.getBoundingClientRect().width;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", function () {
            isResizing = false;
            document.removeEventListener("mousemove", handleMouseMove);
        });
    });

    function handleMouseMove(e) {
        if (isResizing) {
            // How far the mouse has been moved
            const dx = e.clientX - res_mouse_x;

            const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
            if(newLeftWidth<1)
                newLeftWidth=1;
            
            const containerWidth = leftColumn.offsetWidth + rightColumn.offsetWidth;

            leftColumn.style.width = `${newLeftWidth-1}%`;
            rightColumn.style.width = `${100 - newLeftWidth-1}%`;

            console.log(newLeftWidth);

            // Adjust the position of the resizer
            const resizerPosition = (newLeftWidth / 100) * containerWidth;
            //resizer.style.left = `${resizerPosition}px`;
            resizer.style.left =`${newLeftWidth}%`;
        }
    }

}

