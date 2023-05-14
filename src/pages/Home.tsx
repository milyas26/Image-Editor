import React, { useRef, useEffect, useState } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { Box, Button, Grid } from "@mui/material";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";

export default function Home() {
  const { editor, onReady }: any = useFabricJSEditor();
  const fileInputRef = useRef(null);
  const [selectedText, setSelectedText] = useState<any>(null);
  const [fontSize, setFontSize] = useState(16);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [fontType, setFontType] = useState("Arial");

  const resizeImageToCanvas = (image: any, size: number) => {
    const canvasSize = size; // Ukuran canvas yang diinginkan
    const { width, height } = image;
    let newWidth, newHeight;

    if (width > height) {
      newWidth = canvasSize;
      newHeight = (height * canvasSize) / width;
    } else {
      newWidth = (width * canvasSize) / height;
      newHeight = canvasSize;
    }

    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;

    const context: any = canvas.getContext("2d");
    context.drawImage(image, 0, 0, newWidth, newHeight);

    return canvas.toDataURL(); // Mengembalikan gambar dalam format data URL
  };

  const onImageUpload = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const imgElement: any = document.createElement("img");

      imgElement.onload = () => {
        const resizedImageDataUrl = resizeImageToCanvas(imgElement, 1000);
        const backgroundImage = new window.fabric.Image(imgElement);

        backgroundImage.set({
          left: 0,
          top: 0,
          selectable: false, // Agar latar belakang tidak dapat dipilih
        });

        // Set source of backgroundImage to resized image data URL
        backgroundImage.setSrc(resizedImageDataUrl, () => {
          editor.canvas.setBackgroundImage(
            backgroundImage,
            editor.canvas.renderAll.bind(editor.canvas),
            {
              scaleX: editor.canvas.width / backgroundImage.width,
              scaleY: editor.canvas.height / backgroundImage.height,
            }
          );
        });
      };

      imgElement.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onAddText = () => {
    const text = new window.fabric.IText("Masukkan text!", {
      left: 50,
      top: 50,
    });

    text.on("selected", () => {
      setSelectedText(text);
    });

    editor.canvas.add(text);
    editor.canvas.renderAll();
  };

  const changeFontSize = (event: { target: { value: string } }) => {
    if (selectedText) {
      const { value } = event.target;
      const fontSizeValue = parseInt(value);
      selectedText.set("fontSize", fontSizeValue);
      editor.canvas.renderAll();
      setFontSize(fontSizeValue);
    }
  };

  const toggleBold = () => {
    if (selectedText) {
      const newBold = !bold;
      selectedText.set("fontWeight", newBold ? "bold" : "normal");
      editor.canvas.renderAll();
      setBold(newBold);
    }
  };

  const toggleItalic = () => {
    if (selectedText) {
      const newItalic = !italic;
      selectedText.set("fontStyle", newItalic ? "italic" : "normal");
      editor.canvas.renderAll();
      setItalic(newItalic);
    }
  };

  const changeFontType = (event: { target: { value: string } }) => {
    if (selectedText) {
      const { value } = event.target;
      selectedText.set("fontFamily", value);
      editor.canvas.renderAll();
      setFontType(value);
    }
  };

  const downloadImage = () => {
    const dataURL = editor.canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onImageSelect = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const imgElement: any = document.createElement("img");

      imgElement.onload = () => {
        const imageSize = 500; // Ukuran canvas yang diinginkan
        const { width, height } = imgElement;
        let newWidth, newHeight;

        if (width > height) {
          newWidth = imageSize;
          newHeight = (height * imageSize) / width;
        } else {
          newWidth = (width * imageSize) / height;
          newHeight = imageSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;

        const context: any = canvas.getContext("2d");
        context.drawImage(imgElement, 0, 0, newWidth, newHeight);

        const image = new window.fabric.Image(canvas, {
          left: 0,
          top: 0,
          selectable: true,
        });

        editor.canvas.add(image);
        editor.canvas.renderAll();
      };

      imgElement.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: { code: string }) => {
      if (event.code === "Delete") {
        const activeObject = editor.canvas.getActiveObject();
        if (activeObject) {
          editor.canvas.remove(activeObject);
          editor.canvas.renderAll();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  return (
    <div className="App p-8 text-center max-w-7xl mx-auto">
      <h1 className="text-4xl font-semibold mb-4 pb-4">
        FabricJs IMAGE EDITOR
      </h1>
      <Grid container>
        <Grid item md={8}>
          <FabricJSCanvas
            className="sample-canvas border-2 mx-auto"
            onReady={onReady}
          />
        </Grid>
        <Grid item md={4} className="pl-4">
          <Box className="text-left border p-4">
            <h1 className="text-2xl font-semibold mb-4 pb-4 border-b-2">
              Controls
            </h1>
            <div className="m-auto">
              <div className="background mb-4">
                <h3 className="text-lg font-medium mb-2">
                  Masukkan Gambar Background
                </h3>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={onImageUpload}
                />
              </div>
              <div className="image-controls mb-4">
                <h3 className="text-lg font-medium mb-2">Tambahkan Gambar</h3>
                <input type="file" accept="image/*" onChange={onImageSelect} />
              </div>
              <div className="text-editor mb-10">
                <h3 className="text-lg font-medium mb-2">Text Settings</h3>
                <div className="pb-2">
                  <Button
                    variant="outlined"
                    color="inherit"
                    className="uppercase"
                    fullWidth
                    startIcon={<TextIncreaseIcon />}
                    onClick={onAddText}
                  >
                    Tambah Text
                  </Button>
                </div>
                <Grid container className="mb-2">
                  <Grid item md={4}>
                    <label htmlFor="fontType" className="font-normal pr-2">
                      Font Type:
                    </label>
                  </Grid>
                  <Grid item md={8}>
                    <select
                      id="fontType"
                      className="border px-2 py-1 w-full"
                      value={fontType}
                      onChange={changeFontType}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </Grid>
                </Grid>
                <Grid container className="mb-2">
                  <Grid item md={4}>
                    <label htmlFor="fontSize" className="font-normal pr-2">
                      Font Size:
                    </label>
                  </Grid>
                  <Grid item md={8}>
                    <input
                      type="number"
                      id="fontSize"
                      className="border px-2 py-1 w-full"
                      value={fontSize}
                      onChange={changeFontSize}
                    />
                  </Grid>
                </Grid>
                <Grid container className="mb-2">
                  <Grid item md={4}>
                    <label htmlFor="fontStyle" className="font-normal pr-2">
                      Font Style:
                    </label>
                  </Grid>
                  <Grid item md={8}>
                    <Grid container>
                      <Grid item md={6} className="pr-1">
                        <Button
                          variant="outlined"
                          className="mr-2"
                          style={{ fontWeight: "bold" }}
                          color="inherit"
                          onClick={toggleBold}
                          fullWidth
                        >
                          Bold
                        </Button>
                      </Grid>
                      <Grid item md={6} className="pl-1">
                        <Button
                          variant="outlined"
                          className="mr-2"
                          style={{ fontStyle: "italic" }}
                          color="inherit"
                          onClick={toggleItalic}
                          fullWidth
                        >
                          Italic
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>

              <Button onClick={downloadImage} variant="contained" fullWidth>
                Download Gambar
              </Button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
