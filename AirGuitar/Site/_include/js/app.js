function appController($scope){

	$scope.pedals = [
		{id: 1, name: 'Distortion'},
		{id: 2, name: 'Overdrive'},
		{id: 3, name: 'Delay'},
		{id: 4, name: 'Flanger'},
		{id: 5, name: 'Wah'},
		{id: 6, name: 'Fuzz'},
		{id: 7, name: 'Phaser'},
		{id: 8, name: 'Chorus'},
		{id: 9, name: 'Flanger'},
		{id: 10, name: 'Compressor'},
		{id: 11, name: 'EQ'},
		{id: 12, name: 'Noise Gate'},
		{id: 13, name: 'Boost'},
		{id: 14, name: 'Reverb'},
		{id: 15, name: 'Pitch Shifter'}
	];
	$scope.userPedals = [];
	$scope.name = 1;
	$scope.maxPedals = 3;

	$scope.addPedal = function(pedal){
		if($scope.userPedals.length < 3){
			$scope.userPedals.push({
				name: pedal.name
			});
		}else{
			console.log("pedal was NOT added...");
			$('.alert').fadeIn('slow');
		}
	};

	$scope.removePedal = function(pedal){
		var index = $scope.userPedals.indexOf(pedal);
  		$scope.userPedals.splice(index, 1);   
	}

	$('.close').click(function(){
        $('.alert').fadeOut('slow');
    });
}