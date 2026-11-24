import math
import random

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps

from .common import (
    BLUE, GOLD, GREEN, INK, LINE, ORANGE, PALE, PAPER, SIZE,
    arrow, cubic, dashed, dot, guide_box, load_image, node, text, thumbnail,
)

FILES = {
    "city": "simulator/background-sunset-city.png",
    "harbor": "lessons/raw-cang-tau-preview.webp",
    "hill": "lessons/before-color-raw.png",
    "portrait": "simulator/portrait-subject-studio.png",
    "product": "simulator/coldbrew-product-plate.png",
}
BOTTLE = [(175,28),(243,28),(243,52),(252,71),(271,82),(273,188),(262,202),(169,202),(164,193),(165,93),(174,78),(185,70),(189,53),(175,50)]
PORTRAIT = [(166,236),(170,196),(186,162),(192,130),(183,110),(183,86),(173,76),(184,57),
            (188,40),(206,21),(235,9),(279,10),(312,24),(329,50),(335,78),(322,105),
            (310,127),(311,142),(341,163),(361,195),(371,236)]
CROP_BOX=(146,30,294,210)


def source(asset):
    if asset in {"portrait","product"}:
        return load_image(FILES[asset]).resize(SIZE,Image.Resampling.LANCZOS)
    return thumbnail(FILES[asset])


def subject_points(asset):
    return BOTTLE if asset=="product" else PORTRAIT


def subject_mask(asset, radius=1):
    layer=Image.new("L",SIZE)
    ImageDraw.Draw(layer).polygon(subject_points(asset),fill=255)
    return layer.filter(ImageFilter.GaussianBlur(radius)) if radius else layer


