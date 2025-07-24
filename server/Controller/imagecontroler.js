import User from "../Modals/UserModel.js";
import uploadimageCloudnary from "../utils/cloudinary.js";



const uploadImageController = async (req, res) => {
  try {

    const file = req.file;

    if (!file) {
      throw new Error("No file provided in the request.");
    }

    const uploadimg = await uploadimageCloudnary(file);

    const id = req.userId;

    console.log("Image uploaded successfully:", uploadimg.secure_url, "idddd", id);
    const user = await User.findByIdAndUpdate(id, { avatar: uploadimg.secure_url }, { new: true });

    res.json({
      message: "Image uploaded successfully",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error); // Add this
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


export default uploadImageController;