function saveImageData(canvasData) {
	$("[name^='assets_']").remove();

	for (let i = 0; i < canvasData.length; i++) {
		if (canvasData[i].bg == true) continue;

		$("#information-form").append(
			createHiddenInputClass(canvasData[i].content, "assets_id", 
				`assets_id_${i}`));
		$("#information-form").append(
			createHiddenInputClass(canvasData[i].type, "assets_type", 
				`assets_type_${i}`));
		$("#information-form").append(
			createHiddenInputClass(canvasData[i].x, "assets_x", 
				`assets_x_${i}`));
		$("#information-form").append(
			createHiddenInputClass(canvasData[i].y, "assets_y", 
				`assets_y_${i}`));
		$("#information-form").append(
			createHiddenInputClass(canvasData[i].w, "assets_w", 
				`assets_w_${i}`));
		$("#information-form").append(
			createHiddenInputClass(canvasData[i].h, "assets_h", 
				`assets_h_${i}`));

		let scale = 1;
		let rotation = 0;
		let font = "";
		let fontSize = 20;
		let color = "Black";
		let fontWeight = "";
		let fontStyle = "";
		if (canvasData[i].type == 'img') {
			scale = canvasData[i].scale;
			rotation = canvasData[i].rotate;	
		} else {
			font = canvasData[i].font;
			fontSize = canvasData[i].fontSize;
			fontStyle = canvasData[i].fontStyle;
			fontWeight = canvasData[i].fontWeight;
			color = canvasData[i].color;
		}

		$("#information-form").append(createHiddenInputClass(scale, "assets_scale", 
			`assets_scale_${i}`));
		$("#information-form").append(createHiddenInputClass(rotation, "assets_rotation", 
			`assets_rotation_${i}`));
		$("#information-form").append(createHiddenInputClass(font, "assets_font", 
			`assets_font_${i}`));
		$("#information-form").append(createHiddenInputClass(fontSize, "assets_fontSize", 
			`assets_fontSize_${i}`));
		$("#information-form").append(createHiddenInputClass(fontWeight, "assets_fontWeight", 
			`assets_fontWeight_${i}`));
		$("#information-form").append(createHiddenInputClass(fontStyle, "assets_fontStyle", 
			`assets_fontStyle_${i}`));
		$("#information-form").append(createHiddenInputClass(color, "assets_color", 
			`assets_color_${i}`));
	}
}

function saveFontFace(fontFace) {
	$("#information-form #messageFont").remove();
	$("#information-form").append(createHiddenInput(fontFace, "canvasMessageFont"));
}

function saveCanvasMessage(message) {
	$("#information-form #canvasMessage").remove();
	var canvasMessage = "";
	if (typeof(message) != "undefined" && message.length > 0) {
		canvasMessage = message.join("<linebreak>");
	}
	$("#information-form").append(createHiddenInput(canvasMessage, "canvasMessage"));
}

function saveCanvasBackground(canvasBackground) {
	$("#information-form #canvasBackground").remove();
	$("#information-form").append(createHiddenInput(canvasBackground, "canvasBackground"));
}

function saveCanvasData(canvasDataToURL) {
	$("#information-form #canvasDataToURL").remove();
	$("#information-form").append(createHiddenInput(canvasDataToURL, "canvasDataToURL"));
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