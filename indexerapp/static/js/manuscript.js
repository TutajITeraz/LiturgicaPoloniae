
let manuscriptId = null;
var map = null;
var map_bounds =null;

manuscriptId = urlParams.get('id')



async function getMSInfo() {
  return fetchOnce(pageRoot+`/ms_info/?pk=${manuscriptId}`);
}

async function getTEIUrl() {
    return pageRoot+'/ms_tei/?ms='+(await getMSInfo()).manuscript.id;
}

async function getMSInfoFiltered() {
    var info = (await getMSInfo()).manuscript;

    var infoCod = (await getCodicologyInfo()).info;

    return {
        manuscript:{
            common_name: info.common_name,
            contemporary_repository: info.contemporary_repository_place,
            shelf_mark: info.shelf_mark,
            rism_id: info.rism_id,
            foreign_id: info.foreign_id,
            shelf_mark: info.shelf_mark,
            liturgical_genre_comment: info.liturgical_genre_comment,
            dating: info.dating,
            dating_comment: info.dating_comment,
            place_of_origins: info.place_of_origins,
            place_of_origins_comment: info.place_of_origins_comment,
            decorated: info.decorated,
            music_notation: info.music_notation,

            form_of_an_item: info.form_of_an_item,
            connected_ms: info.connected_ms,
            where_in_the_connected_ms: info.where_in_connected_ms,
            /*
            number_of_parchment_folios: infoCod.number_of_parchment_folios,
            number_of_paper_leaves: infoCod.number_of_paper_leaves,
            parchment_thickness: infoCod.parchment_thickness,
            max_page_size: infoCod.page_size_max_height + " mm x "+infoCod.page_size_max_width+" mm " ,
            */
            general_comment: info.general_comment,
            url: '<a href="'+ info.links +'">'+info.links+'</a>',
            additional_url:  '<a href="'+ info.additional_url +'">'+info.links+'</a>',
            iiif_manifest_url: '<a href="'+ info.iiif_manifest_url +'">'+info.iiif_manifest_url+'</a>',
            authors: info.authors,
            data_contributor: info.data_contributor,
            entry_date: info.entry_date,
        }
    };
}

async function getCodicologyInfo() {
    return fetchOnce(pageRoot+`/codicology_info/?pk=${manuscriptId}`);
}

async function getCodicologyFiltered(){
    var info = (await getCodicologyInfo()).info;

    var infoMS = (await getMSInfo()).manuscript;

    var parchment_thickness = info.parchment_thickness_min;

    if(info.parchment_thickness_max != parchment_thickness)
        parchment_thickness+= " - "+info.parchment_thickness_max

    return {
        info:{
            number_of_parchment_folios: info.number_of_parchment_folios,
            number_of_paper_leaves: info.number_of_paper_leaves,
            parchment_thickness: parchment_thickness,
            parchment_colour: info.parchment_colour,
            parchment_comment: info.parchment_comment,
            max_page_size: info.page_size_max_width + " mm x "+info.page_size_max_height+" mm " ,
            max_paper_size: info.paper_size_max_width + " mm x "+info.paper_size_max_height+" mm " ,
            main_script: infoMS.main_script,
            how_many_columns_mostly: infoMS.how_many_columns_mostly,
            lines_per_page_usually: infoMS.lines_per_page_usually,
            watermarks: info.watermarks,
            foliation_comment: info.foliation_comment,
            authors: info.authors,
            data_contributor: info.data_contributor,
            entry_date: info.entry_date,

        }
    };
}

async function getProvenanceInfo() {
    return fetchOnce(pageRoot+`/provenance_info/?ms=${manuscriptId}`);
}


async function getProvenanceColumns()
{
    info = (await getProvenanceInfo())
    if(info === 'undefined' || info === null )
        return [];
    first_row = info.data[0];
    if(first_row === 'undefined' || first_row === null )
        return [];

    columns = []

    for (k in first_row)
        columns.push(getPrintableValues(k, '').name);

    return columns
}

async function getBibliographyInfo() {
    return fetchOnce(pageRoot+`/bibliography_info/?ms=${manuscriptId}`);
}

async function getBooksHTML() {
    books = (await getBibliographyInfo()).data;
    booksHTML = ''
    for( b in books)
    {
        booksHTML+=books[b];
    }
    return booksHTML;

}

async function getDecorationInfo() {
    return fetchOnce(pageRoot+`/decoration_info/?ms=${manuscriptId}`); 
}
async function getQuiresInfo() {
    return fetchOnce(pageRoot+`/quires_info/?ms=${manuscriptId}`);
}
async function getConditionInfo() {
    return fetchOnce(pageRoot+`/condition_info/?ms=${manuscriptId}`);
}
async function getCLLAInfo() {
    return fetchOnce(pageRoot+`/clla_info/?ms=${manuscriptId}`);
}
async function getOriginsInfo() {
    return fetchOnce(pageRoot+`/origins_info/?ms=${manuscriptId}`);
}

async function getBindingInfo() {
    return fetchOnce(pageRoot+`/binding_info/?ms=${manuscriptId}`);
}

async function getMusicNotationInfo() {
    return fetchOnce(pageRoot+`/music_notation_info/?ms=${manuscriptId}`);
}

/*
async function getHandsInfo() {
    return fetchOnce(`/hands_info/?pk=${manuscriptId}`);
}
*/
async function getWatermarksInfo() {
    return fetchOnce(pageRoot+`/watermarks_info/?ms=${manuscriptId}`);
}
async function getBibliographyPrintableInfo() {
    return fetchOnce(pageRoot+`/bibliography_print/?ms=${manuscriptId}`);
}



// LAYOUTS
var layouts_table;

