import userModel from "../model/userModel.js";

// Controller to fetch all user data
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await userModel.find();

    // If no users found, return appropriate response
    if (!users || users.length === 0) {
      return res.json({ success: false, message: "No users found" });
    }

    // Respond with the list of users
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    // Handle errors and send the response
    res.json({ success: false, message: error.message });
  }
};
