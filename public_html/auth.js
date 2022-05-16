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

});