function init_layouts_table()
{
    layouts_table = $('#layouts').DataTable({
        "ajax": {
            "url": pageRoot+'/layouts_info/?ms=' + manuscriptId,
            "dataSrc": function (data) {
                return data.data;
            }
        },
        "processing": false,
        "serverSide": true,
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pagingType": "full_numbers",
        "pageLength": 25,
        "columns": [
            {
                "data": "graph_img",
                "name": "graph_img",
                "title": "Image",
                /*"render": function (data, type, row, meta) {
                    return renderImg(data, type, row, meta);
                }*/
                "visible": false
            },
            { "data": "name", "title": "Name" },
            { "data": "where_in_ms_from", "title": "Where in MS From" , "visible": false },
            { "data": "where_in_ms_to","title": "Where in MS To" , "visible": false },
            {
                "data": "where",
                "title": "Where in MS",
                "render": function (data, type, row, meta) {
                    //let fromIndex = findCanvasIndexByLabel(row.where_in_ms_from);
                    //let toIndex = findCanvasIndexByLabel(row.where_in_ms_to);

                    let fromText = row.where_in_ms_from;
                    let toText = row.where_in_ms_to;

                    //if(fromIndex)
                        fromText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_from+'\')">'+row.where_in_ms_from+'</a>';

                    //if(toIndex)
                        toText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_to+'\')">'+row.where_in_ms_to+'</a>';

                    if(row.where_in_ms_from == row.where_in_ms_to || row.where_in_ms_to == '-')
                        return fromText;
                    return fromText +' - '+ toText;
                }
            },
            { "data": "how_many_columns","title": "How Many Columns" },
            { "data": "lines_per_page_minimum", "title": "Lines per Page (min)", "visible": false },
            { "data": "lines_per_page_maximum", "title": "Lines per Page (max)", "visible": false },
            {
                "data": "lines_per_page_minimum",
                "title": "Lines per Page",
                "render": function (data, type, row, meta) {
                    if (row.lines_per_page_minimum === row.lines_per_page_maximum) {
                        return row.lines_per_page_minimum;
                    } else {
                        return row.lines_per_page_minimum + " - " + row.lines_per_page_maximum;
                    }
                }
            },
            { "data": "written_space_height_max", "title": "Written space height (max)", "visible": false },
            { "data": "written_space_width_max", "title": "Written space width (max)", "visible": false },
            {
                "data": "written_space",
                "title": "Writtern Space max. HxW",
                "render": function (data, type, row, meta) {
                return row.written_space_height_max + " mm x " + row.written_space_width_max+" mm";
                }
            },
            { "data": "ruling_method", "title": "Ruling method" },
            { "data": "distance_between_horizontal_ruling", "title": "Distance between horizontal ruling" },
            { "data": "distance_between_vertical_ruling", "title": "Distance between vertical ruling" },

            { "data": "written_above_the_top_line", "title": "Written above the top line" },
            { "data": "pricking", "title": "Pricking" },
            { "data": "comments", "title": "Comments" },
            { "data": "authors", "title": "Authors", "visible": false },
            { "data": "data_contributor", "title": "Data contributor", "visible": false },
        ],
        "order": [[1, 'asc']], // Sort by the 'name' column in ascending order
        "initComplete": function() {
            displayUniqueAuthorsAndContributors(layouts_table,"#layouts");
            displayUniqueLayouts(layouts_table,"#layouts");
        }
    });
}

function displayUniqueLayouts(dataTable, targetSelector) {
    var tableData = dataTable.rows().data();
    var uniqueLayouts = {};

    // Iterate over table data to gather unique graph_img and name pairs
    tableData.each(function(row) {
        var key = row.name;
        if (!(key in uniqueLayouts)) {
            uniqueLayouts[key] = row;
        }
    });

    // Create a div to contain the unique layout images and names
    var uniqueLayoutsDiv = $('<div class="unique-layouts printIt">');

    // Iterate over unique layouts and create image elements
    for (var key in uniqueLayouts) {
        if (uniqueLayouts.hasOwnProperty(key)) {
            var layout = uniqueLayouts[key];
            var layoutDiv = $('<div class="layout">');
            var img = $('<img>').attr('src', pageRoot+'/media/'+layout.graph_img).attr('alt', layout.name).css('max-width', '200px');
            var name = $('<p>').text(layout.name).css('text-align', 'center');

            layoutDiv.append(img, name);
            uniqueLayoutsDiv.append(layoutDiv);
        }
    }

    // Prepend the unique layouts div above the table
    $(targetSelector).closest('#layouts_wrapper').before(uniqueLayoutsDiv);
}

// MUSIC NOTATNION
var music_table;
function init_music_table()
{
    music_table = $('#music_notation').DataTable({
        "ajax": {
            "url": pageRoot+'/music_notation_info/?ms=' + manuscriptId,
            "dataSrc": function (data) {
                return data.data;
            }
        },
        "columns": [
            { "data": "music_notation_name", "title": "Music Notation Name" },
            { "data": "sequence_in_ms", "title": "Sequence in MS" },
            { "data": "where_in_ms_from", "title": "Where in MS From" , "visible": false },
            { "data": "where_in_ms_to","title": "Where in MS To" , "visible": false },
            {
                "data": "where",
                "title": "Where in MS",
                "render": function (data, type, row, meta) {
                    //let fromIndex = findCanvasIndexByLabel(row.where_in_ms_from);
                    //let toIndex = findCanvasIndexByLabel(row.where_in_ms_to);

                    let fromText = row.where_in_ms_from;
                    let toText = row.where_in_ms_to;

                    //if(fromIndex)
                        fromText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_from+'\')">'+row.where_in_ms_from+'</a>';

                    //if(toIndex)
                        toText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_to+'\')">'+row.where_in_ms_to+'</a>';

                    if(row.where_in_ms_from == row.where_in_ms_to || row.where_in_ms_to == '-')
                        return fromText;
                    return fromText +' - '+ toText;
                }
            },
            { "data": "dating", "title": "Dating" },
            { "data": "original", "title": "Original" },
            { "data": "on_lines", "title": "On Lines" },
            { "data": "music_custos", "title": "Music Custos" },
            { "data": "number_of_lines", "title": "Number of Lines" },
            { "data": "comment", "title": "Comment" },
            { "data": "authors", "title": "Authors", "visible": false },
            { "data": "data_contributor", "title": "Data contributor", "visible": false },
        ],
        "initComplete": function() {
            displayUniqueAuthorsAndContributors(music_table,"#music_notation");
        }
    });
}


var content_table

