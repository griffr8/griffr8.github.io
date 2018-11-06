/**
 * gametimer.js
 * Game time main functionality
 */
"use strict";

(function ($) {

     $(document).ready( function(){
	
var TOTAL_S = 0;
var s = 0;
var m = 0;

var PAUSECOUNTER = 0;
var TIMER;
var TIMER_RUNNING = false;

var button_watch_start = $("#watch_start");
var button_watch_reload = $("#watch_reload");

var TOTAL_PLAYING_TIME = 0;

var STARTING_DATETIME = "";

var SAVE_DATA_OBJECT = {};

/*
NEXT PERIOD / RESET TIMER
*/
button_watch_reload.click( function(){
	// If timer is running, pause it
	if( TIMER_RUNNING == true ){
		pauseTimer();
	}

	var really = confirm("Reset clock and move on to next period?");

	if( really ){
		// ADD PERIOD LENGTH TO TOTAL_PLAYING_TIME
		//TOTAL_PLAYING_TIME += TOTAL_S; 

		TOTAL_S = 0;
		s = 0;
		m = 0;
		// Update main display
		updateMainDisplay();

		window.current_period++;
		$(".periodnum").text( window.current_period );
	}

})


/*
TOGGLE TIMER PLAY / PAUSE
*/
button_watch_start.click( function(){

	// CHECK PLAYER COUNT

	if( window.playercount <= 0){
		alert("First add players");
		return false;
	}

	if( STARTING_DATETIME == ""){
		STARTING_DATETIME = window.getDateTime();
		$(".stat_gamestarted").text( STARTING_DATETIME );
	}

	if( TIMER_RUNNING == false){
		startTimer();
	}else{
		pauseTimer();
	}
})


function resetTimer(){
	TOTAL_S = 0;
	s = 0;
	m = 0;
}


function startTimer(){
	TIMER_RUNNING = true;
	TIMER = workerTimer.setInterval(tick, 100);
	// SET BUTTON
	button_watch_start.removeClass("watch_button_mode_pause").addClass("watch_button_mode_playing");
	button_watch_start.find(".oi").removeClass("oi-media-play").addClass("oi-media-pause");
}

function pauseTimer(){
	PAUSECOUNTER++;
	TIMER_RUNNING = false;
	workerTimer.clearInterval(TIMER);
	// SET BUTTON
	button_watch_start.removeClass("watch_button_mode_playing").addClass("watch_button_mode_pause");
	button_watch_start.find(".oi").addClass("oi-media-play").removeClass("oi-media-pause");

	updateStatistics();
}

window.updateStatistics = function(){
	// NUM OF PAUSES
	$(".stat_pauses").text( PAUSECOUNTER );

	// MOST TIME ON ICE
	var lowest_time 	= 1000000000;
	var lowest_timestr = "";
	var lowest_id 		= "";

	var highest_time 	= 0;
	var highest_timestr = "";
	var highest_id 		= ""

	var $playerStatTable = $("#player_stat_table");
	var _players = [];

	$("#page_timer .playeritem").each( function(i,el){

		// CALCULATE HIGHEST / LOWEST
		var ttl = $(el).data().totaltime;
		var _playernumber = $(el).find(".playernumber").val();
		var _playertimest = $(el).find(".playertime").text();

		if( ttl < lowest_time ){
			lowest_time = Math.round(ttl);
			lowest_id = _playernumber
			lowest_timestr = _playertimest;
		}
		if( ttl > highest_time ){
			highest_time = Math.round(ttl);
			highest_id = _playernumber
			highest_timestr = _playertimest;
		}

		// UPDATE PLAYERS TABLE
		var pid = $(el).attr("playerid");
		$playerStatTable.find("tr[playerid='"+pid+"'] .stat_playertime").text($(el).find(".playertime").text() );

		_players.push( {"num":_playernumber, "toi":_playertimest});

	});

	$(".stat_mosttime").text( highest_timestr + " (#"+highest_id+")");
	$(".stat_leasttime").text( lowest_timestr + " (#"+lowest_id+")");

	SAVE_DATA_OBJECT["started"] = STARTING_DATETIME;
	SAVE_DATA_OBJECT["pausetimes"] = PAUSECOUNTER;
	SAVE_DATA_OBJECT["players"] = _players;

	$("#save_to_database").text("Save to database.");
	$("#save_to_database").removeClass("btn-success").addClass("btn-info");

}

$("#save_to_database").click( function(){
	saveToDatabase();
})

function saveToDatabase(){

	$.ajax({
		url:"savetoi.php",
		method:"POST",
		data: { toidata: JSON.stringify(SAVE_DATA_OBJECT) },
		success: function(res){
			//console.log(res);
			$("#save_to_database").addClass("btn-success").removeClass("btn-info");
			$("#save_to_database").text("Saved.");
		},
		error: function(res){
			//console.log("error");
		}
	})

}


function tick(){
	TOTAL_S += 0.1;
	TOTAL_PLAYING_TIME += 0.1;
	$("#page_timer .active").each( function(){
		$(this).data().totaltime += 0.1;
	});
	m = Math.floor( TOTAL_S / 60 );
	s = Math.round( TOTAL_S - m * 60 );

	updateMainDisplay();
	updateActivePlayers();
}



function updateActivePlayers(){

	$("#page_timer .active").each( function(){
		var $this = $(this);
		var time = $this.data().totaltime;
		var timem = Math.floor( time / 60 );
		var times = Math.round( time - timem * 60 );

		var display_s = times;
		var display_m = timem;

		if( display_s == 60){
			display_s = 0;
			display_m += 1;
		}

		$this.find(".playertime").text( formatTimer(display_m) + ":" + formatTimer(display_s) );
	});

}


function updateMainDisplay(){

	var display_s = s;
	var display_m = m;

	if( display_s == 60){
		display_s = 0;
		display_m += 1;
	}

	var timestr = formatTimer(display_m) + ":" + formatTimer(display_s);
	$(".time").html( timestr );



}

function formatTimer(a){
	if (a < 10) {
        a = '0' + a;
    }                              
    return a;
}


})


})(jQuery);