var request = require('request');
var fs = require('fs');
const EventEmitter = require('events');
var eventObj = new EventEmitter();

var url = "https://api.inaturalist.org/v1/observations?place_id=6744&taxon_name=%5B'TAXON_NAME'%5D&order=desc&order_by=created_at&per_page=0";

function queryInaturalist(taxonArray) {
    var taxonName = encodeURIComponent(taxonArray[0]);
    var urlLookup = url.replace('TAXON_NAME', taxonName);
    request({
        url: urlLookup,
        method: 'GET'
    }, function (error, response, body) {
        var total = 0;
        if(body){
            var json = JSON.parse(body),
                total = json.total_results;
        }

        taxonArray.push(total);
        eventObj.emit('finished');
    })
};
var fetch = fs.readFileSync('scripts/fetch.txt', "utf8");
console.log(fetch);
var taxons = fetch.split('\n');
var taxonsArray = [['Scientific name', 'Number of occurrences']];
var i = 0;

function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function checkTaxon() {
    if(i < taxons.length) {
        console.log(i);
        var taxonArray = [taxons[i]];
        taxonsArray.push(taxonArray);
        queryInaturalist(taxonArray);
        i++;
        serializeArray();
        msleep(2*1000);
    }
}

eventObj.on('finished', checkTaxon);
checkTaxon();


function serializeArray() {
    if( i == taxons.length) {
        var csv = "", lines = [];
        for (var g = 0; g < taxonsArray.length; g++) {
            lines.push( taxonsArray[g].join(',') );
        }

        fs.writeFileSync('scripts/occurrences.csv', lines.join('\n'), 'utf8');
    }
}