def selection(image, asset, mode):
    draw=ImageDraw.Draw(image)
    points=subject_points(asset)
    if mode in {"rough","leak"}:
        points=([(148,23),(259,25),(292,89),(290,211),(141,215)] if asset=="product"
                else [(148,235),(168,57),(195,21),(243,3),(300,8),(346,51),(347,148),(393,236)])
        if mode=="leak":
            points=points[:4]+[(354,217)]+points[4:]
    if mode in {"matte","masked","invert","placed","overlay","hairBrush","maskBrush"}:
        mask=subject_mask(asset,2 if asset=="portrait" else 1)
        if mode=="matte":
            return mask.convert("RGB")
        if mode=="masked":
            background=Image.new("RGB",SIZE,"#ccd7ce")
            for y in range(0,236,15):
                for x in range(0,440,15):
                    if (x//15+y//15)%2==0:
                        ImageDraw.Draw(background).rectangle((x,y,x+14,y+14),fill="#f1f1e8")
            return Image.composite(image,background,mask)
        if mode=="invert":
            return Image.composite(image,Image.new("RGB",SIZE,PALE),ImageOps.invert(mask))
        if mode=="placed":
            return Image.composite(image,source("city").filter(ImageFilter.GaussianBlur(2)),mask)
        background=Image.blend(image,Image.new("RGB",SIZE,"#ad324e"),.55)
        image=Image.composite(image,background,mask)
        draw=ImageDraw.Draw(image)
        if mode in {"hairBrush","maskBrush"}:
            trail=[(309,37),(329,67),(325,100),(307,127)] if mode=="hairBrush" else [(328,50),(358,67),(365,123),(373,148)]
            draw.line(trail,fill="#edbe77",width=4)
            for pt in trail:
                x,y=pt
                draw.ellipse((x-10,y-10,x+10,y+10),outline=GOLD,width=2)
        return image
    if mode=="brush":
        trail=[(217,50),(217,85),(209,123),(217,174)]
        draw.line(trail,fill="#ffdb7f",width=9)
        for pt in trail:
            x,y=pt
            draw.ellipse((x-20,y-20,x+20,y+20),outline=PAPER,width=2)
    else:
        for a,b in zip(points,points[1:]+points[:1]):
            draw.line((a,b),fill=INK,width=3)
            dashed(draw,a,b,PAPER,2)
    return image


def retouch(image,asset,mode):
    draw=ImageDraw.Draw(image)
    x,y=(258,95) if asset=="portrait" else (324,156)
    if mode in {"spot","dustBrush","clone","blemish","objectMark","softPaint","detailClean"}:
        if mode=="objectMark":
            draw.ellipse((314,122,375,158),fill="#939296",outline=PAPER,width=2)
            guide_box(draw,(303,108,386,171),GOLD)
        elif mode=="softPaint":
            x,y=(217,119)
            draw.ellipse((x-23,y-19,x+23,y+19),outline=GOLD,width=2)
            arrow(draw,(112,139),(x-26,y+4),GOLD)
            return image
        elif mode=="detailClean":
            draw.ellipse((x-13,y-13,x+13,y+13),outline=GREEN,width=2)
        else:
            dot(draw,(x,y),6 if asset=="portrait" else 11,"#9e6556" if asset=="portrait" else "#a9a59a")
        if mode in {"dustBrush","clone"}:
            r=18
            draw.ellipse((x-r,y-r,x+r,y+r),outline=GOLD,width=3)
        if mode=="clone":
            origin=(305,106)
            dot(draw,origin,8,BLUE,PAPER)
            arrow(draw,origin,(x-10,y-7),GOLD)
    elif mode in {"clean","objectClean","healed"}:
        if mode=="objectClean":
            x,y=(340,140)
            guide_box(draw,(304,109,384,171),GOLD)
        else:
            draw.ellipse((x-14,y-14,x+14,y+14),outline=GOLD,width=2)
        arrow(draw,(x+47,y-27),(x+16,y-8),GOLD)
    else:
        raise ValueError(mode)
    return image


def frequency(image,mode):
    softened=image.filter(ImageFilter.GaussianBlur(9))
    detail=ImageChops.subtract(image,softened,scale=1,offset=128)
    if mode=="frequencies":
        panel=Image.new("RGB",SIZE,INK)
        head=(113,0,362,236)
        panel.paste(ImageOps.fit(softened.crop(head),(217,218)),(0,0))
        panel.paste(ImageOps.fit(detail.crop(head),(217,218)),(223,0))
        draw=ImageDraw.Draw(panel)
        text(draw,(108,226),"Sắc độ",13,PAPER,650,"mm")
        text(draw,(331,226),"Kết cấu",13,PAPER,650,"mm")
        return panel
    if mode in {"detail","detailClean"}:
        enlarged=ImageEnhance.Contrast(detail).enhance(1.4)
        return retouch(enlarged,"portrait",mode) if mode=="detailClean" else enlarged
    return retouch(softened,"portrait",mode) if mode=="softPaint" else softened


def geometry(image,mode):
    if mode in {"distort","keystone","fringe","defringe","straight"}:
        # A building outline provides a known straight edge for inspecting the correction.
        backdrop=Image.blend(image,Image.new("RGB",SIZE,"#183143"),.25)
        draw=ImageDraw.Draw(backdrop)
        straight=[(116,168),(116,46),(214,35),(214,168)]
        if mode=="distort":
            wall=cubic(straight[0],(78,133),(79,71),straight[1])+[straight[2]]+cubic(straight[2],(235,73),(236,132),straight[3])
        elif mode=="keystone":
            wall=[(100,168),(136,47),(204,37),(234,168)]
        else:
            wall=straight
        draw.polygon(wall,fill="#75939f",outline=PAPER,width=2)
        if mode=="fringe":
            draw.line([(110,169),(110,46),(213,31)],fill="#e596ed",width=4)
            draw.line([(122,168),(122,46),(214,39)],fill="#81e3be",width=3)
        for y in (72,103,134):
            draw.line((128,y,202,y),fill="#d5ead8",width=4)
        dashed(draw,(116,27),(116,189),GOLD)
        return backdrop

    if mode=="cropped":
        center=ImageOps.fit(image,(236,236))
        panel=Image.new("RGB",SIZE,INK)
        panel.paste(center,(102,0))
        return panel
    if mode=="tilt":
        image=image.rotate(-8,resample=Image.Resampling.BICUBIC,fillcolor=INK)
    draw=ImageDraw.Draw(image)
    if mode in {"tilt","straighten","vanish"}:
        guides = [(31,120),(406,120)]
        if mode=="tilt":
            guides=[(31,93),(406,145)]
        dashed(draw,*guides,GOLD,3)
        if mode=="vanish":
            for pt in [(88,224),(345,224),(21,223),(419,217)]:
                dashed(draw,pt,(247,123),PAPER)
            dot(draw,(247,123),7,GOLD)
        return image
    dark=Image.blend(image,Image.new("RGB",SIZE,INK),.60 if mode!="recover" else .25)
    dark.paste(image.crop(CROP_BOX),CROP_BOX[:2])
    draw=ImageDraw.Draw(dark)
    guide_box(draw,CROP_BOX,GOLD)
    if mode=="thirds":
        x1,y1,x2,y2=CROP_BOX
        for i in (1,2):
            y=y1+(y2-y1)*i/3; x=x1+(x2-x1)*i/3
            draw.line((x1,y,x2,y),fill=PAPER,width=2)
            draw.line((x,y1,x,y2),fill=PAPER,width=2)
    if mode=="recover":
        arrow(draw,(145,113),(62,113),GOLD)
        arrow(draw,(295,113),(375,113),GOLD)
    return dark


def harbor_lens(image, mode):
    width, height = image.size
    if mode == "distort":
        def displacement(row):
            return 27 * math.sin(math.pi * row / height)

        strips = []
        for y in range(0, height, 4):
            bottom = min(height, y + 4)
            left, lower_left = displacement(y), displacement(bottom)
            strips.append(((0, y, width, bottom), (
                left, y, lower_left, bottom, width - 2, bottom, width - 2, y,
            )))
        image = image.transform(image.size, Image.Transform.MESH, strips, Image.Resampling.BICUBIC)
    draw = ImageDraw.Draw(image)
    dashed(draw, (346, 16), (346, 215), GOLD, 3)
    return image


def color_shift(image,mode):
    tint_map={
        "corrected": (1.23,1.09,1.10),
        "castDark": (.78,.79,.89),
        "warm": (1.16,1.02,.72),
        "neutral": (1.01,1.01,1.10),
        "exposure": (1.26,1.26,1.26),
        "tone": (1.20,1.16,1.10),
        "proof": (.97,.94,.91),
        "grade": (1.13,1.03,1.17),
    }
    gain=tint_map[mode]
    output=Image.merge("RGB",tuple(ch.point([round(min(255,value*g)) for value in range(256)]) for ch,g in zip(image.split(),gain)))
    if mode=="tone":
        output=output.point([round(255*(i/255)**.86) for i in range(256)]*3)
    if mode=="proof":
        output=ImageEnhance.Color(output).enhance(.72)
    return output


def noisy(image, mode):
    rng=random.Random(91)
    strength=9 if mode in {"denoise","grainComposite"} else 23
    out=image.copy()
    original=image.load()
    target=out.load()
    for y in range(236):
        for x in range(440):
            base=rng.gauss(0,strength)
            offsets=[base,base,base] if mode!="noiseColor" else [rng.gauss(0,strength) for _ in range(3)]
            target[x,y]=tuple(round(max(0,min(255,v+n))) for v,n in zip(original[x,y],offsets))
    return out.filter(ImageFilter.MedianFilter(3)) if mode=="denoise" else out


def radial(image, mode):
    left=mode!="lightRight"
    cx=153 if mode in {"lightLeft","lightRight"} and left else 286 if mode=="lightRight" else 220
    cy=93 if mode.startswith("light") else 117
    mask=Image.new("L",SIZE)
    light=[]
    for y in range(236):
        for x in range(440):
            distance=math.hypot((x-cx)*.73,y-cy)
            value=min(1,distance/145)
            light.append(round(value*187 if mode=="vignette" else (1-value)*192))
    mask.putdata(light)
    if mode=="vignette":
        solid=Image.new("RGB",SIZE,"#131a18")
    else:
        solid=ImageEnhance.Brightness(image).enhance(1.65)
    result=Image.composite(solid,image,mask)
    if mode in {"lightLeft","lightRight"}:
        draw=ImageDraw.Draw(result)
        x=105 if left else 336
        dot(draw,(x,45),10,GOLD)
        arrow(draw,(x,60),(205 if left else 244,103),GOLD)
    return result


def sign(image, mode):
    product=mode=="warp"
    draw=ImageDraw.Draw(image)
    if mode=="signFlat":
        draw.rectangle((138,79,328,146),fill=GOLD,outline=PAPER,width=2)
        text(draw,(230,112),"TRÀ MÁT",23,GREEN,750,"mm")
    elif product:
        coords=cubic((178,111),(197,126),(237,126),(266,112))+cubic((266,149),(232,161),(199,163),(177,151))
        draw.polygon(coords,fill="#e7db9e",outline=GOLD)
        text(draw,(221,139),"TRÀ MÁT",14,GREEN,700,"mm")
    else:
        facade=[(109,80),(352,54),(352,170),(109,202)]
        draw.polygon(facade,fill="#526d74",outline="#afcad1",width=2)
        for i in (1,2,3):
            y=80+i*29
            draw.line((109,y,352,y-28),fill="#8dabb1",width=2)
        fit=[(151,107),(315,88),(315,136),(151,157)]
        if mode=="perspective":
            fit=[(137,81),(305,70),(327,137),(149,155)]
        draw.polygon(fit,fill="#afa288" if mode=="signBlend" else GOLD,outline=PAPER,width=2)
        text(draw,(222,115),"TRÀ MÁT",20,GREEN,700,"mm")
        for point in fit:
            if mode=="perspective":
                node(draw,point,True)
        if mode in {"perspective","signFit"}:
            dashed(draw,(109,113),(352,84),PAPER,2)
            dashed(draw,(109,164),(352,132),PAPER,2)
    return image


def composite(image,mode):
    if mode=="sun":
        draw=ImageDraw.Draw(image)
        dot(draw,(361,65),13,GOLD)
        arrow(draw,(348,73),(279,112),GOLD)
        return image
    if mode in {"contact","shadow","wrap","grainComposite"}:
        shadow=Image.new("RGBA",SIZE)
        draw=ImageDraw.Draw(shadow)
        draw.ellipse((223,162,280,178),fill=(13,18,29,190))
        if mode=="shadow":
            draw.polygon([(246,163),(268,174),(108,216),(94,207)],fill=(14,22,38,155))
        image=Image.alpha_composite(image.convert("RGBA"),shadow.filter(ImageFilter.GaussianBlur(4))).convert("RGB")
    bottle=source("product").crop((164,27,275,205))
    mask=subject_mask("product").crop((164,27,275,205))
    size=(128,203) if mode=="subjectLarge" else (52,84)
    xy=(192,20) if mode=="subjectLarge" else (224,83)
    cut=bottle.resize(size)
    if mode=="wrap":
        draw=ImageDraw.Draw(cut)
        draw.line((size[0]-8,10,size[0]-3,size[1]-15),fill=GOLD,width=7)
    image.paste(cut,xy,mask.resize(size))
    return noisy(image,"grainComposite") if mode=="grainComposite" else image


def promotion(image,mode):
    background=source("portrait")
    draw=ImageDraw.Draw(image)
    if mode=="textShadow":
        text(draw,(222,68),"CHẠM SÁNG",44,"#141f23",700,"mm")
    text(draw,(218,64),"CHẠM SÁNG",44,"#f4e6be",700,"mm")
    if mode!="title":
        mask=subject_mask("portrait",1.6)
        if mode=="textShadow":
            halo=mask.filter(ImageFilter.GaussianBlur(7)).point(lambda v: v*.4)
            image=Image.composite(Image.new("RGB",SIZE,INK),image,halo)
        image.paste(background,(0,0),mask)
    if mode=="campaign":
        draw.rectangle((24,26,103,51),fill=GOLD)
        text(draw,(63,38),"STUDIO",11,INK,700,"mm")
        draw.rounded_rectangle((23,181,179,213),radius=5,fill=GREEN)
        text(draw,(101,196),"Xem bộ ảnh",14,PAPER,700,"mm")
    return image


def photo(request):
    asset,mode=request.split("+")
    image=source(asset)
    if mode=="plain":
        return image
    if mode=="zoom":
        return image.crop((164,61,275,175)).resize(SIZE,Image.Resampling.LANCZOS)
    if mode in {"rough","leak","edge","overlay","matte","hairBrush","masked","maskBrush","invert","placed","brush"}:
        return selection(image,asset,mode)
    if mode in {"spot","dustBrush","clone","blemish","healed","objectMark","objectClean","clean"}:
        return retouch(image,asset,mode)
    if mode in {"frequencies","detail","detailClean","lowSoft","softPaint"}:
        return frequency(image,mode)
    if asset == "harbor" and mode in {"distort", "straight"}:
        return harbor_lens(image, mode)
    if mode in {"distort","straight","fringe","defringe","keystone","cropSquare","thirds","tilt","straighten","cropped","recover","vanish"}:
        return geometry(image,mode)
    if mode in {"castDark","corrected","warm","neutral","exposure","grade","tone","proof"}:
        return color_shift(image,mode)
    if mode in {"noise","noiseColor","noiseLuma","denoise"}:
        return noisy(image,mode)
    if mode in {"spotlight","lightLeft","lightRight","vignette"}:
        return radial(image,mode)
    if mode in {"signFlat","perspective","signFit","signBlend","warp"}:
        return sign(image,mode)
    if mode in {"sun","subject","subjectLarge","contact","shadow","wrap","grainComposite"}:
        return composite(image,mode)
    if mode in {"title","behind","textShadow","campaign"}:
        return promotion(image,mode)
    if mode in {"blur","focus","localBlur"}:
        blurred=image.filter(ImageFilter.GaussianBlur(7))
        if mode=="blur":
            return blurred
        if mode=="localBlur":
            return Image.composite(image,blurred,subject_mask("product",7))
        focus=Image.new("L",SIZE)
        ImageDraw.Draw(focus).ellipse((143,25,294,211),fill=255)
        return Image.composite(image,blurred,focus.filter(ImageFilter.GaussianBlur(18)))
    if mode in {"embossNeutral","emboss","highPass"}:
        if mode=="embossNeutral":
            return ImageEnhance.Color(image).enhance(.18)
        if mode=="emboss":
            return Image.blend(image,ImageOps.grayscale(image).filter(ImageFilter.EMBOSS).convert("RGB"),.64)
        return ImageChops.subtract(image,image.filter(ImageFilter.GaussianBlur(4)),scale=1,offset=128)
    if mode in {"paper","multiply","screen","sparkPlate"}:
        rng=random.Random(327)
        if mode in {"paper","multiply"}:
            paper=Image.new("RGB",SIZE,"#e0ceb0")
            draw=ImageDraw.Draw(paper)
            for _ in range(500):
                x,y=rng.randrange(440),rng.randrange(236)
                draw.line((x,y,x+3,y+2),fill="#998c72")
            return ImageChops.multiply(image,paper) if mode=="multiply" else paper
        light=Image.new("RGB",SIZE)
        draw=ImageDraw.Draw(light)
        for i in range(26):
            angle=i*math.tau/26
            end=(278+56*math.cos(angle),71+53*math.sin(angle))
            draw.line(((278,71),end),fill=(248,150+i*3,53),width=2)
        return ImageChops.screen(image,light) if mode=="screen" else light
    if mode=="sample":
        warmed=color_shift(image,"warm")
        draw=ImageDraw.Draw(warmed)
        arrow(draw,(122,80),(189,97),GOLD)
        guide_box(draw,(181,88,202,108),PAPER)
        return warmed
    if mode in {"foliage","recolor"}:
        x1,y1,x2,y2=(87,115,245,190)
        draw=ImageDraw.Draw(image)
        if mode=="foliage":
            guide_box(draw,(x1,y1,x2,y2),GOLD)
        else:
            for y in range(y1,y2):
                for x in range(x1,x2):
                    r,g,b=image.getpixel((x,y))
                    if g>r*.98 and y>115+(x-x1)*.12:
                        image.putpixel((x,y),(min(255,r+35),max(0,g-4),max(0,b-19)))
        return image
    raise ValueError(request)