function init_content_table()
{
    content_table = $('#content').DataTable({
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
        "pageLength": 10,
        "columns": [
            { "data": "manuscript", "title": "Manuscript ID", "visible": false },
            { "data": "manuscript_name", "title": "Manuscript", "visible": false },
            { "data": "where_in_ms_from", "title": "Where in MS (from)", "visible": false },
            { "data": "where_in_ms_to", "title": "Where in MS (to)", "visible": false },
            {
                "data": "where",
                "title": "Where in MS",
                "render": function (data, type, row, meta) {
                    //let fromIndex = findCanvasIndexByLabel(row.where_in_ms_from);
                    //let toIndex = findCanvasIndexByLabel(row.where_in_ms_to);

                    let fromText = row.where_in_ms_from;
                    let toText = row.where_in_ms_to;

                    //if(fromIndex)
                        fromText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_from+'\')">'+row.where_in_ms_from+'</a>';

                    //if(toIndex)
                        toText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_to+'\')">'+row.where_in_ms_to+'</a>';

                    if(row.where_in_ms_from == row.where_in_ms_to || row.where_in_ms_to == '-')
                        return fromText;
                    return fromText +' - '+ toText;
                }
            },
            { "data": "rite_name_from_ms", "title": "Rite name from MS" },
            { "data": "subsection", "title": "Subsection" },
            { "data": "function", "title": "Function / Genre" },
            { "data": "subfunction", "title": "Subgenre" },
            { "data": "biblical_reference", "title": "Biblical reference" },
            { "data": "formula_standarized", "title": "Formula (standarized)" },
            { 
                "data": "formula_text", 
                "title": "Formula (text from MS)" ,
                "render": function (data, type, row, meta) {
                    if(row.music_notation != "-")
                        return row.formula_text + ' (♪)';
                    return row.formula_text;
                },
            },
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

            { "data": "music_notation", "title": "Music Notation" , "visible": false },
            { "data": "sequence_in_ms", "title": "Sequence in MS" , "visible": false },
            { "data": "original_or_added", "title": "Original or Added", "visible": false },
            { "data": "proper_texts", "title": "Proper texts"},

            { "data": "authors", "title": "Authors", "visible": false },
            { "data": "data_contributor", "title": "Data contributor", "visible": false },
            // Add more columns as needed
        ],
        "order": [
            { "data": "sequence_in_ms", "order": "asc" },  // Sort by the "manuscript_name" column in ascending order
            { "data": "where_in_ms_from", "order": "asc" }      // Then sort by the "manuscript" column in descending order
        ],
        "createdRow": function(row, data, dataIndex) {
            if (data.original_or_added == "ORIGINAL") {
                $(row).addClass('medieval-row');
            } else if (data.original_or_added == "ADDED")  {
                $(row).addClass('non-medieval-row');
            }
        },
        "initComplete": function(settings, json)  {
            displayUniqueAuthorsAndContributors(content_table,"#content");
            displaOriginalAddedLegend(content_table,"#content");

            // Get column information from DataTable settings
            var columns = settings.aoColumns;

            // Column names to check for null values
            var columnsToCheck = ["function", "subfunction", "biblical_reference", "subsection", "quire", "similarity_by_user",  "proper_texts", "formula_text"];

            // Get the DataTable instance
            var table = this;

            // Iterate over columns
            columns.forEach(function(column, columnIndex) {
                // Check if the column name matches the ones to be checked
                if (columnsToCheck.includes(column.data)) {
                    var isVisible = json.data.some(function(row) {
                        return !( row[column.data] == 'None' || row[column.data] == null );
                    });

                    // Set column visibility based on null values
                    settings.oInstance.api().column(columnIndex).visible(isVisible);
                }
                else if(column.data == "similarity_levenshtein_percent")
                {
                    var isVisible = json.data.some(function(row) {
                        return !( row[column.data] == 0 || row[column.data] == null );
                    });
                    settings.oInstance.api().column(columnIndex).visible(isVisible);
                }
            });


        }
    });
    content_table.columns(0).search(manuscriptId).draw()
}

//Quires----------------------------------------------------------------
var quires_table
function init_quires_table()
{
    quires_table = $('#quires').DataTable({
        "ajax": {
            "url": pageRoot+'/quires_info/?ms=' + manuscriptId,
            "dataSrc": function (data) {
                return data.data;
            }
        },
        "processing": false,
        "serverSide": true,
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pagingType": "full_numbers",
        "pageLength": 25,
        "columns": [
            {
                "data": "graph_img",
                "name": "graph_img",
                "title": "Image",
                "render": function (data, type, row, meta) {
                    return renderImg(data, type, row, meta);
                }
            },
            { "data": "type_of_the_quire", "title": "Quire type" },
            { "data": "sequence_of_the_quire", "title": "Sequence in MS" },
            { "data": "where_in_ms_from", "title": "Where in MS (from)", "visible": false },
            { "data": "where_in_ms_to", "title": "Where in MS (to)", "visible": false },
            {
                "data": "where",
                "title": "Where in MS",
                "render": function (data, type, row, meta) {
                    //let fromIndex = findCanvasIndexByLabel(row.where_in_ms_from);
                    //let toIndex = findCanvasIndexByLabel(row.where_in_ms_to);

                    let fromText = row.where_in_ms_from;
                    let toText = row.where_in_ms_to;

                    //if(fromIndex)
                        fromText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_from+'\')">'+row.where_in_ms_from+'</a>';

                    //if(toIndex)
                        toText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_to+'\')">'+row.where_in_ms_to+'</a>';

                    if(row.where_in_ms_from == row.where_in_ms_to || row.where_in_ms_to == '-')
                        return fromText;
                    return fromText +' - '+ toText;
                }
            },
            { "data": "comment", "title": "Comment" },
            { "data": "authors", "title": "Authors", "visible": false },
            { "data": "data_contributor", "title": "Data contributor" , "visible": false }
        ],
        "order": [
            { "data": "sequence_of_the_quire", "order": "asc" },  // Sort by the "manuscript_name" column in ascending order
            { "data": "where_in_ms_from", "order": "asc" }      // Then sort by the "manuscript" column in descending order
        ],
        "initComplete": function() {
            displayUniqueAuthorsAndContributors(quires_table,"#quires");
        }
    });
}

//Decoration----------------------------------------------------------------
var decoration_table

