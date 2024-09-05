assistant_init = function()
{
    console.log('assistant');

}

function setTableHeight() {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    console.log('height: ', windowHeight);
    if(windowWidth > 640){
        var tableHeight = windowHeight - 500;
    } else {
        var tableHeight = windowHeight - 470;
    }
    
    
    $('#assistant_content').css('height', tableHeight + 'px');
}

// Adjust height on window resize
$(window).resize(function() {
    setTableHeight();
});



function askQuestion() {
    setTableHeight();
    var questionInput = document.getElementById('question');
    var question = questionInput.value;


    var loader = document.getElementById('loader');
    loader.innerHTML = '<h2>Info:</h2><p>Loading...(can take up to 20sec)</p>';

    if (question.trim() === '') {
        alert('Please enter a question.');
        return;
    }

    var answerDiv = document.getElementById('answer');

    loader.style.display = 'block';
    answerDiv.innerHTML = '';

    $.ajax({
        type: 'GET',
        url: pageRoot+'/assistant/?q=' + question,
        success: function (data) {
            loader.style.display = 'none';
            displayAnswer(data);
        },
        error: function () {
            loader.style.display = 'none';
            alert('Error fetching data.');
        },
        xhrFields: {
                withCredentials: true
        }
    });
}

function displayAnswer(data) {
    var answerDiv = document.getElementById('answer');
    var infoDiv = document.getElementById('loader');

    if(data.text)
    {
        infoDiv.style.display = 'block';
        infoDiv.innerHTML = '<h2>Info:</h2><p>'+data.text+'</p>';
    }

    if (Array.isArray(data.info) && data.info.length > 0 && typeof data.info[0] === 'object') {
        var keys = Object.keys(data.info[0]);
        var table = '<h2>Answer:</h2><table id="dataTable"><thead><tr>';

        keys.forEach(function (key) {
            table += '<th>' + key + '</th>';
        });

        table += '</tr></thead><tbody>';

        var processedData=[]
        for(var idx in data.info)
        {
            table += '<tr>';

            processedData[idx] = {}
            for(var f in data.info[idx])
            {
                processedData[idx][f] = getPrintableValues(f,data.info[idx][f]).value;
                table += '<td>' + processedData[idx][f] + '</td>';
            }

            table += '</tr>';
        }
        /*

        processedData.forEach(function () {
            table += '<tr>';
            keys.forEach(function (key) {
                table += '<td>' + item[key] + '</td>';
            });
            table += '</tr>';
        });*/

        table += '</tbody></table>';
        answerDiv.innerHTML = table;

        // Convert table to DataTable
        $('#dataTable').DataTable();
    } else if (Array.isArray(data.info) && data.info.length === 1 && typeof data.info[0] === 'object') {
        // Handle single-row data
        var singleRowData = data.info[0];
        var singleRowKeys = Object.keys(singleRowData);
        answerDiv.innerHTML = '<h2>Answer:</h2><table id="dataTable"><thead><tr><th>' + singleRowKeys[0] + '</th></tr></thead><tbody><tr><td>' + singleRowData[singleRowKeys[0]] + '</td></tr></tbody></table>';

        // Convert table to DataTable
        $('#dataTable').DataTable();
    } else if (typeof data.info === 'number') {
        answerDiv.innerHTML = '<h2>Answer:</h2><p>' + data.info + '</p>';
    } else {
        answerDiv.innerHTML = '<h2>Answer:</h2><p>No data available</p>';
    }
}

