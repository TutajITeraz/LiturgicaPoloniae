var user="";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const page = urlParams.get('p');

(function() { // Scoping function to avoid globals
    var src = page+".js"
    document.write('<script src="/static/js/' + src + '"><\/script>');
})();

let main_info_lock = false; // Flag to check if the request is in progress
let main_info = null; // Cached data

let fetchOnceData = {};
let fetchOnceLocks = {};

async function fetchOnce(url) {
  while (fetchOnceLocks[url]) {
    // Wait until the lock is released
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  if (!fetchOnceData[url] && !fetchOnceLocks[url]) {
    // Set the lock to prevent multiple requests for the same URL
    fetchOnceLocks[url] = true;

    try {
      // Use AJAX to fetch data from the specified URL
      const response = await fetch(url);
      fetchOnceData[url] = await response.json();
    } finally {
      // Release the lock
      fetchOnceLocks[url] = false;
    }
  }

  return fetchOnceData[url];
}

function start() {
    var user="Unknown user";

    return {
        page: '...loading...',
        fetch(file) {
            fetch(file).then((result) => result.text())
            .then((page) => {
                this.page = page;
            })
        }
    }
}

async function getMainInfo() {
    return fetchOnce(`/main_info/`);
  }

async function getUsername()
{
    const main_info = await getMainInfo();
    const user = main_info.username

    if( user == "")
        window.location.href = "/login/";

    return user;
}

getUsername();

///////////////////////////////////////////////////////////////////////////////////////


function foliationPagination(value)
{
    if (value == null)
        return '';
    return value.replace('.0','').replace('.1','r').replace('.2','v');
}

function renderImg( data, type, row, meta ) {
    if(!data) return 'no preview';
        else return '<img style="max-width:150px" src="/media/'+data+'"></img>';
}

function removeZeros(value)
{
    if (value == null)
        return '';
    return value.replace('.00','');
}

const fieldPrefixes = {

}

const fieldSuffixes = {
    'page_size_max_height': ' mm',
    'page_size_max_width': ' mm',
    'paper_size_max_height': ' mm',
    'paper_size_max_width': ' mm',
    'parchment_thickness': ' mm',
}

const fieldProcessors = {
    'where_in_ms_from': foliationPagination,
    'where_in_ms_to': foliationPagination,
    'page_size_max_height': removeZeros,
    'page_size_max_width': removeZeros,
    'paper_size_max_height': removeZeros,
    'paper_size_max_width': removeZeros,
    'parchment_thickness': removeZeros,
}

const displayNames = {
    'foreign_id': "CLLA no.",    //W PL będzie "MSPL no."
    'rism_id': "RISM",
}

function getPrintableValues(fname, fvalue) {
    if(!fname)
        return {name:'',value:''};

    if(fvalue == null)
        fvalue = '-'

    if(fvalue == "None")
        fvalue = '-'

    if(fvalue === true)
        fvalue = 'yes'

    if(fvalue === false)
        fvalue = 'no'


    value_prefix = fieldPrefixes[fname]||'';
    value_suffix = fieldSuffixes[fname]||'';

    procFunc = fieldProcessors[fname];
    if(procFunc)
        fvalue = procFunc(fvalue)

    //fname = fname.replace('_',' ')
    name_changed = displayNames[fname]
    if(name_changed)
        fname = name_changed;
    else    
        fname = fname.split('_').join(' ');

    return {
        name: fname,
        value: value_prefix+ fvalue + value_suffix,
    }
}
function getPrintableValueFromDict(dict,fname)
{
    if(dict === 'undefined' || dict === null )
        return '';

    fvalue = dict[fname] || '';
    if(fvalue == '')
        return '';
    const {name, value} = getPrintableValues(fname, fvalue);
    return value;
}

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});