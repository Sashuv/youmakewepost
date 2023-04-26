import PIL
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw 
import os

a4 = {'width': 1754, 'height': 2480}
offset = {'left': 20, 'right': 50, 'top': 100, 'bottom': 100}
fonts_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'fonts')

def get_text_dimensions(text_string, font):
    # https://stackoverflow.com/a/46220683/9263761
    ascent, descent = font.getmetrics()
    text_width = font.getmask(text_string).getbbox()[2]
    text_height = font.getmask(text_string).getbbox()[3] + descent
    return (text_width, text_height)

def get_max_text(text_lines):
    max_line = 0;
    max_index = 0;
    for i, line in enumerate(text_lines):
        if len(line) > max_line:
            max_line = len(line)
            max_index = i
    return text_lines[max_index]

def search_font(text_line, full_text, font_face, width, height):
    font_size = 18
    font = ImageFont.truetype(
        os.path.join(fonts_path, font_face), font_size)

    while (get_text_dimensions(text_line, font)[0] < width - offset['left'] - offset['right'] and
        get_text_dimensions(full_text, font)[1] < height - offset['top'] - offset['bottom']):
        font = ImageFont.truetype(
            os.path.join(fonts_path, font_face), font_size)
        font_size += 1
    return font_size

def create_image(text_lines):
    img = Image.new('RGBA', (a4['width'], a4['height']))
    max_text = get_max_text(text_lines)
    full_text = "\n".join(text_lines)
    font_size = search_font(max_text, full_text, 'OpenSans-Light.ttf', 
        a4['width'], a4['height'])
    font = ImageFont.truetype(
        os.path.join(fonts_path, 'OpenSans-Light.ttf'), font_size)
    draw = ImageDraw.Draw(img)
    draw.text((offset['left'], offset['top']), text, (0, 0, 0), font=font)
    return img


def get_concat_h(im1, im2):
    im1_width, im1_height = im1.size
    im2_width, im2_height = im2.size
    dst = Image.new('RGBA', (im1_width + im2_width, im1_height))
    dst.paste(im1, (0, 0))
    dst.paste(im2, (im1_width, 0))
    return dst

def get_concat_v(im1, im2):
    im1_width, im1_height = im1.size
    im2_width, im2_height = img2.size
    dst = Image.new('RGBA', (im1_width, im1_height + im2_height))
    dst.paste(im1, (0, 0))
    dst.paste(im2, (0, im1_height))
    return dst


image_cardMessage = Image.open('/Users/sushantkafle/Dropbox/Stuffs/dashain-card/heroku-app/youmakewepost/client/images/VD-2022/back_card.png')
image_cardBack = Image.open('/Users/sushantkafle/Dropbox/Stuffs/dashain-card/heroku-app/youmakewepost/client/images/back_card_default.png')
image_cardFront = Image.open('/Users/sushantkafle/Dropbox/Stuffs/dashain-card/heroku-app/youmakewepost/client/images/VD-2022/front_card.png')
image_empty = Image.open('/Users/sushantkafle/Dropbox/Stuffs/dashain-card/heroku-app/youmakewepost/client/images/empty.png')

get_concat_h(image_cardBack, image_cardFront).save('/Users/sushantkafle/Dropbox/Stuffs/dashain-card/heroku-app/youmakewepost/client/images/VD-2022/print_front.png')
get_concat_h(image_empty, image_cardMessage).save('/Users/sushantkafle/Dropbox/Stuffs/dashain-card/heroku-app/youmakewepost/client/images/VD-2022/print_back.png')