function store(result){
    var map = $('#map').val();
    var character = $('#character').val();
    const race = {
        timestamp:Math.floor(Date.now()/1000),
        map:map,
        character:character,
        win:result
    }
    localforage.getItem('races').then(function(races){
        if (races==null){
            races = [];
        }
        races.push(race);
        localforage.setItem('races',races).then(function(){
            winRate();
            crossRate();
            recentRecord();
        });
    });
}

function clearStorage(){
    localforage.removeItem('races').then(function() {
        winRate();
        crossRate();
        recentRecord();
        $('#logDisplay').text("");
    });
}

function winRate(){
    localforage.getItem('races').then(function(races){
        if(races==null){
            $("#raceCountDisplay").text(0);
            $("#winRateDisplay").text("--");
            return;
        }
        var winCount = 0;
        for(var i=0;i<races.length;i++){
            winCount+=races[i].win;
        }
        $("#raceCountDisplay").text(races.length);
        $("#winRateDisplay").text((winCount*100/races.length).toFixed(2));
    });
}

async function getLog(){
    var log = await localforage.getItem('races');
    $("#logDisplay").text(JSON.stringify(log));
}

function crossRate(){
    var map = $('#map_query').val();
    var character = $('#character_query').val();
    localforage.getItem('races').then(function(races){
        if(races==null){
            $("#raceCountDisplay_c").text(0);
            $("#winRateDisplay_c").text("--");
            return;
        }
        var winCount = 0;
        var raceCount = 0;
        for(var i=0;i<races.length;i++){
            if(races[i].map==map || map==""){
                if(races[i].character==character || character==""){
                    raceCount += 1;
                    winCount += races[i].win;
                }
            }
        }
        $("#raceCountDisplay_c").text(raceCount);
        if(raceCount==0){
            $("#winRateDisplay_c").text("--");
        }else{
            $("#winRateDisplay_c").text((winCount*100/raceCount).toFixed(2));
        }
    });
}

async function recentRecord(){
    let row = 1;
    row = $('#displayRow').val();
    if (row <= 1){
        row = 1;
    }
    var races = await localforage.getItem('races');
    if(races==null){
        $("#table_body").html("");
        return;
    }
    var text="";
    for(var i=races.length-1;i>races.length-row-1&&i>=0;i--){
        var t = new Date(races[i].timestamp*1000);
        var ts= t.getMonth() + "/" + t.getDate() + "&nbsp;&nbsp;" + t.getHours() + ":" + t.getMinutes();
        if(races[i].win){
            text += "<tr style='background-color: var(--ts-positive-400);'>";
        }else{
            text += "<tr style='background-color: var(--ts-negative-400);'>";
        }
        text += "<td>"+(i+1)+"</td><td>"+ts+"</td><td>"+races[i].map+"</td><td>"+races[i].character+"</td></tr>";
    }
    $("#table_body").html(text);
}

$(document).ready(function($){

    winRate();
    recentRecord();

    $('#map_query').click(function () {
        $('#map_query').change(function () {
            crossRate();
        });
    });  

    $('#displayRow').change(function () {
        recentRecord();
    });  

    $('#character_query').click(function () {
        $('#character_query').change(function () {
            crossRate();
        });
    });  

    $('#selectCharacter').click(function () {
        $('#confirm').modal('show');
    });
});
