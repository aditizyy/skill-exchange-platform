const User = require("../models/User");

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-passworname email skillsToTeach skillsToLearn ");

        res.json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

const updateProfile = async (req, res) => {
    try {

        const {
            name,
            skillsToTeach,
            skillsToLearn
        } = req.body;

        const updates = {};

        if (name !== undefined) {
            updates.name = name;
        }

        if (skillsToTeach !== undefined) {
            updates.skillsToTeach = [...new Set(skillsToTeach)];
        }

        if (skillsToLearn !== undefined) {
            updates.skillsToLearn = [...new Set(skillsToLearn)];
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select("name email skillsToTeach skillsToLearn ");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user
        });

    } catch (error) {

        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

module.exports = {
    getProfile,
    updateProfile
};