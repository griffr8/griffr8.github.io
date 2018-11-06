/**
 * peluuui.js
 * Application user interface functions
 */
"use strict";

(function($){

$(document).ready( function(){

var player_stat_table = $("#player_stat_table");
var MODAL_SHOWN = 0;

// TOOLBAR NAVIGATION
$("[ref]").click( function(){

	var $this = $(this);
	var $ref = $this.attr("ref");

	$(".toolbar-nav .col").removeClass("active");
	$('.toolbar-nav .col[ref="'+ $ref +'"]').addClass("active");

	$(".page").hide();
	$("#" + $ref).css("display","block");

	if( $ref == "page_timer" && MODAL_SHOWN == 0 && window.playercount > 0){
		$("#game_help").modal("show");
	}

})

// PLAYERS EDITING
$(document).on("focus", "#page_players .playernumber", function() { 
	this.select(); 
	this.setSelectionRange(0, this.value.length);
}).mouseup( function(e){
	e.preventDefault();
});



/*

P L A Y E R   M A N A G E M E N T 

*/

var playerindex = 10;
window.playercount = 0;
window.current_period = 1;

// ADD PLAYER CLICK EVENT
$(".addplayerbox").click( function(){
	addPlayerBox();
})

// ACTIVATE PLAYER
$(document).on("mouseup", "#page_timer .playeritem", function(e){
	$(this).toggleClass("active");
})

// ADD PLAYER BOX
function addPlayerBox(){

	// INCREMENT PLAYER INDEX
	playerindex++;
	playercount++;

	// CLONE
	var item_players 	= $("#template .colitem").clone();
	var item_timer		= $("#template .colitem").clone();

	item_timer.data("totaltime", 0);

	// LINK BOTH TOGETHER
	item_timer.attr("playerid", playerindex);
	item_players.attr("playerid", playerindex);

	// ADD CONTENT EDITABLE FOR SETTINGS PLAYER
	//item_timer.find(".playernumber").attr("disabled","true");
	// PREPEND SETTINGS
	$("#page_players .players .playerrow").append( item_players );

	// PREPEND TIMER
	$("#page_timer .players .row").append( item_timer );
 

	// ADD PLAYER TO STAT ALSO
	var new_stat_row = $('<tr playerid="' + playerindex + '"><td><span class="playernumber">#88</span></td><td><span class="stat_playertime">00:00</span></td></tr>');
	player_stat_table.append( new_stat_row );

	$("#page_timer .notification").hide();
}

// PLAYERBOX BLURRING EVENT
$(document).on("blur", ".playernumber", function(){
	// UPDATE TO TIMER
	
	// Player ID (hidden)
	var num = $(this).closest(".colitem").attr("playerid");
	var val = $(this).val();

	// IF VAL == "" remove the player
	if( val == ""){
		$('#page_timer .colitem[playerid="'+num+'"]').remove();
		// Update stat table
		player_stat_table.find('tr[playerid="'+num+'"]').remove();
		$(this).closest(".colitem").remove();
	}else{
		// Update timer player
		$('#page_timer .colitem[playerid="'+num+'"]').find(".playernumber").val( val );
		// Update stat table
		player_stat_table.find('tr[playerid="'+num+'"] .playernumber').text("#" + val );
	}

	sortByPlayerNumber();
	window.updateStatistics();
})

// SORT PLAYERBOXES BASED ON NUMBER
function sortByPlayerNumber(){
//
	// SORT SETTINGS
//	var items = $("#page_players .players .playerrow .colitem");
//	items.sort( function(a,b){
//		return $(a).find(".playernumber").val() - $(b).find(".playernumber").val();
//	})
//
//	$.each( items, function(idx, itm){
//		$("#page_players .players .playerrow").append( itm );
//	})
//
//	// SORT TIMER
//	var items = $("#page_timer .players .row .colitem");
//	items.sort( function(a,b){
//		return $(a).find(".playernumber").val() - $(b).find(".playernumber").val();
//	})
//
//	$.each( items, function(idx, itm){
//		$("#page_timer .players .row").append( itm );
//	})

}




// SAVE TO DATABASE
$("#save_to_database").click( function(){

	

});





window.getDateTime = function() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
}





}) // document ready


})(jQuery);