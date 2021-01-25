function saveImageData(img_data) {
	$("[name^='assets_']").remove();
	for (let i = 0; i < img_data.length; i++) {
		$("#information-form").append(
			createHiddenInputClass(img_data[i].id, "assets_id", `assets_id_${i}`));
		$("#information-form").append(
			createHiddenInputClass(img_data[i].x, "assets_x", `assets_x_${i}`));
		$("#information-form").append(
			createHiddenInputClass(img_data[i].y, "assets_y", `assets_y_${i}`));
		$("#information-form").append(
			createHiddenInputClass(img_data[i].w, "assets_w", `assets_w_${i}`));
		$("#information-form").append(
			createHiddenInputClass(img_data[i].h, "assets_h", `assets_h_${i}`));
		$("#information-form").append(
			createHiddenInputClass(img_data[i].scale, "assets_scale", `assets_scale_${i}`));
		$("#information-form").append(
			createHiddenInputClass(img_data[i].rotate, "assets_rotation", `assets_rotation_${i}`));
	}
	
}

function saveFontFace(fontFace) {
	$("#information-form").remove("#messageFont");
	$("#information-form").append(createHiddenInput(fontFace, "messageFont"));
}

function saveCanvasMessage(message, fontFace) {
	$("#information-form").remove("#canvasMessage");
	var canvasMessage = "";
	if (message.length > 0) {
		canvasMessage = message.join("<linebreak>");
	}
	$("#information-form").append(createHiddenInput(canvasMessage, "canvasMessage"));
	saveFontFace(fontFace);
}

function saveCanvasBackground(canvasBackground) {
	$("#information-form").remove("#canvasBackground");
	$("#information-form").append(createHiddenInput(canvasBackground, "canvasBackground"));
}

function createHiddenInputClass(value, name, class_name) {
	var input = $(`<input class='${class_name}' name='${name}' hidden></input>`);
	input.val(value);
	return input;
}


function createHiddenInput(value, id) {
	var input = $(`<input id='${id}' name='${id}' hidden></input>`);
	input.val(value);
	return input;
}