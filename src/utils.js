import axios from "axios";

export const fetchImage = async (src) => {
  const image = await axios.get(src, {
    responseType: "arraybuffer",
  });
  return image.data;
};