function init_decoration_table()
{ 
    var decoration_groupColumn = 0;
    decoration_table = $('#decoration').DataTable({
        "ajax": {
            "url": pageRoot+'/decoration_info/?ms=' + manuscriptId,
            "dataSrc": function (data) {
                return data.data;
            }
        },
        "columns": [
            { "data": "id", "title": "id"  , "visible": false },
            { "data": "decoration_type", "title": "Decoration type"  , "visible": false },
            { "data": "decoration_subtype", "title": "Decoration subtype" },
            { "data": "size_height", "title": "Size - height" , "visible": false },
            { "data": "size_width", "title": "Size - width" , "visible": false },
            {
                "data": "size",
                "title": "Size HxW",
                "render": function (data, type, row, meta) {
                    if(row.size_height != '-' || row.size_height != '-')
                        return row.size_height + " mm x " + row.size_width+" mm";
                    return '-';
                }
            },
            { "data": "where_in_ms_from", "title": "Where in MS (from)", "visible": false },
            { "data": "where_in_ms_to", "title": "Where in MS (to)", "visible": false },
            {
                "data": "where",
                "title": "Where in MS",
                "render": function (data, type, row, meta) {
                    //let fromIndex = findCanvasIndexByLabel(row.where_in_ms_from);
                    //let toIndex = findCanvasIndexByLabel(row.where_in_ms_to);

                    let fromText = row.where_in_ms_from;
                    let toText = row.where_in_ms_to;

                    //if(fromIndex)
                        fromText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_from+'\')">'+row.where_in_ms_from+'</a>';

                    //if(toIndex)
                        toText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_to+'\')">'+row.where_in_ms_to+'</a>';

                    if(row.where_in_ms_from == row.where_in_ms_to || row.where_in_ms_to == '-')
                        return fromText;
                    return fromText +' - '+ toText;
                }
            },
            { "data": "location_characteristic", "title": "Location Characteristic" },
            { "data": "original_or_added", "title": "Original or added" },
            { "data": "monochrome_or_colour", "title": "Monochrome or colour" },
            { "data": "characteristic", "title": "Decoration characteristic" },
            { "data": "technique", "title": "Technique" },
            { "data": "initials", "title": "Initials" },
            //{ "data": "comments", "title": "Comments" },
            { "data": "authors", "title": "Authors" , "visible": false },
            { "data": "data_contributor", "title": "Data contributor" , "visible": false },
        ],
        "order": [
            [ decoration_groupColumn, 'asc' ],
            { "data": "where_in_ms_from", "order": "asc" }      // Then sort by the "manuscript" column in descending order
        ],
        "initComplete": function() {
            displayDebate(decoration_table,"#decoration");
            displayUniqueAuthorsAndContributors(decoration_table,"#decoration");
        },
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
     
            api.column(decoration_groupColumn, { page: 'current' })
                .data()
                .each(function (group, i) {
                    if (last !== group) {
                        $(rows)
                            .eq(i)
                            .before(
                                '<tr class="table_group"><td colspan="9">' +
                                    group +
                                    '</td></tr>'
                            );
     
                        last = group;
                    }
                });
        }
    });
}

//Condition----------------------------------------------------------------
/*
var condition_table = $('#condition').DataTable({
    "ajax": {
        "url": '/condition_info/?ms=' + manuscriptId,
        "dataSrc": function (data) {
            return data.data;
        }
    },
    "columns": [
        { "data": "damage", "title": "Damage" },
        { "data": "parchment_shrinkage", "title": "Parchment shrinkage" },
        { "data": "illegible_text_fragments", "title": "Illegible text fragments" },
        { "data": "ink_corrosion", "title": "Ink corrosion" },
        { "data": "copper_corrosion", "title": "Copper corrosion" },
        { "data": "powdering_or_cracking_paint_layer", "title": "Powdering or cracking paint layer" },
        { "data": "conservation", "title": "Conservation" },
        { "data": "conservation_date", "title": "Conservation date" },
        { "data": "comments", "title": "Comments" },
        { "data": "authors", "title": "Authors", "visible": false },
        { "data": "data_contributor", "title": "Data contributor", "visible": false }
    ],
    "initComplete": function() {
        displayUniqueAuthorsAndContributors(condition_table,"#condition");
    }
});
*/

//Origins----------------------------------------------------------------
var origins_table;

function init_origins_table()
{
    origins_table = $('#origins').DataTable({
        "ajax": {
            "url": pageRoot+'/origins_info/?ms=' + manuscriptId,
            "dataSrc": function (data) {
                return data.data;
            }
        },
        "columns": [
            { "data": "id", "title": "id"  , "visible": false },
            { "data": "origins_date", "title": "Origins date" },
            { "data": "origins_place", "title": "Origins place" },
            { "data": "origins_comment", "title": "Origins comment" },
            { "data": "provenance_comments", "title": "Provenance comments", "visible": false },
            { "data": "authors", "title": "Authors", "visible": false },
            { "data": "data_contributor", "title": "Data contributor", "visible": false }
        ],
        "initComplete": function() {
            displayDebate(origins_table,"#origins");
            displayUniqueAuthorsAndContributors(origins_table,"#origins");
        }
    });
}

//Binding----------------------------------------------------------------
/*
var music_table = $('#binding').DataTable({
    "ajax": {
        "url": '/binding_info/?ms=' + manuscriptId,
        "dataSrc": function (data) {
            return data.data;
        }
    },
    "columns": [
        { "data": "max_height", "title": "Height (max)" },
        { "data": "max_width", "title": "Width (max)" },
        { "data": "block_max", "title": "Block (max)" },
        { "data": "date", "title": "Date" },
        { "data": "place_of_origins", "title": "Place of origins" },
        { "data": "type_of_binding", "title": "Type of binding" },
        { "data": "style_of_binding", "title": "Style of binding" },
        { "data": "decoration_comment", "title": "Decoration comment" },
        { "data": "general_comments", "title": "General comments" },
        { "data": "entry_date", "title": "Entry date" },
        { "data": "authors", "title": "Authors" },
        { "data": "decoration", "title": "Decoration" },
        { "data": "material", "title": "Material" }
    ]
});
*/

//Binding Materials----------------------------------------------------------------
var binding_materials_table
function init_binding_materials_table()
{
    binding_materials_table = $('#binding_materials').DataTable({
        "ajax": {
            "url": pageRoot+'/binding_materials_info/?ms=' + manuscriptId,
            "dataSrc": function (data) {
                return data.data; 
            }
        },
        "columns": [
            { "data": "material", "title": "Material" },
        ]
    });
}

