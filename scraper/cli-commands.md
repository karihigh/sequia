To convert all images to jpg. This command doesn't erase the *.png.

```
for file in *; do magick "$file" "$file.jpg" ; done
```

To crop all images as a 1000x1000 centered square:
```
for file in *; do magick "$file" -gravity Center -crop 1000x1000+0+0 "file"; done
```