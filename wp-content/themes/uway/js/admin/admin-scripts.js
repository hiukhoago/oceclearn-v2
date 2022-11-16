  ( function( $ ) {
  var admin = {
  	init: function() {
  	  admin.autoUpdateEndTime();
  	  admin.getTimeofPackage();
  	  admin.changePackage();
  	  admin.lockFields();
  	},
  	autoUpdateEndTime: function() {
  	  var startTime = $('input#acf-field_5d230f84b3dbd');
  	  $('.acf-time-picker').on('change', startTime, function(event) {
  	  	var time = event.target.value;
  	  	var packageTime = admin.getTimeofPackage();
  	  	admin.updateEndTime( time, packageTime );
  	  });
  	},
  	changePackage: function() {
  		$('.acf-field-taxonomy').on('change', 'select#acf-field_5d230f66b3dbb', function(event) {
  			var target = $(this);
  			var selectedID = target.val();
  			$.each(target.find('option'), function(index, val) {
  				var $val = $(val);
  				$val.removeAttr('selected');
  				if ($val.val() == selectedID) {
  					$val.attr('selected', 'selected');
  				}
  			});
  			var newPackageTime = admin.getTimeofPackage();
  			var newStartTime = $('.acf-time-picker input#acf-field_5d230f84b3dbd').val();
  			admin.updateEndTime( newStartTime, newPackageTime );
  		});
  	},
  	getTimeofPackage: function() {
  		var selectedTarget = 'select#acf-field_5d230f66b3dbb';
  		var packageID = $('.acf-field-taxonomy ' + selectedTarget).find(':selected').val();

  		var packageAttributes = $('.acf-field-5d230f66b3dbb').data('attributes');
  		var packageTime = null;
  		$.each(packageAttributes, function(index, val) {
  			if (packageID == val.id) {
  				packageTime = val.time;
  				return packageTime;
  			}
  		});

  		return packageTime;
  	},
  	updateEndTime: function( time, packageTime ) {
  		var newTime = admin.timeSUM( time, packageTime );
  	  	var endTime = $('.acf-time-picker input#acf-field_5d230f8eb3dbe');
  	  	endTime.val(newTime + ':00');
  	  	endTime.next().val(newTime);
  	},
  	timeSUM: function( start, end ) {
  		var timeExplode = start.split(':');
  		var hours = parseFloat( Math.floor(timeExplode[0] * 60) );
  		var minutes = parseFloat( timeExplode[1] );

  		// conver start
  		start = hours + minutes;

  		var endTime = parseFloat( end );
  		var totalTime = start + endTime;

  		var newHours = Math.floor(totalTime / 60);
  		var newMinutes = Math.floor( ( totalTime - (newHours * 3600) / 60 ) );

  		if (newMinutes < 10) {
  			newMinutes = '0' + newMinutes;
  		}

  		return newHours + ':' + newMinutes;
  	},
  	lockFields: function() {
  		$('.acf-time-picker input#acf-field_5d230f8eb3dbe').next().attr('disabled', true);
      $('.acf-taxonomy-field').children('.acf-actions.-hover').remove();
  	}
  };
  admin.init();
} )( jQuery );