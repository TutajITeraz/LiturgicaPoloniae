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
    ms_content_div.append('<h2>'+name+'</h2>');

    var manuscript_description = $('<table class="manuscript_description">');

    var ms_content_span = '';
    for(c in ms_content)
    {
        ms_content_span += ' <span class="ms_content_span"> '+c+": "+ms_content[c]+', </span>';
    }

    manuscript_description.append('<tr><th>Content:</th><td>'+ms_content_span+'</td><tr>');

    ms_content_div.append(manuscript_description);
    $('#results').append(ms_content_div);

    for(ms in similar_ms)
    {
        var manuscript = similar_ms[ms];

        var manuscript_div = $('<div class="similar_ms">');

        var manuscript_name = manuscript.manuscript_name;
        var manuscript_name_el =  $('<h2>'+manuscript_name+'</h2>');
        manuscript_div.append(manuscript_name_el);

        var manuscript_description = $('<table class="manuscript_description">');

        var content_similarity = ( manuscript.identical_edition_index_count / ms_content_count)*100.0;
        var sequence_similarity = ( manuscript.identical_edition_index_on_same_sequence_count / ms_content_count)*100.0;
        manuscript_description.append('<tr><th>Content similarity:</th><td>'+Math.round(content_similarity * 100) / 100+'%</td><tr>');
        manuscript_description.append('<tr><th>Sequence similarity:</th><td>'+Math.round(sequence_similarity * 100) / 100+'%</td><tr>');

        manuscript_description.append('<tr><th>How many rites in edition index:</th><td>'+manuscript.total_edition_index_count+'</td><tr>');
        
        manuscript_description.append('<tr><th>How many rites are the same:</th><td>'+manuscript.identical_edition_index_count+'</td><tr>');
        manuscript_description.append('<tr><th>How many rites are the same (and have same sequence no.):</th><td>'+manuscript.identical_edition_index_on_same_sequence_count+'</td><tr>');
        manuscript_description.append('<tr><th>List of same edition indexes:</th><td>'+manuscript.identical_edition_index_list+'</td><tr>');
        manuscript_description.append('<tr><th>List of all edition indexes:</th><td>'+manuscript.edition_index_list+'</td><tr>');

        manuscript_div.append(manuscript_description);

        $('#results').append(manuscript_div);
    }
}


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