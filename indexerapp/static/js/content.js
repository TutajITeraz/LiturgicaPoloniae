

content_init = function()
{

    // function setTableHeight() {
    //     var windowHeight = $(window).height();
    //     var windowWidth = $(window).width();
    //     if(windowWidth > 768){
    //         var tableHeight = windowHeight - 500;
    //     } else {
    //         var tableHeight = windowHeight - 580;
    //     }
        
    //     $('#content').css('height', tableHeight + 'px');
    //     // console.log('table height : ', tableHeight);
    // }

    // // Set initial height
    // setTableHeight();

    // Adjust height on window resize

    $(document).ready(function(){
        $("#content_wrapper .dt-layout-row").eq(0).css({
            "position": "sticky",
            "top": "0px",
            "background": "#fff7f1",
            "z-index": "20",
        });
        $("#content_wrapper .dt-layout-row").eq(2).css({
            "position": "sticky",
            "bottom": "0px",
            "background": "#fff7f1",
            "z-index": "20",
        });
    });

    $(window).resize(function() {
        $("#content_wrapper .dt-layout-row").eq(0).css({
            "position": "sticky",
            "top": "0px",
            "background": "#fff7f1",
            "z-index": "20",
        });
        $("#content_wrapper .dt-layout-row").eq(2).css({
            "position": "sticky",
            "bottom": "0px",
            "background": "#fff7f1",
            "z-index": "20",
        });
    });

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
        "stateSave": false,
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pagingType": "full_numbers",
        "pageLength": 25,
        "show_column_filters": false,
        "columns": [

            { "data": "manuscript", "title": "Manuscript ID", "visible": false },
            { 
                "data": "manuscript_name", "title": "Manuscript Info",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    // console.log(oData);
                    let similardata = '';
                    if(oData.similarity_levenshtein_percent == '-' || oData.similarity_levenshtein_percent < '50' || !oData.similarity_levenshtein_percent){
                        similardata = 'red';
                    } else if(oData.similarity_levenshtein_percent > 99.99){
                        similardata = 'green';
                    } else {
                        similardata = '#a66b00';
                    }

                    let where_in_ms = oData.where_in_ms_from;
                    if(oData.where_in_ms_to != oData.where_in_ms_from && oData.where_in_ms_to != '-' )
                        where_in_ms+=" - "+oData.where_in_ms_to;

                    let html = "";

                    if ( ! $('.manuscript_filter').val() ){
                        html = "<h3 class='formula_standarize'>MS Name: <span class='manuscript_name'><b>"+oData.manuscript_name+"</b></span></h3>"
                    }

                    //html += /*"<h3 class='ms_name'>"+oData.manuscript_name+"</h3>"*/
                    /*"<h3 class='formula_standarize'><b>MS Name:</b><span class='manuscript_name'>"+oData.manuscript_name+"</span></h3>"
                    

                    +*/
                    
                    if (oData.rite_name_from_ms !='')
                        html += "<h3 class='formula_standarize'>Rite name from MS: <span class='formula_standarize_text'><b>"+oData.rite_name_from_ms+"</b></span></h3>"
                    if (oData.subrite_name_from_ms !='-')
                        html += "<h3 class='formula_standarize'>Subrite name from MS: <span class='formula_standarize_text'><b>"+oData.subrite_name_from_ms+"</b></span></h3>"
                    if (oData.formula_standarized !='')
                        html += "<h3 class='formula_standarize'>Formula (standarized): <span class='formula_standarize_text'><b>"+oData.formula_standarized+"</b></span></h3>"
                    if (oData.formula_text !='')
                        html += "<h3 class='formula_standarize'>Formula (text from MS): <span class='formula_standarize_text'><b>"+oData.formula_text+"</b></span></h3>"


                    html += "<div class='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2'>"

                    if (where_in_ms !='-')
                        html += "<div class='ms_contemporary_repository_place'><b>Where in MS : </b>"+where_in_ms+"</div>"
                    if (oData.subsection !='-')
                        html += "<div class='ms_main_script'><b>Subsection: </b>"+oData.subsection+"</div>"
                    if (oData.function !='-')
                        html += "<div class='ms_main_script'><b>Function / Genre: </b>"+oData.function+"</div>"
                    if (oData.quire !='-')
                        html += "<div class='ms_dating'><b>Quire: </b>"+oData.quire+"</div>"
                    

                    if (oData.biblical_reference !='-')
                        html += "<div class='ms_main_script'><b>Biblical reference: </b>"+oData.biblical_reference+"</div>"
                    if (oData.similarity_levenshtein_percent !='-')
                        html += "<div class='ms_main_script'><b>Similarity (levenshtein): </b><span style='color:"+similardata+"'>"+ oData.similarity_levenshtein_percent +"%</span></div>"
                    if (oData.similarity_by_user !='-')
                        html += "<div class='ms_main_script'><b>Similarity (by user): </b>"+oData.similarity_by_user+"</div>"
                    if (oData.sequence_in_ms !='-')
                        html += "<div class='ms_place_of_origin'><b>Sequence in MS: </b>"+oData.sequence_in_ms+"</div>"
                    if (oData.proper_texts !='-')
                        html += "<div class='ms_main_script'><b>Proper texts: </b>"+oData.proper_texts+"</div>"
                    
                    
                    if (oData.music_notation !='-')
                        html += "<div class='ms_decorated'><b>Music Notation: </b><span class='decorated_right'>"+oData.music_notation+"</span></div>"
                    if (oData.subfunction !='-')
                        html += "<div class='ms_main_script'><b>Subgenre: </b>"+oData.subfunction+"</div>"
                    if (oData.edition_index !='-')
                        html += "<div class='ms_main_script'><b>Edition Index: </b>"+oData.edition_index+"</div>"
                    if (oData.edition_subindex !='-')
                        html += "<div class='ms_main_script'><b>Edition Subindex: </b>"+oData.edition_subindex+"</div>"
                    if (oData.authors !='')
                        html += "<div class='ms_main_script'><b>Authors: </b>"+oData.authors+"</div>"
                    if (oData.data_contributor !='-')
                        html += "<div class='ms_how_many_quires'><b>Data contributor: </b><span class='decorated_right'>"+oData.data_contributor+"</span></div>"
                    
                    html += "</div>"
                    
                    ;

                    $(nTd).html(html);
            }},

            { "data": "sequence_in_ms", "title": "Sequence in MS", searchable: false , "visible": false },

            { "data": "manuscript_name", "title": "Manuscript" , searchable: false , "visible": false },
            { "data": "where_in_ms_from", "title": "Where in MS (from)" , "visible": false },
            { "data": "where_in_ms_to", "title": "Where in MS (to)" , "visible": false },
            { "data": "rite_name_from_ms", "title": "Rite name from MS" , "visible": false },
            { "data": "subsection", "title": "Subsection", searchable: false , "visible": false },
            { "data": "function", "title": "Function / Genre", searchable: false , "visible": false },
            { "data": "subfunction", "title": "Subgenre", searchable: false , "visible": false },
            { "data": "biblical_reference", "title": "Biblical reference", searchable: false , "visible": false },
            { "data": "formula_standarized", "title": "Formula (standarized)", searchable: false , "visible": false },
            { "data": "formula_text", "title": "Formula (text from MS)" , "visible": false },
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
                searchable: false, "visible": false
            },
            { "data": "similarity_by_user", "title": "Similarity (by user)", searchable: false , "visible": false },
            { "data": "original_or_added", "title": "Original or Added", "visible": false , searchable: false, "visible": false },
            { "data": "quire", "title": "Quire", searchable: false , "visible": false },
            { "data": "music_notation", "title": "Music Notation", searchable: false , "visible": false },



            { "data": "proper_texts", "title": "Proper texts", searchable: false , "visible": false },


            { "data": 'subrite_name_from_ms', "title": "Subrite name from MS", searchable: false , "visible": false },
            { "data": 'edition_index', "title": "Edition Index", searchable: false , "visible": false },
            { "data": 'edition_subindex', "title": "Edition Subindex", searchable: false , "visible": false },

            { "data": "authors", "title": "Authors", searchable: false , "visible": false },
            { "data": "data_contributor", "title": "Data contributor", searchable: false , "visible": false }
            // Add more columns as needed
        ],
        /*
        "order": [
            { "name": "sequence_in_ms", "dir": "desc" },
        ],*/
        order: [[2, 'asc']],// sequence in ms
        "createdRow": function(row, data, dataIndex) {
            if (data.original_or_added == "ORIGINAL") {
                $(row).addClass('medieval-row');
            } else if (data.original_or_added == "ADDED")  {
                $(row).addClass('non-medieval-row');
            }
        },
        // "initComplete": function () {

        //     $('#content thead tr')
        //         .clone(true)
        //         .addClass('filters')
        //         .appendTo('#content thead');

        //     var api = this.api();
 
        //     // For each column
        //     api
        //         .columns()
        //         .eq(0)
        //         .each(function (colIdx) 
        //         {
        //             var column = api.column(colIdx);
        //             var columnDef = column.settings()[0].aoColumns[colIdx];
            
        //             // Check if the column is searchable
        //             if (columnDef.bSearchable)
        //             {
        //                 // Set the header cell to contain the input element
        //                 var cell = $('.filters th').eq(
        //                     $(api.column(colIdx).header()).index()
        //                 );
        //                 var title = $(cell).text();
        //                 $(cell).html('<input type="text" placeholder="' + title + '" />');
    
        //                 // On every keypress in this input
        //                 $(
        //                     'input',
        //                     $('.filters th').eq($(api.column(colIdx).header()).index())
        //                 )
        //                 .off('keyup change')
        //                 .on('change', function (e) 
        //                 {
        //                     // Get the search value
        //                     $(this).attr('title', $(this).val());
        //                     var regexr = '{search}'; //$(this).parents('th').find('select').val();

        //                     var cursorPosition = this.selectionStart;
        //                     // Search the column for that value
        //                     api
        //                         .column(colIdx)
        //                         .search(
        //                             this.value != ''
        //                                 /*? regexr.replace('{search}', '(((' + this.value + ')))')*/
        //                                 ? regexr.replace('{search}', '' + this.value + '')
        //                                 : '',
        //                             this.value != '',
        //                             this.value == ''
        //                         )
        //                         .draw();
        //                 })
        //                 .on('keyup', function (e) 
        //                 {
        //                     e.stopPropagation();

        //                     $(this).trigger('change');
        //                     $(this)
        //                         .focus()[0]
        //                         .setSelectionRange(cursorPosition, cursorPosition);
        //                 });
        //             }
        //             else{
        //                 var cell = $('.filters th').eq(
        //                     $(api.column(colIdx).header()).index()
        //                 );
        //                 $(cell).html('');
        //             }
        //         });
        // },
    });


    $('.manuscript_filter').select2({
        ajax: {
            url: pageRoot+'/manuscripts-autocomplete-main/?project_id='+projectId,
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
