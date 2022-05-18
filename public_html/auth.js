$(document).ready(function(){

	// $.ajax({
	// 	method: 'GET',
	// 	url: '/api/signed-in'
	// }).then(function(res){
	// 	console.log(res)
	// 	if(res.message === "signed in user"){
	// 		window.location.href = '/checklist'
	// 	}
	// }).fail(function(xhr, status, error) {
  // 	console.log(xhr)
  // });

	$('#post-form').on('submit', function(e){
		e.preventDefault();

		if($('#password-input').val() == $('#confirm-password-input').val()){
			var postObj = {
				username: $('#username-input').val(),
				password: $('#password-input').val()
			}

			$.ajax({
				method: 'POST',
				url: '/api/sign-up',
				dataType: 'json',
				data: JSON.stringify(postObj),
				contentType: 'application/json'
			}).then(function(res){
				if(!res.user){
					if(res.info.message === "username taken"){
						alert("Username has been taken. Please enter another one.")
					}
				} else {
					window.location.href = "/checklist"
				}
			});
		} else {
				alert("Passwords Do Not Match")
		}
	});

	$('#sign-in-form').on('submit', function(e){
		e.preventDefault();

		var signInObj = {
			username: $('#sign-in-username-input').val(),
			password: $('#sign-in-password-input').val()
		}

		$.ajax({
			method: 'POST',
			url: '/api/sign-in',
			dataType: 'json',
			data: JSON.stringify(signInObj),
			contentType: 'application/json'
		}).then(function(res){
			if(!res.success){
				if(res.info.message === "incorrect password"){
					alert("Incorrect Password for username")
				} else if (res.info.message === "no user"){
					alert("Username does not exist")
				}
			} else {
				window.location.href = '/checklist'
			}
		});
	});

	$('#reset-password-button').on('click', function(){
		$('#exampleModal').modal();
	});

	$('#reset-password-form').on('submit', function(e){
		e.preventDefault();

		if($('#reset-password-input').val() == $('#reset-confirm-password-input').val()){
			var postObj = {
				username: $('#reset-username-input').val(),
				password: $('#reset-password-input').val()
			}

			$.ajax({
				method: 'POST',
				url: '/api/reset-password',
				dataType: 'json',
				data: JSON.stringify(postObj),
				contentType: 'application/json'
			}).then(function(res){
				if(res.success){
					alert("Password Changed Successfully. Please Sign In with new password.")
					$('#exampleModal').modal('toggle');
				}
			});
		} else {
				$('#reset-password-input').val("")
				$('#reset-confirm-password-input').val("")
				alert("Passwords Do Not Match")
		}
	});

	$('#contact-me-button').on('click', function(){
		$('#contactModal').modal();
	});

	$('#contact-me-form').on('submit', function(e){
		e.preventDefault();

		if($('#contact-me-email-input').val() !== "" && $('#contact-me-message-input').val() !== ""){
			var postObj = {
				email: $('#contact-me-email-input').val(),
				message: $('#contact-me-message-input').val()
			}

			$.ajax({
				method: 'POST',
				url: '/api/contact',
				dataType: 'json',
				data: JSON.stringify(postObj),
				contentType: 'application/json'
			}).then(function(res){
				if(res.success){
					alert("Message Successfully Sent!")
					$('#contactModal').modal('toggle');
				} else {
	        console.log(res.error)
	      }
			});
		} else {
			alert("Email and Message Field Can Not Be Blank")
		}
	});

});
