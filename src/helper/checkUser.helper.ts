import userModel from "model/user.model";

const CheckUser = async (userId: string) => {
    //check data from db
    const userData = await userModel.findOne({ _id: userId });
    return userData;
}
export default CheckUser;