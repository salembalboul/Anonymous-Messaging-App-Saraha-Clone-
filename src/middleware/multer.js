import multer from "multer"
import fs from "fs"
import path from "path"

export const allowedExtensions= {
   image: ["image/png","image/jpeg","image/gif"],
   video:["video/mp4"],
   pdf:["application/vnd.openxmlformats-officedocument.presentationml.presentation"]
}

export const MulterLocal =({customPath , customExtensions =[]})=>{

const fullPath=`uploads/${customPath}`
  if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive:true})}

const storage = multer.diskStorage({ 
destination: (req, file, cb) => {
cb(null, fullPath); 
},
filename: (req, file, cb) => {
cb(null, Date.now() + path.extname(file.originalname));
}});

const fileFilter = (req, file, cb) => {
if(!customExtensions.includes(file.mimetype)){
 cb(new Error("inValid file type"));
}else{
   cb(null, true);  }
}
const upload = multer({ storage ,fileFilter });
return upload
}

//cloudinary
export const MulterHost =({ customExtensions =[]})=>{

const storage = multer.diskStorage({ 
filename: (req, file, cb) => {
cb(null, Date.now() + path.extname(file.originalname));
}

});

const fileFilter = (req, file, cb) => {
if(!customExtensions.includes(file.mimetype)){
 cb(new Error("inValid file type"));
}else{
   cb(null, true);  }
}
const upload = multer({ storage ,fileFilter });
return upload
}