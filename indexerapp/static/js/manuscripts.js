

manuscripts_init = function()
{

    //static resizer width:
    const leftColumn = document.getElementById("leftColumn");
    const rightColumn = document.getElementById("rightColumn");
    const resizer = document.getElementById("resizer");

    const newLeftWidth = 300;

    leftColumn.style.width = `${newLeftWidth}px`;
    rightColumn.style.width = `calc(100% - 305px)`;
    resizer.style.left =`${newLeftWidth}px`;

    function processFilters(e)
    {
        manuscripts_table.ajax.reload();
    }


    $('#ms_name_select').select2({
        ajax: {
            url: pageRoot+'/manuscripts-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    $('#ms_name_select').on('select2:select', processFilters);


    $('#ms_foreign_id_select').select2({
        ajax: {
            url: pageRoot+'/ms-foreign-id-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    $('#ms_foreign_id_select').on('select2:select', processFilters);


    $('#ms_contemporary_repository_place_select').select2({
        ajax: {
            url: pageRoot+'/ms-contemporary-repository-place-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
        },
    	formatSelection: function(selected, total) {
      	    return "Selected " + selected.length + " of " + total;
        },
        allowClear: true,
        placeholder: '',
    });
    $('#ms_contemporary_repository_place_select').on('select2:select', processFilters);

    // ms_shelfmark_select 'ms-shelf-mark-autocomplete/
    $('#ms_shelfmark_select').select2({
        ajax: {
            url: pageRoot+'/ms-shelf-mark-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    $('#ms_shelfmark_select').on('select2:select', processFilters);
    /*
    // ms_dating_select ms-dating-autocomplete/
    $('#ms_dating_select').select2({
        ajax: {
            url: '/ms-dating-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    $('#ms_dating_select').on('select2:select', processFilters);
    */
    // ms_place_of_origins_select ms-place-of-origins-autocomplete/
    $('#ms_place_of_origins_select').select2({
        ajax: {
            url: pageRoot+'/ms-place-of-origins-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    $('#ms_place_of_origins_select').on('select2:select', processFilters);

    // ms_main_script_select ms-main-script-autocomplete/
    /*
    $('#ms_main_script_select').select2({
        ajax: {
            url: '/ms-main-script-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    
    $('#ms_main_script_select').on('select2:select', processFilters);
    */

    /*
    // ms_binding_date_select ms-binding-date-autocomplete/
    $('#ms_binding_date_select').select2({
        ajax: {
            url: '/ms-binding-date-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    $('#ms_binding_date_select').on('select2:select', processFilters);
    */

    //New select2 with explicite options (no json):
    $('#type_of_the_quire_select').select2({
        allowClear: true,
        placeholder: '',
    });
    //$('#type_of_the_quire_select').on('select2:select', processFilters);

    $('#ruling_method_select').select2({
        allowClear: true,
        placeholder: '',
    });
    //$('#ruling_method_select').on('select2:select', processFilters);

    $('#pricking_select').select2({
        allowClear: true,
        placeholder: '',
    });
    //$('#pricking_select').on('select2:select', processFilters);

    $('#damage_select').select2({
        allowClear: true,
        placeholder: '',
    });
    //$('#damage_select').on('select2:select', processFilters);

    //New select2 with remote options (json):
    $('#parchment_colour_select').select2({
        ajax: {
            url: pageRoot+'/colours-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#parchment_colour_select').on('select2:select', processFilters);

    $('#main_script_select').select2({
        ajax: {
            url: pageRoot+'/script-names-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#main_script_select').on('select2:select', processFilters);

    $('#script_name_select').select2({
        ajax: {
            url: pageRoot+'/script-names-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#script_name_select').on('select2:select', processFilters);


    $('#binding_place_of_origin_select').select2({
        ajax: {
            url: pageRoot+'/places-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#binding_place_of_origin_select').on('select2:select', processFilters);

    $('#binding_type_select').select2({
        ajax: {
            url: pageRoot+'/binding-types-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#binding_type_select').on('select2:select', processFilters);


    $('#binding_style_select').select2({
        ajax: {
            url: pageRoot+'/binding-styles-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#binding_style_select').on('select2:select', processFilters);

    $('#binding_material_select').select2({
        ajax: {
            url: pageRoot+'/binding-materials-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#binding_material_select').on('select2:select', processFilters);


    $('#formula_select').select2({
        ajax: {
            url: pageRoot+'/formulas-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#provenance_place_select').on('select2:select', processFilters);


    $('#rite_select').select2({
        ajax: {
            url: pageRoot+'/ritenames-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#provenance_place_select').on('select2:select', processFilters);


    $('#provenance_place_select').select2({
        ajax: {
            url: pageRoot+'/places-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#provenance_place_select').on('select2:select', processFilters);


    $('#title_select').select2({
        ajax: {
            url: pageRoot+'/bibliography-title-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#title_select').on('select2:select', processFilters);


    $('#author_select').select2({
        ajax: {
            url: pageRoot+'/bibliography-author-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });
    //$('#author_select').on('select2:select', processFilters);


    $('#clla_liturgical_genre_select').select2({
        ajax: {
            url: pageRoot+'/clla-liturgical-genre-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });


    $('#clla_provenance_place_select').select2({
        ajax: {
            url: pageRoot+'/clla-provenance-autocomplete/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
           }
            // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
          },
          allowClear: true,
          placeholder: '',
    });

    //Unselecting:

    $('select').on('select2:unselecting', function() {
        $(this).data('unselecting', true);
    }).on('select2:opening', function(e) {
        if ($(this).data('unselecting')) {
            $(this).removeData('unselecting');
            e.preventDefault();

            processFilters();
        }
    });

    // Function to clear form fields
    function clearFields() {
        // Clear all input fields
        $('input').each(function() {
            if ($(this).attr('type') !== 'checkbox' && $(this).attr('type') !== 'radio') {
                $(this).val('');
            } else {
                $(this).prop('checked', false);
            }
        });
    
        // Clear all select fields (including Select2)
        $('.manuscript_filter').each(function() {
            $(this).val("").change(); // Clear Select2 value and trigger change event
        });

        processFilters(); 
    }
    

    // Add click event to the button
    $('#clearFieldsButton').click(function() {
        clearFields();
    });

    $('#ms_how_many_columns_min').on( "change", processFilters );
    $('#ms_how_many_columns_max').on( "change", processFilters );
    $('#ms_lines_per_page_min').on( "change", processFilters );
    $('#ms_lines_per_page_max').on( "change", processFilters );
    $('#ms_how_many_quires_min').on( "change", processFilters );
    $('#ms_how_many_quires_max').on( "change", processFilters );
    $('#decoration_true').on( "change", processFilters );
    $('#decoration_false').on( "change", processFilters );
    $('#music_notation_true').on( "change", processFilters );
    $('#music_notation_false').on( "change", processFilters );
    $('#digitized_true').on( "change", processFilters );
    $('#digitized_false').on( "change", processFilters );
    $('#ms_dating_min').on("change", processFilters);
    $('#ms_dating_max').on("change", processFilters);
    $('#ms_dating_years_min').on("change", processFilters);
    $('#ms_dating_years_max').on("change", processFilters);
    $('#clla_dating_min').on("change", processFilters);
    $('#clla_dating_max').on("change", processFilters);
    $('#clla_dating_years_min').on("change", processFilters);
    $('#clla_dating_years_max').on("change", processFilters);
    $('#number_of_parchment_folios_min').on("change", processFilters);
    $('#number_of_parchment_folios_max').on("change", processFilters);
    $('#ms_binding_date_min').on("change", processFilters);
    $('#ms_binding_date_max').on("change", processFilters);
    $('#foliation').on( "change", processFilters );
    $('#pagination').on( "change", processFilters );

    $('#display_as_main_true').on( "change", processFilters );
    $('#display_as_main_false').on( "change", processFilters );

    $('#paper_leafs_true').on("change", processFilters);
    $('#parchment_thickness_min').on("change", processFilters);
    $('#parchment_colour_select').on("change", processFilters);
    $('#page_size_wh_min').on("change", processFilters);
    $('#main_script_select').on("change", processFilters);
    $('#watermarks_true').on("change", processFilters);
    $('#type_of_the_quire_select').on("change", processFilters);
    $('#script_name_select').on("change", processFilters);
    $('#is_main_text_true').on("change", processFilters);
    $('#ms_how_many_hands_min').on("change", processFilters);
    $('#distance_between_horizontal_ruling_min').on("change", processFilters);
    $('#distance_between_vertical_ruling_min').on("change", processFilters);
    $('#written_space_height_min').on("change", processFilters);
    $('#written_space_width_min').on("change", processFilters);
    $('#ruling_method_select').on("change", processFilters);
    $('#written_above_the_top_line_true').on("change", processFilters);
    $('#pricking_select').on("change", processFilters);
    $('#binding_height_min').on("change", processFilters);
    $('#binding_width_min').on("change", processFilters);
    $('#block_size_min').on("change", processFilters);
    $('#block_size_max').on("change", processFilters);
    $('#binding_place_of_origin_select').on("change", processFilters);
    $('#binding_type_select').on("change", processFilters);
    $('#binding_style_select').on("change", processFilters);
    $('#binding_material_select').on("change", processFilters);
    $('#formula_select').on("change", processFilters);
    $('#rite_select').on("change", processFilters);
    $('#binding_decoration_true').on("change", processFilters);
    $('#damage_select').on("change", processFilters);
    $('#parchment_shrinkage_true').on("change", processFilters);
    $('#illegible_text_fragments_true').on("change", processFilters);
    $('#ink_corrosion_true').on("change", processFilters);
    $('#copper_corrosion_true').on("change", processFilters);
    $('#powdering_or_cracking_paint_layer_true').on("change", processFilters);
    $('#conservation_true').on("change", processFilters);
    $('#provenance_place_select').on("change", processFilters);
    $('#title_select').on("change", processFilters);
    $('#author_select').on("change", processFilters);
    $('#clla_liturgical_genre_select').on("change", processFilters);
    $('#clla_provenance_place_select').on("change", processFilters);


    $('#paper_leafs_false').on("change", processFilters);
    $('#parchment_thickness_max').on("change", processFilters);
    $('#page_size_wh_max').on("change", processFilters);
    $('#watermarks_false').on("change", processFilters);
    $('#is_main_text_false').on("change", processFilters);
    $('#ms_how_many_hands_max').on("change", processFilters);
    $('#distance_between_horizontal_ruling_max').on("change", processFilters);
    $('#distance_between_vertical_ruling_max').on("change", processFilters);
    $('#written_space_height_max').on("change", processFilters);
    $('#written_space_width_max').on("change", processFilters);
    $('#written_above_the_top_line_false').on("change", processFilters);
    $('#binding_height_max').on("change", processFilters);
    $('#binding_width_max').on("change", processFilters);
    $('#binding_decoration_false').on("change", processFilters);
    $('#parchment_shrinkage_false').on("change", processFilters);
    $('#illegible_text_fragments_false').on("change", processFilters);
    $('#ink_corrosion_false').on("change", processFilters);
    $('#copper_corrosion_false').on("change", processFilters);
    $('#powdering_or_cracking_paint_layer_false').on("change", processFilters);
    $('#conservation_false').on("change", processFilters);
    $('#formula_text').on("change", processFilters);
    $('#clla_no').on("change", processFilters);

    $('#rite_name_from_ms').on("change", processFilters);

    var getFilterData = function(d)
    {    
        d.name = $('#ms_name_select').select2('data').map(item => item.id).join(';');
        d.foreign_id = $('#ms_foreign_id_select').select2('data').map(item => item.id).join(';');
        d.contemporary_repository_place = $('#ms_contemporary_repository_place_select').select2('data').map(item => item.id).join(';');
        d.shelfmark = $('#ms_shelfmark_select').select2('data').map(item => item.id).join(';');
        //jd.dating = $('#ms_dating_select').select2('data').map(item => item.id).join(';');
        d.place_of_origins = $('#ms_place_of_origins_select').select2('data').map(item => item.id).join(';');
        //d.main_script = $('#ms_main_script_select').select2('data').map(item => item.id).join(';');
        //d.binding_date = $('#ms_binding_date_select').select2('data').map(item => item.id).join(';');
        d.how_many_columns_min = $('#ms_how_many_columns_min').val();
        d.how_many_columns_max = $('#ms_how_many_columns_max').val();
        d.lines_per_page_min = $('#ms_lines_per_page_min').val();
        d.lines_per_page_max = $('#ms_lines_per_page_max').val();
        d.how_many_quires_min = $('#ms_how_many_quires_min').val();
        d.how_many_quires_max = $('#ms_how_many_quires_max').val();
        d.decoration_true = $('#decoration_true').is(":checked");
        d.decoration_false = $('#decoration_false').is(":checked")
        d.music_notation_true = $('#music_notation_true').is(":checked")
        d.music_notation_false = $('#music_notation_false').is(":checked")
        d.digitized_true = $('#digitized_true').is(":checked")
        d.digitized_false = $('#digitized_false').is(":checked")
        d.foliation = $('#foliation').is(":checked")
        d.pagination = $('#pagination').is(":checked")

        d.dating_min = $('#ms_dating_min').val();
        d.dating_max = $('#ms_dating_max').val();
        //d.dating_years_min = $('#ms_dating_years_min').val();
        //d.dating_years_max = $('#ms_dating_years_max').val();
        //d.clla_dating_max = $('#clla_dating_max').val();
        //d.clla_dating_years_min = $('#clla_dating_years_min').val();
        //d.clla_dating_min = $('#clla_dating_min').val();
        //d.clla_dating_years_max = $('#clla_dating_years_max').val();

        d.number_of_parchment_folios_min = $('#number_of_parchment_folios_min').val();
        d.number_of_parchment_folios_max = $('#number_of_parchment_folios_max').val();

        d.binding_date_min = $('#ms_binding_date_min').val();
        d.binding_date_max = $('#ms_binding_date_max').val();

        //New min/max:
        d.binding_height_min = $('#binding_height_min').val();
        d.binding_width_min = $('#binding_width_min').val();
        d.written_space_height_min = $('#written_space_height_min').val();
        d.written_space_width_min = $('#written_space_width_min').val();
        d.distance_between_horizontal_ruling_min = $('#distance_between_horizontal_ruling_min').val();
        d.distance_between_vertical_ruling_min = $('#distance_between_vertical_ruling_min').val();
        d.ms_how_many_hands_min = $('#ms_how_many_hands_min').val();
        d.page_size_wh_min = $('#page_size_wh_min').val();
        d.parchment_thickness_min = $('#parchment_thickness_min').val();
        d.binding_height_max = $('#binding_height_max').val();
        d.binding_width_max = $('#binding_width_max').val();
        d.written_space_height_max = $('#written_space_height_max').val();
        d.written_space_width_max = $('#written_space_width_max').val();
        d.distance_between_horizontal_ruling_max = $('#distance_between_horizontal_ruling_max').val();
        d.distance_between_vertical_ruling_max = $('#distance_between_vertical_ruling_max').val();
        d.ms_how_many_hands_max = $('#ms_how_many_hands_max').val();
        d.page_size_wh_max = $('#page_size_wh_max').val();
        d.parchment_thickness_max = $('#parchment_thickness_max').val();
        d.page_size_wh_max = $('#page_size_wh_max').val();
        d.block_size_min = $('#block_size_min').val();
        d.block_size_max = $('#block_size_max').val();

        //New True/False:
        d.paper_leafs_true = $('#paper_leafs_true').is(':checked');
        d.watermarks_true = $('#watermarks_true').is(':checked');
        d.is_main_text_true = $('#is_main_text_true').is(':checked');
        d.written_above_the_top_line_true = $('#written_above_the_top_line_true').is(':checked');
        d.binding_decoration_true = $('#binding_decoration_true').is(':checked');
        d.parchment_shrinkage_true = $('#parchment_shrinkage_true').is(':checked');
        d.illegible_text_fragments_true = $('#illegible_text_fragments_true').is(':checked');
        d.ink_corrosion_true = $('#ink_corrosion_true').is(':checked');
        d.copper_corrosion_true = $('#copper_corrosion_true').is(':checked');
        d.powdering_or_cracking_paint_layer_true = $('#powdering_or_cracking_paint_layer_true').is(':checked');
        d.conservation_true = $('#conservation_true').is(':checked');
        d.paper_leafs_false = $('#paper_leafs_false').is(':checked');
        d.watermarks_false = $('#watermarks_false').is(':checked');
        d.is_main_text_false = $('#is_main_text_false').is(':checked');
        d.written_above_the_top_line_false = $('#written_above_the_top_line_false').is(':checked');
        d.binding_decoration_false = $('#binding_decoration_false').is(':checked');
        d.parchment_shrinkage_false = $('#parchment_shrinkage_false').is(':checked');
        d.illegible_text_fragments_false = $('#illegible_text_fragments_false').is(':checked');
        d.ink_corrosion_false = $('#ink_corrosion_false').is(':checked');
        d.copper_corrosion_false = $('#copper_corrosion_false').is(':checked');
        d.powdering_or_cracking_paint_layer_false = $('#powdering_or_cracking_paint_layer_false').is(':checked');
        d.conservation_false = $('#conservation_false').is(':checked');
        

        //New Select:
        d.parchment_colour_select = $('#parchment_colour_select').select2('data').map(item => item.id).join(';');
        d.main_script_select = $('#main_script_select').select2('data').map(item => item.id).join(';');
        d.type_of_the_quire_select = $('#type_of_the_quire_select').select2('data').map(item => item.id).join(';');
        d.script_name_select = $('#script_name_select').select2('data').map(item => item.id).join(';');
        d.ruling_method_select = $('#ruling_method_select').select2('data').map(item => item.id).join(';');
        d.pricking_select = $('#pricking_select').select2('data').map(item => item.id).join(';');
        d.binding_place_of_origin_select = $('#binding_place_of_origin_select').select2('data').map(item => item.id).join(';');
        d.binding_type_select = $('#binding_type_select').select2('data').map(item => item.id).join(';');
        d.binding_style_select = $('#binding_style_select').select2('data').map(item => item.id).join(';');
        d.binding_material_select = $('#binding_material_select').select2('data').map(item => item.id).join(';');
        d.formula_select = $('#formula_select').select2('data').map(item => item.id).join(';');
        d.rite_select = $('#rite_select').select2('data').map(item => item.id).join(';');
        d.damage_select = $('#damage_select').select2('data').map(item => item.id).join(';');
        d.provenance_place_select = $('#provenance_place_select').select2('data').map(item => item.id).join(';');
        d.title_select = $('#title_select').select2('data').map(item => item.id).join(';');
        //Special case (authors does not have .id)
        d.author_select = $('#author_select').select2('data').map(item => item.text).join(';');

        //d.clla_liturgical_genre_select = $('#clla_liturgical_genre_select').select2('data').map(item => item.text).join(';');
        //d.clla_provenance_place_select = $('#clla_provenance_place_select').select2('data').map(item => item.text).join(';');

        d.formula_text = $('#formula_text').val();
        d.rite_name_from_ms = $('#rite_name_from_ms').val();
        //d.clla_no = $('#clla_no').val();

        d.display_as_main_true = $('#display_as_main_true').is(':checked');
        d.display_as_main_false = $('#display_as_main_false').is(':checked');

        d.projectId = projectId;
    }

    var manuscripts_table = $('#manuscripts').DataTable({
        "ajax": {
            "url": pageRoot+"/api/manuscripts/?format=datatables", // Add your URL here
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
            "data": getFilterData
        },
        "processing": false,
        "serverSide": true,
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pagingType": "full_numbers",
        "pageLength": 25,
        "columns": [
            { "data": "id", "title": "ID", visible: false },
            { "data": "name", "title": "Name",
            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                $(nTd).html("<a href=/static/page.html?p=manuscript&id="+oData.id+">"+oData.name+"</a>");
            }},
            { "data": "image", "title": "Image",
            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                if(oData.image.length > 3)
                    $(nTd).html("<img src='"+oData.image+"' style='max-heigth: 120px; max-width: 120px;'></img>");
            }},
            { "data": "foreign_id", "title": foreign_id_name },
            { "data": "contemporary_repository_place", "title": "Contemporary Repository Place" },
            { "data": "shelf_mark", "title": "Shelf Mark" },
            { "data": "place_of_origins", "title": "Place of Origins" },
            { "data": "dating", "title": "Dating" },
            { "data": "main_script", "title": "Main Script" },
            { "data": "how_many_columns_mostly", "title": "How Many Columns Mostly" },
            { "data": "lines_per_page_usually", "title": "Lines per Page Usually" },
            { "data": "how_many_quires", "title": "How Many Quires" },
            { "data": "decorated", "title": "Decorated" },
            { "data": "music_notation", "title": "Music Notation" },
            { "data": "binding_date", "title": "Binding Date" }
            // Add more columns as needed
        ]
    });



}