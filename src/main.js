function store(result){
    var character = $('#characterToInput').text();
    var map = $('#mapToInput').text();
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
        $('#confirm_c').modal('show');
    });

    $('#character').click(function () {
        // $('#confirm').modal('show');
    });

    $('#characterToInput').click(function () {
        $('#confirm_c').modal('show');
    });
    $('#mapToInput').click(function () {
        $('#confirm_m').modal('show');
    });

    const c_list = ['','角色A','角色B','角色C','角色D','角色E','角色F','角色G','角色H','角色I','角色J','角色K','角色L','角色M','角色N','角色O','角色P','角色Q','角色R','角色S','角色T'];
    const m_list = ['','地圖1','地圖2','地圖3','地圖4','地圖5','地圖6']
    $('img').click(function(){
        var selected_id = $(this).attr('id');
        if (selected_id.includes('_c')){
            var idx = selected_id.split("_c")[1];
            var v = c_list[idx];
            $('#characterToInput').html(v);
            $("#confirm_c").modal('hide');
        }
        else{
            var idx = selected_id.split("_m")[1];
            var v = m_list[idx];
            $('#mapToInput').html(v);
            $("#confirm_m").modal('hide');
        }

    });
});
