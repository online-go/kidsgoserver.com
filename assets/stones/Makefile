SVG=$(wildcard */*.svg)
PNG=$(SVG:.svg=.png)


convert: $(PNG)

%.png: %.svg
	ksvgtopng 128 128 $< $@

