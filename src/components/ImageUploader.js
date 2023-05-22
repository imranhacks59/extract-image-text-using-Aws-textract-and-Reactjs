import React, { useState } from "react";
import { DetectDocumentTextCommand, TextractClient } from "@aws-sdk/client-textract";
import { Buffer } from "buffer";


window.Buffer = Buffer;

function ImageUploader() {
  const [src, setSrc] = useState("");
  const [data, setData] = useState([]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = function (upload) {
      setSrc(upload.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onRunOCR = async () => {
    const client = new TextractClient({
      region: "",
      credentials: {
        accessKeyId: "",
        secretAccessKey: "",
      },
    });

    // convert image to byte Uint8Array base 64
    const blob = Buffer.from(src.split(",")[1], "base64");

    const params = {
      Document: {
        Bytes: blob,
      },
      FeatureTypes: ["TABLES", "FORMS"],
    };

    const command = new DetectDocumentTextCommand(params);
    try {
      const response = await client.send(command);
      // process data
      if (response?.Blocks) {
        setData(response.Blocks);
      }
    } catch (error) {
      console.log("err", error);
      // error handling
    }
  };

  return (
    <div className="App">
      <div>
        <input
          id="file"
          type="file"
          name="file"
          onChange={onSelectFile}
        />
      </div>
      <div>
        <button onClick={onRunOCR} style={{ margin: "10px" }}>
          extract image
        </button>
        {console.log(data)}
        <div style={{ border: "1px" }}>
          {data?.map((item, index) => {
            
            return (
              <span key={index} style={{ margin: "2px", padding: "2px" }}>
                {item.Text}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;