//Hands----------------------------------------------------------------
var main_hands;
function init_main_hands()
{
    main_hands = $('#main_hands').DataTable({
        "ajax": {
            //"url": pageRoot+"/api/hands/?format=datatables", // Add your URL here
            "url": pageRoot+"/hands_info/",
            "type": 'GET',
            "data": function(d) {
                d.is_main_text = true;
                d.ms = manuscriptId;
            },
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
        //"serverSide": true,
        "serverSide": false,
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pagingType": "full_numbers",
        "pageLength": 25,
        "columns": [
            { "data": "hand", "title": "hand" },
            { "data": "script_name", "title": "script name" },
            { "data": "sequence_in_ms", "title": "sequence in ms" },
            { "data": "where_in_ms_from", "title": "Where in MS (from)", "visible": false },
            { "data": "where_in_ms_to", "title": "Where in MS (to)", "visible": false },
            {
                "data": "where",
                "title": "Where in MS",
                "render": function (data, type, row, meta) {
                    //let fromIndex = findCanvasIndexByLabel(row.where_in_ms_from);
                    //let toIndex = findCanvasIndexByLabel(row.where_in_ms_to);

                    let fromText = row.where_in_ms_from;
                    let toText = row.where_in_ms_to;

                    //if(fromIndex)
                        fromText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_from+'\')">'+row.where_in_ms_from+'</a>';

                    //if(toIndex)
                        toText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_to+'\')">'+row.where_in_ms_to+'</a>';

                    if(row.where_in_ms_from == row.where_in_ms_to || row.where_in_ms_to == '-')
                        return fromText;
                    return fromText +' - '+ toText;
                }
            },
            { "data": "is_medieval", "title": "is medieval?", "visible": false },
            { "data": "is_main_text", "name": "is_main_text", "title": "is main text?",  "visible": false },
            { "data": "comment", "title": "comment" },
            { "data": "authors", "title": "authors",  "visible": false },
            { "data": "data_contributor", "title": "data contributor",  "visible": false },
        ],
        "order": [
            { "data": "sequence_in_ms", "order": "asc" },  // Sort by the "manuscript_name" column in ascending order
            { "data": "where_in_ms_from", "order": "asc" }      // Then sort by the "manuscript" column in descending order
        ],
        "createdRow": function(row, data, dataIndex) {
            if (data.is_medieval == true || data.is_medieval == "true" || data.is_medieval == "yes") {
                $(row).addClass('medieval-row');
            } else {
                $(row).addClass('non-medieval-row');
            }
        },
        "initComplete": function() {
            displayDebate(main_hands,"#main_hands");

            displayUniqueAuthorsAndContributors(main_hands,"#main_hands");
            displayScriptsLegend(main_hands,"#main_hands");
        }
    });
}

var additions_hands;
function init_additions_hands()
{
    additions_hands = $('#additions_hands').DataTable({
        "ajax": {
            //"url": pageRoot+"/api/hands/?format=datatables", // Add your URL here
            "url": pageRoot+"/hands_info/",
            "type": 'GET',
            "data": function(d) {
                d.is_main_text = false;
                d.ms = manuscriptId;
            },
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
        //"serverSide": true,
        "serverSide": false,
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pagingType": "full_numbers",
        "pageLength": 25,
        "columns": [
            { "data": "hand", "title": "hand" },
            { "data": "script_name", "title": "script name" },
            { "data": "sequence_in_ms", "title": "sequence in ms" },
            { "data": "where_in_ms_from", "title": "Where in MS (from)", "visible": false },
            { "data": "where_in_ms_to", "title": "Where in MS (to)", "visible": false },
            {
                "data": "where",
                "title": "Where in MS",
                "render": function (data, type, row, meta) {
                    //let fromIndex = findCanvasIndexByLabel(row.where_in_ms_from);
                    //let toIndex = findCanvasIndexByLabel(row.where_in_ms_to);

                    let fromText = row.where_in_ms_from;
                    let toText = row.where_in_ms_to;

                    //if(fromIndex)
                        fromText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_from+'\')">'+row.where_in_ms_from+'</a>';

                    //if(toIndex)
                        toText = '<a  onclick="goToCanvasByLabel(\''+row.where_in_ms_to+'\')">'+row.where_in_ms_to+'</a>';

                    if(row.where_in_ms_from == row.where_in_ms_to || row.where_in_ms_to == '-')
                        return fromText;
                    return fromText +' - '+ toText;
                }
            },
            { "data": "is_medieval", "title": "is medieval?" , "visible": false },
            { "data": "is_main_text", "name": "is_main_text", "title": "is main text?", "visible": false },
            { "data": "comment", "title": "comment" },
            { "data": "authors", "title": "authors", "visible": false },
            { "data": "data_contributor", "title": "data contributor", "visible": false },
        ],
        "order": [
            { "data": "sequence_in_ms", "order": "asc" },  // Sort by the "manuscript_name" column in ascending order
            { "data": "where_in_ms_from", "order": "asc" }      // Then sort by the "manuscript" column in descending order
        ],
        "createdRow": function(row, data, dataIndex) {
            if (data.is_medieval == true || data.is_medieval == "true" || data.is_medieval == "yes" || data.is_medieval == "Yes") {
                $(row).addClass('medieval-row');
            } else {
                $(row).addClass('non-medieval-row');
            }
        },
        "initComplete": function() {
            displayDebate(additions_hands,"#additions_hands");
            displayUniqueAuthorsAndContributors(additions_hands,"#additions_hands");
            displayScriptsLegend(additions_hands,"#additions_hands");
        }
    });
}

//Watermarks----------------------------------------------------------------
var watermarks_table;
function init_watermarks_table()
{
    watermarks_table = $('#watermarks').DataTable({
        "ajax": {
            "url": pageRoot+'/watermarks_info/?ms=' + manuscriptId,
            "dataSrc": function (data) {
                return data.data; 
            }
        },
        "columns": [
            { "data": "name", "title": "name" },
            {
                "data": "watermark_img",
                "name": "watermark_img",
                "title": "image",
                "render": function (data, type, row, meta) {
                    return renderImg(data, type, row, meta);
                }
            },
            { "data": "where_in_manuscript", "title": "where in MS" },
            { "data": "external_id", "title": "external id" },
            { "data": "comment", "title": "comment" },
            { "data": "authors", "title": "authors", "visible": false },
            { "data": "data_contributor", "title": "data contributor" , "visible": false },
        ],
        "order": [
            { "data": "where_in_manuscript", "order": "asc" },  // Sort by the "manuscript_name" column in ascending order
        ],
        "initComplete": function() {
            displayUniqueAuthorsAndContributors(watermarks_table,"#watermarks");
        }
    });
}


//Provenance----------------------------------------------------------------
var provenance_table;

function init_provenance_table()
{
    provenance_table = $('#provenance').DataTable({
        "ajax": {
            "url": pageRoot+'/provenance_info/?ms=' + manuscriptId,
            "dataSrc": function (data) {
                return data.data; 
            }
        },
        "columns": [
            { "data": "id", "title": "id" , "visible": false },
            { "data": "date_from", "title": "date_from" , "visible": false },
            { "data": "date_to", "title": "date_to" , "visible": false },
            {
                "data": "date",
                "title": "Date",
                "render": function (data, type, row, meta) {
                    if(row.date_from == row.date_to || row.date_to == '-')
                        return row.date_from;
                    return row.date_from +' - '+ row.date_to;
                }
            },
            { "data": "place", "title": "Place" },
            { "data": "timeline_sequence", "title": "timeline_sequence" , "visible": false },
            { "data": "comment", "title": "comment" },
            { "data": "authors", "title": "authors", "visible": false },
            { "data": "data_contributor", "title": "data contributor" , "visible": false },
        ],
        "order": [
            { "data": "timeline_sequence", "order": "asc" },  // Sort by the "manuscript_name" column in ascending order
        ],
        "initComplete": function() {
            displayDebate(provenance_table,"#provenance");
            displayUniqueAuthorsAndContributors(provenance_table,"#provenance");
        }
    });
}


//Bibliography----------------------------------------------------------------
var bibliography_table;

function init_bibliography_table()
{
    bibliography_table = $('#bibliography').DataTable({
        "ajax": {
            "url": pageRoot+'/bibliography_info/?ms=' + manuscriptId,
            "dataSrc": function (data) {
                return data.data;
            }
        },
        "processing": false,
        "serverSide": true,
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pagingType": "full_numbers",
        "pageLength": 10,
        "columns": [
            { "data": "title", "title": "Title" },
            { "data": "author", "title": "Author" },
            { "data": "year", "title": "Year" }
        ]
    });
}

function displayDebate(dataTable,divToAppend)
{
    var all_data = dataTable.ajax.json();
    var debates = all_data.debate;

    if(debates.length < 1)
        return 0;

    console.log(all_data);

    var uniqueValuesDiv = $('<div class="printIt">');
    var title = $('<h4>Different Opinions:</h4>');
    uniqueValuesDiv.append(title);

    var list = $('<ul>');

    /////////////////////////////////////////
    var table = dataTable.table();

    for (d in debates)
    {
        var debate = debates[d];

        var id_to_find = debate.instance_id;
        var column_to_find = debate.field_name;

        if (column_to_find == "date_from" || column_to_find == "date_to")
            column_to_find = "date";
        if (column_to_find == "where_in_ms_from" || column_to_find == "where_in_ms_to")
            column_to_find = "where";
        if (column_to_find == "size_height" || column_to_find == "size_width")
            column_to_find = "size";
        

        // Get the column index of the column named `column_to_find`
        var columnIndex = table.settings().init().columns.findIndex(col => col.data === column_to_find);

        // Find the row that has id == id_to_find
        var row = table.rows().indexes().filter(function (value, index) {
            return table.row(value).data().id == id_to_find;
        });

        if (row.length > 0) {
            // Get the cell in the row and column specified

            var cell = table.cell(row[0], columnIndex).node();
            var cellData = $(cell).text();

            // Append the desired string to the cell data
            $(cell).html(cellData + ' <a class="debate-link" href="#debate_'+debate.id+'" title="'+debate.text+'">*</a>');

            // Redraw the table to reflect the changes (if necessary)
        }

        //Debate list below
        var list_item = $('<li>According to:' 
            +'<div id="debate_'+debate.id+'"><b>'+debate.bibliography+'</b>'
            +'  <span style="display: block;">'
            +'      <u>'+debate.field_name+'</u>'
            +'      is: <b>'+debate.text+'</b>'
            +'  </span>'
            +'</li>');
        list.append(list_item);
    }
    //////////////////////////////////////////
    /*
    <div>
    <h4 class="printIt" >Different Opinions:</h4>
    <ul>
        <template x-for="(comment) in (await getCodicologyInfo()).debate">
            <div class="printIt" >
                <li>
                    According to:
                    <div x-bind:id="'#debate-'+comment.id"><b x-text="comment.bibliography "></b>,
                    <span style="display: block;">
                        <u x-text="comment.field_name"></u>
                        is: <b  x-text="comment.text "></b>
                    </span>
                </li>
                <!--<a class="debate-link" x-bind:href="'#debate-'+comment.id" x-bind:title="comment.text">*</a>-->
            </div>
        </template>

    </ul>
</div>
*/

    table.draw(false);

    uniqueValuesDiv.append(list);
    $(divToAppend).after(uniqueValuesDiv);
}

function displayUniqueAuthorsAndContributors(dataTable, divToAppend) {
    var table = dataTable.table();

    var uniqueAuthors = [];
    var uniqueContributors = [];

    table.rows().every(function() {
        var rowData = this.data();
        var authors = "";
        if( Array.isArray(rowData.authors) ){
            authors = rowData.authors.join(', ');
        }

        if (!uniqueAuthors.includes(authors)) {
            uniqueAuthors.push(authors);
        }
        if (!uniqueContributors.includes(rowData.data_contributor)) {
            uniqueContributors.push(rowData.data_contributor);
        }
    });

    // Render unique values in a div below the table
    var uniqueValuesDiv = $('<div>');
    var authorsString = uniqueAuthors.join(', ');
    var contributorsString = uniqueContributors.join(', ');
    
    var combinedParagraph = '<p class="printIt"><strong>Authors: </strong>' + authorsString + '. <strong>Data Contributors</strong>: ' + contributorsString + '</p>';
    uniqueValuesDiv.append(combinedParagraph);

    $(divToAppend).after(uniqueValuesDiv);
}


function displayScriptsLegend(dataTable, divToAppend) {
    var table = dataTable.table();

    // Render unique values in a div below the table
    var mainDiv = $('<div class="printIt" style="margin-top:0.5em;">'
    +'<div class="medieval-row" style="border: 1px solid black; width: 1.1em; height:1.1em; display: inline-block; margin-right:0.5em;  margin-left: 1em; text-align: middle"></div>'
    +'<i>Medieval</i>'
    +'<div style="border: 1px solid black; width: 1.1em; height:1.1em; display: inline-block; margin-right:0.5em; margin-left: 1em; text-align: middle" class="non-medieval-row"></div>'
    +'<i>Modern</i></div>');

    $(divToAppend).after(mainDiv);
}



function displaOriginalAddedLegend(dataTable, divToAppend) {
    var table = dataTable.table();

    // Render unique values in a div below the table
    var mainDiv = $('<div class="printIt" style="margin-top:0.5em;">'
    +'<div class="medieval-row" style="border: 1px solid black; width: 1.1em; height:1.1em; display: inline-block; margin-right:0.5em;  margin-left: 1em; text-align: middle"></div>'
    +'<i>Original</i>'
    +'<div style="border: 1px solid black; width: 1.1em; height:1.1em; display: inline-block; margin-right:0.5em; margin-left: 1em; text-align: middle" class="non-medieval-row"></div>'
    +'<i>Added</i></div>');

    $(divToAppend).after(mainDiv);
}




function printDiv(divId, title) 
{
    let mywindow = window.open('', 'PRINT', 'height=700,width=1200,top=100,left=100');

    mywindow.document.body.innerHTML = '<html><head><title>${title}</title><link rel="stylesheet" href="/static/css/printed.css" /></head><body>Loading data... Please be patient...</body></html>';

    let bibliography_promise = getBibliographyPrintableInfo();

    //Open all:
    toggles = $('.toggle');
    for(t in toggles)
    {
        if(toggles[t].getAttribute && !toggles[t].getAttribute('opened'))
            $(toggles[t]).click();
    }
    //mywindow.document.write(document.getElementById(divId).innerHTML);
    inside_elements = $('.printIt');

    $('#quires').DataTable().page.len(-1).draw();
    $('#main_hands').DataTable().page.len(-1).draw();
    $('#additions_hands').DataTable().page.len(-1).draw();
    $('#layouts').DataTable().page.len(-1).draw();
    $('#bibliography').DataTable().page.len(-1).draw();
    
    $('#content').DataTable().page.len(-1).draw();
    $('#content').on( 'draw.dt', async function ()// waits untill the content would be fully loaded
    {
        //console.log( 'Content table redrawn' );
        mywindow.document.body.innerHTML = '';
        mywindow.document.write(`<html><head><title>${title}</title>`);
        mywindow.document.write('<link rel="stylesheet" href="/static/css/printed.css" /></head><body >');
    

        for(e in inside_elements)
        {
            if(inside_elements[e].outerHTML)
                mywindow.document.write( inside_elements[e].outerHTML );
        }

        let bibliography_data = await bibliography_promise;
        mywindow.document.write('<h2>Bibliography</h2>');
        mywindow.document.write(bibliography_data.data);

        mywindow.document.write('</body></html>');
    
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/


        //Close all:
        toggles = $('.toggle');
        for(t in toggles)
        {
            if(toggles[t].getAttribute && toggles[t].getAttribute('opened'))
                $(toggles[t]).click();
        }

        mywindow.print();

    } );

    //mywindow.close();
    
    return true;
}


let isResizing = false;

function handleResizerMouseMove(e) {
    if (isResizing) {

        const leftColumn = document.getElementById("leftColumn");
        const rightColumn = document.getElementById("rightColumn");
        const resizer = document.getElementById("resizer");

        // How far the mouse has been moved
        const dx = e.clientX - res_mouse_x;

        const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
        if(newLeftWidth<1)
            newLeftWidth=1;
        
        const containerWidth = leftColumn.offsetWidth + rightColumn.offsetWidth;

        leftColumn.style.width = `${newLeftWidth}%`;
        rightColumn.style.width = `${100 - newLeftWidth}%`;


        // Adjust the position of the resizer
        const resizerPosition = (newLeftWidth / 100) * containerWidth;
        //resizer.style.left = `${resizerPosition}px`;
        resizer.style.left =`${newLeftWidth}%`;
    }
}

manuscript_init = function()
{
    //RESIZER:
    const leftColumn = document.getElementById("leftColumn");
    const rightColumn = document.getElementById("rightColumn");
    const resizer = document.getElementById("resizer");

    // Event listener for mouse down on the resizer
    resizer.addEventListener("mousedown", function (e) {
        isResizing = true;
        res_mouse_x = e.clientX;
        leftWidth = leftColumn.getBoundingClientRect().width;

        document.addEventListener("mousemove", handleResizerMouseMove);
        document.addEventListener("mouseup", function () {
            isResizing = false;
            document.removeEventListener("mousemove", handleResizerMouseMove);
        });
    });
    

    //Tooltips:
    /*
    $('a').hover(function(e){
        title = $(this).attr('alt');
        $(this).append('<span>'+title+'</span>')
    },
    function(e){
        $('span', this).remove();
    });
    */

    //Tooltips for debate:
    /*
    document.querySelectorAll('a').forEach(function(element) {
        element.addEventListener('mouseover', function(event) {
            var title = this.getAttribute('alt');
            var span = document.createElement('span');
            span.textContent = title;
            this.appendChild(span);
        });

        element.addEventListener('mouseout', function(event) {
            var span = this.querySelector('span');
            if (span) {
                this.removeChild(span);
            }
        });
    });*/




    // Query the element
    /*
    const resizer = document.getElementById('dragMe');
    const leftSide = resizer.previousElementSibling;
    const rightSide = resizer.nextElementSibling;

    // The current position of mouse
    let x = 0;
    let y = 0;
    let leftWidth = 0;

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (e) {
        // Get the current mouse position
        x = e.clientX;
        y = e.clientY;
        leftWidth = leftSide.getBoundingClientRect().width;

        // Attach the listeners to document
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
        leftSide.style.width = newLeftWidth + '%';

        resizer.style.cursor = 'col-resize';
        document.body.style.cursor = 'col-resize';

        leftSide.style.userSelect = 'none';
        leftSide.style.pointerEvents = 'none';

        rightSide.style.userSelect = 'none';
        rightSide.style.pointerEvents = 'none';
    };

    const mouseUpHandler = function () {
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');

        leftSide.style.removeProperty('user-select');
        leftSide.style.removeProperty('pointer-events');

        rightSide.style.removeProperty('user-select');
        rightSide.style.removeProperty('pointer-events');

        // Remove the handlers of mousemove and mouseup
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    resizer.addEventListener('mousedown', mouseDownHandler);

    */

    
    //For the popup window (add comment):
    const links = document.querySelectorAll('a[data-popup="yes"]');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const url = this.getAttribute('href');
            const popupWindow = window.open(url, '_blank', 'width=700,height=800');
            if (popupWindow) {
                popupWindow.focus();
            } else {
                alert('Please allow pop-ups for this site to open the link.');
            }
        });
    });
    
    
    //Replaces _ with " " in field names.
    const fields = document.querySelectorAll('div.field-name');

    fields.forEach(field => {
        field.textContent = field.textContent.replace(/_/g, ' ');
    });


    (async () => {
        const ms_info = await getMSInfo()
        iiif_manifest_url = ms_info.manuscript.iiif_manifest_url;
        manifests = {}
        manifests[iiif_manifest_url]={"provider": "external"}

        mirador_config = {
            "id": "my-mirador",
            "manifests": manifests,
            /*catalog: [
                {
                    manifestID: iiif_manifest_url
                },
            ],*/
            "windows": [
                {
                "loadedManifest": iiif_manifest_url,
                "canvasIndex": 1,
                "thumbnailNavigationPosition": 'far-bottom'
                }
            ]
        };

        var miradorInstance = Mirador.viewer(mirador_config);
        window.miradorInstance = miradorInstance;


        window.allCanvasesWithLabels = []
        function getAllCanvasesWithLabels() {

            if(window.allCanvasesWithLabels.length > 0)
                return window.allCanvasesWithLabels;

            const state = miradorInstance.store.getState();
            const windowId = Object.keys(state.windows)[0]; // Pobierz pierwszy identyfikator okna
            const manifestId = state.windows[windowId].manifestId;
        
            // Sprawdź, czy manifest jest już załadowany
            if (state.manifests[manifestId]) {
                const manifest = state.manifests[manifestId].json;
        
                // Sprawdź, czy manifest zawiera elementy
                if (manifest.items && manifest.items.length > 0) {
                    const canvases = manifest.items;
                    const canvasList = [];
        
                    for (let i = 0; i < canvases.length; i++) {
                        const canvas = canvases[i];
                        const label = canvas.label;
                        canvasList.push({ index: i, id: canvas.id, label: label[Object.keys(label)[0]][0] });
                    }

                    window.allCanvasesWithLabels = canvasList;
        
                    return canvasList;
                } else {
                    console.error('Manifest does not contain items');
                    return [];
                }
            } else {
                console.error('Manifest not loaded yet');
                return [];
            }
        }
        
        // Przykład użycia
        const canvasList = getAllCanvasesWithLabels();
        console.log(canvasList);
        

        window.getAllCanvasesWithLabels = getAllCanvasesWithLabels;


        // Funkcja do znalezienia indeksu kanwy na podstawie etykiety
        function findCanvasIndexByLabel(label) {
            const canvases = getAllCanvasesWithLabels();
            
            for (let i = 0; i < canvases.length; i++) {
                if (canvases[i].label === label) {
                    return canvases[i].id;
                }
            }
            return null;
        }
        window.findCanvasIndexByLabel = findCanvasIndexByLabel;   

        function goToCanvasById(canvasId) {
        
            const state = miradorInstance.store.getState();
            const windowId = Object.keys(state.windows)[0]; // Pobierz pierwszy identyfikator okna
        
            var action = Mirador.actions.setCanvas(windowId, canvasId);
            miradorInstance.store.dispatch(action); 
        }

        window.goToCanvasById = goToCanvasById;

        // Funkcja do przełączania się na kanwę na podstawie etykiety
        function goToCanvasByLabel(label) {
            const index = findCanvasIndexByLabel(label);
            if (index !== null) {
                goToCanvasById(index);
            } else {
                console.error(`Canvas with label "${label}" not found`);
            }
        }
        window.goToCanvasByLabel = goToCanvasByLabel;    

    
        // Przykład użyciaj
        // goToCanvasById('my-mirador', 'your-canvas-id'); // Zamień 'your-canvas-id' na właściwy identyfikator kanwy
        
    
    })()

    /*var mirador = Mirador({
        id: "mirador",
        data: [
            { manifestUri: iiif_manifest_url, location: "Repository" }
        ]
        });*/


    $("#btnPrint").on("click", function () {
        printDiv('rightColumn','Liturgica Poloniae');
    });

}

