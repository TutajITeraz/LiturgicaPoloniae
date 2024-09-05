
async function getAndShowSimilarMSbyEditionIndex(id,name)
{
    $('#results').empty();
    $('#results').append('<h3>Loading...</h3>');


    var info = (await getSimilarMSbyEditionIndex(id));
    $('#results').empty();

    var ms_content = info.ms_content;
    var similar_ms = info.similar_ms;

    var ms_content_count = ms_content.length;

    var ms_content_div = $('<div class="ms_content">');
    ms_content_div.append('<h2 class="content_header">'+name+'</h2>');

    var manuscript_description = $('<table class="manuscript_description result_table">');

    var ms_content_span = '';
    for(c in ms_content)
    {
        ms_content_span += ' <span class="ms_content_span"> '+c+": "+ms_content[c]+', </span>';
    }

    manuscript_description.append('<tr><td class="firsttd">Content:</td><td>'+ms_content_span+'</td><tr>');

    ms_content_div.append(manuscript_description);
    $('#results').append(ms_content_div);

    for(ms in similar_ms)
    {
        var manuscript = similar_ms[ms];

        var manuscript_div = $('<div class="similar_ms">');

        var manuscript_name = manuscript.manuscript_name;
        var manuscript_name_el =  $('<h2 class="content_header">'+manuscript_name+'</h2>');
        manuscript_div.append(manuscript_name_el);

        var manuscript_description = $('<table class="manuscript_description">');

        var content_similarity = ( manuscript.identical_edition_index_count / ms_content_count)*100.0;
        var sequence_similarity = ( manuscript.identical_edition_index_on_same_sequence_count / ms_content_count)*100.0;
        manuscript_description.append('<tr><td class="firsttd" class="firsttd">Content similarity:</td><td>'+Math.round(content_similarity * 100) / 100+'%</td><tr>');
        manuscript_description.append('<tr><td class="firsttd">Sequence similarity:</td><td>'+Math.round(sequence_similarity * 100) / 100+'%</td><tr>');

        manuscript_description.append('<tr><td class="firsttd">How many rites in edition index:</td><td>'+manuscript.total_edition_index_count+'</td><tr>');
        
        manuscript_description.append('<tr><td class="firsttd">How many rites are the same:</td><td>'+manuscript.identical_edition_index_count+'</td><tr>');
        manuscript_description.append('<tr><td class="firsttd">How many rites are the same (and have same sequence no.):</td><td>'+manuscript.identical_edition_index_on_same_sequence_count+'</td><tr>');
        manuscript_description.append('<tr><td class="firsttd">List of same edition indexes:</td><td>'+manuscript.identical_edition_index_list+'</td><tr>');
        manuscript_description.append('<tr><td class="firsttd">List of all edition indexes:</td><td>'+manuscript.edition_index_list+'</td><tr>');

        manuscript_div.append(manuscript_description);

        $('#results').append(manuscript_div);
    }

}

function setTableHeight() {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    // console.log('height: ', windowWidth);
    if(windowWidth > 640){
        var tableHeight = windowHeight - 400;
    } else {
        var tableHeight = windowHeight - 370;
    }
    
    
    $('#results').css('height', tableHeight + 'px');
}

$(document).ready(function() {
    console.log('document ready function');
    setTimeout(function() {
        setTableHeight();
    }, 700);  // A small delay ensures elements are fully rendered
});

$(window).on('load', function() {
    console.log('window load function');
    setTableHeight();
});

// Adjust height on window resize
$(window).resize(function() {
    setTableHeight();
});


async function getSimilarMSbyEditionIndex(id) 
{
    return fetchOnce(pageRoot+`/rites_lookup/?ms=${id}`);
}

content_init = function()
{
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

        getAndShowSimilarMSbyEditionIndex(id, data.text);
    });

}
