

content_init = function()
{



    var content_table = $('#content').DataTable({
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
            },
            "data":
            {
                //"where_min": 12,
                //"where_max": 15
            }
        },
        "processing": false,
        "serverSide": true,
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pagingType": "full_numbers",
        "pageLength": 25,
        "show_column_filters": false,
        "columns": [
            { "data": "manuscript", "title": "Manuscript ID", "visible": false },
            { "data": "manuscript_name", "title": "Manuscript" , searchable: false },
            { "data": "where_in_ms_from", "title": "Where in MS (from)" },
            { "data": "where_in_ms_to", "title": "Where in MS (to)" },
            { "data": "rite_name_from_ms", "title": "Rite name from MS" },
            { "data": "subsection", "title": "Subsection", searchable: false },
            { "data": "function", "title": "Function / Genre", searchable: false },
            { "data": "subfunction", "title": "Subgenre", searchable: false },
            { "data": "biblical_reference", "title": "Biblical reference", searchable: false },
            { "data": "formula_standarized", "title": "Formula (standarized)", searchable: false },
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
                searchable: false
            },
            { "data": "similarity_by_user", "title": "Similarity (by user)", searchable: false },
            { "data": "original_or_added", "title": "Original or Added", "visible": false , searchable: false},
            { "data": "quire", "title": "Quire", searchable: false },
            { "data": "music_notation", "title": "Music Notation", searchable: false },


            { "data": "sequence_in_ms", "title": "Sequence in MS", searchable: false },

            { "data": "proper_texts", "title": "Proper texts", searchable: false },


            { "data": 'subrite_name_from_ms', "title": "Subrite name from MS", searchable: false },
            { "data": 'edition_index', "title": "Edition Index", searchable: false },
            { "data": 'edition_subindex', "title": "Edition Subindex", searchable: false },

            { "data": "authors", "title": "Authors", searchable: false },
            { "data": "data_contributor", "title": "Data contributor", searchable: false }
            // Add more columns as needed
        ],
        "createdRow": function(row, data, dataIndex) {
            if (data.original_or_added == "ORIGINAL") {
                $(row).addClass('medieval-row');
            } else if (data.original_or_added == "ADDED")  {
                $(row).addClass('non-medieval-row');
            }
        },
        "initComplete": function () {

            $('#content thead tr')
                .clone(true)
                .addClass('filters')
                .appendTo('#content thead');

            var api = this.api();
 
            // For each column
            api
                .columns()
                .eq(0)
                .each(function (colIdx) 
                {
                    var column = api.column(colIdx);
                    var columnDef = column.settings()[0].aoColumns[colIdx];
            
                    // Check if the column is searchable
                    if (columnDef.bSearchable)
                    {
                        // Set the header cell to contain the input element
                        var cell = $('.filters th').eq(
                            $(api.column(colIdx).header()).index()
                        );
                        var title = $(cell).text();
                        $(cell).html('<input type="text" placeholder="' + title + '" />');
    
                        // On every keypress in this input
                        $(
                            'input',
                            $('.filters th').eq($(api.column(colIdx).header()).index())
                        )
                        .off('keyup change')
                        .on('change', function (e) 
                        {
                            // Get the search value
                            $(this).attr('title', $(this).val());
                            var regexr = '{search}'; //$(this).parents('th').find('select').val();

                            var cursorPosition = this.selectionStart;
                            // Search the column for that value
                            api
                                .column(colIdx)
                                .search(
                                    this.value != ''
                                        /*? regexr.replace('{search}', '(((' + this.value + ')))')*/
                                        ? regexr.replace('{search}', '' + this.value + '')
                                        : '',
                                    this.value != '',
                                    this.value == ''
                                )
                                .draw();
                        })
                        .on('keyup', function (e) 
                        {
                            e.stopPropagation();

                            $(this).trigger('change');
                            $(this)
                                .focus()[0]
                                .setSelectionRange(cursorPosition, cursorPosition);
                        });
                    }
                    else{
                        var cell = $('.filters th').eq(
                            $(api.column(colIdx).header()).index()
                        );
                        $(cell).html('');
                    }
                });
        },
    });


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

    $('.manuscript_filter').on('select2:select', function (e) {
        var data = e.params.data;
        var id = data.id;
        console.log(id);

        content_table.columns(0).search(id).draw();

    });


    /*
    var whereInMsSlider = document.getElementById('where_in_ms_slider');

    noUiSlider.create(whereInMsSlider, {
        start: [0, 500],
        step: 0.5,
        connect: true,
        range: {
            'min': 0,
            'max': 500
        }

    });

    var whereInMsSliderValue = document.getElementById('where_in_ms_slider_value');

    whereInMsSlider.noUiSlider.on('update', function (values, handle) {
        whereInMsSliderValue.innerHTML = values[0] + ' - '+values[1];
    });


    var whereInMsSlider = document.getElementById('where_in_ms_slider');

    //check if need to apply filter:
    const min = whereInMsSlider.noUiSlider.options.range.min ;
    const max = whereInMsSlider.noUiSlider.options.range.max ; 
    
    const values = whereInMsSlider.noUiSlider.get(true);

    if(min != values[0] || max != values[1])
    {
        console.log('filter active!');
    }
    */

}