async function map_init()
{
    
    //Provenance:
    var southWest = L.latLng(-89.98155760646617, -180),
    northEast = L.latLng(89.99346179538875, 180);
    var bounds = L.latLngBounds(southWest, northEast);

    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    map = L.map('map',{
        center: bounds.getCenter(),
        zoom: 2,
        layers: [osm],
        maxBounds: bounds,
        maxBoundsViscosity: 1.0
    });//.setView([51.505, -0.09], 5);

    var markers = (await getProvenanceInfo()).markers;

    /*
    map.setMaxBounds(bounds);
    map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
    });
    */
    /*
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    */

    
    allMarkers = [];

    for(m in markers)
    {
        //var marker = L.marker([markers[m].lat , markers[m].lon ]).addTo(map);

        var marker = new L.Marker(new L.LatLng(markers[m].lat, markers[m].lon ), {
            icon:	new L.NumberedDivIcon({number: Number(m)+1}),
            autoPanOnFocus: false
        });
        marker.addTo(map);

        marker.bindPopup("<b>"+ markers[m].name +"</b>", {
            autoPan: false
        });

        allMarkers.push(marker);

        //Add arrow
        let next_m = parseInt(m)+1
        if(next_m < markers.length)
        {
            var myVector = L.polyline([
                (new L.LatLng(markers[m].lat, markers[m].lon )),
                (new L.LatLng(markers[next_m].lat, markers[next_m].lon ))
            ],
            {color:'darkblue'}).arrowheads({
                fill: true,
                frequency: 'endonly',
                //frequency: '100px',
                size: '10px',
                color: 'darkblue'
            });
            myVector.addTo(map);
        }
    }

    if(allMarkers.length>0)
    {
        var group = new L.featureGroup(allMarkers);
        map_bounds = group.getBounds()
        map.fitBounds(map_bounds, {padding: [50,50]});

        //map_refresh();
    }
}

var map_refreshed = false

async function map_refresh()
{
    if(map_refreshed)
        return;

    map.invalidateSize();
    map.fitBounds(map_bounds, {padding: [50,50]});
    //map.redraw();

    map_refreshed = true;
}
