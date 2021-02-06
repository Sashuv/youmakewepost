
class CanvasUtils {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		this.images = [];
		this.sel_image = -1;

		this.background = null;
		this.offset = null;
		this.backgroundColor = "rgb(255, 255, 255)";

		this.lines = [];

		this.imageURL = "";
	}

	setBackgroundColor(color) {
		this.backgroundColor = color;
		this.updateCanvas();
	}

	deleteSelectedImage() {
		if (this.sel_image < 0 || this.images[this.sel_image].bg == true) return;
		this.images.splice(this.sel_image, 1);
		this.sel_image = -1;
		this.updateCanvas();
	}

	setBackgroundImage(image_path, offset) {
		let img = new Image;
		var self = this;
		img.onload  = function () {
			self.ctx.drawImage(img, 0, 0, self.canvas.width, self.canvas.height);
			self.images.push({
				'id': image_path,
				'img': img,
				'x': 0,
				'y': 0,
				'w': self.canvas.width,
				'h': self.canvas.height,
				'scale': 1,
				'rotate': 0,
				'bg': true
			});
			self.updateCanvas(false);
		}
		img.src = image_path;
		this.offset = offset;
	}

	rotateImage(left) {
		if (this.sel_image < 0 || this.images[this.sel_image].bg == true) return;
		let delta = 30;
		if (left) {
			delta = -30;
		}

		this.images[this.sel_image].rotate += delta;
		this.updateCanvas();
	}

	scaleImage(incr) {
		if (this.sel_image < 0 || this.images[this.sel_image].bg == true) return;
		let delta = -0.01;
		if (incr) {
			delta = 0.01;
		}
		this.images[this.sel_image].scale += delta;
		this.updateCanvas();
	}

	updateCanvas(fill=true) {
		if (fill) {
			this.ctx.fillStyle = this.backgroundColor;
			this.ctx.fillRect(this.offset.x, this.offset.y, 
				this.offset.w, this.offset.h);
		}

		let bg_id = -1;
		for (let i = 0; i < this.images.length; i++) {
			if (this.sel_image == i) {
				continue;
			}

			if (this.images[i].bg == true) {
				bg_id = i;
				continue;
			}

			let image = this.images[i];
			this.ctx.translate(image.x + (image.w * image.scale) / 2, 
				image.y + (image.h * image.scale) / 2);
			this.ctx.rotate(image.rotate * Math.PI / 180);
			this.ctx.translate(-image.x - (image.w * image.scale) / 2, 
				-image.y - (image.h * image.scale) / 2);

			this.ctx.drawImage(image.img, image.x, image.y, 
				image.w * image.scale, image.h * image.scale);

			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		}

		if (bg_id != -1) {
			this.ctx.drawImage(this.images[bg_id].img, this.images[bg_id].x, 
				this.images[bg_id].y, this.images[bg_id].w, this.images[bg_id].h);
		}

		if (this.sel_image >= 0) {
			let image = this.images[this.sel_image];
			this.ctx.translate(image.x + (image.w * image.scale) / 2, 
				image.y + (image.h * image.scale) / 2);
			this.ctx.rotate(image.rotate * Math.PI / 180);
			this.ctx.translate(-image.x - (image.w * image.scale) / 2, 
				-image.y - (image.h * image.scale) / 2);

			this.ctx.drawImage(image.img, image.x, image.y, 
				image.w * image.scale, image.h * image.scale);
			this.ctx.strokeStyle="rgba(120, 120, 120, 0.8)";
			this.ctx.strokeRect(image.x, image.y, 
				image.w * image.scale, image.h * image.scale);
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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

	drawImage(image_path, scale) {
		let img = new Image;
		var self = this;
		img.onload  = function () {
			self.ctx.drawImage(img, self.offset.x, self.offset.y, 
				this.width * scale, this.height * scale);
			self.images.push({
				'id': image_path,
				'img': img,
				'x': self.offset.x,
				'y': self.offset.y,
				'w': this.width,
				'h': this.height,
				'scale': scale,
				'rotate': 0,
				'bg': false
			});
			self.sel_image = self.images.length - 1;
			self.updateCanvas();

		}
		img.src = image_path;
	}

	drawImageWithData(image_path, x, y, w, h, scale, rotation) {
		let img = new Image;
		var self = this;
		img.onload  = function () {
			self.ctx.drawImage(img, x, y, w * scale, h * scale); 
			self.images.push({
				'id': image_path,
				'img': img,
				'x': x,
				'y': y,
				'w': w,
				'h': h,
				'scale': scale,
				'rotate': rotation,
				'bg': false
			});
		}
		img.src = image_path;
		this.sel_image = -1;
	}

	moveImage(idx, x, y) {
		if (this.sel_image < 0 || this.images[this.sel_image].bg == true) return;
		let r = this.canvas.getBoundingClientRect();
		x = x - r.left; 
		y = y - r.top;
		let scale = this.images[idx].scale;
		let w = this.images[idx].w * scale;
		let h = this.images[idx].h * scale;
		this.images[idx].x = x - (w / 2);
		this.images[idx].y = y - (h / 2);
	}

	selectImage(x, y) {
		let r = this.canvas.getBoundingClientRect();
		x = x - r.left; 
		y = y - r.top;
		for (let i = this.images.length - 1; i >=0; i--) {
			if (this.images[i].bg == true) continue;
			let image = this.images[i];
			if (x > image.x && x < (image.x + image.w * image.scale) &&
				y > image.y && y < (image.y + image.h * image.scale)) {
				return i;
			}
		}
		return -1;
	}

	drawText(myText, textProp, fit_text=true) {
		this.ctx.fillStyle = this.backgroundColor;
		this.ctx.fillRect(this.offset.x, this.offset.y, 
			this.offset.w, this.offset.h);	

		this.ctx.font = `${textProp.fontSize}px ${textProp.font}`;
		let offset = Object.create(this.offset);
		let lineWidth = textProp.fontSize;

		offset.x += 10;
		offset.y += textProp.fontSize + 20;
		if (fit_text) {
			this.lines = this.fitText(myText, textProp, offset);
		} else {
			this.lines = myText.split("<linebreak>");

			this.ctx.fillStyle = "black";
			for (let i = 0; i < this.lines.length; i++) {
				this.ctx.fillText(this.lines[i], offset.x, 
					offset.y + (i * lineWidth));
			}
		}
		
	}

	fitText(myText, textProp, offset) {
		let lineText = '';
		let numLine = 0;
		let lineWidth = textProp.fontSize;
		let lines = [];
		
		this.ctx.fillStyle = "black";
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