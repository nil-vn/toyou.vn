	function sobtn_set_options(){
		jQuery('.bt-code').hide();
		if(jQuery('#sobtn_text').val() != '') {jQuery('#prev-container a').text(jQuery('#sobtn_text').val()); jQuery('.bt-code-btn').show()};
		if(jQuery('#sobtn_url').val() != '') {jQuery('#prev-container a').attr('href',jQuery('#sobtn_url').val()); jQuery('.bt-code-btn').show()};
	}
	
	jQuery(document).ready(function(){
		jQuery('.bt-code').hide();
		jQuery('.bt-code-btn').hide();
		jQuery('.social-b-box a').click(function(){
			jQuery('#prev-container').html('');
			jQuery('.social-b-box a').css('opacity','0.5')
			jQuery(this).css('opacity','1')
			jQuery('#prev-container').prepend(jQuery(this).clone());
			jQuery('#prev-container a').removeAttr('style');
		
			sobtn_set_options();
		})
		
		
		jQuery('.social-b-box a').mouseover(function(){
			if(jQuery(this).attr('data-value') == 'locked'){
				jQuery("#unlock-frame").css('top',jQuery(this).parent().position().top+"px")
				jQuery("#unlock-frame").css('left',jQuery(this).parent().position().left+"px")
			}
		});
		
		jQuery('#sobtn_text').keyup(function(){ sobtn_set_options(); jQuery(this).css('border','1px #e3e3e3 solid'); jQuery('.bt-code-btn').show(); })
		jQuery('#sobtn_url').keyup(function(){	sobtn_set_options(); jQuery(this).css('border','1px #e3e3e3 solid'); jQuery('.bt-code-btn').show(); })
		
		jQuery('.gt_code_btn').click(function(){
			if(jQuery('#sobtn_text').val() == '') {jQuery('#sobtn_text').css('border','1px #f00 solid'); return false;}
			if(jQuery('#sobtn_url').val() == '') {jQuery('#sobtn_url').css('border','1px #f00 solid'); return false; }
						
			jQuery('#sh_code').val("[social_button_wp class='"+jQuery('#prev-container a').attr('class')+"' text='"+jQuery('#sobtn_text').val()+"' href='"+jQuery('#sobtn_url').val()+"']")
			jQuery('#ht_code').val(jQuery('#prev-container').html());
			
			jQuery('.bt-code').show();
		})
		
	})
	