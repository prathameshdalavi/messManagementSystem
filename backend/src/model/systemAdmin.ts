import mongoose, { Schema } from "mongoose";
const systemAdmin=new Schema({
    sysAdminName:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    phone:{type:Number, required:true},
})
const systemAdminModel = mongoose.model("SystemAdmin", systemAdmin);
export {systemAdminModel};