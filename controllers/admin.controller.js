const db = require("../models");

const User = db.User;
const Vendor = db.Vendor;

const HttpStatus = require("../enums/httpStatusCode.enum");

const ResponseMessages = require("../enums/responseMessages.enum");

const adminController = {};

// DASHBOARD
adminController.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count({
      where: {
        role: "user",
      },
    });

    const totalVendors = await Vendor.count();

    const approvedVendors = await Vendor.count({
      where: {
        status: "approved",
      },
    });

    const pendingVendors = await Vendor.count({
      where: {
        status: "pending",
      },
    });

    return res.success(HttpStatus.OK, true, "Dashboard Data Retrieved", {
      totalUsers,
      totalVendors,
      approvedVendors,
      pendingVendors,
    });
  } catch (error) {
    console.log(error);

    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      ResponseMessages.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

// ALL USERS
adminController.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: "user",
      },
      attributes: {
        exclude: ["password"],
      },
      order: [["id", "DESC"]],
    });

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DATA_RETRIEVED_SUCCESSFULLY,
      users,
    );
  } catch (error) {
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      ResponseMessages.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

// ALL VENDORS
adminController.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      ],

      order: [["id", "DESC"]],
    });

    return res.success(
      HttpStatus.OK,
      true,
      ResponseMessages.DATA_RETRIEVED_SUCCESSFULLY,
      vendors,
    );
  } catch (error) {
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      ResponseMessages.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

// APPROVE / REJECT VENDOR
adminController.updateVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const vendor = await Vendor.findByPk(id);

    if (!vendor) {
      return res.error(HttpStatus.NOT_FOUND, false, "Vendor not found");
    }

    vendor.status = status;

    await vendor.save();

    return res.success(HttpStatus.OK, true, ResponseMessages.UPDATE, vendor);
  } catch (error) {
    return res.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      ResponseMessages.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

module.exports = adminController;
