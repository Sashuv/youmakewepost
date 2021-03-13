
class CanvasUtils {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		this.data = [];
		this.sel_data = -1;

		this.background = null;
		this.backgroundColor = "rgb(255, 255, 255)";
		this.canvas_offset = null;
	}

	setBackgroundColor(color) {
		this.backgroundColor = color;
		this.updateCanvas();
	}

	deleteSelectedData() {
		if (this.sel_data < 0 || this.data[this.sel_data].bg == true) return;
		this.data.splice(this.sel_data, 1);
		this.sel_data = -1;
		this.updateCanvas();
	}

	setBackgroundImage(image_path, offset) {
		let img = new Image;
		var self = this;
		img.onload  = function () {
			self.ctx.drawImage(img, 0, 0, self.canvas.width, self.canvas.height);
			self.data.push({
				'content': image_path,
				'type': 'img',
				'img': img,
				'x': 0,
				'y': 0,
				'w': self.canvas.width,
				'h': self.canvas.height,
				'scale': 1,
				'rotate': 0,
				'bg': true
			});
			self.updateCanvas();
		}
		img.src = image_path;
		this.offset = offset;
	}

	rotateImage(left) {
		if (this.sel_data < 0 || this.data[this.sel_data].type != 'img' || 
			this.data[this.sel_data].bg == true) return;
		let delta = 30;
		if (left) {
			delta = -30;
		}

		this.data[this.sel_data].rotate += delta;
		this.updateCanvas();
	}

	scaleImage(incr) {
		if (this.sel_data < 0 ||
			this.data[this.sel_data].bg == true) return;

		if (this.data[this.sel_data].type == 'img') {
			let delta = -0.01;
			if (incr) {
				delta = 0.01;
			}
			this.data[this.sel_data].scale += delta;
		} else {
			let delta = -1;
			if (incr) delta = 1;

			let sel_data = this.data[this.sel_data]
			sel_data.fontSize += delta;

			this.ctx.font = `${sel_data.fontSize}px ${sel_data.font}`;
			let textWidth = this.ctx.measureText(sel_data.content).width;
			let textHeight = this.ctx.measureText('M').width;

			sel_data.w = textWidth;
			sel_data.h = textHeight;
		}
		this.updateCanvas();
	}

	updateCanvas(fill=true) {
		if (fill) {
			this.ctx.fillStyle = this.backgroundColor;
			this.ctx.fillRect(this.offset.x, this.offset.y, 
				this.offset.w, this.offset.h);
		}

		let bg_id = -1;
		for (let i = 0; i < this.data.length; i++) {
			// Draw the selected data later.
			if (this.sel_data == i) {
				continue;
			}

			// Keep track of the background, so we can draw
			// it later on.
			if (this.data[i].bg == true) {
				bg_id = i;
				continue;
			}

			if (this.data[i].type == 'img') {
				let image = this.data[i];
				this.ctx.translate(image.x + (image.w * image.scale) / 2, 
					image.y + (image.h * image.scale) / 2);
				this.ctx.rotate(image.rotate * Math.PI / 180);
				this.ctx.translate(-image.x - (image.w * image.scale) / 2, 
					-image.y - (image.h * image.scale) / 2);

				this.ctx.drawImage(image.img, image.x, image.y, 
					image.w * image.scale, image.h * image.scale);

				this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				let text = this.data[i];
				this.ctx.font = `${text.fontWeight} ${text.fontStyle} ${text.fontSize}px ${text.font}`;
				this.ctx.fillStyle = text.color;
				this.ctx.fillText(text.content, text.x, text.y);
			}
		}

		if (bg_id != -1) {
			this.ctx.drawImage(this.data[bg_id].img, this.data[bg_id].x, 
				this.data[bg_id].y, this.data[bg_id].w, this.data[bg_id].h);
		}

		if (this.sel_data >= 0) {
			if (this.data[this.sel_data].type == 'img') {
				let image = this.data[this.sel_data];
				this.ctx.translate(image.x + (image.w * image.scale) / 2, 
					image.y + (image.h * image.scale) / 2);
				this.ctx.rotate(image.rotate * Math.PI / 180);
				this.ctx.translate(-image.x - (image.w * image.scale) / 2, 
					-image.y - (image.h * image.scale) / 2);
				this.ctx.drawImage(image.img, image.x, image.y, 
					image.w * image.scale, image.h * image.scale);
				this.ctx.strokeStyle="rgba(0, 0, 0, 0.8)";
				this.ctx.strokeRect(image.x, image.y, 
					image.w * image.scale, image.h * image.scale);
				this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			} else {
				let text = this.data[this.sel_data];
				this.ctx.font = `${text.fontWeight} ${text.fontStyle} ${text.fontSize}px ${text.font}`;
				this.ctx.fillStyle = text.color;
				this.ctx.fillText(text.content, text.x, text.y);

				this.ctx.strokeStyle="rgba(0, 0, 0, 0.8)";
				this.ctx.strokeRect(text.x - 5, text.y - text.h - 5, 
					text.w + 10, text.h + 10);
			}
		}
	}

	writeCords(x, y) {
		let r = this.canvas.getBoundingClientRect();
		x = parseInt(x - r.left); 
		y = parseInt(y - r.top);

		let textWidth = this.ctx.measureText(`x: ${x}, y: ${y}`).width;
		this.ctx.strokeStyle = "rgba(120, 120, 120, 0.3)";
		this.ctx.strokeRect(0, 380, textWidth + 10, 20);

		this.ctx.font = "10px Arial";
		this.ctx.fillStyle = "black";
		this.ctx.fillText(`x: ${x}, y: ${y}`, 5, 395);
	}

	addImage(image_path) {
		return new Promise((resolve, reject) => {
			let img = new Image;
			img.onload  = () => resolve(img);
			img.setAttribute('crossorigin', 'anonymous');
			img.onerror = reject;
			img.src = image_path;
		});
	}

	async drawImage(image_path, scale) {
		var self = this;
		let img = await this.addImage(image_path);
		//self.ctx.drawImage(img, self.offset.x, self.offset.y, 
		// 	img.width * scale, img.height * scale);
		self.data.push({
			'content': image_path,
			'img': img,
			'type': 'img',
			'x': self.offset.x,
			'y': self.offset.y,
			'w': img.width,
			'h': img.height,
			'scale': scale,
			'rotate': 0,
			'bg': false
		});
		self.sel_data = self.data.length - 1;
		self.updateCanvas();
	}

	async drawImageWithData(image_path, x, y, w, h, scale, rotation) {
		var self = this;
		let img = await this.addImage(image_path);
		self.ctx.drawImage(img, x, y, w * scale, h * scale); 
		self.data.push({
			'content': image_path,
			'type': 'img',
			'img': img,
			'x': x,
			'y': y,
			'w': w,
			'h': h,
			'scale': scale,
			'rotate': rotation,
			'bg': false
		});
		this.sel_data = -1;
	}

	drawTextDefault(text, font, fontSize, fontColor, fontStyle='normal',
		fontWeight='200') {
		this.drawText(text, font, fontSize, fontColor, fontStyle, fontWeight,
			this.offset.x + (this.offset.w/2), 
			this.offset.y + (this.offset.h/2));
	}

	drawText(text, font, fontSize, fontColor, fontStyle, fontWeight, x, y) {
		this.ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${font}`;
		let textWidth = this.ctx.measureText(text).width;
		let textHeight = this.ctx.measureText('M').width;

		this.data.push({
			'content': text,
			'type': 'txt',
			'fontSize': parseInt(fontSize),
			'fontStyle': fontStyle,
			'fontWeight': fontWeight,
			'font': font,
			'color': fontColor,
			'x': x,
			'y': y,
			'w': textWidth,
			'h': textHeight,
			'bg': false
		});
		this.sel_data = this.data.length - 1;
		this.updateCanvas();
	}

	drawFixedText(text, textProp, fit_text=true) {
		this.ctx.fillStyle = this.backgroundColor;
		this.ctx.fillRect(this.offset.x, this.offset.y, 
			this.offset.w, this.offset.h);	

		this.ctx.strokeStyle = textProp.fontColor;
		this.ctx.font = `${textProp.fontWeight} ${textProp.fontStyle} ${textProp.fontSize}px ${textProp.font}`;
		let offset = Object.create(this.offset);
		let lineWidth = 1.5 * textProp.fontSize ;

		offset.x += (offset.w * 0.06);
		offset.y += (offset.h * 0.15);
		if (fit_text) {
			this.lines = this.fitText(text, textProp, offset);
		} else {
			this.lines = text.split("<linebreak>");
			this.ctx.fillStyle = textProp.fontColor;
			for (let i = 0; i < this.lines.length; i++) {
				this.drawText(this.lines[i], textProp.font, textProp.fontSize, 
					textProp.fontColor, textProp.fontStyle, textProp.fontWeight, offset.x, offset.y + (i * lineWidth));
			}
			this.sel_data = -1;
		}
	}

	moveData(idx, x, y) {
		if (this.sel_data < 0 || this.data[this.sel_data].bg == true) return;
		let r = this.canvas.getBoundingClientRect();
		x = x - r.left; 
		y = y - r.top;
		
		if (this.data[idx].type == 'img') {
			let scale = this.data[idx].scale;
			let w = this.data[idx].w * scale;
			let h = this.data[idx].h * scale;
			this.data[idx].x = x - (w / 2);
			this.data[idx].y = y - (h / 2);
		} else {
			let w = this.data[idx].w;
			let h = this.data[idx].h;
			this.data[idx].x = x - (w / 2);
			this.data[idx].y = y + (h / 2);
		}
	}

	selectData(x, y) {
		let r = this.canvas.getBoundingClientRect();
		x = x - r.left; 
		y = y - r.top;

		for (let i = this.data.length - 1; i >=0; i--) {
			if (this.data[i].bg == true) continue;
			if (this.data[i].type == 'img') {
				let image = this.data[i];
				if (x > image.x && x < (image.x + image.w * this.data[i].scale) &&
					y > image.y && y < (image.y + image.h * this.data[i].scale)) {
					return i;
				}
			} else {
				let text = this.data[i];
				if (x > (text.x - 5) && x < (text.x + text.w + 10) &&
					y < (text.y + 5) && y > (text.y - text.h - 10)) {
					return i;
				}

			}
		}
		return -1;
	}

	fitText(myText, textProp, offset) {
		let lineText = '';
		let numLine = 0;
		let lineWidth = 1.5 * textProp.fontSize;
		let lines = [];
		
		this.ctx.fillStyle = textProp.fontColor;
		for (let i = 0; i < myText.length; i++) {
			if (myText[i] == '\n') {
				this.ctx.fillText(lineText, offset.x, 
					offset.y + (numLine * lineWidth));
				lines.push(lineText);
				numLine++;
				lineText = '';
				continue;
			}

			// With buffer
			let textSize = this.ctx.measureText(lineText + myText[i]).width + 30;
			if (textSize < offset.w) {
				lineText += myText[i];
			} else {
				if (myText[i] == ' ') {
					lines.push(lineText);
					this.ctx.fillText(lineText, offset.x, 
						offset.y + (numLine * lineWidth));
					lineText = '';
				} else {
					let dash = (myText[i - 1] == ' ') ? '' :  '-'; 
					lines.push(lineText + dash);
					this.ctx.fillText(lineText + dash, offset.x, 
						offset.y + (numLine * lineWidth));
					lineText = myText[i];
				}
				numLine++;
			}
		}

		if (lineText.length > 0) {
			lines.push(lineText);
			this.ctx.fillText(lineText, offset.x, 
				offset.y + (numLine * lineWidth));
		}

		return lines;
	}
}