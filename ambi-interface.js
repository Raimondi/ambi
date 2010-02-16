	$j=jQuery.noConflict();
	$j(document).ready(function() {
		$j('#clearvars').hide();
		$j('#result').focus(
			function(){res = ambieval($j('#source').val()); $j('#result').text(res[0]); $j('#vars').html(res[1]);
						if (res[1]) {
							$j('#clearvars').show();
						} else {
							$j('#clearvars').hide();
						}
				}
		);

		$j('#source').focus().select();
		$j('code.ambi').attr('title','Click to load this code.');
		$j('code.ambi').click(
			function(){
				//$j('#source').text($j(this).text());
				document.runform.source.value = $j(this).text()
				$j('#source').focus().select(); 
				//$j('#result').focus().select();
			}
		);
		$j('#clearvars').click(
			function(){
				$j('#vars').html('');
				Vars = new Array();
				$j('#clearvars').hide();
				return false;
			}
		);
	});
